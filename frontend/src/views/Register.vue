<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-card">
        <img class="auth-logo" :src="logoUrl" alt="Cyber Dogg" />
        <h1 class="auth-title">Регистрация</h1>
        
        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="form-row" :class="{ 'has-error': errors.email }">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :class="{ 'input-error': errors.email }"
              placeholder="example@email.com"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

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

          <div class="form-row" :class="{ 'has-error': errors.phone }">
            <label for="phone" class="form-label">Телефон</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="form-input"
              :class="{ 'input-error': errors.phone }"
              placeholder="+7 (___) ___-__-__"
            />
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
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
            <TemplateButton variant="outlined-white" @click="goToLogin">
              Вход
            </TemplateButton>
            <TemplateButton variant="outlined-white" @click="handleRegister" :disabled="!canSubmit">
              Регистрация
            </TemplateButton>
          </div>
        </form>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import SiteFooter from '../components/footer/SiteFooter.vue';
import TemplateButton from '../components/TemplateButton.vue';

const router = useRouter();
const logoUrl = '/img/logo.svg';

const formData = reactive({
  email: '',
  username: '',
  phone: '',
  password: ''
});

const errors = reactive({
  email: '',
  username: '',
  phone: '',
  password: ''
});

const canSubmit = computed(() => {
  return formData.email.trim() && formData.username.trim() && formData.phone.trim() && formData.password.trim();
});

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.username = '';
  errors.phone = '';
  errors.password = '';

  if (!formData.email.trim()) {
    errors.email = 'Введите email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Введите корректный email';
    isValid = false;
  }

  if (!formData.username.trim()) {
    errors.username = 'Введите логин';
    isValid = false;
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Введите номер телефона';
    isValid = false;
  } else if (formData.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Введите корректный номер телефона';
    isValid = false;
  }

  if (!formData.password.trim()) {
    errors.password = 'Введите пароль';
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов';
    isValid = false;
  }

  return isValid;
};

const handleRegister = () => {
  if (validateForm()) {
    console.log('Регистрация:', formData);
    // TODO: Отправка данных на сервер
    router.push('/profile');
  }
};

const goToLogin = () => {
  router.push('/login');
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

.form-buttons :deep(.template-btn) {
  width: clamp(140px, 20vw, 200px);
  height: clamp(36px, 5vw, 48px);
}

.form-buttons :deep(.template-btn--primary) {
  background: var(--c-white);
}

.form-buttons :deep(.template-btn--primary .template-btn__text) {
  color: var(--c-bg);
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

  .form-buttons :deep(.template-btn) {
    width: 100%;
    max-width: 280px;
    height: clamp(42px, 8vw, 50px);
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

  .form-buttons :deep(.template-btn) {
    height: clamp(40px, 8vw, 46px);
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

  .form-buttons :deep(.template-btn) {
    height: clamp(38px, 8vw, 44px);
  }
}
</style>
