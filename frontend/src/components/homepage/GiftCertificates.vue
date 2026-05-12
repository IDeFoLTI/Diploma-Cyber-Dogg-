<template>
  <section class="gift-section">
    <div class="gift-container">
      <h2 class="gift-title">Подарочные сертификаты</h2>
      
      <div class="gift-content">
        <!-- Левая часть: Текст -->
        <div class="gift-text">
          <p class="gift-description">
            Подарочные сертификаты Cyber Dogg — это удобный способ подарить игровое время в клубе.
          </p>
          <p class="gift-description">
            Сертификаты можно приобрести на определённое количество часов или выбрать готовые пакеты игрового времени.
          </p>
          <p class="gift-description">
            Такой подарок подойдёт для друзей, тиммейтов и всех, кто любит атмосферу киберспорта и современных игр.
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
  padding: var(--spacing-2xl) 0;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow-x: hidden;
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

.gift-content {
  display: flex;
  gap: var(--spacing-xl);
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: var(--spacing-2xl);
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

/* Адаптивность для экранов 400-700px */
@media (min-width: 400px) and (max-width: 700px) {
  .gift-content {
    flex-direction: column;
    align-items: center;
  }

  .gift-text {
    min-width: 100%;
    max-width: 100%;
  }

  .gift-image-wrapper {
    min-width: 100%;
    max-width: 100%;
  }
}

.gift-text {
  flex: 1;
  min-width: 300px;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.gift-description {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--c-white);
  line-height: 1.8;
  text-align: left;
  margin: 0;
}

.gift-image-wrapper {
  flex: 1;
  min-width: 280px;
  max-width: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.gift-image-wrapper:hover {
  transform: translateY(-8px) scale(1.02);
}

.gift-image {
  max-width: 100%;
  height: auto;
  width: 100%;
  transition: transform 0.4s ease;
}

.gift-image-wrapper:hover .gift-image {
  transform: scale(1.05);
}

.gift-button {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.gift-link {
  text-decoration: none;
  color: inherit;
  display: contents;
}

.gift-button :deep(.template-btn) {
  width: auto !important;
  min-width: 320px !important;
  max-width: 400px !important;
  height: auto !important;
  min-height: 60px !important;
  border: 2px solid var(--c-white) !important;
  background: transparent !important;
  transition: all 0.3s ease !important;
  padding: var(--spacing-md) var(--spacing-xl) !important;
}

.gift-button :deep(.template-btn__text) {
  font-size: clamp(16px, 3.5vw, 20px) !important;
  color: var(--c-white) !important;
  font-weight: 500;
}

.gift-button :deep(.template-btn:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px) !important;
}

.gift-button :deep(.template-btn:active) {
  transform: translateY(0) !important;
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
    padding: var(--spacing-xl) 0;
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
    padding: var(--spacing-lg);
  }

  .gift-button {
    margin-top: var(--spacing-lg);
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
    font-size: var(--font-md);
    text-align: center;
    line-height: 1.7;
  }

  .gift-image-wrapper {
    padding: var(--spacing-md);
  }

  .gift-button {
    margin-top: var(--spacing-lg);
  }

  .gift-button :deep(.template-btn) {
    min-width: 280px !important;
    max-width: 360px !important;
    padding: var(--spacing-md) var(--spacing-lg) !important;
    border: 2px solid var(--c-white) !important;
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
    font-size: var(--font-sm);
    line-height: 1.6;
  }

  .gift-button :deep(.template-btn) {
    min-width: 280px !important;
    max-width: 340px !important;
    padding: var(--spacing-md) var(--spacing-lg) !important;
    border: 2px solid var(--c-white) !important;
  }

  .gift-button :deep(.template-btn__text) {
    font-size: clamp(14px, 3vw, 18px) !important;
  }

  .gift-image-wrapper {
    padding: var(--spacing-sm);
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 400px) {
  .gift-button :deep(.template-btn) {
    min-width: 260px !important;
    max-width: 320px !important;
    padding: var(--spacing-sm) var(--spacing-md) !important;
    border: 2px solid var(--c-white) !important;
  }

  .gift-button :deep(.template-btn__text) {
    font-size: 14px !important;
  }
}
</style>