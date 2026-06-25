<template>
  <div class="page-container">
    <section class="section-head">
      <div class="header-content">
        <h2 class="page-title">热门景点探索</h2>
        <p class="muted subtitle">精心为您甄选全国顶级5A景区，领略祖国壮美河山</p>
      </div>
    </section>
    
    <div class="toolbar">
      <el-input v-model="q.name" placeholder="输入景点名称..." style="width:240px" clearable :prefix-icon="Search" />
      <el-input v-model="q.location" placeholder="输入地区/省份..." style="width:200px" clearable :prefix-icon="MapLocation" />
      <el-button type="primary" class="search-btn" @click="load">开始探索</el-button>
    </div>

    <div class="spot-grid" v-if="list.length > 0">
      <div v-for="s in list" :key="s.id" class="spot-card">
        <div class="spot-image-wrapper">
          <img class="spot-cover" :src="s.coverImage" :alt="s.name" @error="handleImageError">
          <!-- Overlays -->
          <div class="spot-badges">
            <span class="spot-level-tag">{{ s.level }}</span>
            <span class="spot-location-tag">
              <el-icon><Location /></el-icon>
              {{ s.location }}
            </span>
          </div>
        </div>
        <div class="spot-details">
          <h3 class="spot-title">{{ s.name }}</h3>
          <p class="spot-description">{{ s.description }}</p>
        </div>
      </div>
    </div>
    
    <el-empty v-else description="暂无符合条件的景点，换个关键词试试吧" :image-size="120" />

    <div class="pagination-container" v-if="total > q.size">
      <el-pagination 
        background
        layout="prev, pager, next, total" 
        :total="total" 
        v-model:current-page="q.page" 
        :page-size="q.size" 
        @current-change="load" 
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Search, MapLocation, Location } from '@element-plus/icons-vue'
import { spotApi } from '../api/modules'

const q = reactive({ page: 1, size: 9 }) // 3x3 layout works perfectly with 9 items
const list = ref([])
const total = ref(0)

const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800' // high quality default travel image

async function load() {
  const p = await spotApi.list(q)
  list.value = p.records
  total.value = p.total
}

function handleImageError(e) {
  e.target.src = defaultImage
}

onMounted(load)
</script>

<style scoped>
.page-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 30px 20px 60px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-head {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 30px;
  padding: 18px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.search-btn {
  background: linear-gradient(135deg, #0f766e, #0d9488);
  border: none;
  font-weight: 700;
  padding: 0 24px;
  height: 40px;
  box-shadow: 0 4px 10px rgba(13, 148, 136, 0.2);
}

.search-btn:hover {
  background: linear-gradient(135deg, #0d9488, #14b8a6);
}

/* Spot Cards Grid */
.spot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.spot-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 33, 61, 0.04);
  border: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.spot-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(20, 33, 61, 0.1);
  border-color: #cbd5e1;
}

.spot-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f1f5f9;
}

.spot-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.spot-card:hover .spot-cover {
  transform: scale(1.05);
}

/* Overlays on Image */
.spot-badges {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.spot-level-tag {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 800;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.35);
  letter-spacing: 0.5px;
}

.spot-location-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.spot-details {
  padding: 22px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.spot-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.spot-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  /* Multi-line ellipsis (Clamp at 2 lines) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
