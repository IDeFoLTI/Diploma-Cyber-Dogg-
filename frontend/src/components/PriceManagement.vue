<template>
  <div class="price-management">
    <div class="price-header">
      <h2>Управление ценами на залы</h2>
      <button class="add-zone-btn" @click="showAddZoneModal = true">
        + Добавить зал
      </button>
    </div>

    <!-- Список залов -->
    <div v-if="loading" class="loading">Загрузка залов...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="zones-list">
      <div 
        v-for="zone in priceZones" 
        :key="zone.id"
        :class="['zone-card', { active: selectedZone?.id === zone.id }]"
        @click="selectZone(zone)"
      >
        <div class="zone-info">
          <div class="zone-name">{{ zone.name }}</div>
          <div class="zone-actions" @click.stop>
            <button class="edit-zone-btn" @click="editZone(zone)">
              Редактировать
            </button>
            <button class="delete-zone-btn" @click="deleteZone(zone.id)">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Секция выбранного зала с ценами -->
    <div v-if="selectedZone" class="zone-details">
      <div class="details-header">
        <h3>{{ selectedZone.name }}</h3>
        <div class="header-actions">
          <button class="add-price-btn" @click="showAddPriceModal = true">
            + Добавить цену
          </button>
        </div>
      </div>

      <!-- Цены - столбиком -->
      <div v-if="loadingPrices" class="loading">Загрузка цен...</div>
      <div v-else-if="selectedZone.prices?.length === 0" class="empty">
        Нет цен для этого зала. Нажмите "Добавить цену"
      </div>
      <div v-else class="prices-list">
        <div 
          v-for="period in pricesByPeriod" 
          :key="period.period"
          class="period-block"
        >
          <div class="period-header">
            <h4>{{ formatPeriodName(period.period) }}</h4>
          </div>
          <div class="prices-table">
            <table>
              <thead>
                <tr>
                  <th>Длительность</th>
                  <th>Цена (₽)</th>
                  <th>Диапазон</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="price in period.prices" :key="price.id">
                  <td>{{ formatDuration(price.duration) }}</td>
                  <td>
                    <input 
                      v-model.number="price.price" 
                      type="number"
                      class="price-input"
                      @blur="updatePrice(price)"
                    />
                  </td>
                  <td>{{ price.time_range || '-' }}</td>
                  <td>
                    <button class="delete-price-btn" @click="deletePrice(price.id)">
                      ✕
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка: Добавить зал -->
    <div v-if="showAddZoneModal" class="modal-overlay" @click="showAddZoneModal = false">
      <div class="modal" @click.stop>
        <h3>Добавить зал</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Название *</label>
            <input v-model="addZoneForm.name" type="text" placeholder="Например: VIP Room" />
          </div>
          <div class="form-group">
            <label>Количество компьютеров</label>
            <input v-model.number="addZoneForm.computerCount" type="number" placeholder="10" />
          </div>
          <div class="form-group">
            <label>Тип</label>
            <select v-model="addZoneForm.zoneType">
              <option value="gaming">Игровой зал</option>
              <option value="playstation">PlayStation</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label>Порядок отображения</label>
            <input v-model.number="addZoneForm.sortOrder" type="number" placeholder="1" />
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showAddZoneModal = false">Отмена</button>
            <button class="modal-confirm" @click="addZone">Добавить</button>
          </div>
          <div v-if="zoneError" class="modal-error">{{ zoneError }}</div>
          <div v-if="zoneSuccess" class="modal-success">{{ zoneSuccess }}</div>
        </div>
      </div>
    </div>

    <!-- Модалка: Редактировать зал -->
    <div v-if="showEditZoneModal" class="modal-overlay" @click="showEditZoneModal = false">
      <div class="modal" @click.stop>
        <h3>Редактировать зал</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Название *</label>
            <input v-model="editZoneForm.name" type="text" />
          </div>
          <div class="form-group">
            <label>Количество компьютеров</label>
            <input v-model.number="editZoneForm.computerCount" type="number" />
          </div>
          <div class="form-group">
            <label>Тип</label>
            <select v-model="editZoneForm.zoneType">
              <option value="gaming">Игровой зал</option>
              <option value="playstation">PlayStation</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label>Порядок отображения</label>
            <input v-model.number="editZoneForm.sortOrder" type="number" />
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showEditZoneModal = false">Отмена</button>
            <button class="modal-confirm" @click="updateZone">Сохранить</button>
          </div>
          <div v-if="zoneError" class="modal-error">{{ zoneError }}</div>
          <div v-if="zoneSuccess" class="modal-success">{{ zoneSuccess }}</div>
        </div>
      </div>
    </div>

    <!-- Модалка: Добавить цену -->
    <div v-if="showAddPriceModal" class="modal-overlay" @click="showAddPriceModal = false">
      <div class="modal" @click.stop>
        <h3>Добавить цену</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Период *</label>
            <select v-model="addPriceForm.period">
              <option value="weekday">ПН-ЧТ</option>
              <option value="weekend">ПТ-ВС</option>
              <option value="night">Ночь (22:00-08:00)</option>
              <option value="any">Любой день</option>
            </select>
          </div>
          <div class="form-group">
            <label>Длительность *</label>
            <select v-model="addPriceForm.duration">
              <optgroup label="Гaming залы">
                <option value="day">День (1 час)</option>
                <option value="3hours">3 часа</option>
                <option value="5hours">5 часов</option>
                <option value="evening">Вечер (1 час)</option>
                <option value="evening3hours">Вечер 3 часа</option>
                <option value="evening5hours">Вечер 5 часов</option>
                <option value="night">Ночь</option>
                <option value="cyberday">Кибер сутки</option>
              </optgroup>
              <optgroup label="PlayStation">
                <option value="day_7people">День до 7 человек</option>
                <option value="3hours_7people">3 часа до 7 человек</option>
                <option value="5hours_7people">5 часов до 7 человек</option>
                <option value="day_5people">День до 5 человек</option>
                <option value="3hours_5people">3 часа до 5 человек</option>
                <option value="5hours_5people">5 часов до 5 человек</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group">
            <label>Цена (₽) *</label>
            <input v-model.number="addPriceForm.price" type="number" placeholder="100" />
          </div>
          <div class="form-group">
            <label>Диапазон времени</label>
            <input v-model="addPriceForm.timeRange" type="text" placeholder="22:00-08:00" />
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showAddPriceModal = false">Отмена</button>
            <button class="modal-confirm" @click="addPrice">Добавить</button>
          </div>
          <div v-if="priceError" class="modal-error">{{ priceError }}</div>
          <div v-if="priceSuccess" class="modal-success">{{ priceSuccess }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const priceZones = ref([]);
const selectedZone = ref(null);
const prices = ref([]);
const loading = ref(false);
const loadingPrices = ref(false);
const error = ref('');

// Модалки
const showAddZoneModal = ref(false);
const showEditZoneModal = ref(false);
const showAddPriceModal = ref(false);

// Формы
const addZoneForm = ref({
  name: '',
  computerCount: null,
  zoneType: 'gaming',
  sortOrder: 1
});
const editZoneForm = ref({
  id: null,
  name: '',
  computerCount: null,
  zoneType: 'gaming',
  sortOrder: 1
});
const addPriceForm = ref({
  period: 'weekday',
  duration: 'day',
  price: null,
  timeRange: ''
});

// Ошибки и успехи
const zoneError = ref('');
const zoneSuccess = ref('');
const priceError = ref('');
const priceSuccess = ref('');

// Загрузка зон
async function loadZones() {
  loading.value = true;
  error.value = '';

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices/zones`, {
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось загрузить зоны');

    const data = await response.json();
    priceZones.value = data.zones || [];
    
    // Загрузить цены для каждой зоны
    for (const zone of priceZones.value) {
      await loadZonePrices(zone.id);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function loadZonePrices(zoneId) {
  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices/zones/${zoneId}/prices`, {
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось загрузить цены');

    const data = await response.json();
    const zone = priceZones.value.find(z => z.id === zoneId);
    if (zone) {
      zone.prices = data.prices || [];
    }
  } catch (err) {
    console.error('Load prices error:', err);
  }
}

function selectZone(zone) {
  selectedZone.value = zone;
  prices.value = zone.prices || [];
}

function editZone(zone) {
  editZoneForm.value = {
    id: zone.id,
    name: zone.name,
    computerCount: zone.computer_count,
    zoneType: zone.zone_type,
    sortOrder: zone.sort_order
  };
  showEditZoneModal.value = true;
}

async function addZone() {
  zoneError.value = '';
  zoneSuccess.value = '';

  if (!addZoneForm.value.name.trim()) {
    zoneError.value = 'Введите название зала';
    return;
  }

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices/zones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify(addZoneForm.value)
    });

    if (!response.ok) throw new Error('Не удалось добавить зал');

    zoneSuccess.value = 'Зал добавлен!';
    addZoneForm.value = { name: '', computerCount: null, zoneType: 'gaming', sortOrder: 1 };
    
    setTimeout(() => {
      showAddZoneModal.value = false;
      zoneSuccess.value = '';
      loadZones();
    }, 1500);
  } catch (err) {
    zoneError.value = err.message;
  }
}

async function updateZone() {
  zoneError.value = '';
  zoneSuccess.value = '';

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices/zones/${editZoneForm.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify(editZoneForm.value)
    });

    if (!response.ok) throw new Error('Не удалось обновить зал');

    zoneSuccess.value = 'Зал обновлен!';
    
    setTimeout(() => {
      showEditZoneModal.value = false;
      zoneSuccess.value = '';
      loadZones();
    }, 1500);
  } catch (err) {
    zoneError.value = err.message;
  }
}

async function deleteZone(zoneId) {
  if (!confirm('Удалить зал и все его цены?')) return;

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices/zones/${zoneId}`, {
      method: 'DELETE',
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось удалить зал');

    if (selectedZone.value?.id === zoneId) {
      selectedZone.value = null;
      prices.value = [];
    }
    
    loadZones();
  } catch (err) {
    alert('Не удалось удалить зал: ' + err.message);
  }
}

async function addPrice() {
  priceError.value = '';
  priceSuccess.value = '';

  if (!addPriceForm.value.price || addPriceForm.value.price <= 0) {
    priceError.value = 'Укажите корректную цену';
    return;
  }

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify({
        zoneId: selectedZone.value.id,
        ...addPriceForm.value
      })
    });

    if (!response.ok) throw new Error('Не удалось добавить цену');

    priceSuccess.value = 'Цена добавлена!';
    addPriceForm.value = { period: 'weekday', duration: 'day', price: null, timeRange: '' };
    
    setTimeout(() => {
      showAddPriceModal.value = false;
      priceSuccess.value = '';
      loadZones();
    }, 1500);
  } catch (err) {
    priceError.value = err.message;
  }
}

async function updatePrice(price) {
  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices/${price.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify({ price: price.price })
    });

    if (!response.ok) throw new Error('Не удалось обновить цену');
  } catch (err) {
    console.error('Update price error:', err);
    alert('Не удалось обновить цену: ' + err.message);
    // Возврат к предыдущему значению можно добавить здесь
  }
}

async function deletePrice(priceId) {
  if (!confirm('Удалить цену?')) return;

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/prices/${priceId}`, {
      method: 'DELETE',
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось удалить цену');

    loadZones();
  } catch (err) {
    alert('Не удалось удалить цену: ' + err.message);
  }
}

function formatZoneType(type) {
  const types = {
    gaming: 'Игровой',
    playstation: 'PlayStation',
    vip: 'VIP'
  };
  return types[type] || type;
}

function formatPeriodName(period) {
  const periods = {
    weekday: 'ПН-ЧТ',
    weekend: 'ПТ-ВС',
    night: 'Ночь',
    any: 'Любой день'
  };
  return periods[period] || period;
}

function formatDuration(duration) {
  const durations = {
    day: 'День (1 час)',
    '3hours': '3 часа',
    '5hours': '5 часов',
    evening: 'Вечер (1 час)',
    'evening3hours': 'Вечер 3 часа',
    'evening5hours': 'Вечер 5 часов',
    night: 'Ночь',
    cyberday: 'Кибер сутки',
    'day_7people': 'День до 7 чел',
    '3hours_7people': '3 часа до 7 чел',
    '5hours_7people': '5 часов до 7 чел',
    'day_5people': 'День до 5 чел',
    '3hours_5people': '3 часа до 5 чел',
    '5hours_5people': '5 часов до 5 чел'
  };
  return durations[duration] || duration;
}

// Группировка цен по периодам
const pricesByPeriod = computed(() => {
  if (!selectedZone.value?.prices) return [];
  
  const grouped = {};
  for (const price of selectedZone.value.prices) {
    if (!grouped[price.period]) {
      grouped[price.period] = {
        period: price.period,
        prices: []
      };
    }
    grouped[price.period].prices.push(price);
  }
  
  return Object.values(grouped);
});

onMounted(() => {
  loadZones();
});
</script>

<style scoped>
.price-management {
  width: 100%;
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.price-header h2 {
  font-family: "Kingslay", sans-serif;
  font-size: clamp(24px, 2vw, 28px);
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 10px rgba(0, 140, 209, 0.3);
}

.add-zone-btn {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid rgba(0, 140, 209, 0.4);
  color: var(--c-accent);
  cursor: pointer;
  border-radius: 12px;
  font-size: var(--font-sm);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
}

.add-zone-btn:hover {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-white);
}

.loading, .empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.4);
  font-family: "Roboto", sans-serif;
}

.error {
  color: var(--c-danger);
  padding: var(--spacing-md);
  text-align: center;
  background: rgba(225, 30, 36, 0.1);
  border-radius: 8px;
  font-family: "Roboto", sans-serif;
}

.zones-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.zone-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
}

.zone-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 140, 209, 0.3);
}

.zone-card.active {
  background: rgba(0, 140, 209, 0.1);
  border-color: var(--c-accent);
}

.zone-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.zone-name {
  font-family: "Kingslay", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  font-weight: 500;
  text-transform: uppercase;
}

.zone-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: auto;
}

.edit-zone-btn, .delete-zone-btn {
  width: 100%;
  text-align: center;
  padding: 10px 14px;
  border: 2px solid;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Bowler", sans-serif;
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  background: transparent;
}

.edit-zone-btn {
  border-color: rgba(0, 140, 209, 0.5);
  color: var(--c-accent);
}

.edit-zone-btn:hover {
  background: var(--c-accent);
  color: var(--c-white);
}

.delete-zone-btn {
  border-color: rgba(225, 30, 36, 0.5);
  color: #f87171;
}

.delete-zone-btn:hover {
  background: rgba(220, 53, 69, 0.9);
  color: var(--c-white);
}

/* Секция зала */
.zone-details {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: var(--spacing-lg);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.details-header h3 {
  font-family: "Kingslay", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
}

.add-price-btn {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid rgba(0, 140, 209, 0.4);
  color: var(--c-accent);
  cursor: pointer;
  border-radius: 12px;
  font-size: var(--font-sm);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
}

.add-price-btn:hover {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-white);
}

/* Список периодов - столбиком */
.prices-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.period-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: var(--spacing-md);
}

.period-header {
  margin-bottom: var(--spacing-md);
}

.period-header h4 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  margin: 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--c-accent);
}

.prices-table {
  overflow-x: auto;
}

.prices-table table {
  width: 100%;
  border-collapse: collapse;
}

.prices-table th,
.prices-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.prices-table th {
  font-family: "Bowler", sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  font-weight: 500;
}

.prices-table td {
  font-size: 14px;
  color: var(--c-white);
}

.price-input {
  width: 80px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  text-align: center;
}

.price-input:focus {
  outline: none;
  border-color: var(--c-accent);
  background: rgba(255, 255, 255, 0.15);
}

.delete-price-btn {
  padding: 8px 14px;
  background: transparent;
  border: 2px solid rgba(225, 30, 36, 0.5);
  color: #f87171;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Bowler", sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.delete-price-btn:hover {
  background: rgba(220, 53, 69, 0.9);
  color: var(--c-white);
  border-color: rgba(220, 53, 69, 0.9);
}

/* Модалки */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  width: min(640px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.6);
}

.modal::-webkit-scrollbar {
  width: 6px;
}

.modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

.modal h3 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  font-weight: 400;
  color: var(--c-white);
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-70);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-group select {
  cursor: pointer;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--c-accent);
  background: rgba(0, 140, 209, 0.08);
  box-shadow: 0 0 15px rgba(0, 140, 209, 0.15);
}

.form-group select option {
  background: var(--c-bg);
  color: var(--c-white);
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.modal-cancel,
.modal-confirm {
  padding: 12px 24px;
  border: 2px solid;
  cursor: pointer;
  border-radius: 12px;
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.modal-confirm {
  background: transparent;
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.modal-confirm:hover {
  background: var(--c-accent);
  color: var(--c-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 140, 209, 0.3);
}

.modal-cancel {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--c-white-60);
}

.modal-cancel:hover {
  border-color: var(--c-white-40);
  color: var(--c-white);
  background: rgba(255, 255, 255, 0.05);
}

.modal-confirm.delete {
  border-color: var(--c-danger);
  color: var(--c-danger);
}

.modal-confirm.delete:hover {
  background: var(--c-danger);
  color: var(--c-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(225, 30, 36, 0.3);
}

.modal-error {
  color: var(--c-danger);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  text-align: center;
  padding: 10px;
  background: rgba(225, 30, 36, 0.1);
  border-radius: 10px;
}

.modal-success {
  color: #34d399;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  text-align: center;
  padding: 10px;
  background: rgba(52, 211, 153, 0.1);
  border-radius: 10px;
}
.modal {
  width: min(640px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.6);
}
.modal::-webkit-scrollbar {
  width: 6px;
}
.modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
.modal h3 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  font-weight: 400;
  color: var(--c-white);
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}
.form-group label {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-70);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--c-accent);
  background: rgba(0, 140, 209, 0.08);
  box-shadow: 0 0 15px rgba(0, 140, 209, 0.15);
}
.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.form-group select option {
  background: var(--c-bg);
  color: var(--c-white);
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
.modal-cancel,
.modal-confirm {
  padding: 12px 24px;
  border: 2px solid;
  cursor: pointer;
  border-radius: 12px;
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}
.modal-confirm {
  background: transparent;
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.modal-confirm:hover {
  background: var(--c-accent);
  color: var(--c-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 140, 209, 0.3);
}
.modal-cancel {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--c-white-60);
}
.modal-cancel:hover {
  border-color: var(--c-white-40);
  color: var(--c-white);
  background: rgba(255, 255, 255, 0.05);
}
.modal-error {
  color: var(--c-danger);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  text-align: center;
  padding: 10px;
  background: rgba(225, 30, 36, 0.1);
  border-radius: 10px;
}
.modal-success {
  color: #34d399;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  text-align: center;
  padding: 10px;
  background: rgba(52, 211, 153, 0.1);
  border-radius: 10px;
}

@media (max-width: 1024px) {
  .price-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .add-zone-btn {
    width: 100%;
  }

  .zones-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .zone-actions {
    flex-direction: column;
    width: 100%;
  }

  .edit-zone-btn, .delete-zone-btn {
    width: 100%;
  }

  .periods-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .price-header h2 {
    font-size: var(--font-lg);
  }

  .zone-card {
    padding: var(--spacing-sm);
  }

  .details-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .add-price-btn {
    width: 100%;
  }

  .prices-table {
    font-size: 12px;
  }

  .price-input {
    width: 60px;
    padding: 4px 6px;
  }

  .modal {
    padding: 24px 20px;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .modal-cancel,
  .modal-confirm {
    width: 100%;
    text-align: center;
  }
}
</style>
