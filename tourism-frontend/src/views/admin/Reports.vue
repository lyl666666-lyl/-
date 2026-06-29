<template>
  <div>
    <section class="section-head" style="margin-top:0">
      <div>
        <h2>物流数据统计报表</h2>
        <p class="muted">根据物流网点和时间区间进行复合统计，分析整体网点负荷及签收率。</p>
      </div>
    </section>

    <!-- 统计筛选条件 -->
    <el-card style="margin-bottom: 25px; border-radius: 8px;">
      <el-form :inline="true" :model="form" style="margin-bottom: 0;">
        <el-form-item label="网点">
          <el-select v-model="form.outletId" placeholder="选择指定网点 (默认全部)" clearable style="width: 200px;">
            <el-option v-for="o in outlets" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="起止日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px;"
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="fetchStats">生成统计</el-button>
        <el-button @click="resetStats">清空</el-button>
      </el-form>
    </el-card>

    <!-- 统计看板结果 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 25px;">
      <el-card shadow="hover" style="border-radius: 12px; border-left: 5px solid #2563eb;">
        <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">统计总运单量</div>
        <div style="font-size: 28px; font-weight: 800; color: #1e293b; margin-top: 10px;">{{ s.totalCount || 0 }} <span style="font-size: 14px; font-weight: 500; color: #64748b;">单</span></div>
      </el-card>

      <el-card shadow="hover" style="border-radius: 12px; border-left: 5px solid #ea580c;">
        <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">待揽收包裹量</div>
        <div style="font-size: 28px; font-weight: 800; color: #ea580c; margin-top: 10px;">{{ s.pendingCollectCount || 0 }} <span style="font-size: 14px; font-weight: 500; color: #64748b;">单</span></div>
      </el-card>

      <el-card shadow="hover" style="border-radius: 12px; border-left: 5px solid #16a34a;">
        <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">已成功签收量</div>
        <div style="font-size: 28px; font-weight: 800; color: #16a34a; margin-top: 10px;">{{ s.signedCount || 0 }} <span style="font-size: 14px; font-weight: 500; color: #64748b;">单</span></div>
      </el-card>

      <el-card shadow="hover" style="border-radius: 12px; border-left: 5px solid #dc2626;">
        <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">物流异常件数</div>
        <div style="font-size: 28px; font-weight: 800; color: #dc2626; margin-top: 10px;">{{ s.abnormalCount || 0 }} <span style="font-size: 14px; font-weight: 500; color: #64748b;">单</span></div>
      </el-card>

      <el-card shadow="hover" style="border-radius: 12px; border-left: 5px solid #0d9488;">
        <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">产生运费收入</div>
        <div style="font-size: 28px; font-weight: 800; color: #0d9488; margin-top: 10px;">￥{{ (s.totalAmount || 0).toFixed(2) }}</div>
      </el-card>
    </div>

    <!-- 运营分析卡片 -->
    <el-card style="border-radius: 8px;">
      <template #header>
        <div style="font-weight: 700; color: #1e293b;">运营分析建议</div>
      </template>
      <div style="font-size: 14px; color: #475569; line-height: 1.8;">
        <p>1. <strong>签收率分析：</strong>当前已签收比例为 <span style="color: #16a34a; font-weight: 700;">{{ signedRate }}%</span>。若低于 80% 请重点关注派送人员的负荷及配送时效。</p>
        <p>2. <strong>异常快件比：</strong>当前异常快件比例为 <span style="color: #dc2626; font-weight: 700;">{{ abnormalRate }}%</span>。若此比例偏高，可能存在网点堆积或专员操作失误，应调阅相应运单轨迹分析异常发生原因并做针对性培训。</p>
        <p>3. <strong>网点及干线规划：</strong>建议结合网点运费收入及货量数据，对货量较大的网点（例如：北京/上海分拨中心）增配运输干线以减少包裹中转时间。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { adminOrderApi, outletApi } from '../../api/modules'

const loading = ref(false)
const dateRange = ref([])
const outlets = ref([])

const form = reactive({
  outletId: null,
  startDate: '',
  endDate: ''
})

const s = reactive({
  totalCount: 0,
  pendingCollectCount: 0,
  abnormalCount: 0,
  signedCount: 0,
  totalAmount: 0
})

const signedRate = computed(() => {
  if (s.totalCount === 0) return 0
  return Math.round((s.signedCount / s.totalCount) * 100)
})

const abnormalRate = computed(() => {
  if (s.totalCount === 0) return 0
  return Math.round((s.abnormalCount / s.totalCount) * 100)
})

async function fetchOutlets() {
  try {
    outlets.value = await outletApi.list({ status: 'ENABLE' })
  } catch (err) {
    // 错误处理
  }
}

async function fetchStats() {
  loading.value = true
  if (dateRange.value && dateRange.value.length === 2) {
    form.startDate = dateRange.value[0]
    form.endDate = dateRange.value[1]
  } else {
    form.startDate = ''
    form.endDate = ''
  }

  try {
    const res = await adminOrderApi.stat(form)
    Object.assign(s, res)
  } catch (err) {
    // 错误拦截
  } finally {
    loading.value = false
  }
}

function resetStats() {
  form.outletId = null
  dateRange.value = []
  form.startDate = ''
  form.endDate = ''
  fetchStats()
}

onMounted(() => {
  fetchOutlets()
  fetchStats()
})
</script>
