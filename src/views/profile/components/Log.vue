<template>
  <div>
    <el-table v-loading="loading" :data="tableData" align="center" style="width: 100%">
      <el-table-column prop="operation" label="操作" width="180" />
      <el-table-column prop="spendTime" label="请求耗时" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.spendTime <= 300">{{ scope.row.spendTime }}ms</el-tag>
          <el-tag v-else-if="scope.row.spendTime <= 1000" type="warning">{{ scope.row.spendTime }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.spendTime }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="200" />
    </el-table>
    <el-pagination :total="total" :background="background" :current-page.sync="page" :page-size.sync="limit" :layout="layout" :page-sizes="pageSizes" style="padding: 32px 16px; background: #fff;" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>

import { getSpecLog } from '@/api/system/log'
import { scrollTo } from '@/utils/scroll-to'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: ''
        }
      }
    }
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      background: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      pageSizes: [10],
      tableData: []
    }
  },
  created() {
    this.initData(this.user.username, this.page, this.limit)
  },
  methods: {
    initData(userName, currentPage, pageSize) {
      getSpecLog(userName, currentPage - 1, pageSize).then(response => {
        this.tableData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.initData(this.user.username, this.page, val)
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.initData(this.user.username, val, this.limit)
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>
