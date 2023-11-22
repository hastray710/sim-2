<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">


              <el-form-item label="多维度">
                <el-select
                  v-model="queryParams.dimensionField"
                  placeholder="维度字段"
                  size="small"
                  clearable
                  style="width: 110px;"
                >
                  <el-option
                    v-for="dict in dimensionFieldOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="queryParams.dimensionValue"
                  placeholder="维度值"
                  clearable
                  size="small"
                  style="width: 350px;"
                  @keyup.enter.native="handleQuery"
                >
                  <el-select
                    v-model="queryParams.dimensionType"
                    placeholder="维度条件"
                    clearable
                    slot="prepend"
                    style="width: 110px"
                  >
                    <el-option
                      v-for="dict in dimensionTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-input>
              </el-form-item>

              <!--  时间类型-->
              <el-form-item label="时间类型" prop="status">
                <el-select
                  v-model="queryParams.timetype"
                  placeholder="时间类型"
                  clearable
                  size="small"
                  style="width: 110px"
                >
                  <el-option
                    v-for="dict in UpstreamTime"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="selTime"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 360px"
                  align="right">
                </el-date-picker>
              </el-form-item>

        </el-form>

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 10px">
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
                  @change="$forceUpdate()"
                  style="width: 130px;background-color: transparent;color: black;"
                >
                  <el-option
                    v-for="dict in UpstreamCard"
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
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
          <el-table-column label="iccid" align="center" prop="iccid" v-if="columns[0].visible"/>
          <el-table-column label="资费id" align="center" prop="offeringId" v-if="columns[1].visible"/>
          <el-table-column label="资费激活名称" align="center" prop="offeringName" v-if="columns[2].visible"/>
          <el-table-column label="APN 名称" align="center" prop="apnName" v-if="columns[3].visible"/>
          <el-table-column label="总量(MB)" align="center" prop="totalAmount" v-if="columns[4].visible"/>
          <el-table-column label="使用量(MB)" align="center" prop="useAmount" v-if="columns[5].visible"/>
          <el-table-column label="剩余量(MB)" align="center" prop="remainAmount" v-if="columns[6].visible"/>
          <el-table-column label="已用百分比(%)" align="center" prop="percentage" v-if="columns[8].visible"/>
          <el-table-column label="创建时间" align="center" prop="create_date" v-if="columns[9].visible"/>
          <!--          <el-table-column label="最近修改时间" align="center" prop="upd_date" v-if="columns[10].visible"/>-->
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
import {getListusage} from "@/api/yunze/flowcard/cardSetmeal";
import tools from "@/utils/yunze/tools";

export default {
  name: "index",
  data() {
    return {

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
      tools: tools,

      selTime: '',//时间选择
      mainwidth: 24,//宽度
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 用户表格数据
      cardList: null,
      // 是否显示弹出层
      open: false,
      // 时间数组
      UpstreamTime: [],
      // 查询条件
      UpstreamCard: [],
      //维度字段
      dimensionFieldOptions:[],
      //维度条件
      dimensionTypeOptions: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 列信息
      columns: [
        {key: 1, label: `iccid`, visible: true},
        {key: 2, label: `资费id`, visible: true},
        {key: 3, label: `资费激活名称`, visible: true},
        {key: 4, label: `APN 名称`, visible: true},
        {key: 5, label: `总量`, visible: true},
        {key: 6, label: `使用量`, visible: true},
        {key: 7, label: `剩余量`, visible: true},
        {key: 8, label: `已用百分比`, visible: true},
        {key: 9, label: `创建时间`, visible: true},
        {key: 10, label: `最近一次修改时间`, visible: true},
        // {key: 11, label: `最近一次抄送时间`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },

  created() {


    //加载 查询条件
    if (window['UpstreamCard'] != undefined && window['UpstreamCard'] != null && window['UpstreamCard'] != '') {
      this.UpstreamCard = window['UpstreamCard'];
    } else {
      this.getDicts("yunze_Upstream_card").then(response => {
        window['UpstreamCard'] = response.data;
        this.UpstreamCard = window['UpstreamCard'];
      });
    }

    //加载 时间赛选查询条件
    if (window['UpstreamTime'] != undefined && window['UpstreamTime'] != null && window['UpstreamTime'] != '') {
      this.UpstreamTime = window['UpstreamTime'];
    } else {
      this.getDicts("yunze_Upstream_time").then(response => {
        window['UpstreamTime'] = response.data;
        this.UpstreamTime = window['UpstreamTime'];
      });
    }

    //加载 维度字段
    if (window['dimensionFieldOptions'] != undefined && window['dimensionFieldOptions'] != null && window['dimensionFieldOptions'] != '') {
      this.dimensionFieldOptions = window['dimensionFieldOptions'];
    } else {
      this.getDicts("yunze_dimensionField").then(response => {
        window['dimensionFieldOptions'] = response.data;
        this.dimensionFieldOptions = window['dimensionFieldOptions'];
      });
    }

    //加载 维度条件
    if (window['dimensionTypeOptions'] != undefined && window['dimensionTypeOptions'] != null && window['dimensionTypeOptions'] != '') {
      this.dimensionTypeOptions = window['dimensionTypeOptions'];
    } else {
      this.getDicts("yunze_dimensionType").then(response => {
        window['dimensionTypeOptions'] = response.data;
        this.dimensionTypeOptions = window['dimensionTypeOptions'];
      });
    }

    //条件查询 默认选择第一个
    this.queryParams.type = '0';

    this.getList();
  },
  methods: {

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

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


    /** 查询执行日志列表 */
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
      //console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      getListusage(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          // console.log(jsonobj);
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

