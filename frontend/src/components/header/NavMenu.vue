<template>
  <nav class="nav-menu">
    <button 
      class="nav-menu__toggle" 
      @click="toggleMenu"
      :aria-expanded="isOpen"
      aria-controls="nav-menu-list"
    >
      <span class="nav-menu__toggle-line"></span>
      <span class="nav-menu__toggle-line"></span>
      <span class="nav-menu__toggle-line"></span>
    </button>
    
    <div class="nav-menu__list" id="nav-menu-list" :class="{ 'is-open': isOpen }">
      <router-link
        v-for="item in items"
        :key="item.label"
        :to="item.href"
        class="nav-item"
        :class="{ 'is-active': $route.path === item.href }"
        @click="closeMenu"
      >
        <span class="label">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
  document.body.style.overflow = isOpen.value ? 'hidden' : '';
};

const closeMenu = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.nav-menu {
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
}

/* Бургер-меню для мобильных */
.nav-menu__toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 32px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 100;
}

.nav-menu__toggle-line {
  display: block;
  width: 100%;
  height: 3px;
  background: var(--c-white);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nav-menu__toggle[aria-expanded="true"] .nav-menu__toggle-line:nth-child(1) {
  transform: translateY(10.5px) rotate(45deg);
}

.nav-menu__toggle[aria-expanded="true"] .nav-menu__toggle-line:nth-child(2) {
  opacity: 0;
}

.nav-menu__toggle[aria-expanded="true"] .nav-menu__toggle-line:nth-child(3) {
  transform: translateY(-10.5px) rotate(-45deg);
}

.nav-menu__list {
  display: flex;
  gap: 10px;
}

.nav-item {
  position: relative;
  color: var(--c-white);
  text-decoration: none;
  text-transform: uppercase;
  font-family: "Bowler";
  font-size: 0.95rem;
  letter-spacing: 1.4px;
  height: 48px;
  padding: 0 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
}

.nav-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--c-bg);
  border: 2px solid var(--c-white);
  transform: skewX(-30deg);
  transform-origin: center;
  z-index: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.label {
  position: relative;
  z-index: 1;
}

.nav-item:hover::before {
  background: var(--c-danger);
  border-color: var(--c-danger);
  box-shadow: 0 0 6px var(--c-danger);
}

.nav-item:hover {
  transform: translateY(-2px);
  color: var(--c-bg);
}

.nav-item.is-active::before {
  background: var(--c-accent);
  border-color: var(--c-accent);
  box-shadow: 0 0 6px var(--c-accent);
}

.nav-item.is-active .label {
  text-decoration: none;
}

/* Адаптивность для десктопов */
@media (max-width: 1100px) {
  .nav-menu {
    gap: 8px;
  }

  .nav-item {
    height: 40px;
    padding: 0 20px;
    font-size: 0.85rem;
    letter-spacing: 1px;
  }
}

@media (max-width: 950px) {
  .nav-item {
    padding: 0 16px;
    font-size: 0.8rem;
  }
}

@media (max-width: 900px) {
  .nav-item:hover::before {
    background: transparent;
    border-color: var(--c-white);
    box-shadow: none;
  }

  .nav-item:hover {
    transform: none;
    color: var(--c-white);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 700px) {
  .nav-menu__toggle {
    display: flex;
  }

  .nav-menu__list {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    max-width: 80vw;
    height: 100vh;
    background: var(--c-bg);
    flex-direction: column;
    gap: 0;
    padding: 80px 20px 20px;
    transition: right 0.3s ease;
    overflow-y: auto;
    z-index: 99;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  }

  .nav-menu__list.is-open {
    right: 0;
  }

  .nav-item {
    height: 50px;
    padding: 0 20px;
    font-size: 1rem;
    letter-spacing: 1px;
    width: 100%;
    justify-content: flex-start;
  }

  .nav-item::before {
    transform: none;
  }

  .nav-item:hover {
    transform: none;
    color: var(--c-accent);
  }

  .nav-item:hover::before {
    background: transparent;
    border-color: var(--c-accent);
    box-shadow: none;
  }

  .nav-item.is-active .label {
    text-decoration: underline;
    text-underline-offset: 6px;
    text-decoration-thickness: 2px;
  }
}

@media (max-width: 600px) {
  .nav-menu {
    gap: 6px;
  }

  .nav-menu__list {
    width: 250px;
    padding: 70px 15px 15px;
  }

  .nav-item {
    height: 48px;
    padding: 0 15px;
    font-size: 0.95rem;
  }
}

@media (max-width: 500px) {
  .nav-item {
    height: 46px;
    padding: 0 12px;
    font-size: 0.9rem;
    letter-spacing: 0.8px;
  }
}

@media (max-width: 400px) {
  .nav-menu__toggle {
    width: 28px;
    height: 20px;
  }

  .nav-menu__toggle-line {
    height: 2.5px;
  }

  .nav-menu__list {
    width: 220px;
    padding: 65px 12px 12px;
  }

  .nav-item {
    height: 44px;
    padding: 0 10px;
    font-size: 0.85rem;
  }

  .nav-item.is-active .label {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }
}

@media (max-width: 360px) {
  .nav-item {
    font-size: 0.8rem;
    height: 42px;
  }
}
</style>
