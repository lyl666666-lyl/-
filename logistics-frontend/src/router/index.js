import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'
import TouristLayout from '../layout/TouristLayout.vue'
import AdminLayout from '../layout/AdminLayout.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/', component: TouristLayout, children: [
    { path: 'home', component: () => import('../views/Home.vue') },
    { path: 'booking', meta:{role:'SENDER'}, component: () => import('../views/Booking.vue') },
    { path: 'my/orders', meta:{role:'SENDER'}, component: () => import('../views/my/MyOrders.vue') },
    { path: 'my/profile', meta:{role:'SENDER'}, component: () => import('../views/my/Profile.vue') }
  ]},
  { path: '/admin', component: AdminLayout, children: [
    { path: 'dashboard', component: () => import('../views/admin/Dashboard.vue') },
    { path: 'outlets', meta:{role:'ADMIN'}, component: () => import('../views/admin/Outlets.vue') },
    { path: 'routes', meta:{role:'ADMIN'}, component: () => import('../views/admin/Routes.vue') },
    { path: 'orders', meta:{role:'ADMIN'}, component: () => import('../views/admin/Orders.vue') },
    { path: 'reports', meta:{role:'ADMIN'}, component: () => import('../views/admin/Reports.vue') },
    { path: 'collect', meta:{role:'SPECIALIST'}, component: () => import('../views/admin/SpecialistCollect.vue') },
    { path: 'delivery', meta:{role:'SPECIALIST'}, component: () => import('../views/admin/SpecialistDelivery.vue') }
  ]}
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const store = useUserStore()
  const need = to.matched.find(r => r.meta.role)?.meta.role || to.meta.role
  if (need && !store.token) return '/login'
  if (need && store.role !== need) {
    if (store.role === 'ADMIN' || store.role === 'SPECIALIST') {
      return '/admin/dashboard'
    } else {
      return '/home'
    }
  }
})

export default router
