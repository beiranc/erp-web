<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-tabs value="product" :stretch="stretch" type="border-card" @tab-click="handleTabClick">
          <!-- 产品管理部分 -->
          <el-tab-pane name="product" label="产品管理">
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="productlDialogVisible = true">
              创建产品
            </el-button>
            <el-dialog title="新增产品" :visible.sync="productlDialogVisible" center @closed="handleProductFormCancel('productForm')">
              <el-form ref="productForm" :rules="productRules" :label-position="labelPosition" label-width="100px" :model="product">
                <el-form-item label="产品名" prop="productName">
                  <el-input v-model.trim="product.productName" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="产品成本价" prop="productInPrice">
                  <el-input-number v-model="product.productInPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="产品出售价" prop="productOutPrice">
                  <el-input-number v-model="product.productOutPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="产品制造商" prop="productManufacturer">
                  <el-input v-model.trim="product.productManufacturer" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="产品产地" prop="productOrigin">
                  <el-input v-model.trim="product.productOrigin" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="产品规格" prop="productSpecification">
                  <el-input v-model.trim="product.productSpecification" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="产品分类" prop="productCategory">
                  <el-select v-model="product.productCategory.categoryId" placehodlder="请选择产品分类" size="medium">
                    <el-option v-for="categoryTmp in categoryData" :key="categoryTmp.categoryName" :label="categoryTmp.categoryName" :value="categoryTmp.categoryId" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleProductFormCancel('productForm')">取消</el-button>
                <el-button size="mini" type="primary" @click="handleProductFormSubmit('productForm')">创建</el-button>
              </span>
            </el-dialog>
            <el-button type="warning" size="mini" icon="el-icon-download" @click="exportProducts">
              导出产品
            </el-button>
            <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initProductData" />
            <el-table v-loading="loading" :data="productData" style="width: 100%">
              <el-table-column align="center" label="产品名" width="180">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.productName }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="产品成本价" width="180">
                <template slot-scope="scope">
                  <p>{{ scope.row.productInPrice }}元</p>
                </template>
              </el-table-column>
              <el-table-column align="center" label="产品出售价" width="180">
                <template slot-scope="scope">
                  <p>{{ scope.row.productOutPrice }}元</p>
                </template>
              </el-table-column>
              <el-table-column align="center" label="产品分类" prop="productCategory.categoryName" width="180" />
              <el-table-column align="center" label="产品制造商" prop="productManufacturer" width="300" />
              <el-table-column align="center" label="产品规格" width="180">
                <template slot-scope="scope">
                  <el-tag type="danger" size="medium">{{ scope.row.productSpecification }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="产品产地" prop="productOrigin" width="180" />
              <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleProductEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此产品？" @onConfirm="handleProductDelete(scope.$index, scope.row)">
                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
              <el-dialog title="编辑产品" :visible.sync="productEditDialogVisible" center append-to-body @closed="productEditDialogVisible = false">
                <el-form ref="editForm" :rules="productRules" :label-position="labelPosition" label-width="100px" :model="editProduct">
                  <el-form-item label="产品名" prop="productName">
                    <el-input v-model.trim="editProduct.productName" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="产品成本价" prop="productInPrice">
                    <el-input-number v-model="editProduct.productInPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="产品出售价" prop="productOutPrice">
                    <el-input-number v-model="editProduct.productOutPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="产品制造商" prop="productManufacturer">
                    <el-input v-model.trim="editProduct.productManufacturer" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="产品产地" prop="productOrigin">
                    <el-input v-model.trim="editProduct.productOrigin" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="产品规格" prop="productSpecification">
                    <el-input v-model.trim="editProduct.productSpecification" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="产品分类" prop="productCategory">
                    <el-select v-model="editProduct.productCategory.categoryId" placehodlder="请选择产品分类" size="medium">
                      <el-option v-for="categoryTmp in categoryData" :key="categoryTmp.categoryName" :label="categoryTmp.categoryName" :value="categoryTmp.categoryId" />
                    </el-select>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="productEditDialogVisible = false">取消</el-button>
                  <el-button size="mini" type="danger" @click="handleProductEditSubmit('editForm')">修改</el-button>
                </span>
              </el-dialog>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initProductData" />
          </el-tab-pane>
          <!-- 产品分类管理部分 -->
          <el-tab-pane name="category" label="产品分类管理">
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="categoryDialogVisible = true">
              创建产品分类
            </el-button>
            <el-dialog title="新增产品分类" :visible.sync="categoryDialogVisible" center @closed="handleCategoryFormCancel('categoryForm')">
              <el-form ref="categoryForm" :rules="categoryRules" :label-position="labelPosition" label-width="100px" :model="category" @submit.native.prevent>
                <el-form-item label="产品分类名" prop="categoryName">
                  <el-input v-model.trim="category.categoryName" size="medium" auto-complete="off" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleCategoryFormCancel('categoryForm')">取消</el-button>
                <el-button size="mini" type="primary" @click="handleCategoryFormSubmit('categoryForm')">创建</el-button>
              </span>
            </el-dialog>
            <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initCategoryData" />
            <el-table v-loading="loading" :data="categoryData" style="width: 100%">
              <el-table-column align="center" label="产品分类名" style="width: 50%">
                <template slot-scope="scope">
                  <template v-if="scope.row.edit">
                    <el-input v-model.trim="scope.row.categoryName" size="small" style="padding-right: 100px;" />
                    <el-button size="mini" type="warning" icon="el-icon-refresh" style="position: absolute; right: 15px;" @click="handleCategoryEditCancel(scope.row)">取消</el-button>
                  </template>
                  <div v-else slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.categoryName }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" style="width: 50%">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.edit" size="mini" type="success" @click="handleCategoryEditConfirm(scope.row)">确认</el-button>
                  <el-button v-else size="mini" type="primary" @click="handleCategoryEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此产品分类？" @onConfirm="handleCategoryDelete(scope.$index, scope.row)">
                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initCategoryData" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import Pagination from '@/components/Pagination'
import { getProducts, getCategories, createProduct, createCategory, exportProducts, deleteCategory, updateProduct, updateCategory, deleteProduct } from '@/api/product/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      stretch: true,
      round: true,
      plain: true,
      loading: true,
      productlDialogVisible: false,
      productEditDialogVisible: false,
      categoryDialogVisible: false,
      labelPosition: 'right',
      page: 1,
      limit: 10,
      total: 0,
      productData: [],
      categoryData: [],
      product: {
        productName: '',
        productInPrice: 0,
        productOutPrice: 0,
        productManufacturer: '',
        productOrigin: '',
        productSpecification: '',
        productCategory: {
          categoryId: ''
        }
      },
      editProduct: {
        productId: '',
        productName: '',
        productInPrice: 0,
        productOutPrice: 0,
        productManufacturer: '',
        productOrigin: '',
        productSpecification: '',
        productCategory: {
          categoryId: ''
        }
      },
      category: {
        categoryName: ''
      },
      productRules: {
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
          { required: true, message: '请输入产品出售价', trigger: 'blur' },
          { type: 'number', min: 0, message: '产品出售价必须是一个大于0的数' }
        ],
        productCategory: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ]
      },
      categoryRules: {
        categoryName: [
          { required: true, message: '请输入产品分类名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initProductData()
    this.initCategoryData()
  },
  methods: {
    initProductData() {
      // 初始化产品数据
      getProducts(this.page - 1, this.limit).then(response => {
        this.productData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    initCategoryData() {
      // 初始化分类数据
      getCategories(this.page - 1, this.limit).then(response => {
        const tempData = response.data.content
        // 洗数据, 添加 edit 属性与 originalName 属性
        this.categoryData = tempData.map(val => {
          this.$set(val, 'edit', false)
          val.originalName = val.categoryName
          return val
        })
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handleTabClick(tab) {
      switch (tab.name) {
        case 'product':
          // 产品管理相关数据加载
          this.initProductData()
          console.log('产品管理')
          break
        case 'category':
          // 产品分类管理相关数据加载
          this.initCategoryData()
          console.log('产品分类管理')
          break
        default:
          this.initProductData()
          // 默认加载产品管理的数据
          break
      }
    },
    handleProductFormSubmit(formName) {
      // 产品表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.productlDialogVisible = false
          const product = {
            productName: this.product.productName,
            productInPrice: this.product.productInPrice,
            productOutPrice: this.product.productOutPrice,
            productManufacturer: this.product.productManufacturer,
            productOrigin: this.product.productOrigin,
            productSpecification: this.product.productSpecification,
            productCategory: {
              categoryId: this.product.productCategory.categoryId
            }
          }
          // 发请求提交
          createProduct(product).then(response => {
            this.$notify({
              title: '成功',
              message: '创建产品成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initProductData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleCategoryFormSubmit(formName) {
      // 物料分类表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.categoryDialogVisible = false
          const category = {
            categoryName: this.category.categoryName
          }
          // 发请求提交
          createCategory(category).then(response => {
            this.$notify({
              title: '成功',
              message: '创建产品分类成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initCategoryData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleProductFormCancel(formName) {
      this.productlDialogVisible = false
      this.$refs[formName].resetFields()
      // 取消提交产品表单
    },
    handleCategoryFormCancel(formName) {
      this.categoryDialogVisible = false
      this.$refs[formName].resetFields()
      // 取消提交产品分类表单
    },
    handleProductEdit(index, row) {
      this.editProduct = row
      this.productEditDialogVisible = true
    },
    handleProductEditSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.productEditDialogVisible = false
          const editProductData = this.editProduct
          // 发请求提交
          updateProduct(editProductData).then(response => {
            this.$notify({
              title: '成功',
              message: '修改产品成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initProductData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleProductDelete(index, row) {
      // 删除的逻辑
      const productIds = [row.productId]
      deleteProduct(productIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除产品成功',
          type: 'success'
        })
        this.initProductData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    handleCategoryEdit(index, row) {
      row.edit = !row.edit
    },
    handleCategoryEditConfirm(row) {
      // 提交产品分类编辑
      row.edit = false
      if (row.categoryName.length === 0) {
        row.categoryName = row.originalName
      } else {
        const category = {
          categoryId: row.categoryId,
          categoryName: row.categoryName
        }
        updateCategory(category).then(response => {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '修改成功'
          })
          this.initCategoryData()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    handleCategoryEditCancel(row) {
      // 取消产品分类编辑
      row.categoryName = row.originalName
      row.edit = false
    },
    handleCategoryDelete(index, row) {
      // 删除的逻辑
      const categoryIds = [row.categoryId]
      deleteCategory(categoryIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除产品分类成功',
          type: 'success'
        })
        this.initCategoryData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    exportProducts() {
      exportProducts(0, 200).then(response => {
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
