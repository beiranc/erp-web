<template>
  <el-row :gutter="24">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="customerDialogVisible = true">
          创建客户
        </el-button>
        <el-dialog title="新增客户" :visible.sync="customerDialogVisible" center @closed="customerDialogVisible = false">
          <el-form ref="customerForm" :rules="customerRules" :label-position="labelPosition" label-width="120px" :model="customer">
            <el-form-item label="客户名" prop="customerName">
              <el-input v-model.trim="customer.customerName" size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="客户地址" prop="customerAddress">
              <el-input v-model.trim="customer.customerAddress" size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="客户邮箱" prop="customerEmail">
              <el-input v-model.trim="customer.customerEmail" size="medium" auto-complete="off" />
            </el-form-item>
            <el-form-item label="客户联系方式" prop="customerPhone">
              <el-input v-model.trim="customer.customerPhone" size="medium" auto-complete="off" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleCustomerFormCancel('customerForm')">取消</el-button>
            <el-button size="mini" type="primary" @click="handleCustomerFormSubmit('customerForm')">创建</el-button>
          </span>
        </el-dialog>
        <el-button type="warning" size="mini" icon="el-icon-download" @click="exportCustomers">
          导出客户
        </el-button>
        <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initCustomerData" />
        <el-table v-loading="loading" :data="customerData" style="width: 100%">
          <el-table-column align="center" label="客户名" width="200">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.customerName }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户地址" prop="customerAddress" width="200" />
          <el-table-column align="center" label="客户联系方式" prop="customerPhone" width="200" />
          <el-table-column align="center" label="客户邮箱" prop="customerEmail" width="200" />
          <el-table-column align="center" label="创建时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.customerCreateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleCustomerEdit(scope.row)">编辑</el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此客户？" @onConfirm="handleCustomerDelete(scope.row)">
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-dialog title="编辑客户" :visible.sync="customerEditDialogVisible" center append-to-body @closed="customerEditDialogVisible = false">
            <el-form ref="editForm" :rules="customerRules" :label-position="labelPosition" label-width="120px" :model="editCustomer">
              <el-form-item label="客户名" prop="customerName">
                <el-input v-model.trim="editCustomer.customerName" size="medium" auto-complete="off" />
              </el-form-item>
              <el-form-item label="客户地址" prop="customerAddress">
                <el-input v-model.trim="editCustomer.customerAddress" size="medium" auto-complete="off" />
              </el-form-item>
              <el-form-item label="客户邮箱" prop="customerEmail">
                <el-input v-model.trim="editCustomer.customerEmail" size="medium" auto-complete="off" />
              </el-form-item>
              <el-form-item label="客户联系方式" prop="customerPhone">
                <el-input v-model.trim="editCustomer.customerPhone" size="medium" auto-complete="off" />
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="customerEditDialogVisible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="handleCustomerEditSubmit('editForm')">修改</el-button>
            </span>
          </el-dialog>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initCustomerData" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import Pagination from '@/components/Pagination'
import { validMobile, validEmail } from '@/utils/validate'
import { getCustomers, exportCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/api/sale/customer'

export default {
  components: {
    Pagination
  },
  data() {
    // 验证手机号
    const validatePhone = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback('客户联系方式格式不正确')
      } else {
        callback()
      }
    }
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback('客户邮箱格式不正确')
      } else {
        callback()
      }
    }
    return {
      round: true,
      plain: true,
      loading: true,
      customerDialogVisible: false,
      customerEditDialogVisible: false,
      labelPosition: 'right',
      page: 1,
      limit: 10,
      total: 0,
      customerData: [],
      customer: {
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: ''
      },
      editCustomer: {
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',
        customerCreateTime: ''
      },
      customerRules: {
        customerName: [
          { required: true, message: '请输入客户名', trigger: 'blur' }
        ],
        customerPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        customerEmail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        customerAddress: [
          { required: true, message: '请输入客户地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initCustomerData()
  },
  methods: {
    initCustomerData() {
      // 初始化客户数据
      this.loading = true
      getCustomers(this.page - 1, this.limit).then(response => {
        this.customerData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handleCustomerFormSubmit(formName) {
      // 客户创建表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.customerDialogVisible = false
          const customerSubmit = this.customer
          // 发请求提交
          createCustomer(customerSubmit).then(response => {
            this.$notify({
              title: '成功',
              message: '创建客户成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initCustomerData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleCustomerFormCancel(formName) {
      // 客户创建表单取消提交
      this.customerDialogVisible = false
      this.$refs[formName].resetFields()
    },
    handleCustomerEdit(row) {
      this.editCustomer = row
      this.customerEditDialogVisible = true
    },
    handleCustomerEditSubmit(formName) {
      // 客户修改表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.customerEditDialogVisible = false
          const editCustomerData = this.editCustomer
          // 发请求提交
          updateCustomer(editCustomerData).then(response => {
            this.$notify({
              title: '成功',
              message: '修改客户成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initCustomerData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleCustomerDelete(row) {
      const customerIds = [row.customerId]
      deleteCustomer(customerIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除客户成功',
          type: 'success'
        })
        this.initCustomerData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    exportCustomers() {
      exportCustomers(0, 200).then(response => {
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
