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
          
          <button class="reset-password-btn" @click="goToResetPassword">
            Восстановить пароль
          </button>
          
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

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      loadGameTimeBalance();
    } catch (err) {
      localStorage.removeItem('user');
    }
  }
});

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
  padding: var(--spacing-xl) var(--spacing-md);
}

.profile-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: var(--spacing-xl);
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
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
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
  border-radius: 10px;
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
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: var(--spacing-md);
  transition: all 0.3s ease;
}

.hall-card:hover {
  border-color: var(--c-accent);
  background: rgba(255, 255, 255, 0.08);
}

.hall-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
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
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
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
  border: 2px solid var(--c-accent);
  border-radius: 0;
  padding: var(--spacing-md) var(--spacing-xl);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
  align-self: center;
}

.reset-password-btn:hover,
.logout-btn:hover {
  background: var(--c-accent);
  color: var(--c-bg);
  transform: translateY(-2px);
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
  border: 2px solid var(--c-accent);
  border-radius: 0;
  padding: var(--spacing-md) var(--spacing-xl);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.login-btn:hover {
  background: var(--c-accent);
  color: var(--c-bg);
  transform: translateY(-2px);
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
}
</style>
