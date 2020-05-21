<template>
  <el-row :gutter="24">
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
              <el-button style="width: 100%" size="medium" type="primary" @click="displayExistDialog">采购已有物料</el-button>
              <el-dialog title="创建采购计划" :visible.sync="purchaseOuterDialog" center>
                <!-- 表单 -->
                <el-form ref="createForm" label-width="120px" :model="purchaseData" :rules="purchaseRules">
                  <el-form-item label="采购计划主题" prop="purchaseSubject">
                    <el-input v-model.trim="purchaseData.purchaseSubject" placeholder="请输入采购计划主题" size="small" />
                  </el-form-item>
                </el-form>
                <el-button style="width: 100%" size="medium" type="primary" @click="handleInnerDialog">添加采购计划子项</el-button>
                <!-- 添加已存在物料的采购计划子项 -->
                <el-dialog title="添加采购计划子项" :visible.sync="existMaterialInnerDialog" append-to-body center @closed="handleExistDetailsCancel">
                  <el-form ref="addSubForm" label-width="100px" :model="existDetailData" :rules="existDetailRules">
                    <el-form-item label="物料" prop="material">
                      <el-select v-model="existDetailData.material" value-key="materialId" placeholder="请选择需要采购的物料">
                        <el-option v-for="materialTmp in materialData" :key="materialTmp.materialId" :label="materialTmp.materialName" :value="materialTmp" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="采购数量" prop="number">
                      <el-input-number v-model="existDetailData.number" :step="2" size="small" :min="1" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="存储的仓库" prop="stock">
                      <el-select v-model="existDetailData.stock" value-key="stockId" placeholder="请选择存储至哪个仓库">
                        <el-option v-for="stockTmp in stockData" :key="stockTmp.stockId" :label="stockTmp.stockName" :value="stockTmp" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="handleExistDetailsCancel">取消</el-button>
                    <el-button size="mini" type="primary" @click="handleExistDetailSubmit('addSubForm')">添加</el-button>
                  </div>
                </el-dialog>
                <!-- 添加新物料的采购计划子项 -->
                <el-dialog title="添加采购计划子项" :visible.sync="newMaterialInnerDialog" append-to-body center @closed="handleNewDetailsCancel">
                  <el-form ref="addNewSubForm" label-width="100px" :model="newDetailData" :rules="newDetailRules">
                    <el-form-item label="物料名" prop="materialName">
                      <el-input v-model.trim="newDetailData.materialName" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="物料进货价" prop="materialInPrice">
                      <el-input-number v-model="newDetailData.materialInPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="物料制造商" prop="materialManufacturer">
                      <el-input v-model.trim="newDetailData.materialManufacturer" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="物料产地" prop="materialOrigin">
                      <el-input v-model.trim="newDetailData.materialOrigin" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="物料规格" prop="materialSpecification">
                      <el-input v-model.trim="newDetailData.materialSpecification" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="物料分类" prop="materialCategory">
                      <el-select v-model="newDetailData.materialCategory" value-key="categoryId" placehodlder="请选择物料分类" size="medium">
                        <el-option v-for="categoryTmp in materialCategoryData" :key="categoryTmp.categoryName" :label="categoryTmp.categoryName" :value="categoryTmp" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="采购数量" prop="number">
                      <el-input-number v-model="newDetailData.number" :step="2" size="small" :min="1" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="存储的仓库" prop="stock">
                      <el-select v-model="newDetailData.stock" value-key="stockId" placeholder="请选择存储至哪个仓库">
                        <el-option v-for="stockTmp in stockData" :key="stockTmp.stockId" :label="stockTmp.stockName" :value="stockTmp" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="handleNewDetailsCancel">取消</el-button>
                    <el-button size="mini" type="primary" @click="handleNewDetailSubmit('addNewSubForm')">添加</el-button>
                  </div>
                </el-dialog>
                <el-table :data="purchaseData.purchaseOrderDetails">
                  <el-table-column label="物料名" align="center" width="200" prop="materialName" />
                  <el-table-column label="物料分类" align="center" width="200" prop="materialCategory.categoryName" />
                  <el-table-column label="物料规格" align="center" width="200" prop="materialSpecification" />
                  <el-table-column label="物料进货价" align="center" width="200">
                    <template slot-scope="scope">
                      {{ scope.materialInPrice }} 元
                    </template>
                  </el-table-column>
                  <el-table-column label="物料制造商" align="center" width="200" prop="materialManufacturer" />
                  <el-table-column label="物料产地" align="center" width="200" prop="materialOrigin" />
                  <el-table-column label="采购数量" align="center" width="200" prop="number" />
                  <el-table-column label="存储的仓库" align="center" width="200" prop="stock.stockName" />
                </el-table>
                <div slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="closeOuterDialog">取消</el-button>
                  <el-button size="mini" type="primary" @click="handlePurchaseSubmit('createForm')">创建</el-button>
                </div>
              </el-dialog>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <el-button style="width: 100%" size="medium" type="warning" @click="displayNewDialog">采购新物料</el-button>
            </el-card>
          </el-col>
        </el-card>
      </el-col>
      <el-divider />
    </el-row>
    <br>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-divider content-position="center">采购计划列表</el-divider>
          <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initSpecPurchaseData" />
          <el-table :data="specPurchaseData" style="width: 100%">
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
              </template>
            </el-table-column>
            <el-dialog title="采购计划详情" :visible.sync="detailDialogVisible" append-to-body center @closed="handleDetailClose">
              <el-table :data="specPurchaseDetailData" style="width: 100%">
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
        </el-card>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>

import { getMaterials, getCategories } from '@/api/material/index'
import { getStocks } from '@/api/stock/index'
import { craetePurchase, getPurchasesByName } from '@/api/purchase/index'
import { mapGetters } from 'vuex'

export default {
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
      // 创建采购计划外层 Dialog
      purchaseOuterDialog: false,
      // 已有物料内层 Dialog
      existMaterialInnerDialog: false,
      // 新物料内层 Dialog
      newMaterialInnerDialog: false,
      // 用于判断是通过哪个按钮进入的创建采购计划对话框
      isExistMaterialDialog: false,
      // 用于显示采购计划详情
      detailDialogVisible: false,
      // 所有物料信息
      materialData: [],
      // 所有的物料分类信息
      materialCategoryData: [],
      // 所有仓库信息
      stockData: [],
      // 指定用户的采购计划表格数据
      specPurchaseData: [],
      // 指定用户的采购计划详细项数据
      specPurchaseDetailData: [],
      // 采购计划表单数据格式
      purchaseData: {
        purchaseSubject: '',
        purchaseState: 'CREATED',
        purchaseOrderDetails: []
      },
      // 已有物料采购计划子项数据格式
      existDetailData: {
        material: null,
        newMaterial: false,
        number: 0,
        stock: null
      },
      // 新物料采购计划子项数据格式
      newDetailData: {
        materialName: '',
        materialOrigin: '',
        materialManufacturer: '',
        materialSpecification: '',
        materialCategory: null,
        materialInPrice: 0,
        newMaterial: true,
        number: 0,
        stock: null
      },
      // 采购计划表单校验规则
      purchaseRules: {
        purchaseSubject: [
          { required: true, message: '请输入采购计划主题', trigger: 'blur' }
        ]
      },
      // 已有物料采购计划子项表单校验规则
      existDetailRules: {
        material: [
          { required: true, message: '请选择物料', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入采购数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '采购数量必须是一个大于0的数' }
        ],
        stock: [
          { required: true, message: '请选择存储的仓库', trigger: 'change' }
        ]
      },
      // 新物料采购计划子项表单校验规则
      newDetailRules: {
        materialName: [
          { required: true, message: '请输入物料名', trigger: 'blur' }
        ],
        materialManufacturer: [
          { required: true, message: '请输入物料制造商', trigger: 'blur' }
        ],
        materialOrigin: [
          { required: true, message: '请输入物料产地', trigger: 'blur' }
        ],
        materialSpecification: [
          { required: true, message: '请输入物料规格', trigger: 'blur' }
        ],
        materialInPrice: [
          { required: true, message: '请输入物料进货价', trigger: 'blur' },
          { type: 'number', min: 0, message: '物料进货价必须是一个大于0的数' }
        ],
        materialCategory: [
          { required: true, message: '请选择物料分类', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入采购数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '采购数量必须是一个大于0的数' }
        ],
        stock: [
          { required: true, message: '请选择存储的仓库', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.initAllData()
    this.initSpecPurchaseData()
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
    initMaterialCategoryData() {
      // 获取物料分类信息
      getCategories(0, 1000).then(res => {
        this.materialCategoryData = res.data.content
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取物料分类信息失败'
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
    initAllData() {
      // 加载所有数据
      this.initMaterialData()
      this.initMaterialCategoryData()
      this.initStockData()
    },
    initSpecPurchaseData() {
      // 查询当前用户的采购计划信息
      const info = {
        userName: this.user.username,
        page: 0,
        // 默认查询 1000 条
        size: 1000
      }
      getPurchasesByName(info.userName, info.page, info.size).then(res => {
        this.specPurchaseData = res.data
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取采购计划数据失败'
        })
      })
    },
    displayExistDialog() {
      // 打开已存在物料的创建框
      this.purchaseOuterDialog = true
      this.isExistMaterialDialog = true
    },
    displayNewDialog() {
      // 打开新物料的创建框
      this.purchaseOuterDialog = true
      this.isExistMaterialDialog = false
    },
    closeOuterDialog() {
      // 关闭采购计划创建框
      this.purchaseOuterDialog = false
      this.purchaseData = {
        purchaseSubject: '',
        purchaseState: 'CREATED',
        purchaseOrderDetails: []
      }
    },
    handleInnerDialog() {
      // 根据 isExistMaterialDialog 来判断内层 Dialog 的显示
      if (this.isExistMaterialDialog) {
        // true 则为已有物料
        this.existMaterialInnerDialog = true
      } else {
        // false 则是新物料
        this.newMaterialInnerDialog = true
      }
    },
    handlePurchaseSubmit(formName) {
      // 采购计划提交
      this.$refs[formName].validate(valid => {
        if (!valid || this.purchaseData.purchaseOrderDetails === 0) {
          this.$message({
            type: 'warning',
            message: '请至少添加一项采购计划子项',
            duration: 2000
          })
          return false
        } else {
          const commitData = {
            purchaseSubject: this.purchaseData.purchaseSubject,
            purchaseState: this.purchaseData.purchaseState,
            applicant: {
              userId: this.user.userId,
              userName: this.user.username
            },
            purchaseOrderDetails: this.purchaseData.purchaseOrderDetails
          }
          craetePurchase(commitData).then(res => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '创建采购计划成功',
              duration: 3000
            })
            this.purchaseOuterDialog = false
            this.purchaseData = {
              purchaseSubject: '',
              purchaseState: 'CREATED',
              purchaseOrderDetails: []
            }
            this.initSpecPurchaseData()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    handleExistDetailSubmit(formName) {
      // 提交已存在物料的子项
      this.$refs[formName].validate(valid => {
        if (valid) {
          const tmp = {
            materialId: this.existDetailData.material.materialId,
            materialName: this.existDetailData.material.materialName,
            materialOrigin: this.existDetailData.material.materialOrigin,
            materialManufacturer: this.existDetailData.material.materialManufacturer,
            materialSpecification: this.existDetailData.material.materialSpecification,
            materialCategory: this.existDetailData.material.materialCategory,
            materialInPrice: this.existDetailData.material.materialInPrice,
            newMaterial: this.existDetailData.newMaterial,
            number: this.existDetailData.number,
            stock: this.existDetailData.stock
          }
          this.purchaseData.purchaseOrderDetails.push(tmp)
          this.existMaterialInnerDialog = false
          this.existDetailData = {
            material: null,
            newMaterial: false,
            number: 0,
            stock: null
          }
        } else {
          return false
        }
      })
    },
    handleExistDetailsCancel() {
      // 已存在物料的子项取消提交
      this.existMaterialInnerDialog = false
      this.existDetailData = {
        material: null,
        newMaterial: false,
        number: 0,
        stock: null
      }
    },
    handleNewDetailSubmit(formName) {
      // 新的物料的采购计划子项提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          const tmp = {
            materialName: this.newDetailData.materialName,
            materialOrigin: this.newDetailData.materialOrigin,
            materialManufacturer: this.newDetailData.materialManufacturer,
            materialSpecification: this.newDetailData.materialSpecification,
            materialCategory: this.newDetailData.materialCategory,
            materialInPrice: this.newDetailData.materialInPrice,
            newMaterial: this.newDetailData.newMaterial,
            number: this.newDetailData.number,
            stock: this.newDetailData.stock
          }
          this.purchaseData.purchaseOrderDetails.push(tmp)
          this.newMaterialInnerDialog = false
          this.newDetailData = {
            materialName: '',
            materialOrigin: '',
            materialManufacturer: '',
            materialSpecification: '',
            materialCategory: null,
            materialInPrice: 0,
            newMaterial: true,
            number: 0,
            stock: null
          }
        } else {
          return false
        }
      })
    },
    handleNewDetailsCancel() {
      // 新的物料的采购计划子项取消提交
      this.newMaterialInnerDialog = false
      this.newDetailData = {
        materialName: '',
        materialOrigin: '',
        materialManufacturer: '',
        materialSpecification: '',
        materialCategory: null,
        materialInPrice: 0,
        newMaterial: true,
        number: 0,
        stock: null
      }
    },
    handleDetailDisplay(row) {
      // 显示采购计划详情
      this.detailDialogVisible = true
      this.specPurchaseDetailData = row.purchaseOrderDetails
    },
    handleDetailClose() {
      this.detailDialogVisible = false
      this.specPurchaseDetailData = []
    }
  }
}
</script>
