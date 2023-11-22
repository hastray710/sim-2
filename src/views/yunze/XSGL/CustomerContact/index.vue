<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 130px"
            >
              <el-option
                v-for="dict in CCG_TimeOptions"
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
              style="width: 260px"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="销售工程师" label-width="100px">
            <el-select v-model="queryParams.c_userIdArr" multiple clearable :disabled="clearableBool" placeholder="请选择">
              <el-option
                v-for="item in SalesOption"
                :key="item.user_id"
                :label="item.nick_name"
                :value="item.user_id"
              ></el-option>
            </el-select>
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
                  style="width: 110px;background-color: transparent;color: black;"
                  @change="$forceUpdate()"
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
              v-hasPermi="['yunze:CustomerContact:NewCustomer']"
            >新增
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch"  @queryTable="getList"
                         :columns="columns"></right-toolbar>
        </el-row>
      </el-form>

        <el-table v-loading="loading" :data="DataList" >
          <el-table-column label="省" align="center" prop="province" v-if="columns[0].visible"/>
          <el-table-column label="市" align="center" prop="city" v-if="columns[1].visible"/>
          <el-table-column label="联系时间" align="center" prop="CCG_Time" v-if="columns[2].visible"/>
          <el-table-column label="客户ID" align="center" prop="c_name" v-if="columns[3].visible"/>
          <el-table-column label="客户姓名" align="center" prop="CCG_CsfName" v-if="columns[4].visible"/>
          <el-table-column label="议题" align="center" prop="CCG_Issue" v-if="columns[5].visible"/>
          <el-table-column label="销售工程师" align="center" prop="CCG_UserID" v-if="columns[6].visible">
            <template slot-scope="scope">
              {{tools.getkeyValue(SalesOption,scope.row.CCG_UserID,"user_id","nick_name")}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['yunze:CustomerContact:updateId']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['yunze:CustomerContact:delId']"
              >删除</el-button>
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

    <el-drawer
      :with-header="false"
      :visible.sync="show_ds"
      :close-on-click-modal="false"
      @close="DrawerClose"
      size="90%">
      <el-scrollbar style="height:1000px;min-height: 100%;">


        <!-- 销售合同 组件-->
        <CustomerContact ref="addContract"
                     :CustomerOneCategoryOption="CustomerOneCategoryOption"
                     :CustomerTowCategoryOption="CustomerTowCategoryOption"
                     :form="form"
                     :loadingSelOption="loadingSelOption"
                     :CustomerGradeOption="CustomerGradeOption"
                     :selFindoptions="selFindoptions"
                     :Preservation="Preservation"
                     :CustomerAdd="CustomerAdd"
                     :SubAdd="SubAdd"
                     :SubUpd="SubUpd"
                     :SalesOption="SalesOption"
                     :Contact_CCG_CtID="Contact_CCG_CtID"
                     :RateSetting_show="RateSetting_show"
                     :window="window"
                     :Editexecute="Editexecute"
                     :show_ds="show_ds"
                     @SetObj="SetObj"
                     :sales_idArr="sales_idArr"
        />
        <div style="height: 2000px;"></div>
      </el-scrollbar>
    </el-drawer>


  </div>
</template>


<script>
import {regionData, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data';
import { findSalesPartner} from "@/api/yunze/XSGL/customer/customer";
import CustomerContact from "./CustomerContact";
import tools from "@/utils/yunze/tools";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {NewCustomerAdd,getList,DeleteID,UpdateId} from "@/api/yunze/XSGL/CustomerContact/CustomerContact";

export default {
  components:{//挂载
    CustomerContact,
  },
  name: "index",
  data() {
    return {
      show_ds: false,//详情查看
      window:window,//window 对象
      loadingSelOption: true,//是否 加载 查询客户信息框
      IsDisabled: true,//是否禁用
      cities: [],//'上海', '北京', '广州', '深圳'
      cityOptions: [],//'上海', '北京', '广州', '深圳'

      RateSetting_show: false,//费率设置 显示hi


      DivideBool: false,//划分按钮
      RecycleBool: false,//回收按钮


      // 时间查询类型 数据字典
      CCG_TimeOptions: [],
      selTime: '',//时间选择


      CustomerDivide_show: false,//客户划分 显示


      Contact_CCG_CtID: [], //联系方式
      SalesOption: [],//销售
      clearableBool:false,//所属销售是否 禁止选择

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





      options: regionData,
      selFindoptions: regionDataPlus,
      CodeToText: CodeToText,
      TextToCode: TextToCode,

      images: [],
      sortImages: !this.images ? [] : [].concat(this.images),
      acceptConfig: 'image/jpeg,image/png,image/jpg,image/gif',
      url: '',

      disabled: false,

      //保存 编辑 按钮
      CustomerAdd: false,
      // 修改 保存 按钮
      Preservation: false,
      tools: tools,

      sales_idArr: [],//控制查询时仅可看 所属销售的客户信息

      mainwidth: 24,//宽度
      option_show: false, //公司所属查询
      // 遮罩层
      loading: true,

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
      //主界面数据
      DataList: [],
      // 弹出层标题
      title: "",
      typeOptions: [],

      // 客户一级分类
      CustomerOneCategoryOption: [],
      // 客户二级分类
      CustomerTowCategoryOption: [],
      // 客户级别
      CustomerGradeOption: [],
      // 客户姓名
      PeopleOption: [],
      CustomerOption: [],//根据 查询条件加载的销售客户信息
      // 表单参数
      form: {
        CCG_Issue: null,
        CCG_Content: null,
        CCG_Remark: null,
        CCG_CtID: null,
        CCG_Time: tools.gitData(),
        CCG_UserID: null,
        CCG_CoID: null,
        CCG_CsfName: null,
        CCG_CsfPhone: null,
      },

      AccountOption: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        c_userIdArr: [],
      },

      // 列信息
      columns: [
        {key: 0, label: `省`, visible: true},
        {key: 1, label: `市`, visible: true},
        {key: 2, label: `联系时间`, visible: true},
        {key: 3, label: `客户ID`, visible: true},
        {key: 4, label: `客户联系人姓名`, visible: true},
        {key: 5, label: `议题`, visible: true},
        {key: 6, label: `销售`, visible: true},
      ],
      Editexecute:false,//发货申请 编辑加载是否 已执行
      // 表单校验
      rules: {}
    };
  },
  created() {
    //加载  销售
    if (window['SalesOption'] != undefined && window['SalesOption'] != null && window['SalesOption'] != '') {
      this.SalesOption = window['SalesOption'];
      this.SetAdminOption();
      this.Sales_execution();//过滤 Btns 权限 销售尽可看自身数据
    } else {
      let map = {};
      map.isSales = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findSalesPartner(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          window['SalesOption'] = jsonobj.Data;
          this.SalesOption = window['SalesOption'];
          //console.log(this.SalesOption)
          this.SetAdminOption();
          this.Sales_execution();//过滤 Btns 权限 销售尽可看自身数据
        } else {
          this.msgError(jsonobj.msg);
        }
      })
    }


    //加载 联系方式
    if (window['Contact_CCG_CtID'] != undefined && window['Contact_CCG_CtID'] != null && window['Contact_CCG_CtID'] != '') {
      this.Contact_CCG_CtID = window['Contact_CCG_CtID'];
    } else {
      this.getDicts("Contact_information").then(response => {
        window['Contact_CCG_CtID'] = response.data;
        this.Contact_CCG_CtID = window['Contact_CCG_CtID'];
      });
    }


    //加载 查询条件
    if (window['CustomerContact_selType'] != undefined && window['CustomerContact_selType'] != null && window['CustomerContact_selType'] != '') {
      this.typeOptions = window['CustomerContact_selType'];
    } else {
      this.getDicts("yz_CustomerContact_selType").then(response => {
        window['CustomerContact_selType'] = response.data;
        this.typeOptions = window['CustomerContact_selType'];
      });
    }

    //加载 查询时间类型 条件
    if (window['CCG_TimeOptions_selTimeType'] != undefined && window['CCG_TimeOptions_selTimeType'] != null && window['CCG_TimeOptions_selTimeType'] != '') {
      this.CCG_TimeOptions = window['CCG_TimeOptions_selTimeType'];
    } else {
      this.getDicts("yz_CCG_TimeOptions_selTimeType").then(response => {
        window['CCG_TimeOptions_selTimeType'] = response.data;
        this.CCG_TimeOptions = window['CCG_TimeOptions_selTimeType'];
      });
    }

    //加载 客户一级分类
    if (window['CustomerOneCategoryOption'] != undefined && window['CustomerOneCategoryOption'] != null && window['CustomerOneCategoryOption'] != '') {
      this.CustomerOneCategoryOption = window['CustomerOneCategoryOption'];
    } else {
      this.getDicts("yz_customer_grade_one").then(response => {
        window['CustomerOneCategoryOption'] = response.data;
        this.CustomerOneCategoryOption = window['CustomerOneCategoryOption'];
      });
    }


    //加载 客户二级分类
    if (window['CustomerTowCategoryOption'] != undefined && window['CustomerTowCategoryOption'] != null && window['CustomerTowCategoryOption'] != '') {
      this.CustomerTowCategoryOption = window['CustomerTowCategoryOption'];
    } else {
      this.getDicts("yz_customer_grade_tow").then(response => {
        window['CustomerTowCategoryOption'] = response.data;
        this.CustomerTowCategoryOption = window['CustomerTowCategoryOption'];
      });
    }


    //加载 客户 级别
    if (window['CustomerGradeOption'] != undefined && window['CustomerGradeOption'] != null && window['CustomerGradeOption'] != '') {
      this.CustomerGradeOption = window['CustomerGradeOption'];
    } else {
      this.getDicts("yz_customer_grade").then(response => {
        window['CustomerGradeOption'] = response.data;
        this.CustomerGradeOption = window['CustomerGradeOption'];
      });
    }

    //条件查询 默认选择第一个
    this.queryParams.type = '1';


  },

  methods: {

    //销售执行函数 清除 所属销售其他选项只留自己的
    Sales_execution(){
      let username = tools.getCookie("username");
      //console.log(username)
      if(username!='admin'){
        //console.log(this.SalesOption)
        if(this.SalesOption!=null && this.SalesOption.length>0){
          let SalesOption = JSON.parse(JSON.stringify(this.SalesOption));
          this.SalesOption = [];
          for (let i = 0; i < SalesOption.length; i++) {
            let Obj = SalesOption[i];
            if (Obj.user_name == username) {
              //console.log(arr)
              let arr = [];
              if(Obj.Btns!=null && Obj.Btns.indexOf(',')!=-1){
                arr = Obj.Btns.split(",");
              }else{
                arr = [Obj.Btns]
              }
              if(tools.VerificationValIsArray(arr,"yunze:sys:Sales")){
                this.SalesOption.push(Obj);
                this.queryParams.c_userIdArr = [Obj.user_id];
                this.clearableBool = true;
                this.sales_idArr = JSON.parse(JSON.stringify([Obj.user_id]));
              }else{
                this.SalesOption = SalesOption;
              }
              break;
            }
          }
        }
        this.getList();
      }else{
        this.getList();
      }
    },

    //设置数据
    SetObj(Key,obj){
      //console.log(obj);
      switch (Key) {
        case 'SetEditexecute':
          this.Editexecute = obj;//设置  编辑  是否已经加载 [提供给子组件使用]
          break;
        case 'Setform':
          this.form = obj;// 设置 form
          break;
        case 'Setshow_ds':
          this.show_ds = obj;// 设置 form
          break;
      }
    },

    //选中 当前登录用户
    SetAdminOption() {
      if (this.SalesOption != null && this.SalesOption.length > 0) {
        this.AdminOption = [];
        //默认选择第一个
        this.form.c_party_b_phone = this.SalesOption[0].phonenumber;
        this.form.c_party_b_id = this.SalesOption[0].user_id;
        let username = tools.getCookie("username");
        for (let i = 0; i < this.SalesOption.length; i++) {
          let Obj = this.SalesOption[i];
          this.AdminOption.push(Obj);
          window["SalesOptionPhonenumber_" + Obj.user_id] = Obj.phonenumber;
          //选中当前登录用户信息
          //console.log(username == Obj.user_name);
          if (Obj.user_name == username) {
            this.form.c_party_b_phone = Obj.phonenumber;
            this.form.c_party_b_id = Obj.user_id;
            this.form.c_userId = Obj.user_id;
          }
        }
      }
    },



    /*获取查询参数*/
    getParams() {
      if (tools.Is_null(this.queryParams.timetype) && this.selTime != null) {
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
      if (this.queryParams.province != null && this.queryParams.province == '全部') {
        this.queryParams.province = null;
        this.queryParams.city = null;
        this.queryParams.district = null;
      }

      //console.log(this.queryParams);
    },


    /** 查询通道列表 */
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      getList(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            //console.log(jsonobj)
            this.DataList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
          } else {
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },


    /** 删除 客户联系记录 */
    handleDelete(row){
      let map = {};
      map.CCG_ID = row.CCG_ID;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      tools.openAsk(this,'warning', "确定要删除客户联系记录表为 '"+row.CCG_ID+"' 的这条数据吗？", this.deleteContact, Pwd_Str);
    },
    deleteContact(Pwd_Str){
      DeleteID(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getList();
          this.msgSuccess(jsonobj.msg);
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    /*代理查询拓展*/
    agentShow() {
      let _this = this;
      _this.option_show = !_this.option_show;
      _this.mainwidth = _this.option_show ? 20 : 24;
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

    /** 修改 客户联系记录 */
    handleUpdate(row){

      this.Preservation = true;
      this.CustomerAdd = false;
      row.CCG_CtID = "" + row.CCG_CtID;
      this.form = row;
      // console.log(this.form = row)
      this.resetQuery();
      this.getList();
      this.show_ds = true;
      this.Editexecute = false;

    },

    /** 新增按钮操作 */
    handleAdd(row, Operate) {
      this.Editexecute = true;
      // this.form.CCG_UserID = 1;
      // this.form.CCG_CtID = '1';
      this.show_ds = true;
      this.Preservation = false;
      this.CustomerAdd = true;
      this.form = {
        CCG_UserID: 1,
        CCG_CtID : '1',
        CCG_Time: tools.gitData(),
      };//清空数据

    },


    /*客户信息关闭 触发 */
    DrawerClose() {
      //如果当期是 修改操作关闭界面 清空 dept_id 和 name
        this.form.dept_id = '';
        this.form.c_name = '';
    },

    RateSetting() {

    },

    /**新增保存*/
    SubAdd() {
      let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
      NewCustomerAdd(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.show_ds = false;
          //更新数据
          this.queryParams.page = 1;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**修改保存*/
    SubUpd(map){
      let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
      UpdateId(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.show_ds = false;
          //更新数据
          this.queryParams.page = 1;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

  }
};
</script>


<style scoped>
.tip {
  padding-top: 15px;
  border-radius: 4px;
  border-left: 5px solid #13ce66;
}
</style>


