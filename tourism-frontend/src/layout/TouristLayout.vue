<template>
  <div>
    <div class="layout-top">
      <div class="brand" @click="$router.push('/home')">
        <span class="brand-mark">物</span>
        <span>智能在线物流系统</span>
      </div>
      <el-menu mode="horizontal" router :ellipsis="false">
        <el-menu-item index="/home">运单轨迹查询</el-menu-item>
        <el-menu-item v-if="store.isSender" index="/booking">在线寄件下单</el-menu-item>
        <el-menu-item v-if="store.isSender" index="/my/orders">我的寄件订单</el-menu-item>
        <el-menu-item v-if="store.isSender" index="/my/profile">个人中心</el-menu-item>
      </el-menu>
      <div class="nav-actions">
        <el-button v-if="!store.token" type="primary" @click="$router.push('/login')">用户登录</el-button>
        <div v-else style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 14px; color: #475569; font-weight: 500;">{{ store.user?.realName || store.user?.username }}</span>
          <el-button plain size="small" @click="logout">退出</el-button>
        </div>
      </div>
    </div>
    <main class="main"><router-view /></main>
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
