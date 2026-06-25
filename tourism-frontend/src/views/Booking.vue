<template>
  <div class="page">
    <section class="section-head">
      <div>
        <h2>提交预订</h2>
        <p class="muted">选择套餐、日期、人数和常用出行人后，订单进入待核对状态。</p>
      </div>
    </section>
    <el-card>
      <el-form :model="form" label-width="100px" class="form">
        <el-form-item label="套餐">
          <el-select v-model="form.packageId" size="large" style="width:100%">
            <el-option v-for="p in packages" :key="p.id" :label="p.packageName+' ￥'+p.price" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="出行日期"><el-date-picker v-model="form.travelDate" size="large" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="人数"><el-input-number v-model="form.peopleCount" size="large" :min="1" /></el-form-item>
        <el-form-item label="联系人"><el-input v-model="form.contactName" size="large" /></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="form.contactPhone" size="large" /></el-form-item>
        <el-form-item label="出行人">
          <el-checkbox-group v-model="form.travelerIds">
            <el-checkbox v-for="t in travelers" :key="t.id" :label="t.id" border>{{ t.name }} · {{ t.phone }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-button type="primary" size="large" @click="submit">提交订单</el-button>
        <el-button size="large" @click="$router.push('/my/travelers')">维护出行人</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { routeApi, travelerApi, orderApi } from '../api/modules'
const r = useRoute()
const router = useRouter()
const form = reactive({ routeId: Number(r.params.routeId), packageId: Number(r.query.packageId) || undefined, peopleCount: 1, travelerIds: [] })
const packages = ref([])
const travelers = ref([])
onMounted(async () => {
  packages.value = (await routeApi.detail(r.params.routeId)).packages
  travelers.value = await travelerApi.list()
})
async function submit() {
  await orderApi.create(form)
  ElMessage.success('预订成功')
  router.push('/my/orders')
}
</script>
