<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24" >
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="时间类型" prop="year" style="margin-bottom: 10px;line-height:35px">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in MGDateType"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-date-picker
              v-model="selTime"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 360px"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否修改" prop="status">
            <el-select
              v-model="queryParams.inconsistent_iccid"
              placeholder="是或否"
              clearable
              size="small"
              style="width: 200px"
            >
              <el-option
                v-for="dict in MGUpdate"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="是否新增" prop="status" >

            <el-select
              v-model="queryParams.is_new"
              placeholder="是或否"
              clearable
              v-hasPermi="['yunze:card:queryParamsChannelId']"
              size="small"
              style="width: 310px"
            >
              <el-option
                v-for="dict in MGInsert"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

        </el-form>

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: -10px;line-height:35px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <!--条件选择-->
              <el-form-item label="条件选择">
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
                      v-for="dict in MGQuery"
                      :key="dict.dictLabel"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-input>
              </el-form-item>

            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                :loading="exportLoading"
                @click="handleExport"
                v-hasPermi="['yunze:cardRoute:exportData']"
              >导出
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch"   v-hasPermi="['yunze:flowhis:list']" @queryTable="getList" :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" >
          <el-table-column  :show-overflow-tooltip="true" label="接入号" align="center" prop="msisdn" v-if="columns[0].visible" >
<!--            <template slot-scope="scope">-->
<!--              {{tools.getDkeyValue(findCr_RouteOptions,scope.row.cd_id)}}-->
<!--            </template>-->
          </el-table-column>

          <el-table-column  :show-overflow-tooltip="true"  label="iccid" align="center"  prop="iccid" v-if="columns[1].visible"/>
          <el-table-column  :show-overflow-tooltip="true" label="imsi" align="center"  prop="imsi" v-if="columns[2].visible">
<!--            <template slot-scope="scope">-->
<!--              {{tools.getDkeyValue(yunze_polling_type,scope.row.polling_type)}}-->
<!--            </template>-->
          </el-table-column>
          <el-table-column   label="激活时间" align="center"  prop="activate_date" v-if="columns[3].visible" />
          <el-table-column   label="开卡时间" align="center"  prop="open_date" v-if="columns[4].visible" />
          <el-table-column   label="创建时间" align="center"  prop="create_date" v-if="columns[5].visible">
<!--            <template slot-scope="scope">-->
<!--              <span>{{ parseTime(scope.row.create_date) }}</span>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column   label="更新时间" align="center"  prop="update_date" v-if="columns[6].visible"/>
          <el-table-column   label="最近一次同步时间" align="center"  prop="syn_Time" v-if="columns[7].visible"/>
          <el-table-column  :show-overflow-tooltip="true" label="所属通道" align="center"  prop="channel_id" v-if="columns[8].visible" >
            <template slot-scope="scope">
              {{tools.getDkeyValue(findCr_RouteOptions,scope.row.channel_id)}}
            </template>
          </el-table-column>
          <el-table-column   label="备注" align="center"  prop="remark" v-if="columns[9].visible"/>
          <el-table-column   label="是否修改" align="center"  prop="inconsistent_iccid" v-if="columns[10].visible">
            <template slot-scope="scope">
              {{tools.getDkeyValue(MGUpdate,scope.row.inconsistent_iccid)}}
            </template>
          </el-table-column>
          <el-table-column   label="是否新增"  prop="is_new" v-if="columns[11].visible">
            <template slot-scope="scope">
              {{tools.getDkeyValue(MGInsert,scope.row.is_new)}}
            </template>
          </el-table-column>
          <el-table-column  :show-overflow-tooltip="true" label="上游成员组id" align="center"  prop="groupId" v-if="columns[12].visible" >
            <template slot-scope="scope">
              {{scope.row.groupId}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  label="客户id" align="center"  prop="custId" v-if="columns[13].visible" />
          <el-table-column  :show-overflow-tooltip="true" label="卡状态描述" align="center"  prop="status_id" v-if="columns[14].visible" />

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
    <!-- 详情查看 -->

    <el-dialog :close-on-click-modal="false"
               title="下载执行日志结果" :visible.sync="executionTaskDis">
      <hr style="color:green"/>
      <el-row :gutter="20">
        <ul class="list-group" v-for="(item,index) in Urls">

        </ul>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { findCr} from "@/api/yunze/flowcard/card/card";
// import { getMemberGroupList } from "@/api/yunze/passageway/MemberGroup";
import tools from "@/utils/yunze/tools";
import {getMemberGroupList,exportcardRoute} from "../../../../api/yunze/memberGroup/memberGroup";

export default {
  name: "memberGroup",
  data() {
    return {
      //查询条件
      MGQuery: [],
      //MGQuery辅助工具
      MGUtil:[],
      //是否新增
      MGUpdate:[],
      //是否更新
      MGInsert:[],
      //时间查询类型
      MGDateType:[],
      tools:tools,
      //保存 编辑 按钮
      executionTaskDis: false,
      Urls:[],
      cardLists:[],
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


      customize_whether: [],//自定义是否
      ExecutionTask_OutType : [],// 执行日志导出类别

      SetMealImport:false, //详情查询 套餐信息
      show_ds:false, //详情查询
      selTime:[],//时间选择
      mainwidth:24,//宽度
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 用户表格数据
      cardList: [],

      findCr_RouteOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      typeOptions: [],
      // 连接管理时间查询类型 数据字典
      flowHisTime: [],
      // 简要套餐名称
      packageOptions: [],
      yunze_polling_type: [],

      cd_id: undefined,

      //详情
      tablefrom: [],

      FlowData : [],
      selIccid:[{FlowData:''}],
      activeNames:[0],

      //卡状态
      status_type: "",
      // 卡状态 字典
      stateOptions: [
        {
          dictLabel:''
        }
      ],
      //任务类别
      category_type: "",
      // 任务类别 字典
      TaskProject: [ ],

      // 运营商类别 字典
      operators_type: [],
      // 执行日志状态 字典
      channelStatusOptions: [],
      // 执行日志编码 字典
      channelCodeOptions: [],
      // 表单参数
      form: {},

      //当前查询参数
      sel:{
        iccid:'',
        agent_id:'',
        package_id:'',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: '1',
        value: null,
        cd_status: [],
        staTime: null,
        endTime: null,
        timetype: '0',
        is_new: null,
        inconsistent_iccid: null,
      },
      //通过id查询
      getByIds: {
        id: ''
      },
      // 列信息
      columns: [
        { key: 0, label: `接入号`, visible: true },
        { key: 1, label: `iccid`, visible: true },
        { key: 2, label: `imsi`, visible: true },
        { key: 3, label: `激活时间`, visible: false },
        { key: 4, label: `开卡时间`, visible: false },
        { key: 5, label: `创建时间`, visible: false },
        { key: 6, label: `更新时间`, visible: false },
        { key: 7, label: `最近一次同步时间`, visible: false },
        { key: 8, label: `所属通道`, visible: true },
        { key: 9, label: `备注`, visible: true },
        { key: 10, label: `是否新增`, visible: true },
        { key: 11, label: `是否修改`, visible: true },
        { key: 12, label: `上游成员组ID`, visible: true },
        { key: 13, label: `客户ID`, visible: true },
        { key: 14, label: `卡状态描述`, visible: true },

      ],
      // 表单校验
      rules: {
      }
    };
  },


  created() {

    //加载查询条件
    if(window['MGQuery']!=undefined &&  window['MGQuery']!=null && window['MGQuery']!=''){
      this.MGQuery = window['MGQuery'];
    }else{
      this.getDicts("MGQuery").then(response => {
        window['MGQuery'] = response.data;
        this.MGQuery = window['MGQuery'];
      });
    }

    //加载 是否更新
    if(window['MGInsert']!=undefined &&  window['MGInsert']!=null && window['MGInsert']!=''){
      this.MGInsert = window['MGInsert'];
    }else{
      this.getDicts("MGInsert").then(response => {
        window['MGInsert'] = response.data;
        this.MGInsert = window['MGInsert'];
      });
    }
    //加载 API通道名称
    if(window['findCr_RouteOptions']!=undefined &&  window['RouteOptions']!=null && window['findCr_RouteOptions']!=''){
      this.findCr_RouteOptions = window['findCr_RouteOptions'];
    }else{
      findCr().then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        window['findCr_RouteOptions'] = jsonobj.Data;
        this.findCr_RouteOptions = window['findCr_RouteOptions'];
      });
    }

    //加载 是否新增
    if(window['MGUpdate']!=undefined &&  window['MGUpdate']!=null && window['MGUpdate']!=''){
      this.MGUpdate = window['MGUpdate'];
    }else{
      this.getDicts("MGUpdate").then(response => {
        window['MGUpdate'] = response.data;
        this.MGUpdate = window['MGUpdate']
      });
    }


    //加载  时间查询类型
    if(window['MGDateType']!=undefined &&  window['MGDateType']!=null && window['MGDateType']!=''){
      this.MGDateType = window['MGDateType'];

    }else{
      this.getDicts("MGDateType").then(response => {
        window['MGDateType'] = response.data;
        this.MGDateType = window['MGDateType']
      });
    }
    const groupId = this.$route.params && this.$route.params.groupId;
    if(tools.Is_null(groupId)){
      this.queryParams.type= "3";
      this.queryParams.value= Number(groupId);

    }
    this.getList();

  },
  methods: {


    /*获取查询参数*/
    getParams(){

      if(this.$refs.dept!=undefined & this.$refs.dept!=null & this.$refs.dept!='undefined' ){
        //console.log(this.$refs.dept.getCheckedKeys());
        if(this.$refs.dept.getCheckedKeys().length>0){
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }
      if(tools.Is_null(this.queryParams.timetype) && this.selTime !=null){
        //console.log(this.selTime);
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }


    },

    /*下载执行日志*/
    getDownloadExecutionTask(row){
      let map = {};
      map.path = row.value;
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API+"/yunze/flowhis/download?Pstr="+Pwd_Str, '_blank');

    },

    //下载 xls 文件 格式
    getdownloadConversionk(row){
      let map = {};
      map.path = row.value;
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API+"/yunze/flowhis/downloadConversion?Pstr="+Pwd_Str, '_blank');

    },




    /** 查询执行日志列表 */
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
    console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      console.log(Pwd_Str);

      getMemberGroupList(Pwd_Str).then(response => {
        console.log(Pwd_Str);
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          console.log(jsonobj);
          if(jsonobj.code==200){
            this.cardList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
          }else{
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },
    /** 导出按钮操作 */
    handleExport() {

      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      exportcardRoute(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.Data);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }

      })

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
      this.queryParams.pageNum= 1;
      this.queryParams.pageSize= 10;
      this.selTime = null;
      this.handleQuery();
    },
    //  多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.cd_id);
    },
    /** 新增按钮操作 */
    handleAdd() {

      this.form = {};//清空数据
      //初始化 新增 数据
      this.form.cd_code= "YiDong_EC";
      this.form.cd_operator_type= "1";
      this.form.cd_lunxun= "1";
      this.form.cd_status= "1";
      this.show_ds = true;
      this.executionTaskAdd = true;
      this.executionTaskEdie = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.executionTaskAdd = false;
      this.executionTaskEdie = true;
      this.finddata(row);
    },
    /** 详情按钮操作 */
    ViewDetails(row) {
      //console.log(row);
      this.executionTaskAdd = false;
      this.executionTaskEdie = false;
      this.finddata(row);
    },



    /*获取详细信息*/
    finddata(row){
      this.form = {};//清空数据
      let map ={};
      map.cd_id = row.cd_id;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      getexecutionTask(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if(jsonobj.code==200){
            this.form = jsonobj.Data;


            this.show_ds = true;
          }else{
            this.msgError(jsonobj.msg);
          }
          this.loading = false;

        }
      );

    },









  }
};
</script>

<style scoped>

.el-table .cell{
  line-height: 17px;
  padding-left: 10px;
  padding-right: 0px;
}

.el-form-item {
  margin-bottom: 10px;
}

.my_checkbox__inner{
  border: 1px;
}

</style>

