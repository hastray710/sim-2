<template>
  <div >
    <!--这里是标签页-->
    <div class="main">

      <el-table v-loading="deptLoading" :data="deptObjArr" >
        <el-table-column label="已授信额度" prop="line_of_credit"/>
        <el-table-column label="已用授信额度" prop="used_line_of_credit"/>
        <el-table-column label="可用授信额度" prop="be_usable_line_of_credit"/>
        <el-table-column label="可用预存金额" prop="deposit_amount" />
        <el-table-column label="待支付金额" prop="toBePaid" />
        <el-table-column label="预计剩余预存" prop="forecast_deposit_amount" />
        <el-table-column label="预计剩余授信" prop="forecast_be_usable_line_of_credit"/>


      </el-table>


      <el-table v-loading="BRThreeLoading" :data="BRThreeCardArr" >
        <el-table-column label="编号" prop="packet_id" width="250px;"/>
        <el-table-column label="名称" prop="packet_wx_name"/>
        <el-table-column label="流量(MB)" prop="packet_flow"/>
        <el-table-column label="售价" prop="packet_price"/>
        <el-table-column label="成本" prop="packet_cost"/>
        <el-table-column label="卡数量" prop="packetCardCount"/>
        <el-table-column label="金额">
          <template slot-scope="scope">
            {{ tools.NumberMul(scope.row.packet_cost, scope.row.packetCardCount) }}
          </template>
        </el-table-column>
        <el-table-column label="周期" prop="packet_valid_time"/>
        <el-table-column label="规则" prop="packet_valid_name"/>
        <el-table-column label="分月" prop="is_month">
          <template slot-scope="scope">
            {{ tools.getDkeyValue(customize_whether, scope.row.is_month) }}
          </template>
        </el-table-column>
        <el-table-column label="在售" align="center" key="in_stock">
          <template slot-scope="scope">
            {{ tools.getDkeyValue(customize_whether, scope.row.in_stock) }}
          </template>
        </el-table-column>
      </el-table>

      <el-form v-if="OperationType=='ToBr'" ref="form" style="margin-top: 15px;" :model="infoObj" label-width="80px">
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="infoObj.info"></el-input>
        </el-form-item>
      </el-form>

      <div style="height: 35px;margin-top: 20px">



        <div style="float: right;">
          <el-row :gutter="10">
            <el-col :span="1.5">

                <el-button size="mini" type="primary" @click="jumpSave" >
                  <span>去预存</span>
                </el-button>

            </el-col>
            <el-col :span="1.5" v-if="OperationType=='ToBr'">
              <el-button size="mini" type="primary" @click="subToBr">
                <span>提 交</span>
              </el-button>
            </el-col>
            <el-col :span="1.5" v-if="OperationType=='Recharge'">
              <el-button size="mini" type="primary" @click="subRecharge">
                <span>充 值</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>



      <el-dialog :visible.sync="PrestoreShow_BeRenewed" width="80%" :close-on-click-modal="false" append-to-body>
        <!--企业预存 子组件-->
        <subInterfaceDeptPrestore ref="subInterfaceDeptPrestore"
                           :Prestoreexecute="Prestoreexecute" :PrestoreShow_BeRenewed="PrestoreShow_BeRenewed"  @PrestoreSetObj="PrestoreSetObj"
                           :PdeptForm="PdeptForm"

        />
      </el-dialog>

      <!-- 触发加载数据函数-->
      <span v-if="ThreeShow_BeRenewed ==true && ThreeBeRenewedexecute == false">
        {{ LoadBRThreeData() }}
      </span>

    </div>
  </div>
</template>

<script>
  import tools from "@/utils/yunze/tools";
  import {getDeptPrestore,saveRenewal} from "@/api/yunze/flowcard/renewal";
  import subInterfaceDeptPrestore from "../../system/deptPrestore/subInterfaceDeptPrestore";
  import { DeptTextRecharge} from "@/api/yunze/order/order";



  export default {
    components: {
      subInterfaceDeptPrestore,
    },
    props: {
      ThreeSetObj: Function,//父组件赋值 函数
      ThreeBeRenewedexecute: Boolean,//加载是否 已执行
      ThreeShow_BeRenewed: Boolean,//当前界面是否显示
      customize_whether: Array,//自定义是否
      BRThreeCardArr: Array,// toBeRenewed_one 表格中 可续费的
      toBePaid: Number,//待支付金额
      BRpacketCardCount: Object,//续费资费计划下 卡号数据
      OperationType: String,//操作类型
      validate_map: Object,//资费生效类型 类型
    },
    name: "toBeRenewed_three",
    data() {
      return {
        tools: tools,
        BRThreeLoading:true,
        deptLoading:true,
        deptObjArr:[],
        // 查询参数
        ThreeBRqueryParams: {
          pageNum: 1,
          pageSize: 10,
          toBRIccidArr:this.toBRIccidArr,
        },
        infoObj:{
          info:'',
        },
        rtCount:0,
        Prestoreexecute:false,
        PrestoreShow_BeRenewed:false,
        PdeptForm:{
          deptName:'',
          deposit:100.00,//默认预存100
          deptId:'',
        },
      }
    },
    created() {

    },
    methods: {
      LoadBRThreeData() {
        this.$emit("ThreeSetObj", "SetThreeBeRenewedexecute", true);//已加载
        this.loadDeptPrestore();
      },

      //提供子组件使用变更父子间属性
      PrestoreSetObj(Key, obj){
        //console.log(obj);
        switch (Key) {
          case 'SetPrestoreexecute':
            this.Prestoreexecute = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
          case 'SetPrestoreShow_BeRenewed':
            this.PrestoreShow_BeRenewed = obj;//设置    是否已经加载 [提供给子组件使用]
            if(obj==false){
              this.loadDeptPrestore();//加载界面
            }
            break;
        }
      },


      /*跳转企业预存*/
      jumpSave() {
        this.Prestoreexecute = false;
        this.PrestoreShow_BeRenewed = true;
      },


      //确定续费
      subToBr(){

        if(this.BRThreeCardArr.length>0){
          //1.判断剩余预存+ 剩余授信 >= 0 可操作
          let remaining = tools.accAdd(''+this.deptObjArr[0].forecast_deposit_amount,''+this.deptObjArr[0].forecast_be_usable_line_of_credit);
          if(remaining>=0){
            tools.openAsk(this, 'warning', "本次操作需扣款 [ "+this.toBePaid+" ] " + " 是否确认提交 ？", this.subApplication);
          }else{
            this.msgError("本次操作需扣款 [ "+this.toBePaid+" ] 还需 [ "+this.PdeptForm.deposit+" ] ,您的账户目前可用预存/授信不足，请点击['去预存']！");
          }
        }else{
          this.msgError("请选择可续费的资费计划 ！");
        }
      },



      //确认充值
      subRecharge(){
        if(this.BRThreeCardArr.length>0){
          //1.判断剩余预存+ 剩余授信 >= 0 可操作
          let remaining = tools.accAdd(''+this.deptObjArr[0].forecast_deposit_amount,''+this.deptObjArr[0].forecast_be_usable_line_of_credit);
          if(remaining>=0){
            tools.openAsk(this, 'warning', "本次操作需扣款 [ "+this.toBePaid+" ] " +" 生效类型为 [ "+this.validate_map.validate_typeName+" ] "  + " 是否确认提交 ？", this.subRechargeApplication);
          }else{
            this.msgError("本次操作需扣款 [ "+this.toBePaid+" ] 还需 [ "+this.PdeptForm.deposit+" ] ,您的账户目前可用预存/授信不足，请点击['去预存']！");
          }
        }else{
          this.msgError("请选择可充值的资费计划 ！");
        }
      },


      //提交申请 【充值】
      subRechargeApplication(){
        let map = {};
        map.subBRCardArr = this.BRThreeCardArr;
        let packetIdArr = [];
        let iccidArr = [];
        for (let i = 0; i < this.BRThreeCardArr.length; i++) {
          packetIdArr.push(this.BRThreeCardArr[i].packet_id);
          map.package_id = this.BRThreeCardArr[i].package_id;
          map.packet_id = this.BRThreeCardArr[i].packet_id;

          iccidArr = this.BRpacketCardCount[map.packet_id];
        }
        map.packetIdArr = packetIdArr;
        map.info =  this.infoObj.info;
        map.iccidArr = iccidArr;
        map.validate_type = this.validate_map.validate_type;
        console.log(map)
        map.BRpacketCardCount = this.BRpacketCardCount;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));

        DeptTextRecharge(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          this.BRThreeLoading = false;
          console.log(response)
          if (jsonobj.code == 200) {
            let Message = jsonobj.Data.Message;
            if(jsonobj.Data.bool){
              this.msgSuccess(Message);
              this.$emit("ThreeSetObj", "closeAll", false);//关闭当前界面

            }else{
              this.msgError(Message);
            }
          }else {
            this.msgError(jsonobj.msg);
          }
        })



      },









      //提交申请 【续费】
      subApplication(){
        let map = {};
        map.subBRCardArr = this.BRThreeCardArr;
        let packetIdArr = [];
        for (let i = 0; i < this.BRThreeCardArr.length; i++) {
          packetIdArr.push(this.BRThreeCardArr[i].packet_id);
        }
        map.packetIdArr = packetIdArr;
        map.info =  this.infoObj.info;
        //console.log(map)
        map.BRpacketCardCount = this.BRpacketCardCount;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        saveRenewal(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          this.BRThreeLoading = false;
          //console.log(response)
          if (jsonobj.code == 200) {
            let Message = jsonobj.Data.Message;
            if(jsonobj.Data.bool){
              this.msgSuccess(Message);
              this.$emit("ThreeSetObj", "closeAll", false);//关闭当前界面

            }else{
              this.msgError(Message);
            }
          }else {
            this.msgError(jsonobj.msg);
          }
        })
      },





      loadDeptPrestore() {
          this.deptLoading = true;
          this.deptObjArr = [];
          let Pwd_Str = tools.encrypt(JSON.stringify({}));
          getDeptPrestore(Pwd_Str).then(response => {
              let jsonobj = JSON.parse(tools.Decrypt(response));
              this.BRThreeLoading = false;
              if (jsonobj.code == 200) {

                let obj = {};
                obj.line_of_credit = tools.Is_null(jsonobj.Data.line_of_credit)==true?jsonobj.Data.line_of_credit:0;
                obj.used_line_of_credit = tools.Is_null(jsonobj.Data.used_line_of_credit)==true?jsonobj.Data.used_line_of_credit:0;
                obj.be_usable_line_of_credit = tools.Is_null(jsonobj.Data.be_usable_line_of_credit)==true?jsonobj.Data.be_usable_line_of_credit:0;
                obj.deposit_amount = tools.Is_null(jsonobj.Data.deposit_amount)==true?jsonobj.Data.deposit_amount:0;
                obj.toBePaid = this.toBePaid;
                obj.forecast_deposit_amount = tools.NumberSub(''+obj.deposit_amount,''+obj.toBePaid);//预计剩余可用预存金额 =  预计剩余可用预存金额 - 总扣款
                obj.forecast_be_usable_line_of_credit = 0;//预计剩余 可用授信 [默认 0 ]
                let is_NeedToRecharge = false;//判断扣款是否不足以支付该次 操作进行提示

                //console.log(obj.forecast_deposit_amount +' === ==  '+ obj.be_usable_line_of_credit)
                if(obj.forecast_deposit_amount<0 && obj.be_usable_line_of_credit==0){//如 预计剩余可用预存金额 <0 且 可用授信额度 == 0
                    is_NeedToRecharge = true;
                }else  if(obj.forecast_deposit_amount<=0 && obj.be_usable_line_of_credit>0){//如 预计剩余可用预存金额 <0 且 可用授信额度》0 》》 继续判断可用授信是否足够扣款
                  obj.forecast_be_usable_line_of_credit = tools.accAdd(''+obj.be_usable_line_of_credit,''+obj.forecast_deposit_amount);//预计剩余 可用授信 = 剩余可用授信 - 预计剩余可用预存金额
                  obj.forecast_deposit_amount = 0;
                  if(obj.forecast_be_usable_line_of_credit>=0) {//如 预计剩余 可用授信 >=0  变更 预计剩余可用预存金额 = 0

                  }else{
                    is_NeedToRecharge = true;
                  }
                }else{
                  //判断授信是否可用
                  obj.forecast_be_usable_line_of_credit = obj.be_usable_line_of_credit;
                }
                this.PdeptForm.deptId = jsonobj.Data.dept_id;
                this.PdeptForm.deptName = jsonobj.Data.dept_name;
                if(is_NeedToRecharge){
                 let stillNeeded =  tools.accAdd(''+obj.forecast_deposit_amount,''+obj.forecast_be_usable_line_of_credit);//还需充值金额
                  stillNeeded = Math.abs(stillNeeded);
                  this.PdeptForm.deposit = stillNeeded;//默认预存
                  this.msgError("本次操作需扣款 [ "+obj.toBePaid+" ] 还需 [ "+stillNeeded+" ] ,您的账户目前可用预存/授信不足，请点击['去预存']！");
                }


                this.deptObjArr.push(obj);
                this.deptLoading = false;
              } else {
                this.msgError(jsonobj.msg);
              }
            }
          );

      },


    },
  }
</script>



