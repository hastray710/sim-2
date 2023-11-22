<template>
  <div class="app-container">
    <div>
      <el-main >
        <el-row >
          <el-col :span="12" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form  ref="queryName"   >
              <!--              <el-form-item  prop="status">
                              <h4> 批量下发短信
                                <el-tooltip placement="bottom">
                                  <div slot="content">
                                    下载模板，上传需要下发短信的 ICCID 且 已关联短信服务号，开启短信服务的卡号。
                                  </div>
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                              </h4>
                            </el-form-item>-->

              <el-form-item >
                <span slot="label">
                  下发内容
                  <el-tooltip placement="right">
                    <div slot="content">
                      短信下发请遵守 反垃圾邮件法（CAN-SPAM）遵从 TCPA 原则
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                <div  style="color:red" >提示：该处填写短信下发内容</div>
                <div class="text-area">
                       <textarea name="content" id="content"  v-model="message" placeholder="请输入短信下发内容（最大长度：300）"
                                 style="width: 360px;height:100px;font-size:9pt;font-family:verdana;color:#333333"  @change="setMessage">

                      </textarea>
                </div>
              </el-form-item>


              <el-form-item  >
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
                <div  style="color:red" >提示：卡号之间以换行隔开 ！<br>(大于100条/次操作禁止使用卡号输入方式操作！)</div>
                <div class="text-area">
                       <textarea name="content" id="content"  v-model="iccidStr" placeholder="请输入ICCID卡号"
                                 style="width: 350px;height:100px;font-size:9pt;font-family:verdana;color:#333333" >

                      </textarea>
                </div>
              </el-form-item>
              <el-form-item v-if="!uploadType" style="margin-left: 275px;float: left;">
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

              <el-form-item v-if="uploadType" style="margin-left: 275px;float: left;">
                <el-button type="primary" v-if="submitFileFormBtn" @click="submitFileForm">确 定</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </div>

  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

import tools from "@/utils/yunze/tools";
import {SmsCCTextField} from "@/api/yunze/flowcard/SmsLog";
import {verifyBelonging} from "@/api/yunze/flowcard/card/card";

export default {
  name: "smsCC",
  data() {
    return {
      //保存 编辑 按钮
      selImei: false,
      iccids:[],
      deptCheckStrictly: true,
      deptExpand: true,
      deptNodeAll: false,

      uploadType: false,//上传文件方式
      iccidStr:'',//iccid 文本域充值字符串

      message:'',//短信抄送内容

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
      // 执行任务状态 字典
      channelStatusOptions: [],
      // 执行任务编码 字典
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
        url: process.env.VUE_APP_BASE_API + "/yunze/card/SmsCC",
        Pstr:'',//携带参数
      },








    };
  },

  created() {






  },
  methods: {

    //加密携带参数
    setMessage(){
      let map = {};
      map.message = this.message;
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
      var files = this.$refs.upload.uploadFiles;//判断files数组的长度是否大于0，不大于0 则未选择附件
      if(files.length>0){
        tools.openAsk(this,'warning', "是否确认 批量执行短信下发？", this.uploadUp,this, this.FalseFun,null);
      }else{
        tools.open(this,"请选择上传文件！");
      }
    },

    titleUp(_this){

    },

    uploadUp(_this){
      _this.$refs.upload.submit();
    },

    FalseFun(Pwd_Str){
      this.submitFileFormBtn = true;
    },


    /*获取查询参数*/
    getParams(){

    },


    /*获取字典数据中的匹对key value*/
    getDeptNamekeyValue(arr,key){
      let value = '';
      key = ""+key+"";
      for (let i = 0; i < arr.length; i++) {
        let map =  arr[i];
        if(map.dept_id==key){
          value = map.dept_name;
          break;
        }
      }
      return value;
    },




    //文本域提交申请
    subTextarea() {
      this.submitFileFormBtn = false;
      let _this = this;
      if (tools.VerificationsText(_this, _this.message, "请选择填写需要下发的短信内容！") == true )
      {

        let rMap = tools.textareaGetNotRepeating(this.iccidStr);
        let iccidArr = rMap.rArr;
        let repeatCount = rMap.repeatCount;
        if(repeatCount>0){
          tools.open(this,"已过滤重复号码 [ "+repeatCount+" ] 条！");
        }

        if(iccidArr!=null && iccidArr.length>0){
          if(iccidArr.length<=100){
            let map = {};
            map.message = this.message;
            let Iccidlist = [];
            for (let i = 0; i < iccidArr.length; i++) {
              Iccidlist.push({"iccid":iccidArr[i]});
            }
            map.list = Iccidlist;
            let Pwd_Str = tools.encrypt(JSON.stringify(map));
            SmsCCTextField(Pwd_Str).then(response => {
              let jsonobj = JSON.parse(tools.Decrypt(response));
              //console.log(jsonobj);
              if (jsonobj.code == 200) {
                this.msgSuccess(jsonobj.msg);
              } else {
                let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
                this.msgError(msg);
              }
            })
            this.submitFileFormBtn = true;
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



  }
};
</script>

<style scoped >
.app-container {
  padding: 5px;
}

.el-form-item {
  margin-bottom: 0px;
}
.el-main{
  padding: 0px;
}


</style>

