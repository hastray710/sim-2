<template>
  <div class="app-container">


    <el-main style="padding-top: 1%;">
      <el-row>
        <el-col :span="24">

          <div style="width: 100%;">
            <el-input style="width: 60%;float: left;padding: 0px 30px;" v-model="cardNo"
                      placeholder="请输入 MSISDN、ICCID、IMSI、Vid(虚拟编号)">
              <el-select
                v-hasPermi="['yunze:card:cardMatch']"
                v-model="selType"
                placeholder="号码类型"
                slot="prepend"
                size="small"
                style="width: 120px"
              >
                <el-option
                  v-for="dict in cardNumber"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-input>
            <el-button type="primary" v-show="btnDiagnosis" v-hasPermi="['yunze:card:diagnosis']" :disabled="disabledDiagnosis" @click="oneClickDiagnosis">一 键 诊 断</el-button>
            <el-button type="primary" v-show="btnDiagnosis" v-hasPermi="['yunze:card:cardMatch']" :disabled="disabledDiagnosis" @click="oneClickMatch">智 能 匹 对</el-button>
          </div>


          <el-divider v-if="resultShow" content-position="left">匹对结果</el-divider>

          <div  v-if="resultShow">
            <div>
              <span style="margin-left: 40px;"> 匹对开头：</span>
              <span class="my_cloor_red" style="font-size: 25px;">{{cardPrefix}}</span><span style="font-size: 25px;">{{cardSuffix}}</span>
              <span style="margin-left: 40px;">共 <span>{{cardCount}}</span> 条数据</span>
            </div>
            <div style="margin-top: 10px;">
              <span style="margin-left: 40px;"> 参考卡号：</span><span style="font-size: 25px;color: #00ba26">{{cardReference}}</span>
            </div>
          </div>

<!--
          <el-divider v-if="cardInfoShow" content-position="left">{{cardInfoTitle}}</el-divider>
-->
         <!-- <el-table
            v-if="cardInfoShow"
            :data="tablefrom"
            :show-header="false"
            border>

            <el-table-column prop="label1" >
              <template slot-scope="scope">
                <b>
                  <div :style="{'color':scope.row.label1? 'black':'black'}">
                    {{scope.row.label1}}
                  </div>
                </b>
              </template>
            </el-table-column>


            <el-table-column
              prop="value1"
            />
            <el-table-column prop="label2" >
              <template slot-scope="scope">
                <b>
                  <div :style="{'color':scope.row.label2? 'black':'black'}">
                    {{scope.row.label2}}
                  </div>
                </b>
              </template>
            </el-table-column>
            <el-table-column
              prop="value2"
            />
            <el-table-column prop="label3" >
              <template slot-scope="scope">
                <b>
                  <div :style="{'color':scope.row.label3? 'black':'black'}">
                    {{scope.row.label3}}
                  </div>
                </b>
              </template>
            </el-table-column>
            <el-table-column
              prop="value3"
            />
          </el-table>

          <el-table
            v-if="cardInfoShow"
            :data="tablefrom_remarks"
            :show-header="false"
            border>
            <el-table-column prop="label1" width="285px">
              <template slot-scope="scope">
                <b>
                  <div :style="{'color':scope.row.label1? 'black':'black'}">
                    {{scope.row.label1}}
                  </div>
                </b>
              </template>
            </el-table-column>
            <el-table-column
              prop="value1"
            />
          </el-table>

-->


          <!--卡简要信息 子组件-->
          <cardInfoBrief ref="cardInfoBrief"  style="margin-top: 10px;" v-if="cardInfoShow"
                         :BriefEditexecute="BriefEditexecute" :show_Iccid="show_Iccid"  @SetObj="SetObj" :sel="sel" :showDiagnosis="showDiagnosis"
                         :access_type="access_type" :online_status="online_status" :DxCMP_RAT="DxCMP_RAT" :DxCMP_online="DxCMP_online"  :packageOptions="packageOptions"
                         :DeptOptions="DeptOptions"  :DxCMP_netModel_type="DxCMP_netModel_type" :operators_type="operators_type"  :stateShowId="stateShowId"
                         :card_types="card_types"  :network_types="network_types" :customize_whether="customize_whether"  :findCr_RouteOptions="findCr_RouteOptions"
                         :RouteOptions="RouteOptions"  :cardConnectionTypeOptions="cardConnectionTypeOptions" :stateOptions="stateOptions" :YDcard_attributionOptions="YDcard_attributionOptions"

          />






        <el-tabs v-hasPermi="['yunze:sys:internal']" v-if="cardInfoApiShow" style="margin-top: 10px;" v-model="activeApiName" type="border-card"  @tab-click="ApihandleClick">
          <el-tab-pane label="接口诊断返回" name="ApiDiagnosticReturns">
            <el-form    :model="fromApi" label-width="150px">
              <el-row v-if="ReasonForDowntime_show">
                <el-col :span="24">
                  <el-form-item>
                <span slot="label">
                  停机原因：
                  <el-tooltip placement="right">
                    <div slot="content">
                      停机原因
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-input v-model="fromApi.ReasonForDowntime" placeholder="停机原因" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item>
                <span slot="label">
                  机卡分离状态：
                  <el-tooltip placement="right">
                    <div slot="content">
                      机卡分离状态
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-input v-model="fromApi.MachineCardSeparation" placeholder="机卡分离状态" readonly />
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="switchNachine_show">
                  <el-form-item>
                <span slot="label">
                  开关机状态：
                  <el-tooltip placement="right">
                    <div slot="content">
                      开关机状态
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-input v-model="fromApi.switchNachine" placeholder="开关机状态" readonly />
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>

          </el-tab-pane>

          <el-tab-pane label="已开通APN信息" name="openApn">
            <el-table v-if="ApnArrShow"
                      :data="table_ApnArr"
                      :show-header="false"
                      border>
              <el-table-column prop="label1"/>
              <el-table-column prop="value1"/>
              <el-table-column prop="label2"/>
              <el-table-column prop="value2"/>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="状态变更记录" name="cardChangeAPI">
            <el-steps v-if="cardChangeAPIShow" align-center :active="cardChangeAPIList.length"
            >
              <el-step :title="item.changeDate"
                       :description="'源状态 '+item.descStatusValue+' 目标状态 '+item.targetStatusValue"
                       v-for="item in  cardChangeAPIList">
              </el-step>
            </el-steps>
          </el-tab-pane>

        </el-tabs>





          <!--子组件-->
          <cardInfoDetails ref="cardInfoDetails" v-if="cardInfoDetailsShow" style="margin-top: 10px;"
                    :DetailsEditexecute="DetailsEditexecute" :show_Iccid="show_Iccid"  @SetObj="SetObj" :sel="sel"
                    :access_type="access_type" :online_status="online_status" :DxCMP_RAT="DxCMP_RAT" :DxCMP_online="DxCMP_online"  :packageOptions="packageOptions"
                    :DeptOptions="DeptOptions"  :DxCMP_netModel_type="DxCMP_netModel_type" :findCr_RouteOptions="findCr_RouteOptions" :RouteOptions="RouteOptions"
          />


        </el-col>

      </el-row>
      <el-empty v-show="showempty" description="未匹配到相应的数据，请重新输入！"></el-empty>
    </el-main>


  </div>
</template>

<script>
  import tools from "@/utils/yunze/tools";
  import {
    getCard,
    queryflowSimple,
    queryPackageSimple,
    cardMatch,
    simStopReason,
    onOffStatus,
    apnInfo,
    cardBindStatus,
    simChangeHistory,
    findCr,
    getIccid
  } from "@/api/yunze/flowcard/card/card";
  import cardInfoDetails from "../card/cardInfoDetails";
  import cardInfoBrief from "../card/cardInfoBrief";





  export default {
    name: "diagnosis",
    components: {
      cardInfoBrief,
      cardInfoDetails,
    },
    data() {
      return {
        tools:tools,
        activeApiName:'ApiDiagnosticReturns',
        showempty: false, //空状态 显示
        cardInfoShow: false, //卡基础信息 显示
        cardInfoDetailsShow: false, //卡信息详情 显示
        resultShow: false, //匹对结果 显示
        cardNo: '',//匹对卡号
        selType:'2',//查询类型
        cardOnlineShow: false, //在线信息 显示
        ApnArrShow: false, //已开通APN 显示
        cardInfoApiShow: false, //卡基础信息 显示 [API实时]
        fromApi:
          {
            ReasonForDowntime:'',//停机原因
            switchNachine:'',//开关机状态
            MachineCardSeparation:'',//机卡分离状态

          }, //在线信息 显示 [API实时]
        offeringinfoList: [],
        reminderList: [],
        cardFlowShow: false, //资费详情 显示
        cardChangeShow: false, //变更记录 显示
        cardChangeAPIShow: false, //卡状态变更记录 显示 【API】
        cardChangeList: [],//卡状态变更数组
        cardNo: '',//诊断卡号
        btnDiagnosis:true,//诊断按钮是否显示
        disabledDiagnosis:false,//诊断按钮是否 禁用
        internalBool:false,//内部人员
        orderTypeOptions: [],// 订单交易类型 字典
        packageOptions: [], // 简要套餐名称

        findCr_RouteOptions: [],// API通道信息
        customize_whether: [],//自定义是否

        //当前查询参数
        sel:{
          iccid:'',
          agent_id:'',
          package_id:'',
        },

        show_Iccid: false, //详情查询
        selTime: '',//时间选择
        mainwidth: 24,//宽度
        option_show: false, //公司所属查询
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,

        dateRange: [],
        // 状态数据字典
        typeOptions: [],
        // 连接管理时间查询类型 数据字典
        timetypeOptions: [],
        PacketOptions: [],//资费计划
        PacketSelOptions: [],//资费计划查询

        //详情
        tablefrom: [],

        FlowData: [],
        selIccid: [{FlowData: []}],
        activeNames: [0],

        //卡状态所属通道

        status_type: "",
        //断开网状态
        cardConnectionTypeOptions:[],
        // 卡状态 字典
        stateOptions: [
          {
            dictLabel: ''
          }
        ],
        // 卡状态
        stateShowId: [],
        packet: {
          packet_flow: '-',
          packet_valid_time: '-',
          packet_valid_name: '-'
        },
        cardNumber: "",//卡号类别
        ReasonForDowntime_show: false,//停机原因 是否显示
        switchNachine_show: false,//开关机状态 是否显示

        // 运营商类别 字典
        operators_type: [],
        // 执行日志状态 字典
        channelStatusOptions: [],
        // 执行日志编码 字典
        channelCodeOptions: [],
        // 表单参数
        //form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 移动 归属地 字典
        YDcard_attributionOptions: [],

        // 列信息
        columns: [
          {key: 0, label: `任务名`, visible: true},
          {key: 1, label: `创建时间`, visible: true},
          {key: 2, label: `修改时间`, visible: true},
          {key: 3, label: `开始时间`, visible: true},
          {key: 4, label: `结束时间`, visible: true},
          {key: 5, label: `创建人`, visible: true},
        ],
        BriefEditexecute: false,//【卡基础信息】加载是否 已执行
        DetailsEditexecute: false,//【卡详情】加载是否 已执行
        showDiagnosis: false,//是否显示诊断
        table_Online: [],//在线状态信息
        DeptOptions: [],// 公司信息
        RouteOptions: [],// API通道信息
        tablefrom_remarks: [],//备注信息
        cardInfoTitle: '卡基础信息 (信息同步中)',
        cardPackageTitle: '资费信息 (信息同步中)',
        OnlineTitle: '在线信息 (信息同步中)',
        // Changequery: '卡信息变更记录查询记录',

        access_type: [],//卡板接入方式
        online_status: [],//卡板在线状态

        DxCMP_netModel_type: [],//电信CMP无线接入模式
        DxCMP_RAT: [],//电信CMP接入类型
        DxCMP_online: [],//电信CMP在线状态

        card_types: [],//卡类型
        network_types: [],//网络类型
        openApn_load:false,//加载 【已开通APN】
        cardChangeAPI_load:false,//加载 【上游API返回卡状态变更记录】
      };
    },


    created() {
      let str = this.$route.params.Pstr;


      //加载 网络类型
      if (window['network_types'] != undefined && window['network_types'] != null && window['network_types'] != '') {
        this.network_types = window['network_types'];
      } else {
        this.getDicts("yunze_card_network_type").then(response => {
          window['network_types'] = response.data;
          this.network_types = window['network_types'];
        });
      }

      //加载 企业名称
      if (window['DeptOptions'] != undefined && window['DeptOptions'] != null && window['DeptOptions'] != '') {
        this.DeptOptions = window['DeptOptions'];
      } else {
        this.getDeptName().then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          window['DeptOptions'] = jsonobj.Data;
          this.DeptOptions = window['DeptOptions'];
        });
      }
      //加载 卡板接入方式
      if(window['access_type']!=undefined &&  window['access_type']!=null && window['access_type']!=''){
        this.access_type = window['access_type'];
      }else{
        this.getDicts("yunze_card_access_type").then(response => {
          window['access_type'] = response.data;
          this.access_type = window['access_type'];
        });
      }


      //加载 卡号类别
      if(window['cardNumber']!=undefined &&  window['cardNumber']!=null && window['cardNumber']!=''){
        this.cardNumber = window['cardNumber'];
      }else{
        this.getDicts("cardNumber").then(response => {
          window['cardNumber'] = response.data;
          this.cardNumber = window['cardNumber'];
        });
      }

      //加载 资费组名称
      if(window['packageOptions']!=undefined &&  window['packageOptions']!=null && window['packageOptions']!=''){
        this.packageOptions = window['packageOptions'];
        if(!tools.IsArrInside(this.packageOptions,"package_id","IsNull")){
          this.packageOptions.push({"package_id":"IsNull","package_agentname":"未划分资费"});
        }
      }else{
        queryPackageSimple().then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          window['packageOptions'] = jsonobj.Data;
          this.packageOptions = window['packageOptions'];
          if(!tools.IsArrInside(this.packageOptions,"package_id","IsNull")){
            this.packageOptions.push({"package_id":"IsNull","package_agentname":"未划分资费"});
          }
        });
      }





      //加载 API通道名称
      if(window['RouteOptions']!=undefined &&  window['RouteOptions']!=null && window['RouteOptions']!=''){
        this.RouteOptions = window['RouteOptions'];
        if(!tools.IsArrInside(this.RouteOptions,"cd_id","IsNull")){
          this.RouteOptions.push({"cd_id":"IsNull","cd_alias":"未划分通道"});
        }
      }else{
        this.findSp().then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          window['RouteOptions'] = jsonobj.Data;
          this.RouteOptions = window['RouteOptions'];
          if(!tools.IsArrInside(this.RouteOptions,"cd_id","IsNull")){
            this.RouteOptions.push({"cd_id":"IsNull","cd_alias":"未划分通道"});
          }
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

      //加载 卡类型
      if (window['card_types'] != undefined && window['card_types'] != null && window['card_types'] != '') {
        this.card_types = window['card_types'];
      } else {
        this.getDicts("yunze_card_card_type").then(response => {
          window['card_types'] = response.data;
          this.card_types = window['card_types'];
        });
      }



      //加载 运营商类型
      if(window['operators_type']!=undefined &&  window['operators_type']!=null && window['operators_type']!=''){
        this.operators_type = window['operators_type'];
      }else{
        this.getDicts("yunze_card_operators_type").then(response => {
          window['operators_type'] = response.data;
          this.operators_type = window['operators_type'];
        });
      }

      //加载 卡状态描述
      if(window['stateOptions']!=undefined &&  window['stateOptions']!=null && window['stateOptions']!=''){
        this.stateOptions = window['stateOptions'];
      }else{
        this.getDicts("yunze_card_status_type").then(response => {
          window['stateOptions'] = response.data;
          this.stateOptions = window['stateOptions'];
        });
      }

      //加载 卡状态
      if(window['stateShowId']!=undefined &&  window['stateShowId']!=null && window['stateShowId']!=''){
        this.stateShowId = window['stateShowId'];
      }else{
        this.getDicts("yunze_card_status_ShowId").then(response => {
          window['stateShowId'] = response.data;
          this.stateShowId = window['stateShowId'];
        });
      }

      //加载  断开网状态
      if(window['cardConnectionTypeOptions']!=undefined &&  window['cardConnectionTypeOptions']!=null && window['cardConnectionTypeOptions']!=''){
        this.cardConnectionTypeOptions = window['cardConnectionTypeOptions'];
      }else{
        this.getDicts("yz_cardConnection_type").then(response => {
          window['cardConnectionTypeOptions'] = response.data;
          this.cardConnectionTypeOptions = window['cardConnectionTypeOptions'];
        });
      }







      //加载 电信CMP无线接入模式
      if(window['DxCMP_netModel_type']!=undefined &&  window['DxCMP_netModel_type']!=null && window['DxCMP_netModel_type']!=''){
        this.DxCMP_netModel_type = window['DxCMP_netModel_type'];
      }else{
        this.getDicts("DianXin_CMP_netModel").then(response => {
          window['DxCMP_netModel_type'] = response.data;
          this.DxCMP_netModel_type = window['DxCMP_netModel_type'];
        });
      }

      //加载 电信CMP接入类型
      if(window['DxCMP_RAT']!=undefined &&  window['DxCMP_RAT']!=null && window['DxCMP_RAT']!=''){
        this.DxCMP_RAT = window['DxCMP_RAT'];
      }else{
        this.getDicts("DianXin_CMP_RAT").then(response => {
          window['DxCMP_RAT'] = response.data;
          this.DxCMP_RAT = window['DxCMP_RAT'];
        });
      }

      //加载 电信CMP在线状态
      if(window['DxCMP_online']!=undefined &&  window['DxCMP_online']!=null && window['DxCMP_online']!=''){
        this.DxCMP_online = window['DxCMP_online'];
      }else{
        this.getDicts("DianXin_CMP_online").then(response => {
          window['DxCMP_online'] = response.data;
          this.DxCMP_online = window['DxCMP_online'];
        });
      }

      //加载 移动 归属地
      if(window['YDcard_attributionOptions']!=undefined &&  window['YDcard_attributionOptions']!=null && window['YDcard_attributionOptions']!=''){
        this.YDcard_attributionOptions = window['YDcard_attributionOptions'];
      }else{
        this.getDicts("yz_YDcard_attribution").then(response => {
          window['YDcard_attributionOptions'] = response.data;
          this.YDcard_attributionOptions = window['YDcard_attributionOptions'];
        });
      }



      //加载 卡板在线状态
      if(window['online_status']!=undefined &&  window['online_status']!=null && window['online_status']!=''){
        this.online_status = window['online_status'];
      }else{
        this.getDicts("yunze_card_online_status").then(response => {
          window['online_status'] = response.data;
          this.online_status = window['online_status'];
        });
      }

      if(str!=null && str!='' && str.length>0){
        var reg_1 = new RegExp( "%2F" , "g" );
        var reg_2 = new RegExp( " " , "g" );
        str = str.replace(reg_1, "/");//转义 /
        str = str.replace(reg_2, "+");//转义 [ ]  》 +

        let jsonobj =  JSON.parse(tools.Decrypt(str));
        if(jsonobj!=null ){
          this.cardNo = jsonobj.cardNo;
        }
        this.oneClickDiagnosis();
      }

    },
    methods: {


      ApihandleClick(tab, event){
        let map ={};
        map.iccid = this.cardNo;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        switch (tab.name) {
          case 'openApn':
            if(this.openApn_load ==false  && this.internalBool==true){
              this.getApnInfo(Pwd_Str);
            }
            break;
          case 'cardChangeAPI':
            if(this.cardChangeAPI_load  ==false   && this.internalBool==true){
              this.getSimChangeHistory(Pwd_Str);
            }
            break;
        }
      },


    getApnInfo(Pwd_Str){
      //单卡已开通APN信息查询
      apnInfo(Pwd_Str).then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if(jsonobj.code==200){
          let RapnList = jsonobj.Data.RapnList;
          if(RapnList!=null && RapnList!=undefined && RapnList.length>0){

            let table_ApnArr = [];
            for (let i = 0; i <  RapnList.length; i++) {
              let obj =  RapnList[i];
              obj.label1 = "APN名称";
              obj.value1 = obj.apnName;
              obj.label2 = "状态";
              obj.value2 = obj.statusNeme;
              table_ApnArr.push(obj);
            }
            this.table_ApnArr = table_ApnArr;
            this.ApnArrShow = true;
            this.openApn_load = true;
            this.cardChangeAPI_load = true;


          }

        }else{
          this.msgError(jsonobj.msg);
        }
      })
    },



      getSimChangeHistory(Pwd_Str){
        //单卡状态变更历史查询
        simChangeHistory(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if(jsonobj.code==200){
            let changeHistoryList = jsonobj.Data.changeHistoryList;
            if(changeHistoryList!=null && changeHistoryList!=undefined && changeHistoryList.length>0){
              changeHistoryList.sort(function(a, b) {
                return b.changeDate < a.changeDate ? 1 : -1;
              })
              this.cardChangeAPIList = changeHistoryList;
              this.cardChangeAPIShow = true;//卡状态变更记录 显示 【API】
              this.cardChangeAPI_load = true;

            }
          }else{
            if(jsonobj.deptId=='100') {
              this.msgError(jsonobj.msg);
            }
          }
        })
      },


      //设置数据
      SetObj(Key, obj) {
        //console.log(obj);
        switch (Key) {
          case 'SetBriefEditexecute':
            this.BriefEditexecute = obj;//设置  编辑  是否已经加载 [提供给子组件使用]
            break;
          case 'SetDetailsEditexecute':
            this.DetailsEditexecute = obj;//设置  编辑  是否已经加载 [提供给子组件使用]
            break;
          case 'Setshow_ds':
            this.show_Iccid = obj;// 设置 drawer
            break;
          case 'SetqueryParams':
            this.queryParams = obj;// 设置 drawer
            break;
          case 'SetSel':
            this.sel = obj;// 设置 drawer
            break;
        }
      },
      // 一键诊断
      oneClickDiagnosis() {
        let _this = this;
        if(_this.disabledDiagnosis == false){
          this.show_Iccid =false;
          _this.btnDiagnosis = false;
          _this.disabledDiagnosis = true;
          _this.showempty = false; //空状态 显示
          _this.cardInfoShow = false; //卡基础信息 显示
          _this.resultShow = false; //匹对结果 显示
          _this.cardOnlineShow = false; //在线信息 显示
          _this.cardFlowShow = false; //资费详情 显示
          _this.cardChangeShow = false; //变更记录 显示
          _this.ApnArrShow = false;//Apn 显示 [API实时]
          _this.cardInfoApiShow = false;//卡基础信息 显示 [API实时]
          _this.ApnArrShow = false;
          _this.cardChangeAPIShow = false;
          _this.cardInfoApiShow = false;

          if(tools.Is_null(_this.cardNo)){
            _this.showempty = false; //空状态 显示
            this.sel ={
              iccid:'',
              agent_id:'',
              package_id:'',
            };
            this.form = {};
            let map ={};
            map.type = '1';
            map.value = _this.cardNo;
            let Pwd_Str = tools.encrypt(JSON.stringify(map));
            getIccid(Pwd_Str).then(response => {
              let jsonobj = JSON.parse(tools.Decrypt(response));
             // console.log(jsonobj);
              if (jsonobj.code == 200) {
                let row = jsonobj.Data;
                this.internalBool =  jsonobj.Data.is_Internal;
                this.sel.iccid = jsonobj.Data.iccid;
                this.sel.agent_id = jsonobj.Data.deptId;
                _this.cardInfoShow = true;

                if(this.internalBool) {
                  //加载 API通道名称
                  if (window['findCr_RouteOptions'] != undefined && window['RouteOptions'] != null && window['findCr_RouteOptions'] != '') {
                    this.findCr_RouteOptions = window['findCr_RouteOptions'];
                  } else {
                    findCr().then(response => {
                      let jsonobj = JSON.parse(tools.Decrypt(response));
                      window['findCr_RouteOptions'] = jsonobj.Data;
                      this.findCr_RouteOptions = window['findCr_RouteOptions'];
                    });
                  }
                }
                this.finddata(row,'diagnosis');
                this.show_Iccid =true;
                this.cardInfoDetailsShow = true;
                _this.btnDiagnosis = true;
                this.BriefEditexecute = false;
                this.DetailsEditexecute = false;


                setTimeout(function(){
                  _this.disabledDiagnosis = false;
                },3000);// 3 S 内禁止再次点击
              }else{
                _this.showempty = true;
                _this.btnDiagnosis = true;
                _this.disabledDiagnosis = false;
              }
            })
          }else {
            tools.MessageShow(_this,"请输入需要诊断的 MSISDN、ICCID、IMSI、Vid(虚拟编号) 信息！！","error");
            _this.btnDiagnosis = true;
            _this.disabledDiagnosis = false;
          }
        }else{
          tools.MessageShow(_this,"请勿重复点击！3秒后重试。","error");
        }

      },



      // 表单重置
      reset() {
        this.form = {
          userId: undefined,
          deptId: undefined,
          userName: undefined,
          nickName: undefined,
          password: undefined,
          phonenumber: undefined,
          email: undefined,
          sex: undefined,
          status: "0",
          remark: undefined,
          postIds: [],
          roleIds: []
        };
        this.resetForm("form");
      },

      /*获取单卡详细信息*/
      finddata(row,type){
        if(this.internalBool && type=='diagnosis'){

          let map ={};
          map.iccid = row.iccid;
          let Pwd_Str = tools.encrypt(JSON.stringify(map));
          //获取停机原因
          simStopReason(Pwd_Str).then(response => {
            this.ReasonForDowntime_show = false;
            let jsonobj =  JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if(jsonobj.code==200){
              this.fromApi.ReasonForDowntime = jsonobj.Data.stopReason;
              if(tools.Is_null(jsonobj.Data.stopReason)){
                this.ReasonForDowntime_show = true;
              }
            }else{
              this.msgError(response.msg);
            }
          })
          //单卡开关机状态实时查询
          onOffStatus(Pwd_Str).then(response => {
            this.switchNachine_show = false;
            let jsonobj =  JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if(jsonobj.code==200){

              this.fromApi.switchNachine = jsonobj.Data.Openstatus;
              if(tools.Is_null(jsonobj.Data.Openstatus)){
                this.switchNachine_show = true;
              }
            }else{
              this.msgError(jsonobj.msg);
            }
          })
          //物联卡机卡分离状态查询
          map.testType = "0";
          let BindPwd_Str = tools.encrypt(JSON.stringify(map));
          cardBindStatus(BindPwd_Str).then(response => {
            let jsonobj =  JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if(jsonobj.code==200){
              this.fromApi.MachineCardSeparation = jsonobj.Data.Bindstatus;
            }else{
              this.fromApi.MachineCardSeparation =  jsonobj.msg;
              //this.msgError(jsonobj.msg);
            }
          })
          this.cardInfoApiShow = true;//卡基础信息 显示 [API实时]
        }
      },


      // 号码匹对
      oneClickMatch() {
        let _this = this;

        this.sel = {};

        _this.cardInfoDetailsShow = false;
        if(_this.disabledDiagnosis == false){
          _this.btnDiagnosis = false;
          _this.disabledDiagnosis = true;
          if(tools.Is_null(_this.cardNo) && tools.Is_null(_this.selType)){

            if(_this.cardNo.length>4){
              _this.showempty = false; //空状态 显示
              _this.cardInfoShow = false; //卡基础信息 显示
              _this.resultShow = false; //匹对结果 显示
              _this.cardOnlineShow = false; //在线信息 显示
              _this.cardFlowShow = false; //资费详情 显示
              _this.cardChangeShow = false; //变更记录 显示
              _this.ApnArrShow = false;//Apn 显示 [API实时]
              _this.cardInfoApiShow = false;//卡基础信息 显示 [API实时]
              _this.ApnArrShow = false;
              _this.cardChangeAPIShow = false;
              _this.cardInfoApiShow = false;

              this.form = {};
              let map ={};
              map.selType = _this.selType;
              map.cardNo = _this.cardNo;
              //console.log(map)
              let Pwd_Str = tools.encrypt(JSON.stringify(map));
              cardMatch(Pwd_Str).then(response => {
                let jsonobj = JSON.parse(tools.Decrypt(response));
                console.log(jsonobj);
                if (jsonobj.code == 200) {
                  let Data = jsonobj.Data;
                  _this.cardCount = Data.cardCount;
                  if(Data.cardCount>0){
                    let row = Data.cardMatchMap;
                    this.sel.iccid = row.iccid;
                    switch (_this.selType) {
                      case "0":
                        _this.cardReference = row.vid;
                        break;
                      case "1":
                        _this.cardReference = row.msisdn;
                        break;
                      case "2":
                        _this.cardReference = row.iccid;
                        break;
                      case "3":
                        _this.cardReference = row.imsi;
                        break;
                    }
                    _this.cardPrefix = Data.cardPrefix;
                    _this.cardSuffix = Data.cardSuffix;
                    this.resultShow = true;
                    this.internalBool =  jsonobj.Data.is_Internal;
                    if(this.internalBool) {
                      //加载 API通道名称
                      if (window['findCr_RouteOptions'] != undefined && window['RouteOptions'] != null && window['findCr_RouteOptions'] != '') {
                        this.findCr_RouteOptions = window['findCr_RouteOptions'];
                      } else {
                        findCr().then(response => {
                          let jsonobj = JSON.parse(tools.Decrypt(response));
                          window['findCr_RouteOptions'] = jsonobj.Data;
                          this.findCr_RouteOptions = window['findCr_RouteOptions'];
                        });
                      }
                    }
                    this.BriefEditexecute = false;
                    this.show_Iccid =true;
                    _this.cardInfoShow = true;
                    _this.btnDiagnosis = true;
                    setTimeout(function(){
                      _this.disabledDiagnosis = false;
                    },3000);// 3 S 内禁止再次点击
                  }else{
                    _this.showempty = true;
                    _this.btnDiagnosis = true;
                    _this.disabledDiagnosis = false;
                  }
                }else{
                  _this.showempty = true;
                  _this.btnDiagnosis = true;
                  _this.disabledDiagnosis = false;
                }
              })

            }else{
              tools.MessageShow(_this,"请输入大于4位数的号码段 !！！","error");
              _this.btnDiagnosis = true;
              _this.disabledDiagnosis = false;
            }

          }else {
            tools.MessageShow(_this,"请输入需要匹对的 MSISDN、ICCID、IMSI、Vid(虚拟编号) 信息！！","error");
            _this.btnDiagnosis = true;
            _this.disabledDiagnosis = false;
          }
        }else{
          tools.MessageShow(_this,"请勿重复点击！3秒后重试。","error");
        }
      },


















    }
  };
</script>


<style >

  .el-table .cell{
    line-height: 14px!important;
  }
</style>

<style scoped>
  .el-form-item{
    margin-bottom: 10px;
  }
  .el-divider--horizontal{
    margin: 15px 0!important;
  }
</style>

