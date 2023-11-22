<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--企业数据-->
      <el-col :span="4" :xs="24" v-show="option_show">
        <div class="head-container">
        <el-input
          v-model="deptName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
      </div>
        <div class="head-container">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>

          <el-tree
            :data="deptOptions"
            show-checkbox
            :filter-node-method="filterNode"
            default-expand-all
            node-key="id"
            ref="dept"
            highlight-current
            :check-strictly="!deptCheckStrictly"
            @node-click="handleNodeClick"
            :props="defaultProps"/>


        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
          <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"  style="margin-bottom: -10px;">
            <el-form-item label="时间类型" prop="status">
              <el-select
                v-model="queryParams.timetype"
                placeholder="时间类型"
                clearable
                size="small"
                style="width: 110px"
              >
                <el-option
                  v-for="dict in timetypeOptions"
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
          </el-form >

          <el-form :model="queryParams" ref="queryForm" :inline="true"  style="margin-bottom: 10px;">
            <el-col :span="1.5">
              <el-input
                v-model="queryParams.value"
                placeholder="查询值"
                clearable
                size="small"
                style="width: 350px;"
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
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['yunze:apiAccount:save']"
              >新增
              </el-button>
            </el-col>
            <!--<el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                :loading="exportLoading"
                @click="handleExport"
                v-hasPermi="['yunze:apiAccount:export']"
              >导出
              </el-button>
            </el-col>-->
            <el-col :span="1.5">
              <el-button size="mini" v-hasPermi="['yunze:sys:internal']" @click="agentShow">公司所属</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
          </el-form>


            <el-table v-loading="loading" :data="userList"  >

              <el-table-column label="用户名" prop="agent_name" v-if="columns[0].visible" />
              <el-table-column label="appId" prop="app_id" v-if="columns[1].visible" />
              <el-table-column label="密码" prop="password" v-if="columns[2].visible" />
              <el-table-column label="key" prop="access_key" v-if="columns[3].visible" />
              <el-table-column label="频率/60S"  prop="times" v-if="columns[4].visible" />
              <el-table-column label="创建时间" prop="create_time" v-if="columns[5].visible" />
              <el-table-column label="更新时间" prop="update_time" v-if="columns[6].visible" />

              <el-table-column
                label="操作"
                align="center"
                width="160"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-dropdown >
                    <el-button type="primary" size="small">
                      操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item   @click.native="handleCopy(scope.row)">复 制</el-dropdown-item>
                      <el-dropdown-item   @click.native="handleFind(scope.row)">详 情</el-dropdown-item>
                      <el-dropdown-item v-hasPermi="['yunze:apiAccount:upd']"   @click.native="handleUpdate(scope.row)">修 改</el-dropdown-item>
                      <el-dropdown-item v-hasPermi="['yunze:apiAccount:updPermission']"  @click.native="handlePermission(scope.row)">权 限</el-dropdown-item>
                      <el-dropdown-item v-hasPermi="['yunze:apiAccount:del']" v-if="scope.row.app_id!='adminOption'"   @click.native="handledel(scope.row)">删 除</el-dropdown-item>


                    </el-dropdown-menu>
                  </el-dropdown>
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

    <!-- 详情查看 -->

    <el-dialog :title="title" :visible.sync="show_ds" width="960px" append-to-body >
      <el-row>
        <el-col :span="e_tree" v-if="internalBool"  >
          <div class="head-container">
            <el-input
              v-model="treeName"
              placeholder="请输入企业名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree :data="deptOptions" :check-on-click-node="false" ref="tree" :filter-node-method="filterNode"
                     show-checkbox :check-strictly="true" default-expand-all node-key="id"
                     :default-checked-keys="deptDefaultKeys"
                     :props="defaultProps"  @check-change="treeNodeClick"  empty-text="暂无数据">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="e_form">
          <el-form ref="form" :model="form"  label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="appId">
                  <el-input v-model="form.app_id" max-length="20" :readonly="appIdRdonle" :disabled="appIdRdonle" placeholder="如 ShanDongYunZe" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码" >
                  <el-input v-model="form.password" max-length="20" placeholder="如 ShanDongYunZe123456" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Key" prop="cd_code" >
                  <el-input v-model="form.access_key" max-length="30" placeholder="如 ShanDongYunZe@20220422" />
                </el-form-item>
              </el-col>
              <el-col :span="12"  v-if="internalBool">
                <el-form-item label="频率/60S" prop="cd_code" >
                  <el-input-number v-model="form.times" :readonly="internalBool"  :min="1" :max="99999" placeholder="每60S可调用次数频率" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="apiAccounteAdd"   v-hasPermi="['yunze:apiAccount:save']" type="primary" @click="Add">新 增</el-button>
        <el-button v-show="apiAccounteEdie"  v-hasPermi="['yunze:apiAccount:upd']"   type="primary" @click="Edie">保 存</el-button>
      </div>
    </el-dialog>


    <!--访问权限设置-->
    <el-dialog title="可访问API设置" :visible.sync="show_permission" width="960px"  append-to-body>
      <el-row>
        <div class="head-container">
          <el-input
            v-model="openurl"
            placeholder="请输入API名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'treePermission')">全选/全不选</el-checkbox>
          <el-tree
            :data="permissionOptions"
            show-checkbox
            :filter-node-method="filterpsNode"
            default-expand-all
            node-key="dictValue"
            ref="treePermission"
            :default-checked-keys="permissionDefaultKeys"
            highlight-current
            :check-strictly="!permissionCheckStrictly"
            :props="pmdefaultProps"/>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button  v-hasPermi="['yunze:apiAccount:updPermission']"   type="primary" @click="EdiePs">设 置</el-button>
      </div>
    </el-dialog>



  </div>
</template>
<script>
import {
  list,
  save,
  upd,
  IsExaAgentId,
  del
} from "@/api/yunze/user/apiUser";


import {treeselect} from "@/api/system/dept";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import tools from "@/utils/yunze/tools";

export default {
  name: "apiUser",
  components: {Treeselect},
  data() {
    return {
      e_tree: 6,
      e_form: 18,
      show_permission:false,//访问权限 显示
      appIdRdonle:false,//appid 只读
      treeName: undefined,
      // 查询类型 数据字典
      timetypeOptions: [],
      permissionDefaultKeys:[],//默认选中API
      deptExpand: true,
      deptNodeAll: false,
      deptCheckStrictly: true,
      permissionCheckStrictly: true,
      show_ds: false,//详情查看
      activeName:'allUser',
      showSo:false,
      Planform: {},
      mainwidth: 24,//宽度
      option_show:false, //公司所属查询
      tools: tools,
      typeOptions: [],//查询条件
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
      internalBool: false,//内部人员
      deptName:'',
      apiAccounteAdd: true,
      apiAccounteEdie: false,
      selTime: '',//时间选择
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
      userList: null,
      // 弹出层标题
      title: "",
      // 企业树选项
      deptOptions: undefined,
      permissionOptions: undefined,// 访问权限 树选项
      deptDefaultKeys:[],//企业默认选中
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {
        id:'',
        app_id:'',
        access_key:'',
        password:'',
        create_time:'',
        update_time:'',
        agent_name:'',
        agent_id:'',
        times:'60',
        openurl:'',
        typesys:''
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      pmdefaultProps: {
        children: "children",
        label: "dictLabel"
      },
      selectList: [],
      openurl:'',
      // 查询参数
      queryParams: {
        type: null,
        value: null,
        pageNum: 1,
        pageSize: 10,
        user_name: undefined,
        staTime: null,
        endTime: null,
        timetype: null,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        {key: 0, label: `用户名`, visible: true},
        {key: 1, label: `appId`, visible: true},
        {key: 2, label: `密码`, visible: true},
        {key: 3, label: `key`, visible: true},
        {key: 4, label: `频率/60S`, visible: true},
        {key: 5, label: `创建时间`, visible: true},
        {key: 6, label: `更新时间`, visible: true}
      ],

    };
  },

  created() {



    //加载 查询条件
    if (window['yunze_apiUser_seltype'] != undefined && window['yunze_apiUser_seltype'] != null && window['yunze_apiUser_seltype'] != '') {
      this.typeOptions = window['yunze_apiUser_seltype'];
    } else {
      this.getDicts("yunze_apiUser_seltype").then(response => {
        window['yunze_apiUser_seltype'] = response.data;
        this.typeOptions = window['yunze_apiUser_seltype'];
      });
    }

    //加载 时间赛选查询条件
    if (window['yunze_apiUser_sel_timetype'] != undefined && window['yunze_apiUser_sel_timetype'] != null && window['yunze_apiUser_sel_timetype'] != '') {
      this.timetypeOptions = window['yunze_apiUser_sel_timetype'];
    } else {
      this.getDicts("yunze_apiUser_sel_timetype").then(response => {
        window['yunze_apiUser_sel_timetype'] = response.data;
        this.timetypeOptions = window['yunze_apiUser_sel_timetype'];
      });
    }




    //加载 API 名称
    if (window['permissionOptions'] != undefined && window['permissionOptions'] != null && window['permissionOptions'] != '') {
      this.permissionOptions = window['permissionOptions'];
    } else {
      this.getDicts("yz_openApi_url").then(response => {
        window['permissionOptions'] = response.data;
        this.permissionOptions = window['permissionOptions'];
      });
    }


    this.getTreeselect();
    this.getList();

  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      // console.log(val);
      this.$refs.dept.filter(val);

    },

    treeName(val) {
      if(this.$refs.tree!=null &&  this.$refs.tree!=undefined){
        this.$refs.tree.filter(val);
      }

    },
    openurl(val){
      if(this.$refs.treePermission!=null &&  this.$refs.treePermission!=undefined){
        this.$refs.treePermission.filter(val);
      }
    },
    internalBool(val){
      //console.log(val);
      if(val){
        this.e_tree = 6;
        this.e_form = 18;
      }else{
        this.e_tree = 0;
        this.e_form = 24;
      }
    },
  },
  methods: {




    treeNodeClick(data, checked) {
      this.userArr = [];
      const node = this.$refs.tree.getNode(data);
      const str = [];
      // 获取当前选择的id在数组中的索引
      const indexs = this.selectList.indexOf(data.id);
      // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
      if (indexs < 0 && this.selectList.length === 1 && checked) {
        this.msgError("单选操作请勿多选！");
        // 设置已选择的节点为false 很重要
        this.$refs.tree.setChecked(data, false);
      } else if (this.selectList.length === 0 && checked) {
        // 发现数组为空 并且是已选择
        // 防止数组有值，首先清空，再push
        this.selectList = [];
        this.form.agent_id = '';
        this.form.agent_name = '';
        this.selectList.push(data.id);
        this.form.agent_id = data.id;
        this.form.agent_name = data.label;
        this.msgSuccess("您已选择名称为：【"+this.form.agent_name+"】企业，默认为您折叠选项。");
        this.fold(false);
      } else if (indexs >= 0 && this.selectList.length === 1 && !checked) {
        // 再次直接进行赋值为空操作
        this.selectList = [];
        this.form.agent_id = '';
        this.form.agent_name = '';
      }
    },


    /*代理查询拓展*/
    agentShow() {
      let _this = this;
      _this.option_show = !_this.option_show;
      _this.mainwidth = _this.option_show ? 20 : 24;
    },


    fold(value){
      let treeList = this.deptOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.tree.store.nodesMap[treeList[i].id].expanded = value;
      }
    },


    /*获取查询参数*/
    getParams() {
      this.queryParams.staTime = null;
      this.queryParams.endTime = null;
      if (this.selTime != null) {
        //console.log(this.selTime);
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      list(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
        this.internalBool = jsonobj.deptId=='100';
        if (jsonobj.code == 200) {
            this.userList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
          } else {
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'dept') {
        //console.log(value);
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }else if(type=="treePermission"){
        this.$refs.treePermission.setCheckedNodes(value ? this.permissionOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.menuCheckStrictly = value ? true : false;
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(false ? this.deptOptions : []);
        this.deptCheckStrictly = value ? true : false;
      }else if(type=="treePermission"){
        this.$refs.treePermission.setCheckedNodes(false ? this.permissionOptions : []);
        this.permissionCheckStrictly = value ? true : false;
      }
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        user_id: undefined,
        deptId: undefined,
        user_name: undefined,
        nick_name: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查询企业下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
        //console.log(this.deptOptions)
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },


    filterpsNode(value, data) {
      if (!value) return true;
      return data.dictLabel.indexOf(value) !== -1;
    },

    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.agent_id = [data.id];
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.appIdRdonle = false;
      this.$nextTick(() => {
        if(this.$refs.tree!=null && this.$refs.tree!=undefined){
          this.$refs.tree.setCheckedNodes(false ? this.deptOptions: []);
        }
      });
      this.form ={
        id:'',
        app_id:'',
        access_key:'',
        password:'',
        create_time:'',
        update_time:'',
        agent_name:'',
        agent_id:'',
        times:'60',
        openurl:'',
        typesys:''
      };
      this.title = "新增API账号";
      this.show_ds = true;
      this.treeName = '';
      this.apiAccounteAdd = true;
      this.apiAccounteEdie = false;
    },
    //复制信息
    handleCopy(row){
      let _this = this;
      let objText ="用户名："+row.agent_name+"\n";
      objText +="API使用：http://demo.5iot.com/system/AapIntegrated/apifile\n";
      objText +="app_id："+row.app_id+"\n";
      objText +="access_key："+row.access_key+"\n";
      objText +="password："+row.password+"\n";
      tools.copyThat(objText,_this);
    },
    //详情
    handleFind(row){
      this.apiAccounteAdd = false;
      this.apiAccounteEdie = false;
      this.title = "API账号详情";
      this.find(row);

    },

    /** 修改按钮操作 */
    handleUpdate(row) {

      this.title = "修改API账号";
      this.find(row);
      this.apiAccounteAdd = false;
      this.apiAccounteEdie = true;


    },
  //权限访问设置
    handlePermission(row) {
      this.show_permission = true;
      this.form = row;
      this.$nextTick(() => {
        if(this.$refs.tree!=null && this.$refs.tree!=undefined){
          this.$refs.treePermission.setCheckedNodes(false ? this.deptOptions: []);
        }
      });
      if(tools.Is_null(row.openurl)){
        let openurlArr = [];
        if(row.openurl.indexOf(",")!=-1){
          openurlArr = row.openurl.split(",")
        }else {
          openurlArr = [row.openurl]
        }
        this.permissionDefaultKeys = openurlArr;
      }
    },



    find(row){
      this.appIdRdonle = true;
      this.$nextTick(() => {
        if(this.$refs.tree!=null && this.$refs.tree!=undefined){
          //this.$refs.tree.setCheckedNodes(false ? this.deptOptions: []);
          this.$refs.tree.filter( row.agent_name);
        }
      });
      this.selectList = [];
      this.form = row;
      this.deptDefaultKeys = [];
      this.deptDefaultKeys = [row.agent_id];
      this.show_ds = true;
      this.treeName = row.agent_name;
    },


    handledel(row){
      if(row.app_id!='adminOption'){
        let map = {};
        map.id = row.id;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        tools.openAsk(this,'warning', "确定要删除 用户名称为 '"+row.agent_name+"' 的这条数据吗？", this.delRouteFun, Pwd_Str);
      }else{
        this.msgError("adminOption 账号 不可删除！");
      }

    },


    //删除
    delRouteFun(Pwd_Str){
      del(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.getList();
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
    },



    Add(){
      let _this = this;
      //console.log(this.form);
      if (tools.VerificationsText(_this, _this.form.app_id, "appId不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.access_key, "Key不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.password, "密码不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.agent_id, "请选择关联企业！") == true &&
        tools.VerificationsText(_this, _this.form.agent_name, "刷新后重试！") == true &&
        tools.VerificationsText(_this, _this.form.times, "请填写每60秒允许调用频次！") == true ) {
        this.findIsExaAgentId();
      }
    },

    addSub(Pwd_Str){
      save(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          if(jsonobj.Data.bool){
            this.msgSuccess(jsonobj.msg);
            this.show_ds = false;
            //更新数据
            this.queryParams.page = 1;
            this.getList();
          }else{
            this.msgError(jsonobj.Data.Message);
          }
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    EdiePs(){
      let _this = this;
      if (tools.VerificationsText(_this, _this.form.app_id, "appId不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.access_key, "Key不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.password, "密码不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.agent_id, "请选择关联企业！") == true &&
        tools.VerificationsText(_this, _this.form.agent_name, "刷新后重试！") == true &&
        tools.VerificationsText(_this, _this.form.id, "必要参数缺失，刷新后重试！") == true &&
        tools.VerificationsText(_this, _this.form.times, "请填写每60秒允许调用频次！") == true ) {
      let  selArr = this.$refs.treePermission.getCheckedKeys();
        if( selArr!=null && selArr.length>1){
          let openurlStr = '';
          for (let i = 0; i < selArr.length; i++) {
            openurlStr += selArr[i]+",";
          }
          openurlStr = openurlStr.substring(0,openurlStr.length-1);
          this.form.openurl = openurlStr;
        }else if( selArr!=null && selArr.length>0){
          this.form.openurl = selArr[0];
        }else{
          this.form.openurl = "";
        }
        //console.log(this.form.openurl + "    ---   "+this.form.id)
        let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
        upd(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            this.msgSuccess(jsonobj.msg);
            this.show_permission = false;
            //更新数据
            this.queryParams.page = 1;
            this.getList();
          }else{
            let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
            this.msgError(msg);
          }
        })
      }
    },



    Edie(){
      let _this = this;
      if (tools.VerificationsText(_this, _this.form.app_id, "appId不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.access_key, "Key不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.password, "密码不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.agent_id, "请选择关联企业！") == true &&
        tools.VerificationsText(_this, _this.form.agent_name, "刷新后重试！") == true &&
        tools.VerificationsText(_this, _this.form.id, "必要参数缺失，刷新后重试！") == true &&
        tools.VerificationsText(_this, _this.form.times, "请填写每60秒允许调用频次！") == true ) {
        let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
        upd(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
              this.msgSuccess(jsonobj.msg);
              this.show_ds = false;
              //更新数据
              this.queryParams.page = 1;
              this.getList();
          }else{
            let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
            this.msgError(msg);
          }
        })
      }
    },


    findIsExaAgentId(){
      let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
      IsExaAgentId(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          if(jsonobj.Data!=null && jsonobj.Data.length>0){
            let agentName ="";
              agentName = " ["+this.form.agent_name+"] 企业下已有 ["+jsonobj.Data.length+"] 个账号 , ";
              for (let i = 0; i <  jsonobj.Data.length; i++) {
                agentName += " ["+jsonobj.Data[i]+"] ";
              }
              tools.openAsk(this,'warning', agentName+"是否确认继续操作？", this.addSub, Pwd_Str);
          }else{
              this.addSub(Pwd_Str);
          }
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
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

</style>
