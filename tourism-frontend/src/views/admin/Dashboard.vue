<template>
  <div>
    <section class="section-head" style="margin-top:0">
      <div>
        <h2>运营仪表盘</h2>
        <p class="muted">快速查看订单、核对、今日出行和销售金额，支持进入对应业务页面处理。</p>
      </div>
      <el-button type="primary" @click="$router.push('/admin/orders')">处理待核对订单</el-button>
    </section>
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-label">订单总数</div>
        <div class="stat-number">{{ s.orderCount || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">待核对订单</div>
        <div class="stat-number">{{ s.pendingCount || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">今日出行</div>
        <div class="stat-number">{{ s.todayTravelCount || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">总销售金额</div>
        <div class="stat-number">￥{{ s.totalAmount || 0 }}</div>
      </div>
    </div>
    <div class="dashboard-panel">
      <h3 style="margin-top:0">答辩演示建议流程</h3>
      <el-steps :active="2" align-center>
        <el-step title="维护线路" description="景点、线路、套餐" />
        <el-step title="游客预订" description="出行人、日期、人数" />
        <el-step title="订单核对" description="确认或退回修改" />
        <el-step title="出行安排" description="导游、批次、提醒" />
        <el-step title="售后报表" description="回复售后并导出" />
      </el-steps>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { adminOrderApi } from '../../api/modules'
const s = reactive({})
onMounted(async () => Object.assign(s, await adminOrderApi.stat({})))
</script>
