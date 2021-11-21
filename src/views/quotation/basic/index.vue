<template>
  <el-row :gutter="24" style="left: 8px;">
    <el-col :span="24">
      <el-card shadow="always">
        <el-button style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="basicInfoDialogVisible = true">
          创建基本信息
        </el-button>&nbsp;
        <el-dialog title="新增基本信息" :visible.sync="basicInfoDialogVisible" center @closed="basicInfoDialogVisible = false">
          <el-divider content-position="center">基本信息</el-divider>
          <el-form ref="basicInfoForm" inline size="mini" :rules="basicInfoRules" :label-position="labelPosition" label-width="160px" :model="basicInfo">
            <el-form-item label="主图" prop="mainPicture">
              <el-upload auto-upload :action="imgUploadUrl" :headers="imgUploadHeaders" :limit="1" list-type="picture" :accept="imgUploadAccept" :on-success="handleImgUploadSuccess" :on-exceed="handleImgUploadExceed">
                <el-button size="mini" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传图片，如 jpg/jpeg/png 等</div>
              </el-upload>
            </el-form-item><br>
            <el-form-item label="型号" prop="model">
              <el-input v-model.trim="basicInfo.model" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="前叉" prop="frontFork">
              <el-input v-model.trim="basicInfo.frontFork" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="变速器" prop="derailleur">
              <el-input v-model.trim="basicInfo.derailleur" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="轮胎尺寸" prop="wheelSize">
              <el-input v-model.trim="basicInfo.wheelSize" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="车架材质" prop="frame">
              <el-input v-model.trim="basicInfo.frame" size="mini" auto-complete="off" />
            </el-form-item><br>
            <el-form-item label="显示器" prop="display">
              <el-select v-model="basicInfo.display" placeholder="请选择显示器类型" size="mini" auto-complete="off">
                <el-option v-for="displayOption in displayOptions" :key="displayOption.value" :label="displayOption.label" :value="displayOption.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="油门转把" prop="throttle">
              <el-select v-model="basicInfo.throttle" placeholder="请选择油门转把类型" size="mini" auto-complete="off">
                <el-option v-for="throttleOption in throttleOptions" :key="throttleOption.value" :label="throttleOption.label" :value="throttleOption.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="制动系统/刹车" prop="throttle">
              <el-select v-model="basicInfo.brakeSystem" placeholder="请选择刹车类型" size="mini" auto-complete="off">
                <el-option v-for="brakeSystemOption in brakeSystemOptions" :key="brakeSystemOption.value" :label="brakeSystemOption.label" :value="brakeSystemOption.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="最大速度" prop="maxSpeed">
              <el-input v-model.trim="basicInfo.maxSpeed" size="mini" auto-complete="off">
                <template slot="append">KM/h</template>
              </el-input>
            </el-form-item>
            <el-form-item label="单次充电里程" prop="mileagePerCharge">
              <el-input v-model.trim="basicInfo.mileagePerCharge" size="mini" auto-complete="off">
                <template slot="append">KM</template>
              </el-input>
            </el-form-item>
            <el-form-item label="电池容量" prop="batteryCapacity">
              <el-input v-model.trim="basicInfo.batteryCapacity" size="mini" auto-complete="off">
                <template slot="append">AH</template>
              </el-input>
            </el-form-item><br>
            <el-form-item label="功率" prop="power">
              <el-input-number v-model.trim="basicInfo.power" :step="1" :min="1" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="电压" prop="voltage">
              <el-input-number v-model.trim="basicInfo.voltage" :step="1" :min="1" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="起订量" prop="moq">
              <el-input-number v-model.trim="basicInfo.moq" :step="1" :min="1" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="单价" prop="fobPrice">
              <el-input-number v-model.trim="basicInfo.fobPrice" :step="0.1" :precision="1" :min="1" size="mini" auto-complete="off" />
            </el-form-item>
            <el-divider content-position="center">物流信息</el-divider>
            <el-form-item label="纸箱尺寸" prop="cartonSize">
              <el-input v-model.trim="basicInfo.cartonSize" size="mini" auto-complete="off">
                <template slot="append">CM</template>
              </el-input>
            </el-form-item>
            <el-form-item label="海关编码" prop="hsCode">
              <el-input v-model.trim="basicInfo.hsCode" size="mini" auto-complete="off" />
            </el-form-item>
            <el-divider content-position="center">定制信息</el-divider>
            <el-form-item label="是否支持 LOGO 定制" prop="logo">
              <el-switch v-model="basicInfo.logo" active-text="支持" inactive-text="不支持" inactive-color="#ff4949" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="是否支持外包装定制" prop="outerPacking">
              <el-switch v-model="basicInfo.outerPacking" active-text="支持" inactive-text="不支持" inactive-color="#ff4949" size="mini" auto-complete="off" />
            </el-form-item>
            <el-form-item label="是否支持图案定制" prop="design">
              <el-switch v-model="basicInfo.design" active-text="支持" inactive-text="不支持" inactive-color="#ff4949" size="mini" auto-complete="off" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleBasicInfoFormCancel('basicInfoForm')">取消</el-button>
            <el-button size="mini" type="primary" @click="handleBasicInfoFormSubmit('basicInfoForm')">创建</el-button>
          </span>
        </el-dialog>
        <el-button size="mini" :round="round" :plain="plain" icon="el-icon-refresh" @click="initBasicInfoData" />
        <el-table v-loading="loading" :data="basicInfoData" style="width: 100%">
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
          <el-table-column align="center" label="操作" width="260px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleBasicInfoEdit(scope.row)">编辑</el-button>&nbsp;
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-delete" icon-color="red" title="确认删除此基本信息？" @onConfirm="handleBasicInfoDelete(scope.row)">
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-dialog title="编辑基本信息" :visible.sync="basicInfoEditDialogVisible" center append-to-body @closed="basicInfoEditDialogVisible = false">
            <el-form ref="editForm" inline size="mini" :rules="basicInfoRules" :label-position="labelPosition" label-width="160px" :model="editBasicInfo">
              <el-form-item label="型号" prop="model">
                <el-input v-model.trim="editBasicInfo.model" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="前叉" prop="frontFork">
                <el-input v-model.trim="editBasicInfo.frontFork" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="变速器" prop="derailleur">
                <el-input v-model.trim="editBasicInfo.derailleur" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="轮胎尺寸" prop="wheelSize">
                <el-input v-model.trim="editBasicInfo.wheelSize" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="车架材质" prop="frame">
                <el-input v-model.trim="editBasicInfo.frame" size="mini" auto-complete="off" />
              </el-form-item><br>
              <el-form-item label="显示器" prop="display">
                <el-select v-model="editBasicInfo.display" placeholder="请选择显示器类型" size="mini" auto-complete="off">
                  <el-option v-for="displayOption in displayOptions" :key="displayOption.value" :label="displayOption.label" :value="displayOption.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="油门转把" prop="throttle">
                <el-select v-model="editBasicInfo.throttle" placeholder="请选择油门转把类型" size="mini" auto-complete="off">
                  <el-option v-for="throttleOption in throttleOptions" :key="throttleOption.value" :label="throttleOption.label" :value="throttleOption.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="制动系统/刹车" prop="throttle">
                <el-select v-model="editBasicInfo.brakeSystem" placeholder="请选择刹车类型" size="mini" auto-complete="off">
                  <el-option v-for="brakeSystemOption in brakeSystemOptions" :key="brakeSystemOption.value" :label="brakeSystemOption.label" :value="brakeSystemOption.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="最大速度" prop="maxSpeed">
                <el-input v-model.trim="editBasicInfo.maxSpeed" size="mini" auto-complete="off">
                  <template slot="append">KM/h</template>
                </el-input>
              </el-form-item>
              <el-form-item label="单次充电里程" prop="mileagePerCharge">
                <el-input v-model.trim="editBasicInfo.mileagePerCharge" size="mini" auto-complete="off">
                  <template slot="append">KM</template>
                </el-input>
              </el-form-item>
              <el-form-item label="电池容量" prop="batteryCapacity">
                <el-input v-model.trim="editBasicInfo.batteryCapacity" size="mini" auto-complete="off">
                  <template slot="append">AH</template>
                </el-input>
              </el-form-item><br>
              <el-form-item label="功率" prop="power">
                <el-input-number v-model.trim="editBasicInfo.power" :step="1" :min="1" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="电压" prop="voltage">
                <el-input-number v-model.trim="editBasicInfo.voltage" :step="1" :min="1" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="起订量" prop="moq">
                <el-input-number v-model.trim="editBasicInfo.moq" :step="1" :min="1" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="单价" prop="fobPrice">
                <el-input-number v-model.trim="editBasicInfo.fobPrice" :step="0.1" :precision="1" :min="1" size="mini" auto-complete="off" />
              </el-form-item>
              <el-divider content-position="center">物流信息</el-divider>
              <el-form-item label="纸箱尺寸" prop="cartonSize">
                <el-input v-model.trim="editBasicInfo.cartonSize" size="mini" auto-complete="off">
                  <template slot="append">CM</template>
                </el-input>
              </el-form-item>
              <el-form-item label="海关编码" prop="hsCode">
                <el-input v-model.trim="editBasicInfo.hsCode" size="mini" auto-complete="off" />
              </el-form-item>
              <el-divider content-position="center">定制信息</el-divider>
              <el-form-item label="是否支持 LOGO 定制" prop="logo">
                <el-switch v-model="editBasicInfo.logo" active-text="支持" inactive-text="不支持" inactive-color="#ff4949" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="是否支持外包装定制" prop="outerPacking">
                <el-switch v-model="editBasicInfo.outerPacking" active-text="支持" inactive-text="不支持" inactive-color="#ff4949" size="mini" auto-complete="off" />
              </el-form-item>
              <el-form-item label="是否支持图案定制" prop="design">
                <el-switch v-model="editBasicInfo.design" active-text="支持" inactive-text="不支持" inactive-color="#ff4949" size="mini" auto-complete="off" />
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="basicInfoEditDialogVisible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="handleBasicInfoEditSubmit('editForm')">修改</el-button>
            </span>
          </el-dialog>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="initBasicInfoData" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import Pagination from '@/components/Pagination'
import { getBasicInfos, createBasicInfo, updateBasicInfo, deleteBasicInfo, previewMainImg } from '@/api/quotation/basic'
import { getToken } from '@/utils/auth'

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
      basicInfoDialogVisible: false,
      basicInfoEditDialogVisible: false,
      labelPosition: 'right',
      page: 1,
      limit: 10,
      total: 0,
      // 上传主图 URL
      imgUploadUrl: process.env.VUE_APP_BASE_API + '/basic_infos/upload',
      // 上传图片时的请求头
      imgUploadHeaders: {
        Authorization: getToken(),
        ContentType: 'application/json'
      },
      // 上传图片接收的格式
      imgUploadAccept: 'image/*',
      // 存储上传成功后主图路径
      tempImgPath: '',
      basicInfoData: [],
      basicInfo: {
        model: '',
        batteryCapacity: '',
        brakeSystem: 'HYDRAULIC_DISC',
        cartonSize: '',
        derailleur: '',
        design: true,
        logo: true,
        outerPacking: true,
        display: 'WITH_LED',
        fobPrice: 2,
        frame: '',
        frontFork: '',
        hsCode: '',
        mainPicture: '',
        maxSpeed: '',
        mileagePerCharge: '',
        moq: 300,
        power: 250,
        throttle: 'WITH_THROTTLE',
        voltage: 36,
        wheelSize: ''
      },
      editBasicInfo: {
        basicInfoId: '',
        model: '',
        batteryCapacity: '',
        brakeSystem: '',
        cartonSize: '',
        derailleur: '',
        design: true,
        logo: true,
        outerPacking: true,
        display: '',
        fobPrice: 0,
        frame: '',
        frontFork: '',
        hsCode: '',
        mainPicture: '',
        maxSpeed: '',
        mileagePerCharge: '',
        moq: 0,
        power: 0,
        throttle: '',
        voltage: 0,
        wheelSize: '',
        createTime: ''
      },
      basicInfoRules: {
        model: [
          { required: true, message: '请输入型号', trigger: 'blur' }
        ],
        frontFork: [
          { required: true, message: '请输入前叉', trigger: 'blur' }
        ],
        display: [
          { required: true, message: '请选择显示器类型', trigger: 'blur' }
        ],
        throttle: [
          { required: true, message: '请选择油门转把类型', trigger: 'blur' }
        ],
        derailleur: [
          { required: true, message: '请输入变速器', trigger: 'blur' }
        ],
        power: [
          { required: true, message: '请输入功率', trigger: 'blur' }
        ],
        voltage: [
          { required: true, message: '请输入电压', trigger: 'blur' }
        ],
        wheelSize: [
          { required: true, message: '请输入轮胎尺寸', trigger: 'blur' }
        ],
        frame: [
          { required: true, message: '请输入车架材质', trigger: 'blur' }
        ],
        maxSpeed: [
          { required: true, message: '请输入最大速度', trigger: 'blur' }
        ],
        mileagePerCharge: [
          { required: true, message: '请输入单次充电里程', trigger: 'blur' }
        ],
        brakeSystem: [
          { required: true, message: '请选择制动系统/刹车', trigger: 'blur' }
        ],
        batteryCapacity: [
          { required: true, message: '请输入电池容量', trigger: 'blur' }
        ],
        moq: [
          { required: true, message: '请输入起订量', trigger: 'blur' }
        ],
        fobPrice: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        cartonSize: [
          { required: true, message: '请输入纸箱尺寸', trigger: 'blur' }
        ],
        hsCode: [
          { required: true, message: '请输入海关编码', trigger: 'blur' }
        ],
        design: [
          { required: true, message: '请选择是否支持图案定制', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请选择是否支持 LOGO 定制', trigger: 'blur' }
        ],
        outerPacking: [
          { required: true, message: '请选择是否支持外包装定制', trigger: 'blur' }
        ]
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
      ]
    }
  },
  created() {
    this.initBasicInfoData()
  },
  methods: {
    initBasicInfoData: function() {
      // 初始化基本信息数据
      this.loading = true
      getBasicInfos(this.page - 1, this.limit).then(response => {
        this.basicInfoData = response.data.content
        this.total = response.data.totalElements
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
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleBasicInfoFormSubmit(formName) {
      // 基本信息创建表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.basicInfoDialogVisible = false
          this.basicInfo.mainPicture = this.tempImgPath
          const basicInfoSubmit = this.basicInfo
          // 发请求提交
          createBasicInfo(basicInfoSubmit).then(() => {
            this.$notify({
              title: '成功',
              message: '创建基本信息成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initBasicInfoData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleBasicInfoFormCancel(formName) {
      // 基本信息创建表单取消提交
      this.basicInfoDialogVisible = false
      this.tempImgPath = ''
      this.$refs[formName].resetFields()
    },
    handleBasicInfoEdit(row) {
      this.editBasicInfo = row
      this.basicInfoEditDialogVisible = true
    },
    handleBasicInfoEditSubmit(formName) {
      // 基本信息修改表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.basicInfoEditDialogVisible = false
          const editBasicInfoData = this.editBasicInfo
          // 发请求提交
          updateBasicInfo(editBasicInfoData).then(response => {
            this.$notify({
              title: '成功',
              message: '修改基本信息成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.initBasicInfoData()
          }).catch(error => {
            console.log(error.message)
          })
        } else {
          return false
        }
      })
    },
    handleBasicInfoDelete(row) {
      const basicInfoIds = [row.basicInfoId]
      deleteBasicInfo(basicInfoIds).then(response => {
        this.$notify({
          title: '成功',
          message: '删除基本信息成功',
          type: 'success'
        })
        this.initBasicInfoData()
      }).catch(error => {
        console.log(error.message)
      })
    },
    // 图片上传成功后的回调
    handleImgUploadSuccess(response, file, fileList) {
      this.tempImgPath = response.data
    },
    // 图片超出个数限制后的回调
    handleImgUploadExceed(files, fileList) {
      this.$notify({
        title: '上传超出限制',
        message: '主图只能上传一张',
        type: 'error',
        duration: 5000
      })
    }
  }
}
</script>

<style scoped>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
