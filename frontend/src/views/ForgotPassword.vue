<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-card">
        <img class="auth-logo" :src="logoUrl" alt="Cyber Dogg" />
        <h1 class="auth-title">Восстановление пароля</h1>
        
        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="form-row" :class="{ 'has-error': errors.email }">
            <label for="email" class="form-label">Почта</label>
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

          <div class="form-row" :class="{ 'has-error': errors.code }">
            <label for="code" class="form-label">Код</label>
            <div class="code-input-wrapper">
              <input
                id="code"
                v-model="formData.code"
                type="text"
                class="form-input"
                :class="{ 'input-error': errors.code }"
                placeholder="0000"
              />
              <button type="button" class="send-code-btn" @click="sendCode" :disabled="!formData.email.trim()">
                Отправить код
              </button>
            </div>
            <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
          </div>

          <div class="form-buttons">
            <TemplateButton variant="outlined-white" @click="handleSubmit" :disabled="!canSubmit">
              Восстановить
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
  code: ''
});

const errors = reactive({
  email: '',
  code: ''
});

const canSubmit = computed(() => {
  return formData.email.trim() && formData.code.trim();
});

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.code = '';

  if (!formData.email.trim()) {
    errors.email = 'Введите email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Введите корректный email';
    isValid = false;
  }

  if (!formData.code.trim()) {
    errors.code = 'Введите код из письма';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    console.log('Восстановление:', formData);
    router.push('/reset-password');
  }
};

const sendCode = () => {
  if (formData.email.trim()) {
    console.log('Отправка кода на почту:', formData.email);
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

.code-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.code-input-wrapper .form-input {
  flex: 1;
  max-width: 150px;
  text-align: left;
}

.send-code-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.8);
  font-family: "Roboto", sans-serif;
  font-size: clamp(11px, 1.2vw, 13px);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-left: auto;
}

.send-code-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.7);
  color: var(--c-white);
}

.form-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  justify-content: center;
}

.form-buttons :deep(.template-btn) {
  width: clamp(180px, 25vw, 250px);
  height: clamp(36px, 5vw, 48px);
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

  .code-input-wrapper {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .code-input-wrapper .form-input {
    width: 100%;
    text-align: left;
    letter-spacing: normal;
  }

  .send-code-btn {
    font-size: clamp(12px, 2.5vw, 14px);
    padding: 8px 16px;
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

  .send-code-btn {
    font-size: clamp(11px, 2.5vw, 13px);
    padding: 6px 12px;
  }

  .button-column :deep(.template-btn) {
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

  .send-code-btn {
    font-size: clamp(10px, 2vw, 12px);
    padding: 5px 10px;
  }
}

  .button-column :deep(.template-btn) {
    height: clamp(38px, 8vw, 44px);
  }
</style>
