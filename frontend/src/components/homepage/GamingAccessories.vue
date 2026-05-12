<template>
  <section id="gaming-accessories" class="accessories-section">
    <div class="accessories-container">
      <h2 class="accessories-title">Игровые аксессуары</h2>
      <p class="accessories-subtitle">Улучши свой игровой опыт с нашей продукцией</p>

      <div class="accessories-grid">
        <!-- Мышки -->
        <div class="accessory-card">
          <div class="accessory-image">
            <span class="placeholder">Мышки</span>
          </div>
          <h3 class="accessory-name">Игровые мышки</h3>
          <p class="accessory-description">Высокоточные сенсоры и эргономичный дизайн</p>
          <div class="accessory-price">от 2 490 ₽</div>
          <TemplateButton variant="outlined">Подробнее</TemplateButton>
        </div>

        <!-- Коврики -->
        <div class="accessory-card">
          <div class="accessory-image">
            <span class="placeholder">Коврики</span>
          </div>
          <h3 class="accessory-name">Игровые коврики</h3>
          <p class="accessory-description">Крупные коврики для комфортной игры</p>
          <div class="accessory-price">от 790 ₽</div>
          <TemplateButton variant="outlined">Подробнее</TemplateButton>
        </div>

        <!-- Наушники -->
        <div class="accessory-card">
          <div class="accessory-image">
            <span class="placeholder">Наушники</span>
          </div>
          <h3 class="accessory-name">Игровые наушники</h3>
          <p class="accessory-description">Объемный звук и четкая связь с командой</p>
          <div class="accessory-price">от 3 490 ₽</div>
          <TemplateButton variant="outlined">Подробнее</TemplateButton>
        </div>
      </div>

      <div class="view-all-wrapper">
        <router-link to="/catalog" class="catalog-link">
          <TemplateButton variant="outlined-white">Смотреть весь каталог</TemplateButton>
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
  background: linear-gradient(180deg, var(--c-bg) 0%, var(--c-bg-secondary) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.accessories-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--spacing-md);
}

.accessories-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0 0 var(--spacing-sm) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.accessories-title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
}

.accessories-subtitle {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-base);
  color: var(--c-white-70);
  text-align: center;
  margin: 0 0 var(--spacing-xl) 0;
  max-width: 500px;
}

.accessories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  width: 100%;
  margin-bottom: var(--spacing-xl);
}

.accessory-card {
  background: var(--c-card-bg);
  border-radius: 12px;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.accessory-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.accessory-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-secondary) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

.accessory-image .placeholder {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.accessory-name {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  font-weight: 400;
  color: var(--c-white);
  margin: 0 0 var(--spacing-sm) 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.accessory-description {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.5;
}

.accessory-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-accent);
  margin: 0 0 var(--spacing-md) 0;
}

.accessory-card :deep(.template-btn) {
  margin-top: var(--spacing-md);
  width: 100% !important;
  min-width: auto !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: 50px !important;
  border: 2px solid var(--c-white) !important;
  background: transparent !important;
  transition: all 0.3s ease !important;
}

.accessory-card :deep(.template-btn__text) {
  font-size: clamp(14px, 2.5vw, 16px) !important;
  color: var(--c-white) !important;
  font-weight: 500;
}

.accessory-card :deep(.template-btn:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px) !important;
}

.view-all-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.catalog-link {
  text-decoration: none;
  color: inherit;
  display: contents;
}

.view-all-wrapper :deep(.template-btn) {
  width: auto !important;
  min-width: 320px !important;
  max-width: 400px !important;
  height: auto !important;
  min-height: 60px !important;
  padding: var(--spacing-md) var(--spacing-xl) !important;
}

.view-all-wrapper :deep(.template-btn__text) {
  font-size: clamp(16px, 3.5vw, 20px) !important;
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .accessories-section {
    padding: var(--spacing-lg) 0;
  }

  .accessories-title {
    font-size: clamp(24px, 4vw, 32px);
  }

  .accessories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .accessories-section {
    padding: var(--spacing-md) 0;
  }

  .accessories-title {
    font-size: clamp(20px, 5vw, 26px);
    margin-bottom: var(--spacing-sm);
  }

  .accessories-subtitle {
    font-size: var(--font-sm);
    margin-bottom: var(--spacing-lg);
  }

  .accessories-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .accessory-card {
    padding: var(--spacing-md);
  }

  .accessory-name {
    font-size: var(--font-lg);
  }

  .accessory-price {
    font-size: var(--font-xl);
  }

  .view-all-wrapper :deep(.template-btn) {
    min-width: 280px !important;
    max-width: 360px !important;
    padding: var(--spacing-md) var(--spacing-lg) !important;
  }

  .view-all-wrapper :deep(.template-btn__text) {
    font-size: clamp(14px, 3vw, 18px) !important;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 360px) {
  .accessories-container {
    padding: 0 var(--spacing-sm);
  }

  .accessories-title {
    font-size: clamp(18px, 5vw, 22px);
  }

  .accessory-card {
    padding: var(--spacing-sm);
  }

  .accessory-image .placeholder {
    font-size: var(--font-sm);
  }

  .accessory-name {
    font-size: var(--font-base);
  }

  .accessory-description {
    font-size: var(--font-xs);
  }

  .accessory-price {
    font-size: var(--font-lg);
  }
}
</style>
