<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="BalanceFrom" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <template>
            <div>
              <el-divider content-position="left"><span color="#2894FF"><h2>入款金额合计</h2></span></el-divider>
            </div>
          </template>
          <br>
          <!-- 销售工程师 -->
          <el-form-item label="销售工程师" prop="status" label-width="100px">

            <el-select v-model="BalanceFrom.c_userIdArr" multiple clearable :disabled="clearableBool" size="small"
                       style="width: 115px" placeholder="请选择">

              <el-option
                v-for="item in SalesOption"
                :key="item.user_id"
                :label="item.nick_name"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>
          <!--入款状态-->
          <el-form-item label="入款状态" prop="status" label-width="80px">
            <el-select
              v-model="BalanceFrom.Dio_DsID"
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
              v-model="BalanceFrom.c_time"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in Time_information"
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

        <el-form :model="BalanceFrom" :inline="true" label-width="68px" style="margin-bottom: 10px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <!--条件选择-->
              <el-input
                v-model="BalanceFrom.value"
                placeholder="查询值"
                clearable
                size="small"
                style="width: 350px"
                @keyup.enter.native="handleQuery"
              >
                <el-select
                  v-model="BalanceFrom.type"
                  placeholder="查询条件"
                  clearable
                  slot="prepend"
                  style="width: 110px"
                >
                  <el-option
                    v-for="dict in XSGL_information"
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
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>


        <el-table v-loading="loading" ref="table" :data="BalanceList" :span-method="objectSpanMethod" border
                  @selection-change="handleSelectionChange">
          <el-table-column label="年" align="center" key="y_Time" prop="y_Time" v-if="columns[0].visible">
            <template slot-scope="scope">
              <el-button style="color:rgb(8,0,255);cursor:pointer" type="text" @click="YEAR(scope.row,scope.$index)">
                <U>
                  {{ scope.row.y_Time }}
                </U>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="月" align="center" prop="M" v-if="columns[1].visible">
          </el-table-column>
          <el-table-column label="月入款" align="center" prop="M_Dio_Deposit_Total" v-if="columns[2].visible"/>
          <el-table-column label="月未到款" align="center" prop="M_Dio_Unpaid" v-if="columns[3].visible"/>
          <el-table-column label="年入款" align="center" prop="Dio_Deposit_Total" v-if="columns[4].visible"/>
          <el-table-column label="年末到款" align="center" prop="Dio_Unpaid" v-if="columns[5].visible"/>
        </el-table>

        <br>
        <el-form>
          <el-form-item prop="status" label-width="10px">
            <span style="color: red"><b>未到款金额汇总 : </b></span>
            <el-input size="small" style="width: 178px" readonly="readonly" v-model="BalanceFrom.Dio_Deposit_Total">
            </el-input>
          </el-form-item>
        </el-form>


      </el-col>
    </el-row>
  </div>

</template>

<script>
import tools from "@/utils/yunze/tools";
import {TotalfortIncome, AmountOfMoneyList} from "@/api/yunze/CWGL/remittance/remittance";
import {findSalesPartner} from "@/api/yunze/XSGL/customer/customer";

export default {

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
      selTime: '',
      tools: tools,
      showSearch: false, // 显示搜索条件
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      mainwidth: 24,//宽度
      // 遮罩层
      loading: true,
      window: window,
      XSGL_information: [],//条件选择
      Sales_Engineer: [],//销售工程师
      Remittance_State: [],//入款状态
      BalanceList: [],
      OrdBalanceList: [],
      // objectSpanMethod:()=>{},
      rowSpanArr: [],
      //时间类型
      Time_information: [],
      SalesOption: [],
      //参数
      BalanceFrom: {
        c_userIdArr: [],
      },
      clearableBool: false,//所属销售是否 禁止选择
      position: '0',
      HeadquartersOption: [], //  总部门所有人
      HeadquartersnOrmalOption: [], //  总部门所有人 【状态正常 】

      //列信息
      columns: [
        {key: 1, label: `年`, visible: true},
        {key: 2, label: `月`, visible: true},
        {key: 3, label: `月入款`, visible: true},
        {key: 4, label: `月未到款`, visible: true},
        {key: 5, label: `年入款`, visible: true},
        {key: 6, label: `年未到款`, visible: true},
      ],
      fruits: ["Banana", "Orange", "Apple", "Mango"],
    }
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


    //加载 合同日期
    if (window['Time_information'] != undefined && window['Time_information'] != null && window['Time_information'] != '') {
      this.Time_information = window['Time_information'];
    } else {
      this.getDicts("information_Time_selection").then(response => {
        console.log(response.data)
        window['Time_information'] = response.data;
        this.Time_information = window['Time_information'];
      });
    }


    //加载 查询条件
    if (window['XSGL_information'] != undefined && window['XSGL_information'] != null && window['XSGL_information'] != '') {
      this.XSGL_information = window['XSGL_information'];
    } else {
      this.getDicts("XSGL_Payment_information").then(response => {
        window['XSGL_information'] = response.data;
        this.XSGL_information = window['XSGL_information'];
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
                this.BalanceFrom.c_userIdArr = [Obj.user_id];
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

    /*获取查询参数*/
    getParams() {

      if (this.$refs.dept != undefined & this.$refs.dept != null & this.$refs.dept != 'undefined') {
        //console.log(this.$refs.dept.getCheckedKeys());
        if (this.$refs.dept.getCheckedKeys().length > 0) {
          this.BalanceFrom.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }
      if (tools.Is_null(this.BalanceFrom.c_time) && this.selTime != null) {
        //console.log(this.selTime);
        this.BalanceFrom.staTime = this.selTime[0];
        this.BalanceFrom.endTime = this.selTime[1];
      }
    },


    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /**查询列表*/
    getList() {
      this.loading = true;
      // console.log(this.BalanceFrom)
      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.BalanceFrom));
      TotalfortIncome(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        // console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.BalanceList = jsonobj.Data;
          this.getRowSpan();
          this.Total();
        } else {
          this.msgError(jsonobj.msg);
        }
        this.loading = false;
      });
    },
    //求 年未到款总额
    Total() {
      let sum = '0';
      for (let i = 0; i < this.BalanceList.length; i++) {
        let Obj = this.BalanceList[i];
        sum = tools.accAdd(Obj.Dio_Unpaid, sum);
      }
      this.BalanceFrom.Dio_Deposit_Total = sum;
    },

    /**点击 年 触发事件*/
    YEAR(row, index) {

      //点击 年份时 判断 当前数据中是否已经有 年份下的 子数据 点击年下的-月数据 如果有 说明 当前 点击时去隐藏月数据 如果没有 加载 该年下的月数据
      //循环判断 y_Time 是否有多行
      let count = 0;
      for (let i = 0; i < this.BalanceList.length; i++) {
        let obj = this.BalanceList[i];

        if (obj.y_Time == row.y_Time) {
          count += 1
        }
      }
      let M = tools.Is_null(row.M);
      if (count > 1 || M == true) {
        //折叠 删除 多余 年份下月数据

        this.BalanceList[index].M_Time = '';
        this.BalanceList[index].M_Dio_Deposit_Total = '';
        this.BalanceList[index].M_Dio_Unpaid = '';
        this.BalanceList[index].M = '';

        console.log('折叠 删除 多余 年份下月数据')

        let BalanceList = JSON.parse(JSON.stringify(this.BalanceList));

        // console.log(BalanceList)

        let new_BalanceList = [];
        for (let i = 0; i < BalanceList.length; i++) {
          let obj = BalanceList[i];
          if (i != index) {
            console.log(obj.y_Time + "    " + row.y_Time)
            if (obj.y_Time != row.y_Time) {
              new_BalanceList.push(obj);
            }
          } else {
            obj.M_Dio_Deposit_Total = '';
            obj.M_Dio_Unpaid = '';
            obj.M = '';
            new_BalanceList.push(obj);
          }
        }
        this.BalanceList = new_BalanceList;
        console.log(new_BalanceList)
        this.getRowSpan();//自适应 y_Time 跨列

      } else {
        // 数据库加载 点击年份下月 数据
        this.loading = true;
        let map = {};
        map.YEAR = row.y_Time;
        // console.log(map)
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        AmountOfMoneyList(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {

            // jsonobj.Data.forEach((item) => { //把数组转换成对象
            //   console.dir(item)

            this.BalanceList[index].M_Time = jsonobj.Data[0].M_Time;
            this.BalanceList[index].M_Dio_Deposit_Total = jsonobj.Data[0].M_Dio_Deposit_Total;
            this.BalanceList[index].M_Dio_Unpaid = jsonobj.Data[0].M_Dio_Unpaid;
            this.BalanceList[index].M = jsonobj.Data[0].M;
            jsonobj.Data.splice(0, 1);
            // console.log(PmapArr)
            //console.log(this.BalanceList)
            for (let i = 0; i < jsonobj.Data.length; i++) {
              this.BalanceList.splice(index + 1 + i, 0, jsonobj.Data[i]);
            }

            this.getRowSpan();//自适应 y_Time 跨列


          } else {
            this.msgError(jsonobj.msg);
          }
          this.loading = false;

        });

      }
    },

    // 处理合并表格数据
    getRowSpan() {
      this.rowSpanArr = [];
      this.BalanceList.forEach((item, index) => {
        if (index == 0) {
          this.rowSpanArr.push(1);
          this.position = 0;
        } else {
          if (this.BalanceList[index].y_Time == this.BalanceList[index - 1].y_Time) {
            this.rowSpanArr[this.position] += 1; //项目名称相同，合并到同一个数组中
            this.rowSpanArr.push(0);
            this.BalanceList[index].y_Time = this.BalanceList[index - 1].y_Time;
          } else {
            this.rowSpanArr.push(1);
            this.position = index;
          }

        }
      });
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}) { //合并表格
      // 只合并区域位置   || columnIndex === 4 || columnIndex === 5
      if (columnIndex === 0 || columnIndex === 4 || columnIndex === 5) {
        const _row = this.rowSpanArr[rowIndex];
        return {
          rowspan: _row, //行
          colspan: 1 //列
        };
      }

    },


    /** 搜索按钮操作 */
    handleQuery() {
      this.BalanceFrom.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.BalanceFrom = {};
      this.handleQuery();
    },


  },
  name: "AmountOfMoney.vue"
}
</script>

<style lang="scss" scoped>


</style>
