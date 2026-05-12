<template>
  <div class="product-detail-page">
    <SiteHeader />
    
    <div class="product-container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumb-link">Главная</router-link>
        <span class="breadcrumb-separator">/</span>
        <router-link to="/catalog" class="breadcrumb-link">Каталог</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ product?.name || 'Товар' }}</span>
      </nav>
      
      <!-- Если загрузка -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Загрузка товара...</p>
      </div>
      
      <!-- Если ошибка -->
      <div v-else-if="error" class="error">
        <h2>{{ error }}</h2>
        <router-link to="/catalog" class="back-link">Вернуться в каталог</router-link>
      </div>
      
      <!-- Если товар не найден -->
      <div v-else-if="!product" class="not-found">
        <h2>Товар не найден</h2>
        <router-link to="/catalog" class="back-link">Вернуться в каталог</router-link>
      </div>
      
      <!-- Карточка товара -->
      <div v-else class="product-content">
        <!-- Изображение -->
        <div class="product-image-section">
          <div class="product-image-wrapper">
            <div class="product-main-image">
              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="product.name"
              />
              <span v-else class="image-placeholder">{{ product.name }}</span>
            </div>
            <div v-if="product.images?.length > 1" class="product-thumbnails">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                :class="['thumbnail-button', { active: selectedImageIndex === index }]"
                type="button"
                @click="selectedImageIndex = index"
              >
                <img :src="image" :alt="product.name" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Информация -->
        <div class="product-info-section">
            <div class="product-category-tag">{{ product.category_name }}</div>
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-description">{{ product.description }}</p>
          
          <div class="product-price-section">
            <span class="product-price">{{ product.price }} ₽</span>
          </div>
          
          <!-- Характеристики -->
          <div class="product-features">
            <h3 class="features-title">Характеристики:</h3>
            <ul class="features-list">
              <li v-for="(feature, index) in product.features" :key="index" class="feature-item">
                <span class="feature-check">✓</span>
                {{ feature }}
              </li>
            </ul>
          </div>
          
          <!-- Кнопки -->
          <div class="product-actions">
            <TemplateButton variant="outlined-white" @click="addToCart" class="cart-btn">
              Добавить в корзину
            </TemplateButton>
            <router-link to="/catalog" class="back-btn">
              <TemplateButton variant="secondary">
                Вернуться в каталог
              </TemplateButton>
            </router-link>
          </div>
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
import TemplateButton from '../components/TemplateButton.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedImageIndex = ref(0);

const currentImage = computed(() => {
  if (!product.value) return null;
  return product.value.images?.[selectedImageIndex.value] || product.value.image || null;
});

const productId = computed(() => {
  return parseInt(route.params.id);
});

onMounted(async () => {
  try {
    loading.value = true;
    const res = await fetch(`${API_URL}/api/products/${productId.value}`);
    const data = await res.json();
    
    if (data.success) {
      product.value = data.data;
    } else {
      router.push('/catalog');
    }
  } catch (err) {
    console.error('Error loading product:', err);
    error.value = 'Не удалось загрузить товар';
  } finally {
    loading.value = false;
  }
});

const addToCart = () => {
  if (product.value) {
    console.log('Добавлено в корзину:', product.value);
    alert(`${product.value.name} добавлен в корзину!`);
  }
};
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
  max-width: 1300px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xl);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
}

.breadcrumb-link {
  color: var(--c-white-60);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--c-white);
}

.breadcrumb-separator {
  color: var(--c-white-40);
}

.breadcrumb-current {
  color: var(--c-white);
}

.not-found {
  text-align: center;
  padding: var(--spacing-2xl);
}

.not-found h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  color: var(--c-white);
  margin-bottom: var(--spacing-lg);
}

.loading {
  text-align: center;
  padding: var(--spacing-2xl);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid var(--c-white-20);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white-60);
}

.error {
  text-align: center;
  padding: var(--spacing-2xl);
}

.error h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  color: var(--c-danger);
  margin-bottom: var(--spacing-lg);
}

.error p {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white-60);
}

.back-link {
  display: inline-block;
  color: var(--c-accent);
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--c-white);
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.product-image-section {
  display: flex;
  justify-content: center;
}

.product-image-wrapper {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-secondary) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-main-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-thumbnails {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.thumbnail-button {
  width: 72px;
  height: 72px;
  border: 2px solid transparent;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  padding: 0;
}

.thumbnail-button.active {
  border-color: var(--c-accent);
}

.thumbnail-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  font-family: "Bowler", sans-serif;
  font-size: clamp(20px, 4vw, 28px);
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  padding: var(--spacing-md);
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.product-category-tag {
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--c-white-30);
  border-radius: 4px;
  align-self: flex-start;
}

.product-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.product-description {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white-70);
  line-height: 1.6;
  margin: 0;
}

.product-price-section {
  margin: var(--spacing-md) 0;
}

.product-price {
  font-family: "Bowler", sans-serif;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 400;
  color: var(--c-accent);
}

.product-features {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.features-title {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  margin: 0 0 var(--spacing-md) 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white-70);
}

.feature-check {
  color: var(--c-accent);
  font-weight: bold;
  font-size: var(--font-lg);
}

.product-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-top: var(--spacing-lg);
}

.cart-btn,
.back-btn :deep(.template-btn) {
  min-width: 200px;
  height: 55px;
}

/* Адаптивность для десктопов */
@media (min-width: 1400px) {
  .product-container {
    padding: calc(var(--spacing-xl) * 1.2) var(--spacing-md);
  }
}

/* Адаптивность для планшетов */
@media (max-width: 900px) {
  .product-container {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .product-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .product-image-wrapper {
    max-width: 400px;
    margin: 0 auto;
  }

  .product-actions {
    flex-direction: column;
  }

  .cart-btn,
  .back-btn :deep(.template-btn) {
    width: 100%;
    max-width: 300px;
  }
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .product-container {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .breadcrumbs {
    font-size: var(--font-xs);
    flex-wrap: wrap;
  }

  .product-title {
    font-size: clamp(22px, 5vw, 28px);
  }

  .product-price {
    font-size: clamp(24px, 5vw, 36px);
  }

  .product-description {
    font-size: var(--font-md);
  }

  .features-title {
    font-size: var(--font-base);
  }

  .feature-item {
    font-size: var(--font-sm);
  }

  .product-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .cart-btn,
  .back-btn :deep(.template-btn) {
    width: 100%;
    max-width: none;
    height: 50px;
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .product-container {
    padding: var(--spacing-sm) var(--spacing-xs);
  }

  .product-title {
    font-size: clamp(20px, 5vw, 24px);
  }

  .product-price {
    font-size: clamp(20px, 5vw, 28px);
  }

  .image-placeholder {
    font-size: clamp(14px, 3vw, 18px);
  }
}
</style>
