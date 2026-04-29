import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: () => import('../views/ResetPassword.vue')
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/price',
    name: 'price',
    component: () => import('../views/Price.vue')
  },
  {
    path: '/gift-certificates',
    name: 'gift-certificates',
    component: () => import('../views/GiftCertificates.vue')
  },
  {
    path: '/buy-certificate',
    name: 'buy-certificate',
    component: () => import('../views/BuyCertificate.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Навигационный хук для защиты маршрутов
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const userStr = localStorage.getItem('user');

  if (requiresAuth && !userStr) {
    next('/login');
    return;
  }

  if (requiresAuth && userStr) {
    const user = JSON.parse(userStr);
    
    if (requiresAdmin && user.role !== 'admin') {
      next('/profile');
      return;
    }
  }

  if ((to.name === 'login' || to.name === 'register') && userStr) {
    const user = JSON.parse(userStr);
    next(user.role === 'admin' ? '/admin' : '/profile');
    return;
  }

  next();
});

export default router;
