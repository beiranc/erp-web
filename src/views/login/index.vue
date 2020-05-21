<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" label-width="0px">

      <h3 class="title">系统登录</h3>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="登录名"
          name="username"
          type="text"
          auto-complete="off"
        >
          <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="user" />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="密码"
          name="password"
          auto-complete="off"
          show-password
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="password" />
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input ref="code" v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getCodeImg } from '@/api/system/auth'

export default {
  name: 'Login',
  data() {
    // 校验规则
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value) || value.trim().length === 0) {
        callback(new Error('请输入登录名'))
      } else {
        callback()
      }
    }
    // 校验规则
    const validatePassword = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        code: '',
        codeKey: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'change', validator: validateCode }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = res.url
        this.loginForm.codeKey = res.data
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          code: this.loginForm.code,
          codeKey: this.loginForm.codeKey
        }
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', user).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.getCode()
            this.loginForm.code = ''
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    // 每日必应图片
    background-image:url(https://api.isoyu.com/bing_images.php);
    background-size: cover;
  }
  .title {
    margin: 0 auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon{
      height: 39px;width: 14px;margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    // float: right;
    img{
      cursor: pointer;
      vertical-align:middle
    }
  }
</style>
