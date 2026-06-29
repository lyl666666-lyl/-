<template>
  <div>
    <section class="section-head" style="margin-top:0">
      <div>
        <h2>运输配送与签收登记</h2>
        <p class="muted">追踪货物在干线节点间的中转更新，派送包裹，并进行签收登记归档。</p>
      </div>
    </section>

    <el-tabs v-model="activeTab" @tab-change="fetchOrders">
      <el-tab-pane label="干线运输中" name="IN_TRANSIT" />
      <el-tab-pane label="末端派送中" name="DELIVERING" />
      <el-tab-pane label="已签收快件" name="SIGNED" />
    </el-tabs>

    <!-- 搜索框 -->
    <div style="margin-bottom: 15px; display: flex; gap: 10px;">
      <el-input v-model="orderNoQuery" placeholder="请输入运单号搜索" clearable style="max-width: 300px;" @keyup.enter="fetchOrders" />
      <el-button type="primary" @click="fetchOrders">搜索</el-button>
    </div>

    <!-- 数据表格 -->
    <el-card style="border-radius: 8px;">
      <el-table v-loading="loading" :data="orders" border stripe style="width: 100%;">
        <el-table-column prop="orderNo" label="运单号" width="160" align="center" />
        <el-table-column prop="senderName" label="发件人" width="100" />
        <el-table-column prop="receiverName" label="收件人" width="100" />
        <el-table-column prop="receiverPhone" label="收件电话" width="120" />
        <el-table-column prop="receiverAddress" label="收件详细地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="itemType" label="物品类型" width="90" align="center" />
        <el-table-column prop="weight" label="重量" width="80" align="center">
          <template #default="scope">{{ scope.row.weight }} kg</template>
        </el-table-column>
        <el-table-column prop="currentOutletName" label="当前所在网点" width="140" align="center" />
        <el-table-column label="异常状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isAbnormal === 1" type="danger">异常</el-tag>
            <span v-else style="color: #94a3b8;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="signTime" label="签收时间" width="170" align="center" v-if="activeTab === 'SIGNED'" />
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="scope">
            <!-- 运输中操作 -->
            <template v-if="activeTab === 'IN_TRANSIT'">
              <el-button type="primary" size="small" @click="openTransit(scope.row)">中转更新</el-button>
              <el-button type="success" size="small" @click="startDelivery(scope.row.id)">开始派送</el-button>
            </template>

            <!-- 派送中操作 -->
            <template v-if="activeTab === 'DELIVERING'">
              <el-button type="success" size="small" @click="openSign(scope.row)">签收登记</el-button>
              <el-button type="danger" plain size="small" @click="openAbnormal(scope.row)">登记异常</el-button>
            </template>

            <!-- 已签收操作 -->
            <span v-if="activeTab === 'SIGNED'" style="color: #94a3b8; font-size: 13px;">签收人: {{ scope.row.receiverSignature }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 中转更新弹框 -->
    <el-dialog v-model="transitVisible" title="更新快件中转/运输位置" width="460px" align-center>
      <el-form :model="transitForm" ref="transitFormRef" label-position="top">
        <el-form-item label="轨迹位置描述" required>
          <el-input v-model="transitForm.description" placeholder="例如：快件已离开上海分拨中心，发往杭州运转网点" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="更新当前所在网点 (可选)">
          <el-select v-model="transitForm.outletId" placeholder="如果到达了新网点，请选择" clearable style="width: 100%;">
            <el-option v-for="o in outlets" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transitVisible = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="submitTransit">提交中转更新</el-button>
      </template>
    </el-dialog>

    <!-- 签收登记弹框 -->
    <el-dialog v-model="signVisible" title="快件签收登记" width="460px" align-center>
      <el-form :model="signForm" ref="signFormRef" label-position="top">
        <el-form-item label="签收人姓名" required>
          <el-input v-model="signForm.receiverSignature" placeholder="请输入实际签收人的姓名（如：本人、同事代收等）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="signVisible = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="submitSign">确认签收</el-button>
      </template>
    </el-dialog>

    <!-- 登记异常弹窗 -->
    <el-dialog v-model="abnormalVisible" title="快件异常登记" width="460px" align-center>
      <el-form :model="abnormalForm" ref="abnormalFormRef" label-position="top">
        <el-form-item label="异常原因描述" required>
          <el-input v-model="abnormalForm.reason" placeholder="请输入具体的异常原因" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="abnormalVisible = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="submitAbnormal">提交异常</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { specialistOrderApi, outletApi } from '../../api/modules'

const loading = ref(false)
const orders = ref([])
const activeTab = ref('IN_TRANSIT')
const orderNoQuery = ref('')

const outlets = ref([])
const actionLoading = ref(false)

// Transit update Form
const transitVisible = ref(false)
const transitForm = reactive({ orderId: null, description: '', outletId: null })

// Sign Form
const signVisible = ref(false)
const signForm = reactive({ orderId: null, receiverSignature: '' })

// Abnormal Form
const abnormalVisible = ref(false)
const abnormalForm = reactive({ orderId: null, reason: '' })

async function fetchOrders() {
  loading.value = true
  try {
    const params = { status: activeTab.value }
    if (orderNoQuery.value) {
      params.orderNo = orderNoQuery.value
    }
    orders.value = await specialistOrderApi.list(params)
  } catch (err) {
    // 错误已被全局拦截
  } finally {
    loading.value = false
  }
}

async function fetchOutlets() {
  try {
    outlets.value = await outletApi.list({ status: 'ENABLE' })
  } catch (err) {
    // 错误已处理
  }
}

function openTransit(row) {
  transitForm.orderId = row.id
  transitForm.description = `快件已到达网点：【${row.currentOutletName || '下一中转网点'}】，正在进行下一步派发。`
  transitForm.outletId = row.currentOutletId
  transitVisible.value = true
}

async function submitTransit() {
  if (!transitForm.description) {
    ElMessage.warning('请输入中转描述')
    return
  }
  actionLoading.value = true
  try {
    await specialistOrderApi.transit(transitForm.orderId, transitForm.description, transitForm.outletId)
    ElMessage.success('中转轨迹更新成功')
    transitVisible.value = false
    fetchOrders()
  } catch (err) {
    // 处理
  } finally {
    actionLoading.value = false
  }
}

async function startDelivery(id) {
  try {
    await specialistOrderApi.delivery(id)
    ElMessage.success('包裹已进入末端派送流程')
    fetchOrders()
  } catch (err) {
    // 处理
  }
}

function openSign(row) {
  signForm.orderId = row.id
  signForm.receiverSignature = row.receiverName // 默认收件人姓名
  signVisible.value = true
}

async function submitSign() {
  if (!signForm.receiverSignature) {
    ElMessage.warning('请输入签收人姓名')
    return
  }
  actionLoading.value = true
  try {
    await specialistOrderApi.sign(signForm.orderId, signForm.receiverSignature)
    ElMessage.success('签收成功，运单已完成')
    signVisible.value = false
    fetchOrders()
  } catch (err) {
    // 处理
  } finally {
    actionLoading.value = false
  }
}

function openAbnormal(row) {
  abnormalForm.orderId = row.id
  abnormalForm.reason = ''
  abnormalVisible.value = true
}

async function submitAbnormal() {
  if (!abnormalForm.reason) {
    ElMessage.warning('请输入异常描述')
    return
  }
  actionLoading.value = true
  try {
    await specialistOrderApi.abnormal(abnormalForm.orderId, abnormalForm.reason)
    ElMessage.success('异常标记登记成功')
    abnormalVisible.value = false
    fetchOrders()
  } catch (err) {
    // 处理
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  fetchOrders()
  fetchOutlets()
})
</script>
