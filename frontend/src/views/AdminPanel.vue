<template>
  <div class="admin-page">
    <SiteHeader />

    <div class="admin-container">
      <div class="header-row">
        <h1>Админ-панель</h1>
        <button class="logout-btn" @click="logout">Выйти</button>
      </div>

      <!-- Панель управления -->
      <div class="admin-actions">
        <button class="action-btn" @click="showAddTimeModal = true">
          <span class="btn-icon">⏱️</span>
          Добавить игровое время
        </button>
        <button class="action-btn" @click="showActivateCertModal = true">
          <span class="btn-icon">🎫</span>
          Активировать сертификат
        </button>
        <button class="action-btn" @click="showAddUserModal = true">
          <span class="btn-icon">👤</span>
          Добавить аккаунт
        </button>
        <button class="action-btn delete" @click="showDeleteUserModal = true">
          <span class="btn-icon">🗑️</span>
          Удалить аккаунт
        </button>
      </div>

      <!-- Вкладки -->
      <div class="admin-tabs">
        <button 
          :class="['tab', { active: activeTab === 'users' }]"
          @click="activeTab = 'users'"
        >
          Пользователи
        </button>
      </div>

      <!-- Секция пользователей -->
      <div v-if="activeTab === 'users'" class="admin-section">
        <h2>Все пользователи</h2>
        
        <div v-if="loading" class="loading">Загрузка...</div>
        
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else-if="users.length === 0" class="empty">
          Нет пользователей
        </div>
        
        <div v-else class="users-list">
          <div v-for="user in users" :key="user.id" class="user-card">
            <div class="user-info">
              <div class="field">
                <span class="label">ID:</span>
                <span class="value">{{ user.id }}</span>
              </div>
              <div class="field">
                <span class="label">Имя:</span>
                <span class="value">{{ user.username }}</span>
              </div>
              <div class="field">
                <span class="label">Телефон:</span>
                <span class="value">{{ user.phone || '-' }}</span>
              </div>
              <div class="field">
                <span class="label">Роль:</span>
                <span :class="['value', 'role', `role-${user.role}`]">
                  {{ user.role === 'admin' ? 'Администратор' : 'Пользователь' }}
                </span>
              </div>
            </div>
            <button class="add-time-btn" @click="showAddTimeModal = true">
              Добавить время
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка: Добавить игровое время -->
    <div v-if="showAddTimeModal" class="modal-overlay" @click="showAddTimeModal = false">
      <div class="modal" @click.stop>
        <h3>Добавить игровое время</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Телефон пользователя</label>
            <input v-model="addTimeForm.phone" type="text" placeholder="+7 (XXX) XXX-XX-XX" />
          </div>
          <div class="form-group">
            <label>Зал</label>
            <select v-model="addTimeForm.hall">
              <option value="common_room_day">Common Room - Дневное</option>
              <option value="common_room_night">Common Room - Ночное</option>
              <option value="battle_arena_day">Battle Arena - Дневное</option>
              <option value="battle_arena_night">Battle Arena - Ночное</option>
              <option value="vip_room_day">VIP Room - Дневное</option>
              <option value="vip_room_night">VIP Room - Ночное</option>
              <option value="playstation_under_5">PlayStation - До 5 человек</option>
              <option value="playstation_under_7">PlayStation - До 7 человек</option>
            </select>
          </div>
          <div class="form-group">
            <label>Часы</label>
            <input v-model.number="addTimeForm.hours" type="number" placeholder="0" min="0" step="0.5" />
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showAddTimeModal = false">Отмена</button>
            <button class="modal-confirm" @click="addTimeToUser">Добавить</button>
          </div>
          <div v-if="addTimeError" class="modal-error">{{ addTimeError }}</div>
          <div v-if="addTimeSuccess" class="modal-success">{{ addTimeSuccess }}</div>
        </div>
      </div>
    </div>

    <!-- Модалка: Активировать сертификат -->
    <div v-if="showActivateCertModal" class="modal-overlay" @click="showActivateCertModal = false">
      <div class="modal" @click.stop>
        <h3>Активировать сертификат</h3>
        <p class="modal-desc">Функция в разработке</p>
        <button class="modal-close" @click="showActivateCertModal = false">Закрыть</button>
      </div>
    </div>

    <!-- Модалка: Добавить пользователя -->
    <div v-if="showAddUserModal" class="modal-overlay" @click="showAddUserModal = false">
      <div class="modal" @click.stop>
        <h3>Добавить аккаунт</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Имя пользователя *</label>
            <input v-model="addUserForm.username" type="text" placeholder="Введите имя" />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="addUserForm.email" type="email" placeholder="example@email.com" />
          </div>
          <div class="form-group">
            <label>Телефон</label>
            <input v-model="addUserForm.phone" type="text" placeholder="+7 (XXX) XXX-XX-XX" />
          </div>
          <div class="form-group">
            <label>Пароль *</label>
            <input v-model="addUserForm.password" type="password" placeholder="Минимум 6 символов" />
          </div>
          <div class="form-group">
            <label>Роль</label>
            <select v-model="addUserForm.role">
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showAddUserModal = false">Отмена</button>
            <button class="modal-confirm" @click="addUser">Добавить</button>
          </div>
          <div v-if="addUserError" class="modal-error">{{ addUserError }}</div>
          <div v-if="addUserSuccess" class="modal-success">{{ addUserSuccess }}</div>
        </div>
      </div>
    </div>

    <!-- Модалка: Удалить пользователя -->
    <div v-if="showDeleteUserModal" class="modal-overlay" @click="showDeleteUserModal = false">
      <div class="modal" @click.stop>
        <h3>Удалить аккаунт</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>ID пользователя</label>
            <input v-model="deleteUserForm.userId" type="number" placeholder="Введите ID" />
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showDeleteUserModal = false">Отмена</button>
            <button class="modal-confirm delete" @click="deleteUser">Удалить</button>
          </div>
          <div v-if="deleteUserError" class="modal-error">{{ deleteUserError }}</div>
          <div v-if="deleteUserSuccess" class="modal-success">{{ deleteUserSuccess }}</div>
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
const activeTab = ref('users');
const users = ref([]);
const loading = ref(false);
const error = ref('');

// Модалки
const showAddTimeModal = ref(false);
const showActivateCertModal = ref(false);
const showAddUserModal = ref(false);
const showDeleteUserModal = ref(false);

// Форма добавления времени
const addTimeForm = ref({
  phone: '',
  hall: 'common_room_day',
  hours: 0
});
const addTimeError = ref('');
const addTimeSuccess = ref('');

// Форма добавления пользователя
const addUserForm = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  role: 'user'
});
const addUserError = ref('');
const addUserSuccess = ref('');

// Форма удаления пользователя
const deleteUserForm = ref({
  userId: ''
});
const deleteUserError = ref('');
const deleteUserSuccess = ref('');

// Проверка доступа
onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    router.push('/login');
    return;
  }

  const user = JSON.parse(userStr);
  if (user.role !== 'admin') {
    router.push('/profile');
    return;
  }

  loadUsers();
});

async function loadUsers() {
  loading.value = true;
  error.value = '';

  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/users`, {
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(user))
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        router.push('/login');
        return;
      }
      throw new Error('Не удалось загрузить пользователей');
    }

    const data = await response.json();
    users.value = data.users || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
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

async function addTimeToUser() {
  addTimeError.value = '';
  addTimeSuccess.value = '';
  
  if (!addTimeForm.value.phone || !addTimeForm.value.phone.trim()) {
    addTimeError.value = 'Введите телефон пользователя';
    return;
  }
  
  if (addTimeForm.value.hours <= 0) {
    addTimeError.value = 'Укажите время больше 0';
    return;
  }
  
  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/game-time/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify({
        phone: addTimeForm.value.phone.trim(),
        hall: addTimeForm.value.hall,
        hours: addTimeForm.value.hours
      })
    });

    if (!response.ok) {
      throw new Error('Не удалось добавить время');
    }

    const data = await response.json();
    addTimeSuccess.value = `Время добавлено!`;
    
    // Сброс формы через 2 секунды
    setTimeout(() => {
      addTimeForm.value = { phone: '', hall: 'common_room_day', hours: 0 };
      addTimeSuccess.value = '';
      showAddTimeModal.value = false;
    }, 2000);
  } catch (err) {
    addTimeError.value = err.message;
  }
}

function logout() {
  localStorage.removeItem('user');
  router.push('/');
}

async function addUser() {
  addUserError.value = '';
  addUserSuccess.value = '';
  
  if (!addUserForm.value.username || !addUserForm.value.email || !addUserForm.value.password) {
    addUserError.value = 'Заполните все обязательные поля';
    return;
  }
  
  if (addUserForm.value.password.length < 6) {
    addUserError.value = 'Пароль должен быть минимум 6 символов';
    return;
  }
  
  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify({
        username: addUserForm.value.username,
        email: addUserForm.value.email,
        phone: addUserForm.value.phone || null,
        password: addUserForm.value.password,
        role: addUserForm.value.role
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Не удалось добавить пользователя');
    }

    addUserSuccess.value = `Пользователь добавлен!`;
    
    setTimeout(() => {
      addUserForm.value = { username: '', email: '', phone: '', password: '', role: 'user' };
      addUserSuccess.value = '';
      showAddUserModal.value = false;
      loadUsers();
    }, 2000);
  } catch (err) {
    addUserError.value = err.message;
  }
}

async function deleteUser() {
  deleteUserError.value = '';
  deleteUserSuccess.value = '';
  
  if (!deleteUserForm.value.userId) {
    deleteUserError.value = 'Введите ID пользователя';
    return;
  }
  
  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/users/${deleteUserForm.value.userId}`, {
      method: 'DELETE',
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Не удалось удалить пользователя');
    }

    deleteUserSuccess.value = `Пользователь удален!`;
    
    setTimeout(() => {
      deleteUserForm.value = { userId: '' };
      deleteUserSuccess.value = '';
      showDeleteUserModal.value = false;
      loadUsers();
    }, 2000);
  } catch (err) {
    deleteUserError.value = err.message;
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px var(--spacing-md) var(--spacing-xl);
  width: 100%;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

h1 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}

.logout-btn {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: var(--c-white);
  cursor: pointer;
  border-radius: 8px;
  font-size: var(--font-sm);
  font-weight: 500;
  font-family: "Roboto", sans-serif;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: var(--c-danger);
  border-color: var(--c-danger);
}

/* Панель действий */
.admin-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: var(--c-white);
  cursor: pointer;
  border-radius: 16px;
  font-size: var(--font-md);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  min-height: 100px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--c-accent);
  transform: translateY(-4px);
}

.action-btn.delete:hover {
  border-color: var(--c-danger);
  background: rgba(225, 30, 36, 0.1);
}

.btn-icon {
  font-size: 2rem;
}

/* Вкладки */
.admin-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.tab {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: var(--c-white);
  cursor: pointer;
  border-radius: 8px;
  font-size: var(--font-md);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--c-accent);
}

.tab.active {
  background: var(--c-accent);
  border-color: var(--c-accent);
}

/* Секция */
.admin-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-section h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.loading, .empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.4);
  font-family: "Roboto", sans-serif;
}

.error {
  color: var(--c-danger);
  padding: var(--spacing-md);
  text-align: center;
  background: rgba(225, 30, 36, 0.1);
  border-radius: 8px;
  font-family: "Roboto", sans-serif;
}

/* Списки */
.users-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: var(--spacing-md);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.user-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.user-info {
  flex: 1;
}

.field {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
}

.field:last-child {
  margin-bottom: 0;
}

.label {
  color: rgba(255, 255, 255, 0.4);
  min-width: 120px;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
}

.value {
  color: var(--c-white);
  font-weight: 500;
  font-family: "Roboto", sans-serif;
}

.role {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.role-user {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.role-admin {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.add-time-btn {
  padding: 10px 20px;
  background: rgba(0, 140, 209, 0.2);
  border: 2px solid rgba(0, 140, 209, 0.4);
  color: var(--c-accent);
  cursor: pointer;
  border-radius: 8px;
  font-size: var(--font-sm);
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-time-btn:hover {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-white);
}

select.form-group input,
select {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
}

select:focus {
  outline: none;
  border-color: var(--c-accent);
}

select option {
  background: var(--c-bg);
  color: var(--c-white);
  padding: 12px;
}

/* Модалки */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal {
  background: var(--c-bg);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: var(--spacing-xl);
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal h3 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
}

.modal-desc {
  color: rgba(255, 255, 255, 0.5);
  font-family: "Roboto", sans-serif;
  margin-bottom: var(--spacing-lg);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white);
  text-transform: uppercase;
}

.form-group input {
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
}

.form-group input:focus {
  outline: none;
  border-color: var(--c-accent);
}

.modal-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.modal-confirm {
  flex: 1;
  padding: 12px;
  background: var(--c-accent);
  border: none;
  color: var(--c-white);
  cursor: pointer;
  border-radius: 8px;
  font-size: var(--font-md);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.modal-confirm:hover {
  background: rgba(0, 140, 209, 0.8);
}

.modal-confirm.delete {
  background: var(--c-danger);
}

.modal-confirm.delete:hover {
  background: rgba(225, 30, 36, 0.8);
}

.modal-cancel {
  flex: 1;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: var(--c-white);
  cursor: pointer;
  border-radius: 8px;
  font-size: var(--font-md);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.modal-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-error {
  color: var(--c-danger);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  text-align: center;
  margin-top: var(--spacing-sm);
}

.modal-success {
  color: #2ecc71;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  text-align: center;
  margin-top: var(--spacing-sm);
}

.modal-close {
  padding: 12px 32px;
  background: var(--c-accent);
  border: none;
  color: var(--c-white);
  cursor: pointer;
  border-radius: 8px;
  font-size: var(--font-md);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 140, 209, 0.8);
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .logout-btn {
    width: 100%;
  }

  .admin-actions {
    grid-template-columns: 1fr;
  }

  .action-btn {
    min-height: 90px;
  }

  .admin-tabs {
    flex-direction: column;
  }

  .tab {
    text-align: center;
  }

  .user-card {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .modal {
    padding: var(--spacing-lg);
    max-width: 100%;
  }

  .modal h3 {
    font-size: var(--font-lg);
  }
}

@media (max-width: 480px) {
  .admin-actions {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .action-btn {
    padding: var(--spacing-md);
    min-height: 80px;
    font-size: var(--font-sm);
  }

  .btn-icon {
    font-size: 1.5rem;
  }

  .modal {
    padding: var(--spacing-md);
  }

  .modal h3 {
    font-size: var(--font-md);
    margin-bottom: var(--spacing-md);
  }

  .modal-buttons {
    flex-direction: column;
  }

  .modal-confirm,
  .modal-cancel {
    width: 100%;
  }
}
</style>
