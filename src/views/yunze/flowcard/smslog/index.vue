<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true"  label-width="68px">
          <el-form-item label="操作方式" prop="status">
            <el-select
              v-model="queryParams.sendType"
              placeholder="操作方式"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in sendTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.state_id"
              placeholder="状态"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in Cchis_result"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>



          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 130px"
            >
              <el-option
                v-for="dict in CCG_TimeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="selTime"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-form>

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 10px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-input
                v-model="queryParams.value"
                placeholder="查询值"
                clearable
                size="small"
                style="width: 350px"
                @keyup.enter.native="handleQuery"
              >
                <el-select
                  v-model="queryParams.type"
                  placeholder="查询条件"
                  clearable
                  slot="prepend"
                  style="width: 150px;"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-input>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-col>
            <el-col :span="1.5">
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="ShowData" @selection-change="handleSelectionChange">
          <el-table-column label="短信ID" align="center" prop="msgid" v-if="columns[0].visible"/>
          <el-table-column label="短信号" align="center" prop="msisdn" v-if="columns[1].visible"/>
          <el-table-column label="下发内容" align="center" prop="content" v-if="columns[2].visible"
                           :show-overflow-tooltip="true" width="100px">
            <template slot-scope="scope">
              <!--                @click="Details(scope.row)"-->
              <span @click="showContent(scope.row.content)" class="link-type">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="state_id" v-if="columns[3].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(Cchis_result, scope.row.state_id) }}
            </template>
          </el-table-column>
          <el-table-column label="操作方式" align="center" prop="type" v-if="columns[4].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(sendTypeOptions, scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="create_date" v-if="columns[5].visible"/>
          <el-table-column label="是否删除" align="center" prop="del_flag" v-if="columns[6].visible"/>
          <el-table-column label="短信服务号" align="center" prop="sms_src_TerminalId" v-if="columns[7].visible"/>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <el-dialog title="短信详细内容" :visible.sync="show_ds_one" :modal-append-to-body="false" append-to-body>
      <smsSubcomPonentsNext ref="smsSubcomPonentsNext"
                            @SetObj_one="SetObj_one"
                            :show_ds_one="show_ds_one"
                            :implement_one="implement_one"
                            :Msg="Show_Msg.msg"
      >
      </smsSubcomPonentsNext>
    </el-dialog>
  </div>
</template>

<script>
import {CodeToText, regionData, regionDataPlus, TextToCode} from "element-china-area-data";
import tools from "@/utils/yunze/tools";
import {
  listSmsLog
} from "@/api/yunze/flowcard/SmsLog";
import smsSubcomPonentsNext from "../smsbatchBusiness/smsSubcomPonentsNext";

export default {
  name: "index",
  components: {
    smsSubcomPonentsNext
  },
  data() {
    return {
      Content_form: [],
      show_ds: false,//详情查看
      window: window,//window 对象
      loadingSelOption: true,//是否 加载 查询客户信息框
      IsDisabled: true,//是否禁用
      cities: [],//'上海', '北京', '广州', '深圳'
      cityOptions: [],//'上海', '北京', '广州', '深圳'

      RateSetting_show: false,//费率设置 显示hi


      DivideBool: false,//划分按钮
      RecycleBool: false,//回收按钮


      // 时间查询类型 数据字典
      CCG_TimeOptions: [],
      sendTypeOptions: [],//
      Cchis_result: [],//
      selTime: '',//时间选择


      CustomerDivide_show: false,//客户划分 显示


      Contact_CCG_CtID: [], //联系方式
      SalesOption: [],//销售
      clearableBool: false,//所属销售是否 禁止选择

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },


      options: regionData,
      selFindoptions: regionDataPlus,
      CodeToText: CodeToText,
      TextToCode: TextToCode,

      images: [],
      sortImages: !this.images ? [] : [].concat(this.images),
      acceptConfig: 'image/jpeg,image/png,image/jpg,image/gif',
      url: '',

      disabled: false,

      //保存 编辑 按钮
      CustomerAdd: false,
      // 修改 保存 按钮
      Preservation: false,
      tools: tools,

      sales_idArr: [],//控制查询时仅可看 所属销售的客户信息

      mainwidth: 24,//宽度
      option_show: false, //公司所属查询
      // 遮罩层
      loading: true,

      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      //主界面数据
      //DataList: [],
      ShowData: [],
      testTxt: "哈哈哈哈",
      // 弹出层标题
      title: "",
      typeOptions: [],


      // 详情查看
      show_ds_one: false,
      // 加载是否 已执行
      implement_one: false,
      Show_Msg: {show_dia: false, msg: ''},
      numDate: '',

      // 表单参数
      form: {
        msgid: null,
        msisdn: null,
        content: null,
        state_id: null,
        type: null,
        create_date: null,
        del_flag: null,
        sms_src_TerminalId: null,
      },

      AccountOption: [],
      // 查询参数
      queryParams: {
        state_id: null,
        sendType: null,
        pageNum: 1,
        pageSize: 10,
        c_userIdArr: [],
      },

      // 列信息
      columns: [
        {key: 0, label: `短信ID`, visible: true},
        {key: 1, label: `短信接受号`, visible: true},
        {key: 2, label: `下发内容`, visible: true},
        {key: 3, label: `状态`, visible: true},
        {key: 4, label: `操作方式`, visible: true},
        {key: 5, label: `创建时间`, visible: true},
        {key: 6, label: `是否删除`, visible: true},
        {key: 7, label: `短信服务号`, visible: true},
      ],
      Editexecute: false,//发货申请 编辑加载是否 已执行
      // 表单校验
      rules: {}
    };
  },
  created() {
    //加载 查询条件 2022年9月2日10:15:48
    if (window['yz_SmsLog_selType'] != undefined && window['yz_SmsLog_selType'] != null && window['yz_SmsLog_selType'] != '') {
      this.typeOptions = window['yz_SmsLog_selType'];
    } else {
      this.getDicts("yz_SmsLog_selType").then(response => {
        window['yz_SmsLog_selType'] = response.data;
        this.typeOptions = window['yz_SmsLog_selType'];
        console.log(this.typeOptions)

      });
    }

    //加载 查询时间类型 条件 2022年9月2日10:19:54
    if (window['yz_SmsLog_timeType'] != undefined && window['yz_SmsLog_timeType'] != null && window['yz_SmsLog_timeType'] != '') {
      this.CCG_TimeOptions = window['yz_SmsLog_timeType'];
    } else {
      this.getDicts("yz_SmsLog_timeType").then(response => {
        window['yz_SmsLog_timeType'] = response.data;
        this.CCG_TimeOptions = window['yz_SmsLog_timeType'];

      });
    }


    //加载 短信上下行类型
    if (window['yz_message_sendType'] != undefined && window['yz_message_sendType'] != null && window['yz_message_sendType'] != '') {
      this.sendTypeOptions = window['yz_message_sendType'];
    } else {
      this.getDicts("yz_message_sendType").then(response => {
        window['yz_message_sendType'] = response.data;
        this.sendTypeOptions = window['yz_message_sendType'];

      });
    }

    //加载 抄送结果
    if (window['Cchis_result'] != undefined && window['Cchis_result'] != null && window['Cchis_result'] != '') {
      this.Cchis_result = window['Cchis_result'];
    } else {
      this.getDicts("yz_cc_result").then(response => {
        window['Cchis_result'] = response.data;
        this.Cchis_result = window['Cchis_result'];
      });
    }


    //条件查询 默认选择第一个
    this.queryParams.type = '0';

    this.getList();

  },
  methods: {

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    //展示短信内容
    showContent(message) {
      this.Show_Msg.msg = '';
      this.show_ds_one = true;
      this.implement_one = false;
      this.Show_Msg.msg = message;
    },

    //销售执行函数 清除 所属销售其他选项只留自己的
    Sales_execution() {
      let username = tools.getCookie("username");
      //console.log(username)
      if (username != 'admin') {
        //console.log(this.SalesOption)
        if (this.SalesOption != null && this.SalesOption.length > 0) {
          let SalesOption = JSON.parse(JSON.stringify(this.SalesOption));
          this.SalesOption = [];
          for (let i = 0; i < SalesOption.length; i++) {
            let Obj = SalesOption[i];
            if (Obj.user_name == username) {
              //console.log(arr)
              let arr = [];
              if (Obj.Btns != null && Obj.Btns.indexOf(',') != -1) {
                arr = Obj.Btns.split(",");
              } else {
                arr = [Obj.Btns]
              }
              if (tools.VerificationValIsArray(arr, "yunze:sys:Sales")) {
                this.SalesOption.push(Obj);
                this.queryParams.c_userIdArr = [Obj.user_id];
                this.clearableBool = true;
                this.sales_idArr = JSON.parse(JSON.stringify([Obj.user_id]));
              } else {
                this.SalesOption = SalesOption;
              }
              break;
            }
          }
        }
        this.getList();
      } else {
        this.getList();
      }
    },

    //设置数据
    SetObj_one(Key, obj) {
      //console.log(obj);
      switch (Key) {
        case 'Setimplement_one':
          this.implement_one = obj;// 设置
          break;
        case 'Setshow_ds_one':
          this.show_ds_one = obj;// 设置
          break;
      }
    },

    //选中 当前登录用户
    SetAdminOption() {
      if (this.SalesOption != null && this.SalesOption.length > 0) {
        this.AdminOption = [];
        //默认选择第一个
        this.form.c_party_b_phone = this.SalesOption[0].phonenumber;
        this.form.c_party_b_id = this.SalesOption[0].user_id;
        let username = tools.getCookie("username");
        for (let i = 0; i < this.SalesOption.length; i++) {
          let Obj = this.SalesOption[i];
          this.AdminOption.push(Obj);
          window["SalesOptionPhonenumber_" + Obj.user_id] = Obj.phonenumber;
          //选中当前登录用户信息
          //console.log(username == Obj.user_name);
          if (Obj.user_name == username) {
            this.form.c_party_b_phone = Obj.phonenumber;
            this.form.c_party_b_id = Obj.user_id;
            this.form.c_userId = Obj.user_id;
          }
        }
      }
    },


    /*获取查询参数*/
    getParams() {
      if (tools.Is_null(this.queryParams.timetype) && this.selTime != null) {
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }

      if (tools.Is_null(this.queryParams.type) && this.selTime != null) {

      }else{
        this.queryParams.type = null;
      }

      if (this.queryParams.province != null && this.queryParams.province == '全部') {
        this.queryParams.province = null;
        this.queryParams.city = null;
        this.queryParams.district = null;
      }

      //console.log(this.queryParams);
    },


    /** 获取所有的短信日志 */
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      listSmsLog(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            console.log(jsonobj)
            this.ShowData = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
            console.log("↓↓↓↓↓↓参数↓↓↓↓↓")
            console.log(this.queryParams)
          } else {
            this.msgError(jsonobj.msg);
            this.ShowData = [];
          }
          this.loading = false;
        }
      );
    },


    /** 删除 客户联系记录 */
    handleDelete(row) {
      let map = {};
      map.CCG_ID = row.CCG_ID;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      tools.openAsk(this, 'warning', "确定要删除客户联系记录表为 '" + row.CCG_ID + "' 的这条数据吗？", this.deleteContact, Pwd_Str);
    },
    deleteContact(Pwd_Str) {
      DeleteID(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getList();
          this.msgSuccess(jsonobj.msg);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    /*代理查询拓展*/
    agentShow() {
      let _this = this;
      _this.option_show = !_this.option_show;
      _this.mainwidth = _this.option_show ? 20 : 24;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {};
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.selTime = null;
      this.handleQuery();
    },

    /** 修改 客户联系记录 */
    handleUpdate(row) {

      this.Preservation = true;
      this.CustomerAdd = false;
      row.CCG_CtID = "" + row.CCG_CtID;
      this.form = row;
      // console.log(this.form = row)
      this.resetQuery();
      this.getList();
      this.show_ds = true;
      this.Editexecute = false;

    },

    /** 新增按钮操作 */
    handleAdd(row, Operate) {
      this.Editexecute = true;
      // this.form.CCG_UserID = 1;
      // this.form.CCG_CtID = '1';
      this.show_ds = true;
      this.Preservation = false;
      this.CustomerAdd = true;
      this.form = {
        CCG_UserID: 1,
        CCG_CtID: '1',
        CCG_Time: tools.gitData(),
      };//清空数据

    },


    /*客户信息关闭 触发 */
    DrawerClose() {
      //如果当期是 修改操作关闭界面 清空 dept_id 和 name
      this.form.dept_id = '';
      this.form.c_name = '';
    },

    RateSetting() {

    },

    /**新增保存*/
    SubAdd() {
      let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
      NewCustomerAdd(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.show_ds = false;
          //更新数据
          this.queryParams.page = 1;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**修改保存*/
    SubUpd(map) {
      let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
      UpdateId(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.show_ds = false;
          //更新数据
          this.queryParams.page = 1;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

  }
}
</script>

<style scoped>

</style>
