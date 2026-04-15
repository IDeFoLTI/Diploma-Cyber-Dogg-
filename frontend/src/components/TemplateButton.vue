<template>
  <button 
    v-if="!href || isAnchorLink"
    class="template-btn" 
    :class="[`template-btn--${variant}`, { 'template-btn--disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="template-btn__text">
      <slot />
    </span>
  </button>
  
  <router-link
    v-else
    :to="href"
    class="template-btn" 
    :class="[`template-btn--${variant}`, { 'template-btn--disabled': disabled }]"
  >
    <span class="template-btn__text">
      <slot />
    </span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outlined', 'outlined-white'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  href: {
    type: String,
    default: null
  }
});

const router = useRouter();

const isAnchorLink = computed(() => {
  return props.href && props.href.startsWith('#');
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  emit('click', event);
  
  // Если это якорная ссылка, прокручиваем к элементу
  if (isAnchorLink.value) {
    const targetId = props.href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.template-btn {
  width: clamp(160px, 25vw, 230px);
  height: clamp(40px, 6vw, 55px);
  padding: 0;
  border: 2px solid var(--c-white);
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.template-btn__text {
  font-family: "Bowler", sans-serif;
  font-size: clamp(12px, 2vw, 16px);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c-white);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  white-space: nowrap;
}

/* Primary - заливка белая, текст чёрный */
.template-btn--primary {
  background: var(--c-white);
}

.template-btn--primary .template-btn__text {
  color: var(--c-bg);
}

/* Secondary - прозрачная с белой обводкой */
.template-btn--secondary {
  background: transparent;
}

/* Outlined - прозрачная с цветной обводкой */
.template-btn--outlined {
  background: transparent;
  border-color: var(--c-accent);
}

.template-btn--outlined .template-btn__text {
  color: var(--c-accent);
}

.template-btn--outlined:hover .template-btn__text {
  color: var(--c-white);
}

/* Outlined White - прозрачная с белой обводкой и белым текстом */
.template-btn--outlined-white {
  background: transparent;
  border-color: var(--c-white);
}

.template-btn--outlined-white .template-btn__text {
  color: var(--c-white);
}

.template-btn--outlined-white:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Hover эффект для всех вариантов */
.template-btn:not(.template-btn--disabled):hover {
  transform: scale(1.02);
}

.template-btn:not(.template-btn--disabled):active {
  transform: scale(0.98);
}

/* Disabled состояние */
.template-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .template-btn {
    width: clamp(140px, 22vw, 200px);
    height: clamp(38px, 6vw, 50px);
  }

  .template-btn__text {
    font-size: clamp(11px, 1.8vw, 14px);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .template-btn {
    width: clamp(160px, 28vw, 180px);
    height: clamp(42px, 7vw, 45px);
  }

  .template-btn__text {
    font-size: clamp(12px, 2vw, 13px);
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .template-btn {
    width: clamp(140px, 25vw, 160px);
    height: clamp(40px, 6vw, 40px);
  }

  .template-btn__text {
    font-size: clamp(11px, 1.8vw, 12px);
    letter-spacing: 0.08em;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .template-btn {
    width: clamp(100px, 16vw, 140px);
    height: clamp(32px, 6vw, 38px);
  }

  .template-btn__text {
    font-size: clamp(8px, 1.2vw, 11px);
    letter-spacing: 0.06em;
  }
}

/* Вертикальные кнопки для узких экранов */
@media (max-width: 380px) {
  .template-btn {
    width: 100%;
    max-width: 180px;
  }
}
</style>
