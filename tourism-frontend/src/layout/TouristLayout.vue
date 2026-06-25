<template>
  <div>
    <div class="layout-top">
      <div class="brand" @click="$router.push('/home')">
        <span class="brand-mark">旅</span>
        <span>旅游管理系统</span>
      </div>
      <el-menu mode="horizontal" router :ellipsis="false">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/spots">景点</el-menu-item>
        <el-menu-item index="/routes">线路</el-menu-item>
        <el-menu-item v-if="store.isTourist" index="/my/orders">我的订单</el-menu-item>
        <el-menu-item v-if="store.isTourist" index="/my/travelers">出行人</el-menu-item>
        <el-menu-item v-if="store.isTourist" index="/my/after-sales">售后</el-menu-item>
        <el-menu-item v-if="store.isTourist" index="/my/profile">个人中心</el-menu-item>
      </el-menu>
      <div class="nav-actions">
        <el-button v-if="!store.token" type="primary" @click="$router.push('/login')">登录</el-button>
        <el-button v-else plain @click="logout">退出</el-button>
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
