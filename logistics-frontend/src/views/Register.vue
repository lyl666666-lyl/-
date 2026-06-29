<template>
  <div class="auth-page">
    <section class="auth-visual">
      <div class="brand">
        <span class="brand-mark">物</span>
        <span>寄件人注册</span>
      </div>
      <h1>创建寄件人账号，开启智能寄件之旅</h1>
      <p>注册后可随时在线寄件下单、实时追踪包裹物流轨迹，并统一管理您的所有寄件订单明细。</p>
    </section>
    <section class="auth-box">
      <el-card class="auth-card">
        <h2>注册寄件人账号</h2>
        <p class="sub">用户名不能重复，密码不能为空。</p>
        <el-form :model="form" label-position="top">
          <el-form-item label="用户名"><el-input v-model="form.username" size="large" /></el-form-item>
          <el-form-item label="密码"><el-input v-model="form.password" size="large" type="password" show-password /></el-form-item>
          <el-form-item label="姓名"><el-input v-model="form.realName" size="large" placeholder="您的真实姓名" /></el-form-item>
          <el-form-item label="手机"><el-input v-model="form.phone" size="large" placeholder="收发货联系手机号" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="form.email" size="large" placeholder="联系电子邮箱" /></el-form-item>
          <el-button type="primary" size="large" style="width:100%" @click="submit">创建账号</el-button>
          <el-button link style="margin-top:12px" @click="$router.push('/login')">返回登录</el-button>
        </el-form>
      </el-card>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '../api/modules'
import { useRouter } from 'vue-router'
const router = useRouter()
const form = reactive({
  username: '',
  password: '',
  realName: '',
  phone: '',
  email: ''
})
async function submit() {
  if (!form.username || !form.password) {
    ElMessage.warning('用户名和密码不能为空')
    return
  }
  await authApi.register(form)
  ElMessage.success('注册成功')
  router.push('/login')
}
</script>
