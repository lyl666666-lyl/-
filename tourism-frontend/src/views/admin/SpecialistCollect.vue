<template>
   <div>
     <section class="section-head" style="margin-top:0">
       <div>
         <h2>快件揽收与网点分拣</h2>
         <p class="muted">处理客户提交的寄件请求，执行上门揽收，并在当前所属网点完成入库分拣。</p>
       </div>
     </section>
 
     <el-tabs v-model="activeTab" @tab-change="fetchOrders">
       <el-tab-pane label="待上门揽收" name="PENDING_COLLECT" />
       <el-tab-pane label="已揽收·待分拣" name="COLLECTED" />
     </el-tabs>
 
     <!-- 搜索框 -->
     <div style="margin-bottom: 15px; display: flex; gap: 10px;">
       <el-input v-model="orderNoQuery" placeholder="请输入运单号搜索" clearable style="max-width: 300px;" @keyup.enter="fetchOrders" />
       <el-button type="primary" @click="fetchOrders">搜索</el-button>
     </div>
 
     <!-- 列表表格 -->
     <el-card style="border-radius: 8px;">
       <el-table v-loading="loading" :data="orders" border stripe style="width: 100%;">
         <el-table-column prop="orderNo" label="运单号" width="160" align="center" />
         <el-table-column prop="senderName" label="寄件人" width="100" />
         <el-table-column prop="senderPhone" label="联系电话" width="120" />
         <el-table-column prop="senderAddress" label="揽收地址" min-width="180" show-overflow-tooltip />
         <el-table-column prop="itemType" label="物品" width="90" align="center" />
         <el-table-column prop="weight" label="重量" width="90" align="center">
           <template #default="scope">{{ scope.row.weight }} kg</template>
         </el-table-column>
         <el-table-column prop="price" label="运费" width="90" align="center">
           <template #default="scope">￥{{ scope.row.price }}</template>
         </el-table-column>
         <el-table-column prop="currentOutletName" label="当前网点" width="140" align="center" />
         <el-table-column label="操作" width="220" align="center" fixed="right">
           <template #default="scope">
             <el-button
               v-if="activeTab === 'PENDING_COLLECT'"
               type="success"
               size="small"
               @click="openCollect(scope.row)"
             >
               上门揽收
             </el-button>
             <el-button
               v-if="activeTab === 'COLLECTED'"
               type="primary"
               size="small"
               @click="openSort(scope.row)"
             >
               网点分拣
             </el-button>
             <el-button type="danger" plain size="small" @click="openAbnormal(scope.row)">
               登记异常
             </el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-card>
 
     <!-- 揽收弹窗 -->
     <el-dialog v-model="collectVisible" title="上门揽收登记" width="460px" align-center>
       <el-form :model="collectForm" ref="collectFormRef" label-position="top">
         <el-form-item label="请指定首站入库物流网点" required>
           <el-select v-model="collectForm.outletId" placeholder="请选择网点" style="width: 100%;">
             <el-option v-for="o in outlets" :key="o.id" :label="o.name" :value="o.id" />
           </el-select>
         </el-form-item>
       </el-form>
       <template #footer>
         <el-button @click="collectVisible = false">取消</el-button>
         <el-button type="primary" :loading="actionLoading" @click="submitCollect">确认揽收</el-button>
       </template>
     </el-dialog>
 
     <!-- 分拣弹窗 -->
     <el-dialog v-model="sortVisible" title="网点分拣入库/发出" width="460px" align-center>
       <el-form :model="sortForm" ref="sortFormRef" label-position="top">
         <el-form-item label="分拣所在/运往中转网点" required>
           <el-select v-model="sortForm.outletId" placeholder="请选择网点" style="width: 100%;">
             <el-option v-for="o in outlets" :key="o.id" :label="o.name" :value="o.id" />
           </el-select>
         </el-form-item>
       </el-form>
       <template #footer>
         <el-button @click="sortVisible = false">取消</el-button>
         <el-button type="primary" :loading="actionLoading" @click="submitSort">确认分拣</el-button>
       </template>
     </el-dialog>
 
     <!-- 登记异常弹窗 -->
     <el-dialog v-model="abnormalVisible" title="快件异常登记" width="460px" align-center>
       <el-form :model="abnormalForm" ref="abnormalFormRef" label-position="top">
         <el-form-item label="异常原因描述" required>
           <el-input v-model="abnormalForm.reason" placeholder="如：外包装破损、地址无法送达、联系不上收件人等" type="textarea" :rows="3" />
         </el-form-item>
       </el-form>
       <template #footer>
         <el-button @click="abnormalVisible = false">取消</el-button>
         <el-button type="primary" :loading="actionLoading" @click="submitAbnormal">提交异常登记</el-button>
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
 const activeTab = ref('PENDING_COLLECT')
 const orderNoQuery = ref('')
 
 const outlets = ref([])
 const actionLoading = ref(false)
 
 // Collect Form
 const collectVisible = ref(false)
 const collectForm = reactive({ orderId: null, outletId: null })
 
 // Sort Form
 const sortVisible = ref(false)
 const sortForm = reactive({ orderId: null, outletId: null })
 
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
     // 错误由拦截器处理
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
 
 function openCollect(row) {
   collectForm.orderId = row.id
   collectForm.outletId = null
   collectVisible.value = true
 }
 
 async function submitCollect() {
   if (!collectForm.outletId) {
     ElMessage.warning('请选择要入库的物流网点')
     return
   }
   actionLoading.value = true
   try {
     await specialistOrderApi.collect(collectForm.orderId, collectForm.outletId)
     ElMessage.success('揽收成功')
     collectVisible.value = false
     fetchOrders()
   } catch (err) {
     // 异常由拦截器处理
   } finally {
     actionLoading.value = false
   }
 }
 
 function openSort(row) {
   sortForm.orderId = row.id
   sortForm.outletId = null
   sortVisible.value = true
 }
 
 async function submitSort() {
   if (!sortForm.outletId) {
     ElMessage.warning('请选择分拣发往的网点')
     return
   }
   actionLoading.value = true
   try {
     await specialistOrderApi.sort(sortForm.orderId, sortForm.outletId)
     ElMessage.success('网点分拣成功，快件已进入运输网络')
     sortVisible.value = false
     fetchOrders()
   } catch (err) {
     // 异常由拦截器处理
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
     ElMessage.success('异常已登记并同步轨迹')
     abnormalVisible.value = false
     fetchOrders()
   } catch (err) {
     // 异常由拦截器处理
   } finally {
     actionLoading.value = false
   }
 }
 
 onMounted(() => {
   fetchOrders()
   fetchOutlets()
 })
 </script>
