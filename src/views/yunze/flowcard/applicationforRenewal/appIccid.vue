<template>
  <div >
    <!--这里是标签页-->
    <div class="main">

      <el-table v-loading="BRTowLoading" :data="BRTowCardArr" >
        <el-table-column label="ICCID" align="center" key="iccid" prop="iccid"  />
      </el-table>

      <pagination
        v-show="rtCount>0"
        :total="rtCount"
        :page.sync="towBRqueryParams.pageNum"
        :limit.sync="towBRqueryParams.pageSize"
        @pagination="loadBrCard"
      />
      <!-- 触发加载数据函数-->
      <span v-if="show_Iccid ==true && IccidEditexecute == false">
        {{ LoadBRTowData() }}
      </span>

    </div>
  </div>
</template>

<script>
  import tools from "@/utils/yunze/tools";
  import {findIccid  } from "@/api/yunze/flowcard/renewal";

  export default {
    props: {
      IccidSetObj: Function,//父组件赋值 函数
      IccidEditexecute: Boolean,//加载是否 已执行
      show_Iccid: Boolean,//当前界面是否显示
      b_id: Number,//查询 b_id
    },
    name: "appIccid",
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
          b_id:this.b_id,
        },
        rtCount:0,
      }
    },
    created() {


    },
    methods: {
      LoadBRTowData() {
        this.$emit("IccidSetObj", "SetIccidEditexecute", true);//已加载

        this.loadBrCard();
      },



      loadBrCard() {
        this.BRTowLoading = true;
        this.BRTowCardArr = [];
       // console.log(this.towBRqueryParams)
        let Pwd_Str = tools.encrypt(JSON.stringify(this.towBRqueryParams));
        findIccid(Pwd_Str).then(response => {
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



