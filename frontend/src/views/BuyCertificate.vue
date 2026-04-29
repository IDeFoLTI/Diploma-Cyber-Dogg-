<template>
  <div class="buy-page">
    <SiteHeader />
    <main class="buy-main">
      <div class="container">
        <h1 class="buy-title">Покупка сертификата</h1>
        
        <div v-if="loading" class="loading">Загрузка...</div>
        
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="buy-wrapper">
          <!-- Информация о выбранном сертификате -->
          <div class="cert-summary">
            <h2>Выбранный сертификат</h2>
            <div class="summary-card">
              <div class="summary-row">
                <span class="label">Зал:</span>
                <span class="value">{{ certData.hall }}</span>
              </div>
              <div v-if="certData.timeType" class="summary-row">
                <span class="label">Время суток:</span>
                <span class="value">{{ timeTypeLabel }}</span>
              </div>
              <div v-if="certData.hours" class="summary-row">
                <span class="label">Часы:</span>
                <span class="value">{{ hoursLabel }}</span>
              </div>
              <div v-if="certData.players" class="summary-row">
                <span class="label">Игроков:</span>
                <span class="value">{{ playersLabel }}</span>
              </div>
              <div v-if="certData.package" class="summary-row">
                <span class="label">Пакет:</span>
                <span class="value">{{ packageLabel }}</span>
              </div>
              <div class="summary-row total">
                <span class="label">Итого:</span>
                <span class="value price">{{ price }} ₽</span>
              </div>
            </div>
          </div>

          <!-- Форма оформления -->
          <div class="checkout-form">
            <h2>Оформление заказа</h2>
            
            <form @submit.prevent="submitOrder">
              <div class="form-group">
                <label>Телефон для получения сертификата *</label>
                <input 
                  v-model="form.phone" 
                  type="tel" 
                  placeholder="+7 (XXX) XXX-XX-XX"
                  required
                />
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.agreeTerms" required />
                  <span>Я согласен с условиями использования сертификата</span>
                </label>
              </div>

              <button type="submit" class="submit-btn" :disabled="submitting">
                {{ submitting ? 'Обработка...' : 'Перейти к оплате' }}
              </button>

              <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
              <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            </form>
          </div>

          <!-- Кнопка назад -->
          <button class="back-btn" @click="goBack">← Вернуться к выбору</button>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';

const route = useRoute();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const loading = ref(false);
const error = ref('');
const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const certData = ref({
  hall: '',
  timeType: null,
  hours: null,
  package: null,
  price: 0
});

const form = ref({
  phone: '',
  agreeTerms: false
});

const timeTypeLabel = computed(() => {
  if (!certData.value.timeType) return '-';
  return certData.value.timeType === 'day' ? 'День' : 'Вечер';
});

const hoursLabel = computed(() => {
  if (!certData.value.hours) return '-';
  if (certData.value.hours === '3hours') return '3 часа';
  if (certData.value.hours === '5hours') return '5 часов';
  return certData.value.hours;
});

const playersLabel = computed(() => {
  if (!certData.value.players) return '-';
  if (certData.value.players === '7players') return '7 человек';
  if (certData.value.players === '5players') return '5 человек';
  return certData.value.players;
});

const packageLabel = computed(() => {
  if (!certData.value.package) return '-';
  if (certData.value.package === 'cyberday') return 'Кибер сутки';
  if (certData.value.package === 'night') return 'Ночь';
  return certData.value.package;
});

const price = computed(() => {
  // PlayStation цены
  const playstationPrices = {
    '7players': { '3hours': 1500, '5hours': 2500 },
    '5players': { '3hours': 1200, '5hours': 2000 }
  };
  
  if (certData.value.type === 'playstation' && certData.value.players && certData.value.hours) {
    return playstationPrices[certData.value.players]?.[certData.value.hours] || 0;
  }
  
  // Стандартные цены для пакетов
  if (certData.value.package) {
    if (certData.value.package === 'cyberday') return 1200;
    if (certData.value.package === 'night') return 600;
  }
  
  // Стандартные цены для часов
  const prices = {
    day: { '3hours': 350, '5hours': 550 },
    evening: { '3hours': 450, '5hours': 700 }
  };
  
  if (certData.value.timeType && certData.value.hours) {
    const hoursKey = certData.value.hours;
    const timeKey = certData.value.timeType;
    return prices[timeKey]?.[hoursKey] || 0;
  }
  
  return 0;
});

onMounted(() => {
  const data = route.query;
  
  if (!data.hall) {
    error.value = 'Сертификат не выбран';
    return;
  }
  
  certData.value = {
    hall: data.hall,
    type: data.type || 'standard',
    timeType: data.time || null,
    hours: data.hours || null,
    package: data.package || null,
    players: data.players || null,
    price: 0
  };
  
  if (certData.value.type !== 'playstation' && !certData.value.timeType && !certData.value.hours && !certData.value.package) {
    error.value = 'Не выбраны опции сертификата';
  }
  
  if (certData.value.type === 'playstation' && !certData.value.players && !certData.value.hours) {
    error.value = 'Не выбраны опции PlayStation';
  }
});

function goBack() {
  router.push('/gift-certificates');
}

async function submitOrder() {
  submitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  
  try {
    const orderData = {
      ...certData.value,
      phone: form.value.phone,
      price: price.value,
      // Для PlayStation отправляем players вместо time
      ...(certData.value.type === 'playstation' 
        ? { players: certData.value.players }
        : { time_type: certData.value.timeType }
      )
    };
    
    const response = await fetch(`${API_URL}/api/certificates/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось создать заказ');
    }
    
    successMessage.value = 'Заказ успешно создан! Переходите в личный кабинет для управления сертификатами.';
    
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
    
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
@import url('../styles.css');

.buy-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
}

.buy-main {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.buy-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0 0 var(--spacing-xl) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  line-height: 1.2;
}

.buy-title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.5);
  font-family: "Roboto", sans-serif;
}

.error {
  color: var(--c-danger);
}

.buy-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.cert-summary {
  position: sticky;
  top: 100px;
}

.cert-summary h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: var(--spacing-lg);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 2px solid var(--c-accent);
  border-bottom: none;
}

.summary-row .label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.5);
}

.summary-row .value {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  font-weight: 500;
}

.summary-row .value.price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-accent);
}

.checkout-form h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--c-accent);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--c-accent);
}

.checkbox-group span {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.7);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: var(--c-accent);
  border: none;
  border-radius: 8px;
  color: var(--c-white);
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: var(--spacing-lg);
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: rgba(0, 140, 209, 0.8);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(46, 204, 113, 0.2);
  border: 2px solid #2ecc71;
  border-radius: 8px;
  color: #2ecc71;
  font-family: "Roboto", sans-serif;
  text-align: center;
}

.error-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(225, 30, 36, 0.2);
  border: 2px solid var(--c-danger);
  border-radius: 8px;
  color: var(--c-danger);
  font-family: "Roboto", sans-serif;
  text-align: center;
}

.back-btn {
  margin-top: var(--spacing-xl);
  padding: 12px 24px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--c-accent);
}

@media (max-width: 900px) {
  .buy-wrapper {
    grid-template-columns: 1fr;
  }
  
  .cert-summary {
    position: static;
  }
}
</style>