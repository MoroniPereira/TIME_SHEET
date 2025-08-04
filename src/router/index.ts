import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthUser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/homepageDashboard.vue'),
        },
        {
          path: 'employee',
          name: 'employee',
          component: () => import('@/views/EmployeeView.vue'),
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/dashboard'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const useAuth = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!useAuth.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
