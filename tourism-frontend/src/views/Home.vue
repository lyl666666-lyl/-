<template>
  <div class="page">
    <section class="hero">
      <div class="hero-copy">
        <el-tag type="success" size="large">课程设计第 8 题 · 旅游管理系统</el-tag>
        <h1>发现优质线路，完成从预订到出行的全流程管理</h1>
        <p class="muted">系统覆盖景点展示、线路套餐、订单核对、导游安排、售后咨询 and 报表导出，适合答辩时演示完整业务闭环。</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/routes')">浏览热门线路</el-button>
          <el-button size="large" @click="$router.push('/spots')">查看推荐景点</el-button>
        </div>
      </div>
      <div class="carousel-wrapper">
        <el-carousel trigger="click" height="380px" arrow="always" class="custom-carousel" :interval="4000">
          <el-carousel-item v-for="(item, idx) in carouselItems" :key="idx">
            <div class="carousel-card" @click="$router.push(item.link)">
              <img :src="item.image" :alt="item.title" class="carousel-img">
              <div class="carousel-overlay">
                <div class="carousel-content">
                  <span class="carousel-tag">{{ item.tag }}</span>
                  <h3 class="carousel-title">{{ item.title }}</h3>
                  <p class="carousel-desc">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <section class="section-head">
      <div>
        <h2>热门线路</h2>
        <p class="muted">按上架线路展示，可直接进入详情并提交预订。</p>
      </div>
      <el-button text type="primary" @click="$router.push('/routes')">全部线路</el-button>
    </section>
    <div class="card-grid">
      <el-card v-for="r in routes" :key="r.id" class="travel-card">
        <img class="cover" :src="r.coverImage">
        <h3 class="card-title">{{ r.routeName }}</h3>
        <p class="muted">{{ r.description }}</p>
        <div class="card-meta">
          <span class="price">￥{{ r.price }}</span>
          <span class="pill">{{ r.days }} 天行程</span>
        </div>
        <el-button type="primary" style="width:100%;margin-top:14px" @click="$router.push('/routes/'+r.id)">查看详情</el-button>
      </el-card>
    </div>

    <section class="section-head">
      <div>
        <h2>推荐景点</h2>
        <p class="muted">景点与线路联动维护，便于管理员组织旅游产品。</p>
      </div>
    </section>
    <div class="card-grid">
      <el-card v-for="s in spots" :key="s.id" class="travel-card">
        <img class="cover" :src="s.coverImage">
        <h3 class="card-title">{{ s.name }}</h3>
        <p><span class="pill">{{ s.level }}</span></p>
        <p class="muted">{{ s.location }} · {{ s.description }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { routeApi, spotApi } from '../api/modules'

const routes = ref([])
const spots = ref([])

const carouselItems = ref([
  {
    title: '黄山三日摄影深色游',
    tag: '摄影好去处',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    desc: '云海、日出与徽派古村落，风光大片触手可及。',
    link: '/routes/2'
  },
  {
    title: '鼓浪屿三日亲子游',
    tag: '亲子甄选',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2',
    desc: '浪漫琴岛慢旅行，阳光沙滩与手作体验，其乐融融。',
    link: '/routes/4'
  },
  {
    title: '杭州西湖二日休闲游',
    tag: '周末首选',
    image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b',
    desc: '画舫游湖，雷峰夕照，寻觅最惬意的江南慢生活。',
    link: '/routes/1'
  },
  {
    title: '丽江雪山五日游',
    tag: '神秘雪山',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    desc: '壮丽冰川公园与神秘泸沽湖摩梭风情神秘走婚桥。',
    link: '/routes/5'
  }
])

onMounted(async () => {
  routes.value = (await routeApi.list({ size: 6 })).records
  spots.value = (await spotApi.list({ size: 6 })).records
})
</script>

<style scoped>
.carousel-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.custom-carousel :deep(.el-carousel__button) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
}

.custom-carousel :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #0f766e;
  width: 20px;
  border-radius: 4px;
}

.custom-carousel :deep(.el-carousel__arrow) {
  background-color: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(4px);
  color: #ffffff;
  transition: all 0.2s ease;
}

.custom-carousel :deep(.el-carousel__arrow:hover) {
  background-color: #0f766e;
}

.carousel-card {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.carousel-card:hover .carousel-img {
  transform: scale(1.03);
}

.carousel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 35%, rgba(15, 23, 42, 0.85) 100%);
  display: flex;
  align-items: flex-end;
  padding: 30px 24px;
}

.carousel-content {
  color: #ffffff;
  width: 100%;
}

.carousel-tag {
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
  color: #ffffff;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.carousel-title {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.carousel-desc {
  margin: 0;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 860px) {
  .carousel-wrapper {
    height: 320px;
  }
}
</style>
