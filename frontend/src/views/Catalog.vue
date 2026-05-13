<template>
  <div class="catalog-page">
    <SiteHeader />
    
    <!-- Hero секция -->
    <div class="catalog-hero">
      <div class="catalog-hero-container">
        <h1 class="catalog-hero-title">Каталог аксессуаров</h1>
        <p class="catalog-hero-subtitle">Профессиональное оборудование для твоей игры</p>
      </div>
    </div>
    
    <div class="catalog-container">
      <!-- Фильтры и сортировка -->
      <div class="catalog-filters">
        <div class="filters-left">
          <!-- Категории -->
          <div class="filter-categories">
            <button
              v-for="cat in visibleCategories"
              :key="cat.value"
              :class="['category-btn', { active: selectedCategory === cat.value }]"
              @click="selectedCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>
        
        <div class="filters-right">
          <!-- Сортировка -->
          <div class="filter-sort">
            <label class="sort-label">Сортировка:</label>
            <select v-model="sortBy" class="sort-select">
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="name">По названию</option>
            </select>
          </div>
          
          <!-- Счётчик товаров -->
          <div class="products-count">
            <span>{{ filteredProducts.length }} товаров</span>
          </div>
        </div>
      </div>
      
      <!-- Если загрузка -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Загрузка товаров...</p>
      </div>
      
      <!-- Если ошибка -->
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <!-- Сетка товаров -->
      <div v-else class="products-grid">
        <router-link
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="product-card-link"
        >
          <div class="product-card">
            <div class="product-image-wrapper">
              <div class="product-image">
                <img
                  v-if="product.images?.length || product.image"
                  :src="resolveImageUrl(product.images?.[0] || product.image)"
                  :alt="product.name"
                />
                <span v-else class="product-placeholder">{{ product.name }}</span>
              </div>
            </div>
            <div class="product-info">
              <div class="product-category">{{ product.category_name || product.categoryName }}</div>
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-footer">
                <span class="product-price">{{ product.price }} ₽</span>
                <button class="product-add-btn" @click.prevent.stop="handleAddToCart(product, $event)">
                  В корзину
                </button>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      
      <!-- Если товаров нет -->
      <div v-if="filteredProducts.length === 0" class="no-products">
        <div class="no-products-icon">📦</div>
        <h3>Товары в этой категории пока отсутствуют</h3>
        <p>Загляните позже или выберите другую категорию</p>
        <router-link to="/catalog" class="reset-link" @click="resetFilters">
          Сбросить фильтры
        </router-link>
      </div>
    </div>
    
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import SiteHeader from '../components/header/SiteHeader.vue';
import SiteFooter from '../components/footer/SiteFooter.vue';
import { useCart } from '../composables/useCart.js';
import { resolveImageUrl } from '../utils/imageUrl.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const { addProduct } = useCart();

const products = ref([]);
const categories = ref([{ value: 'all', label: 'Все категории' }]);
const selectedCategory = ref('all');
const sortBy = ref('default');
const loading = ref(true);
const error = ref(null);

// Загрузка товаров и категорий
onMounted(async () => {
  try {
    loading.value = true;
    
    // Загрузка товаров
    const productsRes = await fetch(`${API_URL}/api/products`);
    const productsData = await productsRes.json();
    
    if (productsData.success) {
      products.value = productsData.data;
    }
    
    // Загрузка категорий
    const categoriesRes = await fetch(`${API_URL}/api/products/categories`);
    const categoriesData = await categoriesRes.json();
    
    if (categoriesData.success) {
      categories.value = categoriesData.data;
    }
  } catch (err) {
    console.error('Error loading data:', err);
    error.value = 'Не удалось загрузить данные';
  } finally {
    loading.value = false;
  }
});

const filteredProducts = computed(() => {
  let result = [...products.value];
  
  // Фильтрация по категории
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value);
  }
  
  // Сортировка
  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  
  return result;
});

const visibleCategories = computed(() => {
  const allowedCategories = ['mice', 'headphones', 'mats', 'keyboards'];
  return categories.value.filter(cat => 
    cat.value === 'all' || allowedCategories.includes(cat.value)
  );
});

const resetFilters = () => {
  selectedCategory.value = 'all';
  sortBy.value = 'default';
};

function handleAddToCart(product, event) {
  event.preventDefault();
  event.stopPropagation();
  addProduct(product);
}
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
}

/* Hero секция */
.catalog-hero {
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-secondary) 100%);
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  position: relative;
  overflow: hidden;
}

.catalog-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.catalog-hero-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  text-align: center;
  position: relative;
  z-index: 1;
}

.catalog-hero-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 400;
  color: var(--c-white);
  margin: 0 0 var(--spacing-sm) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.catalog-hero-subtitle {
  font-family: "Roboto", sans-serif;
  font-size: clamp(16px, 2.5vw, 20px);
  color: var(--c-white-80);
  margin: 0;
}

/* Основной контейнер */
.catalog-container {
  flex: 1;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

/* Фильтры */
.catalog-filters {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--c-white-20);
  max-width: 1200px;
  margin: 0 auto var(--spacing-xl);
}

.filters-left {
  flex: 0 0 auto;
  min-width: 200px;
}

.filter-categories {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.category-btn {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--c-white-60);
  background: transparent;
  border: 2px solid var(--c-white-20);
  border-radius: 30px;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-btn:hover {
  border-color: var(--c-white-40);
  color: var(--c-white);
}

.category-btn.active {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-white);
}

.filters-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 0 0 auto;
}

.filter-sort {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.sort-label {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sort-select {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-base);
  color: var(--c-white);
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--c-white-20);
  border-radius: 8px;
  padding: var(--spacing-sm) var(--spacing-md);
  outline: none;
  cursor: pointer;
  min-width: 180px;
}

.sort-select option {
  background: var(--c-bg);
  color: var(--c-white);
  padding: 8px;
}

.sort-select:focus {
  border-color: var(--c-accent);
}

.products-count {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

/* Сетка товаров */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
  justify-content: center;
}

.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  transition: transform 0.3s ease;
}

.product-card-link:hover {
  transform: translateY(-8px);
}

.product-card {
  background: var(--c-card-bg);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid var(--c-white-10);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card-link:hover .product-card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: var(--c-accent-30);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-secondary) 100%);
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-placeholder {
  font-family: "Bowler", sans-serif;
  font-size: clamp(16px, 3vw, 22px);
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--spacing-md);
  text-align: center;
}

.product-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: var(--c-accent);
  color: var(--c-white);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  font-weight: 600;
  padding: var(--font-xs) var(--spacing-sm);
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-info {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.product-category {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  flex-shrink: 0;
}

.product-name {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--c-white-10);
  flex-shrink: 0;
}

.product-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  font-weight: 400;
  color: var(--c-accent);
  white-space: nowrap;
}

.product-btn {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--c-white);
  transition: color 0.3s ease;
}

.product-card-link:hover .product-btn {
  color: var(--c-accent);
}

/* Нет товаров */
.no-products {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--c-card-bg);
  border-radius: 16px;
  border: 1px solid var(--c-white-10);
}

/* Загрузка */
.loading {
  text-align: center;
  padding: var(--spacing-3xl);
}

.loading-spinner {
  width: 50px;
  height: 50px;
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
  font-size: var(--font-base);
  color: var(--c-white-60);
}

/* Ошибка */
.error {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--c-card-bg);
  border-radius: 16px;
  border: 1px solid var(--c-white-10);
}

.error p {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-danger);
}

.no-products-icon {
  font-size: 80px;
  margin-bottom: var(--spacing-md);
}

.no-products h3 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin: 0 0 var(--spacing-sm) 0;
  text-transform: uppercase;
}

.no-products p {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-base);
  color: var(--c-white-60);
  margin: 0 0 var(--spacing-lg) 0;
}

.reset-link {
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--c-accent);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--c-accent);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.reset-link:hover {
  background: var(--c-accent);
  color: var(--c-white);
}

/* Кнопка добавления в корзину */
.product-add-btn {
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-white);
  background: var(--c-accent);
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.product-add-btn:hover {
  background: var(--c-white);
  color: var(--c-bg);
  transform: translateY(-2px);
}

/* Адаптивность для планшетов */
@media (max-width: 1024px) {
  .catalog-hero {
    padding: var(--spacing-2xl) 0 var(--spacing-lg);
  }

  .catalog-hero-title {
    font-size: clamp(32px, 5vw, 44px);
  }

  .catalog-container {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .catalog-filters {
    gap: var(--spacing-md);
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
  }

  .product-info {
    padding: var(--spacing-md);
  }

  .product-name {
    font-size: var(--font-md);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .catalog-hero {
    padding: var(--spacing-xl) 0 var(--spacing-md);
  }

  .catalog-hero-title {
    font-size: clamp(26px, 6vw, 36px);
    letter-spacing: 0.08em;
  }

  .catalog-hero-subtitle {
    font-size: var(--font-sm);
  }

  .catalog-container {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .catalog-filters {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .filters-left,
  .filters-right {
    width: 100%;
  }

  .filter-categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
    -webkit-overflow-scrolling: touch;
  }

  .category-btn {
    font-size: 13px;
    padding: var(--spacing-sm) var(--spacing-md);
    white-space: nowrap;
  }

  .filters-right {
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .filter-sort {
    min-width: 140px;
  }

  .sort-select {
    min-width: 140px;
    font-size: 14px;
  }

  .products-count {
    font-size: 13px;
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .product-card {
    border-radius: 12px;
  }

  .product-image-wrapper {
    border-radius: 12px 12px 0 0;
  }

  .product-info {
    padding: var(--spacing-md);
    gap: var(--spacing-xs);
  }

  .product-category {
    font-size: 11px;
  }

  .product-name {
    font-size: 14px;
    line-height: 1.2;
  }

  .product-footer {
    gap: var(--spacing-sm);
    padding-top: var(--spacing-sm);
  }

  .product-price {
    font-size: var(--font-md);
  }

  .product-add-btn {
    font-size: 11px;
    padding: 5px 8px;
  }

  .no-products {
    padding: var(--spacing-xl);
  }

  .no-products-icon {
    font-size: 60px;
  }

  .no-products h3 {
    font-size: var(--font-lg);
  }

  .no-products p {
    font-size: var(--font-sm);
  }

  .reset-link {
    font-size: var(--font-sm);
    padding: var(--spacing-sm) var(--spacing-md);
  }
}

/* Адаптивность для маленьких мобильных */
@media (max-width: 480px) {
  .catalog-hero {
    padding: var(--spacing-lg) 0 var(--spacing-md);
  }

  .catalog-hero-title {
    font-size: clamp(24px, 7vw, 32px);
  }

  .catalog-hero-subtitle {
    font-size: 14px;
  }

  .catalog-container {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .product-card {
    border-radius: 14px;
  }

  .product-image-wrapper {
    aspect-ratio: 4/3;
  }

  .product-info {
    padding: var(--spacing-md);
  }

  .product-name {
    font-size: 16px;
  }

  .product-price {
    font-size: var(--font-lg);
  }

  .product-add-btn {
    flex: 1;
    min-width: 100px;
  }

  .filter-categories {
    gap: var(--spacing-sm);
  }

  .category-btn {
    font-size: 12px;
    padding: 8px 14px;
  }

  .sort-select {
    min-width: 120px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
  }

  .no-products-icon {
    font-size: 50px;
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 360px) {
  .catalog-hero-title {
    font-size: clamp(22px, 8vw, 28px);
  }

  .category-btn {
    font-size: 11px;
    padding: 6px 12px;
  }

  .product-name {
    font-size: 14px;
  }

  .product-add-btn {
    font-size: 10px;
    padding: 4px 6px;
  }

  .products-grid {
    gap: var(--spacing-sm);
  }
}
</style>
