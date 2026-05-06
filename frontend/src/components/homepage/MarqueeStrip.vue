<template>
  <div class="marquee-container">
    <div class="marquee-track" ref="trackRef">
      <div class="marquee-content">
        <img v-for="(img, index) in images" :key="index" :src="img" alt="" class="marquee-img" />
      </div>
      <div class="marquee-content">
        <img v-for="(img, index) in images" :key="`dup1-${index}`" :src="img" alt="" class="marquee-img" />
      </div>
       <div class="marquee-content">
        <img v-for="(img, index) in images" :key="`dup2-${index}`" :src="img" alt="" class="marquee-img" />
       </div>
    </div>
    <div class="marquee-overlay">
      <div class="marquee-content-wrapper">
        <img src="/img/logoColor.svg" alt="Logo" class="centered-logo" />
        <p class="marquee-slogan">-Лучший компьютерный клуб Мурома-</p>
        <div class="marquee-buttons">
          <TemplateButton variant="outlined-white" href="#reservation">Бронь</TemplateButton>
          <TemplateButton variant="outlined-white" href="#promotions">Акции</TemplateButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import TemplateButton from '../TemplateButton.vue';

const images = [
  '/img/image 6.png',
  '/img/image 7.png',
  '/img/image 8.png'
];

const trackRef = ref(null);
let animationId = null;
let position = 0;
let lastTimestamp = null;
let contentWidth = 0;

const SPEED = 20;

// Функция точного расчёта ширины
const updateWidth = () => {
  const track = trackRef.value;
  if (!track) return;
  
  const contents = track.querySelectorAll('.marquee-content');
  if (contents.length >= 2) {
    // Берём ширину первого блока с изображениями
    const width = contents[0].getBoundingClientRect().width;
    if (width > 0 && width !== contentWidth) {
      contentWidth = width;
      // Сбрасываем позицию при изменении ширины
      position = 0;
      if (track) {
        track.style.transform = `translateX(0px)`;
      }
    }
  }
};

onMounted(async () => {
  const track = trackRef.value;
  if (!track) return;
  
  // Ждём полной загрузки DOM
  await nextTick();
  
  // Функция запуска анимации после загрузки всех изображений
  const startAnimation = () => {
    const allImages = track.querySelectorAll('img');
    if (allImages.length === 0) {
      updateWidth();
      startAnimate();
      return;
    }
    
    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === allImages.length) {
        // Небольшая задержка для корректного расчёта ширины
        setTimeout(() => {
          updateWidth();
          startAnimate();
        }, 50);
      }
    };
    
    allImages.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
        img.addEventListener('error', checkAllLoaded);
      }
    });
  };
  
  // Запуск анимации
  const startAnimate = () => {
    if (animationId) cancelAnimationFrame(animationId);
    lastTimestamp = null;
    animationId = requestAnimationFrame(animate);
  };
  
  function animate(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    // Расчёт дельты с ограничением
    let delta = (timestamp - lastTimestamp) / 1000;
    if (delta > 0.1) delta = 0.033;
    
    // Двигаем позицию
    position += SPEED * delta;
    
    // Сброс позиции когда она превышает ширину контента
    if (contentWidth > 0) {
      while (position >= contentWidth) {
        position -= contentWidth;
      }
    }
    
    // Применяем трансформацию
    if (track) {
      track.style.transform = `translateX(-${position}px)`;
    }
    
    lastTimestamp = timestamp;
    animationId = requestAnimationFrame(animate);
  }
  
  startAnimation();
  
  // Пересчёт при изменении размера окна
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateWidth();
    }, 150);
  });
  
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', updateWidth);
  });
});
</script>

<style scoped>
.marquee-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  height: clamp(400px, 50vh, 650px);
  overflow: hidden;
  background: var(--c-bg);
}

/* Адаптивность для экранов >= 400px */
@media (min-width: 400px) and (max-width: 1200px) {
  .marquee-container {
    height: clamp(300px, 45vh, 500px);
  }

  .marquee-img {
    max-width: 400px;
  }
}

.marquee-track {
  display: flex;
  height: 100%;
  width: fit-content;
  will-change: transform;
  /* Убираем CSS-анимацию, используем JS */
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
}

.marquee-img {
  height: 100%;
  width: auto;
  object-fit: cover;
  margin-right: 10px;
  filter: brightness(0.6);
  flex-shrink: 0;
}

.marquee-img:last-child {
  margin-right: 0;
}

.marquee-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  padding: var(--spacing-md);
}

.marquee-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(30px, 5vw, 50px);
  transform: translateY(-60px);
  max-width: 100%;
}

.centered-logo {
  width: clamp(200px, 45vw, 800px);
  height: auto;
  max-width: 100%;
}

.marquee-buttons {
  display: flex;
  gap: clamp(15px, 3vw, 20px);
  pointer-events: auto;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.marquee-slogan {
  font-family: "Bowler", sans-serif;
  font-size: clamp(14px, 3vw, 24px);
  color: var(--c-white);
  margin: 0;
  text-align: center;
  padding: 0 var(--spacing-sm);
  line-height: 1.3;
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .marquee-container {
    height: clamp(500px, 55vh, 750px);
  }

  .marquee-slogan {
    font-size: clamp(18px, 3vw, 28px);
  }
}

/* Кнопки в линию для десктопов и планшетов */
@media (min-width: 601px) {
  .marquee-buttons {
    flex-direction: row;
    flex-wrap: nowrap;
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .marquee-container {
    height: clamp(350px, 45vh, 500px);
  }

  .marquee-content-wrapper {
    transform: translateY(-40px);
    gap: 35px;
  }

  .centered-logo {
    width: clamp(250px, 50vw, 500px);
  }

  .marquee-buttons {
    transform: none;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .marquee-container {
    height: clamp(300px, 50vh, 360px);
  }

  .marquee-content-wrapper {
    transform: translateY(-20px);
    gap: 25px;
  }

  .centered-logo {
    width: clamp(180px, 45vw, 300px);
  }

  .marquee-buttons {
    flex-direction: column;
    gap: 12px;
    transform: none;
  }

  .marquee-buttons :deep(.template-btn) {
    width: 220px !important;
    min-width: 200px;
    max-width: 280px;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .marquee-container {
    height: clamp(260px, 48vh, 300px);
  }

  .marquee-content-wrapper {
    transform: translateY(-15px);
    gap: 20px;
  }

  .centered-logo {
    width: clamp(150px, 50vw, 250px);
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .marquee-container {
    height: clamp(240px, 45vh, 260px);
  }

  .marquee-content-wrapper {
    transform: translateY(-10px);
    gap: 18px;
  }

  .centered-logo {
    width: clamp(130px, 48vw, 220px);
  }

  .marquee-slogan {
    padding: 0 var(--spacing-xs);
  }
}

/* Горизонтальная ориентация планшета */
@media (max-width: 900px) and (max-height: 500px) {
  .marquee-container {
    height: 100vh;
    max-height: 400px;
  }

  .marquee-content-wrapper {
    transform: translateY(0);
  }
}
</style>