<template>
  <div class="gift-page">
    <SiteHeader />
    <div class="container">
        <h1 class="gift-title">Сертификаты</h1>
        
        <div class="certs-wrapper">
          <div v-for="cert in certificateTypes" :key="cert.id" class="cert-block">
            <CertificateBlock :cert="cert" @submit="handleCertificateSubmit" />
          </div>
        </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';
import CertificateBlock from '../components/CertificateBlock.vue';

const router = useRouter();

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

const handleCertificateSubmit = (data) => {
  // Проверка авторизации
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    alert('Для покупки сертификата необходимо авторизоваться');
    router.push('/login');
    return;
  }
  
  // Переход на страницу покупки с предзаполненными данными
  router.push({
    path: '/buy-certificate',
    query: {
      hall: data.certId,
      hallTitle: data.certTitle,
      type: data.type,
      ...(data.type === 'standard' 
        ? { time: data.time, hours: data.hours, package: data.package }
        : { players: data.players, hours: data.hours }
      )
    }
  });
};
</script>

<style scoped>
.gift-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: calc(var(--header-height) + var(--spacing-xl)) var(--spacing-md) var(--spacing-xl);
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

.certs-wrapper {
  width: 100%;
}

.cert-block {
  margin-bottom: var(--spacing-3xl);
}

@media (max-width: 768px) {
  .container {
    padding: calc(var(--header-height) + var(--spacing-lg)) var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .container {
    padding: calc(var(--header-height) + var(--spacing-md)) var(--spacing-sm);
  }
}
</style>

<style>
@import url('../styles.css');
</style>
