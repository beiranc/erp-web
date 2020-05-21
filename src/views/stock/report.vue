<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button type="warning" size="medium" icon="el-icon-download" @click="exportStocks">
          导出仓库报表
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import { exportStocks } from '@/api/stock/index'

export default {
  methods: {
    exportStocks() {
      exportStocks(0, 200).then(response => {
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
