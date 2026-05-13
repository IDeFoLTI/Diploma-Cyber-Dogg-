<template>
  <section class="gift-section">
    <div class="gift-container">
      <div class="title-block">
        <h2 class="gift-title">Подарочные сертификаты</h2>
      </div>

      <p class="gift-subtitle">
        Идеальный подарок для друзей и тиммейтов
      </p>

      <div class="certs-wrapper">
        <div v-for="cert in certificates" :key="cert.id" class="cert-card">
          <div class="cert-image-box">
            <img :src="cert.image" :alt="cert.title" class="cert-img" />
          </div>
          <div class="cert-footer">
            <h3 class="cert-name">{{ cert.title }}</h3>
          </div>
        </div>
      </div>

      <div class="cta-wrapper">
        <router-link to="/gift-certificates" class="gift-link">
          <TemplateButton variant="outlined-white">Все сертификаты</TemplateButton>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import TemplateButton from '../TemplateButton.vue';

const standartSert = "/img/standartSert.svg";
const battleArenaSert = "/img/battleArenaSert.svg";
const playstationSert = "/img/playstationSert.svg";
const vipSert = "/img/vipSert.svg";

const certificates = [
  { id: 'standart', title: 'Common Room', image: standartSert },
  { id: 'battle', title: 'Battle Arena', image: battleArenaSert },
  { id: 'vip', title: 'VIP Room', image: vipSert },
  { id: 'playstation', title: 'PlayStation', image: playstationSert }
];
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
  position: relative;
  overflow: hidden;
}

.gift-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 140, 209, 0.3), transparent);
}

.gift-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.title-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.gift-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.gift-subtitle {
  font-family: "Roboto", sans-serif;
  font-size: clamp(16px, 2vw, 20px);
  color: var(--c-white-70);
  text-align: center;
  margin: var(--spacing-lg) 0 var(--spacing-xl);
  line-height: 1.6;
}

.certs-wrapper {
  width: 100%;
  margin-bottom: var(--spacing-xl);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.cert-card {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.cert-card:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-8px);
}

.cert-image-box {
  width: 100%;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: transparent;
}

.cert-img {
  width: 90%;
  height: auto;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.cert-card:hover .cert-img {
  transform: scale(1.05);
}

.cert-footer {
  padding: var(--spacing-md);
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}

.cert-name {
  font-family: "Bowler", sans-serif;
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  line-height: 1.3;
}

.cta-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: var(--spacing-md);
}

.gift-link {
  text-decoration: none;
  color: inherit;
  display: contents;
}

.cta-wrapper :deep(.template-btn) {
  width: auto !important;
  min-width: 320px !important;
  max-width: 440px !important;
  height: 64px !important;
  min-height: 64px !important;
  padding: 0 var(--spacing-xl) !important;
}

.cta-wrapper :deep(.template-btn__text) {
  font-size: clamp(16px, 2.5vw, 18px) !important;
}

/* Адаптивность для планшетов */
@media (max-width: 1024px) {
  .certs-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .cert-card {
    border-radius: 16px;
  }

  .cert-image-box {
    padding: var(--spacing-lg);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .gift-section {
    padding: var(--spacing-lg) 0;
  }

  .gift-title {
    font-size: clamp(26px, 6vw, 36px);
    letter-spacing: 0.1em;
  }

  .gift-subtitle {
    font-size: var(--font-sm);
    margin: var(--spacing-md) 0 var(--spacing-lg);
  }

  .certs-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .cert-card {
    border-radius: 14px;
  }

  .cert-image-box {
    aspect-ratio: 1.5;
    padding: var(--spacing-md);
  }

  .cert-name {
    font-size: 13px;
    letter-spacing: 0.1em;
  }

  .cta-wrapper :deep(.template-btn) {
    min-width: 280px !important;
    max-width: 360px !important;
    height: 56px !important;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .gift-section {
    padding: var(--spacing-md) 0;
  }

  .gift-title {
    font-size: clamp(22px, 7vw, 30px);
  }

  .accent-line {
    height: 3px;
    margin: 16px auto 0;
  }

  .gift-subtitle {
    font-size: 14px;
    margin: var(--spacing-md) 0 var(--spacing-md);
  }

  .certs-wrapper {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .cert-card {
    border-radius: 16px;
  }

  .cert-image-box {
    aspect-ratio: 1.6;
    padding: var(--spacing-lg);
  }

  .cert-name {
    font-size: 15px;
  }

  .cta-wrapper :deep(.template-btn) {
    min-width: 260px !important;
    max-width: 340px !important;
    height: 52px !important;
  }

  .cta-wrapper :deep(.template-btn__text) {
    font-size: 15px !important;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .gift-title {
    font-size: clamp(20px, 8vw, 26px);
  }

  .certs-wrapper {
    gap: var(--spacing-sm);
  }

  .cert-card {
    border-radius: 14px;
  }

  .cert-image-box {
    aspect-ratio: 1.5;
    padding: var(--spacing-md);
  }

  .cert-name {
    font-size: 13px;
  }

  .cta-wrapper :deep(.template-btn) {
    min-width: 220px !important;
    height: 48px !important;
  }
}
</style>