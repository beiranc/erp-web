<template>
  <div class="dashboard-container">
    <div class="user-images">
      <el-carousel :interval="6000" type="card" height="220px">
        <el-carousel-item v-for="item in carouselImages" :key="item">
          <img :src="item + carouselPrefix" class="image">
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- <div class="dashboard-text">name: {{ user.username }}</div>
    <div class="dashboard-text">
      roles:
      <div v-for="role in roles" :key="role">
        {{ role }}
      </div>
    </div> -->
    <el-divider />
    <el-row :gutter="24">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        <el-card>
          <todo-list />
        </el-card>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        <el-card>
          <el-calendar>
            <template slot="dateCell" slot-scope="{date, data}">
              <p :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : '' }}
              </p>
            </template>
          </el-calendar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TodoList from './TodoList/index'

const carouselPrefix = '?imageView2/2/h/440'

export default {
  name: 'Dashboard',
  components: {
    TodoList
  },
  data() {
    return {
      carouselPrefix,
      carouselImages: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.is-selected {
  color: #1989FA
}
</style>
