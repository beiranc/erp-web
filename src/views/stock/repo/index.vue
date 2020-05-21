<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-tabs value="repo" :stretch="stretch" @tab-click="handleTabClick">
          <el-tab-pane name="repo" label="仓库管理">
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="stockDialogVisible = true">
              创建仓库
            </el-button>
            <el-dialog title="新增仓库" :visible.sync="stockDialogVisible" center @closed="stockDialogVisible = false">
              <el-form ref="stockForm" :rules="stockRules" :label-position="labelPosition" label-width="100px" :model="stock">
                <el-form-item label="仓库名" prop="stockName">
                  <el-input v-model.trim="stock.stockName" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="仓库位置" prop="stockPosition">
                  <el-input v-model.trim="stock.stockPosition" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="仓库管理员" prop="stockManager">
                  <el-select v-model="stock.stockManager.userId" placehodlder="请指定仓库管理员" size="medium">
                    <el-option v-for="userTemp in userData" :key="userTemp.userName" :label="userTemp.userName" :value="userTemp.userId" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleStockFormCancel('stockForm')">取消</el-button>
                <el-button size="mini" type="primary" @click="handleStockFormSubmit('stockForm')">创建</el-button>
              </span>
            </el-dialog>
            <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initStockData" />
            <el-table v-loading="loading" :data="stockData" style="width: 100%">
              <el-table-column align="center" label="仓库名" width="200">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.stockName }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="仓库位置" prop="stockPosition" width="200" />
              <el-table-column align="center" label="仓库管理员" prop="stockManager.userName" width="200" />
              <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleStockEdit(scope.row)">编辑</el-button>
                  <el-dialog title="编辑仓库" :visible.sync="stockEditDialogVisible" center @closed="stockEditDialogVisible = false">
                    <el-form ref="editForm" :rules="stockRules" :label-position="labelPosition" label-width="100px" :model="editStock">
                      <el-form-item label="仓库名" prop="stockName">
                        <el-input v-model.trim="editStock.stockName" size="medium" auto-complete="off" />
                      </el-form-item>
                      <el-form-item label="仓库位置" prop="stockPosition">
                        <el-input v-model.trim="editStock.stockPosition" size="medium" auto-complete="off" />
                      </el-form-item>
                      <el-form-item label="仓库管理员" prop="stockManager">
                        <el-select v-model="editStock.stockManager.userId" placehodlder="请指定仓库管理员" size="medium">
                          <el-option v-for="userTemp in userData" :key="userTemp.userName" :label="userTemp.userName" :value="userTemp.userId" />
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                      <el-button size="mini" @click="stockEditDialogVisible = false">取消</el-button>
                      <el-button size="mini" type="danger" @click="handleStockEditSubmit('editForm')">修改</el-button>
                    </span>
                  </el-dialog>
                  <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此仓库？" @onConfirm="handleStockDelete(scope.row)">
                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initStockData" />
          </el-tab-pane>
          <el-tab-pane name="material" label="物料存储管理">
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus">
              创建物料存储记录
            </el-button>
            <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initMaterialData" />
            <el-table v-loading="loading" :data="materialData" style="width: 100%">
              <el-table-column align="center" label="物料名" width="300">
                <template slot-scope="scope">
                  <el-tag size="medium">{{ scope.row.materialName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="存储数量" prop="materialNumber" width="300" />
              <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="test(scope.row)">修改数量</el-button>
                  <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此记录？">
                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="product" label="产品存储管理">
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus">
              创建产品存储记录
            </el-button>
            <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initProductData" />
            <el-table v-loading="loading" :data="productData" style="width: 100%">
              <el-table-column align="center" label="产品名" width="300">
                <template slot-scope="scope">
                  <el-tag size="medium">{{ scope.row.productName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="存储数量" prop="productNumber" width="300" />
              <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="test(scope.row)">修改数量</el-button>
                  <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此记录？">
                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import Pagination from '@/components/Pagination'
import { getStocks, createStock, updateStock, deleteStock, getMaterialStocks, getProdStocks } from '@/api/stock/index'
import { getUsers } from '@/api/system/user'
import { getMaterials } from '@/api/material/index'
import { getProducts } from '@/api/product/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      round: true,
      plain: true,
      loading: true,
      stretch: true,
      stockDialogVisible: false,
      stockEditDialogVisible: false,
      labelPosition: 'right',
      page: 1,
      limit: 10,
      total: 0,
      stockData: [],
      userData: [],
      materialData: [],
      productData: [],
      stock: {
        stockName: '',
        stockPosition: '',
        stockManager: {
          userId: ''
        }
      },
      editStock: {
        stockId: '',
        stockName: '',
        stockPosition: '',
        stockManager: {
          userId: ''
        }
      },
      stockRules: {
        stockName: [
          { required: true, message: '请输入仓库名', trigger: 'blur' }
        ],
        stockPosition: [
          { required: true, message: '请输入仓库位置', trigger: 'blur' }
        ],
        stockManager: [
          { required: true, message: '请指定仓库管理员', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.initStockData()
    this.initUserData()
  },
  methods: {
    initStockData() {
      // 初始化仓库数据
      this.loading = true
      getStocks(this.page - 1, this.limit).then(response => {
        this.stockData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    initUserData() {
      getUsers(0, 200).then(response => {
        this.userData = response.data.content
      }).catch(error => {
        console.log(error)
      })
    },
    initMaterialData() {
      getMaterials(0, 200).then(res => {
        const tmpData = res.data.content
        tmpData.forEach(material => {
          getMaterialStocks(material.materialId).then(res => {
            // 使用 this.$set 的原因是避免 Vue 无法检测到数组中属性的变化
            this.$set(material, 'materialNumber', res.data.materialNumber)
            if (material.materialNumber === undefined) {
              this.$set(material, 'materialNumber', 0)
            }
          }).catch(error => {
            console.log(error)
            this.$set(material, 'materialNumber', 0)
          })
        })
        this.materialData = tmpData
      }).catch(error => {
        console.log(error)
      })
    },
    initProductData() {
      getProducts(0, 200).then(res => {
        this.productData = res.data.content
        this.productData.forEach(product => {
          getProdStocks(product.productId).then(res => {
            this.$set(product, 'productNumber', res.data.productNumber)
            if (product.productNumber === undefined) {
              this.$set(product, 'productNumber', 0)
            }
          }).catch(error => {
            console.log(error)
            this.$set(product, 'productNumber', 0)
          })
        })
      }).catch(error => {
        console.log(error)
      })
    },
    handleStockFormSubmit(formName) {
      // 仓库创建表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stockDialogVisible = false
          const stockSubmit = this.stock
          // 发请求提交
          createStock(stockSubmit).then(response => {
            this.$notify({
              title: '成功',
              message: '创建仓库成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initStockData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleStockFormCancel(formName) {
      // 仓库创建表单取消提交
      this.stockDialogVisible = false
      this.$refs[formName].resetFields()
    },
    handleStockEdit(row) {
      this.editStock = row
      this.stockEditDialogVisible = true
    },
    handleStockEditSubmit(formName) {
      // 仓库修改表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stockEditDialogVisible = false
          const editStockData = this.editStock
          // 发请求提交
          updateStock(editStockData).then(response => {
            this.$notify({
              title: '成功',
              message: '修改仓库成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initStockData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleStockDelete(row) {
      const stockIds = [row.stockId]
      deleteStock(stockIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除仓库成功',
          type: 'success'
        })
        this.initStockData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    handleTabClick(tab) {
      switch (tab.name) {
        case 'repo':
          this.initStockData()
          break
        case 'material':
          this.initMaterialData()
          break
        case 'product':
          this.initProductData()
          break
        default:
          this.initStockData()
          break
      }
    },
    test(row) {
    }
  }
}
</script>
