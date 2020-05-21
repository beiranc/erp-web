<template>
  <el-card shadow="always" style="margin-left: 8px;">
    <div class="filter-container">
      <el-form style="margin-left: 10px;" :inline="inline">
        <el-form-item width="200">
          <el-input v-model="search" size="mini" placeholder="输入权限描述搜索" :inline="inline" />
        </el-form-item>
      </el-form>
      <el-button v-permission="['admin', 'system:permission:add']" class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="createDialogVisible = true">
        新增权限
      </el-button>
      <el-dialog title="新增权限" :visible.sync="createDialogVisible" center>
        <el-form ref="createForm" :rules="createPermissionRules" :label-position="labelPosition" label-width="80px" :model="createPermission">
          <el-form-item label="权限名" prop="permissionName">
            <el-input v-model.trim="createPermission.permissionName" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="权限描述" prop="permissionDesc">
            <el-input v-model.trim="createPermission.permissionDesc" size="medium" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCreateCancel('createForm')">取消</el-button>
          <el-button v-permission="['admin', 'system:permission:add']" size="mini" type="primary" @click="handleCreateSubmit('createForm')">创建</el-button>
        </span>
      </el-dialog>
      <el-button v-permission="['admin', 'system:permission:export']" class="filter-item" style="margin-left: 10px;" type="warning" size="mini" icon="el-icon-download" @click="exportAll">
        导出权限
      </el-button>
      <el-button v-permission="['admin', 'system:permission:view']" size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initPermissionData" />
    </div>
    <el-table v-loading="loading" :data="permissionData.filter(data => !search || data.permissionDesc.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
      <el-table-column align="center" prop="permissionName" label="权限名" width="300" />
      <el-table-column align="center" label="权限描述" width="300">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.permissionName.indexOf('add') != -1" type="success">{{ scope.row.permissionDesc }}</el-tag>
          <el-tag v-else-if="scope.row.permissionName.indexOf('edit') != -1">{{ scope.row.permissionDesc }}</el-tag>
          <el-tag v-else-if="scope.row.permissionName.indexOf('export') != -1" type="warning">{{ scope.row.permissionDesc }}</el-tag>
          <el-tag v-else-if="scope.row.permissionName.indexOf('del') != -1" type="danger">{{ scope.row.permissionDesc }}</el-tag>
          <el-tag v-else type="info">{{ scope.row.permissionDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.permissionCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-permission="['admin', 'system:permission:edit']" size="mini" type="primary" @click="handlePermissionEdit(scope.row)">编辑</el-button>
          <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此权限？" @onConfirm="handlePermissionDelete(scope.row)">
            <el-button slot="reference" v-permission="['admin', 'system:permission:del']" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-dialog title="修改权限" :visible.sync="editDialogVisible" center append-to-body @closed="handleEditCancel('editForm')">
        <el-form ref="editForm" :rules="editPermissionRules" :label-position="labelPosition" label-width="80px" :model="editPermission">
          <el-form-item label="权限名" prop="permissionName">
            <el-input v-model.trim="editPermission.permissionName" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="权限描述" prop="permissionDesc">
            <el-input v-model.trim="editPermission.permissionDesc" size="medium" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleEditCancel('editForm')">取消</el-button>
          <el-button v-permission="['admin', 'system:permission:edit']" size="mini" type="primary" @click="handleEditSubmit('editForm')">修改</el-button>
        </span>
      </el-dialog>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initPermissionData" />
  </el-card>
</template>

<script>

import Pagination from '@/components/Pagination'
import { addPermission, getPermissions, exportPermissions, deletePermission, updatePermission } from '@/api/system/menu'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      round: true,
      plain: true,
      createDialogVisible: false,
      editDialogVisible: false,
      permissionData: [],
      search: '',
      inline: true,
      labelPosition: 'right',
      // 创建权限所需字段
      createPermission: {
        permissionName: '',
        permissionDesc: ''
      },
      // 修改权限所需字段
      editPermission: {
        permissionId: '',
        permissionName: '',
        permissionDesc: '',
        permissionCreateTime: ''
      },
      createPermissionRules: {
        permissionName: [
          { required: true, message: '请输入权限名', trigger: 'blur' }
        ],
        permissionDesc: [
          { required: true, message: '请输入权限描述', trigger: 'blur' }
        ]
      },
      editPermissionRules: {
        permissionName: [
          { required: true, message: '请输入权限名', trigger: 'blur' }
        ],
        permissionDesc: [
          { required: true, message: '请输入权限描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initPermissionData()
  },
  methods: {
    initPermissionData() {
      getPermissions(this.page - 1, this.limit).then(response => {
        this.permissionData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handlePermissionEdit(row) {
      this.editDialogVisible = true
      this.editPermission = row
    },
    handleEditCancel(formName) {
      this.editDialogVisible = false
      this.editPermission = {
        permissionId: '',
        permissionName: '',
        permissionDesc: '',
        permissionCreateTime: ''
      }
    },
    handleEditSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 获取数据执行修改提交
          const editPermissionData = this.editPermission
          updatePermission(editPermissionData).then(res => {
            this.$message({
              type: 'success',
              message: '修改权限成功'
            })
            this.handleEditCancel(formName)
            this.initPermissionData()
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handlePermissionDelete(row) {
      const permissionIds = [row.permissionId]
      deletePermission(permissionIds).then(res => {
        this.$notify({
          type: 'success',
          title: '成功',
          message: '删除权限成功',
          duration: 2500
        })
        this.initPermissionData()
      }).catch(err => {
        console.log(err)
      })
    },
    handleCreateSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createDialogVisible = false
          const permission = this.createPermission
          // 发请求提交
          addPermission(permission.permissionName, permission.permissionDesc).then(response => {
            this.$notify({
              title: '成功',
              message: '创建权限成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initPermissionData()
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    handleCreateCancel(formName) {
      this.createDialogVisible = false
      this.$refs[formName].resetFields()
    },
    exportAll() {
      exportPermissions(0, 200).then(response => {
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
