<template>
  <section class="cafe-section">
    <div class="container">
      <h2 class="cafe-section__title">Напитки и кухня</h2>
      
      <div class="cafe-section__content">
        <!-- Левая колонка: Lime фото -->
        <div class="cafe-column">
          <div class="cafe-image-wrapper">
            <img :src="limeImage" alt="Lime" class="cafe-image" />
          </div>
          <div class="cafe-button">
            <TemplateButton variant="outlined-white" href="/menu">Меню</TemplateButton>
          </div>
        </div>

        <!-- Центральная колонка: Текст -->
        <div class="cafe-text-column">
          <p class="cafe-text-paragraph">
            Между клатчами так важно восстановить водный баланс. Ледяная пепси-кола, холодный чай со льдом и малиной или классический спрайт — выбирай любимый вкус и возвращайся доминировать!</p>
          <p class="cafe-text-paragraph">
            Наши повара с опытом и страстью к своему делу создают уникальные вкусовые сочетания, которые понравятся каждому гостю. Заходите к нам и попробуйте лучшее!
          </p>
        </div>

        <!-- Правая колонка: Burger фото -->
        <div class="cafe-column">
          <div class="cafe-image-wrapper">
            <img :src="burgerImage" alt="Burger" class="cafe-image" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TemplateButton from '../TemplateButton.vue';

const limeImage = '/img/lime.png';
const burgerImage = '/img/burgerCafe.png';
</script>

<style scoped>
.cafe-section {
  padding: var(--spacing-xl) 0;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.cafe-section__title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  margin: 0 0 var(--spacing-lg) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  line-height: 1.2;
}

.cafe-section__title::after {
  content: "";
  display: block;
  width: clamp(60px, 10vw, 100px);
  height: 3px;
  background: var(--c-accent);
  margin: 20px auto 0;
  border-radius: 2px;
}

.container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cafe-section__content {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
}

.cafe-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  max-width: 300px;
}

.cafe-image-wrapper {
  width: 100%;
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cafe-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 20px;
}

.cafe-button {
  margin-top: var(--spacing-sm);
}

.cafe-text-column {
  flex: 1.5;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: left;
}

.cafe-text-paragraph {
  font-family: "Roboto", sans-serif;
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  color: var(--c-white);
  line-height: 1.6;
  text-align: left;
  position: relative;
  padding: var(--spacing-sm) 10px;
}

.cafe-text-paragraph:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--c-white);
  transform: translateY(50%);
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .cafe-section {
    padding: calc(var(--spacing-xl) * 1.2) 0;
  }

  .cafe-section__title {
    font-size: clamp(36px, 5vw, 52px);
  }

  .cafe-image-wrapper {
    height: 320px;
  }

  .cafe-text-column {
    max-width: 650px;
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .cafe-section {
    padding: var(--spacing-lg) 0;
  }

  .cafe-section__title {
    font-size: clamp(28px, 4vw, 34px);
    margin-bottom: var(--spacing-md);
  }

  .cafe-section__content {
    gap: var(--spacing-lg);
  }

  .cafe-image-wrapper {
    height: 250px;
  }

  .cafe-text-column {
    max-width: 400px;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .cafe-section {
    padding: var(--spacing-md) 0;
  }

  .cafe-section__title {
    font-size: clamp(22px, 5vw, 26px);
    margin-bottom: var(--spacing-sm);
    letter-spacing: 0.08em;
  }

  .cafe-section__content {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .cafe-column {
    max-width: 100%;
    width: 100%;
  }

  .cafe-image-wrapper {
    height: 240px;
  }

  .cafe-button {
    width: 100%;
  }

  .cafe-button :deep(.template-btn) {
    width: 100% !important;
    max-width: none;
  }

  .cafe-text-column {
    max-width: 100%;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .cafe-section {
    padding: var(--spacing-sm) 0;
  }

  .cafe-section__title {
    font-size: clamp(20px, 4.5vw, 22px);
  }

  .cafe-image-wrapper {
    height: 200px;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .cafe-section {
    padding: var(--spacing-xs) 0;
  }

  .cafe-section__title {
    font-size: clamp(18px, 4vw, 20px);
    letter-spacing: 0.06em;
  }

  .cafe-image-wrapper {
    height: 180px;
  }
}
</style>
