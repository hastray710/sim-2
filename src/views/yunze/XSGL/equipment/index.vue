<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in inventorydetails_timetype"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="selTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 360px"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <span class="el-form-item__label" style="font-weight: 700;">起止条件 </span>
            <el-select
              v-model="queryParams.StartAndEndtype"
              placeholder="起止条件"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in inventorydetails_StartAndEnd_type"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryParams.StartValue"
              placeholder="开始号段"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryParams.EndValue"
              placeholder="结束号段"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>


        </el-form>

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-input
                v-model="queryParams.value"
                placeholder="查询值"
                clearable
                size="small"
                style="width: 350px"
                @keyup.enter.native="handleQuery"
              >
                <el-select
                  v-model="queryParams.type"
                  placeholder="查询条件"
                  clearable
                  slot="prepend"
                  style="width: 110px"
                >
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-input>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">

          <el-table-column label="虚拟编号" align="center" prop="VID" v-if="columns[0].visible"/>
          <el-table-column label="序列号" align="center" prop="arraylNumber" v-if="columns[1].visible"/>
          <el-table-column label="箱号" align="center" prop="CaseNumber" v-if="columns[2].visible"/>
          <el-table-column label="盘号" align="center" prop="PlateNumber" v-if="columns[3].visible"/>
          <el-table-column label="产品编码" align="center" prop="productCode" v-if="columns[4].visible"/>
          <el-table-column label="批号" align="center" prop="batchNumber" v-if="columns[5].visible"/>
          <el-table-column label="卷盘号" align="center" prop="Pkg_Id" v-if="columns[6].visible"/>
          <el-table-column label="MAC" align="center" prop="MAC" v-if="columns[7].visible"/>
          <el-table-column label="设备码" align="center" prop="DeviceCode" v-if="columns[8].visible"/>
          <el-table-column label="串号" align="center" prop="SerialNumber" v-if="columns[9].visible"/>
          <el-table-column label="SN" align="center" prop="SN" v-if="columns[10].visible"/>
          <el-table-column label="原SN" align="center" prop="Original_SN" v-if="columns[11].visible"/>
          <el-table-column label="iccid" align="center" prop="iccid" v-if="columns[12].visible"/>
          <el-table-column label="IMSI" align="center" prop="IMSI" v-if="columns[13].visible"/>
          <el-table-column label="IMEI" align="center" prop="IMEI" v-if="columns[14].visible"/>
          <el-table-column label="CMEI" align="center" prop="CMEI" v-if="columns[15].visible"/>
          <el-table-column label="创建时间" align="center" prop="create_time" v-if="columns[16].visible"/>
          <el-table-column label="入库时间" align="center" prop="enteringwarehousetime" v-if="columns[17].visible"/>

        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>


  </div>
</template>

<script>
import {findDeptUser} from "@/api/yunze/flowcard/card/card";
import {queryPackageSimple, findCr} from "@/api/yunze/flowcard/card/card";
import {Inventorydetails, ExportInventorydetails, ImportCardInfo} from "@/api/yunze/warehouse/Inventorydetails";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {treeselect} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import tools from "@/utils/yunze/tools";

export default {
  name: "index",
  components: {Treeselect},
  data() {
    return {
      tools: tools,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      userArr: [],//企业下用户数组
      // 部门树选项
      deptOptions: undefined,

      submitFileFormBtn: true,
      //划卡企业
      treeName: undefined,
      show_ds: false, //详情查询
      selTime: '',//时间选择
      mainwidth: 24,//宽度
      // 遮罩层
      loading: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      //时间类型
      inventorydetails_timetype: [],
      inventorydetails_StartAndEnd_type: [],// 起止条件查询类别
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      packageOptions: [],
      findCr_RouteOptions: [],// API通道信息
      customize_whether: [],//自定义是否
      selectList: [],

      // 总条数
      total: 0,
      // 用户表格数据
      cardList: [],
      // 是否显示弹出层
      open: false,
      title: '',
      // 默认密码
      initPassword: undefined,

      // 表单参数
      form: {},

      typeOptions: [],
      //当前查询参数
      sel: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staTime: null,
        endTime: null,
        StartAndEndtype: null,
        StartValue: null,
        EndValue: null,
        timetype: null,
        type: null,
        CSE_ID: null,

      },

      // 列信息
      columns: [
        {key: 0, label: `虚拟编号`, visible: true},
        {key: 1, label: `序列号`, visible: true},
        {key: 2, label: `箱号`, visible: true},
        {key: 3, label: `盘号`, visible: true},
        {key: 4, label: `产品编码`, visible: true},
        {key: 5, label: `批号`, visible: true},
        {key: 6, label: `卷盘号`, visible: true},
        {key: 7, label: `MAC`, visible: false},
        {key: 8, label: `设备码`, visible: true},
        {key: 9, label: `串号`, visible: false},
        {key: 10, label: `SN`, visible: false},
        {key: 11, label: `原SN`, visible: false},
        {key: 12, label: `iccid`, visible: true},
        {key: 13, label: `IMSI`, visible: true},
        {key: 14, label: `IMEI`, visible: true},
        {key: 15, label: `CMEI`, visible: false},
        {key: 16, label: `创建时间`, visible: true},
        {key: 17, label: `入库时间`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },

  created() {

    //加载 查询条件
    if (window['InventoryDetails_selType'] != undefined && window['InventoryDetails_selType'] != null && window['InventoryDetails_selType'] != '') {
      this.typeOptions = window['InventoryDetails_selType'];
    } else {
      this.getDicts("yunze_InventoryDetails_selType").then(response => {
        window['InventoryDetails_selType'] = response.data;
        this.typeOptions = window['InventoryDetails_selType'];
      });
    }

    //加载 时间赛选查询条件
    if (window['inventorydetails_timetype'] != undefined && window['inventorydetails_timetype'] != null && window['inventorydetails_timetype'] != '') {
      this.inventorydetails_timetype = window['inventorydetails_timetype'];
    } else {
      this.getDicts("yunze_inventorydetails_timetype").then(response => {
        // console.log(response.data)
        window['inventorydetails_timetype'] = response.data;
        this.inventorydetails_timetype = window['inventorydetails_timetype'];
      });
    }

    //加载 起止条件查询类别
    if (window['inventorydetails_StartAndEnd_type'] != undefined && window['inventorydetails_StartAndEnd_type'] != null && window['inventorydetails_StartAndEnd_type'] != '') {
      this.inventorydetails_StartAndEnd_type = window['inventorydetails_StartAndEnd_type'];
    } else {
      this.getDicts("yunze_inventorydetails_StartAndEnd_type").then(response => {
        window['inventorydetails_StartAndEnd_type'] = response.data;
        this.inventorydetails_StartAndEnd_type = window['inventorydetails_StartAndEnd_type'];
      });
    }


    //加载 自定义 是否 0 1 否 是
    if (window['customize_whether'] != undefined && window['customize_whether'] != null && window['customize_whether'] != '') {
      this.customize_whether = window['customize_whether'];
    } else {
      this.getDicts("yunze_customize_whether").then(response => {
        window['customize_whether'] = response.data;
        this.customize_whether = window['customize_whether'];
      });
    }

    //条件查询 默认选择第一个
    this.queryParams.type = '1';

    this.getList();
  },
  methods: {

    /*获取查询参数*/
    getParams() {

      if (this.$refs.dept != undefined & this.$refs.dept != null & this.$refs.dept != 'undefined') {
        //console.log(this.$refs.dept.getCheckedKeys());
        if (this.$refs.dept.getCheckedKeys().length > 0) {
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }
      if (tools.Is_null(this.queryParams.timetype) && this.selTime != null) {
        //console.log(this.selTime);
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 查询库存明细列表 */
    getList() {
      this.loading = true;
      this.getParams();
      // console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      Inventorydetails(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.cardList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
          } else {
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },



    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {};
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.selTime = null;
      this.handleQuery();
    },

  }
};
</script>

<style scoped>

.el-table .cell {
  line-height: 17px;
  padding-left: 10px;
  padding-right: 0px;
}

.el-form-item {
  margin-bottom: 10px;
}

.my_checkbox__inner {
  border: 1px;
}

</style>

