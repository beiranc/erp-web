<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-divider content-position="center">创建采购计划步骤</el-divider>
        <el-steps style="width: 100%" :active="3" align-center>
          <el-step title="步骤一" description="根据需要采购的是否为新物料选择" />
          <el-step title="步骤二" description="填写对应的表单" />
          <el-step title="步骤三" description="确认信息无误后提交等待确认" />
        </el-steps>
        <el-divider content-position="center">如果采购的是没有记录的物料，请选择采购新物料</el-divider>
        <el-col :span="12">
          <el-card>
            <el-button style="width: 100%" size="medium" type="primary" @click="existMaterialOuterDialog = true">采购已有物料</el-button>
            <el-dialog title="创建采购计划" :visible.sync="existMaterialOuterDialog" center>
              <!-- 表单 -->
              <el-form label-width="100px">
                <el-form-item label="采购计划主题">
                  <el-input size="small" />
                </el-form-item>
              </el-form>
              <el-button style="width: 100%" size="medium" type="primary" @click="existMaterialInnerDialog = true">添加采购计划子项</el-button>
              <el-dialog title="添加采购计划子项" :visible.sync="existMaterialInnerDialog" append-to-body center>
                <el-form label-width="100px">
                  <el-form-item label="物料">
                    <el-select placeholder="请选择需要采购的物料">
                      <el-option label="物料一" />
                      <el-option label="物料二" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="采购数量">
                    <el-input />
                  </el-form-item>
                  <el-form-item label="存储的仓库">
                    <el-select placeholder="请选择存储至哪个仓库">
                      <el-option label="物料一仓" />
                      <el-option label="物料二仓" />
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="existMaterialInnerDialog = false">取消</el-button>
                  <el-button size="mini" type="primary" @click="existMaterialInnerDialog = false">添加</el-button>
                </div>
              </el-dialog>
              <el-table>
                <el-table-column label="物料名" width="200" />
                <el-table-column label="物料规格" width="200" />
                <el-table-column label="物料进货价" width="200" />
                <el-table-column label="物料制造商" width="200" />
                <el-table-column label="物料产地" width="200" />
                <el-table-column label="采购数量" width="200" />
                <el-table-column label="存储的仓库" width="200" />
              </el-table>
              <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="existMaterialOuterDialog = false">取消</el-button>
                <el-button size="mini" type="primary" @click="existMaterialOuterDialog = false">创建</el-button>
              </div>
            </el-dialog>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <el-button style="width: 100%" size="medium" type="warning" @click="newMaterialOuterDialog = true">采购新物料</el-button>
          </el-card>
        </el-col>
      </el-card>
    </el-col>
    <el-divider />
    <!-- <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-divider content-position="center">采购计划列表</el-divider>
        </el-card>
      </el-col>
    </el-row> -->
  </el-row>
</template>

<script>

import { getMaterials } from '@/api/material/index'
import { getStocks } from '@/api/stock/index'

export default {
  data() {
    return {
      // 已有物料外层 Dialog
      existMaterialOuterDialog: false,
      // 已有物料内层 Dialog
      existMaterialInnerDialog: false,
      // 新物料外层 Dialog
      newMaterialOuterDialog: false,
      // 新物料内层 Dialog
      newMaterialInnerDialog: false,
      materialData: [],
      stockData: [],
      // 采购计划表单数据格式
      purchaseData: {
        purchaseSubject: '',
        purchaseState: 'CREATED',
        applicant: {
          userId: '',
          userName: ''
        },
        purchaseOrderDetails: []
      },
      // 已有物料采购计划子项数据格式
      existDetailData: {
        materialId: '',
        materialName: '',
        materialOrigin: '',
        materialManufacturer: '',
        materialSpecification: '',
        materialCategory: null,
        materialInPrice: 0,
        newMaterial: false,
        number: 0,
        stock: null
      },
      // 新物料采购计划子项数据格式
      newDetailData: {
      },
      // 采购计划表单校验规则
      purchaseRules: {},
      // 已有物料采购计划子项表单校验规则
      existDetailRules: {},
      // 新物料采购计划子项表单校验规则
      newDetailRules: {}
    }
  },
  created() {
    this.initMaterialData()
    this.initStockData()
  },
  methods: {
    initMaterialData() {
      // 获取物料信息
      getMaterials(0, 1000).then(res => {
        this.materialData = res.data.content
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取物料信息失败'
        })
      })
    },
    initStockData() {
      // 获取仓库信息
      getStocks(0, 1000).then(res => {
        this.stockData = res.data.content
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取仓库信息失败'
        })
      })
    },
    handleExistMaterial() {
      // 已存在物料的采购计划
    },
    handleNewMaterial() {
      // 新物料
    }
  }
}
</script>
