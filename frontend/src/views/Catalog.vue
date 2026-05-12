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
                <span class="product-placeholder">{{ product.name }}</span>
              </div>
              <div class="product-badge">Новинка</div>
            </div>
            <div class="product-info">
              <div class="product-category">{{ product.category_name || product.categoryName }}</div>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-footer">
                <span class="product-price">{{ product.price }} ₽</span>
                <span class="product-btn">Подробнее →</span>
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
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
}

.product-category {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
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
  min-height: 52px;
  display: flex;
  align-items: center;
}

.product-description {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-60);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--c-white-10);
}

.product-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-2xl);
  font-weight: 400;
  color: var(--c-accent);
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

/* Адаптивность */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 900px;
  }
}

@media (max-width: 900px) {
  .catalog-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left,
  .filters-right {
    width: 100%;
  }

  .filter-categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }

  .filters-right {
    justify-content: space-between;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 700px;
  }
}

@media (max-width: 600px) {
  .catalog-hero {
    padding: var(--spacing-xl) 0 var(--spacing-lg);
  }

  .catalog-hero-title {
    font-size: clamp(28px, 5vw, 36px);
  }

  .catalog-container {
    padding: var(--spacing-lg) var(--spacing-sm);
  }

  .products-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .sort-select {
    min-width: 140px;
  }

  .product-name {
    min-height: 44px;
    font-size: var(--font-base);
  }

  .product-description {
    min-height: 36px;
  }
}

@media (max-width: 480px) {
  .catalog-hero-title {
    font-size: clamp(24px, 5vw, 32px);
  }

  .product-info {
    padding: var(--spacing-md);
  }

  .product-name {
    font-size: var(--font-base);
  }

  .product-price {
    font-size: var(--font-xl);
  }
}
</style>
