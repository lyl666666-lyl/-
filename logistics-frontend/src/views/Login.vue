<template>
  <div class="auth-page">
    <section class="auth-visual">
      <div class="brand">
        <span class="brand-mark">物</span>
        <span>智能在线物流系统</span>
      </div>
      <h1>寄件下单、网点分拣、运输配送、签收查询全流程管理</h1>
      <p>面向寄件人、物流专员和后台管理员的智能物流系统，支持快捷下单、专员揽收、干线中转、签收登记及明细导出统计。</p>
    </section>
    <section class="auth-box">
      <el-card class="auth-card">
        <h2>欢迎登录</h2>
        <p class="sub">多角色使用同一入口，系统会自动识别用户角色并展示相应界面。</p>
        <el-form :model="form" @keyup.enter="submit">
          <el-form-item>
            <el-input v-model="form.username" size="large" placeholder="用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" size="large" type="password" show-password placeholder="密码" :prefix-icon="Lock" />
          </el-form-item>
          <el-button type="primary" size="large" style="width:100%" @click="submit">登录系统</el-button>
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;margin-top:14px;gap:5px">
            <el-button link @click="quick('admin')">管理员登录</el-button>
            <el-button link @click="quick('specialist1')">物流专员登录</el-button>
            <el-button link @click="quick('sender1')">寄件人登录</el-button>
            <el-button link type="primary" @click="$router.push('/register')">注册寄件人账号</el-button>
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
  if (d.role === 'ADMIN' || d.role === 'SPECIALIST') {
    router.push('/admin/dashboard')
  } else {
    router.push('/home')
  }
}
</script>
