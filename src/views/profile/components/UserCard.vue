<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'+'?imageView2/1/w/80/h/80'" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>欢迎您</div>
          {{ user.nickName }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.username | uppercaseFirst }}</div>
      </div>
      <ul class="user-info">
        <li><div style="height: 100%"><svg-icon icon-class="userInfo" /> 登录账号<div class="user-right">{{ user.username }}</div></div></li>
        <li><svg-icon icon-class="nickName" /> 用户昵称 <div class="user-right">{{ user.nickName }}</div></li>
        <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.userPhone }}</div></li>
        <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.userEmail }}</div></li>
        <li><svg-icon icon-class="state" /> 用户状态 <div class="user-right">{{ user.state }}</div></li>
        <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ user.dept }} / {{ user.job }}</div></li>
        <li>
          <svg-icon icon-class="security" /> 安全设置
          <div class="user-right">
            <a @click.stop.prevent="editPasswordDialogVisible = true">修改密码</a>
            <a @click.stop.prevent="editEmailDialogVisible = true">修改邮箱</a>
          </div>
        </li>
        <el-dialog title="修改密码" :visible.sync="editPasswordDialogVisible" center append-to-body @closed="handlePasswordCancel('passwordForm')">
          <el-form ref="passwordForm" :rules="editPasswordRules" :label-position="labelPosition" label-width="80px" :model="editPassword">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model.trim="editPassword.oldPassword" show-password size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model.trim="editPassword.newPassword" show-password size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input v-model.trim="editPassword.checkPassword" show-password size="medium" auto-complete="off" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handlePasswordCancel('passwordForm')">取消</el-button>
            <el-button size="mini" type="primary" @click="handlePasswordSubmit('passwordForm')">修改</el-button>
          </span>
        </el-dialog>
        <el-dialog title="修改邮箱" :visible.sync="editEmailDialogVisible" center append-to-body @closed="handleEmailCancel('emailForm')">
          <el-form ref="emailForm" :rules="editEmailRules" :label-position="labelPosition" label-width="80px" :model="editEmail" @submit.native.prevent>
            <el-form-item label="新邮箱" prop="email">
              <el-input v-model.trim="editEmail.email" type="email" size="medium" auto-complete="off" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleEmailCancel('emailForm')">取消</el-button>
            <el-button size="mini" type="primary" @click="handleEmailSubmit('emailForm')">修改</el-button>
          </span>
        </el-dialog>
      </ul>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { validEmail } from '@/utils/validate'
import { updatePassword, updateEmail } from '@/api/system/user'

export default {
  components: { PanThumb },
  filters: {
    uppercaseFirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          nickName: '',
          userPhone: '',
          userEmail: '',
          state: '',
          dept: '',
          job: ''
        }
      }
    }
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.editPassword.checkPassword !== '') {
          this.$refs.passwordForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editPassword.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      editPasswordDialogVisible: false,
      editEmailDialogVisible: false,
      labelPosition: 'right',
      editPassword: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      editEmail: {
        email: ''
      },
      editPasswordRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validateCheckPassword, trigger: 'blur' }
        ]
      },
      editEmailRules: {
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handlePasswordCancel(formName) {
      // 修改密码表单取消提交
      this.editPasswordDialogVisible = false
      this.$refs[formName].resetFields()
    },
    handlePasswordSubmit(formName) {
      // 提交修改密码表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editPasswordDialogVisible = false
          const data = {
            userName: this.user.username,
            oldPassword: this.editPassword.oldPassword,
            newPassword: this.editPassword.newPassword
          }
          updatePassword(data.userName, data.oldPassword, data.newPassword).then(res => {
            this.$message({
              type: 'success',
              message: '修改密码成功',
              duration: 2000
            })
            this.$refs[formName].resetFields()
            // 重新登录
            this.$store.dispatch('user/logout').then(() => {
              location.reload()
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handleEmailCancel(formName) {
      // 修改邮箱表单取消提交
      this.editEmailDialogVisible = false
      this.$refs[formName].resetFields()
    },
    handleEmailSubmit(formName) {
      // 提交修改邮箱表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editEmailDialogVisible = false
          const data = {
            userName: this.user.username,
            email: this.editEmail.email
          }
          updateEmail(data.userName, data.email).then(res => {
            this.$message({
              type: 'success',
              message: '修改邮箱成功',
              duration: 2000
            })
            this.$store.dispatch('user/getInfo').then(() => {})
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;

      a{
        color: #317EF3;
      }
    }
  }
</style>
