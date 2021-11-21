<template>
  <el-row :gutter="24" style="left: 8px;">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="quotationDialogVisible = true">
          创建报价单
        </el-button>&nbsp;
        <el-dialog title="新增报价单" width="800px" :visible.sync="quotationDialogVisible" center @closed="quotationDialogVisible = false">
          <el-form ref="quotationForm" size="mini" :rules="quotationRules" :label-position="labelPosition" label-width="120px" :model="quotation">
            <el-divider content-position="center">报价单基础信息</el-divider>
            <el-form-item label="公司中文名" prop="chineseName">
              <el-input v-model.trim="quotation.chineseName" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="公司英文名" prop="englishName">
              <el-input v-model.trim="quotation.englishName" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model.trim="quotation.address" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="公司官网" prop="officialWebsite">
              <el-input v-model.trim="quotation.officialWebsite" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="业务员" prop="salesmanId">
              <el-select v-model="quotation.salesmanId" placeholder="请选择业务员" size="mini" auto-complete="off">
                <el-option v-for="salesman in salesmanData" :key="salesman.salesmanId" :label="salesman.name" :value="salesman.salesmanId" />
              </el-select>
            </el-form-item>
            <el-divider content-position="center">报价单货物信息</el-divider>
            <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="basicInfoSelectDialogVisible = true">
              添加基本信息
            </el-button>&nbsp;
            <!-- 已选择的货物基本信息 -->
            <el-table :data="selectedBasicInfo" style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-divider content-position="left">基本信息</el-divider>
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="前叉">
                      <span>{{ scope.row.frontFork }}</span>
                    </el-form-item>
                    <el-form-item label="显示器">
                      <span>{{ scope.row.display | displayFilter }}</span>
                    </el-form-item>
                    <el-form-item label="油门转把">
                      <span>{{ scope.row.throttle | throttleFilter }}</span>
                    </el-form-item>
                    <el-form-item label="变速器">
                      <span>{{ scope.row.derailleur }}</span>
                    </el-form-item>
                    <el-form-item label="功率">
                      <span>{{ scope.row.power }}</span>
                    </el-form-item>
                    <el-form-item label="电压">
                      <span>{{ scope.row.voltage }}</span>
                    </el-form-item>
                    <el-form-item label="轮胎尺寸">
                      <span>{{ scope.row.wheelSize }}</span>
                    </el-form-item>
                    <el-form-item label="车架材质">
                      <span>{{ scope.row.frame }}</span>
                    </el-form-item>
                    <el-form-item label="最大速度">
                      <span>{{ scope.row.maxSpeed + 'KM/h' }}</span>
                    </el-form-item>
                    <el-form-item label="单次充电里程">
                      <span>{{ scope.row.mileagePerCharge + 'KM' }}</span>
                    </el-form-item>
                    <el-form-item label="电池容量">
                      <span>{{ scope.row.batteryCapacity + 'AH' }}</span>
                    </el-form-item>
                    <el-form-item label="制动系统/刹车">
                      <span>{{ scope.row.brakeSystem | brakeSystemFilter }}</span>
                    </el-form-item>
                    <el-form-item label="起订量">
                      <span>{{ scope.row.moq }}</span>
                    </el-form-item>
                    <el-form-item label="单价">
                      <span>{{ scope.row.fobPrice }}</span>
                    </el-form-item>
                  </el-form>
                  <el-divider content-position="left">物流信息</el-divider>
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="纸箱尺寸">
                      <span>{{ scope.row.cartonSize + 'CM' }}</span>
                    </el-form-item>
                    <el-form-item label="海关编码">
                      <span>{{ scope.row.hsCode }}</span>
                    </el-form-item>
                  </el-form>
                  <el-divider content-position="left">定制信息</el-divider>
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="是否支持 LOGO 定制">
                      <span>{{ scope.row.logo ? '是' : '否' }}</span>
                    </el-form-item>
                    <el-form-item label="是否支持外包装定制">
                      <span>{{ scope.row.outerPacking ? '是' : '否' }}</span>
                    </el-form-item>
                    <el-form-item label="是否支持图案定制">
                      <span>{{ scope.row.design ? '是' : '否' }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column align="center" label="主图">
                <template slot-scope="scope">
                  <!-- 悬浮放大 -->
                  <el-popover placement="top-start" trigger="hover">
                    <el-image slot="reference" style="width: 50px; height: 50px" :src="scope.row.url" fit="fill" />
                    <el-image :src="scope.row.url" fit="fill" />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column align="center" label="型号">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.model }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                  <i class="el-icon-time" />
                  <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <el-button size="mini" type="primary" @click.prevent>移除</el-button>
              </el-table-column>
            </el-table>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleQuotationFormCancel('quotationForm')">取消</el-button>
            <el-button size="mini" type="primary" @click="handleQuotationFormSubmit('quotationForm')">创建</el-button>
          </span>
        </el-dialog>

        <el-dialog title="选择基本信息" width="1000px" :visible.sync="basicInfoSelectDialogVisible" center @closed="basicInfoSelectDialogVisible = false">
          <!-- 待选择的货物基本信息 -->
          <el-table v-loading="quotationSearchCondition.conditionLoading" :data="basicInfoData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-divider content-position="left">基本信息</el-divider>
                <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="前叉">
                    <span>{{ scope.row.frontFork }}</span>
                  </el-form-item>
                  <el-form-item label="显示器">
                    <span>{{ scope.row.display | displayFilter }}</span>
                  </el-form-item>
                  <el-form-item label="油门转把">
                    <span>{{ scope.row.throttle | throttleFilter }}</span>
                  </el-form-item>
                  <el-form-item label="变速器">
                    <span>{{ scope.row.derailleur }}</span>
                  </el-form-item>
                  <el-form-item label="功率">
                    <span>{{ scope.row.power }}</span>
                  </el-form-item>
                  <el-form-item label="电压">
                    <span>{{ scope.row.voltage }}</span>
                  </el-form-item>
                  <el-form-item label="轮胎尺寸">
                    <span>{{ scope.row.wheelSize }}</span>
                  </el-form-item>
                  <el-form-item label="车架材质">
                    <span>{{ scope.row.frame }}</span>
                  </el-form-item>
                  <el-form-item label="最大速度">
                    <span>{{ scope.row.maxSpeed + 'KM/h' }}</span>
                  </el-form-item>
                  <el-form-item label="单次充电里程">
                    <span>{{ scope.row.mileagePerCharge + 'KM' }}</span>
                  </el-form-item>
                  <el-form-item label="电池容量">
                    <span>{{ scope.row.batteryCapacity + 'AH' }}</span>
                  </el-form-item>
                  <el-form-item label="制动系统/刹车">
                    <span>{{ scope.row.brakeSystem | brakeSystemFilter }}</span>
                  </el-form-item>
                  <el-form-item label="起订量">
                    <span>{{ scope.row.moq }}</span>
                  </el-form-item>
                  <el-form-item label="单价">
                    <span>{{ scope.row.fobPrice }}</span>
                  </el-form-item>
                </el-form>
                <el-divider content-position="left">物流信息</el-divider>
                <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="纸箱尺寸">
                    <span>{{ scope.row.cartonSize + 'CM' }}</span>
                  </el-form-item>
                  <el-form-item label="海关编码">
                    <span>{{ scope.row.hsCode }}</span>
                  </el-form-item>
                </el-form>
                <el-divider content-position="left">定制信息</el-divider>
                <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="是否支持 LOGO 定制">
                    <span>{{ scope.row.logo ? '是' : '否' }}</span>
                  </el-form-item>
                  <el-form-item label="是否支持外包装定制">
                    <span>{{ scope.row.outerPacking ? '是' : '否' }}</span>
                  </el-form-item>
                  <el-form-item label="是否支持图案定制">
                    <span>{{ scope.row.design ? '是' : '否' }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center" label="主图">
              <template slot-scope="scope">
                <!-- 悬浮放大 -->
                <el-popover placement="top-start" trigger="hover">
                  <el-image slot="reference" style="width: 50px; height: 50px" :src="scope.row.url" fit="fill" />
                  <el-image :src="scope.row.url" fit="fill" />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="型号">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.model }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-button size="mini" type="primary" @click="handleSelect(scope.row)">加入</el-button>&nbsp;
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initQuotationData" />
        <el-table v-loading="loading" :data="quotationData" style="width: 100%">
          <el-table-column align="center" label="业务员">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.salesman.name }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实时汇率" prop="realTimeRate" />
          <el-table-column align="center" label="有效期" prop="validPeriod" />
          <el-table-column align="center" label="生成日期" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.generateDate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="基本信息数量" width="200">
            <template slot-scope="scope">
              <i class="el-icon-message-solid" />
              <span style="margin-left: 10px">{{ scope.row.basicInfos.length }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="exportQuotationById(scope.row)">导出报价单</el-button>&nbsp;
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此报价单？" @onConfirm="handleQuotationDelete(scope.row)">
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initQuotationData" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import Pagination from '@/components/Pagination'
import { getQuotations, getPhoenixInfo, createQuotation, deleteQuotation, exportQuotationById } from '@/api/quotation/quotation'
import { getSalesmanList } from '@/api/quotation/salesman'
import { getBasicInfos, previewMainImg } from '@/api/quotation/basic'
// import { getBasicInfosByCondition } from '@/api/quotation/basic'

export default {
  components: {
    Pagination
  },
  filters: {
    displayFilter(display) {
      switch (display) {
        case 'WITH_LED':
          return '带 LED 灯'
        case 'WITH_LCD':
          return '带 LCD 灯'
        case 'CAN_BE_ADDED':
          return '可选配'
        default:
          return '未知'
      }
    },
    throttleFilter(throttle) {
      switch (throttle) {
        case 'WITH_THROTTLE':
          return '自带'
        case 'CAN_BE_ADDED':
          return '可选配'
        default:
          return '未知'
      }
    },
    brakeSystemFilter(brakeSystem) {
      switch (brakeSystem) {
        case 'HYDRAULIC_DISC':
          return '油碟'
        case 'MECHANICAL_DISC':
          return '机碟'
        default:
          return '未知'
      }
    }
  },
  data() {
    return {
      round: true,
      plain: true,
      loading: true,
      quotationDialogVisible: false,
      // 创建报价单时选择基本信息的 Modal 框
      basicInfoSelectDialogVisible: false,
      labelPosition: 'right',
      page: 1,
      limit: 10,
      total: 0,
      salesmanPage: 0,
      phoenixData: {},
      salesmanData: [],
      basicInfoData: [],
      // 报价单展示用表格数据
      quotationData: [],
      // TODO 选择之后会将选中的 basicInfo 加到 selectedBasicInfo 里,
      // TODO 然后已选择的 table 数据源就是这个 selectedBasicInfo,
      // TODO 而待选择的 basicInfoData 的话, 数据来自于 getCondition 接口
      // TODO 那么就还需要一个查询按钮与一个重置按钮
      // 已选择的基本信息
      selectedBasicInfo: [],
      // 创建报价单所需数据
      quotation: {
        chineseName: '',
        englishName: '',
        address: '',
        officialWebsite: '',
        salesmanId: '',
        basicInfos: []
      },
      // 创建报价单时搜索基本信息时的条件
      quotationSearchCondition: {
        conditionLoading: true,
        conditionPage: 1,
        conditionLimit: 10,
        conditionTotal: 0,
        model: '',
        batteryCapacity: '',
        derailleur: '',
        display: '',
        throttle: '',
        brakeSystem: '',
        frame: '',
        frontFork: '',
        power: '',
        voltage: '',
        wheelSize: ''
      },
      // 显示器选项
      displayOptions: [
        {
          label: '带 LED 灯',
          value: 'WITH_LED'
        },
        {
          label: '带 LCD 灯',
          value: 'WITH_LCD'
        },
        {
          label: '可选配',
          value: 'CAN_BE_ADDED'
        }
      ],
      // 油门转把选项
      throttleOptions: [
        {
          label: '自带',
          value: 'WITH_THROTTLE'
        },
        {
          label: '可选配',
          value: 'CAN_BE_ADDED'
        }
      ],
      // 制动系统选项
      brakeSystemOptions: [
        {
          label: '油碟',
          value: 'HYDRAULIC_DISC'
        },
        {
          label: '机碟',
          value: 'MECHANICAL_DISC'
        }
      ],
      quotationRules: {
        chineseName: [
          { required: true, message: '请输入公司中文名', trigger: 'blur' }
        ],
        englishName: [
          { required: true, message: '请输入公司英文名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        officialWebsite: [
          { required: true, message: '请输入公司网址', trigger: 'blur' }
        ],
        salesmanId: [
          { required: true, message: '请选择业务员', trigger: 'blur' }
        ],
        basicInfos: [
          { required: true, message: '请选择基本信息', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initPhoenixData()
    this.initSalesmanData()
    this.initBasicInfoData()
    this.initQuotationData()
  },
  methods: {
    initSalesmanData() {
      // 初始化业务员相关数据
      getSalesmanList(0, 9999).then(response => {
        this.salesmanData = response.data.content
      }).catch(error => {
        console.log(error)
      })
    },
    initBasicInfoData() {
      // 初始化基本信息相关数据
      getBasicInfos(0, 9999).then(response => {
        this.basicInfoData = response.data.content
        this.$nextTick(() => {
          this.basicInfoData.forEach(basicInfo => {
            previewMainImg(basicInfo.mainPicture).then(response => {
              basicInfo.url = response.url
              const index = this.basicInfoData.indexOf(basicInfo)
              // 使 Vue 能响应式获取 url 属性
              // 见 https://cn.vuejs.org/v2/guide/reactivity.html#%E5%AF%B9%E4%BA%8E%E6%95%B0%E7%BB%84
              this.$set(this.basicInfoData, index, basicInfo)
            }).catch(() => {
              basicInfo.url = ''
              const index = this.basicInfoData.indexOf(basicInfo)
              this.$set(this.basicInfoData, index, basicInfo)
            })
          })
        })
        this.quotationSearchCondition.conditionLoading = false
      }).catch(error => {
        console.log(error)
        this.quotationSearchCondition.conditionLoading = false
      })
    },
    initPhoenixData() {
      // 初始化凤凰相关数据
      getPhoenixInfo().then(response => {
        this.phoenixData = response.data
        this.$set(this.quotation, 'chineseName', this.phoenixData.chineseName)
        this.$set(this.quotation, 'englishName', this.phoenixData.englishName)
        this.$set(this.quotation, 'address', this.phoenixData.address)
        this.$set(this.quotation, 'officialWebsite', this.phoenixData.officialWebsite)
      }).catch(error => {
        console.log(error)
      })
    },
    initQuotationData() {
      // 初始化报价单数据
      this.loading = true
      getQuotations(this.page - 1, this.limit).then(response => {
        this.quotationData = response.data.content
        this.total = response.data.totalElements
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handleQuotationFormSubmit(formName) {
      // 报价单创建表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.quotationDialogVisible = false
          this.quotation.basicInfos = this.selectedBasicInfo.map(t => t.basicInfoId)
          const quotationSubmit = this.quotation
          // 发请求提交
          createQuotation(quotationSubmit).then(response => {
            this.$notify({
              title: '成功',
              message: '创建报价单成功',
              type: 'success',
              duration: 5000
            })
            this.$refs[formName].resetFields()
            this.quotation = []
            this.selectedBasicInfo = []
            this.initQuotationData()
            this.initBasicInfoData()
            this.initPhoenixData()
            this.initSalesmanData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleQuotationFormCancel(formName) {
      // 报价单创建表单取消提交
      this.quotationDialogVisible = false
      this.$refs[formName].resetFields()
      this.quotation = []
      this.selectedBasicInfo = []
      this.initQuotationData()
      this.initBasicInfoData()
      this.initPhoenixData()
      this.initSalesmanData()
    },
    handleQuotationDelete(row) {
      const quotationIds = [row.quotationId]
      deleteQuotation(quotationIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除报价单成功',
          type: 'success',
          duration: 5000
        })
        this.initQuotationData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    exportQuotationById(row) {
      exportQuotationById(row.quotationId).then(response => {
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
    },
    // 选择某一项基本信息
    handleSelect(row) {
      // 将当前所选项 push 到 selectedBasicInfo 里
      this.selectedBasicInfo.push(row)
      console.log('选项: ', row)
      // 将当前所选项从 basicInfoData 里移除
      this.basicInfoData.splice(row, 1)
    }
  }
}
</script>
