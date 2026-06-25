<template>
  <div class="auth-page">
    <section class="auth-visual">
      <div class="brand">
        <span class="brand-mark">旅</span>
        <span>游客注册</span>
      </div>
      <h1>创建游客账号，体验完整预订流程</h1>
      <p>注册后可维护常用出行人、提交线路订单、查看出行提醒并发起售后咨询。</p>
    </section>
    <section class="auth-box">
      <el-card class="auth-card">
        <h2>注册游客账号</h2>
        <p class="sub">用户名不能重复，密码不能为空。</p>
        <el-form :model="form" label-position="top">
          <el-form-item label="用户名"><el-input v-model="form.username" size="large" /></el-form-item>
          <el-form-item label="密码"><el-input v-model="form.password" size="large" type="password" show-password /></el-form-item>
          <el-form-item label="姓名"><el-input v-model="form.realName" size="large" /></el-form-item>
          <el-form-item label="手机"><el-input v-model="form.phone" size="large" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="form.email" size="large" /></el-form-item>
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
const form = reactive({})
async function submit() {
  await authApi.register(form)
  ElMessage.success('注册成功')
  router.push('/login')
}
</script>
