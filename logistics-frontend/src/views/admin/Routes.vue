<template>
  <div>
    <section class="section-head" style="margin-top:0">
      <div>
        <h2>运输线路管理</h2>
        <p class="muted">配置并管理不同物流网点之间的干线和配送路线，调度网运力。</p>
      </div>
      <el-button type="primary" @click="openAdd">新增路线</el-button>
    </section>

    <!-- 数据表格 -->
    <el-card style="border-radius: 8px;">
      <el-table v-loading="loading" :data="routes" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="routeName" label="路线名称" width="220" />
        <el-table-column prop="startOutletName" label="始发站网点" min-width="150" />
        <el-table-column prop="endOutletName" label="终点站网点" min-width="150" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ENABLE' ? 'success' : 'danger'">
              {{ scope.row.status === 'ENABLE' ? '启用中' : '已停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" width="170" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status === 'ENABLE'"
              type="danger"
              link
              size="small"
              @click="toggleStatus(scope.row, 'DISABLE')"
            >
              停用
            </el-button>
            <el-button
              v-else
              type="success"
              link
              size="small"
              @click="toggleStatus(scope.row, 'ENABLE')"
            >
              启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" align-center>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="路线名称" prop="routeName">
          <el-input v-model="form.routeName" placeholder="例如：北京-上海干线" />
        </el-form-item>
        <el-form-item label="始发网点" prop="startOutletId">
          <el-select v-model="form.startOutletId" placeholder="选择始发站" style="width: 100%;">
            <el-option v-for="o in outlets" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="到达网点" prop="endOutletId">
          <el-select v-model="form.endOutletId" placeholder="选择终点站" style="width: 100%;">
            <el-option v-for="o in outlets" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { routeApi, outletApi } from '../../api/modules'

const loading = ref(false)
const routes = ref([])
const outlets = ref([])

// Form dialog
const dialogVisible = ref(false)
const dialogTitle = ref('新增路线')
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  routeName: '',
  startOutletId: null,
  endOutletId: null
})

const rules = {
  routeName: [{ required: true, message: '请输入路线名称', trigger: 'blur' }],
  startOutletId: [{ required: true, message: '请选择始发网点', trigger: 'change' }],
  endOutletId: [{ required: true, message: '请选择终点网点', trigger: 'change' }]
}

async function fetchRoutes() {
  loading.value = true
  try {
    routes.value = await routeApi.list()
  } catch (err) {
    // 错误处理已在全局拦截
  } finally {
    loading.value = false
  }
}

async function fetchOutlets() {
  try {
    outlets.value = await outletApi.list({ status: 'ENABLE' })
  } catch (err) {
    // 错误处理
  }
}

function openAdd() {
  dialogTitle.value = '新增路线'
  form.id = null
  form.routeName = ''
  form.startOutletId = null
  form.endOutletId = null
  dialogVisible.value = true
}

function openEdit(row) {
  dialogTitle.value = '编辑路线'
  form.id = row.id
  form.routeName = row.routeName
  form.startOutletId = row.startOutletId
  form.endOutletId = row.endOutletId
  dialogVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    if (form.startOutletId === form.endOutletId) {
      ElMessage.warning('始发网点和终点网点不能相同')
      return
    }
    submitLoading.value = true
    try {
      if (form.id) {
        await routeApi.update(form.id, form)
        ElMessage.success('路线更新成功')
      } else {
        await routeApi.add(form)
        ElMessage.success('路线新增成功')
      }
      dialogVisible.value = false
      fetchRoutes()
    } catch (err) {
      // 错误已处理
    } finally {
      submitLoading.value = false
    }
  })
}

async function toggleStatus(row, status) {
  try {
    await routeApi.status(row.id, status)
    ElMessage.success(status === 'ENABLE' ? '路线已启用' : '路线已停用')
    fetchRoutes()
  } catch (err) {
    // 错误已处理
  }
}

onMounted(() => {
  fetchRoutes()
  fetchOutlets()
})
</script>
