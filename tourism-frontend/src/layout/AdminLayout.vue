<template>
  <div class="admin-shell">
    <aside class="admin-side">
      <div class="admin-logo">
        <span class="brand-mark">旅</span>
        <span>旅游后台</span>
      </div>
      <el-menu router background-color="transparent" text-color="#cbd5e1" active-text-color="#fff">
        <el-menu-item index="/admin/dashboard"><el-icon><DataBoard /></el-icon>首页仪表盘</el-menu-item>
        <el-menu-item index="/admin/spots"><el-icon><Location /></el-icon>景点管理</el-menu-item>
        <el-menu-item index="/admin/routes"><el-icon><MapLocation /></el-icon>线路管理</el-menu-item>
        <el-menu-item index="/admin/packages"><el-icon><Tickets /></el-icon>套餐管理</el-menu-item>
        <el-menu-item index="/admin/guides"><el-icon><UserFilled /></el-icon>导游管理</el-menu-item>
        <el-menu-item index="/admin/orders"><el-icon><DocumentChecked /></el-icon>订单核对</el-menu-item>
        <el-menu-item index="/admin/arrangements"><el-icon><Calendar /></el-icon>出行安排</el-menu-item>
        <el-menu-item index="/admin/after-sales"><el-icon><Service /></el-icon>售后管理</el-menu-item>
        <el-menu-item index="/admin/reports"><el-icon><TrendCharts /></el-icon>统计报表</el-menu-item>
      </el-menu>
    </aside>
    <section class="admin-main">
      <div class="admin-top">
        <span class="admin-title">平台运营管理台</span>
        <el-button plain @click="logout">退出登录</el-button>
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
