import { getAll, getById, getCat } from '../controllers/productController.js';

export async function productRoutes(app) {
  // GET /api/products - Получить все товары
  app.get('/api/products', async (request, reply) => {
    const result = await getAll(request, reply);
    return reply.code(200).send(result);
  });

  // GET /api/products/categories - Получить все категории
  app.get('/api/products/categories', async (request, reply) => {
    const result = await getCat(request, reply);
    return reply.code(200).send(result);
  });

  // GET /api/products/:id - Получить товар по ID
  app.get('/api/products/:id', async (request, reply) => {
    const result = await getById(request, reply);
    return reply.code(200).send(result);
  });
}

