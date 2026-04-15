<template>
  <div class="certificate-options">
    
    <!-- Группа 1: Количество человек -->
    <div class="option-group">
      <div class="radio-row">
        <label class="radio-item">
          <input type="radio" :name="`players-${uniqueId}`" value="7players" v-model="localPlayers" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <span class="radio-label">7 человек</span>
        </label>
        
        <label class="radio-item">
          <input type="radio" :name="`players-${uniqueId}`" value="5players" v-model="localPlayers" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <span class="radio-label">5 человек</span>
        </label>
      </div>
    </div>

    <div class="option-divider"></div>

    <!-- Группа 2: Часы с динамической ценой -->
    <div class="option-group" :class="{ disabled: isHoursGroupDisabled }">
      <div class="radio-row">
        <label class="radio-item">
          <input type="radio" :name="`hours-${uniqueId}`" value="3hours" v-model="localHours" :disabled="isHoursGroupDisabled" />
          <img :src="passiveRadio" alt="" class="radio-icon passive" />
          <img :src="activeRadio" alt="" class="radio-icon active" />
          <div class="radio-info">
            <span class="radio-label">3 часа</span>
            <span class="radio-price">{{ price3hours }}</span>
          </div>
        </label>
        
        <label class="radio-item">
          <input type="radio" :name="`hours-${uniqueId}`" value="5hours" v-model="localHours" :disabled="isHoursGroupDisabled" />
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
  players: { type: [String, null], default: null },
  hours: { type: [String, null], default: null },
  uniqueId: { type: String, required: true }
});

const emit = defineEmits(['update:players', 'update:hours', 'submit']);

const localPlayers = ref(props.players);
const localHours = ref(props.hours);

watch(() => props.players, val => localPlayers.value = val);
watch(() => props.hours, val => localHours.value = val);

watch(localPlayers, val => emit('update:players', val));
watch(localHours, val => emit('update:hours', val));

// Группа 2 заблокирована пока не выбрано количество игроков
const isHoursGroupDisabled = computed(() => localPlayers.value === null);

// Цены зависят от количества игроков
const prices = {
  '7players': { '3hours': '1500 ₽', '5hours': '2500 ₽' },
  '5players': { '3hours': '1200 ₽', '5hours': '2000 ₽' }
};

const price3hours = computed(() => {
  if (!localPlayers.value) return '1500 ₽';
  return prices[localPlayers.value]?.['3hours'] || '1500 ₽';
});

const price5hours = computed(() => {
  if (!localPlayers.value) return '2500 ₽';
  return prices[localPlayers.value]?.['5hours'] || '2500 ₽';
});

// Кнопка активна только если выбраны игроки и часы
const canSubmit = computed(() => {
  return localPlayers.value !== null && localHours.value !== null;
});

const handleSubmit = () => {
  if (canSubmit.value) {
    emit('submit', {
      players: localPlayers.value,
      hours: localHours.value
    });
  }
};
</script>

<style scoped>
@import url('../styles.css');

.certificate-options {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}

.option-group {
  padding: var(--spacing-md) 0;
  width: 100%;
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
  width: 100%;
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
  min-width: 0;
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
  min-width: 0;
}

.radio-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  line-height: 1.3;
  white-space: nowrap;
}

.radio-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-accent);
  white-space: nowrap;
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

/* Адаптивность */
@media (max-width: 900px) {
  .certificate-options {
    min-width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .radio-row {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .radio-item {
    width: 100%;
    justify-content: flex-start;
  }

  .radio-icon {
    width: 24px;
    height: 24px;
  }

  .radio-label {
    font-size: var(--font-md);
  }

  .radio-price {
    font-size: var(--font-sm);
  }

  .certificate-btn {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
