<template>
  <div class="menu-page">
    <SiteHeader />
    
    <div class="container">
      <h1 class="menu-title">Меню</h1>

      <!-- Загрузка -->
      <div v-if="loading" class="menu-loading">Загрузка меню...</div>
      
      <!-- Ошибка -->
      <div v-else-if="error" class="menu-error">{{ error }}</div>
      
      <!-- Контент меню -->
      <template v-else>
        <!-- Навигация по категориям -->
        <nav class="category-nav" aria-label="Навигация по категориям меню">
          <button
            v-for="category in filteredCategories"
            :key="category.id"
            :class="['category-btn', { active: activeCategory === category.id }]"
            @click="scrollToCategory(category.id)"
            :aria-current="activeCategory === category.id ? 'location' : undefined"
          >
            <span class="category-name">{{ category.name }}</span>
          </button>
        </nav>

        <!-- Список категорий и блюд -->
        <main class="menu-content" role="main">
          <section
            v-for="category in filteredCategories"
            :key="category.id"
            :id="category.id"
            class="menu-section"
            :data-category="category.id"
          >
            <h2 class="section-header">
              <span class="section-title">{{ category.name }}</span>
            </h2>
            
            <div class="menu-items">
              <article
                v-for="(item, index) in category.items"
                :key="index"
                class="menu-item"
                :data-item-name="item.name.toLowerCase()"
              >
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span v-if="item.description" class="item-description">{{ item.description }}</span>
                </div>
                <div class="item-price-block">
                  <span v-if="item.weight" class="item-weight">{{ item.weight }}</span>
                  <span class="item-price">{{ item.price }}</span>
                </div>
              </article>
            </div>
          </section>

          <!-- Пустое меню -->
          <div v-if="filteredCategories.length === 0" class="no-results">
            <p>Меню пусто</p>
          </div>
        </main>
      </template>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SiteHeader from '../components/header/SiteHeader.vue'
import SiteFooter from '../components/footer/SiteFooter.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const activeCategory = ref('burgers')
const categories = ref([])
const loading = ref(true)
const error = ref('')

// Загрузка меню с сервера
async function loadMenu() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${API_URL}/api/menu/categories`)
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить меню')
    }
    
    const data = await response.json()
    categories.value = data.categories || []
    
    // Установить первую категорию как активную если нет выбранных
    if (categories.value.length > 0 && !activeCategory.value) {
      activeCategory.value = categories.value[0].id
    }
  } catch (err) {
    error.value = err.message
    // Фолбэк на статические данные если сервер недоступен
    categories.value = []
  } finally {
    loading.value = false
  }
}

const filteredCategories = computed(() => {
  return categories.value
})

// Скролл к категории
const scrollToCategory = (categoryId) => {
  const element = document.getElementById(categoryId)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Отслеживание активной категории при скролле
const handleScroll = () => {
  const sections = document.querySelectorAll('.menu-section')
  const headerOffset = 100

  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerOffset
    const sectionBottom = sectionTop + section.offsetHeight
    const scrollPosition = window.pageYOffset

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      activeCategory.value = section.getAttribute('data-category')
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  loadMenu()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.menu-page {
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
  padding: 160px var(--spacing-lg) var(--spacing-xl);
}

.menu-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 400;
  color: var(--c-white);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 var(--spacing-xl) 0;
}

.menu-loading, .menu-error {
  text-align: center;
  padding: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.5);
  font-family: "Roboto", sans-serif;
  font-size: var(--font-lg);
}

.menu-error {
  color: var(--c-danger);
  background: rgba(225, 30, 36, 0.1);
  border-radius: 12px;
  margin: var(--spacing-lg) 0;
}

/* Навигация по категориям */
.category-nav {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-xl);
  scrollbar-width: thin;
  scrollbar-color: var(--c-accent) transparent;
  -webkit-overflow-scrolling: touch;
}

.category-nav::-webkit-scrollbar {
  height: 4px;
}

.category-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.category-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 140, 209, 0.6);
}

.category-btn {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--c-bg);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: var(--c-white);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  flex-shrink: 0;
  font-family: "Bowler", sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 140, 209, 0.4);
  box-shadow: 0 4px 12px rgba(0, 140, 209, 0.15);
}

.category-btn.active {
  background: rgba(0, 140, 209, 0.15);
  border-color: var(--c-accent);
  box-shadow: 0 4px 16px rgba(0, 140, 209, 0.25);
}

/* Контент меню */
.menu-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.menu-section {
  scroll-margin-top: 120px;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  margin: 0 0 var(--spacing-lg) 0;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
}

.section-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.3s ease, background 0.3s ease;
}

.menu-section:hover .section-header::after {
  width: 120px;
  background: var(--c-accent);
}

.section-title {
  font-family: "Bowler", sans-serif;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 400;
  color: var(--c-white);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: inline-block;
  padding: 0 8px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.menu-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--c-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.menu-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease;
}

.menu-item:hover {
  transform: translateX(8px);
  border-color: rgba(0, 140, 209, 0.4);
  box-shadow: 0 8px 24px rgba(0, 140, 209, 0.2);
}

.menu-item:hover::before {
  background: var(--c-accent);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.item-name {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
  font-weight: 500;
}

.item-description {
  font-family: "Roboto", sans-serif;
  font-size: clamp(13px, 1.5vw, 15px);
  color: rgba(255, 255, 255, 0.5);
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
}

.item-price-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
  min-width: 100px;
  text-align: right;
}

.item-weight {
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.item-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  font-weight: 600;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .container {
    padding: var(--spacing-lg) var(--spacing-md);
    max-width: 1400px;
  }

  .category-btn {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 12px;
  }

  .section-title {
    font-size: clamp(18px, 2.5vw, 24px);
  }

  .menu-item {
    padding: var(--spacing-md);
  }

  .item-name {
    font-size: var(--font-md);
  }
}

@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }

  .category-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 11px;
  }

  .menu-item {
    padding: var(--spacing-md);
  }

  .item-name {
    font-size: var(--font-md);
  }

  .item-price {
    font-size: var(--font-lg);
  }

  .section-title {
    font-size: clamp(16px, 2.5vw, 20px);
  }
}

@media (max-width: 480px) {
  .container {
    padding: var(--spacing-sm);
  }

  .menu-title {
    font-size: clamp(20px, 5vw, 26px);
  }

  .category-btn {
    min-width: fit-content;
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .item-price-block {
    min-width: 70px;
  }

  .item-weight {
    font-size: 11px;
  }

  .item-name {
    font-size: var(--font-sm);
  }

  .item-price {
    font-size: var(--font-md);
  }

  .menu-item {
    padding: var(--spacing-sm);
  }
}
</style>
