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
              :src="product.images[0]"
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
              <input v-model="form.category" type="text" placeholder="mice" />
            </div>
          </div>
          <div class="form-row split-row">
            <div>
              <label>Название категории *</label>
              <input v-model="form.category_name" type="text" placeholder="Мыши" />
            </div>
            <div>
              <label>Характеристики</label>
              <input v-model="form.features" type="text" placeholder="RGB, беспроводная" />
            </div>
          </div>
          <div class="form-row">
            <label>Изображения (1-3)</label>
            <input type="file" accept="image/*" multiple @change="onFilesSelected" />
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
              <input v-model="editForm.category" type="text" placeholder="mice" />
            </div>
          </div>
          <div class="form-row split-row">
            <div>
              <label>Название категории *</label>
              <input v-model="editForm.category_name" type="text" placeholder="Мыши" />
            </div>
            <div>
              <label>Характеристики</label>
              <input v-model="editForm.features" type="text" placeholder="RGB, беспроводная" />
            </div>
          </div>
          <div class="form-row">
            <label>Текущие изображения</label>
            <div class="current-images" v-if="editingProduct?.images?.length">
              <div v-for="(image, index) in editingProduct.images" :key="index" class="current-image">
                <img :src="image" :alt="`Изображение ${index + 1}`" />
              </div>
            </div>
            <p v-else class="no-images">Нет изображений</p>
          </div>
          <div class="form-row">
            <label>Заменить изображения (1-3)</label>
            <input type="file" accept="image/*" multiple @change="onEditFilesSelected" />
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const products = ref([]);
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
  features: ''
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
  features: ''
});
const editPreviews = ref([]);
const editSelectedFiles = ref([]);

onMounted(() => {
  loadProducts();
});

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

function onFilesSelected(event) {
  formError.value = '';
  selectedFiles.value = Array.from(event.target.files || []).slice(0, 3);
  if (selectedFiles.value.length > 3) {
    formError.value = 'Можно загрузить не более 3 изображений';
    selectedFiles.value = selectedFiles.value.slice(0, 3);
  }
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
    features: ''
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
    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('price', String(form.value.price));
    formData.append('category', form.value.category);
    formData.append('category_name', form.value.category_name);
    formData.append('features', form.value.features || '');

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
  editForm.value = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: String(product.price),
    category: product.category,
    category_name: product.category_name,
    features: product.features ? product.features.join(', ') : ''
  };
  editPreviews.value = [];
  editSelectedFiles.value = [];
  showEditProductModal.value = true;
}

function onEditFilesSelected(event) {
  formError.value = '';
  editSelectedFiles.value = Array.from(event.target.files || []).slice(0, 3);
  if (editSelectedFiles.value.length > 3) {
    formError.value = 'Можно загрузить не более 3 изображений';
    editSelectedFiles.value = editSelectedFiles.value.slice(0, 3);
  }
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
    features: ''
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
    formData.append('name', editForm.value.name);
    formData.append('description', editForm.value.description);
    formData.append('price', String(editForm.value.price));
    formData.append('category', editForm.value.category);
    formData.append('category_name', editForm.value.category_name);
    formData.append('features', editForm.value.features || '');

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
    if (!response.ok) {
      throw new Error(data.message || 'Не удалось обновить товар');
    }

    formSuccess.value = 'Товар обновлен';
    await loadProducts();
    setTimeout(closeEditModal, 1500);
  } catch (err) {
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}
.modal {
  width: min(720px, calc(100vw - 40px));
  background: #111827;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.45);
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
input,
textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #fff;
  padding: 12px 14px;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.modal-cancel,
.modal-confirm,
.action-btn {
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  font-weight: 600;
}
.action-btn,
.modal-confirm {
  background: #00b894;
  color: #fff;
}
.modal-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.modal-error {
  color: #f87171;
}
.modal-success {
  color: #34d399;
}
.preview-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.preview-item {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.current-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.current-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.current-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-images {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 8px 0;
}
</style>
