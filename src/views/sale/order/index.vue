<template>
  <el-card shadow="always" style="margin-left: 8px;">
    <div class="filter-container">
      <el-button v-permission="['seller', 'sale:add']" class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="createDialogVisible = true">
        创建销售订单
      </el-button>
      <el-dialog title="创建销售订单" :visible.sync="createDialogVisible" center>
        <el-form ref="createForm" :rules="createSaleRules" :label-position="labelPosition" label-width="120px" :model="createSale">
          <el-form-item label="销售订单主题" prop="saleSubject">
            <el-input v-model.trim="createSale.saleSubject" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="客户名" prop="customerName">
            <el-input v-model.trim="createSale.customerName" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="客户地址" prop="customerAddress">
            <el-input v-model.trim="createSale.customerAddress" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="客户联系方式" prop="customerPhone">
            <el-input v-model.trim="createSale.customerPhone" size="medium" auto-complete="off" />
          </el-form-item>
          <el-form-item label="客户邮箱" prop="customerEmail">
            <el-input v-model.trim="createSale.customerEmail" size="medium" auto-complete="off" />
          </el-form-item>
        </el-form>
        <el-button style="width: 100%" size="medium" type="primary" @click="saleInnerDialog = true">添加销售订单子项</el-button>
        <el-dialog title="添加销售订单子项" :visible.sync="saleInnerDialog" append-to-body center>
          <el-form ref="addSubForm" label-width="100px" :model="createSaleDetail" :rules="createSaleDetailRules">
            <el-form-item label="产品" prop="saleProduct">
              <el-select v-model="createSaleDetail.saleProduct" value-key="productId" placeholder="请选择所销售的产品">
                <el-option v-for="productTmp in productData" :key="productTmp.productId" :label="productTmp.productName" :value="productTmp" />
              </el-select>
            </el-form-item>
            <el-form-item label="销售数量" prop="saleNumber">
              <el-input-number v-model="createSaleDetail.saleNumber" :step="2" size="small" :min="1" controls-position="right" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="saleInnerDialog = false">取消</el-button>
            <el-button size="mini" type="primary" @click="saleInnerDialog = false">添加</el-button>
          </div>
        </el-dialog>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCreateCancel('createForm')">取消</el-button>
          <el-button v-permission="['seller', 'sale:add']" size="mini" type="primary" @click="handleCreateSubmit('createForm')">创建</el-button>
        </span>
      </el-dialog>
      <el-button v-permission="['seller', 'sale:view']" size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initSaleData" />
      <el-table :data="saleData" style="width: 100%">
        <el-table-column label="销售订单主题" align="center" width="200">
          <template slot-scope="scope">
            <el-tag type="primary" size="medium">{{ scope.row.saleSubject }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            {{ scope.row.saleCreateTime }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" width="200" prop="applicant.userName" />
        <el-table-column label="销售订单状态" align="center" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.saleState === 'CREATED'" type="success">{{ scope.row.saleState | state }}</el-tag>
            <el-tag v-else-if="scope.row.saleState === 'PAYING'" type="warning">{{ scope.row.saleState | state }}</el-tag>
            <el-tag v-else-if="scope.row.saleState === 'COMPLETED'" type="info">{{ scope.row.saleState | state }}</el-tag>
            <el-tag v-else type="danger">{{ scope.row.saleState | state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上一次修改时间" align="center" width="250">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            {{ scope.row.lastModifiedTime }}
          </template>
        </el-table-column>
        <el-table-column label="上一次修改操作者" align="center" width="250">
          <template slot-scope="scope">
            {{ scope.row.operator.userName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="test(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>

import { getSalesByName } from '@/api/sale/order'
import { getProducts } from '@/api/product/index'
import { mapGetters } from 'vuex'
import { validMobile, validEmail } from '@/utils/validate'

export default {
  filters: {
    state(saleState) {
      switch (saleState) {
        case 'CREATED':
          return '已创建'
        case 'PAYING':
          return '结算中'
        case 'COMPLETED':
          return '已完成'
        case 'CANCELED':
          return '已取消'
        default:
          return '未知'
      }
    }
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
      loading: true,
      round: true,
      plain: true,
      createDialogVisible: false,
      saleInnerDialog: false,
      saleData: [],
      productData: [],
      labelPosition: 'right',
      // 创建销售订单所需字段
      createSale: {
        saleSubject: '',
        saleState: 'CREATED',
        salePayWay: '',
        totalAmount: 0,
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',
        saleDetails: []
      },
      createSaleDetail: {
        saleMoney: 0,
        saleNumber: 0,
        saleProduct: null
      },
      createSaleRules: {
        saleSubject: [
          { required: true, message: '请输入销售订单主题', trigger: 'blur' }
        ],
        salePayWay: [
          { required: true, message: '请选择一种结算方式', trigger: 'change' }
        ],
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        customerAddress: [
          { required: true, message: '请输入客户地址', trigger: 'blur' }
        ],
        customerPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        customerEmail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      },
      createSaleDetailRules: {
        saleNumber: [
          { required: true, message: '请输入销售数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '销售数量必须是一个大于0的数' }
        ],
        saleProduct: [
          { required: true, message: '请选择所销售的商品', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.initSaleData()
    this.initProductData()
  },
  methods: {
    initSaleData() {
      const userName = this.user.username
      getSalesByName(userName, 0, 1000).then(response => {
        this.saleData = response.data
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    initProductData() {
      // 获取产品信息
      getProducts(0, 1000).then(res => {
        this.productData = res.data.content
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err.message || '获取产品信息失败'
        })
      })
    },
    handleCreateSubmit(formName) {
      // 提交创建销售订单表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createDialogVisible = false
        } else {
          return false
        }
      })
    },
    handleCreateCancel(formName) {
      this.createDialogVisible = false
      this.$refs[formName].resetFields()
    },
    test(row) {}
  }
}
</script>
