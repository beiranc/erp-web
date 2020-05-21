<template>
  <!-- TODO 在导出之前需提示用户导出多少条 -->
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button v-permission="['purchaseManager', 'purchase:export']" type="warning" size="medium" icon="el-icon-download" @click="exportAllPurchases">
          导出采购报表
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { exportPurchases } from '@/api/purchase/index'

export default {
  methods: {
    exportAllPurchases() {
      exportPurchases(0, 1000).then(response => {
        const blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        const fileName = response.headers.filename
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      })
    }
  }
}
</script>
