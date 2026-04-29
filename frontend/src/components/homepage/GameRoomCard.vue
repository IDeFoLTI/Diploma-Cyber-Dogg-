<template>
  <article class="room-card" :class="{ 'room-card--reverse': reverse }">
    <div class="room-card__image-wrapper" :class="{ 'room-card__image-wrapper--small': smallImage }">
      <img :src="image" :alt="name" class="room-card__image" />
    </div>
    <div class="room-card__content">
      <h3 class="room-card__title">{{ name }}</h3>
      <ul class="room-card__features">
        <li v-for="(feature, index) in features" :key="index" class="room-card__feature">
          {{ feature }}
        </li>
      </ul>
      <div class="room-card__price">
        <span class="room-card__price-label">от</span>
        <span class="room-card__price-value">{{ minPrice }}</span>
        <span class="room-card__price-currency">₽/час</span>
      </div>
      <div class="room-card__actions">
        <TemplateButton variant="outlined-white" href="#reservation">Бронь</TemplateButton>
        <TemplateButton variant="outlined-white" href="/price">Цены</TemplateButton>
      </div>
    </div>
  </article>
</template>

<script setup>
import TemplateButton from '../TemplateButton.vue';

defineProps({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  features: {
    type: Array,
    default: () => []
  },
  minPrice: {
    type: Number,
    required: true
  },
  reverse: {
    type: Boolean,
    default: false
  },
  smallImage: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.room-card {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--spacing-md);
  border-radius: 20px;
  box-sizing: border-box;
}

/* Адаптивность для экранов 400-900px */
@media (min-width: 400px) and (max-width: 900px) {
  .room-card {
    padding: var(--spacing-sm);
  }

  .room-card__image-wrapper {
    width: 100%;
    max-width: 400px;
    height: 350px;
  }

  .room-card__image-wrapper--small {
    width: 100%;
    max-width: 350px;
    height: 300px;
  }

  .room-card__content {
    width: 100%;
    padding: var(--spacing-md);
  }
}

.room-card--reverse {
  flex-direction: row-reverse;
}

.room-card__image-wrapper {
  width: 550px;
  height: 500px;
  flex-shrink: 0;
  border-radius: 15px;
  overflow: hidden;
}

.room-card__image-wrapper--small {
  width: 400px;
  height: 350px;
}

.room-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-card__content {
  width: 50%;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-md);
}

.room-card__title {
  font-family: "Kingslay";
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.room-card__features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.room-card__feature {
  font-family: "Roboto";
  font-size: clamp(15px, 1.5vw, 16px);
  font-weight: 600;
  color: var(--c-white);
  padding-left: 20px;
  position: relative;
  line-height: 1.1;
}

.room-card__feature::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--c-white);
  font-size: 20px;
  line-height: 1;
}

.room-card__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.room-card__price-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-50);
  text-transform: uppercase;
}

.room-card__price-value {
  font-family: "Bowler", sans-serif;
  font-size: clamp(28px, 4vw, 36px);
  color: var(--c-accent);
}

.room-card__price-currency {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-50);
}

.room-card__actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Адаптивность для десктопов с большим экраном */
@media (min-width: 1400px) {
  .room-card {
    align-items: center;
    justify-content: center;
  }

  .room-card__image-wrapper {
    width: 650px;
    height: 600px;
  }

  .room-card__content {
    padding: calc(var(--spacing-xl) * 1.2);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 1100px) {
  .room-card__image-wrapper {
    width: 450px;
    height: 400px;
  }

  .room-card__content {
    padding: var(--spacing-lg);
  }

  .room-card__actions {
    gap: 10px;
  }
}

/* Кнопки в линию для десктопов */
@media (min-width: 1001px) {
  .room-card__actions {
    flex-direction: row;
    flex-wrap: nowrap;
  }
}

@media (max-width: 900px) {
  .room-card {
    flex-direction: column;
    padding: var(--spacing-sm);
    align-items: stretch;
  }

  .room-card--reverse {
    flex-direction: column;
  }

  .room-card__image-wrapper {
    width: 100%;
    height: 280px;
  }

  .room-card__content {
    width: 100%;
    padding: var(--spacing-md);
  }

  .room-card__actions {
    justify-content: center;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .room-card {
    padding: var(--spacing-sm);
  }

  .room-card__image-wrapper {
    height: 220px;
    border-radius: 12px;
  }

  .room-card__content {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .room-card__actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .room-card__actions :deep(.template-btn) {
    width: 100%;
    justify-content: center;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .room-card {
    padding: var(--spacing-xs);
  }

  .room-card__image-wrapper {
    height: 180px;
    border-radius: 10px;
  }

  .room-card__content {
    padding: var(--spacing-xs);
    gap: 12px;
  }

  .room-card__feature {
    font-size: 14px;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .room-card {
    padding: 8px;
  }

  .room-card__image-wrapper {
    height: 160px;
  }

  .room-card__content {
    padding: 8px;
    gap: 10px;
  }

  .room-card__actions {
    gap: 6px;
  }
}
</style>
