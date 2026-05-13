<template>
  <div class="product-detail-page">
    <SiteHeader />
    
    <div class="product-container">
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumb-link">Главная</router-link>
        <span class="breadcrumb-separator">/</span>
        <router-link to="/catalog" class="breadcrumb-link">Каталог</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ product?.name || 'Товар' }}</span>
      </nav>
      
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Загрузка товара...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <h2>{{ error }}</h2>
        <router-link to="/catalog" class="back-link">Вернуться в каталог</router-link>
      </div>
      
      <div v-else-if="!product" class="not-found">
        <h2>Товар не найден</h2>
        <router-link to="/catalog" class="back-link">Вернуться в каталог</router-link>
      </div>
      
      <div v-else class="product-wrapper">
        <!-- Верхний блок: изображение + информация -->
        <div class="product-main-block">
          <!-- Галерея -->
          <div class="gallery-block">
            <div class="main-image">
              <img v-if="currentImage" :src="currentImage" :alt="product.name" />
              <span v-else class="placeholder">{{ product.name }}</span>
            </div>
          </div>

          <!-- Информация -->
          <div class="info-block">
            <div class="info-content">
              <div class="meta">
                <span class="sku">Артикул: {{ product.id }}</span>
                <span class="stock" :style="{ color: stockStatus.color }">
                  <span class="stock-dot" :style="{ background: stockStatus.color }"></span>
                  {{ stockStatus.text }}
                </span>
              </div>
              
              <h1 class="product-title">{{ product.name }}</h1>
              <div class="product-category">{{ product.category_name }}</div>
              
              <div class="price-wrapper">
                <span class="product-price">{{ Math.round(product.price).toLocaleString('ru-RU') }} ₽</span>
              </div>

              <TemplateButton class="add-to-cart-btn" variant="outlined-white" @click="addToCart">
                {{ addedToCart ? '✓ Добавлено' : 'В корзину' }}
              </TemplateButton>

              <div class="pickup-block">
                <div class="pickup-label">Самовывоз</div>
                <div class="pickup-address">г. Муром, ул. Московская, 91А</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Нижний блок: описание и характеристики -->
        <div class="product-details-block">
          <section v-if="product.description" class="details-section">
            <h2 class="details-title">Описание</h2>
            <p class="details-text">{{ product.description }}</p>
          </section>

          <section v-if="normalizedFeatures.length || legacyFeatures.length" class="details-section">
            <h2 class="details-title">Характеристики</h2>
            <table v-if="normalizedFeatures.length" class="specs-table">
              <tbody>
                <tr v-for="(f, i) in normalizedFeatures" :key="i">
                  <td class="spec-name">{{ f.key }}</td>
                  <td class="spec-value">{{ f.value }}</td>
                </tr>
              </tbody>
            </table>
            <ul v-if="legacyFeatures.length" class="features-list">
              <li v-for="(f, i) in legacyFeatures" :key="i">{{ f }}</li>
            </ul>
          </section>
        </div>

        <div class="back-block">
          <router-link to="/catalog" class="back-link">← Вернуться в каталог</router-link>
        </div>
      </div>
    </div>
    
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';
import { useCart } from '../composables/useCart.js';
import { resolveImageUrl } from '../utils/imageUrl.js';
import TemplateButton from '../components/TemplateButton.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const { addProduct } = useCart();

const route = useRoute();
const router = useRouter();

const product = ref(null);
const loading = ref(true);
const error = ref(null);
const addedToCart = ref(false);

const currentImage = computed(() => {
  if (!product.value) return null;
  const raw = product.value.images?.[0] || product.value.image || null;
  return raw ? resolveImageUrl(raw) : null;
});

const normalizedFeatures = computed(() => {
  if (!product.value?.features) return [];
  return product.value.features.filter(f => typeof f === 'object' && f !== null && f.key);
});

const legacyFeatures = computed(() => {
  if (!product.value?.features) return [];
  return product.value.features.filter(f => typeof f === 'string');
});

const productId = computed(() => parseInt(route.params.id));

onMounted(async () => {
  try {
    loading.value = true;
    const res = await fetch(`${API_URL}/api/products/${productId.value}`);
    const data = await res.json();
    if (data.success) product.value = data.data;
    else router.push('/catalog');
  } catch (err) {
    console.error(err);
    error.value = 'Не удалось загрузить товар';
  } finally {
    loading.value = false;
  }
});

const addToCart = () => {
  if (!product.value) return;
  addProduct(product.value);
  addedToCart.value = true;
  setTimeout(() => (addedToCart.value = false), 2000);
};

const getStockStatus = () => {
  if (!product.value?.status) return { text: 'В наличии', color: '#34d399' };
  switch (product.value.status) {
    case 'in_stock':
      return { text: 'В наличии', color: '#34d399' };
    case 'preorder':
      return { text: 'Под заказ', color: '#fbbf24' };
    case 'out_of_stock':
      return { text: 'Нет в наличии', color: '#f87171' };
    default:
      return { text: 'В наличии', color: '#34d399' };
  }
};

const stockStatus = computed(() => getStockStatus());
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
}

.product-container {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px 60px;
}

/* Хлебные крошки */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: var(--c-white-50);
}

.breadcrumb-link {
  color: var(--c-white-60);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--c-accent);
}

.breadcrumb-separator {
  color: var(--c-white-30);
}

/* Загрузка / ошибка */
.loading, .error, .not-found {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--c-white-20);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.back-link {
  color: var(--c-white-60);
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--c-accent);
}

/* === Основной враппер === */
.product-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* === Верхний блок === */
.product-main-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 32px;
  overflow: hidden;
}

/* Галерея */
.gallery-block {
  display: flex;
  flex-direction: column;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-secondary) 100%);
  border-radius: 24px;
  padding: 20px;
  box-sizing: border-box;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 16px;
}

.placeholder {
  font-family: "Bowler", sans-serif;
  font-size: 22px;
  color: var(--c-white);
  text-align: center;
  padding: 30px;
}

/* Инфо блок */
.info-block {
  display: flex;
  flex-direction: column;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.sku {
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: var(--c-white-50);
}

.stock {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #34d399;
}

.stock-dot {
  width: 8px;
  height: 8px;
  background: #34d399;
  border-radius: 50%;
}

.product-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  line-height: 1.3;
  text-transform: uppercase;
}

.product-category {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: var(--c-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.price-wrapper {
  display: inline-flex;
}

.product-price {
  font-family: "Bowler", sans-serif;
  font-size: clamp(28px, 3vw, 36px);
  color: var(--c-accent);
  font-weight: 400;
}

.add-to-cart-btn {
  width: clamp(160px, 25vw, 230px);
}

.add-to-cart-btn.added {
  border-color: #34d399;
}

.add-to-cart-btn.added .template-btn__text {
  color: #34d399;
}

.pickup-block {
  margin-top: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
}

.pickup-label {
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: var(--c-white-50);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.pickup-address {
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  color: var(--c-white);
  margin-bottom: 4px;
}

.pickup-time {
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: var(--c-white-60);
}

/* === Нижний блок === */
.product-details-block {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.details-title {
  font-family: "Bowler", sans-serif;
  font-size: 20px;
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details-text {
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  color: var(--c-white-70);
  line-height: 1.7;
  margin: 0;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.specs-table tr:last-child {
  border-bottom: none;
}

.specs-table td {
  padding: 14px 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  vertical-align: top;
}

.spec-name {
  color: var(--c-white-50);
  width: 45%;
  padding-right: 24px;
}

.spec-value {
  color: var(--c-white);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.features-list li {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: var(--c-white-70);
  padding-left: 18px;
  position: relative;
}

.features-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--c-accent);
}

.back-block {
  padding: 8px 0;
}

/* === Адаптив === */
@media (max-width: 900px) {
  .product-main-block {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .gallery-block {
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }

  .info-content {
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }

  .add-to-cart-btn {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 600px) {
  .product-container {
    padding: 100px 16px 48px;
  }

  .product-main-block,
  .product-details-block {
    padding: 24px 20px;
    border-radius: 20px;
  }

  .product-title {
    font-size: 22px;
  }

  .product-price {
    font-size: 28px;
  }

  .add-to-cart-btn {
    padding: 14px 24px;
    font-size: 15px;
  }
}
</style>
