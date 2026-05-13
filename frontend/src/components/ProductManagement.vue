<template>
  <div class="product-management">
    <div class="management-header">
      <h2>Каталог товаров</h2>
      <button class="action-btn" @click="showAddProductModal = true">Добавить товар</button>
    </div>

    <div class="product-list">
      <div v-if="loading" class="loading">Загрузка товаров...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="products.length === 0" class="empty">Нет товаров</div>
      <div v-else class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="thumb">
            <img
              v-if="product.images?.length"
              :src="resolveImageUrl(product.images[0])"
              :alt="product.name"
            />
            <div v-else class="thumb-placeholder">{{ product.name }}</div>
          </div>
          <div class="info">
            <h3>{{ product.name }}</h3>
            <p class="category">{{ product.category_name }}</p>
            <p class="price">{{ product.price }} ₽</p>
          </div>
          <div class="actions">
            <button class="edit-btn" @click="editProduct(product)">Редактировать</button>
            <button class="delete-btn" @click="confirmDelete(product)">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddProductModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>Добавить новый товар</h3>
        <div class="modal-form">
          <div class="form-row">
            <label>Название *</label>
            <input v-model="form.name" type="text" placeholder="Введите название товара" />
          </div>
          <div class="form-row">
            <label>Описание</label>
            <textarea v-model="form.description" placeholder="Описание товара" rows="3" />
          </div>
          <div class="form-row split-row">
            <div>
              <label>Цена *</label>
              <input v-model="form.price" type="number" step="0.01" placeholder="1000" />
            </div>
            <div>
              <label>Категория *</label>
              <select v-model="form.category" @change="onCategoryChange(form, $event)">
                <option value="" disabled>Выберите категорию</option>
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <label>Статус *</label>
            <select v-model="form.status">
              <option value="in_stock">В наличии</option>
              <option value="preorder">Под заказ</option>
              <option value="out_of_stock">Нет в наличии</option>
            </select>
          </div>
          <div class="form-row">
            <label>Характеристики</label>
            <div class="features-editor">
              <div v-for="(feat, idx) in form.featuresList" :key="idx" class="feature-row">
                <input v-model="feat.key" type="text" placeholder="Параметр" />
                <input v-model="feat.value" type="text" placeholder="Значение" />
                <button type="button" class="remove-feat" @click="removeFeature(form.featuresList, idx)">×</button>
              </div>
              <button type="button" class="add-feat" @click="addFeature(form.featuresList)">+ Добавить характеристику</button>
            </div>
          </div>
          <div class="form-row">
            <label>Изображение</label>
            <input type="file" accept="image/*" @change="onFilesSelected" />
            <div class="preview-row" v-if="previews.length">
              <div v-for="(preview, index) in previews" :key="index" class="preview-item">
                <img :src="preview" alt="Превью" />
              </div>
            </div>
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="closeModal">Отмена</button>
            <button class="modal-confirm" @click="submitProduct">Сохранить</button>
          </div>
          <div v-if="formError" class="modal-error">{{ formError }}</div>
          <div v-if="formSuccess" class="modal-success">{{ formSuccess }}</div>
        </div>
      </div>
    </div>

    <!-- Модалка: Редактировать товар -->
    <div v-if="showEditProductModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal" @click.stop>
        <h3>Редактировать товар</h3>
        <div class="modal-form">
          <div class="form-row">
            <label>Название *</label>
            <input v-model="editForm.name" type="text" placeholder="Введите название товара" />
          </div>
          <div class="form-row">
            <label>Описание</label>
            <textarea v-model="editForm.description" placeholder="Описание товара" rows="3" />
          </div>
          <div class="form-row split-row">
            <div>
              <label>Цена *</label>
              <input v-model="editForm.price" type="number" step="0.01" placeholder="1000" />
            </div>
            <div>
              <label>Категория *</label>
              <select v-model="editForm.category" @change="onCategoryChange(editForm, $event)">
                <option value="" disabled>Выберите категорию</option>
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <label>Статус *</label>
            <select v-model="editForm.status">
              <option value="in_stock">В наличии</option>
              <option value="preorder">Под заказ</option>
              <option value="out_of_stock">Нет в наличии</option>
            </select>
          </div>
          <div class="form-row">
            <label>Характеристики</label>
            <div class="features-editor">
              <div v-for="(feat, idx) in editForm.featuresList" :key="idx" class="feature-row">
                <input v-model="feat.key" type="text" placeholder="Параметр" />
                <input v-model="feat.value" type="text" placeholder="Значение" />
                <button type="button" class="remove-feat" @click="removeFeature(editForm.featuresList, idx)">×</button>
              </div>
              <button type="button" class="add-feat" @click="addFeature(editForm.featuresList)">+ Добавить характеристику</button>
            </div>
          </div>
          <div class="form-row">
            <label>Текущее изображение</label>
            <div class="current-image-wrapper" v-if="editingProduct?.images?.length">
              <div class="current-image">
                <img :src="resolveImageUrl(editingProduct.images[0])" :alt="editingProduct.name" />
              </div>
            </div>
            <p v-else class="no-images">Нет изображения</p>
          </div>
          <div class="form-row">
            <label>Заменить изображение</label>
            <input type="file" accept="image/*" @change="onEditFilesSelected" />
            <div class="preview-row" v-if="editPreviews.length">
              <div v-for="(preview, index) in editPreviews" :key="index" class="preview-item">
                <img :src="preview" alt="Превью" />
              </div>
            </div>
          </div>
          <div class="modal-buttons">
            <button class="modal-cancel" @click="closeEditModal">Отмена</button>
            <button class="modal-confirm" @click="updateProduct">Сохранить</button>
          </div>
          <div v-if="formError" class="modal-error">{{ formError }}</div>
          <div v-if="formSuccess" class="modal-success">{{ formSuccess }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { resolveImageUrl } from '../utils/imageUrl.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const error = ref('');
const showAddProductModal = ref(false);
const formError = ref('');
const formSuccess = ref('');
const previews = ref([]);
const selectedFiles = ref([]);

const form = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  category_name: '',
  featuresList: [],
  status: 'in_stock'
});

// Для редактирования
const showEditProductModal = ref(false);
const editingProduct = ref(null);
const editForm = ref({
  id: null,
  name: '',
  description: '',
  price: '',
  category: '',
  category_name: '',
  featuresList: [],
  status: 'in_stock'
});
const editPreviews = ref([]);
const editSelectedFiles = ref([]);

onMounted(() => {
  loadProducts();
  loadCategories();
});

function loadCategories() {
  categories.value = [
    { value: 'mice', label: 'Мышки' },
    { value: 'keyboards', label: 'Клавиатуры' },
    { value: 'headphones', label: 'Наушники' },
    { value: 'gloves', label: 'Перчатки' },
    { value: 'mats', label: 'Коврики' },
    { value: 'consoles', label: 'Игровые консоли' },
    { value: 'games', label: 'Игры' },
    { value: 'monitors', label: 'Мониторы' },
    { value: 'vr', label: 'VR оборудование' },
    { value: 'accessories', label: 'Аксессуары' }
  ];
}

async function loadProducts() {
  loading.value = true;
  error.value = '';

  try {
    const userStr = localStorage.getItem('user');
    const admin = userStr ? JSON.parse(userStr) : null;

    const response = await fetch(`${API_URL}/api/admin/products`, {
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      }
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить товары');
    }

    const data = await response.json();
    products.value = data.data || data || [];
  } catch (err) {
    error.value = err.message || 'Ошибка загрузки';
  } finally {
    loading.value = false;
  }
}

function onCategoryChange(targetForm, event) {
  const cat = categories.value.find(c => c.value === event.target.value);
  if (cat) {
    targetForm.category_name = cat.label;
  }
}

function addFeature(list) {
  list.push({ key: '', value: '' });
}

function removeFeature(list, idx) {
  list.splice(idx, 1);
}

function onFilesSelected(event) {
  formError.value = '';
  selectedFiles.value = Array.from(event.target.files || []);
  previews.value = selectedFiles.value.map(file => URL.createObjectURL(file));
}

function closeModal() {
  showAddProductModal.value = false;
  formError.value = '';
  formSuccess.value = '';
  selectedFiles.value = [];
  previews.value = [];
  form.value = {
    name: '',
    description: '',
    price: '',
    category: '',
    category_name: '',
    featuresList: [],
    status: 'in_stock'
  };
}

async function submitProduct() {
  formError.value = '';
  formSuccess.value = '';

  if (!form.value.name || !form.value.price || !form.value.category || !form.value.category_name) {
    formError.value = 'Заполните обязательные поля';
    return;
  }

  if (selectedFiles.value.length === 0) {
    formError.value = 'Добавьте хотя бы одно изображение';
    return;
  }

  try {
    const userStr = localStorage.getItem('user');
    const admin = userStr ? JSON.parse(userStr) : null;
    const formData = new FormData();
    const featuresJson = JSON.stringify(form.value.featuresList.filter(f => f.key && f.value));
    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('price', String(form.value.price));
    formData.append('category', form.value.category);
    formData.append('category_name', form.value.category_name);
    formData.append('features', featuresJson);
    formData.append('status', form.value.status);

    selectedFiles.value.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось создать товар');
    }

    formSuccess.value = 'Товар добавлен';
    await loadProducts();
    setTimeout(closeModal, 1500);
  } catch (err) {
    formError.value = err.message || 'Ошибка при добавлении товара';
  }
}

function editProduct(product) {
  editingProduct.value = product;
  const rawFeatures = product.features || [];
  const featuresList = rawFeatures.map(f => {
    if (typeof f === 'string') return { key: f, value: '' };
    if (typeof f === 'object' && f !== null) return { key: f.key || '', value: f.value || '' };
    return { key: '', value: '' };
  }).filter(f => f.key);

  editForm.value = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: String(product.price),
    category: product.category,
    category_name: product.category_name,
    featuresList,
    status: product.status || 'in_stock'
  };
  editPreviews.value = [];
  editSelectedFiles.value = [];
  showEditProductModal.value = true;
}

function onEditFilesSelected(event) {
  formError.value = '';
  editSelectedFiles.value = Array.from(event.target.files || []);
  editPreviews.value = editSelectedFiles.value.map(file => URL.createObjectURL(file));
}

function closeEditModal() {
  showEditProductModal.value = false;
  formError.value = '';
  formSuccess.value = '';
  editSelectedFiles.value = [];
  editPreviews.value = [];
  editingProduct.value = null;
  editForm.value = {
    id: null,
    name: '',
    description: '',
    price: '',
    category: '',
    category_name: '',
    featuresList: [],
    status: 'in_stock'
  };
}

async function updateProduct() {
  formError.value = '';
  formSuccess.value = '';

  if (!editForm.value.name || !editForm.value.price || !editForm.value.category || !editForm.value.category_name) {
    formError.value = 'Заполните обязательные поля';
    return;
  }

  try {
    const userStr = localStorage.getItem('user');
    const admin = userStr ? JSON.parse(userStr) : null;
    const formData = new FormData();
    const featuresJson = JSON.stringify(editForm.value.featuresList.filter(f => f.key && f.value));
    formData.append('name', editForm.value.name);
    formData.append('description', editForm.value.description);
    formData.append('price', String(editForm.value.price));
    formData.append('category', editForm.value.category);
    formData.append('category_name', editForm.value.category_name);
    formData.append('features', featuresJson);
    formData.append('status', editForm.value.status);

    console.log('Updating product with status:', editForm.value.status);

    editSelectedFiles.value.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/api/admin/products/${editForm.value.id}`, {
      method: 'PUT',
      headers: {
        'X-User': encodeURIComponent(JSON.stringify(admin))
      },
      body: formData
    });

    const data = await response.json();
    console.log('Update response:', data);
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось обновить товар');
    }

    formSuccess.value = 'Товар обновлен';
    await loadProducts();
    setTimeout(closeEditModal, 1500);
  } catch (err) {
    console.error('Update error:', err);
    formError.value = err.message || 'Ошибка при обновлении товара';
  }
}

async function confirmDelete(product) {
  if (confirm(`Удалить товар "${product.name}"?`)) {
    try {
      const userStr = localStorage.getItem('user');
      const admin = userStr ? JSON.parse(userStr) : null;

      const response = await fetch(`${API_URL}/api/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'X-User': encodeURIComponent(JSON.stringify(admin))
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Не удалось удалить товар');
      }

      await loadProducts();
    } catch (err) {
      alert('Ошибка при удалении товара: ' + err.message);
    }
  }
}
</script>

<style scoped>
.product-management {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.management-header h2 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-xl);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.product-list {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 24px;
}
.products-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
.product-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 16px;
  transition: all 0.3s ease;
}
.product-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}
.thumb {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--c-primary, #1a1a2e) 0%, var(--c-secondary, #16213e) 100%);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.thumb img {
  width: 85%;
  height: 85%;
  object-fit: contain;
}
.thumb-placeholder {
  font-family: "Bowler", sans-serif;
  font-size: 14px;
  color: var(--c-white-60);
  text-align: center;
  padding: 12px;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.info h3 {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-md);
  font-weight: 400;
  color: var(--c-white);
  margin: 0;
  line-height: 1.3;
}
.category {
  font-family: "Roboto", sans-serif;
  font-size: var(--font-xs);
  color: var(--c-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.price {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-lg);
  color: var(--c-accent);
  margin: 0;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-list {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
}
.products-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
.product-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
}
.thumb {
  width: 100%;
  min-height: 160px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-placeholder {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 12px;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.category {
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}
.price {
  color: #fff;
  font-weight: 600;
}
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
.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-row label {
  font-family: "Bowler", sans-serif;
  font-size: var(--font-sm);
  color: var(--c-white-70);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.form-row input,
.form-row textarea,
.form-row select {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: var(--c-white);
  padding: 12px 16px;
  font-family: "Roboto", sans-serif;
  font-size: var(--font-md);
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.form-row input:focus,
.form-row textarea:focus,
.form-row select:focus {
  outline: none;
  border-color: var(--c-accent);
  background: rgba(0, 140, 209, 0.08);
  box-shadow: 0 0 15px rgba(0, 140, 209, 0.15);
}
.form-row input::placeholder,
.form-row textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.form-row select option {
  background: var(--c-bg);
  color: var(--c-white);
}
.split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
.modal-cancel,
.modal-confirm,
.action-btn {
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
.action-btn {
  background: transparent;
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.action-btn:hover {
  background: var(--c-accent);
  color: var(--c-white);
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
.preview-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.preview-item {
  width: 80px;
  height: 80px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
}

.edit-btn,
.delete-btn {
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
}

.edit-btn {
  background: transparent;
  border-color: rgba(0, 140, 209, 0.5);
  color: var(--c-accent);
}

.edit-btn:hover {
  background: var(--c-accent);
  color: var(--c-white);
}

.delete-btn {
  background: transparent;
  border-color: rgba(220, 53, 69, 0.5);
  color: #f87171;
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.9);
  color: var(--c-white);
}

.current-image-wrapper {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.current-image {
  width: 100px;
  height: 100px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.current-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-images {
  color: var(--c-white-50);
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  margin: 8px 0;
}

.features-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr 40px;
  gap: 10px;
  align-items: center;
}

.remove-feat {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(220, 53, 69, 0.5);
  border-radius: 10px;
  background: transparent;
  color: #f87171;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-feat:hover {
  background: rgba(220, 53, 69, 0.9);
  color: var(--c-white);
  border-color: rgba(220, 53, 69, 0.9);
}

.add-feat {
  padding: 10px 18px;
  border: 2px dashed rgba(0, 140, 209, 0.35);
  border-radius: 12px;
  background: transparent;
  color: var(--c-accent);
  font-family: "Bowler", sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.add-feat:hover {
  border-color: var(--c-accent);
  background: rgba(0, 140, 209, 0.1);
  color: var(--c-white);
}

@media (max-width: 600px) {
  .split-row {
    grid-template-columns: 1fr;
  }
  .modal {
    padding: 24px 20px;
  }
  .modal-buttons {
    flex-direction: column;
  }
  .modal-cancel,
  .modal-confirm,
  .action-btn {
    width: 100%;
    text-align: center;
  }
  .feature-row {
    grid-template-columns: 1fr 1fr 36px;
  }
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
  .product-card {
    padding: 12px;
    border-radius: 16px;
  }
  .actions {
    flex-direction: column;
  }
  .edit-btn,
  .delete-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
