<template>
  <div >
    <!--这里是标签页-->
    <div class="main">

      <el-table v-loading="BROneLoading" :data="BROneCardArr" >
        <el-table-column label="编号" prop="packet_id" width="250px;"/>
        <el-table-column label="名称" prop="packet_wx_name"/>
        <el-table-column label="流量(MB)" prop="packet_flow"/>
        <el-table-column label="售价" prop="packet_price"/>
        <el-table-column label="成本" prop="packet_cost"/>
        <el-table-column label="卡数量" prop="packet_id">
          <template slot-scope="scope">
            <el-button @click="openBROneCard(packetCardCount[''+scope.row.packet_id])" type="text">{{ (packetCardCount[''+scope.row.packet_id]).length }}</el-button>
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

      <div style="height: 35px;margin-top: 20px">
        <div style="float: right;">
          <el-row :gutter="10">
            <el-col :span="1.5">
              <el-button size="mini" type="primary" @click="renewNow">
                <span>立即续费</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 触发加载数据函数-->
      <span v-if="OneShow_BeRenewed ==true && OneBeRenewedexecute == false">
        {{ LoadBROneData() }}
      </span>


      <el-dialog :visible.sync="TowShow_BeRenewed" width="80%" :close-on-click-modal="false" append-to-body>
        <!--查看待续费 子组件-->
        <toBeRenewed_tow ref="toBeRenewed_tow"
                         :TowBeRenewedexecute="TowBeRenewedexecute" :TowShow_BeRenewed="TowShow_BeRenewed"  @TowSetObj="TowSetObj"
                         :toBRIccidArr="toBRIccidArr"

        />
      </el-dialog>


      <el-dialog :visible.sync="ThreeShow_BeRenewed" width="80%" :close-on-click-modal="false" append-to-body>
        <!--查看待续费 子组件-->
        <toBeRenewed_three ref="toBeRenewed_three"
                         :ThreeBeRenewedexecute="ThreeBeRenewedexecute" :ThreeShow_BeRenewed="ThreeShow_BeRenewed"  @ThreeSetObj="ThreeSetObj"
                         :customize_whether="customize_whether" :BRThreeCardArr="BRThreeCardArr" :toBePaid="toBePaid" :BRpacketCardCount="BRpacketCardCount"
                           :OperationType="OperationType"

        />
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import {findToBR} from "@/api/yunze/flowcard/agentTariffGroup";
  import tools from "@/utils/yunze/tools";
  import toBeRenewed_tow from "./toBeRenewed_tow";
  import toBeRenewed_three from "./toBeRenewed_three";

  export default {
    components: {
      toBeRenewed_tow,
      toBeRenewed_three,
    },
    props: {
      OneSetObj: Function,//父组件赋值 函数
      OneBeRenewedexecute: Boolean,//加载是否 已执行
      OneShow_BeRenewed: Boolean,//当前界面是否显示
      customize_whether: Array,//自定义是否
      toBeRenewedICCIDArr: Array,//
    },
    name: "toBeRenewed_one",
    data() {
      return {
        tools: tools,
        BROneLoading:true,
        BROneCardArr:[],//续费配置数组
        packetCardCount:{},//续费资费计划下 卡号数据
        TowBeRenewedexecute: false,//加载是否 已执行
        TowShow_BeRenewed: false,//当前界面是否显示

        BRpacketCardCount:{},//续费资费计划下 卡号数据 [允许续费的]
        ThreeBeRenewedexecute: false,//加载是否 已执行
        ThreeShow_BeRenewed: false,//当前界面是否显示
        BRThreeCardArr:[],//立即续费数组
        toBRIccidArr:[],//查询资费下卡号
        toBePaid:0,//待支付金额
        OperationType:'ToBr',//操作类型
      }
    },
    created() {


    },
    methods: {
      LoadBROneData() {
        this.$emit("OneSetObj", "SetOneBeRenewedexecute", true);//已加载
        this.BROneLoading = false;
        this.loadToBR();
      },


      ThreeSetObj(Key, obj) {
        //console.log(obj);
        switch (Key) {
          case 'SetThreeBeRenewedexecute':
            this.ThreeBeRenewedexecute = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
          case 'SetThreeShow_BeRenewed':
            this.ThreeShow_BeRenewed = obj;//设置    是否已经加载 [提供给子组件使用]
          case 'closeAll':
            this.ThreeShow_BeRenewed = obj;//设置
            this.$emit("OneSetObj", "closeAll", false);//关闭所有
            break;
        }
      },


      //设置数据
      TowSetObj(Key, obj) {
        //console.log(obj);
        switch (Key) {
          case 'SetTowBeRenewedexecute':
            this.TowBeRenewedexecute = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
          case 'SetTowShow_BeRenewed':
            this.TowShow_BeRenewed = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
        }
      },

      //立即续费
      renewNow(){
        if(this.BROneCardArr.length>0){
          this.BRThreeCardArr = [];
          this.BRpacketCardCount = {};
          this.toBePaid = 0;
          let toBePaid = 0;
          for (let i = 0; i < this.BROneCardArr.length; i++) {
            let obj = this.BROneCardArr[i];
            let addObj = {};
            if(obj.in_stock==1){
              let packetArr = this.packetCardCount[''+obj.packet_id];
              this.BRpacketCardCount[''+obj.packet_id] = packetArr;
              obj.packetCardCount = packetArr.length;
              toBePaid = tools.NumberAdd(toBePaid,tools.NumberMul(obj.packet_cost, obj.packetCardCount));//待支付 = 成本*数量
              this.BRThreeCardArr.push(obj);
            }
          }
          //console.log(this.BRpacketCardCount)
          console.log(this.BRThreeCardArr)
          this.toBePaid =  toBePaid;
          this.ThreeBeRenewedexecute =  false;//加载是否 已执行
          this.ThreeShow_BeRenewed = true;//当前界面是否显示
        }else{
          this.msgError("请先选择需要操作的数据！");
        }



      },

      //查看续费资费计划下卡号数据
      openBROneCard(cardArr){
        let iccidArr = [];//获取对应资费下卡号
        for (let i = 0; i < cardArr.length; i++) {
          iccidArr.push(cardArr[i].iccid);
        }
        //console.log(iccidArr)
        this.toBRIccidArr = iccidArr,//查询资费下卡号
        this.TowBeRenewedexecute =  false;//加载是否 已执行
        this.TowShow_BeRenewed = true;//当前界面是否显示
      },


      loadToBR() {
        this.BROneLoading = true;
        this.BROneCardArr = [];
        let map = {};
        map.BrIccidArr = this.toBeRenewedICCIDArr ;

        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        findToBR(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
          this.BROneLoading = false;
          if (jsonobj.code == 200) {
              //console.log(jsonobj)
              this.BROneCardArr = jsonobj.Data.packetArr;
              this.packetCardCount = jsonobj.Data.packetCardCount;

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



