<template>
  <el-card shadow="always" style="margin-left: 8px;">
    <div class="filter-container">
      <el-button v-permission="['admin', 'system:log:del']" class="filter-item" style="margin-left: 10px;" type="danger" size="mini" icon="el-icon-delete" @click="flushAll">
        清空日志
      </el-button>
      <el-button v-permission="['admin', 'system:log:export']" class="filter-item" type="warning" size="mini" icon="el-icon-download" @click="exportAll">
        导出日志
      </el-button>
      <el-button v-permission="['admin', 'system:log:view']" size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="getList" />
    </div>
    <el-table v-loading="loading" :data="tableData" align="center" style="width: 100%">
      <el-table-column align="center" prop="userName" label="用户名" width="180" />
      <el-table-column align="center" prop="operation" label="操作" width="180" />
      <el-table-column align="center" label="请求方法" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top-start">
            <p>{{ scope.row.method }}</p>
            <div slot="reference">
              {{ scope.row.method | filterStr }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求参数" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top-start">
            <p>{{ scope.row.params }}</p>
            <div slot="reference">
              {{ scope.row.params | filterStr }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="spendTime" label="请求耗时" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.spendTime <= 300">{{ scope.row.spendTime }}ms</el-tag>
          <el-tag v-else-if="scope.row.spendTime <= 1000" type="warning">{{ scope.row.spendTime }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.spendTime }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ip" label="IP" width="180" />
      <el-table-column align="center" prop="createTime" label="创建时间" width="200" />
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
  </el-card>
</template>

<script>

import Pagination from '@/components/Pagination'
import { getAllLog, flushAllLog, exportAllLog } from '@/api/system/log'

export default {
  components: {
    Pagination
  },
  filters: {
    filterStr(str) {
      if (str.length > 10) {
        return str.slice(0, 10) + '...'
      } else {
        return str
      }
    }
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      tableData: [],
      round: true,
      plain: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getAllLog(this.page - 1, this.limit).then(response => {
        this.tableData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    flushAll() {
      this.$confirm('确认清空所有操作日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        flushAllLog().then(response => {
          this.$message({
            type: 'success',
            message: '清空成功'
          })
          // 清空后刷新页面
          window.location.reload()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消清空'
        })
      })
    },
    exportAll() {
      this.$confirm('确认导出所有操作日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        exportAllLog(0, 1000).then(response => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导出'
        })
      })
    }
  }
}
</script>
