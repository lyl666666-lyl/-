<template>
  <div>
    <section class="section-head" style="margin-top:0">
      <div>
        <h2>物流运营仪表盘</h2>
        <p class="muted">查看网点运单总量、异常件、已签收和当前运费收入汇总，便于高效调配专员及运力。</p>
      </div>
      <el-button v-if="store.isAdmin" type="primary" @click="$router.push('/admin/orders')">查看订单明细</el-button>
      <el-button v-else-if="store.isSpecialist" type="primary" @click="$router.push('/admin/collect')">进行分拣揽收</el-button>
    </section>
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-label">总运单量</div>
        <div class="stat-number">{{ s.totalCount || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">待揽收包裹</div>
        <div class="stat-number" style="color: #ea580c;">{{ s.pendingCollectCount || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">异常包裹数</div>
        <div class="stat-number" style="color: #dc2626;">{{ s.abnormalCount || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已签收完成</div>
        <div class="stat-number" style="color: #16a34a;">{{ s.signedCount || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">预估运费收入</div>
        <div class="stat-number" style="color: #0d9488;">￥{{ (s.totalAmount || 0).toFixed(2) }}</div>
      </div>
    </div>
    <div class="dashboard-panel">
      <h3 style="margin-top:0">在线物流系统演示闭环</h3>
      <el-steps :active="store.isSpecialist ? 3 : 4" align-center style="margin-top: 30px;">
        <el-step title="寄件下单" description="客户输入收发地址提交" />
        <el-step title="上门揽收" description="专员扫码指定网点接收" />
        <el-step title="干线中转" description="北京/上海等网点干线运输" />
        <el-step title="配送签收" description="派送至终点收件人并签收" />
      </el-steps>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { adminOrderApi } from '../../api/modules'
import { useUserStore } from '../../store/user'

const store = useUserStore()
const s = reactive({
  totalCount: 0,
  pendingCollectCount: 0,
  abnormalCount: 0,
  signedCount: 0,
  totalAmount: 0
})

onMounted(async () => {
  try {
    const res = await adminOrderApi.stat()
    Object.assign(s, res)
  } catch (err) {
    // 拦截器处理
  }
})
</script>
