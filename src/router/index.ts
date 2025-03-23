import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import middlewarePipeline from './middleware/middlewarePipeline'
import guest from './middleware/guest.middleware'

import { useAppStore } from '@/stores/app.store'

import GuestLayout from '@/layouts/guest/IndexLayout.vue'
import auth from './middleware/auth.middleware'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: GuestLayout,
    meta: { middleware: [guest] },
    children: [
      {
        path: '',
        redirect: '/login',
      },
      {
        path: '/forgot-password',
        name: 'account.forgotPassword',
        component: () =>
          import('@/app/features/account/forgot-password/presentation/IndexView.vue'),
      },
      {
        path: '/login',
        name: 'account.login',
        component: () => import('@/app/features/account/login/presentation/IndexView.vue'),
      },
      {
        path: '/register',
        name: 'account.register',
        component: () => import('@/app/features/account/register/presentation/IndexView.vue'),
      },
      {
        path: '/reset-password',
        name: 'account.resetPassword',
        component: () => import('@/app/features/account/reset-password/presentation/IndexView.vue'),
      },
    ],
  },
  {
    path: '/onboarding',
    name: 'onboarding.index',
    component: () => import('@/app/features/onboarding/presentation/IndexView.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/app/IndexLayout.vue'),
    meta: { middleware: [auth] },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/app/features/dashboard/presentation/IndexView.vue'),
      },
      {
        path: '/u',
        children: [
          {
            path: 'public-profile',
            name: 'user.publicProfile',
            component: () => import('@/app/features/profile/public/presentation/IndexView.vue'),
          },
          {
            path: 'profile',
            name: 'user.profile',
            component: () => import('@/app/features/profile/presentation/IndexView.vue'),
          },
        ],
      },
      {
        path: '/listings',
        children: [
          {
            path: '',
            name: 'listings.index',
            component: () => import('@/app/features/listing/presentation/IndexView.vue'),
          },
          {
            path: 'create',
            name: 'listings.create',
            component: () => import('@/app/features/listing/presentation/CreateView.vue'),
          },
          {
            path: 'edit/:id',
            name: 'listings.edit',
            component: () => import('@/app/features/listing/presentation/EditView.vue'),
          },
          {
            path: 'show/:id',
            name: 'listings.show',
            component: () => import('@/app/features/listing/presentation/ShowView.vue'),
          },
          {
            path: 'requests/edit/:id',
            name: 'listings.requests.edit',
            component: () => import('@/app/features/listing/presentation/request/EditView.vue'),
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to the top on navigation
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const middleware: Array<Function> = to.meta.middleware as Array<Function>
  const context = { to, from, next }

  const appStore = useAppStore()
  appStore.setAppLoading(true)

  if (!middleware) {
    return next()
  }

  await middleware[0]({
    ...context,
    next: await middlewarePipeline(context, middleware, 1),
  })
})

router.afterEach(() => {
  const appStore = useAppStore()
  appStore.setAppLoading(false)
})

export default router
