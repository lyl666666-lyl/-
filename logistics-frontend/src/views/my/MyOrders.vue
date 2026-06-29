<template>
  <div class="my-orders-page" style="max-width: 1000px; margin: 20px auto; padding: 0 20px;">
    <el-card style="border-radius: 12px; min-height: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 18px; color: #1e293b;">我的寄件订单</span>
          <el-button type="primary" size="default" @click="$router.push('/booking')">我要寄件</el-button>
        </div>
      </template>

      <!-- 状态筛选 -->
      <el-tabs v-model="activeTab" @tab-change="fetchOrders" style="margin-bottom: 20px;">
        <el-tab-pane label="全部" name="" />
        <el-tab-pane label="待揽收" name="PENDING_COLLECT" />
        <el-tab-pane label="已揽收" name="COLLECTED" />
        <el-tab-pane label="运输中" name="IN_TRANSIT" />
        <el-tab-pane label="派送中" name="DELIVERING" />
        <el-tab-pane label="已签收" name="SIGNED" />
        <el-tab-pane label="已撤销" name="CANCELLED" />
      </el-tabs>

      <el-table v-loading="loading" :data="orders" style="width: 100%;" border stripe>
        <el-table-column prop="orderNo" label="运单号" width="160" />
        <el-table-column prop="receiverName" label="收件人" width="100" />
        <el-table-column prop="receiverAddress" label="收件地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="itemType" label="物品" width="90" align="center" />
        <el-table-column prop="weight" label="重量" width="90" align="center">
          <template #default="scope">{{ scope.row.weight }} kg</template>
        </el-table-column>
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
        <el-table-column label="是否异常" width="90" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isAbnormal === 1" type="danger" size="small">异常</el-tag>
            <span v-else style="color: #94a3b8;">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="viewTrack(scope.row)">轨迹追踪</el-button>
            <el-popconfirm
              v-if="scope.row.status === 'PENDING_COLLECT'"
              title="确定撤销这个订单吗？"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="cancelOrder(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger" link>撤销寄件</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 物流轨迹弹窗 -->
    <el-dialog v-model="trackVisible" title="物流轨迹追踪" width="600px" align-center>
      <div v-if="currentTrack" v-loading="trackLoading" style="padding: 10px 0;">
        <div style="margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
          <div style="font-weight: 700; color: #1e293b; font-size: 16px; margin-bottom: 6px;">运单号：{{ currentTrack.order.orderNo }}</div>
          <div style="font-size: 14px; color: #64748b;">
            当前位置：<span style="font-weight: 600; color: #0f766e;">{{ currentTrack.order.currentOutletName || '首站揽收中' }}</span>
          </div>
        </div>

        <el-alert
          v-if="currentTrack.order.isAbnormal === 1"
          title="异常快件信息"
          type="warning"
          :description="`异常原因: ${currentTrack.order.abnormalReason || '未录入原因'}`"
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { orderApi } from '../../api/modules'

const loading = ref(false)
const activeTab = ref('')
const orders = ref([])

const trackVisible = ref(false)
const trackLoading = ref(false)
const currentTrack = ref(null)

async function fetchOrders() {
  loading.value = true
  try {
    orders.value = await orderApi.my(activeTab.value)
  } catch (err) {
    // 错误处理已在全局拦截
  } finally {
    loading.value = false
  }
}

async function cancelOrder(id) {
  try {
    await orderApi.cancel(id)
    ElMessage.success('订单已撤销')
    fetchOrders()
  } catch (err) {
    // 错误处理
  }
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
