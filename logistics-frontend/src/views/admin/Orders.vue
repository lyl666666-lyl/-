<template>
  <div>
    <section class="section-head" style="margin-top:0">
      <div>
        <h2>物流订单监控</h2>
        <p class="muted">全局监控平台物流状态，对异常快件进行跟踪查对，支持报表导出。</p>
      </div>
      <el-button type="success" @click="handleExport">导出 Excel 报表</el-button>
    </section>

    <!-- 搜索筛选 -->
    <el-card style="margin-bottom: 20px; border-radius: 8px;">
      <el-form :inline="true" :model="filter" style="margin-bottom: 0;">
        <el-form-item label="运单号">
          <el-input v-model="filter.orderNo" placeholder="完整运单号" clearable style="width: 180px;" />
        </el-form-item>
        <el-form-item label="寄件人姓名">
          <el-input v-model="filter.senderName" placeholder="模糊查询" clearable style="width: 140px;" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.status" placeholder="选择状态" clearable style="width: 120px;">
            <el-option label="待揽收" value="PENDING_COLLECT" />
            <el-option label="已揽收" value="COLLECTED" />
            <el-option label="运输中" value="IN_TRANSIT" />
            <el-option label="派送中" value="DELIVERING" />
            <el-option label="已签收" value="SIGNED" />
            <el-option label="已撤销" value="CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否异常">
          <el-select v-model="filter.isAbnormal" placeholder="选择" clearable style="width: 100px;">
            <el-option label="正常" :value="0" />
            <el-option label="异常" :value="1" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="fetchOrders">查询</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card style="border-radius: 8px;">
      <el-table v-loading="loading" :data="orders" border stripe style="width: 100%;">
        <el-table-column prop="orderNo" label="运单号" width="160" align="center" />
        <el-table-column prop="senderName" label="寄件人" width="100" />
        <el-table-column prop="senderPhone" label="寄件电话" width="120" />
        <el-table-column prop="senderAddress" label="寄件地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="receiverName" label="收件人" width="100" />
        <el-table-column prop="receiverPhone" label="收件电话" width="120" />
        <el-table-column prop="receiverAddress" label="收件地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="itemType" label="物品" width="90" align="center" />
        <el-table-column prop="weight" label="重量(kg)" width="90" align="center" />
        <el-table-column prop="price" label="运费" width="90" align="center">
          <template #default="scope">￥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="110" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="异常状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isAbnormal === 1" type="danger">异常</el-tag>
            <span v-else style="color: #94a3b8;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="170" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="viewTrack(scope.row)">追踪轨迹</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 轨迹弹框 -->
    <el-dialog v-model="trackVisible" title="物流轨迹详情" width="600px" align-center>
      <div v-if="currentTrack" v-loading="trackLoading" style="padding: 10px 0;">
        <div style="margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; color: #1e293b; font-size: 16px; margin-bottom: 4px;">运单号：{{ currentTrack.order.orderNo }}</div>
            <div style="font-size: 14px; color: #64748b;">
              当前网点：<span style="font-weight: 600; color: #0f766e;">{{ currentTrack.order.currentOutletName || '首站揽收中' }}</span>
            </div>
          </div>
          <div>
            <el-tag :type="getStatusType(currentTrack.order.status)">{{ getStatusLabel(currentTrack.order.status) }}</el-tag>
          </div>
        </div>

        <el-alert
          v-if="currentTrack.order.isAbnormal === 1"
          title="异常件提醒"
          type="warning"
          :description="`异常备注原因：${currentTrack.order.abnormalReason || '未填写原因'}`"
          show-icon
          style="margin-bottom: 20px;"
          :closable="false"
        />

        <el-timeline style="margin-left: 10px;">
          <el-timeline-item
            v-for="(log, idx) in currentTrack.logs"
            :key="log.id"
            :type="idx === 0 ? 'primary' : ''"
            :color="idx === 0 ? '#0f766e' : ''"
            :size="idx === 0 ? 'large' : 'normal'"
            :timestamp="log.createTime"
          >
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-weight: 700; color: #1e293b;">{{ log.nodeName }}</span>
              <span style="font-size: 13.5px; color: #475569;">{{ log.description }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminOrderApi, orderApi } from '../../api/modules'

const loading = ref(false)
const orders = ref([])
const filter = reactive({ orderNo: '', senderName: '', status: '', isAbnormal: null })

const trackVisible = ref(false)
const trackLoading = ref(false)
const currentTrack = ref(null)

async function fetchOrders() {
  loading.value = true
  try {
    orders.value = await adminOrderApi.list(filter)
  } catch (err) {
    // 错误处理
  } finally {
    loading.value = false
  }
}

function resetFilter() {
  filter.orderNo = ''
  filter.senderName = ''
  filter.status = ''
  filter.isAbnormal = null
  fetchOrders()
}

async function viewTrack(row) {
  trackVisible.value = true
  trackLoading.value = true
  try {
    currentTrack.value = await orderApi.track(row.orderNo)
  } catch (err) {
    trackVisible.value = false
  } finally {
    trackLoading.value = false
  }
}

async function handleExport() {
  try {
    ElMessage.info('正在生成报表，请稍候...')
    const blob = await adminOrderApi.export(filter)
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `logistics_orders_${Date.now()}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    ElMessage.success('报表导出成功')
  } catch (err) {
    ElMessage.error('导出报表失败，请稍后重试')
  }
}

function getStatusLabel(status) {
  const map = {
    'PENDING_COLLECT': '待揽收',
    'COLLECTED': '已揽收',
    'IN_TRANSIT': '运输中',
    'DELIVERING': '派送中',
    'SIGNED': '已签收',
    'CANCELLED': '已撤销'
  }
  return map[status] || status
}

function getStatusType(status) {
  const map = {
    'PENDING_COLLECT': 'info',
    'COLLECTED': 'warning',
    'IN_TRANSIT': 'primary',
    'DELIVERING': 'primary',
    'SIGNED': 'success',
    'CANCELLED': 'danger'
  }
  return map[status] || 'info'
}

onMounted(() => {
  fetchOrders()
})
</script>
