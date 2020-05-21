<template>
  <el-card shadow="always" style="margin-left: 8px;">
    <div>
      <el-form style="margin-left: 10px;" :inline="inline">
        <el-form-item width="200">
          <el-input v-model="search" size="mini" placeholder="输入角色描述搜索" :inline="inline" />
        </el-form-item>
      </el-form>
      <el-button v-permission="['admin', 'system:role:add']" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="dialogVisible = true">
        创建角色
      </el-button>
      <el-dialog title="新增角色" :visible.sync="dialogVisible" center>
        <el-form ref="roleForm" :rules="roleRules" :label-position="labelPosition" label-width="80px" :model="roleData">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model.trim="roleData.roleName" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model.trim="roleData.roleDesc" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="角色权限" prop="permissionIds">
            <el-select v-model="roleData.permissionIds" multiple filterable placehodlder="请选择权限" size="medium">
              <el-option v-for="permission in permissions" :key="permission.permissionDesc" :label="permission.permissionDesc" :value="permission.permissionId" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelSubmit('roleForm')">取消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('roleForm')">创建</el-button>
        </span>
      </el-dialog>
      <el-button v-permission="['admin', 'system:role:export']" type="warning" size="mini" icon="el-icon-download" @click="exportAll">
        导出角色
      </el-button>
      <el-button v-permission="['admin', 'system:role:view']" size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initData" />
    </div>
    <el-table v-loading="loading" :data="tableData.filter(data => !search || data.roleDesc.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.roleCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名" width="200">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述" prop="roleDesc" width="200" />
      <el-table-column align="center" label="权限数量" width="200">
        <template slot-scope="scope">
          <el-tag type="danger" size="medium">{{ scope.row.rolePermissions.length }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-permission="['admin', 'system:role:edit']" :disabled="scope.row.roleName === 'admin'" size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此角色？" @onConfirm="handleDelete(scope.$index, scope.row)">
            <el-button slot="reference" v-permission="['admin', 'system:role:del']" :disabled="scope.row.roleName === 'admin'" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-dialog title="修改角色" :visible.sync="editDialogVisible" center append-to-body @closed="handleEditCancel('editForm')">
        <el-form ref="editForm" :rules="editRoleRules" :label-position="labelPosition" label-width="80px" :model="editRole">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editRole.roleName" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRole.roleDesc" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="角色权限" prop="rolePermissions">
            <el-select v-model="editRole.rolePermissions" value-key="permissionId" multiple filterable placehodlder="请选择权限" size="small">
              <el-option v-for="permission in permissions" :key="permission.permissionDesc" :label="permission.permissionDesc" :value="permission" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleEditCancel('editForm')">取消</el-button>
          <el-button v-permission="['admin', 'system:role:edit']" size="mini" type="primary" @click="handleEditSubmit('editForm')">修改</el-button>
        </span>
      </el-dialog>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initData" />
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import { createRole, getAllRoles, exportRoles, deleteRole, updateRole } from '@/api/system/role'
import { getPermissions } from '@/api/system/menu'

export default {
  components: {
    Pagination
  },
  data() {
    const validatePermissions = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择权限'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      round: true,
      plain: true,
      search: '',
      inline: true,
      tableData: [],
      dialogVisible: false,
      editDialogVisible: false,
      labelPosition: 'right',
      roleData: {
        roleName: '',
        roleDesc: '',
        permissionIds: []
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        permissionIds: [
          { validator: validatePermissions, trigger: 'change' }
        ]
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        rolePermissions: [
          { validator: validatePermissions, trigger: 'change' }
        ]
      },
      permissions: [],
      editRole: {
        roleId: '',
        roleName: '',
        roleDesc: '',
        roleCreateTime: '',
        rolePermissions: []
      }
    }
  },
  created() {
    this.initData()
    this.initPermissionData()
  },
  methods: {
    initData() {
      getAllRoles(this.page - 1, this.limit).then(response => {
        this.tableData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    exportAll() {
      exportRoles(0, 200).then(response => {
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
    },
    handleEdit(row) {
      // 弹出修改框 并插入数据
      this.editDialogVisible = true
      this.editRole = row
    },
    handleEditCancel(formName) {
      // 取消提交修改
      // 清空修改框中数据 并置 flag 为 false
      this.editDialogVisible = false
    },
    handleEditSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交修改
          const role = this.editRole
          updateRole(role).then(response => {
            this.$notify({
              title: '成功',
              message: '修改角色成功',
              type: 'success'
            })
            this.editDialogVisible = false
            this.$refs[formName].resetFields()
            this.initData()
          }).catch(error => {
            console.log(error)
            this.editDialogVisible = false
            this.$refs[formName].resetFields()
          })
        } else {
          return false
        }
      })
    },
    handleDelete(index, row) {
      // 删除的逻辑
      const roleIds = [row.roleId]
      deleteRole(roleIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除角色' + row.roleName + '成功',
          type: 'success'
        })
        this.initData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    initPermissionData() {
      getPermissions(0, 200).then(response => {
        this.permissions = response.data.content
      }).catch(error => {
        this.$message({
          message: '加载权限失败',
          type: 'error'
        })
        console.log(error)
      })
    },
    cancelSubmit(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
      this.roleData = {
        roleName: '',
        roleDesc: '',
        permissionIds: []
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          const role = {
            roleName: this.roleData.roleName,
            roleDesc: this.roleData.roleDesc,
            permissionIds: this.roleData.permissionIds
          }
          console.log(role)
          // 发请求提交
          createRole(role.roleName, role.roleDesc, role.permissionIds).then(response => {
            this.$notify({
              title: '成功',
              message: '创建角色成功',
              type: 'success'
            })
            this.cancelSubmit(formName)
            this.initData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
