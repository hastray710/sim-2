<template>
  <div >
    <!--这里是标签页-->
    <div class="main" >

      <el-tabs v-model="activeName" type="border-card" >
        <el-tab-pane label="登录账号" name="sessionInformation">
          <el-row>
            <el-col :span="24">
              <el-form-item label="登录地址">
                <a target="_blank" :href="form.cd_addressurl" style="color:blue;">{{ form.cd_addressurl }}</a>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="登录地址">
                <el-input v-model="form.cd_addressurl" @blur="lookOrigin"
                          placeholder="请输入以http://或者以https://开头地址"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="登录账号">
                <el-input v-model="form.cd_useraccount" placeholder="请输入登录账号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录密码">
                <el-input v-model="form.cd_password" placeholder="请输入登录密码"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="是否正常" prop="cd_code">
                <el-select v-model="form.cd_state" clearable placeholder="请选择">
                  <el-option
                    v-for="item in DictionaryState"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="对接信息" prop="cd_code">
                <el-select v-model="form.cd_Interface" clearable placeholder="请选择">
                  <el-option
                    v-for="item in InterfaceState"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>


        <el-tab-pane label="上游同步" name="up">
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否同步">
                <el-select  v-model="form.upstream" clearable placeholder="请选择">
                  <el-option
                    v-for="item in DictionaryState"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否通知">
                <el-select  v-model="form.changeNotification" clearable placeholder="请选择">
                  <el-option
                    v-for="item in DictionaryState"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="同步类型">
                <el-select  v-model="form.dataType" clearable placeholder="请选择">
                  <el-option
                    v-for="item in sync_data_type"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="自动同步字段">
<!--                <el-checkbox-group>-->
<!--                  <label class="el-checkbox my_checkbox" v-for="(item,index) in yz_sync_field">-->
<!--                                    <span class="el-checkbox__inner my_checkbox__inner">-->
<!--                                    <input type="checkbox" v-model="form.sync_field"-->
<!--                                           name="sync_field"-->
<!--                                          :value="item.dictValue"/>-->
<!--                                     </span>-->
<!--                    <span class="el-checkbox__label my_checkbox__label">{{ item.dictLabel }}</span>-->
<!--                  </label>-->
<!--                </el-checkbox-group>-->

<!--                <el-form-item label="自动缴费" prop="deduction" title="自动扣款 所属公司企业">-->
<!--                  <el-radio-group>-->
<!--                    <label class="el-radio " v-for="(item,index) in yz_sync_field">-->
<!--                                    <span class="el-radio__input my_checkbox__inner">-->
<!--                                    <input type="radio" v-model="form.sync_field"-->
<!--                                           name="deduction"-->
<!--                                           :value="item.dictValue"/>-->
<!--                                     </span>-->
<!--                      <span class="el-radio__label ">{{ item.dictLabel }}</span>-->
<!--                    </label>-->
<!--                  </el-radio-group>-->
<!--                </el-form-item>-->
                <el-select
                  v-model="form.sync_field"
                  placeholder="自动同步字段"
                  clearable
                  multiple
                  size="small"
                  style="width: 550px"
                >
<!--                  <el-option-->
<!--                    v-for="dict in yz_sync_field"-->
<!--                    :key="dict.cd_id"-->
<!--                    :label="dict.cd_alias"-->
<!--                    :value="dict.cd_id"-->
<!--                  />-->
                  <el-option
                    v-for="dict in yz_sync_field"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />

                </el-select>

              </el-form-item>
            </el-col>
          </el-row>

        </el-tab-pane>
        <el-tab-pane label="短信" name="sms">
          <el-row>
            <el-col :span="24">
              <el-form-item label="短信请求地址">
                <el-input placeholder="请输入短信请求地址" v-model="form.host"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="短信端口号">
                <el-input placeholder="请输入短信端口号" v-model="form.port"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="短信-密码">
                <el-input placeholder="请输入短信-密码"  v-model="form.sharedSecret"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="短信执行模板">
                <el-select  v-model="form.code" clearable placeholder="请选择">
                  <el-option
                    v-for="item in smsCode"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="短信企业代码">
                <el-input placeholder="请输入短信企业代码" v-model="form.sourceAddr"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="短信服务号">
                <el-input placeholder="请输入短信服务号" v-model="form.srcTerminalId"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

      </el-tabs>
    </div>

    <!-- 触发加载数据函数-->
    <span>
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
    form:Object,
    testTXT:''
  },
  name: "cardRouteDetails",
  data() {
    return {
      DictionaryState: [],
      //对接信息
      InterfaceState: [],
      postageVif: false,//控制树
      sync_data_type:[],
      yz_sync_field:[],//同步字段


      activeName: "sessionInformation",//选择那个表格
      tools:tools,
      activeNames: [0],
      selIccid: [{FlowData: []}],
      internalBool: false,//内部人员
      //短信模板map
      smsCode:[],
    }
  },
  created() {
    //加载 是否正常
    if (window['DictionaryState'] != undefined && window['DictionaryState'] != null && window['DictionaryState'] != '') {
      this.DictionaryState = window['DictionaryState'];
    } else {
      this.getDicts("yz_cd_state").then(response => {
        window['DictionaryState'] = response.data;
        this.DictionaryState = window['DictionaryState'];
      });
    }
    //加载 同步字段
    if (window['yz_sync_field'] != undefined && window['yz_sync_field'] != null && window['yz_sync_field'] != '') {
      this.yz_sync_field = window['yz_sync_field'];
    } else {
      this.getDicts("yz_sync_field").then(response => {
        window['yz_sync_field'] = response.data;
        this.yz_sync_field = window['yz_sync_field'];
      });
    }
    //加载 对接信息
    if (window['InterfaceState'] != undefined && window['InterfaceState'] != null && window['InterfaceState'] != '') {
      this.InterfaceState = window['InterfaceState'];
    } else {
      this.getDicts("yz_cd_Interface").then(response => {
        window['InterfaceState'] = response.data;
        this.InterfaceState = window['InterfaceState'];
      });
    }

    //加载 短信模板
    if(window['yz_Sms_Code']!=undefined &&  window['yz_Sms_Code']!=null && window['yz_Sms_Code']!=''){
      this.smsCode = window['yz_Sms_Code'];
    }else{
      this.getDicts("yz_Sms_Code").then(response => {
        window['yz_Sms_Code'] = response.data;
        this.smsCode = window['yz_Sms_Code'];
      });
    }
    //加载 同步类型
    if(window['sync_data_type']!=undefined &&  window['sync_data_type']!=null && window['sync_data_type']!=''){
      this.sync_data_type = window['sync_data_type'];
    }else{
      this.getDicts("sync_data_type").then(response => {
        window['sync_data_type'] = response.data;
        this.sync_data_type = window['sync_data_type'];
      });
    }



    //加载 资费计划生效中类型
    if(window['cardValidType']!=undefined &&  window['cardValidType']!=null && window['cardValidType']!=''){
      this.cardValidType = window['cardValidType'];
    }else{
      this.getDicts("yunze_card_valid_type").then(response => {
        window['cardValidType'] = response.data;
        this.cardValidType = window['cardValidType'];
      });
    }

  },

  methods: {

    lookOrigin() {
      let url = this.form.cd_addressurl;
      // console.log(url)
      let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
      // console.log(reg.test(url))
      if (reg.test(url)) {
        this.msgSuccess("语法正确");
      } else {
        this.msgError("必须以http://,https://开头,否则语法不正确");
      }
    },

    /**资费组ID按钮*/
    postageAdd() {
      this.postageVif = !this.postageVif;
      this.changePostageVif();
    },
    changePostageVif() {
      if (this.postageVif) {
        this.treeCol = 6;
        this.formCol = 18;
      } else {
        this.treeCol = 0;
        this.formCol = 24;
      }
    },
    showFromTest(){
      this.$emit("msgB", this.form);
    },

    LoadData() {
      this.$emit("SetObj", "SettestTXT", true);//已加载

    },




  },
}
</script>

