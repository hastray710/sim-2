<template>
  <div >
    <!--这里是标签页-->
    <div class="main" >

      <el-tabs v-model="activeName" type="border-card"  @tab-click="handleClick">
        <el-tab-pane label="会话信息" name="sessionInformation">

          <el-divider content-position="left">{{ OnlineTitle }}   <!--【{{form.}}}】-->
            <el-button @click="getOnlineStatus" size="mini" type="primary" style="margin-left: 40px">刷新</el-button>
          </el-divider>

          <el-card shadow="always">

            <el-table
              :data="table_Online"
              :show-header="false"
              border>
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
              <el-table-column prop="label2" width="285px">
                <template slot-scope="scope">
                  <b>
                    <div :style="{'color':scope.row.label2? 'black':'black'}">
                      {{ scope.row.label2 }}
                    </div>
                  </b>
                </template>
              </el-table-column>
              <el-table-column
                prop="value2"
              />
            </el-table>
          </el-card>

        </el-tab-pane>


        <el-tab-pane label="功能产品" v-if="internalBool" v-hasPermi="['yunze:sys:internal']" name="functionalProduct">
          <el-divider content-position="left">上游使用中套餐
            <el-button @click="offeringGet(sel.iccid)" size="mini" type="primary" style="margin-left: 40px">刷新</el-button>
            <el-button @click="SynFlow(sel.iccid)" size="mini" type="primary" style="margin-left: 40px">上游同步</el-button>
          </el-divider>

          <el-table :data="reminderList" overflow="auto" >
<!--            <el-table-column label="iccid"  prop="iccid"/>-->
            <el-table-column label="资费ID"  prop="offeringId" width="100"/>
            <el-table-column label="资费计划名称"  prop="offeringName"/>
            <el-table-column label="APN名称"  prop="apnName"  width="120"/>
            <el-table-column label="总量(MB)"  prop="totalAmount" width="150" />
            <el-table-column label="使用量(MB)"  prop="useAmount" width="150"/>
            <el-table-column label="剩余量(MB)"  prop="remainAmount" width="150"/>
            <el-table-column label="已用(%)"  prop="percentage" width="80"/>
            <el-table-column label="创建日期"  prop="create_date" width="110"/>
            <el-table-column label="同步日期"  prop="upd_date" width="110"/>
          </el-table>

          <el-divider content-position="left">上游已订购套餐
            <el-button @click="usageGet(sel.iccid)" size="mini" type="primary" style="margin-left: 40px">刷新</el-button>
            <el-button @click="getOffering(sel.iccid)" size="mini" type="primary" style="margin-left: 40px">上游同步</el-button>
          </el-divider>
          <el-table :data="offeringinfoList" overflow="auto">
<!--            <el-table-column label="iccid"  prop="iccid"/>-->
            <el-table-column label="资费ID"  prop="offeringId" width="100"/>
            <el-table-column label="资费名称"  prop="offeringName"/>
            <el-table-column label="APN名称"  prop="apnName" width="120"/>
            <el-table-column label="生效时间"  prop="effectiveDate" width="185"/>
            <el-table-column label="失效时间"  prop="expiriedDate" width="185"/>
            <el-table-column label="创建日期"  prop="create_date" width="110" />
            <el-table-column label="同步日期"  prop="upd_date" width="110" />
            <el-table-column label="通道类型"  prop="cd_code" width="160"/>
          </el-table>


        </el-tab-pane>

        <el-tab-pane label="归属信息" name="attributionInformation">
          <el-table :data="attributionInfoList" overflow="auto">
            <el-table-column label="资费组ID"  prop="package_id"/>
            <el-table-column label="资费组名称"   prop="package_id">
              <template slot-scope="scope">
                {{ tools.getkeyValue(packageOptions, scope.row.package_id, "package_id", "package_agentname") }}
              </template>
            </el-table-column>
            <el-table-column label="所属通道"  >
              <template slot-scope="scope">
                <span v-hasPermi="['yunze:sys:internal']">
                   {{ tools.getDkeyValue(findCr_RouteOptions, scope.row.findcd_id) }}
                </span>
                <span v-if="!internalBool">
                   {{ tools.getkeyValue(RouteOptions, scope.row.findcd_id, "cd_id", "cd_alias") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="归属企业"  >
              <template slot-scope="scope">
                {{ tools.getDeptNamekeyValue(DeptOptions, scope.row.agent_id) }}
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>

        <el-tab-pane label="资费概要" name="packageInformation">
          <el-table :data="orderCardList" overflow="auto">
            <el-table-column label="订单编号"  prop="ord_no"/>
            <el-table-column label="资费计划名称"  prop="packet_wx_name"/>
            <el-table-column label="订单创建时间"  prop="create_time"/>
            <el-table-column label="资费生效时间"  prop="minStart_time"/>
            <el-table-column label="资费失效时间"  prop="maxEnd_time"/>
            <el-table-column  label="资费生效类型" prop="validate_type" >
              <template slot-scope="scope" >
                {{tools.getDkeyValue(validateTypeOptions,scope.row.validate_type)}}
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>

        <el-tab-pane label="资费详情" name="tariffDetails">

          <el-collapse  v-model="activeNames" style="margin-left: 10px; margin-top: 10px;">
            <el-collapse-item v-for="(item,index) in selIccid" :key="index" :name="index">
              <template slot="title" class="item_iccid" :data-val="item.packet_id">
                <div style="font-size:20px;">
                  {{item.iccid}} &nbsp;&nbsp;&nbsp;
                  <span style="color:#03a9f4;">
                    <span v-if="tools.Is_null(sel.package_id)">
                       {{tools.getkeyValue(packageOptions,sel.package_id,"package_id","package_agentname")}}
                    </span>
                     <span v-if="tools.Is_null(sel.package_id)==false">
                      未划分资费组！
                    </span>
                  </span>
                </div>
              </template>
              <div>
                <div>
                  <el-button @click="loadCar(index)" type="primary" style="margin-left: 3px">加载生效中资费计划</el-button>
                  <el-button @click="loadCar(index,1)" style="margin-left: 3px">加载所有资费计划</el-button>
                </div>
                <el-table
                  :row-style="{height:'5px'}"
                  :cell-style="{height:'5px,0'}"
                  :height="500"
                  :header-cell-style="{color:'#606266'}"
                  border
                  :data="item.FlowData"
                  style="width: 100%;margin-top: 1%">
                  <el-table-column
                    type="selection"
                    min-width="20%">
                  </el-table-column>
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table
                        :row-style="{height:'5px'}"
                        :cell-style="{height:'5px,0'}"
                        :height="400"
                        :header-cell-style="{color:'#606266'}"
                        border
                        :key="scope.row.index"
                        :data="scope.row.data"
                        style="width: 100%;margin-top: 1%">
                        <el-table-column
                          type="selection"
                          min-width="20%">
                        </el-table-column>
                        <el-table-column
                          label="套餐流量(MB)"
                          prop="true_flow">
                        </el-table-column>
                        <el-table-column
                          label="生效时间"
                          prop="start_time">
                        </el-table-column>
                        <el-table-column
                          label="到期时间"
                          prop="end_time">
                        </el-table-column>
                        <el-table-column
                          label="创建时间"
                          prop="create_time">
                        </el-table-column>
                        <el-table-column
                          label="生效类型"
                          prop="ord_type">
                          <template slot-scope="scope">
                            {{tools.getDkeyValue(validateTypeOptions,scope.row.ord_type)}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="状态"
                          width="100px"
                          prop="status">
                          <template slot-scope="scope">
                            <span :class="getColor(''+scope.row.status)"> {{tools.getDkeyValue(cardValidType,""+scope.row.status)}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="已用流量(MB)"
                          prop="use_so_flow">
                        </el-table-column>


                      </el-table>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="订单号"
                    prop="ord_no">
                  </el-table-column>
                  <el-table-column
                    label="充值流量包"
                    prop="packet_wx_name">
                  </el-table-column>
                  <el-table-column
                    label="订单名称"
                    prop="ord_name">
                  </el-table-column>
                  <el-table-column
                    width="100px"
                    label="支付方式"
                    prop="pay_type">
                    <template slot-scope="scope">
                      {{tools.getDkeyValue(Payment_method,scope.row.pay_type)}}
                    </template>
                  </el-table-column>
                  <!--<el-table-column
                    width="60px"
                    label="已分润"
                    prop="is_profit">
                    <template slot-scope="scope">
                      <div v-if="scope.row.is_profit===0">否</div>
                      <div v-if="scope.row.is_profit===1">是</div>
                    </template>
                  </el-table-column>-->
                  <el-table-column
                    label="交易时间"
                    prop="orderCreate_time">
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>


        </el-tab-pane>



        <el-tab-pane label="变更记录" name="cardInformationChange">
          <el-steps align-center :active="cardChangeList.length" >
            <el-step :title="item.createTime" :description="item.remark+'\n'+'变更前 '+item.cbefore+' 变更后 '+item.cafterward"
                     v-for="item in  cardChangeList">
              <h4>{{ item.remark }}</h4>
              <p>{{}}</p>
            </el-step>
            <!--  :description="'变更前 '+item.cbefore+' 变更后 '+item.cafterward"       <el-step :title="o.createTime" :description="o.cbefore"></el-step>-->
          </el-steps>
        </el-tab-pane>


      </el-tabs>
    </div>

    <!-- 触发加载数据函数-->
    <span v-if="show_Iccid ==true && DetailsEditexecute == false">
        {{ LoadData() }}
    </span>



  </div>
</template>

<script>
import {
  usageList,
  queryOnlineStatus,
  getOrderCard,
  queryflowData,
  queryOffering,
  SynCarFlow,
  ReminderArr
} from "@/api/yunze/flowcard/card/card";
import tools from "@/utils/yunze/tools";
import {getselTime} from "@/api/yunze/flowcard/card/change";




export default {
  props: {
    SetObj: Function,//父组件赋值 函数
    DetailsEditexecute: Boolean,//编辑时加载是否 已执行
    show_ds: Boolean,//当前界面是否显示
    cardList: Array,
    show_Iccid: Boolean,//当前界面是否显示
    sel: Object,
    access_type: Array,// 卡板接入方式
    online_status: Array,// 卡板在线状态
    DxCMP_RAT: Array,// 电信CMP接入类型
    DxCMP_online: Array,// 电信CMP在线状态
    packageOptions: Array,//简要套餐名称
    DeptOptions: Array,//公司信息
    DxCMP_netModel_type: Array,//电信CMP无线接入模式
    findCr_RouteOptions: Array,//API通道信息
    RouteOptions: Array,//API通道信息


  },
  name: "cardInfoDetails",
  data() {
    return {
      activeName: "sessionInformation",//选择那个表格
      reminderList: [],//上游当前账期套餐 数组
      offeringinfoList: [],//上游已订购套餐 数组

      OnlineTitle: '在线信息 (信息同步中)',
      table_Online: [],//在线状态信息
      attributionInfoList:[],//归属信息
      tools:tools,
      orderCardList: [],//卡资费订单信息
      Payment_method: [], // 支付方式

      validateTypeOptions: [],//生效类型

      cardChangeList: [
        // {"cbefore":"正常","cafterward":"停机","createTime":"createTime","remark":"执行成功！"},
        // {"cbefore":"停机","cafterward":"正常","createTime":"createTime","remark":"执行失败……！"},
        // {"cbefore":"停机","cafterward":"正常","createTime":"createTime","remark":"执行失败……！"},
        // {"cbefore":"停机","cafterward":"正常","createTime":"createTime","remark":"执行失败……！"},

      ],//卡状态变更数组
      activeNames: [0],
      cardValidType: [ ], // 资费计划状态 字典

      selIccid: [{FlowData: []}],
      functionalProduct_load:false,//是否加载 【功能产品】
      attributionInformation_load:false,//是否加载  【归属信息】
      packageInformation_load:false,//是否加载  【资费概要】
      tariffDetails_load:false,//是否加载  【资费详情】
      cardInformationChange_load:false,//是否加载  【变更记录】 whetherload
      sessionInformation_load:false,//是否加载  【会话信息】
      internalBool: false,//内部人员

    }
  },
  created() {

    //加载 资费计划生效中类型
    if(window['cardValidType']!=undefined &&  window['cardValidType']!=null && window['cardValidType']!=''){
      this.cardValidType = window['cardValidType'];
    }else{
      this.getDicts("yunze_card_valid_type").then(response => {
        window['cardValidType'] = response.data;
        this.cardValidType = window['cardValidType'];
      });
    }


    // 支付方式：
    if(window['Payment_method']!=undefined &&  window['Payment_method']!=null && window['Payment_method']!=''){
      this.Payment_method = window['Payment_method'];
    }else{
      this.getDicts("yunze_card_pay_type").then(response => {
        window['Payment_method'] = response.data;
        this.Payment_method = window['Payment_method'];
      });
    }
    //加载 资费计划生效类别
    if(window['validateTypeOptions']!=undefined &&  window['validateTypeOptions']!=null && window['validateTypeOptions']!=''){
      this.validateTypeOptions = window['validateTypeOptions'];
    }else{
      this.getDicts("yunze_card_takeEffect_type").then(response => {
        window['validateTypeOptions'] = response.data;
        this.validateTypeOptions = window['validateTypeOptions'];
      });
    }




  },
  watch: {
    // 变更sel 时更新到  归属信息
    sel(val) {
      this.attributionInfoList = [];//归属信息
      this.attributionInfoList.push(val);
    },

  },
  methods: {

    LoadData() {
      this.$emit("SetObj", "SetDetailsEditexecute", true);//已加载
      this.attributionInfoList = [];//归属信息
      this.offeringinfoList = [];//上游已订购套餐 数组
      this.reminderList = [];//上游当前账期套餐 数组
      this.cardChangeList = [];//卡状态变更数组
      this.orderCardList = [];//卡资费订单信息
      this.table_Online = [];//在线状态信息
      this.activeName = "sessionInformation";//默认选择 ‘会话信息’ 做展示

      this.attributionInfoList.push(this.sel);
      this.getOnlineStatus();
    },


    handleClick(tab, event) {
      //console.log(tab.name);
      switch (tab.name) {
        case 'functionalProduct':
          if(this.internalBool){
            if(!this.functionalProduct_load){
              this.usageGet(this.sel.iccid);
              this.offeringGet(this.sel.iccid);
            }else{
              if(this.offeringinfoList.length==0){
                this.usageGet(this.sel.iccid);
              }
              if(this.reminderList.length==0){
                this.offeringGet(this.sel.iccid);
              }
            }
          }

          break;
        case 'packageInformation':
          if(!this.packageInformation_load){
            this.findOrderCard(this.sel.iccid);
          }
          break;
        case 'tariffDetails':
          if(!this.tariffDetails_load){
            this.loadCar(0);
          }
          break;
        case 'cardInformationChange':
          if(!this.cardInformationChange_load ) {
            this.Change(this.sel.iccid);
          }
          break;
      }

    },

    // 获取 上游单卡订购套餐列表
    usageGet(iccid) {
      let map = {};
      map.iccid = iccid;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      usageList(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        // console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.functionalProduct_load=true;
          this.offeringinfoList = jsonobj.Data;
          //上游当前账期套餐 获取到了 但是 ‘上游单卡订购套餐列表’ 没有获取到数据时 自动获取
          if(this.reminderList.length>0){
            if(this.offeringinfoList.length==0){
              this.getOffering(iccid);
            }
          }
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    //获取 上游套餐记录列表
    offeringGet(row) {
      let map = {};
      map.iccid = row;
      // console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      ReminderArr(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.reminderList = jsonobj.Data;
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    //获取对应 class 颜色
    getColor(key){
      var class_color="";
      switch (key) {
        case '1':
          class_color='my_cloor_green';
          break;
        case '0':
          class_color='my_cloor_black';
          break;
        case '2':
          class_color='my_cloor_blue';
          break;
        default:
          class_color='my_cloor_black';
          break;
      }
      return class_color;
    },

    Change(iccid) {
      this.loading = true;
      let Pwd_Str = tools.encrypt(JSON.stringify({'iccid': iccid}));
      getselTime(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == '200') {
            this.cardInformationChange_load = true;
            let cardLists = jsonobj.Data;
            ///console.log(cardLists);
            let arr = [];
            for (let i = 0; i < cardLists.length; i++) {
              arr.push(cardLists[cardLists.length - i - 1]);
            }
            //console.log(arr);
            this.cardChangeList = arr;
          } else {
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },


    //获取 上游套餐记录列表
    findOrderCard(iccid) {
      let map = {};
      map.iccid = iccid;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      getOrderCard(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.packageInformation_load = true ;
          this.orderCardList = jsonobj.Data;
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },



    //在线信息 更新
    getOnlineStatus() {
      //console.log("====getOnlineStatus====");
      this.table_Online = [];//重置数据
      let map = {};
      map.iccid = this.sel.iccid;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      queryOnlineStatus(Pwd_Str).then(res => {
        let jsonobj = JSON.parse(tools.Decrypt(res));
        //console.log(jsonobj);
        this.internalBool = jsonobj.deptId=='100'?true:false;
        if (jsonobj.code == 200) {
          let obj = jsonobj.Data.Data;
          let map1 = {};
          let map2 = {};
          let cd_code = jsonobj.Data.cd_code;
          this.sessionInformation_load=true;//是否加载  【会话信息】
          let createDate = '';
          if (cd_code == "YiDong_EC" || cd_code == "YiDong_EC_TOKE_ShuoLang" || cd_code == "YiDong_EC_TengYu" || cd_code == "YiDong_EC_Combo" || cd_code == "ECV5_token_MW") {
            map1.value1 = tools.getDkeyValue(this.access_type, obj.rat);
            map1.value2 = tools.getDkeyValue(this.online_status, obj.status);
            map2.value1 = obj.ip;
            map2.value2 = obj.apnId;
            createDate = obj.createDate;
          } else if (cd_code == "YiDong_ECv2" || cd_code == "YiDong_ECv2_Combo") {
            map1.value1 = tools.getDkeyValue(this.access_type, obj.RAT);
            map1.value2 = tools.getDkeyValue(this.online_status, obj.GPRSSTATUS);
            map2.value1 = obj.IP;
            map2.value2 = obj.APN;
            createDate = obj.createDate;
          } else if (cd_code == "ZCWL") {
            map1.value1 = tools.getDkeyValue(this.access_type, obj.rat);
            map1.value2 = tools.getDkeyValue(this.online_status, obj.status);
            map2.value1 = obj.ip;
            map2.value2 = obj.apnId;
            createDate = obj.createDate;
          } else if (cd_code == "DianXin_CMP") {
            //DxCMP_RAT: [],//电信CMP接入类型
            map1.value1 = tools.getDkeyValue(this.DxCMP_RAT, obj.rattype) + " 无线接入模式 : [ " + tools.getDkeyValue(this.DxCMP_netModel_type, obj.netModel) + " ]";
            map1.value1 = tools.Is_null(obj.provname)?map1.value1+" - ["+obj.provname+ "]":map1.value1;
            map1.value2 = tools.getDkeyValue(this.DxCMP_online, obj.result);
            map2.value1 = obj.framedIpAddress;
            map2.value2 = obj.apn;
            createDate = obj.eventTimestamp;
          }
          map1.label1 = "接入方式";
          map1.label2 = "在线状态";
          this.table_Online.push(map1);

          map2.label1 = "IP地址";
          map2.label2 = "APN";
          this.table_Online.push(map2);
          if (tools.Is_null(createDate)) {
            this.OnlineTitle = '在线信息 (会话创建时间 : ' + createDate + ')';
          } else {
            this.OnlineTitle = '在线信息 (已同步信息)';
          }
        } else {
          let map1 = {};
          map1.label1 = "返回信息";
          map1.value1 = jsonobj.msg;
          map1.label2 = "";
          map1.value2 = "";
          if (this.internalBool) {
            map1.label2 = "请核对API信息（未产生用量不会有在线记录！）";
            map1.value2 = "目前仅支持移动EC,移动Pboos,电信CMP";
          }
          this.table_Online.push(map1);
          this.msgError(jsonobj.msg);
          this.OnlineTitle = '在线信息 (已同步信息)';
        }

      })
    },



    //同步用量
    SynFlow(iccid) {
      let _this = this;
      let map = {};
      map.iccid = iccid;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      SynCarFlow(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          //延迟加载 【数据插入需要时间】
          setTimeout(function () {
            _this.offeringGet(iccid);
          }, 3000);
        } else {
          this.msgError(jsonobj.msg);
        }
      })
    },


    //上游订购套餐查询
    getOffering(iccid) {
      let _this = this;
      let map = {};
      map.iccid = iccid;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      queryOffering(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          //延迟加载 【数据插入需要时间】
          setTimeout(function () {
            _this.usageGet(iccid);
          }, 3000);
        } else {
          this.msgError(jsonobj.msg);
        }
      })
    },


    /*加载当前 套餐包*/
    loadCar(index,NotExpired){
      //
      let _this=this;
      let map = {};
      map.iccid = this.sel.iccid;
      map.$index = index;
      map.agent_id = this.sel.agent_id;
      map.package_id = this.sel.package_id;

      map.NotExpired = NotExpired!=undefined && NotExpired!=null?'0':'1';
      _this.cardFlowShow = false;
      _this.queryflow(map);

    },
    queryflow(map){//查询现有流量包
      let _this = this;
      _this.FlowData = [];//重置
      // console.log(map);
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(Pwd_Str);
      queryflowData(Pwd_Str).then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == "200") {
          let arr = jsonobj.Data;
          this.tariffDetails_load = true;
          var new_map = {},
            dest = [];
          for(var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            if(!new_map[ai.ord_no]) { //依赖分组字段可自行更改！
              dest.push({
                ord_no: ai.ord_no, //依赖分组字段可自行更改！
                packet_wx_name: ai.packet_wx_name,
                ord_status: ai.ord_status,
                pay_type: ai.pay_type,
                is_profit: ai.is_profit,
                validate_type: ai.validate_type,
                info: ai.info,
                ord_name: ai.ord_name,
                true_flow: ai.true_flow,
                error_flow: ai.error_flow,
                orderCreate_time: ai.orderCreate_time,
                data: [ai]
              });
              new_map[ai.ord_no] = ai; //依赖分组字段可自行更改！
            } else {
              for(var j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if(dj.ord_no == ai.ord_no) { //依赖分组字段可自行更改！
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }

          _this.FlowData = dest;
          _this.data = dest;
          //console.log(_this.selIccid);
          _this.selIccid[0].iccid = map.iccid;
          _this.selIccid[0].FlowData = dest;
          _this.cardFlowShow =  true; //资费详情 显示
          //window[map.iccid] = _this.FlowData;
          this.cardPackageTitle = "资费信息 (已同步数据)";
        } else {
          //tools.open(_this, jsonobj.msg);
          tools.MessageShow(_this,jsonobj.msg,"error");
        }
      })
    },



  },
}
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

  .my_checkbox__inner {
    border: 1px;
  }

  .my_cloor_red {
    background-color: #e64242;
    color: white;
    text-align: center;
  }
  .my_cloor_blue {
    background-color: #1682e6;
    color: white;
    text-align: center;
  }
  .my_cloor_Orange {
    background-color: #f2e119;
    color: white;
    text-align: center;
  }
  .my_cloor_black {
    background-color: #303133;
    color: white;
    text-align: center;
  }

  .my_cloor_green {
    background-color: #11b95c;
    color: white;
    text-align: center;
  }



</style>
