<template>
  <header class="site-header">
    <div class="inner container">
      <LogoBrand />
      <div class="right-group">
        <NavMenu :items="navItems" />
        <HeaderActions />
      </div>
    </div>
  </header>
</template>

<script setup>
import LogoBrand from "./LogoBrand.vue";
import NavMenu from "./NavMenu.vue";
import HeaderActions from "./HeaderActions.vue";

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Меню", href: "/menu" },
  { label: "Цены", href: "/price" },
];
</script>

<style scoped>
.site-header {
  width: 100%;
  background: var(--c-bg);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding-block: var(--spacing-sm);
}

.right-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .inner {
    gap: calc(var(--spacing-lg) * 1.2);
    padding-block: calc(var(--spacing-sm) * 1.2);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .inner {
    gap: var(--spacing-md);
    padding-block: var(--spacing-xs);
  }

  .right-group {
    gap: calc(var(--spacing-xs) * 0.8);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .inner {
    padding-block: var(--spacing-xs);
    gap: var(--spacing-sm);
  }

  .right-group {
    gap: var(--spacing-xs);
  }

  .site-header {
    position: fixed;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .inner {
    padding-block: 8px;
    gap: var(--spacing-xs);
  }

  .right-group {
    gap: 6px;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .inner {
    padding-block: 6px;
    gap: 8px;
  }

  .right-group {
    gap: 4px;
  }
}
</style>
