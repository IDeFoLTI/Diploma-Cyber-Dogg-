<template>
  <div class="cart-page">
    <SiteHeader />

    <div class="container">
      <h1 class="cart-title">Корзина</h1>

      <div v-if="items.length === 0" class="empty-cart">
        <div class="empty-icon"></div>
        <h2>Ваша корзина пуста</h2>
        <p>Перейдите в каталог, чтобы добавить товары или сертификаты</p>
        <router-link to="/catalog" class="catalog-link">
          Перейти в каталог
        </router-link>
      </div>

      <div v-else class="cart-content">
        <!-- Список товаров -->
        <div class="cart-items">
          <div v-for="item in items" :key="item.id" class="cart-item">
            <div class="item-image">
              <img v-if="item.image" :src="resolveImageUrl(item.image)" :alt="itemName(item)" />
              <span v-else class="image-placeholder">{{ itemName(item) }}</span>
            </div>

            <div class="item-info">
              <div class="item-type">{{ itemTypeLabel(item) }}</div>
              <h3 class="item-name">{{ itemName(item) }}</h3>
              <div v-if="item.type === 'certificate'" class="item-details">
                <span v-if="item.hours">{{ formatHours(item.hours) }}</span>
                <span v-if="item.timeType">{{ formatTimeType(item.timeType) }}</span>
                <span v-if="item.package">{{ formatPackage(item.package) }}</span>
                <span v-if="item.players">{{ formatPlayers(item.players) }}</span>
              </div>
            </div>

            <div class="item-quantity" v-if="item.type === 'product'">
              <button class="qty-btn" @click="updateQuantity(item.id, (item.quantity || 1) - 1)">−</button>
              <span class="qty-value">{{ item.quantity || 1 }}</span>
              <button class="qty-btn" @click="updateQuantity(item.id, (item.quantity || 1) + 1)">+</button>
            </div>

            <div class="item-price">{{ itemPrice(item) }} ₽</div>

            <button class="remove-btn" @click="removeItem(item.id)" aria-label="Удалить">
              ✕
            </button>
          </div>
        </div>

        <!-- Итого и оформление -->
        <div class="cart-summary">
          <div class="summary-row">
            <span>Товаров:</span>
            <span>{{ totalCount }}</span>
          </div>
          <div class="summary-row total">
            <span>Итого:</span>
            <span class="total-price">{{ totalPrice }} ₽</span>
          </div>

          <!-- Форма оформления -->
          <div class="checkout-form">
            <div class="form-group">
              <label>Телефон для связи *</label>
              <input v-model="phone" type="tel" placeholder="+7 (XXX) XXX-XX-XX" required />
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreeTerms" required />
                <span>Я согласен с условиями использования</span>
              </label>
            </div>

            <button class="checkout-btn" :disabled="!canCheckout || submitting" @click="submitOrder">
              {{ submitting ? 'Оформление...' : 'Оформить заказ' }}
            </button>

            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          </div>
        </div>
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';
import { useCart } from '../composables/useCart.js';
import { resolveImageUrl } from '../utils/imageUrl.js';

const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const { items, totalCount, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

const phone = ref('');
const agreeTerms = ref(false);
const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const canCheckout = computed(() => phone.value.length >= 6 && agreeTerms.value);

function itemName(item) {
  if (item.type === 'product') return item.name;
  return item.certTitle || item.hall || 'Сертификат';
}

function itemTypeLabel(item) {
  return item.type === 'product' ? 'Товар' : 'Сертификат';
}

function itemPrice(item) {
  return (item.price || 0) * (item.quantity || 1);
}

function formatHours(val) {
  if (val === '3hours') return '3 часа';
  if (val === '5hours') return '5 часов';
  return val;
}

function formatTimeType(val) {
  if (val === 'day') return 'День';
  if (val === 'evening') return 'Вечер';
  return val;
}

function formatPackage(val) {
  if (val === 'cyberday') return 'Кибер сутки';
  if (val === 'night') return 'Ночь';
  return val;
}

function formatPlayers(val) {
  if (val === '7players') return '7 человек';
  if (val === '5players') return '5 человек';
  return val;
}

async function submitOrder() {
  if (!canCheckout.value) return;
  
  // Проверка авторизации
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    errorMessage.value = 'Для оформления заказа необходимо авторизоваться';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    return;
  }
  
  const user = JSON.parse(userStr);
  
  submitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const certificates = items.value.filter((i) => i.type === 'certificate');
    const products = items.value.filter((i) => i.type === 'product');

    // Получаем токен авторизации для отправки в заголовке
    const authHeader = {
      'Content-Type': 'application/json',
      'x-user': encodeURIComponent(JSON.stringify(user))
    };

    // Оформляем сертификаты через старое API (таблица certificate_orders)
    for (const cert of certificates) {
      const orderData = {
        hall: cert.certId,
        type: cert.players ? 'playstation' : 'standard',
        phone: phone.value,
        price: cert.price,
        ...(cert.players
          ? { players: cert.players, hours: cert.hours }
          : { time_type: cert.timeType, hours: cert.hours, package_type: cert.package }
        ),
      };

      const response = await fetch(`${API_URL}/api/certificates/order`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Не удалось создать заказ на сертификат');
      }
    }

    // Оформляем товары через новое API (таблица orders)
    if (products.length > 0) {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({
          phone: phone.value,
          total_price: products.reduce((s, i) => s + i.price * (i.quantity || 1), 0),
          items: products,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Не удалось создать заказ на товары');
      }
    }

    successMessage.value = 'Заказ успешно оформлен! Спасибо за покупку.';
    clearCart();

    setTimeout(() => {
      router.push('/profile');
    }, 2000);
  } catch (err) {
    errorMessage.value = err.message || 'Произошла ошибка при оформлении заказа';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: calc(var(--header-height) + var(--spacing-xl)) var(--spacing-md) var(--spacing-xl);
}

.cart-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0 0 var(--spacing-xl) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Пустая корзина */
.empty-cart {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--c-card-bg);
  border-radius: 16px;
  border: 1px solid var(--c-white-10);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: var(--spacing-md);
}

.empty-cart h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin: 0 0 var(--spacing-sm) 0;
  text-transform: uppercase;
}

.empty-cart p {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-base);
  color: var(--c-white-60);
  margin: 0 0 var(--spacing-lg) 0;
}

.catalog-link {
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--c-accent);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--c-accent);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.catalog-link:hover {
  background: var(--c-accent);
  color: var(--c-white);
}

/* Содержимое корзины */
.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--c-card-bg);
  border: 1px solid var(--c-white-10);
  border-radius: 16px;
  padding: var(--spacing-md);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-white);
  text-transform: uppercase;
  text-align: center;
  padding: var(--spacing-xs);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-type {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin-bottom: 4px;
}

.item-name {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-base);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
}

.item-details {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: 4px;
}

.item-details span {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--c-white-20);
  background: transparent;
  color: var(--c-white);
  font-size: var(--font-lg);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.qty-value {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  min-width: 24px;
  text-align: center;
}

.item-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-accent);
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
}

.remove-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--c-white-20);
  background: transparent;
  color: var(--c-white-60);
  font-size: var(--font-md);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
}

/* Сводка */
.cart-summary {
  background: var(--c-card-bg);
  border: 1px solid var(--c-white-10);
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: sticky;
  top: 100px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white-70);
}

.summary-row.total {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 2px solid var(--c-accent);
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
}

.total-price {
  color: var(--c-accent);
}

/* Форма оформления */
.checkout-form {
  margin-top: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-70);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--c-accent);
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
  flex-shrink: 0;
}

.checkbox-group span {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-70);
}

.checkout-btn {
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
  margin-top: var(--spacing-md);
  transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
  background: rgba(0, 140, 209, 0.8);
  transform: translateY(-2px);
}

.checkout-btn:disabled {
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

/* Адаптивность */
@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 600px) {
  .container {
    padding: calc(var(--header-height) + 80px) var(--spacing-sm) var(--spacing-lg);
  }

  .cart-item {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .item-info {
    flex: 1 1 calc(100% - 80px);
  }

  .item-quantity {
    order: 1;
  }

  .item-price {
    flex: 1;
    text-align: left;
  }

  .remove-btn {
    order: 2;
  }
}
</style>
