<template>
  <el-card shadow="always" style="margin-left: 8px;">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-input v-model.trim="deptFilterText" placeholder="输入关键字进行过滤" />
        <el-tree ref="deptTree" :data="deptData" :props="deptProps" default-expand-all :filter-node-method="filterNode" />
      </el-col>
      <el-col :span="16">
        <div class="filter-container">
          <el-button v-permission="['admin', 'system:dept:add']" class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="createDeptDialogVisible = true">
            新增部门
          </el-button>
          <el-dialog title="新增部门" :visible.sync="createDeptDialogVisible" center @closed="handleCreateCancel('createDeptForm')">
            <el-form ref="createDeptForm" :rules="createDeptRules" :label-position="labelPosition" label-width="80px" :model="createDept">
              <el-form-item label="部门名" prop="deptName">
                <el-input v-model.trim="createDept.deptName" size="medium" auto-complete="off" />
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch v-model="createDept.deptState" active-value="ACTIVE" inactive-value="DISABLED" active-text="启用" inactive-text="禁用" />
              </el-form-item>
              <el-form-item label="上一级部门">
                <el-select v-model="createDept.parent" filterable placehodlder="请选择上一级部门" value-key="deptName" size="medium">
                  <el-option v-for="dept in deptParentData" :key="dept.deptId" :label="dept.deptName" :value="dept" />
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="handleCreateCancel('createDeptForm')">取消</el-button>
              <el-button size="mini" type="primary" @click="handleCreateSubmit('createDeptForm')">创建</el-button>
            </span>
          </el-dialog>
          <el-button v-permission="['admin', 'system:dept:export']" class="filter-item" style="margin-left: 10px;" type="warning" size="mini" icon="el-icon-download" @click="exportAll">
            导出部门
          </el-button>
          <el-button v-permission="['admin', 'system:dept:view']" size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initDeptData" />
        </div>
        <el-table v-loading="loading" :data="deptData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-card v-for="(child, index) in props.row.children" :key="child.deptId">
                <el-tag type="info" size="medium" style="margin-right: 20px;">{{ index + 1 }}</el-tag>
                <span style="margin-right: 20px;">{{ child.deptName }}</span>
                <el-popconfirm title="确认删除此部门？" confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" @onConfirm="handleDeptDelete(child)">
                  <el-button slot="reference" v-permission="['admin', 'system:dept:del']" size="mini" type="danger">删除</el-button>
                </el-popconfirm>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门名" width="200">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.deptName }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.deptState | state" placement="top">
                <el-switch v-model="scope.row.deptState" v-permission="['admin', 'system:dept:edit']" active-value="ACTIVE" inactive-value="DISABLED" @change="handleDeptStateChange(scope.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="子部门数量" width="200">
            <template slot-scope="scope">
              <el-tag type="danger" size="medium">{{ scope.row.children.length }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button v-permission="['admin', 'system:dept:edit']" size="mini" type="primary" @click="handleDeptEdit(scope.row)">编辑</el-button>
              <el-popconfirm title="确认删除此部门？" confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" @onConfirm="handleDeptDelete(scope.row)">
                <el-button slot="reference" v-permission="['admin', 'system:dept:del']" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-dialog title="编辑部门" :visible.sync="editDeptDialogVisible" center append-to-body @closed="handleEditCancel('editDeptForm')">
            <el-form ref="editDeptForm" :rules="editDeptRules" :label-position="labelPosition" label-width="80px" :model="editDept" @submit.native.prevent>
              <el-form-item label="部门名" prop="deptName">
                <el-input v-model.trim="editDept.deptName" size="medium" auto-complete="off" />
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="handleEditCancel('editDeptForm')">取消</el-button>
              <el-button v-permission="['admin', 'system:dept:edit']" size="mini" type="primary" @click="handleEditSubmit('editDeptForm')">修改</el-button>
            </span>
          </el-dialog>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getDepts, getAllParent, createDept, updateDept, updateDeptState, deleteDept, exportDepts } from '@/api/system/dept'

export default {
  filters: {
    state(deptState) {
      return deptState === 'ACTIVE' ? '启用' : '停用'
    }
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      round: true,
      plain: true,
      labelPosition: 'right',
      // 创建部门的对话框
      createDeptDialogVisible: false,
      // 修改部门的对话框
      editDeptDialogVisible: false,
      // 部门表格数据
      deptData: [],
      // 创建部门时所需的父级部门数据
      deptParentData: [],
      deptFilterText: '',
      deptProps: {
        children: 'children',
        label: 'deptName'
      },
      // 创建部门所需数据
      createDept: {
        deptName: '',
        deptState: 'ACTIVE',
        // 上级部门可为空
        parent: null
      },
      // 创建部门时的表单校验规则
      createDeptRules: {
        deptName: [
          { required: true, message: '请输入部门名', trigger: 'blur' }
        ]
      },
      // 修改部门数据
      editDept: {
        deptId: '',
        deptName: '',
        deptState: '',
        deptCreateTime: ''
      },
      // 修改部门时的表单校验规则
      editDeptRules: {
        deptName: [
          { required: true, message: '请输入部门名', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() {
    this.initDeptData()
    this.initParentData()
  },
  methods: {
    initDeptData() {
      getDepts().then(response => {
        this.deptData = response.data
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    initParentData() {
      getAllParent().then(response => {
        this.deptParentData = response.data
      }).catch(error => {
        console.log(error)
        this.$message({
          type: 'error',
          message: '加载父级部门数据失败'
        })
      })
    },
    handleDeptEdit(row) {
      // 打开对话框并赋予数据
      this.editDeptDialogVisible = true
      this.editDept = row
    },
    handleDeptDelete(row) {
      console.log(row)
      // 删除部门的逻辑
      const deptIds = [row.deptId]
      deleteDept(deptIds).then(response => {
        this.$notify({
          type: 'success',
          title: '成功',
          message: '删除部门成功',
          duration: 2000
        })
        this.initDeptData()
        this.initParentData()
      }).catch(error => {
        console.log(error)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    },
    handleDeptStateChange(row) {
      // 部门状态改变时触发的方法
      const deptData = {
        deptId: row.deptId,
        deptState: row.deptState
      }
      updateDeptState(deptData.deptId, deptData.deptState).then(response => {
        this.$message({
          type: 'success',
          message: '修改' + row.deptName + '部门状态成功'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    handleCreateCancel(formName) {
      // 取消创建部门表单提交
      this.createDeptDialogVisible = false
      this.$refs[formName].resetFields()
      this.createDept = {
        deptName: '',
        deptState: 'ACTIVE',
        // 上级部门可为空
        parent: null
      }
    },
    handleCreateSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 创建部门表单提交
          const dept = this.createDept
          createDept(dept).then(response => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '创建部门成功',
              duration: 2000
            })
            this.createDeptDialogVisible = false
            this.$refs[formName].resetFields()
            this.initDeptData()
            this.initParentData()
          }).catch(error => {
            console.log(error)
            this.createDeptDialogVisible = false
            this.$refs[formName].resetFields()
          })
        } else {
          return false
        }
      })
    },
    handleEditCancel(formName) {
      // 取消编辑部门表单提交
      this.editDeptDialogVisible = false
    },
    handleEditSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 编辑部门表单提交
          const deptData = {
            deptId: this.editDept.deptId,
            deptName: this.editDept.deptName,
            deptState: this.editDept.deptState,
            deptCreateTime: this.editDept.createTime
          }
          // console.log(deptData)
          updateDept(deptData).then(response => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '修改部门成功',
              duration: 2000
            })
            this.editDeptDialogVisible = false
            this.$refs[formName].resetFields()
            this.initDeptData()
            this.initParentData()
          }).catch(error => {
            console.log(error)
            this.editDeptDialogVisible = false
            this.$refs[formName].resetFields()
          })
        } else {
          return false
        }
      })
    },
    exportAll() {
      exportDepts(0, 200).then(response => {
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
