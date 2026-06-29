<template>
  <div class="page">
    <section class="hero" style="padding: 60px 40px; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; text-align: center; border-radius: 24px;">
      <el-tag type="primary" size="large" style="margin-bottom: 20px; font-weight: 700; border-radius: 8px;">在线物流系统 · 全程实时轨迹追踪</el-tag>
      <h1 style="font-size: 36px; font-weight: 800; margin-bottom: 12px; color: var(--ink); letter-spacing: -0.02em;">随时随地 掌握包裹动态</h1>
      <p style="color: var(--muted); max-width: 600px; margin-bottom: 30px; font-size: 16px; line-height: 1.6;">
        输入运单号查询包裹的实时中转轨迹；输入收寄件人姓名可进行安全校验。
      </p>

      <!-- 运单查询卡片 -->
      <div style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 18px; padding: 24px; border: 1px solid rgba(79, 70, 229, 0.15); width: 100%; max-width: 680px; text-align: left; box-shadow: var(--shadow);">
        <el-form :inline="true" :model="queryForm" style="display: flex; gap: 12px; margin-bottom: 0;" @submit.prevent="handleSearch">
          <el-form-item style="flex: 2; margin-bottom: 0; margin-right: 0;">
            <el-input v-model="queryForm.orderNo" placeholder="请输入运单号 (如: WL202606290001)" size="large" clearable />
          </el-form-item>
          <el-form-item style="flex: 1; margin-bottom: 0; margin-right: 0;">
            <el-input v-model="queryForm.senderName" placeholder="收寄件人姓名(选填)" size="large" clearable />
          </el-form-item>
          <el-button type="primary" size="large" :loading="loading" @click="handleSearch">查询轨迹</el-button>
        </el-form>
      </div>
    </section>

    <!-- 查询结果展示区域 -->
    <el-card v-if="trackResult" style="margin-bottom: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <span style="font-weight: 700; font-size: 18px; color: #1e293b;">运单号：{{ trackResult.order.orderNo }}</span>
            <el-tag :type="getStatusType(trackResult.order.status)" style="margin-left: 10px; font-weight: 600;">
              {{ getStatusLabel(trackResult.order.status) }}
            </el-tag>
            <el-tag v-if="trackResult.order.isAbnormal === 1" type="danger" style="margin-left: 10px; font-weight: 600;">
              异常件
            </el-tag>
          </div>
          <div style="font-size: 14px; color: #64748b;">
            下单时间：{{ trackResult.order.createTime }}
          </div>
        </div>
      </template>

      <!-- 运单详情卡片 -->
      <div style="margin-bottom: 24px; background-color: #f8fafc; border-radius: 8px; padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; border: 1px solid #f1f5f9;">
        <div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">寄件人</div>
          <div style="font-weight: 600; color: #334155; font-size: 15px;">{{ maskName(trackResult.order.senderName) }}</div>
          <div style="font-size: 13px; color: #64748b;">{{ trackResult.order.senderAddress }}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">收件人</div>
          <div style="font-weight: 600; color: #334155; font-size: 15px;">{{ maskName(trackResult.order.receiverName) }}</div>
          <div style="font-size: 13px; color: #64748b;">{{ trackResult.order.receiverAddress }}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">托寄物 / 重量</div>
          <div style="font-weight: 600; color: #334155; font-size: 15px;">{{ trackResult.order.itemType }}</div>
          <div style="font-size: 13px; color: #64748b;">{{ trackResult.order.weight }} kg</div>
        </div>
        <div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">运费 / 当前网点</div>
          <div style="font-weight: 600; color: #334155; font-size: 15px;">￥{{ trackResult.order.price }}</div>
          <div style="font-size: 13px; color: #64748b;">{{ trackResult.order.currentOutletName || '处理中' }}</div>
        </div>
      </div>

      <!-- 异常情况警告 -->
      <el-alert
        v-if="trackResult.order.isAbnormal === 1"
        title="物流异常提示"
        type="warning"
        :description="`快件异常原因：${trackResult.order.abnormalReason || '未知原因'}`"
        show-icon
        style="margin-bottom: 24px;"
        :closable="false"
      />

      <!-- 时间线轨迹 -->
      <h3 style="font-weight: 700; margin-bottom: 20px; font-size: 16px; color: #1e293b;">物流轨迹明细</h3>
      <el-timeline style="margin-left: 10px;">
        <el-timeline-item
          v-for="(log, idx) in trackResult.logs"
          :key="log.id"
          :type="idx === 0 ? 'primary' : ''"
          :color="idx === 0 ? '#0f766e' : ''"
          :size="idx === 0 ? 'large' : 'normal'"
          :timestamp="log.createTime"
        >
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-weight: 700; font-size: 15px; color: #1e293b;">{{ log.nodeName }}</span>
            <span style="font-size: 14px; color: #475569; line-height: 1.5;">{{ log.description }}</span>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 特色功能卡片展示 -->
    <section class="section-head" style="margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0;">我们的服务优势</h2>
        <p class="muted" style="margin: 0; color: #64748b; font-size: 14px;">智能化网点覆盖，全程精细化包裹运输管理</p>
      </div>
    </section>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 40px;">
      <el-card shadow="hover" style="border-radius: 12px; text-align: center; border: 1px solid #f1f5f9;">
        <div style="background-color: #f0fdf4; color: #16a34a; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 20px;">
          <el-icon><Tickets /></el-icon>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #1e293b;">在线寄件下单</h3>
        <p style="font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.5;">寄件人自助填写发收地址及托寄物信息，随时发布寄件订单。</p>
      </el-card>

      <el-card shadow="hover" style="border-radius: 12px; text-align: center; border: 1px solid #f1f5f9;">
        <div style="background-color: #eff6ff; color: #2563eb; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 20px;">
          <el-icon><Location /></el-icon>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #1e293b;">专员上门揽收</h3>
        <p style="font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.5;">物流专员收到待处理包裹，快速上门，扫码揽收并完成分拣入库。</p>
      </el-card>

      <el-card shadow="hover" style="border-radius: 12px; text-align: center; border: 1px solid #f1f5f9;">
        <div style="background-color: #faf5ff; color: #9333ea; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 20px;">
          <el-icon><MapLocation /></el-icon>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #1e293b;">干线中转路线</h3>
        <p style="font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.5;">管理员维护多条网点中转运输干线，科学调配干线物流运力。</p>
      </el-card>

      <el-card shadow="hover" style="border-radius: 12px; text-align: center; border: 1px solid #f1f5f9;">
        <div style="background-color: #fff7ed; color: #ea580c; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 20px;">
          <el-icon><Calendar /></el-icon>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #1e293b;">签收反馈登记</h3>
        <p style="font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.5;">配送完毕后支持面对面签收登记，实时更新签收状态及时间点。</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { orderApi } from '../api/modules'
import { Tickets, Location, MapLocation, Calendar } from '@element-plus/icons-vue'

const loading = ref(false)
const queryForm = reactive({ orderNo: '', senderName: '' })
const trackResult = ref(null)

async function handleSearch() {
  if (!queryForm.orderNo) {
    ElMessage.warning('请输入运单号')
    return
  }
  loading.value = true
  try {
    const res = await orderApi.track(queryForm.orderNo, queryForm.senderName)
    trackResult.value = res
  } catch (err) {
    trackResult.value = null
  } finally {
    loading.value = false
  }
}

function maskName(name) {
  if (!name) return ''
  if (name.length <= 1) return name
  return name.charAt(0) + '*'.repeat(name.length - 1)
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
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
  margin-top: 20px;
}
</style>
