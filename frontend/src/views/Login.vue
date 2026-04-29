<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-card">
        <img class="auth-logo" :src="logoUrl" alt="Cyber Dogg" />
        <h1 class="auth-title">Вход</h1>
        
        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-row" :class="{ 'has-error': errors.username }">
            <label for="username" class="form-label">Логин</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="form-input"
              :class="{ 'input-error': errors.username }"
              placeholder="Ваш логин"
            />
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <div class="form-row" :class="{ 'has-error': errors.password }">
            <label for="password" class="form-label">Пароль</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-input"
              :class="{ 'input-error': errors.password }"
              placeholder="••••••••"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-buttons">
            <div class="button-column">
              <TemplateButton variant="outlined-white" @click="goToRegister" :disabled="isSubmitting">
                Регистрация
              </TemplateButton>
            </div>
            <div class="button-column">
              <TemplateButton variant="outlined-white" @click="handleLogin" :disabled="!canSubmit">
                {{ isSubmitting ? 'Вход...' : 'Вход' }}
              </TemplateButton>
              <button class="forgot-link" @click="goToForgotPassword">
                Восстановление пароля
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SiteFooter from '../components/footer/SiteFooter.vue';
import TemplateButton from '../components/TemplateButton.vue';

const router = useRouter();
const logoUrl = '/img/logo.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const formData = reactive({
  username: '',
  password: ''
});

const errors = reactive({
  username: '',
  password: ''
});

const isSubmitting = ref(false);

const canSubmit = computed(() => {
  return formData.username.trim() && formData.password.trim() && !isSubmitting.value;
});

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.password = '';

  if (!formData.username.trim()) {
    errors.username = 'Введите логин';
    isValid = false;
  }

  if (!formData.password.trim()) {
    errors.password = 'Введите пароль';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (validateForm()) {
    isSubmitting.value = true;
    errors.username = '';
    errors.password = '';

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          errors.password = 'Неверный логин или пароль';
        } else if (data.message) {
          errors.password = data.message;
        } else {
          errors.password = 'Ошибка при входе';
        }
        return;
      }

      // Сохраняем данные пользователя
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Переход в профиль или админ панель
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } catch (err) {
      console.error('Login error:', err);
      errors.password = 'Не удалось подключиться к серверу';
    } finally {
      isSubmitting.value = false;
    }
  }
};

const goToRegister = () => {
  router.push('/register');
};

const goToForgotPassword = () => {
  router.push('/forgot-password');
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
}

.auth-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.auth-card {
  width: 100%;
  max-width: 700px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--c-white);
  border-radius: 15px;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-logo {
  width: clamp(300px, 45vw, 400px);
  height: auto;
  margin-bottom: var(--spacing-md);
}

.auth-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 400;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-xl);
}

.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  width: 100%;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.form-label {
  flex: 0 0 100px;
  font-family: "Bowler", sans-serif;
  font-size: clamp(14px, 1.8vw, 18px);
  color: var(--c-white);
  text-align: right;
}

.form-input {
  flex: 1;
  padding: 4px 0;
  background: transparent;
  border: none;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  transition: border-color 0.3s ease;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-input:focus {
  outline: none;
}

.form-input.input-error {
  border-bottom-color: var(--c-danger);
}

.form-row.has-error .form-label {
  color: var(--c-danger);
}

.error-message {
  width: 100%;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-danger);
  margin-top: 4px;
}

.form-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  justify-content: center;
}

.button-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.form-buttons :deep(.template-btn) {
  width: clamp(140px, 20vw, 200px);
  height: clamp(36px, 5vw, 48px);
}

.forgot-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .auth-card {
    max-width: 550px;
    padding: var(--spacing-lg);
  }

  .auth-logo {
    width: clamp(200px, 40vw, 280px);
  }

  .auth-title {
    font-size: clamp(18px, 2.5vw, 24px);
  }

  .form-label {
    flex: 0 0 80px;
    font-size: clamp(12px, 1.5vw, 16px);
  }

  .form-row {
    gap: var(--spacing-md);
  }

  .button-column {
    gap: var(--spacing-xs);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .auth-card {
    max-width: 100%;
    padding: var(--spacing-md);
    border-radius: 10px;
  }

  .auth-logo {
    width: clamp(180px, 50vw, 240px);
    margin-bottom: var(--spacing-md);
  }

  .auth-title {
    font-size: clamp(18px, 4vw, 22px);
    margin-bottom: var(--spacing-lg);
  }

  .form-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
    padding-bottom: var(--spacing-sm);
  }

  .form-label {
    text-align: left;
    width: 100%;
    flex: none;
    font-size: clamp(13px, 3vw, 16px);
  }

  .form-input {
    font-size: clamp(14px, 3vw, 16px);
    padding: 8px 0;
  }

  .form-buttons {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
  }

  .button-column {
    width: 100%;
    align-items: center;
  }

  .button-column :deep(.template-btn) {
    width: 100%;
    max-width: 280px;
    height: clamp(42px, 8vw, 50px);
  }

  .forgot-link {
    width: 100%;
    text-align: center;
    font-size: clamp(12px, 3vw, 14px);
  }

  .auth-wrapper {
    padding: var(--spacing-md);
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .auth-card {
    padding: var(--spacing-sm);
    border-radius: 8px;
  }

  .auth-logo {
    width: clamp(150px, 45vw, 200px);
  }

  .auth-title {
    font-size: clamp(16px, 4vw, 20px);
    letter-spacing: 0.08em;
  }

  .form-label {
    font-size: clamp(12px, 3vw, 14px);
  }

  .form-input {
    font-size: clamp(13px, 3vw, 15px);
  }

  .button-column :deep(.template-btn) {
    height: clamp(40px, 8vw, 46px);
  }

  .forgot-link {
    font-size: clamp(11px, 3vw, 13px);
  }

  .auth-wrapper {
    padding: var(--spacing-sm);
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .auth-card {
    padding: var(--spacing-xs);
  }

  .auth-logo {
    width: clamp(130px, 40vw, 180px);
  }

  .auth-title {
    font-size: clamp(14px, 3.5vw, 18px);
  }

  .form-label {
    font-size: clamp(11px, 2.5vw, 13px);
  }

  .button-column :deep(.template-btn) {
    height: clamp(38px, 8vw, 44px);
  }

  .forgot-link {
    font-size: clamp(10px, 2.5vw, 12px);
  }
}
</style>
