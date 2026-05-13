<template>
  <section id="gaming-accessories" class="accessories-section">
    <div class="accessories-container">
      <div class="title-block">
        <h2 class="accessories-title">Игровые аксессуары</h2>
      </div>
      
      <p class="accessories-subtitle">Высокоточные мышки, наушники с объёмным звуком и механические клавиатуры с RGB-подсветкой</p>

      <div class="categories-row">
        <span class="category-tag">Мышки</span>
        <span class="category-tag">Наушники</span>
        <span class="category-tag">Клавиатуры</span>
      </div>

      <div class="cta-wrapper">
        <router-link to="/catalog" class="catalog-link">
          <TemplateButton variant="outlined-white">Перейти в каталог</TemplateButton>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import TemplateButton from '../TemplateButton.vue';
</script>

<style scoped>
.accessories-section {
  padding: var(--spacing-xl) 0;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

.accessories-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 var(--spacing-md);
  gap: var(--spacing-lg);
}

.title-block {
  position: relative;
}

.accessories-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(40px, 8vw, 64px);
  font-weight: 400;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin: 0;
  line-height: 1.1;
}

.accessories-subtitle {
  font-family: "Roboto", sans-serif;
  font-size: clamp(18px, 3vw, 24px);
  color: var(--c-white-70);
  line-height: 1.5;
  margin: 0;
  font-weight: 300;
}

.categories-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  max-width: 600px;
}

.category-tag {
  font-family: "Bowler", sans-serif;
  font-size: clamp(16px, 2.5vw, 20px);
  color: var(--c-white-60);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: all 0.3s ease;
}

.category-tag:hover {
  color: var(--c-accent);
  transform: scale(1.1);
}

.cta-wrapper {
  margin-top: var(--spacing-md);
}

.catalog-link {
  text-decoration: none;
  color: inherit;
  display: contents;
}

.cta-wrapper :deep(.template-btn) {
  width: auto !important;
  min-width: 300px !important;
  max-width: 400px !important;
  height: 60px !important;
  min-height: 60px !important;
  padding: 0 var(--spacing-xl) !important;
  font-size: clamp(16px, 2.5vw, 18px) !important;
  border-width: 2px !important;
}

.cta-wrapper :deep(.template-btn__text) {
  font-size: clamp(16px, 2.5vw, 18px) !important;
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .accessories-section {
    padding: var(--spacing-lg) 0;
  }

  .accessories-title {
    font-size: clamp(32px, 7vw, 48px);
  }

  .accessories-subtitle {
    font-size: var(--font-base);
  }

  .categories-row {
    gap: 16px;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .accessories-section {
    padding: var(--spacing-md) 0;
  }

  .accessories-title {
    font-size: clamp(28px, 8vw, 36px);
    letter-spacing: 0.15em;
  }

  .accessories-subtitle {
    font-size: var(--font-sm);
  }

  .categories-row {
    gap: 12px;
    padding: var(--spacing-md) 0;
  }

  .category-tag {
    font-size: 14px;
  }

  .cta-wrapper :deep(.template-btn) {
    min-width: 260px !important;
    max-width: 340px !important;
    height: 52px !important;
    min-height: 52px !important;
  }

  .cta-wrapper :deep(.template-btn__text) {
    font-size: 15px !important;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .accessories-container {
    padding: 0 var(--spacing-sm);
  }

  .accessories-title {
    font-size: clamp(24px, 9vw, 32px);
  }

  .categories-row {
    gap: 10px;
  }

  .category-tag {
    font-size: 13px;
  }

  .cta-wrapper :deep(.template-btn) {
    min-width: 220px !important;
    height: 48px !important;
  }
}
</style>
