<template>
  <el-card shadow="always" style="margin-left: 8px;">
    <div class="filter-container">
      <el-button v-permission="['admin', 'system:user:add']" class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="createDialogVisible = true">
        创建用户
      </el-button>
      <el-dialog title="创建用户" :visible.sync="createDialogVisible" center append-to-body @closed="handleCreateCancel('createForm')">
        <el-form ref="createForm" :rules="createUserRules" :label-position="labelPosition" label-width="120px" :model="createUser">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model.trim="createUser.userName" placeholder="请输入用户名" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户密码" prop="userPassword">
            <el-input v-model.trim="createUser.userPassword" placeholder="请输入用户密码" size="medium" auto-complete="off" show-password />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model.trim="createUser.nickName" placeholder="请输入用户昵称" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户状态" prop="userState">
            <el-switch v-model="createUser.userState" active-value="ACTIVE" inactive-value="DISABLED" active-text="启用" inactive-text="禁用" />
          </el-form-item>
          <el-form-item label="用户性别" prop="userSex">
            <el-radio-group v-model="createUser.userSex">
              <el-radio label="MALE">男</el-radio>
              <el-radio label="FEMALE">女</el-radio>
              <el-radio label="SECRET">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户联系方式" prop="userPhone">
            <el-input v-model.trim="createUser.userPhone" placeholder="请输入用户联系方式" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户邮箱" prop="userEmail">
            <el-input v-model.trim="createUser.userEmail" placeholder="请输入用户邮箱" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户岗位" prop="job">
            <el-select v-model="createUser.job" size="mini" filterable placeholder="请选择用户岗位">
              <el-option v-for="job in jobData" :key="job.jobId" :label="job.jobName" :value="job.jobId" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户角色" prop="roles">
            <el-select v-model="createUser.roles" size="mini" multiple filterable placeholder="请选择用户角色">
              <el-option v-for="role in roleData" :key="role.roleId" :label="role.roleDesc" :value="role.roleId" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCreateCancel('createForm')">取消</el-button>
          <el-button v-permission="['admin', 'system:user:add']" size="mini" type="primary" @click="handleCreateSubmit('createForm')">创建</el-button>
        </span>
      </el-dialog>
      <el-button v-permission="['admin', 'system:user:export']" class="filter-item" style="margin-left: 10px;" type="warning" size="mini" icon="el-icon-download" @click="exportAll">
        导出用户
      </el-button>
      <el-button v-permission="['admin', 'system:user:view']" size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initUserData" />
    </div>
    <el-table v-loading="loading" :data="userData" style="width: 100%">
      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.userCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.userName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户昵称" prop="nickName" width="180" />
      <el-table-column align="center" label="状态" width="180">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.userState | state" placement="top">
            <el-switch v-model="scope.row.userState" v-permission="['admin', 'system:user:edit']" :disabled="scope.row.userName === user.username" active-value="ACTIVE" inactive-value="DISABLED" @change="handleUserStateChange(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式" prop="userPhone" width="180" />
      <el-table-column align="center" label="性别" width="180">
        <template slot-scope="scope">
          {{ scope.row.userSex | sex }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" prop="userEmail" width="180" />
      <el-table-column align="center" label="岗位" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top-start">
            <p>部门: {{ scope.row.userJob.jobDept.deptName }}</p>
            <p>岗位: {{ scope.row.userJob.jobName }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.userJob.jobName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-permission="['admin', 'system:user:edit']" :disabled="scope.row.userName === user.username" size="mini" type="primary" @click="handleUserEdit(scope.row)">编辑</el-button>
          <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认重置此用户的密码？" @onConfirm="handleUserReset(scope.row)">
            <el-button slot="reference" v-permission="['admin', 'system:user:edit']" :disabled="scope.row.userName === user.username" size="mini" type="warning">重置密码</el-button>
          </el-popconfirm>
          <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此用户？" @onConfirm="handleUserDelete(scope.row)">
            <el-button slot="reference" v-permission="['admin', 'system:user:del']" :disabled="scope.row.userName === user.username" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" center append-to-body @closed="handleEditCancel('editForm')">
        <el-form ref="editForm" :rules="editUserRules" :label-position="labelPosition" label-width="120px" :model="editUser">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model.trim="editUser.userName" disabled size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户密码" prop="userPassword">
            <el-input v-model.trim="editUser.userPassword" disabled size="medium" auto-complete="off" show-password />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model.trim="editUser.nickName" placeholder="请输入用户昵称" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户性别" prop="userSex">
            <el-radio-group v-model="editUser.userSex">
              <el-radio label="MALE">男</el-radio>
              <el-radio label="FEMALE">女</el-radio>
              <el-radio label="SECRET">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户联系方式" prop="userPhone">
            <el-input v-model.trim="editUser.userPhone" placeholder="请输入用户联系方式" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户邮箱" prop="userEmail">
            <el-input v-model.trim="editUser.userEmail" placeholder="请输入用户邮箱" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户岗位" prop="userJob">
            <el-select v-model="editUser.userJob" value-key="jobId" size="mini" filterable placeholder="请选择用户岗位">
              <el-option v-for="job in jobData" :key="job.jobId" :label="job.jobName" :value="job" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户角色" prop="userRoles">
            <el-select v-model="editUser.userRoles" value-key="roleId" size="mini" multiple filterable placeholder="请选择用户角色">
              <el-option v-for="role in roleData" :key="role.roleId" :label="role.roleDesc" :value="role" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleEditCancel('editForm')">取消</el-button>
          <el-button v-permission="['admin', 'system:user:edit']" size="mini" type="primary" @click="handleEditSubmit('editForm')">修改</el-button>
        </span>
      </el-dialog>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initUserData" />
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getUsers, deleteUser, exportUsers, createUser, resetPassword, updateUserState, updateUser } from '@/api/system/user'
import { getJobs } from '@/api/system/job'
import { getAllRoles } from '@/api/system/role'
import { validMobile, validEmail } from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination
  },
  filters: {
    state(userState) {
      return userState === 'ACTIVE' ? '启用' : '停用'
    },
    sex(userSex) {
      switch (userSex) {
        case 'MALE': return '男'
        case 'FEMALE': return '女'
        case 'SECRET': return '保密'
        default: '未知'
      }
    }
  },
  data() {
    // 验证联系方式
    const validatePhone = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('用户联系方式格式不正确'))
      } else {
        callback()
      }
    }
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('用户邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: true,
      plain: true,
      round: true,
      createDialogVisible: false,
      editDialogVisible: false,
      labelPosition: 'right',
      // 显示所有用户时需要的数据
      userData: [],
      // 创建用户表单
      createUser: {
        userName: '',
        userPassword: '',
        nickName: '',
        userSex: 'MALE',
        userState: 'ACTIVE',
        userPhone: '',
        userEmail: '',
        job: '',
        roles: []
      },
      // 编辑用户表单
      editUser: {
        userId: '',
        userName: '',
        userPassword: '',
        nickName: '',
        userAvatar: '',
        userCreateTime: '',
        userEmail: '',
        userJob: null,
        userRoles: [],
        userSex: '',
        userState: ''
      },
      // 创建用户表单校验规则
      createUserRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 20, message: '用户名长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ],
        userSex: [
          { required: true, message: '请选择用户性别', trigger: 'change' }
        ],
        userState: [
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ],
        userPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        userEmail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        job: [
          { required: true, message: '请选择用户岗位', trigger: 'change' }
        ],
        roles: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      },
      // 编辑用户表单校验规则
      editUserRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 20, message: '用户名长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 255, message: '密码长度在 6 到 255 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ],
        userSex: [
          { required: true, message: '请选择用户性别', trigger: 'change' }
        ],
        userState: [
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ],
        userPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        userEmail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        userJob: [
          { required: true, message: '请选择用户岗位', trigger: 'change' }
        ],
        userRoles: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      },
      // 岗位数据
      jobData: [],
      // 角色数据
      roleData: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.initUserData()
    this.initJobData()
    this.initRoleData()
  },
  methods: {
    // 获取所有用户数据
    initUserData() {
      getUsers(this.page - 1, this.limit).then(response => {
        this.userData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    initJobData() {
      getJobs(0, 400).then(response => {
        this.jobData = response.data.content
      }).catch(error => {
        console.log(error)
      })
    },
    initRoleData() {
      getAllRoles(0, 400).then(response => {
        this.roleData = response.data.content
      }).catch(error => {
        console.log(error)
      })
    },
    handleCreateCancel(formName) {
      // 取消提交创建用户表单
      this.createDialogVisible = false
      this.$refs[formName].resetFields()
      this.createUser = {
        userName: '',
        userPassword: '',
        nickName: '',
        userSex: 'MALE',
        userState: 'ACTIVE',
        userPhone: '',
        userEmail: '',
        job: '',
        roles: []
      }
    },
    handleCreateSubmit(formName) {
      // 确认提交创建用户表单
      console.log(this.createUser)
      this.$refs[formName].validate(valid => {
        if (valid) {
          const user = this.createUser
          createUser(user).then(res => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '创建用户成功',
              duration: 2500
            })
            this.createDialogVisible = false
            this.$refs[formName].resetFields()
            this.initUserData()
          }).catch(err => {
            console.log(err)
            this.createDialogVisible = false
          })
        } else {
          return false
        }
      })
    },
    handleUserStateChange(row) {
      // 用户状态改变时
      const userInfo = row
      console.log(userInfo)
      updateUserState(userInfo.userId, userInfo.userState).then(res => {
        this.$message({
          type: 'success',
          message: '修改用户状态成功',
          duration: 2000
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleUserEdit(row) {
      // 编辑的逻辑
      console.log(row)
      this.editDialogVisible = true
      this.editUser = row
    },
    handleEditCancel(formName) {
      // 编辑用户表单取消提交
      this.editDialogVisible = false
    },
    handleEditSubmit(formName) {
      // 编辑用户表单提交逻辑
      this.$refs[formName].validate(valid => {
        if (valid) {
          const userInfo = this.editUser
          updateUser(userInfo).then(res => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '修改用户成功',
              duration: 2500
            })
            this.editDialogVisible = false
            this.$refs[formName].resetFields()
            this.initUserData()
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handleUserReset(row) {
      // 重置用户密码的逻辑
      const userInfo = row
      resetPassword(userInfo.userName).then(res => {
        this.$message({
          type: 'success',
          message: '重置用户密码成功',
          duration: 2000
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleUserDelete(row) {
      // 删除的逻辑
      console.log(row)
      const userIds = [row.userId]
      deleteUser(userIds).then(response => {
        this.$notify({
          type: 'success',
          title: '成功',
          message: '删除用户成功'
        })
        this.initUserData()
      }).catch(error => {
        console.log(error)
      })
    },
    exportAll() {
      exportUsers(0, 200).then(response => {
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
