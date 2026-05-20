<template>
  <div class="price-page">
    <SiteHeader />
    <div class="container">
      <h1 class="price-title">Цены</h1>
      
      <div v-if="loading" class="loading">Загрузка цен...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="price-blocks">
        <div v-for="zone in zones" :key="zone.id" class="price-block">
          <div class="hall-header">
            <span class="hall-name">{{ zone.name }}</span>
            <span v-if="zone.computer_count" class="hall-computers">{{ zone.computer_count }}PC</span>
          </div>
          
          <!-- Цены для игровых залов -->
          <template v-if="zone.zone_type === 'gaming' || zone.zone_type === 'vip'">
            <div class="price-tables">
              <!-- ПН-ЧТ -->
              <div class="price-table-container">
                <h3 class="section-title">ПН-ЧТ</h3>
                <table class="price-table">
                  <thead>
                    <tr>
                      <th>Период</th>
                      <th>1 час</th>
                      <th>3 часа</th>
                      <th>5 часов</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ДЕНЬ</td>
                      <td>{{ getPrice(zone.prices, 'weekday', 'day') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekday', '3hours') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekday', '5hours') || '-' }}</td>
                    </tr>
                    <tr>
                      <td>ВЕЧЕР</td>
                      <td>{{ getPrice(zone.prices, 'weekday', 'evening') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekday', 'evening3hours') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekday', 'evening5hours') || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- ПТ-ВС -->
              <div class="price-table-container">
                <h3 class="section-title">ПТ-ВС</h3>
                <table class="price-table">
                  <thead>
                    <tr>
                      <th>Период</th>
                      <th>1 час</th>
                      <th>3 часа</th>
                      <th>5 часов</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ДЕНЬ</td>
                      <td>{{ getPrice(zone.prices, 'weekend', 'day') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekend', '3hours') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekend', '5hours') || '-' }}</td>
                    </tr>
                    <tr>
                      <td>ВЕЧЕР</td>
                      <td>{{ getPrice(zone.prices, 'weekend', 'evening') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekend', 'evening3hours') || '-' }}</td>
                      <td>{{ getPrice(zone.prices, 'weekend', 'evening5hours') || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Ночь и Кибер сутки (общие для обоих периодов) -->
            <div class="price-info">
              <span v-if="getPriceWithRange(zone.prices, 'night', 'night')" class="price-info-item">
                Ночь ({{ getPriceTimeRange(zone.prices, 'night', 'night') || '22:00-08:00' }}) — {{ getPrice(zone.prices, 'night', 'night') }}
              </span>
              <span v-if="getPrice(zone.prices, 'any', 'cyberday')" class="price-info-item">
                Кибер сутки (ПН-ПТ) — {{ getPrice(zone.prices, 'any', 'cyberday') }}
              </span>
              <span v-if="getPrice(zone.prices, 'any', 'weekend_cyberday')" class="price-info-item">
                Кибер сутки (ПТ-ВС) — {{ getPrice(zone.prices, 'any', 'weekend_cyberday') }}
              </span>
            </div>
          </template>
          
          <!-- Цены для PlayStation -->
          <template v-else-if="zone.zone_type === 'playstation'">
            <!-- ДО 7 ЧЕЛОВЕК -->
            <div class="ps-section">
              <h3 class="ps-section-title">ДО 7 ЧЕЛОВЕК</h3>
              <div class="price-tables">
                <div class="price-table-container">
                  <h4 class="ps-sub-title">ПН-ЧТ</h4>
                  <table class="price-table">
                    <thead>
                      <tr>
                        <th class="period-col"></th>
                        <th>1 час</th>
                        <th>3 часа</th>
                        <th>5 часов</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="period-col">ДЕНЬ</td>
                        <td>{{ getPrice(zone.prices, 'weekday', 'day_7people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekday', '3hours_7people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekday', '5hours_7people') || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="price-table-container">
                  <h4 class="ps-sub-title">ПТ-ВС</h4>
                  <table class="price-table">
                    <thead>
                      <tr>
                        <th class="period-col"></th>
                        <th>1 час</th>
                        <th>3 часа</th>
                        <th>5 часов</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="period-col">ДЕНЬ</td>
                        <td>{{ getPrice(zone.prices, 'weekend', 'day_7people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekend', '3hours_7people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekend', '5hours_7people') || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- ДО 5 ЧЕЛОВЕК -->
            <div class="ps-section">
              <h3 class="ps-section-title">ДО 5 ЧЕЛОВЕК</h3>
              <div class="price-tables">
                <div class="price-table-container">
                  <h4 class="ps-sub-title">ПН-ЧТ</h4>
                  <table class="price-table">
                    <thead>
                      <tr>
                        <th class="period-col"></th>
                        <th>1 час</th>
                        <th>3 часа</th>
                        <th>5 часов</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="period-col">ДЕНЬ</td>
                        <td>{{ getPrice(zone.prices, 'weekday', 'day_5people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekday', '3hours_5people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekday', '5hours_5people') || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="price-table-container">
                  <h4 class="ps-sub-title">ПТ-ВС</h4>
                  <table class="price-table">
                    <thead>
                      <tr>
                        <th class="period-col"></th>
                        <th>1 час</th>
                        <th>3 часа</th>
                        <th>5 часов</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="period-col">ДЕНЬ</td>
                        <td>{{ getPrice(zone.prices, 'weekend', 'day_5people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekend', '3hours_5people') || '-' }}</td>
                        <td>{{ getPrice(zone.prices, 'weekend', '5hours_5people') || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Расписание работы клуба -->
        <div class="price-block schedule-block">
          <div class="hall-header">
            <span class="hall-name">Расписание работы клуба</span>
          </div>
          <div class="price-tables schedule-tables">
            <table class="price-table">
              <thead>
                <tr>
                  <th>Период</th>
                  <th>Время работы</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ДЕНЬ</td>
                  <td>08:00 — 15:00</td>
                </tr>
                <tr>
                  <td>ВЕЧЕР</td>
                  <td>15:00 — 22:00</td>
                </tr>
                <tr>
                  <td>НОЧЬ</td>
                  <td>22:00 — 08:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const zones = ref([]);
const loading = ref(false);
const error = ref('');

async function loadPrices() {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await fetch(`${API_URL}/api/prices`);
    if (!response.ok) throw new Error('Не удалось загрузить цены');
    
    const data = await response.json();
    zones.value = data.zones || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

function getPrice(prices, period, duration) {
  const price = prices.find(p => p.period === period && p.duration === duration);
  return price ? price.price : null;
}

function getPriceWithRange(prices, period, duration) {
  return prices.some(p => p.period === period && p.duration === duration && p.time_range);
}

function getPriceTimeRange(prices, period, duration) {
  const price = prices.find(p => p.period === period && p.duration === duration);
  return price?.time_range || null;
}

onMounted(() => {
  loadPrices();
});
</script>

<style scoped>
.price-page {
  min-height: 100vh;
  background: var(--c-bg);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: calc(var(--header-height) + var(--spacing-xl)) var(--spacing-lg) var(--spacing-xl);
}

.price-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 var(--spacing-xl) 0;
  text-shadow: 0 4px 20px rgba(0, 140, 209, 0.3);
}

.price-blocks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
}

.error {
  color: var(--c-danger);
}

.price-block {
  background: var(--c-bg);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.price-block::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
}

.price-block:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 140, 209, 0.5);
  box-shadow: 0 16px 48px rgba(0, 140, 209, 0.25);
}

.price-block:hover::before {
  background: var(--c-accent);
}

.hall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.hall-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.hall-name {
  font-family: "Kingslay", sans-serif;
  font-size: clamp(26px, 2.5vw, 30px);
  font-weight: 400;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hall-computers {
  font-family: "Bowler", sans-serif;
  font-size: clamp(18px, 1.5vw, 22px);
  color: var(--c-white);
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  background: rgba(0, 140, 209, 0.2);
  border-radius: 8px;
}

.price-section {
  margin-bottom: var(--spacing-xl);
}

.price-section:last-child {
  margin-bottom: 0;
}

.price-tables {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  width: 100%;
  overflow: hidden;
}

.price-table-container {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 700;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 var(--spacing-lg) 0;
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 0 8px 8px 0;
}

.sub-section-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 600;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 var(--spacing-md) 0;
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.08);
  border-left: 3px solid rgba(0, 140, 209, 0.5);
  border-radius: 0 6px 6px 0;
}

/* PlayStation стили */
.ps-section {
  margin-bottom: var(--spacing-xl);
}

.ps-section:last-child {
  margin-bottom: 0;
}

.ps-section-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 700;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 var(--spacing-lg) 0;
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 0 8px 8px 0;
}

.ps-sub-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 600;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 var(--spacing-md) 0;
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.08);
  border-left: 3px solid rgba(0, 140, 209, 0.5);
  border-radius: 0 6px 6px 0;
}

.price-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(255, 255, 255, 0.03);
  table-layout: fixed;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.95;
}

.price-table th,
.price-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  word-break: break-word;
  white-space: normal;
  border: none;
}

.price-table th {
  font-family: "Bowler", sans-serif;
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: 600;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: var(--spacing-md) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.price-table td {
  font-family: "Bowler", sans-serif;
  font-size: clamp(16px, 2.5vw, 18px);
  color: var(--c-white);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--spacing-md) var(--spacing-sm);
  transition: background 0.2s ease;
}

.price-table tbody tr:nth-child(odd) td {
  background: rgba(255, 255, 255, 0.02);
}

.price-table tbody tr:hover td {
  background: rgba(0, 140, 209, 0.15);
}

.price-table td:first-child {
  font-weight: 600;
  color: var(--c-white);
  text-align: center;
}

.price-table th.period-col,
.price-table td.period-col {
  width: 60px;
  min-width: 60px;
  white-space: nowrap;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  text-align: left;
}

.price-info-item {
  font-family: "Bowler", sans-serif;
  font-size: clamp(14px, 2vw, 16px);
  color: var(--c-white-50);
  text-align: left;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
}

/* Расписание работы клуба */
.schedule-block {
  background: var(--c-bg);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: var(--spacing-lg);
  margin-top: var(--spacing-3xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.schedule-block::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
}

.schedule-block:hover {
  border-color: rgba(0, 140, 209, 0.5);
  box-shadow: 0 16px 48px rgba(0, 140, 209, 0.25);
}

.schedule-block:hover::before {
  background: var(--c-accent);
}

.schedule-block .hall-name {
  font-family: "Bowler", sans-serif;
  font-size: clamp(24px, 2.5vw, 28px);
  font-weight: 600;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.schedule-tables {
  display: block;
  width: 100%;
}

.schedule-tables .price-table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.schedule-tables .price-table th {
  font-family: "Bowler", sans-serif !important;
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: 600;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: var(--spacing-md) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.08);
}

.schedule-tables .price-table td {
  font-family: "Bowler", sans-serif !important;
  font-size: clamp(15px, 2.5vw, 18px);
  color: var(--c-white);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.schedule-tables .price-table tbody tr:nth-child(odd) td {
  background: rgba(255, 255, 255, 0.02);
}

.schedule-tables .price-table tbody tr:hover td {
  background: rgba(0, 140, 209, 0.15);
}

@media (max-width: 1024px) {
  .container {
    max-width: 100%;
    padding: calc(var(--header-height) + var(--spacing-xl)) var(--spacing-md);
  }

  .price-blocks {
    gap: var(--spacing-lg);
  }

  .price-tables {
    grid-template-columns: 1fr;
  }

  .price-block {
    padding: var(--spacing-md);
  }

  .hall-name {
    font-size: clamp(22px, 3vw, 26px);
  }

  .hall-computers {
    font-size: clamp(16px, 2vw, 20px);
    padding: 6px 12px;
  }
}

/* Адаптивность для маленьких экранов */
@media (max-width: 768px) {
  .container {
    padding: calc(var(--header-height) + var(--spacing-lg)) var(--spacing-md);
  }

  .price-title {
    font-size: clamp(24px, 5vw, 32px);
    margin-bottom: var(--spacing-lg);
  }

  .price-block {
    padding: var(--spacing-md);
    border-radius: 16px;
  }

  .price-block:hover {
    transform: translateY(-4px);
  }

  .hall-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
    align-items: center;
  }

  .hall-name {
    font-size: clamp(20px, 4vw, 24px);
  }

  .hall-computers {
    font-size: clamp(16px, 3vw, 20px);
    padding: 8px 16px;
  }

  .price-table th,
  .price-table td {
    padding: var(--spacing-sm) 6px;
  }

  .price-table th {
    font-size: clamp(14px, 2.5vw, 18px);
  }

  .price-table td {
    font-size: clamp(14px, 2.5vw, 17px);
  }

  .price-info-item {
    font-size: clamp(13px, 2.5vw, 15px);
  }

  .schedule-block {
    padding: var(--spacing-md);
    border-radius: 16px;
  }

  .schedule-block .hall-name {
    font-size: clamp(20px, 4vw, 24px);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 480px) {
  .container {
    padding: calc(var(--header-height) + var(--spacing-md)) var(--spacing-sm);
  }

  .price-block {
    padding: var(--spacing-sm);
    border-radius: 14px;
  }

  .price-block:hover {
    transform: translateY(-2px);
  }

  .hall-header {
    padding: var(--spacing-sm) 0;
    margin-bottom: var(--spacing-md);
    gap: var(--spacing-sm);
  }

  .hall-name {
    font-size: clamp(18px, 4vw, 22px);
  }

  .hall-computers {
    font-size: clamp(14px, 3vw, 18px);
    padding: 6px 12px;
  }

  .price-table th,
  .price-table td {
    padding: 6px 4px;
    font-size: clamp(13px, 2.5vw, 16px);
  }

  .price-table td:first-child {
    font-size: clamp(13px, 2.5vw, 16px);
  }

  .price-info {
    margin-top: var(--spacing-sm);
    gap: var(--spacing-xs);
  }

  .price-info-item {
    font-size: clamp(12px, 2.5vw, 14px);
    padding: 6px 10px;
  }

  .schedule-block {
    padding: var(--spacing-sm);
    border-radius: 14px;
  }

  .schedule-block .hall-name {
    font-size: clamp(18px, 4vw, 22px);
  }

  .section-title {
    font-size: clamp(15px, 2.5vw, 18px);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .price-title {
    font-size: clamp(20px, 4.5vw, 28px);
  }

  .hall-name {
    font-size: clamp(16px, 3.5vw, 20px);
  }

  .hall-computers {
    font-size: clamp(13px, 2.5vw, 16px);
    padding: 5px 10px;
  }

  .price-table th,
  .price-table td {
    font-size: clamp(12px, 2.5vw, 15px);
    padding: 5px 3px;
  }

  .price-table td:first-child {
    font-size: clamp(12px, 2.5vw, 15px);
  }

  .price-info-item {
    font-size: clamp(11px, 2.5vw, 13px);
  }
}
</style>
