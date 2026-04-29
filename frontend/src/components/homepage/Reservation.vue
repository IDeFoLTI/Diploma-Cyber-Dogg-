<template>
  <section id="reservation" class="reservation-section">
    <div class="reservation-container">
      <h2 class="reservation-title">Бронирование</h2>
      
      <div class="reservation-content">
        <!-- Левая часть: Текст -->
        <div class="reservation-info">
          <p class="reservation-text">
            Бронирование возможно по номеру телефона:
          </p>
          <a href="tel:+79101775252" class="reservation-phone">+7 (910) 177-52-52</a>
          <p class="reservation-text">
            по электронной почте:
          </p>
          <a href="mailto:cyber_dogg@gmail.com" class="reservation-email">cyber_dogg@gmail.com</a>
          <p class="reservation-note">
            *При бронировании через форму, вам позвонит представитель Cyber Dogg для уточнения деталей
          </p>
        </div>

        <!-- Правая часть: Форма -->
        <div class="reservation-form-wrapper">
          <form class="reservation-form" @submit.prevent="submitForm">
            <div class="form-group" :class="{ 'has-error': errors.phone }">
              <label for="phone" class="form-label">Номер телефона</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone"
                class="form-input" 
                placeholder="+7 (___) ___-__-__"
                :class="{ 'input-error': errors.phone }"
              />
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>
            <div class="form-group" :class="{ 'has-error': errors.datetime }">
              <label for="datetime" class="form-label">Дата и время</label>
              <input 
                type="datetime-local" 
                id="datetime" 
                v-model="formData.datetime"
                class="form-input"
                :class="{ 'input-error': errors.datetime }"
              />
              <span v-if="errors.datetime" class="error-message">{{ errors.datetime }}</span>
            </div>
            
            <div class="form-row">
              <div class="form-group" :class="{ 'has-error': errors.hall }">
                <label for="hall" class="form-label">Выбор зала</label>
                <select 
                  id="hall" 
                  v-model="formData.hall"
                  class="form-input form-select" 
                  :class="{ 'input-error': errors.hall }"
                >
                  <option value="" disabled>Выберите зал</option>
                  <option value="common_room">Common Room</option>
                  <option value="battle_arena">Battle Arena</option>
                  <option value="vip_room">VIP Room</option>
                  <option value="playstation">PlayStation</option>
                </select>
                <span v-if="errors.hall" class="error-message">{{ errors.hall }}</span>
              </div>
              <div class="form-group" :class="{ 'has-error': errors.players }">
                <label for="players" class="form-label">Количество игроков</label>
                <input 
                  type="number" 
                  id="players" 
                  v-model="formData.players"
                  class="form-input" 
                  placeholder="Количество"
                  min="1"
                  max="20"
                  :class="{ 'input-error': errors.players }"
                />
                <span v-if="errors.players" class="error-message">{{ errors.players }}</span>
              </div>
            </div>
            
            <button type="submit" class="reservation-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Отправка...' : 'Забронировать' }}
            </button>

            <p v-if="submitSuccess" class="success-message">Заявка успешно отправлена! Мы свяжемся с вами.</p>
            <p v-if="submitError" class="error-message-global">{{ submitError }}</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const formData = reactive({
  phone: '',
  datetime: '',
  hall: '',
  players: ''
});

const errors = reactive({
  phone: '',
  datetime: '',
  hall: '',
  players: ''
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

const validateForm = () => {
  let isValid = true;
  
  // Очистка ошибок
  errors.phone = '';
  errors.datetime = '';
  errors.hall = '';
  errors.players = '';
  submitError.value = '';
  
  // Валидация телефона - простая проверка на минимальную длину
  if (!formData.phone.trim()) {
    errors.phone = 'Введите номер телефона';
    isValid = false;
  } else if (formData.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Введите корректный номер телефона';
    isValid = false;
  }
  
  // Валидация даты и времени
  if (!formData.datetime) {
    errors.datetime = 'Выберите дату и время';
    isValid = false;
  } else {
    const selectedDate = new Date(formData.datetime);
    const now = new Date();
    if (selectedDate <= now) {
      errors.datetime = 'Дата и время должны быть в будущем';
      isValid = false;
    }
  }
  
  // Валидация зала
  if (!formData.hall) {
    errors.hall = 'Выберите зал';
    isValid = false;
  } else if (!['common_room', 'battle_arena', 'vip_room', 'playstation'].includes(formData.hall)) {
    errors.hall = 'Выберите корректный зал';
    isValid = false;
  }
  
  // Валидация количества игроков
  if (!formData.players) {
    errors.players = 'Укажите количество игроков';
    isValid = false;
  } else if (formData.players < 1 || formData.players > 20) {
    errors.players = 'Количество игроков должно быть от 1 до 20';
    isValid = false;
  }
  
  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  submitSuccess.value = false;
  submitError.value = '';

  // Преобразование значения зала для email
  const hallLabels = {
    'common_room': 'Common Room',
    'battle_arena': 'Battle Arena',
    'vip_room': 'VIP Room',
    'playstation': 'PlayStation'
  };

  try {
    const response = await fetch(`${API_URL}/api/reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: formData.phone,
        datetime: formData.datetime,
        hall: hallLabels[formData.hall] || formData.hall,
        players: Number(formData.players)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      submitError.value = data.message || 'Ошибка при отправке заявки';
      return;
    }

    submitSuccess.value = true;
    // Очистка формы
    formData.phone = '';
    formData.datetime = '';
    formData.hall = '';
    formData.players = '';

    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
  } catch (err) {
    console.error('Submit error:', err);
    submitError.value = 'Не удалось подключиться к серверу';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.reservation-section {
  padding: var(--spacing-xl) 0;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow-x: hidden;
}

.reservation-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.reservation-title {
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

.reservation-title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
}

.reservation-content {
  display: flex;
  gap: var(--spacing-xl);
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
}

.reservation-info {
  flex: 1;
  min-width: 300px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Адаптивность для экранов 380-700px */
@media (min-width: 380px) and (max-width: 700px) {
  .reservation-info {
    min-width: 100%;
  }

  .reservation-form-wrapper {
    min-width: 100%;
  }

  .reservation-content {
    flex-direction: column;
    align-items: center;
  }
}

.reservation-text {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white-50);
  line-height: 1.6;
  margin: 0;
}

.reservation-phone,
.reservation-email {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-accent);
  line-height: 1.4;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.reservation-phone:hover,
.reservation-email:hover {
  color: var(--c-white);
}

.reservation-note {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-white-50);
  line-height: 1.5;
  margin-top: var(--spacing-sm);
  opacity: 0.7;
}

.reservation-form-wrapper {
  flex: 1;
  min-width: 350px;
  max-width: 600px;
}

.reservation-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-50);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  outline: none;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.form-select {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.form-select option {
  background: var(--c-bg);
  color: var(--c-white);
  padding: 8px;
}

.form-input:focus {
  border-color: var(--c-accent);
  background: rgba(255, 255, 255, 0.03);
}

.form-input::placeholder {
  color: var(--c-white-50);
  opacity: 0.5;
}

.form-input[type="datetime-local"] {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
}

.form-input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.form-input.input-error {
  border-color: var(--c-danger);
  background: rgba(225, 30, 36, 0.05);
}

.form-group.has-error .form-label {
  color: var(--c-danger);
}

.error-message {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-danger);
  margin-top: 4px;
}

.success-message {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: #4caf50;
  text-align: center;
  margin-top: var(--spacing-sm);
}

.error-message-global {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-danger);
  text-align: center;
  margin-top: var(--spacing-sm);
}

.reservation-btn {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  font-weight: 400;
  color: var(--c-white);
  background: transparent;
  border: 2px solid var(--c-accent);
  border-radius: 0;
  padding: var(--spacing-md) var(--spacing-xl);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
  margin-top: var(--spacing-sm);
}

.reservation-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.reservation-btn:hover:not(:disabled) {
  background: var(--c-accent);
  color: var(--c-bg);
  transform: translateY(-2px);
}

.reservation-btn:active {
  transform: translateY(0);
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .reservation-section {
    padding: calc(var(--spacing-xl) * 1.2) 0;
  }

  .reservation-title {
    font-size: clamp(36px, 5vw, 52px);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .reservation-section {
    padding: var(--spacing-lg) 0;
  }

  .reservation-title {
    font-size: clamp(28px, 4vw, 34px);
    margin-bottom: var(--spacing-lg);
  }

  .reservation-content {
    gap: var(--spacing-lg);
  }

  .reservation-info {
    max-width: 100%;
  }

  .reservation-form-wrapper {
    max-width: 100%;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 700px) {
  .reservation-section {
    padding: var(--spacing-md) 0;
  }

  .reservation-title {
    font-size: clamp(22px, 5vw, 26px);
    margin-bottom: var(--spacing-md);
  }

  .reservation-content {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .reservation-info {
    width: 100%;
  }

  .reservation-form-wrapper {
    width: 100%;
  }

  .form-row {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .reservation-phone,
  .reservation-email {
    font-size: var(--font-md);
  }

  .reservation-btn {
    width: 100%;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 380px) {
  .reservation-container {
    padding: 0 var(--spacing-sm);
  }

  .reservation-form-wrapper {
    min-width: auto;
    max-width: 100%;
  }

  .reservation-info {
    min-width: auto;
    max-width: 100%;
  }

  .form-input {
    font-size: var(--font-sm);
    padding: var(--spacing-sm);
  }

  .reservation-btn {
    font-size: var(--font-sm);
    padding: var(--spacing-sm) var(--spacing-md);
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .reservation-section {
    padding: var(--spacing-sm) 0;
  }

  .reservation-title {
    font-size: clamp(20px, 5vw, 22px);
  }

  .reservation-btn {
    font-size: var(--font-sm);
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>