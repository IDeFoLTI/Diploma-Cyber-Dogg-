<template>
  <div class="profile-page">
    <SiteHeader />
    
    <div class="container">
      <div class="profile-card">
        <h1 class="profile-title">Личный кабинет</h1>
        
        <div v-if="user" class="profile-content">
          <!-- Информация о пользователе -->
          <div class="profile-info">
            <div class="info-row">
              <span class="info-label">Логин:</span>
              <span class="info-value">{{ user.username }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ user.email }}</span>
            </div>
            <div class="info-row" v-if="user.phone">
              <span class="info-label">Телефон:</span>
              <span class="info-value">{{ user.phone }}</span>
            </div>
            <button class="reset-password-btn" @click="goToResetPassword">
              Восстановить пароль
            </button>
          </div>
          
          <!-- Баланс игрового времени -->
          <div class="game-time-section">
            <h2 class="section-title">Игровое время</h2>
            <div v-if="loadingTime" class="time-loading">Загрузка...</div>
            <div v-else-if="timeError" class="time-error">{{ timeError }}</div>
            <div v-else class="time-balance">
              <!-- Common Room -->
              <div class="hall-card">
                <div class="hall-title">Common Room</div>
                <div class="hall-time">
                  <div class="time-item">
                    <span class="time-label">Дневное:</span>
                    <span class="time-value">{{ balance.common_room_day }} ч</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">Ночное:</span>
                    <span class="time-value">{{ balance.common_room_night }} ч</span>
                  </div>
                </div>
              </div>
              
              <!-- Battle Arena -->
              <div class="hall-card">
                <div class="hall-title">Battle Arena</div>
                <div class="hall-time">
                  <div class="time-item">
                    <span class="time-label">Дневное:</span>
                    <span class="time-value">{{ balance.battle_arena_day }} ч</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">Ночное:</span>
                    <span class="time-value">{{ balance.battle_arena_night }} ч</span>
                  </div>
                </div>
              </div>
              
              <!-- VIP Room -->
              <div class="hall-card">
                <div class="hall-title">VIP Room</div>
                <div class="hall-time">
                  <div class="time-item">
                    <span class="time-label">Дневное:</span>
                    <span class="time-value">{{ balance.vip_room_day }} ч</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">Ночное:</span>
                    <span class="time-value">{{ balance.vip_room_night }} ч</span>
                  </div>
                </div>
              </div>
              
              <!-- PlayStation -->
              <div class="hall-card">
                <div class="hall-title">PlayStation</div>
                <div class="hall-time">
                  <div class="time-item">
                    <span class="time-label">До 5 человек:</span>
                    <span class="time-value">{{ balance.playstation_under_5 }} ч</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">До 7 человек:</span>
                    <span class="time-value">{{ balance.playstation_under_7 }} ч</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Заказы товаров -->
          <div class="orders-section" v-if="user.phone">
            <h2 class="section-title">Мои заказы</h2>
            <div v-if="loadingOrders" class="time-loading">Загрузка...</div>
            <div v-else-if="ordersError" class="time-error">{{ ordersError }}</div>
            <div v-else-if="orders.length === 0" class="empty-orders">
              У вас пока нет заказов
            </div>
            <div v-else class="orders-list">
              <div v-for="order in orders" :key="order.id" class="order-card">
                <div class="order-header">
                  <span class="order-id">Заказ #{{ order.id }}</span>
                  <span :class="['order-status', 'status-' + order.status]">
                    {{ formatOrderStatus(order.status) }}
                  </span>
                </div>
                <div class="order-items">
                  <div v-for="(item, idx) in order.items" :key="idx" class="order-item-row">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-qty">x{{ item.quantity }}</span>
                    <span class="item-price">{{ item.price }} ₽</span>
                  </div>
                </div>
                <div class="order-footer">
                  <span class="order-date">{{ formatDate(order.created_at) }}</span>
                  <span class="order-total">Итого: {{ order.total_price }} ₽</span>
                </div>
                <div v-if="order.certificatePromoCode" class="promo-code-row">
                  <span class="promo-code-label">Код сертификата:</span>
                  <span class="promo-code-value">{{ order.certificatePromoCode }}</span>
                </div>
              </div>
            </div>
          </div>

          <button class="logout-btn" @click="handleLogout">
            Выйти
          </button>
        </div>
        
        <div v-else class="not-authenticated">
          <p>Вы не авторизованы</p>
          <button class="login-btn" @click="goToLogin">
            Войти
          </button>
        </div>
      </div>
    </div>
    
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const router = useRouter();
const user = ref(null);
const balance = ref({
  common_room_day: 0,
  common_room_night: 0,
  battle_arena_day: 0,
  battle_arena_night: 0,
  vip_room_day: 0,
  vip_room_night: 0,
  playstation_under_5: 0,
  playstation_under_7: 0,
});
const loadingTime = ref(false);
const timeError = ref('');

const orders = ref([]);
const loadingOrders = ref(false);
const ordersError = ref('');

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      loadGameTimeBalance();
      if (user.value.phone) {
        loadOrders();
      }
    } catch (err) {
      localStorage.removeItem('user');
    }
  }
});

function normalizeCertificateOrder(order) {
  const hallNames = {
    standart: 'Common Room',
    battle: 'Battle Arena',
    vip: 'VIP Room',
    playstation: 'PlayStation',
  };

  const typeLabel = hallNames[order.hall] || 'Сертификат';
  const details = [];

  if (order.time_type) {
    details.push(order.time_type === 'night' ? 'Ночное' : 'Дневное');
  }
  if (order.hours) {
    details.push(order.hours.replace(/hours$/, 'ч')); 
  }
  if (order.package_type) {
    details.push(order.package_type);
  }

  return {
    id: `cert-${order.id}`,
    created_at: order.created_at,
    status: order.status,
    total_price: order.price,
    certificatePromoCode: order.promo_code,
    certificateInfo: {
      title: `${typeLabel} ${details.length ? `(${details.join(', ')})` : ''}`.trim(),
      hall: typeLabel,
      packageType: order.package_type,
      timeType: order.time_type,
      hours: order.hours,
    },
    items: [
      {
        name: `${typeLabel} сертификат${details.length ? ` — ${details.join(', ')}` : ''}`,
        quantity: 1,
        price: order.price,
      }
    ]
  };
}

async function loadGameTimeBalance() {
  if (!user.value) return;
  
  loadingTime.value = true;
  timeError.value = '';
  
  try {
    const response = await fetch(`${API_URL}/api/game-time/balance`, {
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(user.value))
      }
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить баланс');
    }
    
    const data = await response.json();
    balance.value = data.balance;
  } catch (err) {
    timeError.value = err.message;
  } finally {
    loadingTime.value = false;
  }
}

const handleLogout = () => {
  localStorage.removeItem('user');
  user.value = null;
  router.push('/');
};

const goToLogin = () => {
  router.push('/login');
};

async function loadOrders() {
  if (!user.value) return;
  loadingOrders.value = true;
  ordersError.value = '';
  try {
    const [ordersResponse, certificatesResponse] = await Promise.all([
      fetch(`${API_URL}/api/orders/my`, {
        headers: { 'X-User': encodeURIComponent(JSON.stringify(user.value)) }
      }),
      fetch(`${API_URL}/api/certificates/my`, {
        headers: { 'X-User': encodeURIComponent(JSON.stringify(user.value)) }
      })
    ]);

    if (!ordersResponse.ok) {
      throw new Error('Не удалось загрузить заказы');
    }
    if (!certificatesResponse.ok) {
      throw new Error('Не удалось загрузить сертификаты');
    }

    const [ordersData, certificatesData] = await Promise.all([
      ordersResponse.json(),
      certificatesResponse.json()
    ]);

    const normalOrders = ordersData.orders || [];
    const certificateOrders = (certificatesData.orders || []).map(normalizeCertificateOrder);
    orders.value = [...normalOrders, ...certificateOrders].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  } catch (err) {
    ordersError.value = err.message;
  } finally {
    loadingOrders.value = false;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatOrderStatus(status) {
  const map = {
    pending: 'Ожидает оплаты',
    paid: 'Оплачен',
    ready: 'Готов к выдаче',
    completed: 'Выдан',
    used: 'Использован',
    cancelled: 'Отменён'
  };
  return map[status] || status;
}

const goToResetPassword = () => {
  router.push('/forgot-password');
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
}

.container {
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: calc(var(--header-height) + var(--spacing-xl)) var(--spacing-md) var(--spacing-xl);
}

.profile-card {
  background: var(--c-bg);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: var(--spacing-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.profile-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0 0 var(--spacing-xl) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.profile-title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  margin: 20px auto 0;
  border-radius: 2px;
  transition: background 0.3s ease, width 0.3s ease;
}

.profile-card:hover .profile-title::after {
  background: var(--c-accent);
  width: clamp(100px, 15vw, 160px);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.info-row:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 140, 209, 0.3);
}

.info-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white-50);
}

.info-value {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  font-weight: 500;
}

/* Баланс игрового времени */
.game-time-section {
  margin-top: var(--spacing-md);
}

.section-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.time-loading, .time-error {
  text-align: center;
  padding: var(--spacing-lg);
  color: rgba(255, 255, 255, 0.5);
}

.time-error {
  color: var(--c-danger);
}

.time-balance {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.hall-card {
  background: var(--c-bg);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hall-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease;
}

.hall-card:hover {
  border-color: rgba(0, 140, 209, 0.4);
  box-shadow: 0 8px 24px rgba(0, 140, 209, 0.15);
}

.hall-card:hover::before {
  background: var(--c-accent);
}

.hall-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 12px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
}

.hall-time {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.time-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.5);
}

.time-value {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  font-weight: 600;
}

.hall-time {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.time-item:hover {
  background: rgba(0, 140, 209, 0.1);
  border-color: rgba(0, 140, 209, 0.3);
}

.time-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.5);
}

.time-value {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-accent);
  font-weight: 500;
}

.reset-password-btn,
.logout-btn {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  font-weight: 400;
  color: var(--c-white);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0;
  padding: var(--spacing-md) var(--spacing-xl);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-password-btn {
  width: 100%;
  margin-top: var(--spacing-md);
}

.reset-password-btn:hover,
.logout-btn:hover {
  background: rgba(0, 140, 209, 0.15);
  border-color: var(--c-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 140, 209, 0.2);
}

.reset-password-btn:active,
.logout-btn:active {
  transform: translateY(0);
}

.logout-btn {
  margin-top: var(--spacing-lg);
}

.not-authenticated {
  text-align: center;
  padding: var(--spacing-xl);
}

.not-authenticated p {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white-50);
  margin-bottom: var(--spacing-lg);
}

.login-btn {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  font-weight: 400;
  color: var(--c-white);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0;
  padding: var(--spacing-md) var(--spacing-xl);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: rgba(0, 140, 209, 0.15);
  border-color: var(--c-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 140, 209, 0.2);
}

/* Заказы */
.orders-section {
  margin-top: var(--spacing-md);
}

.empty-orders {
  text-align: center;
  padding: var(--spacing-lg);
  color: rgba(255, 255, 255, 0.4);
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
}

.order-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-id {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.status-paid {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-ready {
  background: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.status-completed {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.status-used {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.status-cancelled {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.order-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.order-item-row .item-name {
  flex: 1;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white);
}

.order-item-row .item-qty {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
  margin: 0 var(--spacing-md);
}

.order-item-row .item-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-accent);
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.promo-code-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.promo-code-label {
  color: var(--c-white-80);
  font-size: var(--font-sm);
}

.promo-code-value {
  color: var(--c-accent);
  font-weight: 600;
}

.order-date {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-white-50);
}

.order-total {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  color: var(--c-accent);
}

/* Адаптивность */
@media (max-width: 600px) {
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .profile-card {
    padding: var(--spacing-md);
  }

  .hall-time {
    grid-template-columns: 1fr;
  }

  .time-item {
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .container {
    padding: calc(var(--header-height) + var(--spacing-md)) var(--spacing-sm);
  }

  .profile-card {
    padding: var(--spacing-md);
  }

  .profile-title {
    font-size: clamp(24px, 5vw, 32px);
  }
}
</style>
