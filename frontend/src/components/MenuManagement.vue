<template>
  <div class="menu-management">
    <div class="menu-header">
      <h2>Управление меню</h2>
      <button class="add-category-btn" @click="showAddCategoryModal = true">
        + Добавить категорию
      </button>
    </div>

    <!-- Список категорий -->
    <div v-if="loading" class="loading">Загрузка меню...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="categories-list">
      <div 
        v-for="category in menuCategories" 
        :key="category.id"
        :class="['category-card', { active: selectedCategory?.id === category.id }]"
        @click="selectCategory(category)"
      >
        <div class="category-name">{{ category.name }}</div>
        <div class="category-actions" @click.stop>
          <button class="edit-category-btn" @click="editCategory(category)">
            Редактировать
          </button>
          <button class="delete-category-btn" @click="deleteCategory(category.id)">
            Удалить
          </button>
        </div>
        <div class="category-items-count">
          {{ category.items?.length || 0 }} товаров
        </div>
      </div>
    </div>

    <!-- Секция выбранной категории с товарами -->
    <div v-if="selectedCategory" class="category-details">
      <div class="details-header">
        <h3>{{ selectedCategory.name }}</h3>
        <button class="add-item-btn" @click="showAddItemModal = true">
          + Добавить товар
        </button>
      </div>

      <div v-if="loadingItems" class="loading">Загрузка товаров...</div>
      <div v-else-if="items.length === 0" class="empty">
        Нет товаров в этой категории
      </div>
      <div v-else class="items-list">
        <div v-for="item in items" :key="item.id" class="item-card">
          <div class="item-main">
            <div class="item-name-row">
              <span class="item-name">{{ item.name }}</span>
              <div class="item-badges">
                <span v-if="item.popular" class="badge popular">Популярное</span>
                <span v-if="item.vegetarian" class="badge vegetarian">Вегетарианское</span>
              </div>
            </div>
            <p class="item-description">{{ item.description || 'Нет описания' }}</p>
          </div>
          <div class="item-details">
            <span class="item-weight" v-if="item.weight">{{ item.weight }}</span>
            <span class="item-price">{{ item.price }} ₽</span>
          </div>
          <div class="item-actions">
            <button class="edit-item-btn" @click="editItem(item)">Редактировать</button>
            <button class="delete-item-btn" @click="deleteItem(item.id)">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка: Добавить категорию -->
    <div v-if="showAddCategoryModal" class="modal-overlay" @click="showAddCategoryModal = false">
      <div class="modal" @click.stop>
        <h3>Добавить категорию</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Название *</label>
            <input v-model="addCategoryForm.name" type="text" placeholder="Введите название" />
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showAddCategoryModal = false">Отмена</button>
            <button class="modal-confirm" @click="addCategory">Добавить</button>
          </div>
          <div v-if="categoryError" class="modal-error">{{ categoryError }}</div>
          <div v-if="categorySuccess" class="modal-success">{{ categorySuccess }}</div>
        </div>
      </div>
    </div>

    <!-- Модалка: Редактировать категорию -->
    <div v-if="showEditCategoryModal" class="modal-overlay" @click="showEditCategoryModal = false">
      <div class="modal" @click.stop>
        <h3>Редактировать категорию</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Название *</label>
            <input v-model="editCategoryForm.name" type="text" />
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showEditCategoryModal = false">Отмена</button>
            <button class="modal-confirm" @click="updateCategory">Сохранить</button>
          </div>
          <div v-if="categoryError" class="modal-error">{{ categoryError }}</div>
          <div v-if="categorySuccess" class="modal-success">{{ categorySuccess }}</div>
        </div>
      </div>
    </div>

    <!-- Модалка: Добавить/Редактировать товар -->
    <div v-if="showItemModal" class="modal-overlay" @click="showItemModal = false">
      <div class="modal modal-large" @click.stop>
        <h3>{{ editingItem ? 'Редактировать товар' : 'Добавить товар' }}</h3>
        <div class="modal-form">
          <div class="form-group">
            <label>Название *</label>
            <input v-model="itemForm.name" type="text" placeholder="Введите название" />
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="itemForm.description" placeholder="Описание блюда" rows="3" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Вес</label>
              <input v-model="itemForm.weight" type="text" placeholder="320гр" />
            </div>
            <div class="form-group">
              <label>Цена *</label>
              <input v-model="itemForm.price" type="text" placeholder="450р" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label>
                <input v-model="itemForm.popular" type="checkbox" />
                Популярное
              </label>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input v-model="itemForm.vegetarian" type="checkbox" />
                Вегетарианское
              </label>
            </div>
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="showItemModal = false">Отмена</button>
            <button class="modal-confirm" @click="saveItem">Сохранить</button>
          </div>
          <div v-if="itemError" class="modal-error">{{ itemError }}</div>
          <div v-if="itemSuccess" class="modal-success">{{ itemSuccess }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const menuCategories = ref([]);
const items = ref([]);
const selectedCategory = ref(null);
const loading = ref(false);
const loadingItems = ref(false);
const error = ref('');

// Модалки
const showAddCategoryModal = ref(false);
const showEditCategoryModal = ref(false);
const showItemModal = ref(false);

// Формы
const addCategoryForm = ref({ name: '' });
const editCategoryForm = ref({ id: null, name: '' });
const itemForm = ref({
  id: null,
  categoryId: null,
  name: '',
  description: '',
  weight: '',
  price: '',
  popular: false,
  vegetarian: false
});

// Ошибки и успехи
const categoryError = ref('');
const categorySuccess = ref('');
const itemError = ref('');
const itemSuccess = ref('');

// Редактируемый товар
const editingItem = ref(null);

// Загрузка категорий
async function loadCategories() {
  loading.value = true;
  error.value = '';

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/menu/categories`, {
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось загрузить категории');

    const data = await response.json();
    menuCategories.value = data.categories || [];
    
    // Загрузить товары для каждой категории
    for (const cat of menuCategories.value) {
      await loadCategoryItems(cat.id);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function loadCategoryItems(categoryId) {
  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/menu/categories/${categoryId}/items`, {
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось загрузить товары');

    const data = await response.json();
    const cat = menuCategories.value.find(c => c.id === categoryId);
    if (cat) {
      cat.items = data.items || [];
    }
  } catch (err) {
    console.error('Load items error:', err);
  }
}

function selectCategory(category) {
  selectedCategory.value = category;
  items.value = category.items || [];
}

function editCategory(category) {
  editCategoryForm.value = { id: category.id, name: category.name };
  showEditCategoryModal.value = true;
}

async function addCategory() {
  categoryError.value = '';
  categorySuccess.value = '';

  if (!addCategoryForm.value.name.trim()) {
    categoryError.value = 'Введите название категории';
    return;
  }

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/menu/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify({ name: addCategoryForm.value.name })
    });

    if (!response.ok) throw new Error('Не удалось добавить категорию');

    categorySuccess.value = 'Категория добавлена!';
    addCategoryForm.value = { name: '' };
    
    setTimeout(() => {
      showAddCategoryModal.value = false;
      categorySuccess.value = '';
      loadCategories();
    }, 1500);
  } catch (err) {
    categoryError.value = err.message;
  }
}

async function updateCategory() {
  categoryError.value = '';
  categorySuccess.value = '';

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/menu/categories/${editCategoryForm.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify({ name: editCategoryForm.value.name })
    });

    if (!response.ok) throw new Error('Не удалось обновить категорию');

    categorySuccess.value = 'Категория обновлена!';
    
    setTimeout(() => {
      showEditCategoryModal.value = false;
      categorySuccess.value = '';
      loadCategories();
    }, 1500);
  } catch (err) {
    categoryError.value = err.message;
  }
}

async function deleteCategory(categoryId) {
  if (!confirm('Удалить категорию и все её товары?')) return;

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/menu/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось удалить категорию');

    if (selectedCategory.value?.id === categoryId) {
      selectedCategory.value = null;
      items.value = [];
    }
    
    loadCategories();
  } catch (err) {
    alert('Не удалось удалить категорию: ' + err.message);
  }
}

function editItem(item) {
  editingItem.value = item;
  itemForm.value = {
    id: item.id,
    categoryId: selectedCategory.value.id,
    name: item.name,
    description: item.description || '',
    weight: item.weight || '',
    price: item.price,
    popular: item.popular,
    vegetarian: item.vegetarian
  };
  showItemModal.value = true;
}

async function saveItem() {
  itemError.value = '';
  itemSuccess.value = '';

  if (!itemForm.value.name.trim() || !itemForm.value.price.trim()) {
    itemError.value = 'Заполните название и цену';
    return;
  }

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const url = itemForm.value.id
      ? `${API_URL}/api/admin/menu/items/${itemForm.value.id}`
      : `${API_URL}/api/admin/menu/items`;
    
    const method = itemForm.value.id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: JSON.stringify({
        categoryId: selectedCategory.value.id,
        name: itemForm.value.name,
        description: itemForm.value.description,
        weight: itemForm.value.weight,
        price: itemForm.value.price,
        popular: itemForm.value.popular,
        vegetarian: itemForm.value.vegetarian
      })
    });

    if (!response.ok) throw new Error('Не удалось сохранить товар');

    itemSuccess.value = itemForm.value.id ? 'Товар обновлен!' : 'Товар добавлен!';
    
    setTimeout(() => {
      showItemModal.value = false;
      itemSuccess.value = '';
      editingItem.value = null;
      itemForm.value = { id: null, categoryId: null, name: '', description: '', weight: '', price: '', popular: false, vegetarian: false };
      loadCategories();
    }, 1500);
  } catch (err) {
    itemError.value = err.message;
  }
}

async function deleteItem(itemId) {
  if (!confirm('Удалить товар?')) return;

  try {
    const userStr = localStorage.getItem('user');
    const admin = JSON.parse(userStr);

    const response = await fetch(`${API_URL}/api/admin/menu/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) throw new Error('Не удалось удалить товар');

    loadCategories();
  } catch (err) {
    alert('Не удалось удалить товар: ' + err.message);
  }
}

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.menu-management {
  width: 100%;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: 16px;
}

.menu-header h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.add-category-btn {
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
  white-space: nowrap;
  width: auto;
  flex-shrink: 0;
}

.add-category-btn:hover {
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

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.category-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 140, 209, 0.3);
}

.category-card.active {
  background: rgba(0, 140, 209, 0.1);
  border-color: var(--c-accent);
}

.category-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.category-name {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  font-weight: 500;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.category-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
}

.edit-category-btn, .delete-category-btn {
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

.edit-category-btn {
  border-color: rgba(0, 140, 209, 0.5);
  color: var(--c-accent);
}

.edit-category-btn:hover {
  background: var(--c-accent);
  color: var(--c-white);
}

.delete-category-btn {
  border-color: rgba(225, 30, 36, 0.5);
  color: #f87171;
}

.delete-category-btn:hover {
  background: rgba(220, 53, 69, 0.9);
  color: var(--c-white);
}

.category-items-count {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Секция категории */
.category-details {
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
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
}

.add-item-btn {
  padding: 10px 20px;
  background: rgba(0, 140, 209, 0.2);
  border: 2px solid rgba(0, 140, 209, 0.4);
  color: var(--c-accent);
  cursor: pointer;
  border-radius: 8px;
  font-size: var(--font-sm);
  font-family: "Bowler", sans-serif;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.add-item-btn:hover {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-white);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.item-card {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: var(--spacing-md);
  transition: all 0.3s ease;
  overflow: hidden;
}

.item-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 140, 209, 0.2);
}

.item-main {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  min-width: 0;
}

.item-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.item-name {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  color: var(--c-white);
  font-weight: 500;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.item-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.badge {
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 4px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  white-space: nowrap;
}

.badge.popular {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}

.badge.vegetarian {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.item-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.item-details {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.item-weight {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}

.item-price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-white);
  font-weight: 600;
  white-space: nowrap;
}

.item-actions {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 140px;
}

.edit-item-btn, .delete-item-btn {
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

.edit-item-btn {
  border-color: rgba(0, 140, 209, 0.5);
  color: var(--c-accent);
}

.edit-item-btn:hover {
  background: var(--c-accent);
  color: var(--c-white);
}

.delete-item-btn {
  border-color: rgba(225, 30, 36, 0.5);
  color: #f87171;
}

.delete-item-btn:hover {
  background: rgba(220, 53, 69, 0.9);
  color: var(--c-white);
}

/* Модалки */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
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
.modal-large {
  width: min(720px, calc(100vw - 32px));
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
.form-group textarea {
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
.form-group textarea:focus {
  outline: none;
  border-color: var(--c-accent);
  background: rgba(0, 140, 209, 0.08);
  box-shadow: 0 0 15px rgba(0, 140, 209, 0.15);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.form-group textarea {
  resize: vertical;
  min-height: 80px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
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
  .menu-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .add-category-btn {
    align-self: flex-start;
  }

  .categories-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .add-category-btn {
    align-self: flex-start;
  }

  .categories-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .category-actions {
    flex-direction: column;
    width: 100%;
  }

  .edit-category-btn, .delete-category-btn {
    width: 100%;
  }

  .item-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: var(--spacing-sm);
  }

  .item-main {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .item-details {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .item-actions {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
    min-width: unset;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .modal-cancel,
  .modal-confirm {
    width: 100%;
    text-align: center;
  }

  .modal-large {
    max-width: 100%;
    margin: var(--spacing-md);
  }

  .modal {
    padding: 24px 20px;
  }
}

@media (max-width: 768px) {
  .menu-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .add-category-btn {
    align-self: flex-start;
  }

  .categories-list {
    grid-template-columns: 1fr;
  }

  .category-card {
    padding: var(--spacing-md);
  }

  .category-actions {
    flex-direction: column;
    width: 100%;
  }

  .edit-category-btn, .delete-category-btn {
    width: 100%;
  }

  .category-details {
    padding: var(--spacing-md);
  }

  .details-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .add-item-btn {
    width: 100%;
  }

  .item-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: var(--spacing-sm);
  }

  .item-main {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .item-details {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .item-actions {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
    min-width: unset;
  }

  .item-name-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .item-actions {
    flex-direction: column;
    gap: 8px;
  }

  .edit-item-btn, .delete-item-btn {
    flex: 1;
    text-align: center;
    padding: 10px 16px;
    width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .modal-cancel,
  .modal-confirm {
    width: 100%;
    text-align: center;
  }

  .modal-large {
    max-width: 100%;
    margin: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .menu-header h2 {
    font-size: var(--font-lg);
  }

  .category-name {
    font-size: var(--font-sm);
  }

  .item-name {
    font-size: var(--font-sm);
  }

  .item-price {
    font-size: var(--font-md);
  }

  .badge {
    font-size: 10px;
    padding: 3px 6px;
  }

  .modal {
    padding: 24px 20px;
    max-width: 100%;
    margin: var(--spacing-sm);
  }

  .form-group input,
  .form-group textarea {
    padding: 12px 14px;
    font-size: 14px;
  }

  .edit-item-btn, .delete-item-btn {
    padding: 12px 16px;
    font-size: 13px;
  }

  .item-actions {
    flex-direction: column;
  }

  .edit-item-btn, .delete-item-btn {
    width: 100%;
  }
}
</style>
