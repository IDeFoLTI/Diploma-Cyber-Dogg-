<template>
  <div class="logo-brand">
    <img class="logo-image logo-image--full" :src="logoUrl" alt="Cyber Dogg logo" />
    <img class="logo-image logo-image--min" :src="minLogoUrl" alt="Cyber Dogg logo" />
  </div>
</template>

<script setup>
const logoUrl = new URL("../../../img/logo.svg", import.meta.url).href;
const minLogoUrl = new URL("../../../img/minLogo.svg", import.meta.url).href;
</script>

<style scoped>
.logo-brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-image {
  max-width: clamp(200px, 30vw, 320px);
  max-height: clamp(50px, 8vw, 80px);
  object-fit: contain;
  display: block;
  transition: max-width 0.3s ease, max-height 0.3s ease;
}

.logo-image--min {
  display: none;
  max-width: clamp(80px, 15vw, 120px);
  max-height: clamp(40px, 6vw, 64px);
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .logo-image--full {
    max-width: clamp(250px, 35vw, 380px);
    max-height: clamp(60px, 9vw, 90px);
  }
}

@media (max-width: 1100px) {
  .logo-image--full {
    display: none;
  }

  .logo-image--min {
    display: block;
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .logo-image--min {
    max-width: clamp(70px, 12vw, 110px);
    max-height: clamp(35px, 5vw, 60px);
  }
}

@media (max-width: 700px) {
  .logo-brand {
    justify-content: center;
  }

  .logo-image--min {
    max-width: clamp(60px, 10vw, 100px);
    max-height: clamp(32px, 4.5vw, 58px);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .logo-image--min {
    max-width: clamp(55px, 9vw, 90px);
    max-height: clamp(30px, 4vw, 55px);
  }
}

@media (max-width: 500px) {
  .logo-image--min {
    max-width: clamp(50px, 8vw, 80px);
    max-height: clamp(28px, 3.5vw, 52px);
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 400px) {
  .logo-image--min {
    max-width: clamp(45px, 7vw, 70px);
    max-height: clamp(26px, 3vw, 48px);
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .logo-image--min {
    max-width: clamp(40px, 6vw, 65px);
    max-height: clamp(24px, 2.5vw, 45px);
  }
}
</style>
