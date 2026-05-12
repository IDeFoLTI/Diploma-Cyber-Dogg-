const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Получить все товары
router.get('/', productController.getAllProducts);

// GET /api/products/categories - Получить все категории
router.get('/categories', productController.getCategories);

// GET /api/products/:id - Получить товар по ID
router.get('/:id', productController.getProductById);

// POST /api/products - Создать товар (требует авторизацию администратора)
router.post('/', productController.createProduct);

// PUT /api/products/:id - Обновить товар (требует авторизацию администратора)
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Удалить товар (требует авторизацию администратора)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
