<template>
  <div>
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="AddRemFrom" ref="queryForm" :inline="true" label-width="68px">
          <template>
            <div>
              <el-divider content-position="left"><span color="#2894FF"><h2>编辑入款记录
              <el-button @click="Colse()" size="mini" type="primary" style="margin-left: 35px">关闭</el-button>
              </h2></span></el-divider>
            </div>
          </template>

          <template>
            <div>
              <el-divider>合同入款信息</el-divider>
            </div>
          </template>

          <el-form-item label="合同编号" prop="status" label-width="550px">
            <el-input size="small" style="width: 240px" readonly="readonly" v-model="IDFrom.Dio_ID"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="合同日期" prop="status" label-width="90px">
            <el-input size="small" style="width: 240px" readonly="readonly" v-model="IDFrom.c_time"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="合同金额" prop="status" label-width="550px">
            <el-input size="small" style="width: 240px" readonly="readonly" v-model="IDFrom.c_contract_amount"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="实际金额" prop="status" label-width="90px">
            <el-input size="small" style="width: 240px" readonly="readonly" v-model="IDFrom.c_the_actual_amount"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="订购单位" prop="status" label-width="550px">
            <el-input size="small" style="width: 240px" readonly="readonly" v-model="IDFrom.c_name"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="开票单位" prop="status" label-width="90px">
            <el-input size="small" style="width: 240px" readonly="readonly" v-model="IDFrom.c_fatName"
                      placeholder="请输入内容"></el-input>
          </el-form-item>

          <template>
            <div>
              <el-divider >入款信息</el-divider>
            </div>
          </template>

          <el-button @click="LoadAdd()"
                     type="primary"
                     size="small"
                     style="margin-left: 30px"
          >新增入款详情
          </el-button>

          <br>
          <br>
          <el-table :data="RemList" >
            <el-table-column label="入款日期" align="center" prop="Dids_Time"/>
            <el-table-column label="公司账户" align="center" prop="Dids_FatName">
              <template slot-scope="scope">
                {{ tools.getDkeyValue(CompanyNameAccount, scope.row.Dids_FatName) }}
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center" prop="Dids_Amount"/>
            <el-table-column label="备注" align="center" prop="Dids_Remarks"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="DelAccount(scope.$index,scope.row)"
                >删除
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <!--入款状态-->
          <el-form-item label="入款状态" prop="status" label-width="550px">
            <el-select
              v-model="IDFrom.Dio_DsID"
              placeholder="请选中"
              clearable
              disabled="disabled"
              readonly="readonly"
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in Remittance_State"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!--入款合计-->
          <el-form-item label="入款合计" prop="status" label-width="70px">
            <el-input size="small" readonly="readonly" v-model="IDFrom.Dio_Deposit_Total" placeholder="请输入内容"></el-input>
          </el-form-item>
          <!--未到款-->
          <el-form-item label="未到款" prop="status" label-width="70px">
            <el-input size="small" readonly="readonly" v-model="IDFrom.Dio_Unpaid" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <div style="float: right;margin-right: 50px;">
            <el-button
              type="primary"
              @click="preservation"
            >保 存
            </el-button>
          </div>
        </el-form>

        <!--载入入款信息模板-->
        <el-dialog :title="AddRemtitle" :visible.sync="AddRem_show" width="960px" append-to-body>
          <el-form ref="form" :model="AddRemObjFrom" label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="金额" prop="status" >
                  <el-input size="small" type="number" clearable style="width: 160px" v-model="AddRemObjFrom.Dids_Amount"
                            :change="checkPrice()" placeholder="请输入内容">金额</el-input>
                </el-form-item>
              </el-col>
              <!--公司账户-->
              <el-col :span="8">
                <el-form-item label="公司账户" prop="status">
                  <el-select
                    v-model="AddRemObjFrom.Dids_FatName"
                    placeholder="请选中"
                    clearable
                    size="small"
                    style="width: 160px"
                  >
                    <el-option
                      v-for="dict in CompanyNameAccount"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!--  入款日期-->
              <el-col :span="8">
                <el-form-item label="入款日期" prop="status">
                  <el-date-picker
                    v-model="AddRemObjFrom.Dids_Time"
                    placeholder="选择日期"
                    size="small"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: 160px"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <br>
            <el-form-item label="备注">
              <el-input v-model="AddRemObjFrom.Dids_Remarks" style="width: 775px" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-if="newlyAdded" type="primary" @click="addAFAddRem()">新 增</el-button>
            <el-button v-if="Determine" type="primary" @click="submitAdd">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 编辑 查询入款详情 触发函数-->
        <span v-if="drawer ==true && PaymentDetails == false">
          {{ loadDingData() }}
        </span>


      </el-col>
    </el-row>

  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";
import {CompanyName} from "@/api/yunze/CWGL/Firm/Firm";
import { SleIncome} from "@/api/yunze/CWGL/remittance/remittance";
export default {
  //参数
  props: {//接收参数与传入参数保持顺序一致好找问题！！！
    drawer: Boolean,//加载修改
    SetObj: Function,//父组件赋值 函数
    window: Window,//window 操作对象
    AddRemFrom: Object,//对象
    IDFrom: Object,//合同
    AddRemList: Function,//新增展示
    PaymentDetails: Boolean,
    AddRemObjFrom: Object,
  },
  data() {
    return {
      newlyAdded: false,//新增
      Determine: false, // 确定
      pickerOptions: {
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
      tools: tools,
      //修改未到款 ，与入款状态 map
      UpdateAddRem: {
        Dio_DsID: null,
        Dio_Deposit_Total: null,
        Dio_Unpaid: null,
      },
      mainwidth: 24,//宽度
      num: '',
      CompanyNameAccount: [],//公司名称
      Company_account: [],//公司账户
      RemList: [],

      AddRem_show: false,//模板展示
      Remittance_State: [],//入款状态
      //文字
      AddRemtitle: '',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
    }
  },
  created() {

    //加载 公司账户
    if (window['Company_account'] != undefined && window['Company_account'] != null && window['Company_account'] != '') {
      this.Company_account = window['Company_account'];
    } else {
      this.getDicts("Company_account").then(response => {
        window['Company_account'] = response.data;
        this.Company_account = window['Company_account'];
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
    //加载 对应公司账户表 名称
    if (window['CompanyNameAccount'] != undefined && window['CompanyNameAccount'] != null && window['CompanyNameAccount'] != '') {
      this.CompanyNameAccount = window['CompanyNameAccount'];
    } else {
      CompanyName().then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        window['CompanyNameAccount'] = jsonobj.Data;
        console.log(jsonobj.Data)

        this.CompanyNameAccount = window['CompanyNameAccount'];
      });
    }
    // this.loadDingData();
    //将两个数组合并成一个数组
    // this.CompanyNameAccount = this.CompanyNameAccount.concat(this.Company_account)
  },
  mounted() {
    window['s'] = '1';
  },
  methods: {

    loadDingData(){
      this.$emit("SetObj", "SetPaymentDetails", true);// 已经加载过了 是否执行bool 赋值 为 true ,防止重复加载 [调用父组件函数去执行修改父组件的值 ，子组件直接修改父组件的值会报错！]

      // // console.log("将传入的iD 拿去数据库查询 入款详情")
      let map = {};
      map.Dio_ID = this.IDFrom.Dio_ID; //合同表的ID
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      SleIncome(Pwd_Str).then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.RemList = jsonobj.Data;
          this.CompanyNameAccount = window['CompanyNameAccount'].concat(this.Company_account);//点击修改就合并

        }else {
          this.msgError(jsonobj.msg);
        }
      });

    },

    /**新增入款详情*/
    LoadAdd() {

      this.AddRemObjFrom.Dids_FatName = this.CompanyNameAccount[0].dictValue;//默认选中第一条数据
      this.AddRemObjFrom.Dids_Amount = '';
      this.AddRemObjFrom.Dids_Remarks = '';
      this.AddRemtitle = '新增入款详情';
      this.AddRem_show = true;
      this.newlyAdded = true;//新增
      this.Determine = false; // 确定
    },

    /**删除界面缓存*/
    DelAccount(index) {
      this.RemList.splice(index, 1);
      this.msgSuccess("已删除界面缓存，需点击确认保存！");
      this.getSum();
    },
    /**修改界面缓存*/
    handleUpdate(row){
      this.$emit("SetObj", "Setparameter", row);

      this.AddRem_show = true;
      this.AddRemtitle = "修改界面缓存内容"
      this.newlyAdded = false;//新增
      this.Determine = true; // 确定
    },


    /**只能输入数字且有小数点最多保留两位*/
    checkPrice(){
      let checkPlan = '' + this.AddRemObjFrom.Dids_Amount
      checkPlan = checkPlan
        .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        .replace(/^\./g, '') // 保证第一个为数字而不是.
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      if (checkPlan.indexOf('.') < 0 && checkPlan !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        checkPlan = parseFloat(checkPlan) + ''
      } else if (checkPlan.indexOf('.') >= 0) {
        checkPlan = checkPlan
          .replace(/^()*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      }
      this.AddRemObjFrom.Dids_Amount = checkPlan

    },

    /**模板新增*/
    addAFAddRem() {

      let _this = this;
      if (tools.VerificationsText(_this, _this.AddRemObjFrom.Dids_Amount, "金额不能为空！") == true &&
        tools.VerificationsText(_this, _this.AddRemObjFrom.Dids_FatName, "公司账户不能为空！") == true &&
        tools.VerificationsText(_this, _this.AddRemObjFrom.Dids_Time, "入库日期不能为空！") == true) {
        let map = JSON.parse(JSON.stringify(this.AddRemObjFrom));
        this.RemList.push(map);
        this.msgSuccess("已添加至界面缓存，需点击确认保存！");
        this.AddRem_show = false;
        this.getSum();

      }
    },

    getSum(){
      //获取 合计总数
      let sum = "0";
      for (let i = 0; i < this.RemList.length; i++) {
        let Obj = this.RemList[i];
        sum = tools.accAdd(Obj.Dids_Amount, sum);
      }
      this.IDFrom.Dio_Deposit_Total = sum;
      //未到款 = 实际金额 - 入款合计
      let auu = tools.numSub(this.IDFrom.c_the_actual_amount,sum);
      this.IDFrom.Dio_Unpaid = auu;  //未到款
    },
    /**取消按钮*/
    cancel(){
      this.AddRem_show = false;
    },
    /**确定按钮*/
    submitAdd(){
      JSON.parse(JSON.stringify(this.AddRemObjFrom));
      this.msgSuccess("已修改至界面缓存，需点击确认保存！");
      this.AddRem_show = false;
      this.getSum();
    },
    /**保存*/
    preservation() {

      if(this.IDFrom.Dio_Deposit_Total == '0'){
        let _this = this;
        let Dio_Deposit_Total = _this.IDFrom.Dio_Deposit_Total;
        let Dio_Unpaid = _this.IDFrom.Dio_Unpaid;
        let title ='';
        if(Dio_Deposit_Total){
          title += ' 入款合计：['+Dio_Deposit_Total+']';
        }else {
          title += '  入款合计： []';
          this.IDFrom.Dio_Deposit_Total = '0';
        }
        if(Dio_Unpaid){
          title += ' 未到款：['+Dio_Unpaid+']';
        }else {
          title += '  未到款： []';
          this.IDFrom.Dio_Unpaid = '0';
        }
        _this.$confirm(title+'--->'+'是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.StateID();
        })
      }else {
        this.StateID();
      }
    },
    // 公共的状态执行
    StateID(){
      // this.IDFrom.c_the_actual_amount  实际金额  未到款  1
      // this.IDFrom.Dio_Unpaid  未到款  有尾款  2
      // this.IDFrom.Dio_Deposit_Total  入款合计  已到款  3
      if(this.IDFrom.c_the_actual_amount == this.IDFrom.Dio_Unpaid){
        this.IDFrom.Dio_DsID = '1';
        this.PublicID();
      }else if(this.IDFrom.Dio_Deposit_Total >= this.IDFrom.c_the_actual_amount ){
        this.IDFrom.Dio_DsID = '3';
        this.PublicID();
      }else {
        this.IDFrom.Dio_DsID = '2';
        this.PublicID();
      }



    },
    //公共的保存执行函数
    PublicID(){
      let map = {};
      map.Dio_ID = this.IDFrom.Dio_ID; //合同表的ID
      map.CDIO_map = this.IDFrom;
      map.Ds_arr = this.RemList;
      this.AddRemList(map);
    },

    // 关闭
    Colse() {
      this.$emit("SetObj", "Setdrawer", false);//已加载
    },

  },
}


</script>

<style scoped>

</style>
