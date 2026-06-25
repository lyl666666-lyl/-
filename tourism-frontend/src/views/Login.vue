<template>
  <div class="auth-page">
    <section class="auth-visual">
      <div class="brand">
        <span class="brand-mark">旅</span>
        <span>旅游管理系统</span>
      </div>
      <h1>线路预订、订单核对、出行安排一站式管理</h1>
      <p>面向游客和平台管理员的课程设计演示系统，支持完整预订流程、售后处理和报表导出。</p>
    </section>
    <section class="auth-box">
      <el-card class="auth-card">
        <h2>欢迎登录</h2>
        <p class="sub">管理员和游客使用同一入口，系统会自动识别角色。</p>
        <el-form :model="form" @keyup.enter="submit">
          <el-form-item>
            <el-input v-model="form.username" size="large" placeholder="用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" size="large" type="password" show-password placeholder="密码" :prefix-icon="Lock" />
          </el-form-item>
          <el-button type="primary" size="large" style="width:100%" @click="submit">登录系统</el-button>
          <div style="display:flex;justify-content:space-between;margin-top:14px">
            <el-button link @click="quick('admin')">管理员演示</el-button>
            <el-button link @click="quick('tourist1')">游客演示</el-button>
            <el-button link @click="$router.push('/register')">注册游客账号</el-button>
          </div>
        </el-form>
      </el-card>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../store/user'

const form = reactive({ username: 'admin', password: '123456' })
const router = useRouter()
const store = useUserStore()
function quick(username) {
  form.username = username
  form.password = '123456'
}
async function submit() {
  const d = await store.login(form)
  router.push(d.role === 'ADMIN' ? '/admin/dashboard' : '/home')
}
</script>
