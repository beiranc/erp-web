<template>
  <el-row :gutter="24" style="left: 8px;">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="salesmanDialogVisible = true">
          创建业务员
        </el-button>&nbsp;
        <el-dialog title="新增业务员" :visible.sync="salesmanDialogVisible" center @closed="salesmanDialogVisible = false">
          <el-form ref="salesmanForm" :rules="salesmanRules" :label-position="labelPosition" label-width="120px" :model="salesman">
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="salesman.name" size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="电话" prop="tel">
              <el-input v-model.trim="salesman.tel" size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="传真" prop="fax">
              <el-input v-model.trim="salesman.fax" size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model.trim="salesman.email" size="medium" auto-complete="off" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleSalesmanFormCancel('salesmanForm')">取消</el-button>
            <el-button size="mini" type="primary" @click="handleSalesmanFormSubmit('salesmanForm')">创建</el-button>
          </span>
        </el-dialog>
        <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initSalesmanData" />
        <el-table v-loading="loading" :data="salesmanData" style="width: 100%">
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="电话" prop="tel" />
          <el-table-column align="center" label="传真" prop="fax" />
          <el-table-column align="center" label="邮箱" prop="email" />
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.salesmanCreateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleSalesmanEdit(scope.row)">编辑</el-button>&nbsp;
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此业务员？" @onConfirm="handleSalesmanDelete(scope.row)">
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-dialog title="编辑业务员" :visible.sync="salesmanEditDialogVisible" center append-to-body @closed="salesmanEditDialogVisible = false">
            <el-form ref="editForm" :rules="salesmanRules" :label-position="labelPosition" label-width="120px" :model="editSalesman">
              <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="editSalesman.name" size="medium" auto-complete="off" />
              </el-form-item>
              <el-form-item label="电话" prop="tel">
                <el-input v-model.trim="editSalesman.tel" size="medium" auto-complete="off" />
              </el-form-item>
              <el-form-item label="传真" prop="fax">
                <el-input v-model.trim="editSalesman.fax" size="medium" auto-complete="off" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="editSalesman.email" size="medium" auto-complete="off" />
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="salesmanEditDialogVisible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="handleSalesmanEditSubmit('editForm')">修改</el-button>
            </span>
          </el-dialog>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initSalesmanData" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import Pagination from '@/components/Pagination'
import { validEmail } from '@/utils/validate'
import { getSalesmanList, createSalesman, updateSalesman, deleteSalesman } from '@/api/quotation/salesman'

export default {
  components: {
    Pagination
  },
  data() {
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback('业务员邮箱格式不正确')
      } else {
        callback()
      }
    }
    return {
      round: true,
      plain: true,
      loading: true,
      salesmanDialogVisible: false,
      salesmanEditDialogVisible: false,
      labelPosition: 'right',
      page: 1,
      limit: 10,
      total: 0,
      salesmanData: [],
      salesman: {
        name: '',
        tel: '',
        fax: '',
        email: ''
      },
      editSalesman: {
        salesmanId: '',
        name: '',
        tel: '',
        fax: '',
        email: '',
        salesmanCreateTime: ''
      },
      salesmanRules: {
        name: [
          { required: true, message: '请输入业务员姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        fax: [
          { required: true, message: '请输入传真', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initSalesmanData()
  },
  methods: {
    initSalesmanData() {
      // 初始化业务员数据
      this.loading = true
      getSalesmanList(this.page - 1, this.limit).then(response => {
        this.salesmanData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handleSalesmanFormSubmit(formName) {
      // 业务员创建表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.salesmanDialogVisible = false
          const salesmanSubmit = this.salesman
          // 发请求提交
          createSalesman(salesmanSubmit).then(response => {
            this.$notify({
              title: '成功',
              message: '创建业务员成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initSalesmanData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleSalesmanFormCancel(formName) {
      // 业务员创建表单取消提交
      this.salesmanDialogVisible = false
      this.$refs[formName].resetFields()
    },
    handleSalesmanEdit(row) {
      this.editSalesman = row
      this.salesmanEditDialogVisible = true
    },
    handleSalesmanEditSubmit(formName) {
      // 业务员修改表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.salesmanEditDialogVisible = false
          const editSalesmanData = this.editSalesman
          // 发请求提交
          updateSalesman(editSalesmanData).then(response => {
            this.$notify({
              title: '成功',
              message: '修改业务员成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initSalesmanData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleSalesmanDelete(row) {
      const salesmanIds = [row.salesmanId]
      deleteSalesman(salesmanIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除业务员成功',
          type: 'success'
        })
        this.initSalesmanData()
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
