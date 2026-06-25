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
    { path: 'spots', component: () => import('../views/Spots.vue') },
    { path: 'routes', component: () => import('../views/Routes.vue') },
    { path: 'routes/:id', component: () => import('../views/RouteDetail.vue') },
    { path: 'booking/:routeId', meta:{role:'TOURIST'}, component: () => import('../views/Booking.vue') },
    { path: 'my/orders', meta:{role:'TOURIST'}, component: () => import('../views/my/MyOrders.vue') },
    { path: 'my/orders/:id', meta:{role:'TOURIST'}, component: () => import('../views/my/OrderDetail.vue') },
    { path: 'my/travelers', meta:{role:'TOURIST'}, component: () => import('../views/my/Travelers.vue') },
    { path: 'my/profile', meta:{role:'TOURIST'}, component: () => import('../views/my/Profile.vue') },
    { path: 'my/after-sales', meta:{role:'TOURIST'}, component: () => import('../views/my/AfterSales.vue') }
  ]},
  { path: '/admin', component: AdminLayout, meta:{role:'ADMIN'}, children: [
    { path: 'dashboard', component: () => import('../views/admin/Dashboard.vue') },
    { path: 'spots', component: () => import('../views/admin/AdminSpots.vue') },
    { path: 'routes', component: () => import('../views/admin/AdminRoutes.vue') },
    { path: 'packages', component: () => import('../views/admin/AdminPackages.vue') },
    { path: 'guides', component: () => import('../views/admin/Guides.vue') },
    { path: 'orders', component: () => import('../views/admin/AdminOrders.vue') },
    { path: 'arrangements', component: () => import('../views/admin/Arrangements.vue') },
    { path: 'after-sales', component: () => import('../views/admin/AdminAfterSales.vue') },
    { path: 'reports', component: () => import('../views/admin/Reports.vue') }
  ]}
]
const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach((to) => {
  const store = useUserStore()
  const need = to.matched.find(r => r.meta.role)?.meta.role || to.meta.role
  if (need && !store.token) return '/login'
  if (need && store.role !== need) return store.role === 'ADMIN' ? '/admin/dashboard' : '/home'
})
export default router
