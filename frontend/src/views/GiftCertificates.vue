<template>
  <div class="gift-page">
    <SiteHeader />
    <main class="gift-main">
      <div class="container">
        <h1 class="gift-title">Сертификаты</h1>
        
        <div class="certs-wrapper">
          <div v-for="cert in certificateTypes" :key="cert.id" class="cert-block">
            <CertificateBlock :cert="cert" />
          </div>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';
import CertificateBlock from '../components/CertificateBlock.vue';

const standartSert = "/img/standartSert.svg";
const battleArenaSert = "/img/battleArenaSert.svg";
const playstationSert = "/img/playstationSert.svg";
const vipSert = "/img/vipSert.svg";

const certificateTypes = [
  { id: 'standart', title: 'Common room', image: standartSert, isReversed: false, type: 'standard' },
  { id: 'battle', title: 'Battle Arena', image: battleArenaSert, isReversed: true, type: 'standard' },
  { id: 'vip', title: 'VIP room', image: vipSert, isReversed: false, type: 'standard' },
  { id: 'playstation', title: 'PlayStation', image: playstationSert, isReversed: true, type: 'playstation' }
];
</script>

<style scoped>
.gift-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
}

.gift-main {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
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

.certs-wrapper {
  width: 100%;
}

.cert-block {
  margin-bottom: var(--spacing-3xl);
}
</style>

<style>
@import url('../styles.css');
</style>
