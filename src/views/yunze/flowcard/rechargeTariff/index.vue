<template>
  <div class="app-container">


      <el-main style="padding-top: 2%;padding-left: 3%">
        <el-row >
          <el-col :span="12">
            <el-form :model="queryParams" ref="queryForm"   label-width="87px">
            <el-form-item  prop="status">
              <h4>ICCID批量充值</h4>
            </el-form-item>
            <el-form-item  prop="status">
               <span slot="label">
                资费选择
                <el-tooltip placement="right">
                  <div slot="content">
                    选择充值资费组 与 资费计划 进行充值
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>

              <el-select
                v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
                v-model="queryParams.package_id"
                placeholder="资费组"
                clearable
                ref="packageSel"
                @change="packageSelChange"
                size="small"
                style="width: 210px"
              >
                <el-option
                  v-for="dict in packageOptions"
                  :key="dict.package_id"
                  :label="dict.package_agentname"
                  :value="dict.package_id"
                />
              </el-select>

              <el-select
                v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
                v-model="queryParams.packet_id"
                placeholder="资费计划"
                clearable
                @change="PacketSelChange"
                size="small"
                style="width: 210px"
              >
                <el-option
                  v-for="dict in PacketSelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>

            </el-form-item>
            <el-form-item  prop="status">
              <span slot="label">
                生效类型
                <el-tooltip placement="right">
                  <div slot="content">
                    选择  资费计划 时生效类型会根据当前资费计划切换为推荐类型
                    <br />当然，生效类型是可选择的 灵活的，可根据实际需求切换。
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>

              <el-select
                v-model="queryParams.validate_type"
                placeholder="生效类型"
                clearable
                ref="packageSel"
                size="small"
                @change="validateTypeChange"
                style="width: 210px"
              >
                <el-option
                  v-for="dict in validateTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
                <span slot="label">
                  资费详情
                  <el-tooltip placement="right">
                    <div slot="content">
                      资费计划详情
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>

                <el-row >
                  <el-col :span="4" >
                  <span>资费周期 : </span>  <el-tag size="small">{{packet.packet_valid_time}}</el-tag>
                  </el-col>
                  <el-col :span="4" ><span>周期单位 : </span><el-tag size="small">{{packet.packet_valid_name}}</el-tag></el-col>
                  <el-col :span="8"  ><span>周期用量MB : </span><el-tag size="small">{{packet.packet_flow}}</el-tag></el-col>
                </el-row>
            </el-form-item>

              <el-form-item v-if="internalBool" >
                <span slot="label">
                  操作方式
                  <el-tooltip placement="right">
                    <div slot="content">
                      上传文件：更具下载模板上传卡号；文本域操作赋值卡号进行操作；
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>

                <el-switch
                  v-model="uploadType"
                  active-text="上传文件"
                  inactive-text="文本域操作">
                </el-switch>
              </el-form-item>

              <el-form-item v-if="!uploadType">
                <span slot="label">
                  物联卡号
                  <el-tooltip placement="right">
                    <div slot="content">
                      卡号之间以换行隔开
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                <div  style="color:red" >提示：卡号之间以换行隔开 ！<br>(大于100条/次操作禁止使用卡号输入方式充值！)</div>
                <div class="text-area">
                       <textarea name="content" id="content"  v-model="iccidStr" placeholder="请输入ICCID卡号"
                                 style="width: 350px;height:200px;font-size:9pt;font-family:verdana;color:#333333" >

                      </textarea>
                </div>
              </el-form-item>
              <el-form-item v-if="!uploadType">
                <el-button type="primary"  v-if="submitFileFormBtn" @click="subTextarea">确 定</el-button>
              </el-form-item>

             <el-form-item v-if="uploadType">
                <el-upload
                  ref="upload"
                  :limit="1"
                  accept=".xlsx, .xls"
                  :headers="upload.headers"
                  :action="upload.url"
                  :disabled="upload.isUploading"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :auto-upload="false"
                  :data="{Pstr:this.upload.Pstr}"
                  drag
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                  <div class="el-upload__tip" slot="tip">
                    <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
                  </div>
                  <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
                </el-upload>
              </el-form-item>
              <el-form-item v-if="uploadType">
                <el-button type="primary"  v-if="submitFileFormBtn" @click="submitFileForm">确 定</el-button>
              </el-form-item>


            </el-form>
          </el-col>
        </el-row>
      </el-main>

    <el-dialog :visible.sync="ThreeShow_BeRenewed" width="80%" :close-on-click-modal="false" append-to-body>
      <!--查看待续费 子组件-->
      <toBeRenewed_three ref="toBeRenewed_three"
                         :ThreeBeRenewedexecute="ThreeBeRenewedexecute" :ThreeShow_BeRenewed="ThreeShow_BeRenewed"  @ThreeSetObj="ThreeSetObj"
                         :customize_whether="customize_whether" :BRThreeCardArr="BRThreeCardArr" :toBePaid="toBePaid" :BRpacketCardCount="BRpacketCardCount"
                         :OperationType="OperationType"  :validate_map="validate_map"

      />
    </el-dialog>

  </div>
</template>

<script>
import { FindPacket } from "@/api/yunze/flowcard/rechargeTariff";
import { queryPacketSimple,TextRecharge,findRecharged} from "@/api/yunze/order/order";
import { queryPackageSimple,verifyBelonging} from "@/api/yunze/flowcard/card/card";
import { getToken } from "@/utils/auth";
import tools from "@/utils/yunze/tools";
import toBeRenewed_three from "../card/toBeRenewed_three";



export default {
  name: "RechargeTariff",
  components: {
    toBeRenewed_three,
  },
  data() {
    return {
      //保存 编辑 按钮
      executionTaskDis: false,
      iccids:[],
      validateTypeOptions:[],//生效类型
      validate_map:{},//生效类型

      deptCheckStrictly: true,
      deptExpand: true,
      deptNodeAll: false,
      uploadType: false,//上传文件方式
      customize_whether: [],//自定义是否
      ExecutionTask_OutType : [],// 执行日志导出类别

      SetMealImport:false, //详情查询 套餐信息
      show_ds:false, //详情查询
      selTime:'',//时间选择
      mainwidth:24,//宽度
      option_show:false, //公司所属查询
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      cardList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      typeOptions: [],
      // 连接管理时间查询类型 数据字典
      timetypeOptions: [],
      // 简要套餐名称
      packageOptions: [],
      PacketOptions: [],//资费计划
      PacketSelOptions:[],//资费计划查询
      submitFileFormBtn:true,//导入 btn

      iccidStr:'',//iccid 文本域充值字符串

      //详情
      tablefrom: [],

      FlowData : [],
      selIccid:[{FlowData:''}],
      activeNames:[0],

      //卡状态
      status_type: "",
      // 卡状态 字典
      stateOptions: [
        {
          dictLabel:''
        }
      ],
      packet:{
        packet_flow:'-',
        packet_valid_time:'-',
        packet_valid_name:'-'
      },

      // 运营商类别 字典
      operators_type: [],
      // 执行日志状态 字典
      channelStatusOptions: [],
      // 执行日志编码 字典
      channelCodeOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/yunze/order/importRecharge",
        Pstr:'',//携带参数
      },

      internalBool:false,//内部人员
      toBePaid:0,//待支付金额
      ThreeBeRenewedexecute: false,//加载是否 已执行
      ThreeShow_BeRenewed: false,//当前界面是否显示
      OperationType:'Recharge',//操作类型
      BRThreeCardArr:[],//立即续费数组
      BRpacketCardCount:{},//续费资费计划下 卡号数据 [允许续费的]

      //当前查询参数
      sel:{
        iccid:'',
        agent_id:'',
        package_id:'',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        packet_id:null,
        validate_type:null,
        type: null,
        value: null,
        cd_status: [],
      },
      // 列信息
      columns: [
        { key: 0, label: `任务名`, visible: true },
        { key: 1, label: `创建时间`, visible: true },
        { key: 2, label: `修改时间`, visible: true },
        { key: 3, label: `开始时间`, visible: true },
        { key: 4, label: `结束时间`, visible: true },
        { key: 5, label: `创建人`, visible: true },
      ],
      // 表单校验
      rules: {
      }




    };
  },

  created() {



    //加载 资费组名称
    if(window['packageOptions']!=undefined &&  window['packageOptions']!=null && window['packageOptions']!=''){
      this.packageOptions = window['packageOptions'];
    }else{
      queryPackageSimple().then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        this.internalBool =  jsonobj.deptId=='100'?true:false;
        window['packageOptions'] = jsonobj.Data;
        this.packageOptions = window['packageOptions'];
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


    //加载 资费计划
    if(window['PacketOptions']!=undefined &&  window['PacketOptions']!=null && window['PacketOptions']!=''){
      this.PacketOptions = window['PacketOptions'];
      this.filterPacketOptions();
    }else{
      queryPacketSimple().then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        window['PacketOptions'] = jsonobj.Data;
        let arr = jsonobj.Data;
        var new_map = {},
          dest = [];
        if(arr!=null && arr.length>0){
          for(var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            if(!new_map[ai.package_id]) { //依赖分组字段可自行更改！
              dest.push({
                package_id: ai.package_id, //依赖分组字段可自行更改！
                data: [ai]
              });
              new_map[ai.package_id] = ai; //依赖分组字段可自行更改！
            } else {
              for(var j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if(dj.package_id == ai.package_id) { //依赖分组字段可自行更改！
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }
          //存储资费计划
          for (let i = 0; i < dest.length; i++) {
            let obj = dest[i];
            window['PackageOptions_'+obj.package_id] = obj.data;
            //存储生效类型
            if(obj.data!=null && obj.data.length>0){
              for (let j = 0; j < obj.data.length; j++) {
                let Pobj = obj.data[j];
                window['validateTypeOptions_'+Pobj.dictValue] = Pobj.packet_valid_type;
              }
            }
          }
        }

        this.PacketOptions = window['PacketOptions'];
        this.filterPacketOptions();
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


  },
  methods: {


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



    //过滤 不可充值的 资费
    filterPacketOptions(){
    if(!this.internalBool) {
      let PacketSelOptions = [];
      for (let i = 0; i < this.PacketSelOptions.length; i++) {
        let dict = this.PacketSelOptions[i];
        let balance_pay = dict.balance_pay;
        let wechat_pay = dict.wechat_pay;
        let in_stock = dict.in_stock;

        if (wechat_pay == "1" || balance_pay == "1") {
          if(in_stock=='1'){
            PacketSelOptions.push(dict);
          }
        }
      }
      this.PacketSelOptions = PacketSelOptions;
    }
  },



    //过滤 生效类型
    filterValidateTypeOptions(){
      if(!this.internalBool){
        let validateTypeOptions = [];
        for (let i = 0; i < this.validateTypeOptions.length; i++) {
          let dict = this.validateTypeOptions[i];
          let dictValue = dict.dictValue;
          if(dictValue=="1" || dictValue=="2"){
            validateTypeOptions.push(dict);
          }
        }
        this.validateTypeOptions = validateTypeOptions;
      }
    },







    /**资费组选择*/
    packageSelChange(){
      if(tools.Is_null(this.queryParams.package_id)){
        //console.log(window['PackageOptions_'+this.queryParams.package_id]);
        //重置选项
        this.queryParams.packet_id =null;
        this.queryParams.validate_type =null;
        this.PacketSelOptions = window['PackageOptions_'+this.queryParams.package_id];
        this.filterPacketOptions();
        this.packet.packet_flow = '-';
        this.packet.packet_valid_time = '-';
        this.packet.packet_valid_name = '-';
        this.filterValidateTypeOptions();
      }
      this.getPwd_Str();
    },

    //资费计划切换
    PacketSelChange(){
      if(tools.Is_null(this.queryParams.packet_id)){
        this.queryParams.validate_type =  ""+window['validateTypeOptions_'+this.queryParams.packet_id];
        let map = {};
        map.package_id = this.queryParams.package_id;
        map.packet_id = this.queryParams.packet_id;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        FindPacket(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          if(jsonobj.code==200){
            this.packet = jsonobj.Data;
          }else{
            this.msgError("查询单条 资费计划  简要 异常！");
          }
        });
        this.getPwd_Str();
      }
    },

    validateTypeChange(){
      this.getPwd_Str();
    },
    // 加密数据
    getPwd_Str(){
      let map ={};
      map.package_id = this.queryParams.package_id;
      map.packet_id = this.queryParams.packet_id;
      map.validate_type = this.queryParams.validate_type;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      this.upload.Pstr = Pwd_Str;
    },


    /** 下载模板操作 */
    importTemplate() {
      let map = {};
      map.path = "/getcsv/ImportRecharge.cvs";
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API+"/yunze/ExecutionTask/downloadConversion?Pstr="+Pwd_Str, '_blank');
    },




    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.submitFileFormBtn = true;
    },
    // 提交上传文件
    submitFileForm() {
      this.submitFileFormBtn = false;
      let _this = this;
      if (tools.VerificationsText(_this, _this.queryParams.package_id, "请选择资费组！") == true &&
        tools.VerificationsText(_this, _this.queryParams.packet_id, "请选择资费计划！") == true &&
        tools.VerificationsText(_this, _this.queryParams.validate_type, "请选择生效类型！") == true )
      {
        this.$refs.upload.submit();
      }else {
        this.submitFileFormBtn = true;
      }
    },

    //文本域提交申请
    subTextarea() {
      this.submitFileFormBtn = false;
      let _this = this;
      if (tools.VerificationsText(_this, _this.queryParams.package_id, "请选择资费组！") == true &&
        tools.VerificationsText(_this, _this.queryParams.packet_id, "请选择资费计划！") == true &&
        tools.VerificationsText(_this, _this.queryParams.validate_type, "请选择生效类型！") == true )
      {

        let rMap = tools.textareaGetNotRepeating(this.iccidStr);
        let iccidArr = rMap.rArr;
        let repeatCount = rMap.repeatCount;
        if(repeatCount>0){
          tools.open(this,"已过滤重复号码 [ "+repeatCount+" ] 条！");
        }

        if(iccidArr!=null && iccidArr.length>0){
          if(iccidArr.length<=100){
            let map = _this.queryParams;
            map.iccidArr = iccidArr ;

            let Pwd_Str = tools.encrypt(JSON.stringify(map));


            if(this.internalBool){//内部人员充值
              TextRecharge(Pwd_Str).then(response => {
                  let jsonobj = JSON.parse(tools.Decrypt(response));
                  this.BROneLoading = false;
                  if (jsonobj.code == 200) {
                    this.msgSuccess(jsonobj.Data);
                  } else {
                    this.msgError(jsonobj.msg);
                  }
                  this.submitFileFormBtn = true;
                }
              );
            }else{//企业 充值
              //判断卡号是否在名下及所属名下

              let vMap = {};
              vMap.outCardIccidArr = iccidArr ;//判断是否名下数组
              let vPwd_Str = tools.encrypt(JSON.stringify(vMap));

               verifyBelonging(vPwd_Str).then(response => {
                  let jsonobj = JSON.parse(tools.Decrypt(response));
                  this.BROneLoading = false;
                  if (jsonobj.code == 200) {
                    if(jsonobj.Data!=undefined && jsonobj.Data!=null && jsonobj.Data.length>0){

                      if(iccidArr.length!=jsonobj.Data.length){
                       let notVerifyBelongingCount = tools.NumberSub(iccidArr.length,jsonobj.Data.length);
                        tools.open(this,"已过滤 非企业下 号码 [ "+notVerifyBelongingCount+" ] 条！");
                      }
                      iccidArr = jsonobj.Data;
                      map.iccidArr = iccidArr;
                      Pwd_Str = tools.encrypt(JSON.stringify(map));

                      //企业充值时 判断当前操作卡号是否已经有 支付过的资费订单
                      findRecharged(Pwd_Str).then(response => {
                          let jsonobj = JSON.parse(tools.Decrypt(response));
                          this.BROneLoading = false;
                          if (jsonobj.code == 200) {
                            let iccidSaveArr = [];
                            if(jsonobj.Data!=undefined && jsonobj.Data!=null && jsonobj.Data.length>0){
                              //如果有已经充值过的卡号进行去除
                              for (let i = 0; i < iccidArr.length; i++) {
                                let iccid = iccidArr[i];
                                let is_ex = true;
                                for (let j = 0; j < jsonobj.Data.length; j++) {
                                  let iccidDb = iccidArr[j];
                                  if(iccid==iccidDb){
                                    is_ex =  false;
                                    break;
                                  }
                                }
                                if(is_ex){
                                  iccidSaveArr.push(iccid);
                                }
                              }
                            }else{
                              iccidSaveArr = iccidArr;
                            }
                            //console.log(iccidSaveArr)
                            if(iccidSaveArr.length>0){
                              this.BRpacketCardCount = {};
                              this.BRpacketCardCount[''+this.queryParams.packet_id] = iccidSaveArr;
                              this.BRThreeCardArr =[];
                              let obj = {};
                              this.toBePaid = 0;
                              let toBePaid = 0;
                              for (let i = 0; i < this.PacketSelOptions.length; i++) {
                                let Packet = this.PacketSelOptions[i];
                                if(Packet.dictValue == this.queryParams.packet_id ){
                                  obj = Packet;
                                  obj.packet_id = Packet.dictValue;
                                  obj.packet_wx_name = Packet.dictLabel;
                                  obj.packetCardCount = iccidSaveArr.length;
                                  toBePaid = tools.NumberAdd(toBePaid,tools.NumberMul(obj.packet_cost, obj.packetCardCount));//待支付 = 成本*数量
                                  this.BRThreeCardArr.push(obj);
                                  break;
                                }
                              }

                              this.validate_map.validate_type = this.queryParams.validate_type;
                              this.validate_map.validate_typeName =  tools.getDkeyValue(this.validateTypeOptions,this.queryParams.validate_type);
                              //console.log(this.validate_map)
                              //console.log(this.BRThreeCardArr)
                              this.toBePaid =  toBePaid;
                              this.ThreeBeRenewedexecute =  false;//加载是否 已执行
                              this.ThreeShow_BeRenewed = true;//当前界面是否显示


                            }
                            let Msg = "本次操作卡号 [ "+iccidArr.length+" ] 条，";
                            Msg +=jsonobj.Data.length>0?"其中已充值卡号 [ "+jsonobj.Data.length+" ] 条，":'';
                            Msg +=iccidSaveArr.length>0 && iccidArr.length!=iccidSaveArr.length?"可操作充值 [ "+iccidSaveArr.length+" ] 条":'';
                            if(iccidArr.length!=iccidSaveArr.length){
                              if(iccidSaveArr.length>0){
                                this.msgSuccess(Msg);
                              }else{
                                this.msgError(Msg);
                              }
                            }else{
                              this.msgSuccess(Msg);
                            }

                          } else {
                            this.msgError(jsonobj.msg);
                          }
                          this.submitFileFormBtn = true;
                        }
                      );


                    }else{
                      this.msgError("请输入所属ICCID卡号！");
                    }
                  } else {
                    this.msgError(jsonobj.msg);
                  }
                  this.submitFileFormBtn = true;
                }
              );






            }



          }else {
            this.msgError("文本域操作 不能大于100条/次！");
            this.submitFileFormBtn = true;
          }
        }else {
          this.msgError("请输入需要充值的ICCID卡号！");
          this.submitFileFormBtn = true;
        }
      }else {
        this.submitFileFormBtn = true;
      }
    },







    //任务下载详情
    openExecutionTaskInfo(ExecutionTask){
      let _this=this;
      _this.Urls = [];
      //console.log(ExecutionTask);
      let url  = ExecutionTask.url;
      let reg   = RegExp(/,/);
      let Url_list = [];
      //console.log(url.match(reg))
      //console.log(url.match(reg).index)
      if(url.match(reg)){
        Url_list = url.split(",");
      }else{
        if(url!=null){
          Url_list.push(url);
        }
      }
      // console.log(Url_list)
      for (let i = 0; i <Url_list.length ; i++) {
        let Url_map = {};
        let url_val = Url_list[i];

        for (let j = 0; j <ExecutionTask_OutType.length ; j++) {
          let obj  = ExecutionTask_OutType[j];
            let type = obj.dictValue;
          if(url_val.indexOf(type) != -1){
            Url_map.name = obj.dictLabel;
          }
        }
        Url_map.value = url_val;
        _this.Urls.push(Url_map);
      }

      _this.executionTaskDis=true;
    },





    /*获取查询参数*/
    getParams(){

      if(this.$refs.dept!=undefined & this.$refs.dept!=null & this.$refs.dept!='undefined' ){
        //console.log(this.$refs.dept.getCheckedKeys());
        if(this.$refs.dept.getCheckedKeys().length>0){
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }

    },






    /*代理查询拓展*/
    agentShow(){
      let _this = this;
      _this.option_show=!_this.option_show;
      _this.mainwidth = _this.option_show?20:24;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },


    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {};
      this.queryParams.pageNum= 1;
      this.queryParams.pageSize= 10;
      this.selTime = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {

      this.form = {};//清空数据
      //初始化 新增 数据
      this.form.cd_code= "YiDong_EC";
      this.form.cd_operator_type= "1";
      this.form.cd_lunxun= "1";
      this.form.cd_status= "1";
      this.show_ds = true;
      this.executionTaskAdd = true;
      this.executionTaskEdie = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.executionTaskAdd = false;
      this.executionTaskEdie = true;
      this.finddata(row);
    },
    /** 详情按钮操作 */
    ViewDetails(row) {
      //console.log(row);
      this.executionTaskAdd = false;
      this.executionTaskEdie = false;
        this.finddata(row);
    },



    /*获取详细信息*/
    finddata(row){
       this.form = {};//清空数据
       let map ={};
       map.cd_id = row.cd_id;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      getexecutionTask(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if(jsonobj.code==200){
            this.form = jsonobj.Data;
            this.show_ds = true;
          }else{
            this.msgError(jsonobj.msg);
          }
          this.loading = false;

        }
      );

    },




    // /*获取字典数据中的匹对key value*/
    // getDeptNamekeyValue(arr,key){
    //   let value = '';
    //   key = ""+key+"";
    //   for (let i = 0; i < arr.length; i++) {
    //     let map =  arr[i];
    //     if(map.dept_id==key){
    //       value = map.dept_name;
    //       break;
    //     }
    //   }
    //   return value;
    // },




  }
};
</script>

<style scoped>

.el-table .cell{
  line-height: 17px;
  padding-left: 10px;
  padding-right: 0px;
}

  .el-form-item {
    margin-bottom: 10px;
  }

  .my_checkbox__inner{
    border: 1px;
  }

</style>

