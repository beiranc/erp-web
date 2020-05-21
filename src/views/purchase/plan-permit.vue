<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-divider content-position="center">批准采购计划</el-divider>
      <el-card shadow="always">
        <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initPurchaseData" />
        <el-table :data="purchaseData" style="width: 100%">
          <el-table-column label="采购计划主题" align="center" width="200">
            <template slot-scope="scope">
              <el-tag type="primary" size="medium">{{ scope.row.purchaseSubject }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              {{ scope.row.purchaseCreateTime }}
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center" width="200" prop="applicant.userName" />
          <el-table-column label="采购计划状态" align="center" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.purchaseState === 'CREATED'" type="success">{{ scope.row.purchaseState | state }}</el-tag>
              <el-tag v-else-if="scope.row.purchaseState === 'CONFIRMED'" type="primary">{{ scope.row.purchaseState | state }}</el-tag>
              <el-tag v-else-if="scope.row.purchaseState === 'VERIFYING'" type="warning">{{ scope.row.purchaseState | state }}</el-tag>
              <el-tag v-else-if="scope.row.purchaseState === 'IMPORTED'" type="info">{{ scope.row.purchaseState | state }}</el-tag>
              <el-tag v-else-if="scope.row.purchaseState === 'DISCUSSING'" type="warning">{{ scope.row.purchaseState | state }}</el-tag>
              <el-tag v-else type="danger">{{ scope.row.purchaseState | state }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="上一次修改时间" align="center" width="250">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              {{ scope.row.lastModifiedTime }}
            </template>
          </el-table-column>
          <el-table-column label="上一次修改操作者" align="center" width="250">
            <template slot-scope="scope">
              {{ scope.row.operator.userName }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleDetailDisplay(scope.row)">查看详情</el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认执行此操作？" @onConfirm="confirmPurchase(scope.row)">
                <el-button slot="reference" v-permission="['purchaseManager', 'purchase:edit']" size="mini" type="warning" :disabled="scope.row.purchaseState !== 'CREATED'">批准</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-dialog title="采购计划详情" :visible.sync="detailDialogVisible" append-to-body center @closed="handleDetailClose">
            <el-table :data="purchaseDetailData" style="width: 100%">
              <el-table-column label="物料名" align="center" width="200" prop="materialName" />
              <el-table-column label="物料分类" align="center" width="200" prop="materialCategory.categoryName" />
              <el-table-column label="物料规格" align="center" width="200" prop="materialSpecification" />
              <el-table-column label="是否为新物料" align="center" width="230">
                <template slot-scope="scope">
                  <span v-if="scope.row.newMaterial">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
              <el-table-column label="物料进货价" align="center" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.materialInPrice }} 元</span>
                </template>
              </el-table-column>
              <el-table-column label="物料制造商" align="center" width="200" prop="materialManufacturer" />
              <el-table-column label="物料产地" align="center" width="200" prop="materialOrigin" />
              <el-table-column label="采购数量" align="center" width="200" prop="number" />
              <el-table-column label="存储的仓库" align="center" width="200" prop="stock.stockName" />
            </el-table>
          </el-dialog>
        </el-table>
        <!-- <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initPurchaseData" /> -->
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import { getPurchases, confirmPurchase } from '@/api/purchase/index'
// import Pagination from '@/components/Pagination'

export default {
  // components: {
  //   Pagination
  // },
  filters: {
    state(purchaseState) {
      switch (purchaseState) {
        case 'CREATED':
          return '已创建'
        case 'CONFIRMED':
          return '已确认'
        case 'VERIFYING':
          return '校验中'
        case 'IMPORTED':
          return '已入库'
        case 'DISCUSSING':
          return '交涉中'
        case 'CLOSED':
          return '已关闭'
        default:
          return '未知'
      }
    }
  },
  data() {
    return {
      round: true,
      plain: true,
      // loading: true,
      detailDialogVisible: false,
      // page: 1,
      // limit: 10,
      // total: 0,
      purchaseData: [],
      purchaseDetailData: []
    }
  },
  created() {
    this.initPurchaseData()
  },
  methods: {
    initPurchaseData() {
      // 初始化数据
      // this.loading = true
      // getPurchases(this.page - 1, this.limit).then(res => {
      //   this.purchaseData = res.data.content
      //   this.total = res.data.totalElements
      //   this.loading = false
      // }).catch(err => {
      //   this.$message({
      //     type: 'warning',
      //     message: err.message || '获取采购计划数据失败'
      //   })
      //   this.loading = false
      // })
      getPurchases(0, 1000).then(res => {
        this.purchaseData = res.data
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取采购计划数据失败'
        })
      })
    },
    handleDetailDisplay(row) {
      // 显示采购计划详情
      this.detailDialogVisible = true
      this.purchaseDetailData = row.purchaseOrderDetails
    },
    handleDetailClose() {
      this.detailDialogVisible = false
      this.purchaseDetailData = []
    },
    confirmPurchase(row) {
      // 批准采购计划
      confirmPurchase(row.purchaseId).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.initPurchaseData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
