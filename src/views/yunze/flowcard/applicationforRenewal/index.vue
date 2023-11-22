<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <!--申请状态 -->
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in renewal_state"
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
                v-for="dict in timetypeinfoTim"
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
                    v-for="dict in typeOptionsinfo"
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
            <right-toolbar :showSearch.sync="showSearch" v-hasPermi="['yunze:renewal:list']" @queryTable="getList"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" >
          <el-table-column label="企业名称" align="center" key="dept_id" prop="dept_id" v-if="columns[0].visible">
            <template slot-scope="scope">
              <span @click="openInfo(scope.row)"  class="link-type" v-hasPermi="['yunze:renewal:find']" >{{ tools.getDeptNamekeyValue(DeptOptions, scope.row.dept_id) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="status" prop="status" v-if="columns[1].visible">
            <template slot-scope="scope">
              <span :class="scope.row.status=='1'?'mygreen':scope.row.status=='2'?'mygred':''">{{ tools.getDkeyValue(renewal_state, scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="info" v-if="columns[2].visible"/>
          <el-table-column label="审核时间" align="center" prop="review_time" v-if="columns[3].visible"/>
          <el-table-column label="总卡数" align="center" prop="card_sumCount" v-if="columns[4].visible"/>
          <el-table-column label="总计金额" align="center" prop="amount" v-if="columns[5].visible"/>

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                v-hasPermi="['yunze:renewal:find']"
                @click="openInfo(scope.row)"
              >查看</el-button>
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

    <el-dialog :visible.sync="show_info" width="80%" :close-on-click-modal="false" append-to-body>
      <!--查看主表信息 子组件-->
      <appPrimary ref="appPrimary"
                       :BriefEditexecute="BriefEditexecute" :show_info="show_info"  @SetObj="SetObj"
                       :sel="sel" :DeptOptions="DeptOptions" :renewal_state="renewal_state" :customize_whether="customize_whether"

      />

    </el-dialog>

  </div>
</template>

<script>
import {listRenewal,updRenewal  } from "@/api/yunze/flowcard/renewal";
import tools from "@/utils/yunze/tools";
import appPrimary from "./appPrimary";

export default {
  components: {
    appPrimary,
  },
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
      DeptOptions: [],// 公司信息
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
      title:"",
      // 时间数组
      timetypeinfoTim:[],
      renewal_state: [],//续费申请状态
      // 查询条件
      typeOptionsinfo: [],
      // 资费类型
      typePackageOptions:[],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        type:'',
        value:'',
        pageNum: 1,
        pageSize: 10,
      },
      // 列信息
      columns: [
        {key: 1, label: `企业名称`, visible: true},
        {key: 2, label: `状态`, visible: true},
        {key: 3, label: `备注`, visible: true},
        {key: 4, label: `审核时间`, visible: true},
        {key: 5, label: `总卡数`, visible: true},
        {key: 6, label: `总计金额`, visible: true},
      ],
      // 表单校验
      rules: {},
      sel:{
        id:'',
      },
      BriefEditexecute: false,//加载是否 已执行
      show_info: false,//显示
      customize_whether: [],//自定义是否

      dsEditexecute: false,//加载是否 已执行 [订单、资费计划]
      show_ds: false,//显示 [订单、资费计划]

    };
  },

  created() {
    let str = this.$route.params.Pstr;


    //加载 查询条件
    if (window['typeOptionsinfo'] != undefined && window['typeOptionsinfo'] != null && window['typeOptionsinfo'] != '') {
      this.typeOptionsinfo = window['typeOptionsinfo'];
    } else {
      this.getDicts("yunze_renewal_seltype").then(response => {
        window['typeOptionsinfo'] = response.data;
        this.typeOptionsinfo = window['typeOptionsinfo'];
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



    //加载 时间赛选查询条件
    if (window['timetypeinfoTim'] != undefined && window['timetypeinfoTim'] != null && window['timetypeinfoTim'] != '') {
      this.timetypeinfoTim = window['timetypeinfoTim'];
    } else {
      this.getDicts("yunze_renewal_timeType").then(response => {
        window['timetypeinfoTim'] = response.data;
        this.timetypeinfoTim = window['timetypeinfoTim'];
      });
    }

    //加载 续费申请状态
    if (window['renewal_state'] != undefined && window['renewal_state'] != null && window['renewal_state'] != '') {
      this.renewal_state = window['renewal_state'];
    } else {
      this.getDicts("yunze_renewal_state").then(response => {
        window['renewal_state'] = response.data;
        this.renewal_state = window['renewal_state'];
      });
    }
    //加载 企业名称
    if (window['DeptOptions'] != undefined && window['DeptOptions'] != null && window['DeptOptions'] != '') {
      this.DeptOptions = window['DeptOptions'];
    } else {
      this.getDeptName().then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        window['DeptOptions'] = jsonobj.Data;
        this.DeptOptions = window['DeptOptions'];
      });
    }


    //默认条件选择选中第一个

    if (str != null && str != '' && str.length > 0) {
      var reg_1 = new RegExp("%2F", "g");
      var reg_2 = new RegExp(" ", "g");
      str = str.replace(reg_1, "/");//转义 /
      str = str.replace(reg_2, "+");//转义 [ ]  》 +
      let jsonobj = JSON.parse(tools.Decrypt(str));
      if (jsonobj != null) {
        if(tools.Is_null(jsonobj.id)){
          this.queryParams.type = '2';
          this.queryParams.value = jsonobj.id;
        }
      }
      this.getList();
    }else{
      this.queryParams.type ='0';
      this.getList();
    }
  },
  methods: {

    //查看续费申请详情
    openInfo(row){
      this.sel.id = row.id;
      this.BriefEditexecute = false;
      this.show_info = true;
    },

    //设置数据
    SetObj(Key, obj) {
      //console.log(obj);
      switch (Key) {
        case 'SetBriefEditexecute':
          this.BriefEditexecute = obj;//设置    是否已经加载 [提供给子组件使用]
          break;
        case 'SetShow_info':
          this.show_info = obj;//设置    是否已经加载 [提供给子组件使用]
          this.getList();
          break;
        case 'SetDsEditexecute':
          this.dsEditexecute = obj;//设置    是否已经加载 [提供给子组件使用]
          break;
        case 'SetShow_ds':
          this.show_ds = obj;//设置    是否已经加载 [提供给子组件使用]
          break;


      }
    },


    /*获取查询参数*/
    getParams() {

      if (this.$refs.dept != undefined & this.$refs.dept != null & this.$refs.dept != 'undefined') {
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


    /** 查询 */
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      listRenewal(Pwd_Str).then(response => {
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

    //修改
    handleUpdate(row){
      this.open = true;
      this.title = "上游资费组管理";
      row.type = ""+row.type;
      this.form = row;
    },
    // 修改确定按钮
    submitForm(){
      let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
      UpdateInfo(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.open = false;
          //更新数据
          this.queryParams.page = 1;
          this.getList();
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
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


  .mygreen{
    color: #11b95c;
    font-weight: 1000;
  }

  .mygred{
    color: #e64242;
    font-weight: 1000;

  }

</style>


