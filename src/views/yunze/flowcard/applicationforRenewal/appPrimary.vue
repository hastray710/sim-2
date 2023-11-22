<template>
  <div>
    <!--这里是标签页-->
    <div class="main">

      <div style="height: 35px;">
        <el-row style="float: right;">
          <el-col >
            <el-button  v-hasPermi="['yunze:sys:internal']" icon="el-icon-s-check" size="mini" type="primary" style="margin-left: 20px" @click="audit">
              <span>审核</span>
            </el-button>
          </el-col>
        </el-row>
      </div>

      <el-card shadow="always">
        <el-table :data="primaryArr" :show-header="false" border>
          <el-table-column prop="label1">
            <template slot-scope="scope">
              <div :style="{'color':'black'}">
                {{ scope.row.label1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="value1"
          />
          <el-table-column prop="label2">
            <template slot-scope="scope">
              <div :style="{'color':'black'}">
                {{ scope.row.label2 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="value2"
          />
          <el-table-column prop="label3">
            <template slot-scope="scope">
              <div :style="{'color':'black'}">
                {{ scope.row.label3 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="value3"/>
          <el-table-column prop="label4">
            <template slot-scope="scope">
              <div :style="{'color':'black'}">
                {{ scope.row.label4 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="value4"/>

        </el-table>

        <el-table :data="tablefrom_remarks" :show-header="false" border>
          <el-table-column prop="label1" width="285px">
            <template slot-scope="scope">
              <b>
                <div :style="{'color':scope.row.label1? 'black':'black'}">
                  {{ scope.row.label1 }}
                </div>
              </b>
            </template>
          </el-table-column>
          <el-table-column
            prop="value1"
          />
        </el-table>


      </el-card>





      <el-tabs v-model="activeName" type="border-card"  >
        <el-tab-pane label="订单信息" name="orderInformation">
            <el-table v-loading="orderLoading" :data="ordArr" overflow="auto" >
              <el-table-column label="订单号"  prop="ord_no" />
              <el-table-column label="订单名称"  prop="ord_name" />
              <el-table-column label="交易金额" align="center" key="price" prop="price"  :show-overflow-tooltip="true"  width="80" />
              <el-table-column label="交易后金额" align="center" key="account" prop="account"  width="90" />
              <el-table-column label="支付方式" align="center" key="pay_type" prop="pay_type"  width="80" >
                <template slot-scope="scope" >
                  {{tools.getDkeyValue(payTypeOptions,scope.row.pay_type)}}
                </template>
              </el-table-column>
              <el-table-column label="生成方式" align="center" key="cre_type" prop="cre_type"  >
                <template slot-scope="scope" >
                  {{tools.getDkeyValue(creTypeOptions,scope.row.cre_type)}}
                </template>
              </el-table-column>
              <el-table-column label="所属公司" align="center" key="agent_id" prop="agent_id"  >
                <template slot-scope="scope" >
                  {{tools.getDeptNamekeyValue(DeptOptions,scope.row.agent_id)}}
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>

        <el-tab-pane label="资费信息"   name="tariffInformation">



          <el-table v-loading="packeLoading" :data="packetArr" overflow="auto" >
            <el-table-column label="编号" prop="packet_id" width="250px;"/>
            <el-table-column label="名称" prop="packet_wx_name"/>
            <el-table-column label="流量(MB)" prop="packet_flow"/>
            <el-table-column label="售价" prop="packet_price"/>
            <el-table-column label="成本" prop="packet_cost"/>
            <el-table-column label="卡数量" prop="card_count">
              <template slot-scope="scope">
                <el-button @click="openFindIccid(scope.row)" type="text">{{ scope.row.card_count}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="周期" prop="packet_valid_time"/>
            <el-table-column label="规则" prop="packet_valid_name"/>
            <el-table-column label="已生成订单" prop="generate_tariff_orders">
              <template slot-scope="scope">
                {{ tools.getDkeyValue(customize_whether, scope.row.generate_tariff_orders) }}
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>



      </el-tabs>




      <el-dialog :visible.sync="show_Iccid" width="60%" :close-on-click-modal="false" append-to-body>
        <!--查看主表信息 子组件-->
        <appIccid ref="appIccid"
                    :IccidEditexecute="IccidEditexecute" :show_Iccid="show_Iccid"  @IccidSetObj="IccidSetObj"
                    :b_id="b_id"

        />

      </el-dialog>


      <!--审核修改-->
      <el-dialog :visible.sync="showUpd" width="60%" :close-on-click-modal="false" append-to-body>
        <el-divider content-position="left" ><span style="color: red;">操作前请确认 已核对 [续费资费计划] 和 [订单扣款金额]！</span></el-divider>
        <el-form ref="form" :model="form"  label-width="110px" >
          <el-row>
            <el-col :span="8">
              <el-form-item  >
                <span slot="label">
                  是否通知
                  <el-tooltip placement="right">
                    <div slot="content">
                      是否通知：是否需要通知，指定配置人员处理续费申请（默认‘是’，申请状态 不为 ‘审核中’是不会再通知）
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                <el-select v-model="form.is_send" placeholder="请选择">
                  <el-option
                    v-for="item in customize_whether"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请状态" >
                <el-select v-model="form.status" placeholder="请选择">
                  <el-option
                    v-for="item in renewal_state"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="批注(内部可看)" >
                <el-input type="textarea"  v-model="form.annotation" placeholder="仅内部可看" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="反馈信息" >
                <el-input type="textarea"  v-model="form.feedback" placeholder="企业可看反馈信息" />
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-hasPermi="['yunze:renewal:upd']" type="primary" @click="Edie">保 存</el-button>
        </div>
      </el-dialog>



    <!-- 触发加载数据函数-->
    <span v-if="show_info ==true && BriefEditexecute == false">
        {{ LoadData() }}
    </span>
    </div>
  </div>
</template>

<script>

  import {findInfo,updRenewal  } from "@/api/yunze/flowcard/renewal";
  import tools from "@/utils/yunze/tools";
  import appIccid from "./appIccid";

  export default {
    components: {
      appIccid,
    },
    props: {
      SetObj: Function,//父组件赋值 函数
      BriefEditexecute: Boolean,//加载是否 已执行
      show_info: Boolean,//当前界面是否显示
      sel: Object,
      DeptOptions:Array,//企业数组
      renewal_state:Array,//申请状态
      customize_whether: Array,//自定义是否

    },
    name: "appPrimary",
    data() {
      return {
        activeName: "orderInformation",//选择那个表格
        payTypeOptions: [],//支付类型
        creTypeOptions: [],//生成方式
        IccidEditexecute: false,//
        show_Iccid: false,//
        showUpd: false,//
        internalBool: false,//内部人员
        tools: tools,
        primaryArr: [],//订单
        packetArr: [],//资费组信息
        ordArr: [],//订单
        tablefrom_remarks: [],//备注信息
        orderLoading: true,//
        packeLoading: true,//
        b_id:'',//资费id

        form:{
          id:'',
          status:'',
          annotation:'',
          feedback:'',
          is_send:'',
        },
        originalForm:{
          id:'',
          status:'',
          annotation:'',
          feedback:'',
          is_send:'',
        },
      }
    },
    created() {


      //加载 支付类型
      if(window['payTypeOptions']!=undefined &&  window['payTypeOptions']!=null && window['payTypeOptions']!=''){
        this.payTypeOptions = window['payTypeOptions'];
      }else{
        this.getDicts("yunze_card_pay_type").then(response => {
          window['payTypeOptions'] = response.data;
          this.payTypeOptions = window['payTypeOptions'];
        });
      }
//加载 生成方式
      if(window['creTypeOptions']!=undefined &&  window['creTypeOptions']!=null && window['creTypeOptions']!=''){
        this.creTypeOptions = window['creTypeOptions'];
      }else{
        this.getDicts("yunze_order_creType").then(response => {
          window['creTypeOptions'] = response.data;
          this.creTypeOptions = window['creTypeOptions'];
        });
      }

    },
    methods: {

      //审核界面打开
      audit(){
        this.showUpd = true;
        this.form = JSON.parse(JSON.stringify(this.originalForm));
        //console.log(this.form)
      },


      //设置数据
      IccidSetObj(Key, obj) {
        //console.log(obj);
        switch (Key) {
          case 'SetIccidEditexecute':
            this.IccidEditexecute = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
          case 'SetShow_Iccid':
            this.show_Iccid = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
        }
      },
      //修改保存
      Edie(){
        let _this = this;
        if(tools.VerificationsText(_this, _this.form.id, "必要参数缺失请刷新后重试！") == true){

          let map = {};
          map.id = this.form.id;
          let message = "";
          let bool = false;
          if(this.originalForm.status!=this.form.status){
            message += " 状态由 [ "+tools.getDkeyValue(this.renewal_state, this.originalForm.status)+" ] 变更为》 [ "+tools.getDkeyValue(this.renewal_state, this.form.status)+" ] ，";
            map.status = this.form.status;
            bool = true;
          }
          if(this.originalForm.annotation!=this.form.annotation){
            message += " 批注 变更为》 [ "+this.form.annotation+"  ] ，";
            map.annotation = this.form.annotation;
            bool = true;
          }
          if(this.originalForm.feedback!=this.form.feedback){
            message += " 反馈信息 变更为》 [ "+this.form.feedback+" ] ，";
            map.feedback = this.form.feedback;
            bool = true;
          }
          //console.log(this.originalForm)
          //console.log(map)
          if(tools.Is_null(map.status)==true && tools.Is_null(map.feedback)==false && map.status=='2' ){
            this.msgError("状态为 [ "+tools.getDkeyValue(this.renewal_state, this.form.status)+" ] 时，须填写反馈信息给企业查看！");
          }else{
            if(bool){
              //
              tools.openAsk(this, 'warning', "【 "+message+" 】 " + " 是否确认提交 ？", this.subUpd,map);
            }else{
              this.msgError("本次操作没有信息变更！");
            }
          }
        }
      },

      subUpd(map){
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        updRenewal(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          this.BRThreeLoading = false;
          //console.log(response)
          if (jsonobj.code == 200) {
            if(jsonobj.Data){
              this.msgSuccess("操作成功！");
              this.showUpd = false;
              this.$emit("SetObj", "SetShow_info", false);//关闭当前界面
            }else{
              this.msgError(jsonobj.msg);
            }
          }else {
            this.msgError(jsonobj.msg);
          }
        })
      },



  //查询订单下iccid卡号
      openFindIccid(row){
        this.b_id = row.id;
        this.IccidEditexecute = false;
        this.show_Iccid = true;
      },
      LoadData() {
        this.$emit("SetObj", "SetBriefEditexecute", true);//已加载
        this.finddata(this.sel);
      },


      /*获取详细信息*/
      finddata(row) {
        this.primaryArr = [];//清空数据
        this.packetArr = [];//清空数据
        this.ordArr = [];//清空数据
        this.tablefrom_remarks = [];//清空数据
        this.orderLoading = true;
        this.packeLoading = true;


        let map = {};
        map.id = row.id;
        map.p_id = row.id;

        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        findInfo(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
           //console.log(jsonobj);
            this.internalBool = jsonobj.deptId == '100' ? true : false;

            if (jsonobj.code == 200) {
              let primaryMap = jsonobj.Data.primaryMap;

              let map1 = {};
              map1.label1 = "企业名称";
              map1.value1 = tools.getDeptNamekeyValue(this.DeptOptions, primaryMap.dept_id);
              map1.label2 = "申请状态";
              map1.value2 = tools.getDkeyValue(this.renewal_state, primaryMap.status);
              map1.label3 = "申请人";
              map1.value3 = primaryMap.nick_name;
              map1.label4 = "创建时间";
              map1.value4 = primaryMap.create_time;
              this.primaryArr.push(map1);

              let map3 = {};
              map3.label1 = "申请备注";
              map3.value1 = primaryMap.info;
              this.tablefrom_remarks.push(map3);

              let map4 = {};
              map4.label1 = "平台反馈";
              map4.value1 = primaryMap.feedback;
              this.tablefrom_remarks.push(map4);

              let map2 = {};
              map2.label1 = "总卡数";
              map2.value1 = primaryMap.card_sumCount;
              map2.label2 = "总计金额";
              map2.value2 = primaryMap.amount;
              map2.label3 = "审核时间";
              map2.value3 =  primaryMap.review_time;
              if(this.internalBool){
                map2.label4 = "是否通知";
                map2.value4 = tools.getDkeyValue(this.customize_whether, primaryMap.is_send);

                let map5 = {};
                map5.label1 = "内部批注";
                map5.value1 = primaryMap.annotation;
                this.tablefrom_remarks.push(map5);

                this.originalForm.id =  primaryMap.id;
                this.originalForm.status =  ''+primaryMap.status;
                this.originalForm.annotation =  primaryMap.annotation;
                this.originalForm.feedback =  primaryMap.feedback;
                this.originalForm.is_send =  ''+primaryMap.is_send;



              }else{
                map2.label4 = "";
                map2.value4 = "";
              }
              this.primaryArr.push(map2);




              this.packetArr = jsonobj.Data.packetArr;
              this.ordArr = jsonobj.Data.ordArr;
              this.orderLoading = false;
              this.packeLoading = false;
              // this.cardInfoTitle = "卡基础信息 (已同步数据)";
            } else {
              this.msgError(jsonobj.msg);
            }
            this.loading = false;
          }
        );

      },



    },
  }
</script>


<style scoped>
  .el-dialog__body {
    padding: 10px 10px !important;
  }

</style>
<style>
  .el-tabs--border-card > .el-tabs__header .el-tabs__item{
    color: #303133 ;
  }
</style>

