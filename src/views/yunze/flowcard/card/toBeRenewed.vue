<template>
  <div >
    <!--这里是标签页-->
    <div class="main">
      <div style="height: 35px;">
        <div style="float: right;">
          <el-row :gutter="10">
            <el-col :span="1.5">
              <el-button size="mini" type="primary" @click="nextStep">
                <span>下一步</span>
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="mini" type="danger"@click="delArrBR">
                <span>清空列表</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-table v-loading="BRloading" :data="BRcardArr" >
        <el-table-column label="MSISDN" align="center"  key="msisdn" prop="msisdn" />
        <el-table-column label="ICCID" align="center" key="iccid" prop="iccid"  />
        <el-table-column label="卡状态" align="center" key="status_ShowId" prop="status_ShowId">
          <template slot-scope="scope">
            {{ tools.getDkeyValue(stateShowId, scope.row.status_ShowId) }}
          </template>
        </el-table-column>
        <el-table-column label="所属公司" align="center" key="agent_id" prop="agent_id">
          <template slot-scope="scope">
            {{ tools.getDeptNamekeyValue(DeptOptions, scope.row.agent_id) }}
          </template>
        </el-table-column>
        <el-table-column label="资费组" align="center" prop="package_id" >
          <template slot-scope="scope">
            {{ tools.getkeyValue(packageOptions, scope.row.package_id, "package_id", "package_agentname") }}
          </template>
        </el-table-column>
        <el-table-column label="到期时间" align="center" prop="due_expire_time" />



        <el-table-column
          label="操作"
          align="center"
          width="90"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delBRcardArr(scope.$index)"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="toBeRenewedCount>0"
        :total="toBeRenewedCount"
        :page.sync="BRqueryParams.pageNum"
        :limit.sync="BRqueryParams.pageSize"
        @pagination="turnPages"
      />
    </div>
    <!-- 触发加载数据函数-->
    <span v-if="show_BeRenewed ==true && BeRenewedexecute == false">
        {{ LoadData() }}
    </span>


    <el-dialog :visible.sync="OneShow_BeRenewed" width="80%" :close-on-click-modal="false" append-to-body>
      <!--查看待续费 子组件-->
      <toBeRenewed_one ref="toBeRenewed_one"
                   :OneBeRenewedexecute="OneBeRenewedexecute" :OneShow_BeRenewed="OneShow_BeRenewed"  @OneSetObj="OneSetObj"
                   :toBeRenewedICCIDArr="toBeRenewedICCIDArr"   :customize_whether="customize_whether"

      />
    </el-dialog>

  </div>
</template>

<script>

  import tools from "@/utils/yunze/tools";
  import toBeRenewed_one from "./toBeRenewed_one";

  export default {
    components: {
      toBeRenewed_one,
    },
    props: {
      SetObj: Function,//父组件赋值 函数
      BeRenewedexecute: Boolean,//加载是否 已执行
      show_BeRenewed: Boolean,//当前界面是否显示
      packageOptions: Array,//简要套餐名称
      DeptOptions: Array,//公司信息
      operators_type: Array,//运营商类别
      stateShowId: Array,//卡状态
      toBeRenewedArr: Array,//展示表格
      toBeRenewedICCIDArr: Array,//ICCID数组
      toBeRenewedCount: Number,//数组 Count
      customize_whether: Array,//自定义是否

    },
    name: "toBeRenewed",
    data() {
      return {

        OneBeRenewedexecute: false,//加载是否 已执行
        OneShow_BeRenewed: false,//当前界面是否显示
        // 查询参数
        BRqueryParams: {
          pageNum: 1,
          pageSize: 10,
        },

        BRcardArr: [],//当前显示的卡号
        tablefrom_remarks: [],//备注信息
        internalBool: false,//内部人员
        tools: tools,
        // 遮罩层
        BRloading: true,

        //详情
        tablefrom: [],
      }
    },
    created() {


    },
    methods: {


      //设置数据
      OneSetObj(Key, obj) {
        //console.log(obj);
        switch (Key) {
          case 'SetOneBeRenewedexecute':
            this.OneBeRenewedexecute = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
          case 'SetOneShow_BeRenewed':
            this.OneShow_BeRenewed = obj;//设置    是否已经加载 [提供给子组件使用]
            break;
          case 'closeAll':
            this.OneShow_BeRenewed = obj;//设置
            this.$emit("SetObj", "ToBrcloseAll", false);//关闭当前界面
            break;
        }
      },





      LoadData() {
        //console.log("LoadData === = = = = =")
        this.$emit("SetObj", "SetBeRenewedexecute", true);//已加载
        this.attributionInfoList = [];//归属信息

        this.turnPages();

        this.BRloading = false;
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





      //移除
      delBRcardArr(index){
        let delIndex = tools.NumberMul(tools.NumberSub(''+this.BRqueryParams.pageNum,'1'),''+this.BRqueryParams.pageSize);
        delIndex = tools.NumberAdd(delIndex,''+index);
        this.toBeRenewedArr.splice(delIndex,1);
        this.toBeRenewedICCIDArr.splice(delIndex,1);
        this.BRqueryParams.pageNum = 1;//重置到第一页
        this.$emit("SetObj", "SetToBeRenewedCount", tools.NumberSub(''+this.toBeRenewedCount,'1'));//
        this.turnPages();
      },



      //翻页
      turnPages(){
        let stIndex = tools.NumberMul(tools.NumberSub(''+this.BRqueryParams.pageNum,'1'),''+this.BRqueryParams.pageSize);
        let endIndex = tools.NumberAdd(stIndex,''+this.BRqueryParams.pageSize);
        this.BRcardArr = this.toBeRenewedArr.slice(stIndex,endIndex);
      },


      //清空 列表
      delArrBR(){
        tools.openAsk(this, 'warning', "确定将筛选 [ " + this.toBeRenewedCount + " ] 条数据  清空吗？", this.resetBRArr,[]);
      },
      //重置
      resetBRArr(arr){
        this.$emit("SetObj", "SetToBeRenewedArr", arr);//清空列表
        this.$emit("SetObj", "SetToBeRenewedCount",arr.length );//
        let ICCIDArr = [];
        for (let i = 0; i < arr.length; i++) {
          ICCIDArr.push(arr.iccid);
        }
        this.$emit("SetObj", "SettoBeRenewedICCIDArr",ICCIDArr );//
        if(arr.length==0){
          this.BRcardArr = [];
        }else{
          this.turnPages();
        }

      },


      //跳转至 通道
      aChannel() {
        //为卡详情的时候 关闭显示 否则 不关闭
        if(this.showDiagnosis==true){
          this.$emit("SetObj", "Setshow_ds", false);//已加载
        }
      },


      //下一步 【筛选出 1.已经在flow表有充值的卡号 2.状态在售  】
      nextStep(){
        if(this.BRcardArr.length>0){
          this.OneBeRenewedexecute =  false;//加载是否 已执行
          this.OneShow_BeRenewed = true;//当前界面是否显示
        }else{
          this.msgError("请先选择需要操作的卡号！");
        }

      },


    },
  }
</script>




