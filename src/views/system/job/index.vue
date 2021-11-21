<template>
  <el-card shadow="always" style="margin-left: 8px;">
    <div class="filter-container">
      <el-button v-permission="['admin', 'system:job:add']" class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="createJobDialogVisible = true">
        新增岗位
      </el-button>
      <el-dialog title="新增岗位" :visible.sync="createJobDialogVisible" center @closed="handleCreateCancel('createJobForm')">
        <el-form ref="createJobForm" :rules="createJobRules" :label-position="labelPosition" label-width="80px" :model="createJob">
          <el-form-item label="岗位名" prop="jobName">
            <el-input v-model.trim="createJob.jobName" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="createJob.jobState" active-value="ACTIVE" inactive-value="DISABLED" active-text="启用" inactive-text="禁用" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="createJob.dept.deptId" v-infinite-scroll="initDeptData" infinite-scroll-disabled="deptLoadDisabled" filterable placehodlder="请选择所属" value-key="deptName" size="medium">
              <el-option v-for="dept in deptData" :key="dept.deptId" :label="dept.deptName" :value="dept.deptId" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCreateCancel('createJobForm')">取消</el-button>
          <el-button size="mini" type="primary" @click="handleCreateSubmit('createJobForm')">创建</el-button>
        </span>
      </el-dialog>
      <el-button v-permission="['admin', 'system:job:export']" class="filter-item" style="margin-left: 10px;" type="warning" size="mini" icon="el-icon-download" @click="exportAll">
        导出岗位
      </el-button>
      <el-button v-permission="['admin', 'system:job:view']" size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initJobData" />
    </div>
    <el-table v-loading="loading" :data="jobData" style="width: 100%">
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.jobCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位名" width="200">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.jobName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="200">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.jobState | state" placement="top">
            <el-switch v-model="scope.row.jobState" v-permission="['admin', 'system:job:edit']" active-value="ACTIVE" inactive-value="DISABLED" @change="handleJobStateChange(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属部门" width="200">
        <template slot-scope="scope">
          <el-tag type="danger" size="medium">{{ scope.row.jobDept.deptName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleJobEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除此岗位？" confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" @onConfirm="handleJobDelete(scope.row)">
            <el-button slot="reference" v-permission="['admin', 'system:job:del']" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-dialog title="编辑岗位" :visible.sync="editJobDialogVisible" center append-to-body @closed="handleEditCancel('editJobForm')">
        <el-form ref="editJobForm" :rules="editJobRules" :label-position="labelPosition" label-width="80px" :model="editJob" @submit.native.prevent>
          <el-form-item label="岗位名" prop="jobName">
            <el-input v-model.trim="editJob.jobName" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="editJob.jobDept" v-infinite-scroll="initDeptData" infinite-scroll-disabled="deptLoadDisabled" filterable placehodlder="请选择所属部门" value-key="deptName" size="medium">
              <el-option v-for="dept in deptData" :key="dept.deptId" :label="dept.deptName" :value="dept" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleEditCancel('editJobForm')">取消</el-button>
          <el-button v-permission="['admin', 'system:job:edit']" size="mini" type="primary" @click="handleEditSubmit('editJobForm')">修改</el-button>
        </span>
      </el-dialog>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initJobData" />
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getJobs, createJob, updateJobState, exportJobs, deleteJob, updateJob } from '@/api/system/job'
import { getAllDepts } from '@/api/system/dept'

export default {
  components: {
    Pagination
  },
  filters: {
    state(jobState) {
      return jobState === 'ACTIVE' ? '启用' : '停用'
    }
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      deptPage: 0,
      deptLoadDisabled: false,
      loading: true,
      plain: true,
      round: true,
      labelPosition: 'right',
      // 创建岗位的对话框
      createJobDialogVisible: false,
      // 修改岗位的对话框
      editJobDialogVisible: false,
      // 部门表格数据
      jobData: [],
      // 创建岗位时所需的部门数据
      deptData: [],
      // 创建岗位所需数据
      createJob: {
        jobName: '',
        jobState: 'ACTIVE',
        dept: {
          deptId: ''
        }
      },
      // 创建岗位时的表单校验规则
      createJobRules: {
        jobName: [
          { required: true, message: '请输入岗位名', trigger: 'blur' }
        ]
      },
      // 修改岗位数据
      editJob: {
        jobId: '',
        jobName: '',
        jobState: '',
        jobCreateTime: '',
        jobDept: null
      },
      // 修改部门时的表单校验规则
      editJobRules: {
        job: [
          { required: true, message: '请输入岗位名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initJobData()
  },
  methods: {
    initJobData() {
      getJobs(this.page - 1, this.limit).then(response => {
        this.jobData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    initDeptData() {
      getAllDepts(this.deptPage++, 10).then(response => {
        if (response.data.numberOfElements === 0) {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: '已加载' + response.data.totalElements + '条部门数据, ' + '没有更多的部门数据了~',
            duration: 2000
          })
          this.deptLoadDisabled = true
        }
        response.data.content.forEach(c => this.deptData.push(c))
      }).catch(error => {
        console.log(error)
      })
    },
    handleJobEdit(row) {
      this.editJobDialogVisible = true
      this.editJob = row
    },
    handleEditCancel(formName) {
      this.editJobDialogVisible = false
    },
    handleEditSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const jobData = {
            jobId: this.editJob.jobId,
            jobName: this.editJob.jobName,
            jobState: this.editJob.jobState,
            jobCreateTime: this.editJob.jobCreateTime,
            jobDept: this.editJob.jobDept
          }
          updateJob(jobData).then(response => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '修改岗位成功',
              duration: 2000
            })
            this.editJobDialogVisible = false
            this.$refs[formName].resetFields()
            this.initJobData()
          }).catch(error => {
            console.log(error)
            this.editJobDialogVisible = false
            this.$refs[formName].resetFields()
          })
        } else {
          return false
        }
      })
    },
    handleJobDelete(row) {
      const jobIds = [row.jobId]
      deleteJob(jobIds).then(res => {
        this.$notify({
          type: 'success',
          title: '成功',
          message: '删除岗位成功',
          duration: 2500
        })
        this.initJobData()
      }).catch(error => {
        console.log(error)
      })
    },
    handleJobStateChange(row) {
      const jobData = {
        jobId: row.jobId,
        jobState: row.jobState
      }
      updateJobState(jobData.jobId, jobData.jobState).then(res => {
        this.$message({
          type: 'success',
          message: '修改 "' + row.jobName + '" 岗位状态成功',
          duration: 2500
        })
      }).catch(error => {
        console.log(error)
      })
    },
    handleCreateCancel(formName) {
      this.createJobDialogVisible = false
      this.createJob = {
        jobName: '',
        jobState: 'ACTIVE',
        dept: {
          deptId: ''
        }
      }
    },
    handleCreateSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const jobData = this.createJob
          createJob(jobData).then(res => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '创建岗位成功',
              duration: 2500
            })
            this.handleCreateCancel(formName)
            this.initJobData()
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    exportAll() {
      exportJobs(0, 200).then(response => {
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
