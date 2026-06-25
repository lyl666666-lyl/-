<template><el-tag :type="map[value] || 'info'">{{ label[value] || value }}</el-tag></template>
<script setup>
defineProps({ value:String })
const map={PENDING_CHECK:'warning',RETURNED:'danger',CONFIRMED:'success',ARRANGED:'primary',TRAVELING:'',FINISHED:'info',CANCELED:'danger',ARCHIVED:'info',ON_SALE:'success',OFF_SALE:'info',ENABLE:'success',DISABLE:'info',PENDING:'warning',PROCESSING:'primary',DONE:'success',REJECTED:'danger'}
const label={PENDING_CHECK:'待核对',RETURNED:'已退回',CONFIRMED:'已确认',ARRANGED:'已安排',TRAVELING:'出行中',FINISHED:'已完成',CANCELED:'已取消',ARCHIVED:'已归档',ON_SALE:'上架',OFF_SALE:'下架',ENABLE:'启用',DISABLE:'停用',PENDING:'待处理',PROCESSING:'处理中',DONE:'已完成',REJECTED:'已拒绝'}
</script>
