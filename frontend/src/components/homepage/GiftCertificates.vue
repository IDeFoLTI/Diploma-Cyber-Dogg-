<template>
  <section class="gift-section">
    <div class="gift-container">
      <h2 class="gift-title">Подарочные сертификаты</h2>
      
      <div class="gift-content">
        <!-- Левая часть: Текст -->
        <div class="gift-text">
          <p class="gift-description">
            Подарочные сертификаты Cyber Dogg — это удобный способ подарить игровое время в клубе. Сертификаты можно приобрести на определённое количество часов или выбрать готовые пакеты игрового времени. Такой подарок подойдёт для друзей, тиммейтов и всех, кто любит атмосферу киберспорта и современных игр.
          </p>
        </div>

        <!-- Правая часть: Картинка -->
        <div class="gift-image-wrapper">
          <img :src="giftImage" alt="Подарочный сертификат" class="gift-image" />
        </div>
      </div>

      <!-- Кнопка -->
      <div class="gift-button">
        <router-link to="/gift-certificates" class="gift-link">
          <TemplateButton variant="outlined-white">Купить сертификат</TemplateButton>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import TemplateButton from '../TemplateButton.vue';

const giftImage = "/img/sert.svg";
</script>

<style scoped>
.gift-section {
  padding: var(--spacing-xl) 0;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.gift-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gift-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0 0 var(--spacing-xl) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  line-height: 1.2;
}

.gift-title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
}

.gift-content {
  display: flex;
  gap: var(--spacing-xl);
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: var(--spacing-xl);
}

.gift-text {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  display: flex;
  align-items: center;
}

.gift-description {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  line-height: 1.8;
  text-align: left;
}

.gift-image-wrapper {
  flex: 1;
  min-width: 280px;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gift-image {
  max-width: 100%;
  height: auto;
  width: 100%;
}

.gift-button {
  width: 100%;
  display: flex;
  justify-content: center;
}

.gift-link {
  text-decoration: none;
  color: inherit;
  display: contents;
}

.gift-button :deep(.template-btn) {
  width: 100% !important;
  height: auto !important;
  min-height: 70px !important;
  border: 2px solid var(--c-accent) !important;
  background: transparent !important;
}

.gift-button :deep(.template-btn__text) {
  font-size: clamp(16px, 3.5vw, 20px) !important;
  color: var(--c-white) !important;
}

.gift-button :deep(.template-btn:hover) {
  background: var(--c-accent) !important;
}

.gift-button :deep(.template-btn:hover .template-btn__text) {
  color: var(--c-bg) !important;
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .gift-section {
    padding: calc(var(--spacing-xl) * 1.2) 0;
  }

  .gift-title {
    font-size: clamp(36px, 5vw, 52px);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .gift-section {
    padding: var(--spacing-lg) 0;
  }

  .gift-title {
    font-size: clamp(28px, 4vw, 34px);
    margin-bottom: var(--spacing-lg);
  }

  .gift-content {
    gap: var(--spacing-lg);
    flex-direction: column;
    align-items: center;
  }

  .gift-text {
    max-width: 100%;
    text-align: center;
  }

  .gift-description {
    text-align: center;
  }

  .gift-image-wrapper {
    max-width: 100%;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .gift-section {
    padding: var(--spacing-md) 0;
  }

  .gift-title {
    font-size: clamp(22px, 5vw, 26px);
    margin-bottom: var(--spacing-md);
  }

  .gift-content {
    gap: var(--spacing-md);
  }

  .gift-description {
    font-size: var(--font-sm);
    text-align: center;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .gift-section {
    padding: var(--spacing-sm) 0;
  }

  .gift-title {
    font-size: clamp(20px, 5vw, 22px);
  }

  .gift-description {
    font-size: var(--font-xs);
    line-height: 1.6;
  }
}
</style>