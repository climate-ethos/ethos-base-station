import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  {
    path: '/phoneAppHome',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PhoneAppPage.vue') }],
  },

  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SettingsPage.vue') }],
  },

  {
    path: '/initialize',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/InitializePage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
