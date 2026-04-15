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
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
