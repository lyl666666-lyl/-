<template>
  <div class="booking-page" style="max-width: 800px; margin: 30px auto; padding: 0 20px;">
    <el-card style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <el-icon style="font-size: 20px; color: #0f766e;"><Tickets /></el-icon>
          <span style="font-weight: 700; font-size: 18px; color: #1e293b;">在线寄件下单</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <!-- 寄件人信息 -->
        <h3 class="section-title"><span class="badge sender-badge">寄</span>寄件人信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="寄件人姓名" prop="senderName">
              <el-input v-model="form.senderName" placeholder="请填写寄件人真实姓名" size="large" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="senderPhone">
              <el-input v-model="form.senderPhone" placeholder="请填写寄件人手机号" size="large" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="寄件详细地址" prop="senderAddress">
          <el-input v-model="form.senderAddress" placeholder="请填写上门揽收的详细地址" size="large" />
        </el-form-item>

        <!-- 收件人信息 -->
        <h3 class="section-title"><span class="badge receiver-badge">收</span>收件人信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收件人姓名" prop="receiverName">
              <el-input v-model="form.receiverName" placeholder="请填写收件人真实姓名" size="large" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="receiverPhone">
              <el-input v-model="form.receiverPhone" placeholder="请填写收件人手机号" size="large" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="收件详细地址" prop="receiverAddress">
          <el-input v-model="form.receiverAddress" placeholder="请填写送达详细地址" size="large" />
        </el-form-item>

        <!-- 物品与重量信息 -->
        <h3 class="section-title"><span class="badge item-badge">货</span>托寄物信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物品类型" prop="itemType">
              <el-select v-model="form.itemType" placeholder="请选择物品类型" size="large" style="width: 100%;">
                <el-option label="文件" value="文件" />
                <el-option label="电子产品" value="电子产品" />
                <el-option label="日用品" value="日用品" />
                <el-option label="服饰" value="服饰" />
                <el-option label="食品" value="食品" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物品重量 (kg)" prop="weight">
              <el-input-number v-model="form.weight" :min="0.1" :precision="2" :step="0.5" size="large" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 费用估算 -->
        <div style="background-color: #f0fdf4; padding: 16px 20px; border-radius: 8px; border: 1px dashed #bbf7d0; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 14px; color: #166534; font-weight: 500;">预估计费规则：</span>
            <span style="font-size: 13px; color: #16a34a;">起步首重 12.00元 (含1kg)，超出部分每公斤收取 3.00元</span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px; color: #166534;">预估费用</div>
            <div style="font-size: 24px; font-weight: 800; color: #166534;">￥{{ calculatedPrice.toFixed(2) }}</div>
          </div>
        </div>

        <el-button type="primary" size="large" style="width: 100%;" :loading="submitLoading" @click="submitOrder">立即下单</el-button>
      </el-form>
    </el-card>

    <!-- 下单成功弹窗 -->
    <el-dialog v-model="successVisible" title="寄件下单成功" width="500px" align-center :close-on-click-modal="false" :show-close="false">
      <div style="text-align: center; padding: 10px 0;">
        <div style="color: #10b981; font-size: 48px; margin-bottom: 16px;">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">您的运单提交成功！</h3>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">
          系统已为您生成物流单号：<br/>
          <strong style="color: #1e293b; font-size: 18px; display: block; margin-top: 8px;">{{ createdOrderNo }}</strong>
        </p>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">
          请准备好包裹，等待我们的快递专员联系并上门揽收。
        </p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <el-button type="primary" @click="$router.push('/my/orders')">查看我的寄件</el-button>
          <el-button plain @click="resetForm">继续寄件</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { orderApi, userApi } from '../api/modules'
import { Tickets, CircleCheck } from '@element-plus/icons-vue'

const formRef = ref(null)
const submitLoading = ref(false)
const successVisible = ref(false)
const createdOrderNo = ref('')

const form = reactive({
  senderName: '',
  senderPhone: '',
  senderAddress: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  itemType: '文件',
  weight: 1.0
})

const rules = {
  senderName: [{ required: true, message: '请填写寄件人姓名', trigger: 'blur' }],
  senderPhone: [{ required: true, message: '请填写寄件电话', trigger: 'blur' }],
  senderAddress: [{ required: true, message: '请填写寄件人详细地址', trigger: 'blur' }],
  receiverName: [{ required: true, message: '请填写收件人姓名', trigger: 'blur' }],
  receiverPhone: [{ required: true, message: '请填写收件电话', trigger: 'blur' }],
  receiverAddress: [{ required: true, message: '请填写收件人详细地址', trigger: 'blur' }],
  itemType: [{ required: true, message: '请选择物品类型', trigger: 'change' }]
}

// 费用计算
const calculatedPrice = computed(() => {
  const w = parseFloat(form.weight) || 0
  if (w <= 0) return 0
  if (w <= 1.0) return 12.0
  return 12.0 + (w - 1.0) * 3.0
})

onMounted(async () => {
  try {
    const user = await userApi.profile()
    if (user) {
      form.senderName = user.realName || user.username
      form.senderPhone = user.phone || ''
    }
  } catch (err) {
    // 忽略未登录或出错
  }
})

async function submitOrder() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const res = await orderApi.create(form)
      createdOrderNo.value = res.orderNo
      successVisible.value = true
    } catch (err) {
      // 错误已被拦截器弹出
    } finally {
      submitLoading.value = false
    }
  })
}

function resetForm() {
  successVisible.value = false
  form.receiverName = ''
  form.receiverPhone = ''
  form.receiverAddress = ''
  form.itemType = '文件'
  form.weight = 1.0
}
</script>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 24px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge {
  font-size: 11px;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}
.sender-badge {
  background-color: #2563eb;
}
.receiver-badge {
  background-color: #ea580c;
}
.item-badge {
  background-color: #0f766e;
}
</style>
