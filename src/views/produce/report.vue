<template>
  <!-- TODO 在导出之前需提示用户导出多少条 -->
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button v-permission="['produceManager', 'produce:export']" type="warning" size="medium" icon="el-icon-download" @click="exportAllProductions">
          导出生产需求计划
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { exportProductions } from '@/api/produce/index'

export default {
  methods: {
    exportAllProductions() {
      exportProductions(0, 1000).then(response => {
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
