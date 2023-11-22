<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <template>
            <div>
              <el-divider content-position="left"><span color="#2894FF"><h2>入款记录</h2></span></el-divider>
            </div>
          </template>


          <!-- 公司账户 -->
          <el-form-item label="公司账户" prop="status" label-width="100px">
            <el-select
              v-model="queryParams.Dids_FatName"
              placeholder="请选中"
              clearable
              size="small"
              style="width: 200px"
            >
              <el-option
                v-for="dict in CompanyNameAccount"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <!-- 销售工程师 -->
          <el-form-item label="销售工程师" prop="status" label-width="100px">

            <el-select v-model="queryParams.c_userIdArr" multiple clearable :disabled="clearableBool" size="small"
                       style="width: 115px" placeholder="请选择">

              <el-option
                v-for="dict in SalesOption"
                :key="dict.user_id"
                :label="dict.nick_name"
                :value="dict.user_id"
              />
            </el-select>
          </el-form-item>
          <!--入款状态-->
          <el-form-item label="入款状态" prop="status">
            <el-select
              v-model="queryParams.Dio_DsID"
              placeholder="请选中"
              clearable
              readonly="readonly"
              size="small"
              style="width: 115px"
            >
              <el-option
                v-for="dict in Remittance_State"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!-- 年日期选择 -->
          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.Dids_Time"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in Dids_Time_date"
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
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                style="margin-left: 30px"
                :loading="exportLoading"
                @click="handleExport"
                v-hasPermi="['yunze:card:exportData']"
              >导出
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>


      </el-col>
      <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
        <el-table-column label="公司账户" align="center" prop="Dids_FatName" v-if="columns[0].visible">
          <template slot-scope="scope">
            {{ tools.getDkeyValue(CompanyNameAccount, scope.row.Dids_FatName) }}
          </template>
        </el-table-column>
        <el-table-column label="入款日期" align="center" prop="Dids_Time" v-if="columns[1].visible"/>
        <el-table-column label="合同日期" align="center" prop="c_time" v-if="columns[2].visible"/>
        <el-table-column label="单位" align="center" prop="c_name" v-if="columns[3].visible"/>
        <el-table-column label="销售单位" align="center" prop="c_fatName" v-if="columns[4].visible"/>
        <el-table-column label="工程师" align="center" prop="c_userName" v-if="columns[5].visible"/>
        <el-table-column label="合同金额" align="center" prop="c_contract_amount" v-if="columns[6].visible"/>
        <el-table-column label="入款金额" align="center" prop="Dids_Amount" v-if="columns[10].visible"/>
        <el-table-column label="实际金额" align="center" prop="c_the_actual_amount" v-if="columns[7].visible"/>
        <el-table-column label="未到金额" align="center" prop="Dio_Unpaid" v-if="columns[8].visible"/>
        <el-table-column label="入款状态" align="center" prop="Dio_DsID" v-if="columns[9].visible">
          <template slot-scope="scope">
            {{ tools.getDkeyValue(Remittance_State, scope.row.Dio_DsID) }}
          </template>
        </el-table-column>
        <el-table-column label="入款合计" align="center" prop="Dio_Deposit_Total" v-if="columns[11].visible"/>
        <el-table-column label="备注" align="center" prop="Dids_Remarks" v-if="columns[12].visible"/>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" size="small">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-hasPermi="['yunze:remittance:addIncome']" size="small" @select="menuActive"
                                  @click.native="handleUpdate(scope.row)">修改
                </el-dropdown-item>
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

      <!--修改-->
      <el-drawer
        :visible.sync="drawer"
        :with-header="false"
        size="92%">
        <!-- 子 组件-->
        <AddRem ref="updateRem"
                :drawer="drawer"
                @SetObj="SetObj"
                :window="window"
                :AddRemFrom="AddRemFrom"
                :IDFrom="IDFrom"
                :AddRemList="AddRemList"
                :handleUpdate="handleUpdate"
                :PaymentDetails="PaymentDetails"
                :AddRemObjFrom="AddRemObjFrom"
        />
      </el-drawer>

    </el-row>


  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";
import {findSalesPartner} from "@/api/yunze/XSGL/customer/customer";
import {AddRemittance, DeteilsIncome, ExportIncome} from "@/api/yunze/CWGL/remittance/remittance";
import AddRem from "@/views/yunze/XSGL/remittance/AddRem";
import {CompanyName} from "@/api/yunze/CWGL/Firm/Firm";
import {ExportInventorydetails} from "@/api/yunze/warehouse/Inventorydetails";

export default {
  components: {//挂载
    AddRem,
  },
  name: "RemDetails",
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
      selTime: [],

      // 导出遮罩层
      exportLoading: false,
      PaymentDetails: false, //加载
      // 遮罩层
      loading: true,
      tools: tools,
      window: window,
      drawer: false,//修改展示
      //抄送任务id 名字
      NameAddCcUrl: [],
      Company_account: [],//公司账户
      CompanyNameAccount: [],//公司名称
      mainwidth: 24,//宽度
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 合同入款信息 map
      IDFrom: {
        Dids_ID: null,
        Dio_ID: null,
        Dio_Unpaid: null,
        Dio_Deposit_Total: null,
      },
      // 模板 map
      AddRemObjFrom: {
        Dids_FatName: null,
        Dids_Time: tools.gitData(),
        Dids_Amount: null,
        Dids_Remarks: null,
      },
      // 总条数
      total: 0,
      // 用户表格数据
      cardList: null,
      // 是否显示弹出层
      open: false,
      //条件选择
      typeOptions: [],
      // 表单参数
      form: {},
      SalesOption: [],
      Remittance_State: [],
      Dids_Time_date: [],
      HeadquartersOption: [], //  总部门所有人
      HeadquartersnOrmalOption: [], //  总部门所有人 【状态正常 】
      //AddRem 参数
      AddRemFrom: {},
      timer: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        c_userIdArr: [],
        Dids_Time: null,
      },
      clearableBool: false,//所属销售是否 禁止选择
      // 列信息
      columns: [
        {key: 0, label: `抄送任务id`, visible: true},
        {key: 1, label: `抄送任务id`, visible: true},
        {key: 2, label: `推送API`, visible: true},
        {key: 3, label: `推送邮件`, visible: true},
        {key: 4, label: `抄送结果`, visible: true},
        {key: 5, label: `备注`, visible: true},
        {key: 6, label: `抄送参数`, visible: true},
        {key: 7, label: `创建时间`, visible: true},
        {key: 8, label: `抄送次数`, visible: true},
        {key: 9, label: `最近一次抄送时间`, visible: true},
        {key: 10, label: `最近一次抄送时间`, visible: true},
        {key: 11, label: `最近一次抄送时间`, visible: true},
        {key: 12, label: `最近一次抄送时间`, visible: true},
      ],
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


    //加载 公司账户
    if (window['Company_account'] != undefined && window['Company_account'] != null && window['Company_account'] != '') {
      this.Company_account = window['Company_account'];
    } else {
      this.getDicts("Company_account").then(response => {
        window['Company_account'] = response.data;
        this.Company_account = window['Company_account'];
      });
    }

    //加载 对应公司账户表 名称
    if (window['CompanyNameAccount'] != undefined && window['CompanyNameAccount'] != null && window['CompanyNameAccount'] != '') {
      this.CompanyNameAccount = window['CompanyNameAccount'];
    } else {
      CompanyName().then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        window['CompanyNameAccount'] = jsonobj.Data;
        //console.log(jsonobj.Data)
        this.CompanyNameAccount = window['CompanyNameAccount'];
      });
    }

    //加载 时间选择
    if (window['Dids_Time_date'] != undefined && window['Dids_Time_date'] != null && window['Dids_Time_date'] != '') {
      this.Dids_Time_date = window['Dids_Time_date'];
    } else {
      this.getDicts("Dids_Time_date").then(response => {
        console.log(response.data)
        window['Dids_Time_date'] = response.data;
        this.Dids_Time_date = window['Dids_Time_date'];
      });
    }

    //加载 查询条件
    if (window['yunze_Income_details'] != undefined && window['yunze_Income_details'] != null && window['yunze_Income_details'] != '') {
      this.typeOptions = window['yunze_Income_details'];
    } else {
      this.getDicts("yunze_Income_details").then(response => {
        window['yunze_Income_details'] = response.data;
        this.typeOptions = window['yunze_Income_details'];
      });
    }

    //加载 入款状态
    if (window['Remittance_State'] != undefined && window['Remittance_State'] != null && window['Remittance_State'] != '') {
      this.Remittance_State = window['Remittance_State'];
    } else {
      this.getDicts("cwgl_Deposit_state").then(response => {
        window['Remittance_State'] = response.data;
        this.Remittance_State = window['Remittance_State'];
      });
    }

  },

  methods: {

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
              //console.log(arr)
              let arr = [];
              if (Obj.Btns != null && Obj.Btns.indexOf(',') != -1) {
                arr = Obj.Btns.split(",");
              } else {
                arr = [Obj.Btns]
              }
              if (tools.VerificationValIsArray(arr, "yunze:sys:Sales")) {
                this.SalesOption.push(Obj);
                this.queryParams.c_userIdArr = [Obj.user_id];
                this.clearableBool = true;
                this.sales_idArr = JSON.parse(JSON.stringify([Obj.user_id]));
              } else {
                this.SalesOption = SalesOption;
              }
              break;
            }
          }
        }
        this.getList();
      } else {
        this.getList();
      }
    },


    //选中 当前登录用户
    SetAdminOption() {
      if (this.SalesOption != null && this.SalesOption.length > 0) {
        this.AdminOption = [];
        for (let i = 0; i < this.SalesOption.length; i++) {
          let Obj = this.SalesOption[i];
          this.AdminOption.push(Obj);
        }
      }
    },

    menuActive() {
      this.$refs.navDrawer.closeDrawer()
    },

    /**操作下的修改*/
    handleUpdate(row) {

      this.getList();
      this.drawer = true;
      this.PaymentDetails = false;
      row.Dio_DsID = "" + row.Dio_DsID;
      this.resetQuery();
      this.IDFrom = row;
      console.log(row)
    },

    /*获取查询参数*/
    getParams() {

      if (this.$refs.dept != undefined & this.$refs.dept != null & this.$refs.dept != 'undefined') {
        //console.log(this.$refs.dept.getCheckedKeys());
        if (this.$refs.dept.getCheckedKeys().length > 0) {
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }
      if (tools.Is_null(this.queryParams.Dids_Time) && this.selTime != null) {
        // console.log(this.selTime);
          this.queryParams.staTime = this.selTime[0];
          this.queryParams.endTime = this.selTime[1];
      }
    },

    /**修改 入款信息*/
    AddRemList(map) {
      //console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      AddRemittance(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.drawer = false;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    //设置数据
    SetObj(Key, obj) {
      //console.log(obj);
      switch (Key) {
        case 'SetPaymentDetails':
          this.PaymentDetails = obj;//设置  编辑  是否已经加载 [提供给子组件使用]
          break;
        case 'Setdrawer':
          this.drawer = obj;// 设置 drawer
          break;
        case 'Setparameter':
          this.AddRemObjFrom = obj;// 设置 参数
          break;
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 查询执行任务列表 */
    getList() {
      this.loading = true;
      this.getParams();
      // console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      DeteilsIncome(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.cardList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
            if(this.CompanyNameAccount != null && this.CompanyNameAccount != '' && this.CompanyNameAccount != undefined){
              this.CompanyNameAccount = window['CompanyNameAccount'].concat(this.Company_account);//进入页面就合并
            }

          } else {
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },

    /**导出*/
    handleExport() {
      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      ExportIncome(Pwd_Str).then(response => {
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
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.selTime = null;
      this.handleQuery();
    },


  },
};
</script>

<style>

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

