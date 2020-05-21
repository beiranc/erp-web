<template>
  <!-- TODO 在导出之前需提示用户导出多少条 -->
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button v-permission="['seller']" type="warning" size="medium" icon="el-icon-download" @click="exportSpecSales">
          导出销售订单
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { exportSpecSales } from '@/api/sale/order'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    exportSpecSales() {
      const userName = this.user.username
      exportSpecSales(userName, 0, 1000).then(response => {
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
