<template>
  <div class="admin-shell">
    <aside class="admin-side">
      <div class="admin-logo">
        <span class="brand-mark">物</span>
        <span>物流网管</span>
      </div>
      <el-menu router background-color="transparent" text-color="#cbd5e1" active-text-color="#fff">
        <el-menu-item index="/admin/dashboard"><el-icon><DataBoard /></el-icon>首页看板</el-menu-item>
        
        <!-- ADMIN 权限菜单 -->
        <template v-if="store.isAdmin">
          <el-menu-item index="/admin/outlets"><el-icon><Location /></el-icon>网点管理</el-menu-item>
          <el-menu-item index="/admin/routes"><el-icon><MapLocation /></el-icon>路线管理</el-menu-item>
          <el-menu-item index="/admin/orders"><el-icon><DocumentChecked /></el-icon>订单监控</el-menu-item>
          <el-menu-item index="/admin/reports"><el-icon><TrendCharts /></el-icon>统计报表</el-menu-item>
        </template>

        <!-- SPECIALIST 权限菜单 -->
        <template v-if="store.isSpecialist">
          <el-menu-item index="/admin/collect"><el-icon><Tickets /></el-icon>网点分拣揽收</el-menu-item>
          <el-menu-item index="/admin/delivery"><el-icon><Calendar /></el-icon>运输配送管理</el-menu-item>
        </template>
      </el-menu>
    </aside>
    <section class="admin-main">
      <div class="admin-top">
        <span class="admin-title">在线物流管理控制台 ({{ store.role === 'ADMIN' ? '系统管理员' : '物流专员' }})</span>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="color: #cbd5e1; font-size: 14px;">您好，{{ store.user?.realName || store.user?.username }}</span>
          <el-button size="small" type="danger" plain @click="logout">退出登录</el-button>
        </div>
      </div>
      <div class="admin-content"><router-view /></div>
    </section>
  </div>
</template>

<script setup>
import { useUserStore } from '../store/user'
const store = useUserStore()
function logout() {
  store.logout()
  location.href = '/login'
}
</script>
