<template>
  <div class="header-actions">
    <router-link to="/gift-certificates" class="icon-button-wrapper">
      <button class="icon-button icon-button--slant" aria-label="Сертификаты">
        <img class="icon" :src="shopUrl" alt="" />
      </button>
    </router-link>
    <router-link to="/register" class="icon-button-wrapper">
      <button class="icon-button icon-button--slant" aria-label="Личный кабинет">
        <img class="icon" :src="cabinetUrl" alt="" />
      </button>
    </router-link>
  </div>
</template>

<script setup>
const shopUrl = new URL("../../../icons/shop.svg", import.meta.url).href;
const cabinetUrl = new URL("../../../icons/cabinet.svg", import.meta.url).href;
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

.icon-button-wrapper {
  text-decoration: none;
  color: inherit;
  display: contents;
}

.icon-button {
  width: clamp(36px, 5vw, 48px);
  height: clamp(36px, 5vw, 48px);
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.icon-button--slant {
  width: calc(clamp(36px, 5vw, 48px) * 1.15);
}

.icon-button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--c-bg);
  border: 2px solid var(--c-white);
  transform-origin: center;
  z-index: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.icon-button--slant::before {
  transform: skewX(-30deg);
}

.icon-button:hover::before {
  background-color: var(--c-danger);
  border-color: var(--c-danger);
  box-shadow: 0 0 6px var(--c-danger);
}

.icon-button:hover {
  transform: translateY(-2px);
}

.icon-button.is-active::before {
  background-color: var(--c-accent);
  border-color: var(--c-accent);
  box-shadow: 0 0 6px var(--c-accent);
}

.icon-button:hover .icon,
.icon-button.is-active .icon {
  filter: brightness(0) saturate(100%);
}

.icon {
  height: 58%;
  width: auto;
  position: relative;
  z-index: 1;
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .icon-button {
    width: 52px;
    height: 52px;
  }

  .icon-button--slant {
    width: calc(52px * 1.15);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 1100px) {
  .icon-button {
    width: clamp(38px, 5vw, 44px);
    height: clamp(38px, 5vw, 44px);
  }

  .icon-button--slant {
    width: calc(clamp(38px, 5vw, 44px) * 1.15);
  }
}

@media (max-width: 800px) {
  .icon-button {
    width: clamp(36px, 5vw, 42px);
    height: clamp(36px, 5vw, 42px);
  }

  .icon-button--slant {
    width: calc(clamp(36px, 5vw, 42px) * 1.15);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 700px) {
  .icon-button::before {
    border: none;
    box-shadow: none;
  }

  .icon-button:hover::before {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  .icon-button:hover {
    transform: none;
  }

  .icon-button:hover .icon {
    filter: none;
  }
}

@media (max-width: 600px) {
  .header-actions {
    gap: 4px;
  }

  .icon-button {
    width: clamp(34px, 5vw, 38px);
    height: clamp(34px, 5vw, 38px);
  }

  .icon-button--slant {
    width: calc(clamp(34px, 5vw, 38px) * 1.15);
  }
}

@media (max-width: 500px) {
  .icon-button {
    width: clamp(32px, 5vw, 36px);
    height: clamp(32px, 5vw, 36px);
  }

  .icon-button--slant {
    width: calc(clamp(32px, 5vw, 36px) * 1.15);
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 400px) {
  .header-actions {
    gap: 3px;
  }

  .icon-button {
    width: clamp(30px, 5vw, 32px);
    height: clamp(30px, 5vw, 32px);
  }

  .icon-button--slant {
    width: calc(clamp(30px, 5vw, 32px) * 1.15);
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .icon-button {
    width: 28px;
    height: 28px;
  }

  .icon-button--slant {
    width: calc(28px * 1.15);
  }
}

@media (max-width: 900px) {
  .icon-button:hover::before {
    background-color: transparent;
    border-color: var(--c-white);
    box-shadow: none;
  }

  .icon-button:hover {
    transform: none;
  }

  .icon-button:hover .icon {
    filter: none;
  }
}
</style>
