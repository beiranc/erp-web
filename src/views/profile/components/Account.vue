<template>
  <el-form ref="editInfoForm" :model="editInfo" :rules="editInfoRules" label-width="100px">
    <el-form-item label="昵称" prop="nickName" size="medium">
      <el-input v-model="editInfo.nickName" />
    </el-form-item>
    <el-form-item label="联系方式" prop="userPhone" size="medium">
      <el-input v-model="editInfo.userPhone" />
    </el-form-item>
    <el-form-item label="性别" prop="sex" size="medium">
      <el-radio-group v-model="editInfo.sex">
        <el-radio label="MALE">男</el-radio>
        <el-radio label="FEMALE">女</el-radio>
        <el-radio label="SECRET">保密</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="medium" @click="submitForm('editInfoForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { validMobile } from '@/utils/validate'
import { updateUserInfo } from '@/api/system/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          nickName: '',
          userPhone: '',
          sex: '',
          userId: ''
        }
      }
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validMobile(value) || value.trim().length === 0) {
        callback(new Error('联系方式格式不正确'))
      } else {
        callback()
      }
    }
    return {
      editInfo: {
        nickName: this.user.nickName,
        userPhone: this.user.userPhone,
        sex: ''
      },
      editInfoRules: {
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    switch (this.user.sex) {
      case '男':
        this.editInfo.sex = 'MALE'
        break
      case '女':
        this.editInfo.sex = 'FEMALE'
        break
      case '保密':
        this.editInfo.sex = 'SECRET'
        break
      default:
        this.editInfo.sex = 'MALE'
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO 提交表单
          const userInfo = {
            userId: this.user.userId,
            nickName: this.editInfo.nickName,
            userPhone: this.editInfo.userPhone,
            userSex: this.editInfo.sex
          }
          updateUserInfo(userInfo).then(res => {
            this.$message({
              type: 'success',
              message: '修改资料成功'
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
