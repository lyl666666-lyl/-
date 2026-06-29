<template>
  <div>
    <section class="section-head" style="margin-top:0">
      <div>
        <h2>物流网点管理</h2>
        <p class="muted">管理和维护线下物流中转分拨中心、营业网点信息。</p>
      </div>
      <el-button type="primary" @click="openAdd">新增网点</el-button>
    </section>

    <!-- 搜索过滤 -->
    <el-card style="margin-bottom: 20px; border-radius: 8px;">
      <el-form :inline="true" :model="filter" style="margin-bottom: 0;">
        <el-form-item label="网点名称">
          <el-input v-model="filter.name" placeholder="支持模糊查询" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.status" placeholder="选择状态" clearable style="width: 120px;">
            <el-option label="启用" value="ENABLE" />
            <el-option label="停用" value="DISABLE" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="fetchOutlets">搜索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card style="border-radius: 8px;">
      <el-table v-loading="loading" :data="outlets" border stripe style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="网点名称" width="180" />
        <el-table-column prop="contactPhone" label="联系电话" width="150" />
        <el-table-column prop="address" label="网点详细地址" min-width="250" show-overflow-tooltip />
        <el-table-column prop="status" label="运营状态" width="100" align="center">
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
        <el-form-item label="网点名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入唯一网点名称" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入网点座机/手机联系电话" />
        </el-form-item>
        <el-form-item label="网点地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" type="textarea" :rows="3" />
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
import { outletApi } from '../../api/modules'

const loading = ref(false)
const outlets = ref([])
const filter = reactive({ name: '', status: '' })

// Form dialog
const dialogVisible = ref(false)
const dialogTitle = ref('新增网点')
const submitLoading = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, name: '', contactPhone: '', address: '' })

const rules = {
  name: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

async function fetchOutlets() {
  loading.value = true
  try {
    outlets.value = await outletApi.list(filter)
  } catch (err) {
    // 全局拦截
  } finally {
    loading.value = false
  }
}

function resetFilter() {
  filter.name = ''
  filter.status = ''
  fetchOutlets()
}

function openAdd() {
  dialogTitle.value = '新增网点'
  form.id = null
  form.name = ''
  form.contactPhone = ''
  form.address = ''
  dialogVisible.value = true
}

function openEdit(row) {
  dialogTitle.value = '编辑网点'
  form.id = row.id
  form.name = row.name
  form.contactPhone = row.contactPhone
  form.address = row.address
  dialogVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      if (form.id) {
        await outletApi.update(form.id, form)
        ElMessage.success('网点更新成功')
      } else {
        await outletApi.add(form)
        ElMessage.success('网点新增成功')
      }
      dialogVisible.value = false
      fetchOutlets()
    } catch (err) {
      // 报错已拦截
    } finally {
      submitLoading.value = false
    }
  })
}

async function toggleStatus(row, status) {
  try {
    await outletApi.status(row.id, status)
    ElMessage.success(status === 'ENABLE' ? '网点已启用' : '网点已停用')
    fetchOutlets()
  } catch (err) {
    // 错误处理
  }
}

onMounted(() => {
  fetchOutlets()
})
</script>
