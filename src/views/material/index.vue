<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-tabs value="material" :stretch="stretch" type="border-card" @tab-click="handleTabClick">
          <!-- 物料管理部分 -->
          <el-tab-pane name="material" label="物料管理">
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="materialDialogVisible = true">
              创建物料
            </el-button>
            <el-dialog title="新增物料" :visible.sync="materialDialogVisible" center @closed="handleMaterialFormCancel('materialForm')">
              <el-form ref="materialForm" :rules="materialRules" :label-position="labelPosition" label-width="100px" :model="material">
                <el-form-item label="物料名" prop="materialName">
                  <el-input v-model.trim="material.materialName" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="物料进货价" prop="materialInPrice">
                  <el-input-number v-model="material.materialInPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="物料制造商" prop="materialManufacturer">
                  <el-input v-model.trim="material.materialManufacturer" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="物料产地" prop="materialOrigin">
                  <el-input v-model.trim="material.materialOrigin" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="物料规格" prop="materialSpecification">
                  <el-input v-model.trim="material.materialSpecification" size="medium" auto-complete="off" />
                </el-form-item>
                <el-form-item label="物料分类" prop="materialCategory">
                  <el-select v-model="material.materialCategory.categoryId" placehodlder="请选择物料分类" size="medium">
                    <el-option v-for="categoryTmp in categoryData" :key="categoryTmp.categoryName" :label="categoryTmp.categoryName" :value="categoryTmp.categoryId" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleMaterialFormCancel('materialForm')">取消</el-button>
                <el-button size="mini" type="primary" @click="handleMaterialFormSubmit('materialForm')">创建</el-button>
              </span>
            </el-dialog>
            <el-button type="warning" size="mini" icon="el-icon-download" @click="exportMaterials">
              导出物料
            </el-button>
            <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initMaterialData" />
            <el-table v-loading="loading" :data="materialData" style="width: 100%">
              <el-table-column align="center" label="物料名" width="180">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.materialName }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="物料进货价" width="180">
                <template slot-scope="scope">
                  <p>{{ scope.row.materialInPrice }}元</p>
                </template>
              </el-table-column>
              <el-table-column align="center" label="物料分类" prop="materialCategory.categoryName" width="180" />
              <el-table-column align="center" label="物料制造商" prop="materialManufacturer" width="300" />
              <el-table-column align="center" label="物料规格" width="180">
                <template slot-scope="scope">
                  <el-tag type="danger" size="medium">{{ scope.row.materialSpecification }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="物料产地" prop="materialOrigin" width="180" />
              <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleMaterialEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此物料？" @onConfirm="handleMaterialDelete(scope.$index, scope.row)">
                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
              <el-dialog title="编辑物料" :visible.sync="materialEditDialogVisible" center append-to-body @closed="materialEditDialogVisible = false">
                <el-form ref="editForm" :rules="materialRules" :label-position="labelPosition" label-width="100px" :model="editMaterial">
                  <el-form-item label="物料名" prop="materialName">
                    <el-input v-model.trim="editMaterial.materialName" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="物料进货价" prop="materialInPrice">
                    <el-input-number v-model="editMaterial.materialInPrice" :precision="2" :step="0.1" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="物料制造商" prop="materialManufacturer">
                    <el-input v-model.trim="editMaterial.materialManufacturer" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="物料产地" prop="materialOrigin">
                    <el-input v-model.trim="editMaterial.materialOrigin" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="物料规格" prop="materialSpecification">
                    <el-input v-model.trim="editMaterial.materialSpecification" size="medium" auto-complete="off" />
                  </el-form-item>
                  <el-form-item label="物料分类" prop="materialCategory">
                    <el-select v-model="editMaterial.materialCategory.categoryId" placehodlder="请选择物料分类" size="medium">
                      <el-option v-for="categoryTmp in categoryData" :key="categoryTmp.categoryName" :label="categoryTmp.categoryName" :value="categoryTmp.categoryId" />
                    </el-select>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="materialEditDialogVisible = false">取消</el-button>
                  <el-button size="mini" type="danger" @click="handleMaterialEditSubmit('editForm')">修改</el-button>
                </span>
              </el-dialog>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initMaterialData" />
          </el-tab-pane>
          <!-- 物料分类管理部分 -->
          <el-tab-pane name="category" label="物料分类管理">
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="categoryDialogVisible = true">
              创建物料分类
            </el-button>
            <el-dialog title="新增物料分类" :visible.sync="categoryDialogVisible" center @closed="handleCategoryFormCancel('categoryForm')">
              <el-form ref="categoryForm" :rules="categoryRules" :label-position="labelPosition" label-width="100px" :model="category" @submit.native.prevent>
                <el-form-item label="物料分类名" prop="categoryName">
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
              <el-table-column align="center" label="物料分类名" style="width: 50%">
                <template slot-scope="scope">
                  <template v-if="scope.row.edit">
                    <el-input v-model.trim="scope.row.categoryName" size="small" style="padding-right: 100px;" />
                    <el-button size="mini" type="warning" icon="el-icon-refresh" style="position: absolute; right: 15px;" @click="handleCategoryEditCancle(scope.row)">取消</el-button>
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
                  <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此物料分类？" @onConfirm="handleCategoryDelete(scope.$index, scope.row)">
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
import { getMaterials, getCategories, createCategory, createMaterial, exportMaterials, deleteCategory, updateCategory, updateMaterial, deleteMaterial } from '@/api/material/index'

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
      materialDialogVisible: false,
      materialEditDialogVisible: false,
      categoryDialogVisible: false,
      labelPosition: 'right',
      page: 1,
      limit: 10,
      total: 0,
      materialData: [],
      categoryData: [],
      material: {
        materialName: '',
        materialInPrice: 0,
        materialManufacturer: '',
        materialOrigin: '',
        materialSpecification: '',
        materialCategory: {
          categoryId: ''
        }
      },
      editMaterial: {
        materialId: '',
        materialName: '',
        materialInPrice: 0,
        materialManufacturer: '',
        materialOrigin: '',
        materialSpecification: '',
        materialCategory: {
          categoryId: ''
        }
      },
      category: {
        categoryName: ''
      },
      materialRules: {
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
        ]
      },
      categoryRules: {
        categoryName: [
          { required: true, message: '请输入物料分类名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initMaterialData()
    this.initCategoryData()
  },
  methods: {
    initMaterialData() {
      // 初始化物料数据
      getMaterials(this.page - 1, this.limit).then(response => {
        this.materialData = response.data.content
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
        // 添加 edit 与 originalName 属性
        const tempData = response.data.content
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
        case 'material':
          // 物料管理相关数据加载
          this.initMaterialData()
          console.log('物料管理')
          break
        case 'category':
          // 物料分类管理相关数据加载
          this.initCategoryData()
          console.log('物料分类管理')
          break
        default:
          this.initMaterialData()
          // 默认加载物料管理的数据
          break
      }
    },
    handleMaterialFormSubmit(formName) {
      // 物料表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.materialDialogVisible = false
          const material = {
            materialName: this.material.materialName,
            materialInPrice: this.material.materialInPrice,
            materialManufacturer: this.material.materialManufacturer,
            materialOrigin: this.material.materialOrigin,
            materialSpecification: this.material.materialSpecification,
            materialCategory: {
              categoryId: this.material.materialCategory.categoryId
            }
          }
          // 发请求提交
          createMaterial(material).then(response => {
            this.$notify({
              title: '成功',
              message: '创建物料成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initMaterialData()
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
              message: '创建物料分类成功',
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
    handleMaterialFormCancel(formName) {
      this.materialDialogVisible = false
      this.$refs[formName].resetFields()
      // 取消提交物料表单
    },
    handleCategoryFormCancel(formName) {
      this.categoryDialogVisible = false
      this.$refs[formName].resetFields()
      // 取消提交物料分类表单
    },
    handleMaterialEdit(index, row) {
      this.editMaterial = row
      this.materialEditDialogVisible = true
    },
    handleMaterialEditSubmit(formName) {
      // 提交修改
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.materialEditDialogVisible = false
          const editMaterialData = this.editMaterial
          // 发请求提交
          updateMaterial(editMaterialData).then(response => {
            this.$notify({
              title: '成功',
              message: '修改物料成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initMaterialData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleMaterialDelete(index, row) {
      // 删除的逻辑
      const materialIds = [row.materialId]
      deleteMaterial(materialIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除物料成功',
          type: 'success'
        })
        this.initMaterialData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    handleCategoryEdit(index, row) {
      row.edit = !row.edit
    },
    handleCategoryEditConfirm(row) {
      // 提交物料分类编辑
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
    handleCategoryEditCancle(row) {
      // 取消物料分类编辑
      row.categoryName = row.originalName
      row.edit = false
    },
    handleCategoryDelete(index, row) {
      // 删除的逻辑
      const categoryIds = [row.categoryId]
      deleteCategory(categoryIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除物料分类成功',
          type: 'success'
        })
        this.initCategoryData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    exportMaterials() {
      exportMaterials(0, 200).then(response => {
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
