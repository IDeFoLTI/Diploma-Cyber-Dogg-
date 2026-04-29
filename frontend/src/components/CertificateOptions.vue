<template>
  <div class="certificate-options">
    
    <!-- Группа 1: Время суток -->
    <div class="option-group" :class="{ disabled: isPackageGroupDisabled }">
      <div class="radio-row">
        <label class="radio-item">
          <input type="radio" :name="`time-${uniqueId}`" value="evening" v-model="localTime" :disabled="isPackageGroupDisabled" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <span class="radio-label">Вечер</span>
        </label>
        
        <label class="radio-item">
          <input type="radio" :name="`time-${uniqueId}`" value="day" v-model="localTime" :disabled="isPackageGroupDisabled" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <span class="radio-label">День</span>
        </label>
      </div>
    </div>

    <div class="option-divider"></div>

    <!-- Группа 2: Часы -->
    <div class="option-group" :class="{ disabled: isPackageGroupDisabled || isHoursGroupDisabled }">
      <div class="radio-row">
        <label class="radio-item">
          <input type="radio" :name="`hours-${uniqueId}`" value="3hours" v-model="localHours" :disabled="isPackageGroupDisabled || isHoursGroupDisabled" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <div class="radio-info">
            <span class="radio-label">3 часа</span>
            <span class="radio-price">{{ price3hours }}</span>
          </div>
        </label>
        
        <label class="radio-item">
          <input type="radio" :name="`hours-${uniqueId}`" value="5hours" v-model="localHours" :disabled="isPackageGroupDisabled || isHoursGroupDisabled" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <div class="radio-info">
            <span class="radio-label">5 часов</span>
            <span class="radio-price">{{ price5hours }}</span>
          </div>
        </label>
      </div>
    </div>

    <div class="option-divider"></div>

    <!-- Группа 3: Пакеты -->
    <div class="option-group package-group">
      <div class="radio-column">
        <label class="radio-item">
          <input type="radio" :name="`package-${uniqueId}`" value="cyberday" v-model="localPackage" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <div class="radio-info">
            <span class="radio-label">Кибер сутки</span>
            <span class="radio-price">1200 ₽</span>
          </div>
        </label>
        
        <label class="radio-item">
          <input type="radio" :name="`package-${uniqueId}`" value="night" v-model="localPackage" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <div class="radio-info">
            <span class="radio-label">Ночь</span>
            <span class="radio-price">600 ₽</span>
          </div>
        </label>
      </div>
      <button v-if="localPackage" class="reset-btn" @click="localPackage = null">
        Сбросить
      </button>
    </div>

    <div class="option-divider"></div>

    <!-- Кнопка -->
    <button class="certificate-btn" @click="handleSubmit" :disabled="!canSubmit">
      Купить
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const passiveRadio = "/img/passiveRadio.svg";
const activeRadio = "/img/activeRadio.svg";

const props = defineProps({
  time: { type: [String, null], default: null },
  hours: { type: [String, null], default: null },
  package: { type: [String, null], default: null },
  uniqueId: { type: String, required: true }
});

const emit = defineEmits(['update:time', 'update:hours', 'update:package', 'submit']);

const localTime = ref(props.time);
const localHours = ref(props.hours);
const localPackage = ref(props.package);

watch(() => props.time, val => localTime.value = val);
watch(() => props.hours, val => localHours.value = val);
watch(() => props.package, val => localPackage.value = val);

watch(localTime, val => emit('update:time', val));
watch(localHours, val => emit('update:hours', val));
watch(localPackage, val => emit('update:package', val));

const isPackageGroupDisabled = computed(() => localPackage.value !== null);
const isHoursGroupDisabled = computed(() => localTime.value === null && localPackage.value === null);

// Проверка возможности отправки
const canSubmit = computed(() => {
  // Должно быть выбрано время суток ИЛИ пакет
  // И должны быть выбраны часы ИЛИ пакет
  if (localPackage.value) return true;
  return localTime.value !== null && localHours.value !== null;
});

const prices = {
  day: { '3hours': '350 ₽', '5hours': '550 ₽' },
  evening: { '3hours': '450 ₽', '5hours': '700 ₽' }
};

const price3hours = computed(() => {
  if (!localTime.value) return '450 ₽';
  return prices[localTime.value]?.['3hours'] || '450 ₽';
});

const price5hours = computed(() => {
  if (!localTime.value) return '700 ₽';
  return prices[localTime.value]?.['5hours'] || '700 ₽';
});

const handleSubmit = () => {
  if (canSubmit.value) {
    // Переход к оформлению заказа
    const queryParams = new URLSearchParams({
      hall: props.uniqueId,
      time: localTime.value || '',
      hours: localHours.value || '',
      package: localPackage.value || ''
    }).toString();
    
    window.location.href = `/buy-certificate?${queryParams}`;
  }
};
</script>

<style scoped>
@import url('../styles.css');

.certificate-options {
  flex: 1;
  min-width: 350px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.option-group {
  padding: var(--spacing-md) 0;
}

.option-group.package-group {
  position: relative;
}

.option-group.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.option-divider {
  width: 100%;
  height: 1px;
  background: var(--c-white);
  opacity: 0.2;
}

.radio-row {
  display: flex;
  gap: var(--spacing-md);
}

.radio-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.radio-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  flex: 1;
}

.radio-item input {
  display: none;
}

.radio-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.radio-icon.active {
  display: none;
}

.radio-item input:checked ~ .radio-icon.active {
  display: block;
}

.radio-item input:checked ~ .radio-icon.passive {
  display: none;
}

.radio-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.radio-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  line-height: 1.3;
}

.radio-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-accent);
}

.reset-btn {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0;
  padding: var(--spacing-xs) var(--spacing-md);
  cursor: pointer;
  margin-top: var(--spacing-sm);
  transition: all 0.3s ease;
  align-self: flex-start;
}

.reset-btn:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
}

.certificate-btn {
  font-family: "Bowler", sans-serif;
  font-size: clamp(16px, 4vw, 20px);
  font-weight: 400;
  color: var(--c-white);
  background: transparent;
  border: 2px solid var(--c-accent);
  border-radius: 0;
  padding: var(--spacing-md) var(--spacing-xl);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  width: 100%;
  margin-top: var(--spacing-md);
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.certificate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.certificate-btn:hover:not(:disabled) {
  background: var(--c-accent);
  color: var(--c-bg);
  transform: translateY(-2px);
}

.certificate-btn:active:not(:disabled) {
  transform: translateY(0);
}
</style>