<template>
  <div class="page">
    <section class="section-head">
      <div>
        <h2>旅游线路</h2>
        <p class="muted">筛选目的地、天数和价格，选择合适套餐后提交预订。</p>
      </div>
    </section>
    <div class="toolbar">
      <el-input v-model="q.keyword" placeholder="线路关键字" style="width:220px" clearable />
      <el-input-number v-model="q.days" placeholder="天数" :min="1" />
      <el-input-number v-model="q.minPrice" placeholder="最低价" :min="0" />
      <el-input-number v-model="q.maxPrice" placeholder="最高价" :min="0" />
      <el-button type="primary" :icon="Search" @click="load">查询</el-button>
    </div>
    <div class="card-grid">
      <el-card v-for="r in list" :key="r.id" class="travel-card">
        <img class="cover" :src="r.coverImage">
        <h3 class="card-title">{{ r.routeName }}</h3>
        <p class="muted">{{ r.description }}</p>
        <div class="card-meta">
          <span class="price">￥{{ r.price }}</span>
          <span class="pill">{{ r.days }} 天 · {{ r.maxPeople }} 人以内</span>
        </div>
        <el-button type="primary" style="width:100%;margin-top:14px" @click="$router.push('/routes/'+r.id)">查看线路</el-button>
      </el-card>
    </div>
    <div style="display:flex;justify-content:center;margin-top:22px">
      <el-pagination layout="prev,pager,next,total" :total="total" v-model:current-page="q.page" :page-size="q.size" @current-change="load" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { routeApi } from '../api/modules'
const q = reactive({ page: 1, size: 8 })
const list = ref([])
const total = ref(0)
async function load() {
  const p = await routeApi.list(q)
  list.value = p.records
  total.value = p.total
}
onMounted(load)
</script>
