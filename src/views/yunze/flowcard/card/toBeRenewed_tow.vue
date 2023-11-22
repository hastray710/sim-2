<template>
  <div >
    <!--这里是标签页-->
    <div class="main">

      <el-table v-loading="BRTowLoading" :data="BRTowCardArr" >
        <el-table-column label="MSISDN" align="center"  key="msisdn" prop="msisdn" />
        <el-table-column label="ICCID" align="center" key="iccid" prop="iccid"  />
        <el-table-column label="IMEI" align="center"  key="imei" prop="imei" />
        <el-table-column label="用量MB" align="center" key="used" prop="used"  />
        <el-table-column label="剩余MB" align="center"  key="remaining" prop="remaining" />
        <el-table-column label="到期时间" align="center" key="due_expire_time" prop="due_expire_time"  />
      </el-table>

      <pagination
        v-show="rtCount>0"
        :total="rtCount"
        :page.sync="towBRqueryParams.pageNum"
        :limit.sync="towBRqueryParams.pageSize"
        @pagination="loadBrCard"
      />
      <!-- 触发加载数据函数-->
      <span v-if="TowShow_BeRenewed ==true && TowBeRenewedexecute == false">
        {{ LoadBRTowData() }}
      </span>

    </div>
  </div>
</template>

<script>
  import tools from "@/utils/yunze/tools";
  import {listCard} from "@/api/yunze/flowcard/card/card";
  export default {
    props: {
      TowSetObj: Function,//父组件赋值 函数
      TowBeRenewedexecute: Boolean,//加载是否 已执行
      TowShow_BeRenewed: Boolean,//当前界面是否显示
      toBRIccidArr: Array,//查询iccid 数组
    },
    name: "toBeRenewed_tow",
    data() {
      return {
        tools: tools,
        BRTowLoading:true,
        BRTowCardArr:[],//续费配置数组
        packetCardCount:{},//续费资费计划下 卡号数据
        // 查询参数
        towBRqueryParams: {
          pageNum: 1,
          pageSize: 10,
          toBRIccidArr:this.toBRIccidArr,
        },
        rtCount:0,
      }
    },
    created() {


    },
    methods: {
      LoadBRTowData() {
        this.$emit("TowSetObj", "SetTowBeRenewedexecute", true);//已加载

        this.loadBrCard();
      },



      loadBrCard() {
        this.BRTowLoading = true;
        this.BRTowCardArr = [];
        //console.log(this.towBRqueryParams)
        let Pwd_Str = tools.encrypt(JSON.stringify(this.towBRqueryParams));
        listCard(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
          this.BRTowLoading = false;
            if (jsonobj.code == 200) {

              //console.log(jsonobj)
              this.BRTowCardArr = jsonobj.Data.Data;
              this.rtCount = jsonobj.Data.Pu.rowCount;
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



