<template>
  <div class="app-container">
      <div>
        <el-main style="padding-top: 2%;padding-left: 3%">
          <el-form ref="queryForm"   label-width="60px">
          <el-row >
            <el-col :span="24">
              <el-divider content-position="center" style="width: 80%;">MSISDN/ICCID/IMSI</el-divider>
                  <el-input type="textarea" v-model="queryForm.cardNo" placeholder="多个号码查询，请换行"></el-input>
            </el-col>
          </el-row>
            <el-row >
              <el-col :span="24">
                  <el-button type="primary" style="width: 100%;margin-top: 20px;" readonly="submitFileFormBtn" @click="submitFileForm">查 询</el-button>
              </el-col>
            </el-row>

            <el-row v-if="dListShow" >
              <el-col :span="24">
                <el-divider content-position="center">未找到匹对数据</el-divider>
                <el-input type="textarea" v-model="dListStr" placeholder=""></el-input>
              </el-col>
            </el-row>
            <el-row v-if="rFromShow" >
              <el-col :span="24">
                <el-button type="success" style="width: 100%;margin-top: 20px;" @click="cardCopy">复 制</el-button>
              </el-col>
            </el-row>
          <el-divider v-if="rFromShow" content-position="center">已找到数据</el-divider>
          <el-row v-if="rFromShow" v-for="item in rFrom" >
            <el-col :span="24">

              <el-form-item label="MSISDN:">
                <el-input :value="item.msisdn"/>
              </el-form-item>
              <el-form-item label="ICCID:">
                <el-input :value="item.iccid"/>
              </el-form-item>
              <el-form-item label="IMSI:">
                <el-input :value="item.imsi"/>
              </el-form-item>
              <el-form-item style="line-height: 20px;" label="设备IMEI:">
                <el-input :value="item.imei"/>
              </el-form-item>
              <el-form-item label="状态:">
                <el-input :value="item.dict_label"/>
              </el-form-item>
              <el-form-item label="激活时间:">
                <el-input :value="item.activate_date"/>
              </el-form-item>
              <el-form-item label="到期时间:">
                <el-input :value="item.due_expire_time"/>
              </el-form-item>

              <span v-if="item.dict_label=='可测试' " style="font-size: 11px;color: red;">
                <span v-if="tools.Is_null(item.open_date)==true">
                  <span v-if="tools.Is_null(item.MaxActivate_date)==true">
                    温馨提示：您的卡片开卡日期为：{{item.open_date}}，测试期最晚自动激活日期:{{item.MaxActivate_date}}。
                  </span>
                </span>
              </span>
              <el-divider/>
            </el-col>
          </el-row>

          </el-form>
        </el-main>
      </div>



  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";
import { selCardOpen} from "@/api/yunze/flowcard/card/card";


export default {
  name: "cardInfoSel",
  data() {
    return {
      submitFileFormBtn:false,//确认按钮
      // 表单参数
      queryForm: {
        cardNo:'',
      },

      rFrom:[

      ],
      rFromShow:false,//返回正确 显示
      dListShow:false,//返回错误 显示
      dListStr:'',
      dList:[],//未找到卡号
      CopyText:'',//复制内容
      tools:tools,

    };
  },
  created() {
    this.$store.dispatch('LogOut').then(() => {
     console.log("LogOut");
    })
  },
  methods: {
    //提交
    submitFileForm() {
      let _this = this;
      this.dListStr = '';
      this.rFrom = [];
      this.dList = [];
      this.rFromShow = false;
      this.dListShow = false;
      this.CopyText = '';
      if(tools.Is_null(_this.queryForm.cardNo)){
        let cardArr = tools.textareaGet(_this.queryForm.cardNo);
        const qc = [...new Set(cardArr)];
        let repeatCount = cardArr.length>qc.length?tools.NumberSub(cardArr.length,qc.length):0;
        if(repeatCount>0){
          this.msgError("已为您赛选出重复号码 [ "+repeatCount+" ] 条！");
        }
        if(qc!=null){
          this.submitFileFormBtn = true;
          let Pwd_Str = tools.encrypt(JSON.stringify({'cardArr':qc}));
          selCardOpen(Pwd_Str).then(response => {
              let jsonobj =  JSON.parse(tools.Decrypt(response));
              if(jsonobj.code=='200'){
                //console.log(jsonobj);
                let bool = jsonobj.Data.bool;
                let Message = jsonobj.Data.Message;
                let rFrom = jsonobj.Data.rList;
                let dList = jsonobj.Data.dList;

                if(bool){
                  this.rFrom = rFrom;
                  this.dList = dList;
                  if(rFrom!=null && rFrom.length>0){
                    this.rFromShow = true; //返回正确 显示
                    for (let i = 0; i < rFrom.length; i++) {
                      let obj = rFrom[i];
                     // console.log(obj);
                      let objText = '';
                        let imei = tools.Is_null(obj.imei)?obj.imei:'';
                        let iccid = tools.Is_null(obj.iccid)?obj.iccid:'';
                        let msisdn = tools.Is_null(obj.msisdn)?obj.msisdn:'';
                        let imsi = tools.Is_null(obj.imsi)?obj.imsi:'';
                        let dict_label = tools.Is_null(obj.dict_label)?obj.dict_label:'';
                        let activate_date = tools.Is_null(obj.activate_date)?obj.activate_date:'';
                        let due_expire_time = tools.Is_null(obj.due_expire_time)?obj.due_expire_time:'';


                        objText +="MSISDN："+msisdn+"\n";
                        objText +="ICCID："+iccid+"\n";
                        objText +="IMSI："+imsi+"\n";
                        objText +="设备IMEI："+imei+"\n";
                        objText +="状态："+dict_label+"\n";
                        objText +="激活时间："+activate_date+"\n";
                        objText +="到期时间："+due_expire_time+"\n";
                        objText+="\n";
                        //console.log(objText);
                        this.CopyText+= objText;
                    }
                  }
                  if(dList!=null && dList.length>0){
                    for (let i = 0; i < dList.length; i++) {
                      this.dListStr +=dList[i]+"\n";
                    }
                    this.dListShow = true; //返回错误 显示
                  }
                }else{
                  this.msgError(Message);
                }
              }else{
                this.msgError("查询失败！");
              }
              this.submitFileFormBtn = false;
            }
          );
        }else{
          this.msgError("请填写需要查询的卡号！");
        }
      }else{
        this.msgError("请填写需要查询的卡号！");
      }

    },

    cardCopy(){
      let _this = this;
      tools.copyThat(_this.CopyText,_this);
    },








  }
};
</script>

<style >
  .el-divider--horizontal{
    margin: 10px 0;
  }
  .el-form-item {
    margin-bottom: 5px;
    line-height: 20px;
  }

  .el-form-item__label{
    font-size: 12px!important;
    padding: 0 6px 0 0!important;
  }

</style>

