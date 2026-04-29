<template>
  <div class="main-page">
    <SiteHeader />
    <MarqueeStrip />
    <GameHallsSection />
    <Cafe />
    <Sale />
    <Reservation />
    <GiftCertificates />
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
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}
</style>
