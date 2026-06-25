<template>
  <div class="page-container" v-if="route">
    <section class="detail-hero">
      <div class="hero-image-wrapper">
        <img :src="route.coverImage" alt="route" class="hero-image">
      </div>
      <div class="detail-panel">
        <div class="panel-header">
          <el-tag type="success" effect="dark" class="status-tag">正在上架</el-tag>
          <span class="spot-id-badge">景点 ID {{ route.spotId }}</span>
        </div>
        <h1 class="route-title">{{ route.routeName }}</h1>
        <p class="route-desc">{{ route.description }}</p>
        
        <div class="info-row">
          <span class="pill-info">
            <el-icon><Calendar /></el-icon>
            {{ route.days }} 天行程
          </span>
          <span class="pill-info">
            <el-icon><User /></el-icon>
            最多 {{ route.maxPeople }} 人
          </span>
        </div>

        <div class="price-box">
          <span class="price-label">起价</span>
          <span class="price-val">￥{{ route.price }}</span>
          <span class="price-unit">/ 人</span>
        </div>

        <el-divider />

        <div class="package-selection-box">
          <h3 class="selection-title">选择旅游套餐</h3>
          <el-radio-group v-model="pkg" class="package-radio-group">
            <el-radio-button v-for="p in packages" :label="p.id" :key="p.id">
              <div class="radio-btn-content">
                <span class="p-name">{{ p.packageName }}</span>
                <span class="p-price">￥{{ p.price }}</span>
              </div>
            </el-radio-button>
          </el-radio-group>

          <!-- Selected Package Service details -->
          <div v-if="selectedPackage" class="service-details-card">
            <div class="service-detail-item">
              <span class="service-header include">
                <el-icon><CircleCheck /></el-icon> 费用包含
              </span>
              <p class="service-text">{{ selectedPackage.includeService || '请选择套餐查看包含项目' }}</p>
            </div>
            <div class="service-detail-item">
              <span class="service-header exclude">
                <el-icon><CircleClose /></el-icon> 费用不含
              </span>
              <p class="service-text">{{ selectedPackage.excludeService || '无' }}</p>
            </div>
          </div>
        </div>

        <el-button type="primary" size="large" class="booking-btn" @click="$router.push('/booking/'+route.id+'?packageId='+pkg)">
          立即预订
        </el-button>
      </div>
    </section>

    <section class="itinerary-section">
      <div class="section-title-box">
        <el-icon class="section-icon"><Compass /></el-icon>
        <div>
          <h2>行程安排安排</h2>
          <p class="section-subtitle">精心设计的每一天深度游玩规划，带您领略最美风景</p>
        </div>
      </div>

      <div class="timeline-wrapper">
        <el-timeline class="custom-timeline">
          <el-timeline-item
            v-for="(item, index) in parsedItinerary"
            :key="index"
            type="primary"
            :hollow="true"
            size="large"
          >
            <div class="itinerary-day-card">
              <div class="day-card-header">
                <div class="day-badge">{{ item.day }}</div>
                <h3 class="day-title">{{ item.title }}</h3>
              </div>
              <div class="day-card-body">
                <p class="day-description">{{ item.content }}</p>
                <div v-if="item.activities && item.activities.length > 1" class="activities-flow">
                  <div v-for="(act, actIndex) in item.activities" :key="actIndex" class="activity-node">
                    <span class="node-index">{{ actIndex + 1 }}</span>
                    <span class="node-text">{{ act }}</span>
                    <el-icon v-if="actIndex < item.activities.length - 1" class="node-arrow"><Right /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { routeApi } from '../api/modules'
import { Calendar, User, CircleCheck, CircleClose, Compass, Right } from '@element-plus/icons-vue'

const route = ref(null)
const packages = ref([])
const pkg = ref()
const r = useRoute()

onMounted(async () => {
  const d = await routeApi.detail(r.params.id)
  route.value = d.route
  packages.value = d.packages
  pkg.value = packages.value[0]?.id
})

// Calculate the currently selected package info
const selectedPackage = computed(() => {
  return packages.value.find(p => p.id === pkg.value)
})

// Parse the raw itinerary string into an array of structured day items
const parsedItinerary = computed(() => {
  if (!route.value || !route.value.itinerary) return []
  
  // Split by fullwidth semicolon (；), halfwidth semicolon (;), or newline
  const rawParts = route.value.itinerary.split(/[;；\n\r]+/)
  return rawParts
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map((part, index) => {
      // RegEx to look for day indicators, e.g., "D1", "Day 2", "第3天"
      const match = part.match(/^(D\d+|Day\s*\d+|第[一二三四五六七八九十\d]天)[:：\s-]*(.*)$/i)
      let day = ''
      let rest = part
      
      if (match) {
        day = match[1]
        rest = match[2].trim()
      } else {
        day = `Day ${index + 1}`
      }
      
      // Split the rest into activities by hyphen (-) or arrow (->)
      const activities = rest
        .split(/[-—]+|->/)
        .map(a => a.trim())
        .filter(a => a.length > 0)
        
      return {
        day,
        title: activities.length > 0 ? activities[0] : '行程规划',
        content: rest,
        activities
      }
    })
})
</script>

<style scoped>
.page-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 30px 20px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 30px;
  margin-bottom: 40px;
}

.hero-image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  height: 480px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.hero-image-wrapper:hover .hero-image {
  transform: scale(1.03);
}

.detail-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(20, 33, 61, 0.05);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.status-tag {
  font-weight: 700;
  letter-spacing: 0.5px;
}

.spot-id-badge {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.route-title {
  margin: 0 0 12px 0;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

.route-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.info-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.pill-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #0f766e;
  background: #f0fdf4;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  border: 1px solid #dcfce7;
}

.price-box {
  background: linear-gradient(135deg, #fef3c7, #fffbeb);
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid #fde68a;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 20px;
}

.price-label {
  font-size: 13px;
  color: #b45309;
  font-weight: 600;
}

.price-val {
  font-size: 32px;
  font-weight: 900;
  color: #d97706;
}

.price-unit {
  font-size: 14px;
  color: #b45309;
  font-weight: 550;
}

.package-selection-box {
  margin-bottom: 24px;
}

.selection-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 14px 0;
}

.package-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.package-radio-group :deep(.el-radio-button__inner) {
  border-radius: 8px !important;
  border: 1px solid #cbd5e1 !important;
  padding: 10px 16px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.package-radio-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0f766e !important;
  border-color: #0f766e !important;
  box-shadow: 0 4px 10px rgba(15, 118, 110, 0.15);
}

.radio-btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.p-name {
  font-weight: 700;
  font-size: 14px;
}

.p-price {
  font-size: 12px;
  opacity: 0.9;
}

.service-details-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.service-detail-item {
  margin-bottom: 12px;
}

.service-detail-item:last-child {
  margin-bottom: 0;
}

.service-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.service-header.include {
  color: #0f766e;
}

.service-header.exclude {
  color: #64748b;
}

.service-text {
  font-size: 13px;
  color: #334155;
  margin: 0;
  padding-left: 20px;
  line-height: 1.6;
}

.booking-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 8px;
  background: linear-gradient(135deg, #0f766e, #0d9488);
  border: none;
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.3);
  transition: all 0.3s ease;
}

.booking-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
}

/* Itinerary Styles */
.itinerary-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  margin-top: 30px;
}

.section-title-box {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 30px;
}

.section-icon {
  font-size: 32px;
  color: #0f766e;
  background: #f0fdf4;
  padding: 10px;
  border-radius: 12px;
}

.section-title-box h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.section-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #64748b;
}

.timeline-wrapper {
  margin-top: 10px;
  padding-left: 10px;
}

.custom-timeline :deep(.el-timeline-item__node--primary) {
  background-color: #0f766e;
}

.itinerary-day-card {
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-left: 10px;
  transition: all 0.3s ease;
  position: relative;
}

.itinerary-day-card:hover {
  transform: translateX(6px);
  border-color: #0d9488;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.06);
}

.day-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.day-badge {
  background: linear-gradient(135deg, #0f766e, #22c55e);
  color: #ffffff;
  font-weight: 900;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(15, 118, 110, 0.2);
  text-transform: uppercase;
}

.day-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #1e293b;
}

.day-description {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
  margin: 0 0 16px 0;
}

.activities-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
}

.activity-node {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #334155;
  font-weight: 600;
  transition: all 0.2s ease;
}

.activity-node:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.node-index {
  background: #f0fdf4;
  color: #0f766e;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
}

.node-text {
  font-size: 12.5px;
}

.node-arrow {
  color: #94a3b8;
  margin-left: 4px;
  font-size: 14px;
}

@media (max-width: 860px) {
  .detail-hero {
    grid-template-columns: 1fr;
  }
  .hero-image-wrapper {
    height: 320px;
  }
}
</style>
