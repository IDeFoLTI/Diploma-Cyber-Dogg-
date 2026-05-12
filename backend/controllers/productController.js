import { getAllProducts, getProductsByCategory, getProductById, getCategories } from '../models/Product.js';

// Получить все товары
export const getAll = async (request, reply) => {
  try {
    const { category } = request.query;
    
    let products;
    if (category && category !== 'all') {
      products = await getProductsByCategory(category);
    } else {
      products = await getAllProducts();
    }

    return {
      success: true,
      data: products
    };
  } catch (error) {
    request.log.error('Error fetching products:', error);
    return reply.code(500).send({
      success: false,
      message: 'Ошибка при получении товаров'
    });
  }
};

// Получить товар по ID
export const getById = async (request, reply) => {
  try {
    const { id } = request.params;
    const product = await getProductById(id);

    if (!product) {
      return reply.code(404).send({
        success: false,
        message: 'Товар не найден'
      });
    }

    return {
      success: true,
      data: product
    };
  } catch (error) {
    request.log.error('Error fetching product:', error);
    return reply.code(500).send({
      success: false,
      message: 'Ошибка при получении товара'
    });
  }
};

// Получить все категории
export const getCat = async (request, reply) => {
  try {
    const categories = await getCategories();

    return {
      success: true,
      data: categories
    };
  } catch (error) {
    request.log.error('Error fetching categories:', error);
    return reply.code(500).send({
      success: false,
      message: 'Ошибка при получении категорий'
    });
  }
};

