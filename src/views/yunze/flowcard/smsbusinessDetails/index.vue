<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">


          <!--业务状态   -->
          <el-form-item label="业务状态" prop="status">
            <el-select
              v-model="queryParams.state_id"
              placeholder="详情业务状态"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in businessDetails_state"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
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
                v-for="dict in yunzePublicTime"
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
                  style="width: 110px"
                >
                  <el-option
                    v-for="dict in businessDetails_type"
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
          <el-table-column label="主表id" align="center" prop="b_id" v-if="columns[0].visible"/>
          <el-table-column label="号码" align="center" prop="card_number" v-if="columns[1].visible"/>
          <el-table-column label="创建时间" align="center" prop="create_time" v-if="columns[2].visible"/>
          <el-table-column label="修改时间" align="center" prop="update_time" v-if="columns[3].visible"/>
          <el-table-column label="结束时间" align="center" prop="end_time" v-if="columns[4].visible"/>
          <el-table-column label="描述" align="center" prop="mydescribe" v-if="columns[5].visible"/>
          <el-table-column label="状态" align="center" prop="state_id" v-if="columns[6].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(businessDetails_state, scope.row.state_id) }}
            </template>
          </el-table-column>
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
import {getListArr} from "@/api/yunze/flowcard/bulk/smsbusinessDetails";
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
      yunzePublicTime:[],
      // 业务状态
      businessDetails_state: [],
      // 查询条件
      businessDetails_type: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 列信息
      columns: [
        {key: 1, label: `主表id`, visible: true},
        {key: 2, label: `号码"`, visible: true},
        {key: 3, label: `创建时间`, visible: true},
        {key: 4, label: `修改时间`, visible: true},
        {key: 5, label: `结束时间`, visible: true},
        {key: 6, label: `描述`, visible: true},
        {key: 7, label: `状态`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },

  created() {

    //加载 查询条件
    if (window['businessDetails_type'] != undefined && window['businessDetails_type'] != null && window['businessDetails_type'] != '') {
      this.businessDetails_type = window['businessDetails_type'];
    } else {
      this.getDicts("yunze_businessDetails_type").then(response => {
        window['businessDetails_type'] = response.data;
        this.businessDetails_type = window['businessDetails_type'];
      });
    }

    //加载 业务状态
    if (window['businessDetails_state'] != undefined && window['businessDetails_state'] != null && window['businessDetails_state'] != '') {
      this.businessDetails_state = window['businessDetails_state'];
    } else {
      this.getDicts("yz_bulk_businessDtails_state_id").then(response => {
        window['businessDetails_state'] = response.data;
        this.businessDetails_state = window['businessDetails_state'];
      });
    }

    //加载 时间赛选查询条件
    if (window['yunzePublicTime'] != undefined && window['yunzePublicTime'] != null && window['yunzePublicTime'] != '') {
      this.yunzePublicTime = window['yunzePublicTime'];
    } else {
      this.getDicts("yunze_task_sel_timetype").then(response => {
        window['yunzePublicTime'] = response.data;
        this.yunzePublicTime = window['yunzePublicTime'];
      });
    }


    //加载 执行日志导出类别
    if (window['ExecutionTask_OutType'] != undefined && window['ExecutionTask_OutType'] != null && window['ExecutionTask_OutType'] != '') {
      this.ExecutionTask_OutType = window['ExecutionTask_OutType'];
    } else {
      this.getDicts("yunze_ExecutionTask_OutType").then(response => {
        window['ExecutionTask_OutType'] = response.data;
        this.ExecutionTask_OutType = window['ExecutionTask_OutType'];
      });
    }



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
      getListArr(Pwd_Str).then(response => {
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

