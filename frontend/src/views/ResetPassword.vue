<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-card">
        <img class="auth-logo" :src="logoUrl" alt="Cyber Dogg" />
        <h1 class="auth-title">Восстановление пароля</h1>
        
        <!-- Этап 1: Ввод кода подтверждения -->
        <form v-if="!isCodeVerified" class="auth-form" @submit.prevent="verifyCode">
          <div class="form-row" :class="{ 'has-error': errors.code }">
            <label for="code" class="form-label">Код из письма</label>
            <input
              id="code"
              v-model="code"
              type="text"
              class="form-input"
              :class="{ 'input-error': errors.code }"
              placeholder="0000"
              maxlength="6"
            />
            <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
          </div>

          <div class="form-buttons">
            <TemplateButton variant="outlined-white" @click="verifyCode" :disabled="!canVerify">
              Подтвердить код
            </TemplateButton>
          </div>

          <div class="resend-section">
            <span>Не получили код?</span>
            <button type="button" class="resend-btn" @click="resendCode" :disabled="isResending">
              {{ resendTimer > 0 ? `Повторно через ${resendTimer}с` : 'Отправить снова' }}
            </button>
          </div>
        </form>

        <!-- Этап 2: Установка нового пароля -->
        <form v-else class="auth-form" @submit.prevent="handleResetPassword">
          <div class="form-row" :class="{ 'has-error': errors.newPassword }">
            <label for="newPassword" class="form-label">Новый пароль</label>
            <input
              id="newPassword"
              v-model="formData.newPassword"
              type="password"
              class="form-input"
              :class="{ 'input-error': errors.newPassword }"
              placeholder="••••••••"
            />
            <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
          </div>

          <div class="form-row" :class="{ 'has-error': errors.confirmPassword }">
            <label for="confirmPassword" class="form-label">Повторите пароль</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              class="form-input"
              :class="{ 'input-error': errors.confirmPassword }"
              placeholder="••••••••"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-buttons">
            <TemplateButton variant="outlined-white" @click="handleResetPassword" :disabled="!canSubmit">
              Установить пароль
            </TemplateButton>
          </div>
        </form>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SiteFooter from '../components/footer/SiteFooter.vue';
import TemplateButton from '../components/TemplateButton.vue';

const router = useRouter();
const route = useRoute();
const logoUrl = '/img/logo.svg';

// Состояние для этапа 1 (проверка кода)
const code = ref('');
const errors = reactive({
  code: '',
  newPassword: '',
  confirmPassword: ''
});
const isCodeVerified = ref(false);
const isResending = ref(false);
const resendTimer = ref(0);
let timerInterval = null;

// Состояние для этапа 2 (установка пароля)
const formData = reactive({
  newPassword: '',
  confirmPassword: ''
});

const canVerify = computed(() => {
  return code.value.trim().length >= 4;
});

const canSubmit = computed(() => {
  return formData.newPassword.trim() && formData.confirmPassword.trim();
});

// Таймер для повторной отправки кода
onMounted(() => {
  const savedCode = localStorage.getItem('resetCode');
  if (savedCode) {
    code.value = savedCode;
  }
  
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

const validateCode = () => {
  errors.code = '';
  
  if (!code.value.trim()) {
    errors.code = 'Введите код из письма';
    return false;
  }
  
  if (code.value.length < 4) {
    errors.code = 'Код должен быть не менее 4 символов';
    return false;
  }
  
  return true;
};

const verifyCode = async () => {
  if (!validateCode()) return;

  const email = route.query.email || localStorage.getItem('resetEmail');
  
  if (!email) {
    errors.code = 'Email не найден. Начните восстановление заново.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/verify-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: code.value })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка проверки кода');
    }

    isCodeVerified.value = true;
    errors.code = '';
    localStorage.removeItem('resetCode');
  } catch (error) {
    errors.code = error.message || 'Неверный код. Попробуйте снова.';
    console.error('Ошибка проверки кода:', error);
  }
};

const resendCode = async () => {
  if (resendTimer.value > 0) return;
  
  const email = route.query.email || localStorage.getItem('resetEmail');
  
  if (!email) {
    errors.code = 'Email не найден. Начните восстановление заново.';
    return;
  }

  isResending.value = true;
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/resend-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка отправки кода');
    }

    console.log('Код повторно отправлен:', data);
    resendTimer.value = 60; // Таймер 60 секунд
  } catch (error) {
    console.error('Ошибка отправки кода:', error);
  } finally {
    isResending.value = false;
  }
};

const validatePasswordForm = () => {
  let isValid = true;
  errors.newPassword = '';
  errors.confirmPassword = '';

  if (!formData.newPassword.trim()) {
    errors.newPassword = 'Введите новый пароль';
    isValid = false;
  } else if (formData.newPassword.length < 6) {
    errors.newPassword = 'Пароль должен быть не менее 6 символов';
    isValid = false;
  }

  if (!formData.confirmPassword.trim()) {
    errors.confirmPassword = 'Повторите пароль';
    isValid = false;
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
    isValid = false;
  }

  return isValid;
};

const handleResetPassword = async () => {
  if (!validatePasswordForm()) return;

  const email = route.query.email || localStorage.getItem('resetEmail');
  
  if (!email) {
    errors.newPassword = 'Email не найден. Начните восстановление заново.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        code: code.value,
        newPassword: formData.newPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка смены пароля');
    }

    console.log('Пароль успешно изменён:', data);
    
    // После успешной смены пароля
    router.push({
      path: '/login',
      query: { success: 'password-reset' }
    });
  } catch (error) {
    console.error('Ошибка смены пароля:', error);
    errors.newPassword = error.message || 'Не удалось сменить пароль. Попробуйте снова.';
  }
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
  flex: 0 0 130px;
  font-family: "Bowler", sans-serif;
  font-size: clamp(14px, 1.8vw, 18px);
  font-weight: 400;
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

.resend-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-70);
}

.resend-btn {
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
}

.resend-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.7);
  color: var(--c-white);
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
    flex: 0 0 100px;
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

  .resend-section {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .resend-btn {
    font-size: clamp(12px, 2.5vw, 14px);
    padding: 8px 16px;
    width: 100%;
    max-width: 280px;
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
