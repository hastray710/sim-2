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

          <el-form-item label="销售">
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
                    style="width: 110px;background-color: transparent;color: black;"
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
                v-hasPermi="['yunze:XsglContract:add']"
              >新增
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" v-hasPermi="['yunze:XsglContract:list']" @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="DataList" >
          <el-table-column :label="columns[0].label" align="center" prop="c_time" v-if="columns[0].visible"/>
          <el-table-column :label="columns[1].label" align="center"  prop="code" v-if="columns[1].visible" width="150"/>
          <el-table-column :label="columns[2].label" align="center" prop="c_name" v-if="columns[2].visible" width="400"  />
          <el-table-column :label="columns[3].label" align="center" prop="c_party_a_name" v-if="columns[3].visible"/>
          <el-table-column :label="columns[4].label" align="center" prop="c_userName" v-if="columns[4].visible"/>
          <el-table-column :label="columns[5].label" align="center" prop="c_the_actual_amount"
                           v-if="columns[5].visible"/>
          <el-table-column :label="columns[6].label" align="center" prop="c_contract_amount" v-if="columns[6].visible"/>
          <el-table-column :label="columns[7].label" align="center" prop="c_discountl_price" v-if="columns[7].visible"/>
          <el-table-column :label="columns[8].label" align="center" prop="modified_time" v-if="columns[8].visible">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.modified_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="columns[9].label" align="center" prop="create_time" v-if="columns[9].visible">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">

              <el-dropdown>
                <el-button type="primary" size="small">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-hasPermi="['yunze:XsglContract:upd']"
                                    @click.native="handleUpdate(scope.row,'Edit')">修改
                  </el-dropdown-item>
                  <el-dropdown-item v-hasPermi="['yunze:XsglContract:find']"
                                    @click.native="handleUpdate(scope.row,'Find')">详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <!-- <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-edit"
                 @click="onPreview(scope.row)"
               >图片查看
               </el-button>-->

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
        <AddContract ref="addContract"
                     :Large_classification="Large_classification"
                     :Small_classification="Small_classification"
                     :CustomerOneCategoryOption="CustomerOneCategoryOption"
                     :CustomerTowCategoryOption="CustomerTowCategoryOption"
                     :form="form"
                     :loadingSelOption="loadingSelOption"
                     :CustomerGradeOption="CustomerGradeOption"
                     :selFindoptions="selFindoptions"
                     :CustomerAdd="CustomerAdd"
                     :CustomerEdie="CustomerEdie"
                     :SubAdd="SubAdd"
                     :SubUpd="SubUpd"
                     :firmAccountOption="firmAccountOption"
                     :SalesOption="SalesOption"
                     :getTowClass="getTowClass"
                     :commodity="commodity"
                     :InvoicingTypeOption="InvoicingTypeOption"
                     :profitSharingTypeOption="profitSharingTypeOption"
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
  import {getList, add, upd} from "@/api/yunze/XSGL/Contract/Contract";
  import {findSalesPartner,} from "@/api/yunze/XSGL/customer/customer";
  import { Administration} from "@/api/yunze/Dictionaries/type";
  import AddContract from "./AddContract";
  import tools from "@/utils/yunze/tools";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {getToken} from "@/utils/auth";
  import {findArr} from "@/api/yunze/CWGL/Firm/Firm";


export default {
  components:{//挂载
    AddContract,
  },
  name: "Contract",
  data() {
    return {
      show_ds: false,//详情查看
      window:window,//window 对象
      loadingSelOption: true,//是否 加载 查询客户信息框
      IsDisabled: true,//是否禁用
      checkAll: false,
      checkedCities: [],
      cities: [],//'上海', '北京', '广州', '深圳'
      isIndeterminate: false,
      cityOptions: [],//'上海', '北京', '广州', '深圳'

      selName: '',//客户名称检索
      RateSetting_show: false,//费率设置 显示hi

      credit_code_Show: true,//统一社会信用代码 展示
      id_card_Show: false,//身份证 展示
      // 商品表参数
      commodity: {
        Cy_Sort: null,
        Cy_Category: null,
      },
      // 大分类
      Large_classification: [],
      // 小分类
      Small_classification: [],

      DivideBool: false,//划分按钮
      RecycleBool: false,//回收按钮

      CustomerAccountData_Cache: [],//账户信息 表格 修改时 缓存 最初加载数据
      CustomerAccountData_delArr: [],//账户 数据库 删除的id
      CustomerAccountData: [
        /* {
           Cat_ID: 'AAAAA',
           Cat_Name: 'AAAAAB',
           Cat_Bank_Name: 'AAAAAC',
           Cat_Number: 'AAAAAD',
           Cat_CoID: 'AAAAAe',
           Cat_User_Name: 'AAAAAf',
           Cat_Zip_Code: 'AAAAAg',
           Cat_Address: 'AAAAAh',
           Cat_atId: '1',
         }*/

      ],//账户信息 表格
      Accounttitle: '',
      Account_show: false,//账户信息 显示
      addAccountBtn: false,
      editAccountBtn: false,
      // 账户信息 map
      Accountform: {
        Cat_ID: null,
        Cat_Name: null,
        Cat_Bank_Name: null,
        Cat_Number: null,
        Cat_CoID: null,
        Cat_User_Name: null,
        Cat_Zip_Code: null,
        Cat_Address: null,
        Cat_atId: '1',
      },




      // 时间查询类型 数据字典
      timetypeOptions: [],
      selTime: '',//时间选择
      //客户联系人 数组

      CustomerPeopleData_delArr: [],//联系人 数据库 删除的id
      CustomerPeopleData_Cache: [],//联系人 表格 修改时 缓存 最初加载数据
      CustomerPeopleData: [

      ],
      //联系人 表格
      Peopletitle: '',
      People_show: false,//账户信息 显示
      CustomerDivide_show: false,//客户划分 显示
      addPeopleBtn: false,
      editPeopleBtn: false,
      //划分联系人
      CtDivideform: {
        sales_id: null,
        CDdeptIdArr: [],
      },

      // 客户联系人 map
      Peopleform: {
        id: null,
        cu_id: null,
        name: null,
        telephone: null,
        qq: null,
        nailed: null,
        email: null,
        remarks: null,
        job_title: null,
        state: '1',
        is_maste: '1',
        gender_id: '0',
      },

      PartnerOption: [],//合伙人
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
      selectedOptions: [],
      SelselectedOptions: [],

      images: [],
      sortImages: !this.images ? [] : [].concat(this.images),
      acceptConfig: 'image/jpeg,image/png,image/jpg,image/gif',
      fileList: {},

      url: '',
      srcList: [],


      Divide_show: false,//卡划分
      Dividebtn: true,//商品代理 btn
      //商品代理企业
      treeName: undefined,
      formDivide: {
        dept_id: '',
        user_id: '',
      },


      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/yunze/productPic/Prdedit",
        Pstr: '',//携带参数
      },

      Is_notAdd: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,

      //保存 编辑 按钮
      CustomerAdd: false,
      CustomerEdie: false,
      tools: tools,
      deptCheckStrictly: false,
      deptExpand: true,
      deptNodeAll: false,

      table_Online: [],//在线状态信息
      DeptOptions: [],// 公司信息
      customize_whether: [],//自定义是否
      sales_idArr: [],//控制查询时仅可看 所属销售的客户信息

      mainwidth: 24,//宽度
      option_show: false, //公司所属查询
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
      //主界面数据
      DataList: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      typeOptions: [],
      profitSharingTypeOption: [], //数据字典 销售合同分润模式
      InvoicingTypeOption: [],  //加载 销售合同开票类型
      firmAccountOption: [], //加载 销售单位信息

      AccountPeopleStateTypeOption: [],// 客户 联系人 状态
      // 客户类型
      CustomerSortTypeOption: [],
      // 客户一级分类
      CustomerOneCategoryOption: [],
      // 客户二级分类
      CustomerTowCategoryOption: [],
      // 客户级别
      CustomerGradeOption: [],
      // 客户状态
      customerStateOptions: [],
      CustomerSourceOptions: [],// 客户 来源
      // 渠道来源 字典
      sourceOption: [],
      // 通道编码 字典
      channelCodeOptions: [],
      // 表单参数
      form: {
        id: null,
        code: null,
        c_id: null,
        c_name: null,
        c_fatId: null,
        c_fatName: null,
        c_userId: null,
        c_userName: null,
        c_brId: '1',
        c_state: null,
        c_total_original_price: 0,
        c_transportation_costs: 0,
        c_total_tariff: 0,
        c_total_unit_price: 0,
        c_contract_amount: 0,
        c_other_amount: null,
        c_the_actual_amount: 0,
        c_discount: 100,
        c_party_a_id: null,
        c_party_a_name: null,
        c_party_a_phone: null,
        c_party_a_address: null,
        c_party_b_id: null,
        c_party_b_name: null,
        c_party_b_phone: null,
        c_party_b_address: null,
        modified_time: null,
        create_time: null,
        receive_payment: null,
        remarks: null,
        profit_sharing: '1',
        state: null,
        c_discountl_price: 0,
        c_time: tools.gitData(),

      },


      // 查询参数
      queryParams: {
        oneIdArr: [],
        TowIdArr: [],
        sourceIdArr: [],
        gradeIdArr: [],
        c_userIdArr: [],
        pageNum: 1,
        pageSize: 10,
        type: null,
        value: null,
        cd_status: [],
        province: null,
        city: null,
        district: null,
        is_Recycle: null,
        affiliation_id: null,

      },

      // 列信息
      columns: [
        {key: 0, label: `合同日期`, visible: true},
        {key: 1, label: `合同编号`, visible: true},
        {key: 2, label: `企业`, visible: true},
        {key: 3, label: `联系人`, visible: true},
        {key: 4, label: `业务员`, visible: true},
        {key: 5, label: `实际金额`, visible: true},
        {key: 6, label: `合同金额`, visible: true},
        {key: 7, label: `优惠金额`, visible: true},
        {key: 8, label: `修改时间`, visible: true},
        {key: 9, label: `创建时间`, visible: true}
      ],
      Editexecute:false,//发货申请 编辑加载是否 已执行
      // 表单校验
      rules: {}
    };
  },
  created() {
   /* let str = this.$route.query.str;

    if (str != null && str != '' && str.length > 0) {
      var reg_1 = new RegExp("%2F", "g");
      var reg_2 = new RegExp(" ", "g");
      str = str.replace(reg_1, "/");//转义 /
      str = str.replace(reg_2, "+");//转义 [ ]  》 +
      //console.log(str);
      let jsonobj = JSON.parse(tools.Decrypt(str));
      if (jsonobj != null && jsonobj.dept_id != null && jsonobj.dept_name != null) {
        this.form.c_name = jsonobj.dept_name;
        this.form.dept_id = jsonobj.dept_id;
        this.form.state_id = '1';
        this.form.is_Recycle = '1';
        this.show_ds = true;
        this.CustomerAdd = true;
        this.CustomerEdie = false;
        this.IsDisabled = false;
        this.RateSetting_show = false;
      }
      //console.log(jsonobj)
    }*/
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
    //加载  合伙人
    if (window['PartnerOption'] != undefined && window['PartnerOption'] != null && window['PartnerOption'] != '') {
      this.PartnerOption = window['PartnerOption'];
    } else {
      let map = {};
      map.isPartner = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findSalesPartner(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          window['PartnerOption'] = jsonobj.Data;
          this.PartnerOption = window['PartnerOption'];
        } else {
          this.msgError(jsonobj.msg);
        }
      })

    }

    //加载 销售合同开票类型
    if (window['InvoicingTypeOption'] != undefined && window['InvoicingTypeOption'] != null && window['InvoicingTypeOption'] != '') {
      this.InvoicingTypeOption = window['InvoicingTypeOption'];
    } else {
      this.getDicts("yz_Invoicing_Type").then(response => {
        window['InvoicingTypeOption'] = response.data;
        this.InvoicingTypeOption = window['InvoicingTypeOption'];
      });
    }


    //加载 销售单位信息
    if (window['firmAccountOption'] != undefined && window['firmAccountOption'] != null && window['firmAccountOption'] != '') {
      this.firmAccountOption = window['firmAccountOption'];

      if (this.firmAccountOption != null && this.firmAccountOption.length > 0) {
        this.form.c_party_b_address = this.firmAccountOption[0].Fat_Address;
        this.form.c_fatId = this.firmAccountOption[0].Fat_ID;
        //界面 储存 销售单位 地址
        for (let i = 0; i < this.firmAccountOption.length; i++) {
          window["firmAccountOptionAddress_" + this.firmAccountOption[i].Fat_ID] = this.firmAccountOption[i].Fat_Address;
        }
      }
    } else {
      let map = {};
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findArr(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          window['firmAccountOption'] = jsonobj.Data;
          this.firmAccountOption = window['firmAccountOption'];
          if (this.firmAccountOption != null && this.firmAccountOption.length > 0) {
            this.form.c_party_b_address = this.firmAccountOption[0].Fat_Address;
            this.form.c_fatId = this.firmAccountOption[0].Fat_ID;
            //界面 储存 销售单位 地址
            for (let i = 0; i < this.firmAccountOption.length; i++) {
              window["firmAccountOptionAddress_" + this.firmAccountOption[i].Fat_ID] = this.firmAccountOption[i].Fat_Address;
            }
          }

        } else {
          this.msgError(jsonobj.msg);
        }
      })
    }


    //加载 销售合同分润模式
    if (window['profitSharingTypeOption'] != undefined && window['profitSharingTypeOption'] != null && window['profitSharingTypeOption'] != '') {
      this.profitSharingTypeOption = window['profitSharingTypeOption'];
    } else {
      this.getDicts("yz_profit_sharingType").then(response => {
        window['profitSharingTypeOption'] = response.data;
        this.profitSharingTypeOption = window['profitSharingTypeOption'];
      });
    }

    //加载 查询条件
    if (window['SalesContract_selType'] != undefined && window['SalesContract_selType'] != null && window['SalesContract_selType'] != '') {
      this.typeOptions = window['SalesContract_selType'];
    } else {
      this.getDicts("yz_SalesContract_selType").then(response => {
        window['SalesContract_selType'] = response.data;
        this.typeOptions = window['SalesContract_selType'];
      });
    }

    //加载 查询时间类型 条件
    if (window['SalesContract_selTimeType'] != undefined && window['SalesContract_selTimeType'] != null && window['SalesContract_selTimeType'] != '') {
      this.timetypeOptions = window['SalesContract_selTimeType'];
    } else {
      this.getDicts("yz_SalesContract_selTimeType").then(response => {
        window['SalesContract_selTimeType'] = response.data;
        this.timetypeOptions = window['SalesContract_selTimeType'];
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

    //加载 客户 来源
    if (window['CustomerSourceOptions'] != undefined && window['CustomerSourceOptions'] != null && window['CustomerSourceOptions'] != '') {
      this.CustomerSourceOptions = window['CustomerSourceOptions'];
    } else {
      this.getDicts("yz_customer_source").then(response => {
        window['CustomerSourceOptions'] = response.data;
        this.CustomerSourceOptions = window['CustomerSourceOptions'];
      });
    }




    //加载 大分类
    if(window['Large_classification']!=undefined &&  window['Large_classification']!=null && window['Large_classification']!=''){
      this.Large_classification = window['Large_classification'];
      let map ={};
      map.Cy_Sort = '9';
      if(tools.Is_null(window['details_'+map.Cy_Sort])){
        this.getTowClass({'Cy_Sort':window['details_'+map.Cy_Sort]});
      }
      this.commodity.Cy_Sort = this.Large_classification[0].CODE;
    }else{
      let map ={};
      map.Cy_Sort = '9';
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      Administration(Pwd_Str).then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        window['Large_classification'] = jsonobj.Data;
        this.Large_classification = window['Large_classification'];
        if(this.Large_classification!=null && this.Large_classification.length>0){
          let val = '';
          for (let i = 0; i < this.Large_classification.length; i++) {
            let obj = this.Large_classification[i];
            // console.log(obj)
            window['child_id_'+map.Cy_Sort+"_"+obj.CODE] = [];
            (window['child_id_'+map.Cy_Sort+"_"+obj.CODE]).push(obj.child_id);
            if(i==0){
              window['details_'+map.Cy_Sort]= obj.child_id;
            }
          }
          if(tools.Is_null(window['details_'+map.Cy_Sort])){
            this.getTowClass({'Cy_Sort':window['details_'+map.Cy_Sort]});
            this.commodity.Cy_Sort = this.Large_classification[0].CODE;
          }
        }
      });
    }

    //条件查询 默认选择第一个
    this.queryParams.type ='1';

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


    //获取二级分类
    getTowClass(map){
      //加载 大分类
      if(window['TowClass'+map.Cy_Sort]!=undefined &&  window['TowClass'+map.Cy_Sort]!=null && window['TowClass'+map.Cy_Sort]!=''){
        this.Small_classification = window['TowClass'+map.Cy_Sort]
        this.commodity.Cy_Category = this.Small_classification[0].CODE;
      }else{
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        Administration(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          window['TowClass'+map.Cy_Sort] = jsonobj.Data;
          window['TowClasschildArr'+map.child_id_sel] = window['TowClass'+map.Cy_Sort];
          //console.log(jsonobj.Data)
          this.Small_classification = window['TowClass'+map.Cy_Sort]
          this.commodity.Cy_Category = this.Small_classification[0].CODE;
        });
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

    /** 新增按钮操作 */
    handleAdd() {
      //this.form = {};//清空数据

      this.Editexecute = true;
      this.show_ds = true;
      this.CustomerAdd = true;
      this.CustomerEdie = false;
    },


    findCustomerDivide(map) {
      //console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      CustomerDividefind(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj)
          if (jsonobj.code == 200) {
            this.cities = JSON.parse(JSON.stringify(jsonobj.Data));
            this.cityOptions = JSON.parse(JSON.stringify(jsonobj.Data));
            this.CustomerDivide_show = true;
          } else {
            this.msgError(jsonobj.msg);
          }
        }
      );

    },


    /*客户信息关闭 触发 */
    DrawerClose() {
      //如果当期是 修改操作关闭界面 清空 dept_id 和 name
      if (this.CustomerEdie == true) {
        this.form.dept_id = '';
        this.form.c_name = '';
      }
      //console.log(this.CustomerEdie)
    },

    RateSetting() {

    },


    /** 修改按钮操作 */
    handleUpdate(row, Operate) {
      this.form =  {
        id: row.id,
        code: row.code,
        c_id: null,
        c_name: null,
        c_fatId: null,
        c_fatName: null,
        c_userId: null,
        c_userName: null,
        c_brId: '1',
        c_state: null,
        c_total_original_price: 0,
        c_transportation_costs: 0,
        c_total_tariff: 0,
        c_total_unit_price: 0,
        c_contract_amount: 0,
        c_other_amount: null,
        c_the_actual_amount: 0,
        c_discount: 100,
        c_party_a_id: null,
        c_party_a_name: null,
        c_party_a_phone: null,
        c_party_a_address: null,
        c_party_b_id: null,
        c_party_b_name: null,
        c_party_b_phone: null,
        c_party_b_address: null,
        modified_time: null,
        create_time: null,
        receive_payment: null,
        remarks: null,
        profit_sharing: '1',
        state: null,
        c_time: null,
      };//清空数据
      this.IsDisabled = true;
      this.Editexecute = false;
      if (Operate == "Edit") {
        this.CustomerAdd = false;
        this.CustomerEdie = true;
        this.RateSetting_show = false;
      } else if (Operate == "Find") {
        this.CustomerAdd = false;
        this.CustomerEdie = false;
        this.RateSetting_show = true;
      }
      this.show_ds = true;
    },





    /** 详情按钮操作 */
    ViewDetails(row) {
      //console.log(row);
      this.form = {};//清空数据
      this.CustomerAdd = false;
      this.CustomerEdie = false;
      this.form = JSON.parse(JSON.stringify(row));

      //this.show_ds = true;
    },


    SubAdd(map) {


      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      add(Pwd_Str).then(response => {
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

    SubUpd(map) {

      //console.log(map);
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      upd(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.show_ds = false;
          //更新数据
          this.form.dept_id = '';
          this.form.c_name = '';
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


