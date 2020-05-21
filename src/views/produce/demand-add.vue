<template>
  <el-row :gutter="24">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-divider content-position="center">创建生产需求计划步骤</el-divider>
          <el-steps style="width: 100%" :active="3" align-center>
            <el-step title="步骤一" description="根据需要生产的是否为新产品选择" />
            <el-step title="步骤二" description="填写对应的表单" />
            <el-step title="步骤三" description="确认信息无误后提交等待确认" />
          </el-steps>
          <el-divider content-position="center">如果生产的是没有记录的产品，请选择生产新产品</el-divider>
          <el-col :span="12">
            <el-card>
              <el-button style="width: 100%" size="medium" type="primary" @click="displayExistDialog">生产已有产品</el-button>
              <el-dialog title="创建生产需求计划" :visible.sync="productionOuterDialog" center>
                <!-- 表单 -->
                <el-form ref="createForm" label-width="150px" :model="productionData" :rules="productionRules">
                  <el-form-item label="生产需求计划主题" prop="productionSubject">
                    <el-input v-model.trim="productionData.productionSubject" placeholder="请输入生产需求计划主题" size="small" />
                  </el-form-item>
                </el-form>
                <el-button style="width: 100%" size="medium" type="primary" @click="handleInnerDialog">添加生产需求计划子项</el-button>
                <!-- 添加已存在产品的生产需求计划子项 -->
                <el-dialog title="添加生产需求计划子项" :visible.sync="existProductInnerDialog" append-to-body center @closed="handleExistDetailsCancel">
                  <el-form ref="addSubForm" label-width="100px" :model="existDetailData" :rules="existDetailRules">
                    <el-form-item label="产品" prop="product">
                      <el-select v-model="existDetailData.product" value-key="productId" placeholder="请选择需要生产的产品">
                        <el-option v-for="productTmp in productData" :key="productTmp.productId" :label="productTmp.productName" :value="productTmp" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="生产数量" prop="productionNumber">
                      <el-input-number v-model="existDetailData.productionNumber" :step="2" size="small" :min="1" controls-position="right" />
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
                <!-- 添加新产品的生产需求计划子项 -->
                <el-dialog title="添加生产需求计划子项" :visible.sync="newProductInnerDialog" append-to-body center @closed="handleNewDetailsCancel">
                  <el-form ref="addNewSubForm" label-width="100px" :model="newDetailData" :rules="newDetailRules">
                    <el-form-item label="产品名" prop="productName">
                      <el-input v-model.trim="newDetailData.productName" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="产品成本价" prop="productInPrice">
                      <el-input-number v-model="newDetailData.productInPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="产品售价" prop="productOutPrice">
                      <el-input-number v-model="newDetailData.productOutPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="产品制造商" prop="productManufacturer">
                      <el-input v-model.trim="newDetailData.productManufacturer" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="产品产地" prop="productOrigin">
                      <el-input v-model.trim="newDetailData.productOrigin" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="产品规格" prop="productSpecification">
                      <el-input v-model.trim="newDetailData.productSpecification" size="medium" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="产品分类" prop="productCategory">
                      <el-select v-model="newDetailData.productCategory" value-key="categoryId" placehodlder="请选择产品分类" size="medium">
                        <el-option v-for="categoryTmp in productCategoryData" :key="categoryTmp.categoryName" :label="categoryTmp.categoryName" :value="categoryTmp" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="生产数量" prop="productionNumber">
                      <el-input-number v-model="newDetailData.productionNumber" :step="2" size="small" :min="1" controls-position="right" />
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
                <el-table :data="productionData.productionDetails">
                  <el-table-column label="产品名" align="center" width="200" prop="productName" />
                  <el-table-column label="产品分类" align="center" width="200" prop="productCategory.categoryName" />
                  <el-table-column label="产品规格" align="center" width="200" prop="productSpecification" />
                  <el-table-column label="产品成本价" align="center" width="200">
                    <template slot-scope="scope">
                      {{ scope.productInPrice }} 元
                    </template>
                  </el-table-column>
                  <el-table-column label="产品售价" align="center" width="200">
                    <template slot-scope="scope">
                      {{ scope.productOutPrice }} 元
                    </template>
                  </el-table-column>
                  <el-table-column label="产品制造商" align="center" width="200" prop="productManufacturer" />
                  <el-table-column label="产品产地" align="center" width="200" prop="productOrigin" />
                  <el-table-column label="生产数量" align="center" width="200" prop="productionNumber" />
                  <el-table-column label="存储的仓库" align="center" width="200" prop="stock.stockName" />
                </el-table>
                <div slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="closeOuterDialog">取消</el-button>
                  <el-button size="mini" type="primary" @click="handleProductionSubmit('createForm')">创建</el-button>
                </div>
              </el-dialog>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <el-button style="width: 100%" size="medium" type="warning" @click="displayNewDialog">生产新产品</el-button>
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
          <el-divider content-position="center">生产需求计划列表</el-divider>
          <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initSpecProductionData" />
          <el-table :data="specProductionData" style="width: 100%">
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
              </template>
            </el-table-column>
            <el-dialog title="生产需求计划详情" :visible.sync="detailDialogVisible" append-to-body center @closed="handleDetailClose">
              <el-table :data="specProductionDetailData" style="width: 100%">
                <el-table-column label="产品名" align="center" width="200" prop="productName" />
                <el-table-column label="产品分类" align="center" width="200" prop="productCategory.categoryName" />
                <el-table-column label="产品规格" align="center" width="200" prop="productSpecification" />
                <el-table-column label="是否为新产品" align="center" width="200">
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
  </el-row>
</template>

<script>

import { getProducts, getCategories } from '@/api/product/index'
import { getStocks } from '@/api/stock/index'
import { craeteProduction, getProductionsByName } from '@/api/produce/index'
import { mapGetters } from 'vuex'

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
      // 创建生产需求计划外层 Dialog
      productionOuterDialog: false,
      // 已有产品内层 Dialog
      existProductInnerDialog: false,
      // 新产品内层 Dialog
      newProductInnerDialog: false,
      // 用于判断是通过哪个按钮进入的创建生产需求计划对话框
      isExistProductionDialog: false,
      // 用于显示生产需求计划详情
      detailDialogVisible: false,
      // 所有产品信息
      productData: [],
      // 所有的产品分类信息
      productCategoryData: [],
      // 所有仓库信息
      stockData: [],
      // 指定用户的生产需求计划表格数据
      specProductionData: [],
      // 指定用户的生产需求计划详细项数据
      specProductionDetailData: [],
      // 生产需求计划表单数据格式
      productionData: {
        productionSubject: '',
        productionState: 'CREATED',
        productionDetails: []
      },
      // 已有产品生产需求计划子项数据格式
      existDetailData: {
        product: null,
        newProduct: false,
        productionNumber: 0,
        stock: null
      },
      // 新产品生产需求计划子项数据格式
      newDetailData: {
        productName: '',
        productOrigin: '',
        productManufacturer: '',
        productSpecification: '',
        productCategory: null,
        productInPrice: 0,
        productOutPrice: 0,
        newProduct: true,
        productionNumber: 0,
        stock: null
      },
      // 生产需求计划表单校验规则
      productionRules: {
        productionSubject: [
          { required: true, message: '请输入生产需求计划主题', trigger: 'blur' }
        ]
      },
      // 已有产品生产需求计划子项表单校验规则
      existDetailRules: {
        product: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        productionNumber: [
          { required: true, message: '请输入生产数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '生产数量必须是一个大于0的数' }
        ],
        stock: [
          { required: true, message: '请选择存储的仓库', trigger: 'change' }
        ]
      },
      // 新产品生产需求计划子项表单校验规则
      newDetailRules: {
        productName: [
          { required: true, message: '请输入产品名', trigger: 'blur' }
        ],
        productManufacturer: [
          { required: true, message: '请输入产品制造商', trigger: 'blur' }
        ],
        productOrigin: [
          { required: true, message: '请输入产品产地', trigger: 'blur' }
        ],
        productSpecification: [
          { required: true, message: '请输入产品规格', trigger: 'blur' }
        ],
        productInPrice: [
          { required: true, message: '请输入产品成本价', trigger: 'blur' },
          { type: 'number', min: 0, message: '产品成本价必须是一个大于0的数' }
        ],
        productOutPrice: [
          { required: true, message: '请输入产品售价', trigger: 'blur' },
          { type: 'number', min: 0, message: '产品售价必须是一个大于0的数' }
        ],
        productCategory: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ],
        productionNumber: [
          { required: true, message: '请输入生产数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '生产数量必须是一个大于0的数' }
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
    this.initSpecProductionData()
  },
  methods: {
    initProductData() {
      // 获取产品信息
      getProducts(0, 1000).then(res => {
        this.productData = res.data.content
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取产品信息失败'
        })
      })
    },
    initProductCategoryData() {
      // 获取产品分类信息
      getCategories(0, 1000).then(res => {
        this.productCategoryData = res.data.content
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取产品分类信息失败'
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
      this.initProductData()
      this.initProductCategoryData()
      this.initStockData()
    },
    initSpecProductionData() {
      // 查询当前用户的生产需求计划信息
      const info = {
        userName: this.user.username,
        page: 0,
        // 默认查询 1000 条
        size: 1000
      }
      getProductionsByName(info.userName, info.page, info.size).then(res => {
        this.specProductionData = res.data
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取生产需求计划数据失败'
        })
      })
    },
    displayExistDialog() {
      // 打开已存在产品的创建框
      this.productionOuterDialog = true
      this.isExistProductionDialog = true
    },
    displayNewDialog() {
      // 打开新产品的创建框
      this.productionOuterDialog = true
      this.isExistProductionDialog = false
    },
    closeOuterDialog() {
      // 关闭生产需求计划创建框
      this.productionOuterDialog = false
      this.productionData = {
        productionSubject: '',
        productionState: 'CREATED',
        productionDetails: []
      }
    },
    handleInnerDialog() {
      // 根据 isExistProductionDialog 来判断内层 Dialog 的显示
      if (this.isExistProductionDialog) {
        // true 则为已有产品
        this.existProductInnerDialog = true
      } else {
        // false 则是新产品
        this.newProductInnerDialog = true
      }
    },
    handleProductionSubmit(formName) {
      // 生产需求计划提交
      this.$refs[formName].validate(valid => {
        if (!valid || this.productionData.productionDetails === 0) {
          this.$message({
            type: 'warning',
            message: '请至少添加一项生产需求计划子项',
            duration: 2000
          })
          return false
        } else {
          const commitData = {
            productionSubject: this.productionData.productionSubject,
            productionState: this.productionData.productionState,
            applicant: {
              userId: this.user.userId,
              userName: this.user.username
            },
            productionDetails: this.productionData.productionDetails
          }
          craeteProduction(commitData).then(res => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '创建生产需求计划成功',
              duration: 3000
            })
            this.productionOuterDialog = false
            this.productionData = {
              productionSubject: '',
              productionState: 'CREATED',
              productionDetails: []
            }
            this.initSpecProductionData()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    handleExistDetailSubmit(formName) {
      // 提交已存在产品的子项
      this.$refs[formName].validate(valid => {
        if (valid) {
          const tmp = {
            productId: this.existDetailData.product.productId,
            productName: this.existDetailData.product.productName,
            productOrigin: this.existDetailData.product.productOrigin,
            productManufacturer: this.existDetailData.product.productManufacturer,
            productSpecification: this.existDetailData.product.productSpecification,
            productCategory: this.existDetailData.product.productCategory,
            productInPrice: this.existDetailData.product.productInPrice,
            productOutPrice: this.existDetailData.product.productOutPrice,
            newProduct: this.existDetailData.newProduct,
            productionNumber: this.existDetailData.productionNumber,
            stock: this.existDetailData.stock
          }
          this.productionData.productionDetails.push(tmp)
          this.existProductInnerDialog = false
          this.existDetailData = {
            product: null,
            newProduct: false,
            productionNumber: 0,
            stock: null
          }
        } else {
          return false
        }
      })
    },
    handleExistDetailsCancel() {
      // 已存在产品的子项取消提交
      this.existProductInnerDialog = false
      this.existDetailData = {
        product: null,
        newProduct: false,
        productionNumber: 0,
        stock: null
      }
    },
    handleNewDetailSubmit(formName) {
      // 新的产品的生产需求计划子项提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          const tmp = {
            productName: this.newDetailData.productName,
            productOrigin: this.newDetailData.productOrigin,
            productManufacturer: this.newDetailData.productManufacturer,
            productSpecification: this.newDetailData.productSpecification,
            productCategory: this.newDetailData.productCategory,
            productInPrice: this.newDetailData.productInPrice,
            productOutPrice: this.newDetailData.productOutPrice,
            newProduct: this.newDetailData.newProduct,
            productionNumber: this.newDetailData.productionNumber,
            stock: this.newDetailData.stock
          }
          this.productionData.productionDetails.push(tmp)
          this.newProductInnerDialog = false
          this.newDetailData = {
            productName: '',
            productOrigin: '',
            productManufacturer: '',
            productSpecification: '',
            productCategory: null,
            productInPrice: 0,
            productOutPrice: 0,
            newProduct: true,
            productionNumber: 0,
            stock: null
          }
        } else {
          return false
        }
      })
    },
    handleNewDetailsCancel() {
      // 新的产品的生产需求计划子项取消提交
      this.newProductInnerDialog = false
      this.newDetailData = {
        productName: '',
        productOrigin: '',
        productManufacturer: '',
        productSpecification: '',
        productCategory: null,
        productInPrice: 0,
        productOutPrice: 0,
        newProduct: true,
        productionNumber: 0,
        stock: null
      }
    },
    handleDetailDisplay(row) {
      // 显示生产需求计划详情
      this.detailDialogVisible = true
      this.specProductionDetailData = row.productionDetails
    },
    handleDetailClose() {
      this.detailDialogVisible = false
      this.specProductionDetailData = []
    }
  }
}
</script>
