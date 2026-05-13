<template>
  <div class="main-page">
    <SiteHeader />

    <main class="home-sections">
      <section class="homepage-section homepage-section--marquee">
        <MarqueeStrip />
      </section>
      <section class="homepage-section homepage-section--game-halls">
        <GameHallsSection />
      </section>
      <section class="homepage-section homepage-section--cafe">
        <Cafe />
      </section>
      <section class="homepage-section homepage-section--sale">
        <Sale />
      </section>
      <section class="homepage-section homepage-section--reservation">
        <Reservation />
      </section>
      <section class="homepage-section homepage-section--gift-certificates">
        <GiftCertificates />
      </section>
      <section class="homepage-section homepage-section--gaming-accessories">
        <GamingAccessories />
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from "../components/header/SiteHeader.vue";
import SiteFooter from "../components/footer/SiteFooter.vue";
import MarqueeStrip from "../components/homepage/MarqueeStrip.vue";
import GameHallsSection from "../components/homepage/GameHallsSection.vue";
import Cafe from "../components/homepage/Cafe.vue";
import Sale from "../components/homepage/Sale.vue";
import Reservation from "../components/homepage/Reservation.vue";
import GiftCertificates from "../components/homepage/GiftCertificates.vue";
import GamingAccessories from "../components/homepage/GamingAccessories.vue";
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.home-sections {
  display: flex;
  flex-direction: column;
  gap: clamp(26px, 3vw, 44px);
}

.homepage-section {
  padding: clamp(24px, 2.5vw, 48px) 0;
}

.homepage-section + .homepage-section {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.homepage-section--gift-certificates {
  border-top: none;
}

.homepage-section--marquee {
  padding-top: 0;
}

.homepage-section--game-halls,
.homepage-section--gift-certificates {
  padding-top: clamp(32px, 3vw, 56px);
}

@media (max-width: 900px) {
  .home-sections {
    gap: clamp(18px, 5vw, 32px);
  }

  .homepage-section {
    padding: clamp(18px, 4vw, 32px) 0;
  }
}
</style>
