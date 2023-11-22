<template>
  <div>
    <!-- 添加客户联系信息 -->
    <el-card shadow="always">
      <el-form ref="form" :model="form" label-width="160px">
        <template>
          <div>
            <el-divider content-position="left"><span color="#2894FF"><h2>客户联系信息
               <el-button @click="Close" size="mini" type="primary" style="margin-left: 35px">关闭</el-button>
            </h2></span></el-divider>
          </div>
        </template>
        <br><br>
        <!-- 客户查询条件 组件 -->
        <CustomerInquiries
          ref="customerInquiries"
          :CustomerOneCategoryOption="CustomerOneCategoryOption"
          :CustomerTowCategoryOption="CustomerTowCategoryOption"
          :Sel="Sel"
          :loadingSelOption="loadingSelOption"
          :CustomerGradeOption="CustomerGradeOption"
          :selFindoptions="selFindoptions"
          :setCustomerArr="setCustomerArr"
          @SetSel="SetSel"
        />

        <el-row>
          <el-col :span="8">
            <el-form-item>
                <span slot="label">
                  企业名称：
                  <el-tooltip placement="right">
                    <div slot="content">
                      客户信息 根据上方筛选条件得到
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              <el-select v-model="form.CCG_CoID" placeholder="请选择" @change="changeC_id" style="width: 400px;">
                <el-option
                  v-for="item in CustomerOption"
                  :key="item.id"
                  :label="item.c_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item>
                <span slot="label">
                  销售业务员：
                  <el-tooltip placement="right">
                    <div slot="content">
                      销售业务员：
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              <el-select v-model="form.CCG_UserID" placeholder="请选择">
                <el-option
                  v-for="item in SalesOption"
                  :key="item.user_id"
                  :label="item.nick_name"
                  :value="item.user_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="5">
            <el-form-item>
                <span slot="label">
                  联系时间：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      联系时间
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>

              <el-date-picker
                v-model="form.CCG_Time"
                placeholder="选择日期"
                size="small"
                type="date"
                style="width: 130px"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsDay">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item>
                <span slot="label">
                    客户联系人姓名：
                    <el-tooltip placement="right">
                      <div slot="content">
                        客户联系人姓名
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
              <el-select v-model="form.CCG_CsfName" placeholder="客户联系人姓名" style="width: 140px;" @change="changeParty_a">
                <el-option
                  v-for="item in PeopleOption"
                  :key="item.id"
                  :label="item.NAME"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item>
              <span slot="label">
                  客户联系人电话：
                  <el-tooltip placement="right">
                    <div slot="content">
                      客户联系人电话
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              <el-input v-model="form.CCG_CsfPhone" ref="update" placeholder="客户联系人电话"/>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item>
                <span slot="label">
                  联系方式：
                  <el-tooltip placement="right">
                    <div slot="content">
                      联系方式：
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
              <el-select v-model="form.CCG_CtID" placeholder="请选择" style="width: 130px;">
                <el-option
                  v-for="dict in Contact_CCG_CtID"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>


        </el-row>


        <div class="tip">
          <el-row>
            <el-col :span="15">
              <el-form-item>
              <span slot="label">
                  议题：
                  <el-tooltip placement="right">
                    <div slot="content">
                      会议内容
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                <el-input v-model="form.CCG_Issue" placeholder="议题"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col :span="15">
            <el-form-item>
                <span slot="label">
                    内容：
                    <el-tooltip placement="right">
                      <div slot="content">
                        选填  内容
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
              <el-input type="textarea" v-model="form.CCG_Content" placeholder="内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item>
                <span slot="label">
                    备注：
                    <el-tooltip placement="right">
                      <div slot="content">
                        选填  备注
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
              <el-input type="textarea" v-model="form.CCG_Remark" placeholder="备注"/>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>

    </el-card>
    <div style="float: right; margin-right: 50px;margin-top: 50px;">
      <el-input v-model="form.cd_id" v-if="false"/>
      <el-button v-if="CustomerAdd" v-hasPermi="['yunze:CustomerContact:NewCustomer']" type="primary" @click="Add">新 增</el-button>
      <el-button v-if="Preservation" v-hasPermi="['yunze:CustomerContact:updateId']" type="primary" @click="UpdaPr">保 存</el-button>
      <el-button type="primary" @click="Close()">关 闭</el-button>


    </div>


    <!-- 编辑、详情 触发加载数据函数-->
    <span v-if="show_ds ==true && Editexecute == false">
        {{ LoadData() }}
    </span>

  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";
import {CodeToText} from "element-china-area-data";
import CustomerInquiries from '../../common/CustomerInquiries';
import CommoditySelection from "../../common/CommoditySelection";
import {findCustomerArr, fnidAccountArr, fnidPeopleArr} from "@/api/yunze/XSGL/customer/customer";
import {AssignmentID} from "@/api/yunze/XSGL/CustomerContact/CustomerContact";

//客户筛选条件 组件

export default {
  components: {//挂载
    CustomerInquiries,
    CommoditySelection
  },
  /*获取传值
  * 官方文档
  * https://cn.vuejs.org/v2/guide/components-props.html#%E4%BC%A0%E5%85%A5%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%80%E6%9C%89-property
  * String Number Boolean Array Object Date Function Symbol
  * */
  props: {
    CustomerOneCategoryOption: Array,// 客户一级分类
    CustomerTowCategoryOption: Array, // 客户二级分类
    form: Object,//销售合同 信息查询参数.
    loadingSelOption: Boolean,//是否 加载 查询客户信息框
    CustomerGradeOption: Array,// 客户级别
    selFindoptions: Array,//是省市区三级联动数据（带“全部”选项）
    CustomerAdd: Boolean,//新增
    Preservation: Boolean,//修改
    SubAdd: Function,//新增 函数
    SubUpd: Function,//修改 函数
    SalesOption: Array,//销售
    Contact_CCG_CtID: Array, //联系方式
    getTowClass: Function,//获取二级分类
    window: Window,//window 操作对象
    Editexecute: Boolean,//编辑时加载是否 已执行
    show_ds: Boolean,//当前界面是否显示
    sales_idArr: Array,// 控制查询时仅可看 所属销售的客户信息
  },
  data() {
    return {
      //当前查询参数
      Sel: {
        gradeIdArr: [],
        oneIdArr: [],
        TowIdArr: [],
        sourceIdArr: [],
        province: null,
        city: null,
        district: null,
        c_name: null,
        sales_idArr: [],
      },

      tools: tools,//tools 工具类
      PeopleOption: [],//根据 查询条件加载的 客户联系人
      AccountOption: [],//根据 查询条件加载的 客户地址
      CustomerOption: [],//根据 查询条件加载的销售客户信息

      pickerOptionsDay: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', tools.gitData());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            picker.$emit('pick', tools.getBeforeDate(1));
          }
        }, {
          text: '一周前',
          onClick(picker) {
            picker.$emit('pick', tools.getBeforeDate(7));
          }
        }]
      },
    };
  },
  mounted() {
    this.Sel.sales_idArr = this.sales_idArr;
    // console.log(this.Sel)
  },
  methods: {

    //加载界面 数据
    LoadData() {
      this.$emit("SetObj", "SetEditexecute", true);//已加载 载入合同
      this.finddata(this.form);

    },

    /*获取详细信息*/
    finddata(row) {
      let map = {};
      map.CCG_ID = row.CCG_ID;
      // console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      AssignmentID(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            // console.log(jsonobj);
            let CMap = jsonobj.Data.CMap;
            // console.log(CMap)
            // // 数据格式化
            this.Sel.c_name = CMap.c_name;
            CMap.CCG_CtID = "" + CMap.CCG_CtID;
            CMap.CCG_UserID = Number(CMap.CCG_UserID);
            // console.log(CMap)
            // console.log(SalesOption)


            let SelMap = {};

            this.setCustomerArr(SelMap);
            this.$emit("SetObj", "Setform", CMap);//已加载
          } else {
            this.msgError(jsonobj.msg);
          }
        }
      );
    },


    handleChange(value) {//省市区 获取
      //console.log(value)
      let Map = JSON.parse(JSON.stringify(this.Sel));
      for (let i = 0; i < value.length; i++) {
        if (i == 0) {
          Map.province = CodeToText[value[i]];
        } else if (i == 1) {
          Map.city = CodeToText[value[i]];
        } else if (i == 2) {
          Map.district = CodeToText[value[i]];
        }
      }
      //选择 非省 市 区 时  重新赋值 市 区
      if (value.length == 2) {
        Map.district = null;
      } else if (value.length == 1) {
        Map.city = null;
        Map.district = null;
      }
      this.SetSel(Map);
    },


    //set 客户信息 查询参数
    SetSel(Map) {
      this.Sel = Map;
      //console.log(this.Sel)
    },


    //甲方代表切换 联动变更 联系人电话
    changeParty_a() {
      this.form.CCG_CsfPhone = window["customerPeopleTelephone_" + this.form.CCG_CsfName];
    },

    //企业名称 切换联动变更 甲方代表 、电话 地址
    changeC_id() {
      let map = {};
      map.id = this.form.CCG_CoID;

      // 清空 甲方代表 电话 地址 信息
      this.form.CCG_CsfName = null;
      this.form.CCG_CsfPhone = null;
      this.form.c_party_a_address = null;
      this.setPeopleArr(map, null); //加载联系人信息
      this.setAccountArr(map, null); //加载 地址 信息
    },


    //加载 地址信息
    setAccountArr(map, Selected) {
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      fnidAccountArr(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        // console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.AccountOption = jsonobj.Data;
          if (this.AccountOption != null && this.AccountOption.length > 0) {

            if (Selected != null) {
              for (let i = 0; i < this.AccountOption.length; i++) {
                let obj = this.AccountOption[i];
                if (obj.Cat_Address == Selected) {
                  this.form.c_party_a_address = obj.Cat_Address;
                }
              }
            } else {
              this.form.c_party_a_address = this.AccountOption[0].Cat_Address;//默认选择第一个
            }
          }
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },


    changOneClass(val) {
      let child_id = window['child_id_9_' + val];
      this.getTowClass({'Cy_Sort': child_id[0], "child_id_sel": val});
    },


    //获取公司信息
    setCustomerArr(SelectedMap) {
      // console.log(SelectedMap);
      if (this.Sel.gradeIdArr.length > 0 || this.Sel.oneIdArr.length > 0 || this.Sel.TowIdArr.length > 0 ||
        tools.Is_null(this.Sel.province) == true || tools.Is_null(this.Sel.city) == true || tools.Is_null(this.Sel.district) == true ||
        tools.Is_null(this.Sel.c_name) == true) {
        // 清空 甲方代表 电话 地址 信息
        this.form.CCG_CoID = null;
        this.form.CCG_CsfName = null;
        this.form.CCG_CsfPhone = null;
        this.form.c_party_a_address = null;

        let Pwd_Str = tools.encrypt(JSON.stringify(this.Sel));
        findCustomerArr(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.CustomerOption = jsonobj.Data;
            if (this.CustomerOption != null && this.CustomerOption.length > 0) {
              let map = {};

              let Sel_c_party_a_name = null;
              let Sel_c_party_a_address = null;
              if (SelectedMap != null) {
                Sel_c_party_a_name = SelectedMap.Sel_c_party_a_name;
                Sel_c_party_a_address = SelectedMap.Sel_c_party_a_address;
                let Sel_c_name = SelectedMap.Sel_c_name;
                for (let i = 0; i < this.CustomerOption.length; i++) {
                  let obj = this.CustomerOption[i];
                  if (Sel_c_name == obj.c_name) {
                    this.form.CCG_CoID = obj.id;
                  }
                }
              } else {
                this.form.CCG_CoID = this.CustomerOption[0].id;//默认选择第一个  企业名称
              }
              map.id = this.form.CCG_CoID;
              this.setPeopleArr(map, Sel_c_party_a_name); //加载联系人信息
              this.setAccountArr(map, Sel_c_party_a_address); //加载 地址 信息
            }
          } else {
            let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
            this.msgError(msg);
          }
        })
      } else {
        this.msgError("请选择查询条件！");
      }
    },

    //加载联系人信息
    setPeopleArr(map, Selected) {
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      fnidPeopleArr(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.PeopleOption = jsonobj.Data;
          // console.log(jsonobj.Data)
          if (this.PeopleOption != null && this.PeopleOption.length > 0) {
            let bool = false;
            if (Selected == null) {
              this.form.CCG_CsfName = this.PeopleOption[0].id;//默认选择第一个
              this.form.CCG_CsfPhone = this.PeopleOption[0].telephone;//默认选择第一个
            } else {
              bool = true;
            }
            //界面储存联系人电话
            for (let i = 0; i < this.PeopleOption.length; i++) {
              window["customerPeopleTelephone_" + this.PeopleOption[i].id] = this.PeopleOption[i].telephone;
              if (bool) {//有指定选中时 选中 指定的 数据
                //console.log(this.PeopleOption[i].NAME+"    "+Selected)
                if (this.PeopleOption[i].NAME == Selected) {
                  this.form.CCG_CsfName = this.PeopleOption[i].id;
                  this.form.CCG_CsfPhone = this.PeopleOption[i].telephone;
                }
              }
            }
          }
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    //新增
    Add() {
      //console.log(this.form);
      //console.log(this.CustomerAccountData);
      // console.log(this.CustomerPeopleData);
      let _this = this;
      if (
        tools.VerificationsText(_this, _this.form.CCG_CoID, "请根据筛选条件查询并选择企业信息！") == true &&
        tools.VerificationsText(_this, _this.form.CCG_CsfName, "联系人姓名不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_CtID, "联系方式不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_Time, "联系时间不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_UserID, "销售业务员不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_Issue, "议题不能为空") == true
      ) {

        this.form.CCG_CsfName = tools.getkeyValue(this.PeopleOption, this.form.CCG_CsfName, "id", "NAME");

        this.SubAdd(this.form);
      }
    },
    // 保存
    UpdaPr() {

      let _this = this;
      if (
        tools.VerificationsText(_this, _this.form.CCG_CoID, "请根据筛选条件查询并选择企业信息！") == true &&
        tools.VerificationsText(_this, _this.form.CCG_CsfName, "联系人姓名不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_CtID, "联系方式不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_Time, "联系时间不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_UserID, "销售业务员不能为空") == true &&
        tools.VerificationsText(_this, _this.form.CCG_Issue, "议题不能为空") == true
      ) {
        this.form.CCG_CsfName = tools.getkeyValue(this.PeopleOption, this.form.CCG_CsfName, "id", "NAME");

        // let map = {};
        // map.CCG_ID = this.form;
        // console.log(map)

        this.SubUpd(this.form);
      }

    },

    //关闭
    Close() {
      this.$emit("SetObj", "Setshow_ds", false);//关闭显示
    },


  }
};
</script>
