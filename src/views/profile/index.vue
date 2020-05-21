<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="8" :xs="24" :sm="9" :md="8" :lg="8" :xl="8">
          <!-- 用户资料 -->
          <user-card :user="user" />
        </el-col>

        <el-col :span="16" :xs="24" :sm="15" :md="16" :lg="16" :xl="16">
          <el-card>
            <el-tabs v-model="activeTab">
              <!-- 修改用户资料页 -->
              <el-tab-pane label="用户资料" name="account">
                <account :user="user" />
              </el-tab-pane>
              <!-- 用户操作日志页 -->
              <el-tab-pane label="操作日志" name="log">
                <log :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import Log from './components/Log'

export default {
  name: 'Profile',
  components: { UserCard, Account, Log },
  data() {
    return {
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
}
</script>
