<template>
  <div>
    <!--这里是标签页-->
    <div class="main">
      <div style="height: 35px;">
        <router-link style="float: right;" v-hasPermi="['yunze:sys:internal']"
                     :to="'/card/Channel?Pstr='+ tools.encrypt(JSON.stringify({'cd_id':sel.findcd_id}))">
          <el-button size="mini" type="primary" style="margin-left: 20px" @click="aChannel">
            <span>查看通道信息</span>
          </el-button>
        </router-link>
        <router-link style="float: right;" v-hasPermi="['yunze:sys:internal']" v-if="showDiagnosis"
                     :to="'/card/diagnosis/'+ tools.encrypt(JSON.stringify({'cardNo':sel.iccid}))">
          <el-button size="mini" type="primary" style="margin-left: 20px" @click="aChannel">
            <span class="el-icon-connection">诊断</span>
          </el-button>
        </router-link>

      </div>
      <el-card shadow="always">
        <el-table
          :data="tablefrom"
          :show-header="false"
          border>
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
        <el-table
          :data="tablefrom_remarks"
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
        </el-table>


      </el-card>

    </div>
    <!-- 触发加载数据函数-->
    <span v-if="show_Iccid ==true && BriefEditexecute == false">
        {{ LoadData() }}
    </span>


  </div>
</template>

<script>
  import {
    getCard,
    queryflowSimple
  } from "@/api/yunze/flowcard/card/card";
  import tools from "@/utils/yunze/tools";
  import {getselTime} from "@/api/yunze/flowcard/card/change";


  export default {
    props: {
      SetObj: Function,//父组件赋值 函数
      BriefEditexecute: Boolean,//加载是否 已执行
      show_Iccid: Boolean,//当前界面是否显示
      sel: Object,
      access_type: Array,// 卡板接入方式
      online_status: Array,// 卡板在线状态
      DxCMP_RAT: Array,// 电信CMP接入类型
      DxCMP_online: Array,// 电信CMP在线状态
      packageOptions: Array,//简要套餐名称
      DeptOptions: Array,//公司信息
      DxCMP_netModel_type: Array,//电信CMP无线接入模式
      operators_type: Array,//运营商类别
      stateShowId: Array,//卡状态
      card_types: Array,//卡类型
      network_types: Array,//网络类型
      customize_whether: Array,//自定义是否
      findCr_RouteOptions: Array,//API通道信息
      RouteOptions: Array,//API通道信息
      cardConnectionTypeOptions: Array,//断开网状态
      stateOptions: Array,//卡状态描述
      YDcard_attributionOptions: Array,// 移动 归属地 字典
      showDiagnosis: Boolean,//是否显示诊断
    },
    name: "cardInfoBrief",
    data() {
      return {

        tablefrom_remarks: [],//备注信息
        internalBool: false,//内部人员
        tools: tools,


        //详情
        tablefrom: [],
      }
    },
    created() {


    },
    methods: {

      LoadData() {
        //console.log("LoadData === = = = = =")
        this.$emit("SetObj", "SetBriefEditexecute", true);//已加载
        this.attributionInfoList = [];//归属信息
        this.finddata(this.sel);
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
      finddata(row) {
        this.tablefrom = [];//清空数据
        this.tablefrom_remarks = [];//清空数据
        this.reset();
        let map = {};
        map.iccid = row.iccid;
        //console.log(map);
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        getCard(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            this.internalBool = jsonobj.deptId == '100' ? true : false;

            if (jsonobj.code == 200) {
              this.form = jsonobj.Data;
              row = jsonobj.Data;
              this.form.status_id = "" + this.form.status_id + "";

              let sel = {};
              sel.iccid = this.form.iccid;
              sel.agent_id = this.form.agent_id;
              sel.package_id = this.form.package_id;
              sel.findcd_id = this.form.channel_id;
              sel.remind_ratio = this.form.remind_ratio;
              sel.customize_grouping = this.form.customize_grouping;
              sel.is_Disconnected = this.form.is_Disconnected;
              sel.syn_Time = this.form.syn_Time;
              sel.open_date = this.form.open_date;
              sel.connection_status = this.form.connection_status;
              sel.is_Disconnected = this.form.is_Disconnected;
              this.$emit("SetObj", "SetSel", sel);//赋值 sel

              let map1 = {};
              map1.label1 = "MSISDN";
              map1.value1 = jsonobj.Data.msisdn;
              map1.label2 = "ICCID";
              map1.value2 = jsonobj.Data.iccid;
              map1.label3 = "IMSI";
              map1.value3 = jsonobj.Data.imsi;
              map1.label4 = "IMEI";
              map1.value4 = jsonobj.Data.imei;
              this.tablefrom.push(map1);


              queryflowSimple(Pwd_Str).then(res => {
                  let jBj = JSON.parse(tools.Decrypt(res));
                  //console.log(jBj);
                  let map2 = {};
                  map2.label1 = "运营商";
                  if (tools.Is_null(jsonobj.Data.cd_operator_type)) {
                    map2.value1 = tools.getDkeyValue(this.operators_type, jsonobj.Data.cd_operator_type);
                  } else {
                    map2.value1 = "暂未划分API通道";
                  }

                  map2.label2 = "卡状态";
                  map2.value2 = tools.getDkeyValue(this.stateShowId, jsonobj.Data.status_ShowId);

                  if (this.internalBool) {
                    if (map2.value1 == '移动' && jsonobj.Data.iccid.length > 12) {
                      let subStr = jsonobj.Data.iccid.substring(8, 12);
                      let attributionCode = subStr.substring(0, 2);
                      let YY = subStr.substring(2, subStr.length);
                      let attribution = tools.getDkeyValue(this.YDcard_attributionOptions, attributionCode);
                      map2.value1 += " [" + attribution + "] [ " + YY + " 年开卡] ";
                    }
                    map2.value2 += " [" + tools.getDkeyValue(this.stateOptions, jsonobj.Data.status_id) + "]";
                  }
                  map2.label3 = "数据服务";
                  map2.value3 = row.connection_status != null ? tools.getDkeyValue(this.cardConnectionTypeOptions, '' + row.connection_status) : "";
                  map2.label4 = "网络类型";
                  map2.value4 = tools.getDkeyValue(this.network_types, jsonobj.Data.network_type);
                  this.tablefrom.push(map2);


                  let map3 = {};
                  map3.label1 = "开卡日期";
                  map3.value1 = row.open_date;
                  map3.label2 = "激活日期";
                  map3.value2 = jsonobj.Data.activate_date;
                  map3.label3 = jBj.Data != undefined && jBj.Data != null ? "服务周期  ( " + jBj.Data.packet_valid_time + " " + jBj.Data.packet_valid_name + " ) " : '服务周期';
                  map3.value3 = jBj.Data != undefined && jBj.Data != null ? jBj.Data.end_time : '';
                  map3.label4 = "同步时间";
                  map3.value4 = row.syn_Time;
                  this.tablefrom.push(map3);


                  let map4 = {};
                  map4.label1 = "资费组";
                  map4.value1 = tools.getkeyValue(this.packageOptions, row.package_id, "package_id", "package_agentname");
                  map4.label2 = "资费计划";
                  map4.value2 = jBj.Data != undefined && jBj.Data != null ? jBj.Data.packet_wx_name : '未订购';
                  map4.label3 = "用量（MB）";
                  map4.value3 = jsonobj.Data.used;
                  map4.label4 = "剩余（MB）";
                  map4.value4 = jsonobj.Data.remaining;
                  this.tablefrom.push(map4);

                  let map5 = {};

                  map5.label1 = "所属企业";
                  map5.value1 = tools.getDeptNamekeyValue(this.DeptOptions, row.agent_id);
                  map5.label2 = "所属通道";
                  map5.value2 = tools.getkeyValue(this.RouteOptions, '' + this.sel.findcd_id, "cd_id", "cd_alias");


                  if (this.internalBool) {
                    map5.label3 = "是否轮询 [" + tools.getDkeyValue(this.customize_whether, jsonobj.Data.is_polling) + "]";
                    map5.value3 = "未订购停机 [" + tools.getDkeyValue(this.customize_whether, row.is_Disconnected) + "]";
                    map5.label4 = "限额（MB）";
                    map5.value4 = row.remind_ratio;
                  }
                  this.tablefrom.push(map5);

                  let map6 = {};
                  map6.label1 = "分组";
                  map6.value1 = jsonobj.Data.customize_grouping;
                  this.tablefrom_remarks.push(map6);

                  let map7 = {};
                  map7.label1 = "备注";
                  map7.value1 = jsonobj.Data.remarks;
                  this.tablefrom_remarks.push(map7);


                }
              );


              // this.cardInfoTitle = "卡基础信息 (已同步数据)";
            } else {
              this.msgError(jsonobj.msg);
            }
            this.loading = false;
          }
        );

      },


      //跳转至 通道
      aChannel() {
        //为卡详情的时候 关闭显示 否则 不关闭
        if(this.showDiagnosis==true){
          this.$emit("SetObj", "Setshow_ds", false);//已加载
        }
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

