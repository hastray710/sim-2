<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">


          <el-form-item label="一级分类">
            <el-select v-model="queryParams.oneIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerOneCategoryOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类">
            <el-select v-model="queryParams.TowIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerTowCategoryOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否已删除" label-width="120px">
            <el-select v-model="queryParams.is_Recycle" size="small" clearable style="width:100px;" placeholder="请选择">
              <el-option
                v-for="item in customize_whether"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="来源">
            <el-select v-model="queryParams.sourceIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerSourceOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="级别">
            <el-select v-model="queryParams.gradeIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerGradeOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="地址">
            <template>
              <div>
                <el-cascader
                  size="large"
                  :options="selFindoptions"
                  v-model="SelselectedOptions"
                  style="width: 400px;"
                  @change="SelhandleChange">
                </el-cascader>
              </div>
            </template>
          </el-form-item>


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

          <el-form-item label="合伙人">
            <el-select v-model="queryParams.affiliation_id" clearable placeholder="请选择">
              <el-option
                v-for="item in PartnerOption"
                :key="item.user_id"
                :label="item.nick_name"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="销售">
            <el-select v-model="queryParams.sales_idArr" multiple clearable :disabled="clearableBool" placeholder="请选择">
              <el-option
                v-for="item in SalesOption"
                :key="item.user_id"
                :label="item.nick_name"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="图片是否有效" prop="status" label-width="120px">
            <el-select
              v-model="queryParams.pic_status"
              placeholder="请选中"
              clearable
              readonly="readonly"
              size="small"
              style="width: 115px"
            >
              <el-option
                v-for="dict in PictureWhether"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="主联系人" prop="status" label-width="120px">
            <el-select
              v-model="queryParams.is_maste"
              placeholder="主联系人"
              clearable
              size="medium"
              style="width: 110px"
            >
              <el-option
                v-for="dict in customize_whether"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="性别" prop="status" label-width="120px">
            <el-select
              v-model="queryParams.gender_id"
              placeholder="性别"
              clearable
              size="medium"
              style="width: 110px"
            >
              <el-option
                v-for="dict in SexTypeOption"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status" label-width="120px">
            <el-select
              v-model="queryParams.state"
              placeholder="状态"
              clearable
              size="medium"
              style="width: 110px"
            >
              <el-option
                v-for="dict in AccountPeopleStateTypeOption"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>


        </el-form>

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <!--条件选择-->
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
                  style="width: 110px;background-color: transparent;color: black"
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
              <el-button icon="el-icon-refresh" type="success" plain size="mini" @click="PavCArr">查看图片</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" v-hasPermi="['yunze:ContactsPicture:list']"
                           @queryTable="getList"></right-toolbar>
          </el-row>
        </el-form>

        <!-- :lg="4"    :sm="5" :xs="10"    -->
        <el-row class="demo-image" flex-direction="row" @selection-change="handleSelectionChange" :gutter="100"
                v-show="TuPArr">
          <el-col :lg="4" :md="6" :sm="8" :xs="12" class="block" v-for="(fit,index) in customerImgArr"
                  style="margin-bottom: 20px;"
                  :key="index">
            <div class="box">
              <el-image
                class="demo-image__preview"
                :src="fit.pic_url"
                fit="scale-down"
                :title="fit.name"
                :preview-src-list="getArrListDeptId()"
              ></el-image>
            </div>

            <div class="demonstration mytext" :title="fit.cup_desc">描述：{{ fit.cup_desc }}</div>
            <div class="demonstration mytext" :title="fit.c_name">公司账户：{{ fit.c_name }}</div>
            <div class="demonstration mytext" :title="fit.name">姓名：{{ fit.name }}</div>
            <div class="demonstration mytext" :title="fit.telephone">电话：{{ fit.telephone }}</div>
            <div class="demonstration mytext" :title="fit.qq" style="padding-left: 3px;"> QQ ：{{ fit.qq }}</div>
            <div class="demonstration mytext" :title="fit.nailed">钉钉：{{ fit.nailed }}</div>
            <div class="demonstration mytext" :title="fit.email">邮箱：{{ fit.email }}</div>
            <div class="demonstration mytext" :title="fit.remarks">备注：{{ fit.remarks }}</div>
            <div class="demonstration mytext" :title="fit.job_title">职务：{{ fit.job_title }}</div>

            <el-dropdown>
              <el-button type="primary" size="small">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <template>
                  <el-button
                    v-if="fit.pic_status==1"
                    size="mini"
                    type="primary"
                    plain
                    @click="StatusInvalid(fit)"
                    v-hasPermi="['yunze:XsglCustomer:invalid']"
                  >删除
                  </el-button>
                  <br><br>
                  <el-button
                    v-if="fit.pic_status==0"
                    size="mini"
                    type="success"
                    plain
                    @click="RecoveryEffective(fit)"
                    v-hasPermi="['yunze:XsglCustomer:effectivesta']"
                  >回收
                  </el-button>
                  <br><br>
                  <el-button
                    v-if="fit.pic_status==0"
                    size="mini"
                    type="danger"
                    plain
                    @click="singleDelete(fit)"
                    v-hasPermi="['yunze:XsglCustomer:deurl']"
                  >彻底删除
                  </el-button>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :page-sizes="pageSizes"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>


  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";
import {CodeToText, regionDataPlus} from "element-china-area-data";
import {
  findSalesPartner,
  LiaisonList,
  Deurl,
  Invalid,
  Effectivesta
} from "@/api/yunze/XSGL/customer/customer";

export default {
  name: "index",
  data() {
    return {

      selFindoptions: regionDataPlus,

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
      pageSizes: [6, 12, 24, 36, 48, 60, 120],//分页
      CodeToText: CodeToText,
      tools: tools,
      //抄送任务id 名字
      NameAddCcUrl: [],
      selTime: '',//时间选择
      mainwidth: 24,//宽度
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 用户表格数据
      cardList: null,
      // 是否显示弹出层
      open: false,
      clearableBool: false,//所属销售是否 禁止选择
      SexTypeOption: [],
      AccountPeopleStateTypeOption: [],
      // 表单参数
      form: {},

      PictureWhether: [], //图片是否有效
      typeOptions: [],//条件选择
      // 客户一级分类
      CustomerOneCategoryOption: [],
      // 客户二级分类
      CustomerTowCategoryOption: [],
      customize_whether: [],//自定义是否
      CustomerSourceOptions: [],// 客户 来源
      // 客户级别
      CustomerGradeOption: [],
      SelselectedOptions: [],
      // 时间查询类型 数据字典
      timetypeOptions: [],
      PartnerOption: [],//合伙人
      SalesOption: [],//销售
      customerImgArr: [],//客户照片数组
      TuPArr: false,//图片查看
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 6,
        pic_status: null,
      },

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


    //加载 查询条件
    if (window['Contact_picture'] != undefined && window['Contact_picture'] != null && window['Contact_picture'] != '') {
      this.typeOptions = window['Contact_picture'];
    } else {
      this.getDicts("yz_Contact_picture").then(response => {
        window['Contact_picture'] = response.data;
        this.typeOptions = window['Contact_picture'];
      });
    }

    //加载 图片是否有效
    if (window['PictureWhether'] != undefined && window['PictureWhether'] != null && window['PictureWhether'] != '') {
      this.PictureWhether = window['PictureWhether'];
    } else {
      this.getDicts("yz_PictureWhether").then(response => {
        window['PictureWhether'] = response.data;
        this.PictureWhether = window['PictureWhether'];
      });
    }

    //加载 客户类型
    if (window['CustomerSortTypeOption'] != undefined && window['CustomerSortTypeOption'] != null && window['CustomerSortTypeOption'] != '') {
      this.CustomerOneCategoryOption = window['CustomerOneCategoryOption'];
    } else {
      this.getDicts("yz_CustomerSort_type").then(response => {
        window['CustomerSortTypeOption'] = response.data;
        this.CustomerSortTypeOption = window['CustomerSortTypeOption'];
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

    //加载 自定义 是否 0 1 否 是
    if (window['customize_whether'] != undefined && window['customize_whether'] != null && window['customize_whether'] != '') {
      this.customize_whether = window['customize_whether'];
    } else {
      this.getDicts("yunze_customize_whether").then(response => {
        window['customize_whether'] = response.data;
        this.customize_whether = window['customize_whether'];
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

    //加载 客户 级别
    if (window['CustomerGradeOption'] != undefined && window['CustomerGradeOption'] != null && window['CustomerGradeOption'] != '') {
      this.CustomerGradeOption = window['CustomerGradeOption'];
    } else {
      this.getDicts("yz_customer_grade").then(response => {
        window['CustomerGradeOption'] = response.data;
        this.CustomerGradeOption = window['CustomerGradeOption'];
      });
    }

    //加载 查询时间类型 条件
    if (window['customer_selTimeType'] != undefined && window['customer_selTimeType'] != null && window['customer_selTimeType'] != '') {
      this.timetypeOptions = window['customer_selTimeType'];
    } else {
      this.getDicts("yz_customer_selTimeType").then(response => {
        window['customer_selTimeType'] = response.data;
        this.timetypeOptions = window['customer_selTimeType'];
      });
    }
    //加载 系统 性别
    if (window['SexTypeOption'] != undefined && window['SexTypeOption'] != null && window['SexTypeOption'] != '') {
      this.SexTypeOption = window['SexTypeOption'];
    } else {
      this.getDicts("sys_user_sex").then(response => {
        window['SexTypeOption'] = response.data;
        this.SexTypeOption = window['SexTypeOption'];
      });
    }

    //加载 客户 联系人 状态
    if (window['AccountPeopleStateTypeOption'] != undefined && window['AccountPeopleStateTypeOption'] != null && window['AccountPeopleStateTypeOption'] != '') {
      this.AccountPeopleStateTypeOption = window['AccountPeopleStateTypeOption'];
    } else {
      this.getDicts("yz_customer_state").then(response => {
        window['AccountPeopleStateTypeOption'] = response.data;
        this.AccountPeopleStateTypeOption = window['AccountPeopleStateTypeOption'];
      });
    }
    //条件查询 默认选择第一个
    this.queryParams.type ='1';

  },
  methods: {

    //设置管理员 选项
    SetAdminOption() {
      if (this.SalesOption != null && this.SalesOption.length > 0) {
        this.AdminOption = [];
        for (let i = 0; i < this.SalesOption.length; i++) {
          let Obj = this.SalesOption[i];
          if (Obj.user_id == '1') {
            this.AdminOption.push(Obj);
          }
        }
      }
    },

    /*客户 查看 图片预览*/
    getArrListDeptId(index) {
      let images = [];
      for (let i = 0; i < this.customerImgArr.length; i++) {
        images.push(this.customerImgArr[i].pic_url);
      }
      return images
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
      if (this.queryParams.province != null && this.queryParams.province == '全部') {
        this.queryParams.province = null;
        this.queryParams.city = null;
        this.queryParams.district = null;
      }
      if (this.queryParams.city != null && this.queryParams.city == '全部') {
        this.queryParams.city = null;
        this.queryParams.district = null;
      }
      if (this.queryParams.district != null && this.queryParams.district == '全部') {
        this.queryParams.district = null;
      }
      //console.log(this.queryParams);
    },
    //图片查看按钮
    PavCArr() {
      this.TuPArr = this.TuPArr ? false : true;
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 查询执行任务列表 */
    getList() {
      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      LiaisonList(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        // console.log(jsonobj);
        if (jsonobj.code == 200) {
          let imgArr = [];
          for (let i = 0; i < jsonobj.Data.Data.length; i++) {
            let obj = jsonobj.Data.Data[i];
            let Pwd_Str = tools.encrypt(JSON.stringify({"imagePath": obj.pic_url}));
            obj.pic_url = (process.env.VUE_APP_BASE_API + "/yunze/productPic/readImage?map=" + Pwd_Str);
            imgArr.push(obj);
          }
          this.customerImgArr = imgArr;
          this.total = jsonobj.Data.Pu.rowCount;
        } else {
          this.msgError(jsonobj.msg);
        }
      });
    },


    /**单个图片删除*/
    singleDelete(row) {
      let map = {};
      map.id = row.id;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      tools.openAsk(this, 'warning', "您确定要彻底删除这张图片吗？", this.deleteID, Pwd_Str);
    },
    deleteID(Pwd_Str) {
      Deurl(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        // console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getList();
          this.msgSuccess(jsonobj.msg);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      });
    },

    /**修改图片状态 无效*/
    StatusInvalid(row) {
      let map = {};
      map.id = row.id;
      console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      Invalid(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getList();
          this.msgSuccess(jsonobj.msg);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      });
    },

    /**回收图片状态 有效*/
    RecoveryEffective(row) {
      let map = {};
      map.id = row.id;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      Effectivesta(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getList();
          this.msgSuccess(jsonobj.msg);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      });
    },

    //销售执行函数 清除 所属销售其他选项只留自己的
    Sales_execution() {
      let username = tools.getCookie("username");
      //console.log(username)
      if (username != 'admin') {
        //console.log(this.SalesOption)
        if (this.SalesOption != null && this.SalesOption.length > 0) {
          let SalesOption = JSON.parse(JSON.stringify(this.SalesOption));
          this.SalesOption = [];
          for (let i = 0; i < SalesOption.length; i++) {
            let Obj = SalesOption[i];
            if (Obj.user_name == username) {
              let arr = [];
              if (Obj.Btns != null && Obj.Btns.indexOf(',') != -1) {
                arr = Obj.Btns.split(",");
              } else {
                arr = [Obj.Btns]
              }
              if (tools.VerificationValIsArray(arr, "yunze:sys:Sales")) {
                this.SalesOption.push(Obj);
                this.queryParams.sales_idArr = [Obj.user_id];
                this.clearableBool = true;
              } else {
                this.SalesOption = SalesOption;
              }
              break;
            } else {
              if (i == SalesOption.length - 1) {
                this.getList();
              }
            }
          }
        }
        this.getList();
      } else {
        this.getList();
      }
    },

    SelhandleChange(value) {//省市区 获取
      for (let i = 0; i < value.length; i++) {
        if (i == 0) {
          this.queryParams.province = CodeToText[value[i]];
        } else if (i == 1) {
          this.queryParams.city = CodeToText[value[i]];
        } else if (i == 2) {
          this.queryParams.district = CodeToText[value[i]];
        }
      }
      //选择 非省 市 区 时  重新赋值 市 区
      if (value.length == 2) {
        this.queryParams.district = null;
      } else if (value.length == 1) {
        this.queryParams.city = null;
        this.queryParams.district = null;
      }
    },
    handleChange(value) {//省市区 获取
      for (let i = 0; i < value.length; i++) {
        if (i == 0) {
          this.form.province = CodeToText[value[i]];
        } else if (i == 1) {
          this.form.city = CodeToText[value[i]];
        } else if (i == 2) {
          this.form.district = CodeToText[value[i]];

        }
      }
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
      this.queryParams.pageSize = 6;
      this.selTime = null;
      this.handleQuery();
    },

  }
};
</script>

<style scoped>
.box {
  max-width: 180px;
  height: 180px;
  overflow: hidden;

}

.mytext {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

