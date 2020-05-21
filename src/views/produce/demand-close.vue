<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-divider content-position="center">关闭生产需求计划</el-divider>
      <el-card shadow="always">
        <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initProductionData" />
        <el-table :data="productionData" style="width: 100%">
          <el-table-column label="生产需求计划主题" align="center" width="200">
            <template slot-scope="scope">
              <el-tag type="primary" size="medium">{{ scope.row.productionSubject }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              {{ scope.row.productionCreateTime }}
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center" width="200" prop="applicant.userName" />
          <el-table-column label="生产需求计划状态" align="center" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.productionState === 'CREATED'" type="success">{{ scope.row.productionState | state }}</el-tag>
              <el-tag v-else-if="scope.row.productionState === 'CONFIRMED'" type="primary">{{ scope.row.productionState | state }}</el-tag>
              <el-tag v-else-if="scope.row.productionState === 'VERIFYING'" type="warning">{{ scope.row.productionState | state }}</el-tag>
              <el-tag v-else-if="scope.row.productionState === 'IMPORTED'" type="info">{{ scope.row.productionState | state }}</el-tag>
              <el-tag v-else-if="scope.row.productionState === 'REPRODUCED'" type="warning">{{ scope.row.productionState | state }}</el-tag>
              <el-tag v-else type="danger">{{ scope.row.productionState | state }}</el-tag>
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
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认执行此操作？" @onConfirm="closeProduction(scope.row)">
                <el-button slot="reference" v-permission="['produceManager', 'produce:edit']" size="mini" type="danger" :disabled="scope.row.productionState === 'CLOSED'">关闭</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-dialog title="生产需求计划详情" :visible.sync="detailDialogVisible" append-to-body center @closed="handleDetailClose">
            <el-table :data="productionDetailData" style="width: 100%">
              <el-table-column label="产品名" align="center" width="200" prop="productName" />
              <el-table-column label="产品分类" align="center" width="200" prop="productCategory.categoryName" />
              <el-table-column label="产品规格" align="center" width="200" prop="productSpecification" />
              <el-table-column label="是否为新产品" align="center" width="230">
                <template slot-scope="scope">
                  <span v-if="scope.row.newProduct">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
              <el-table-column label="产品成本价" align="center" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.productInPrice }} 元</span>
                </template>
              </el-table-column>
              <el-table-column label="产品售价" align="center" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.productOutPrice }} 元</span>
                </template>
              </el-table-column>
              <el-table-column label="产品制造商" align="center" width="200" prop="productManufacturer" />
              <el-table-column label="产品产地" align="center" width="200" prop="productOrigin" />
              <el-table-column label="生产数量" align="center" width="200" prop="number" />
              <el-table-column label="存储的仓库" align="center" width="200" prop="stock.stockName" />
            </el-table>
          </el-dialog>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import { getProductions, closeProduction } from '@/api/produce/index'

export default {
  filters: {
    state(productionState) {
      switch (productionState) {
        case 'CREATED':
          return '已创建'
        case 'CONFIRMED':
          return '已确认'
        case 'VERIFYING':
          return '校验中'
        case 'IMPORTED':
          return '已入库'
        case 'REPRODUCED':
          return '重生产'
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
      detailDialogVisible: false,
      productionData: [],
      productionDetailData: []
    }
  },
  created() {
    this.initProductionData()
  },
  methods: {
    initProductionData() {
      // 初始化数据
      getProductions(0, 1000).then(res => {
        this.productionData = res.data
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取生产需求计划数据失败'
        })
      })
    },
    handleDetailDisplay(row) {
      // 显示采购计划详情
      this.detailDialogVisible = true
      this.productionDetailData = row.productionDetails
    },
    handleDetailClose() {
      this.detailDialogVisible = false
      this.productionDetailData = []
    },
    closeProduction(row) {
      // 批准生产需求计划
      closeProduction(row.productionId).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.initProductionData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
