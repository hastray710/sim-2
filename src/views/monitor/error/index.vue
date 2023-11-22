<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">


          <!--是否通用   -->
          <el-form-item label="是否通用" prop="status">
            <el-select
              v-model="queryParams.is_notice"
              placeholder="是否通用"
              clearable
              size="small"
              style="width: 80px"
            >
              <el-option
                v-for="dict in customize_whether"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!--通道编码-->
          <el-form-item label="通道编码" prop="status">
            <el-select
              v-model="queryParams.cd_code"
              placeholder="通道编码"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in channelCodeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <!--  时间类型-->
          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in timetypeHis"
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
              style="width: 360px"
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
                  style="width: 110px"
                >
                  <el-option
                    v-for="dict in typeOptionsError"
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
              <el-button
                type="success"
                plain
                icon="el-icon-check"
                size="mini"
                @click="ShowUpdInfo"
              >勾选操作
              </el-button>
              <!--勾选操作-->
              <el-dropdown v-if="IsUpdInfo" style="margin-left: 10px">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-user-solid"
                  size="mini"
                  style="width: 110px;"
                >操作
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="PublicMethod"/>
                  <el-dropdown-item v-hasPermi="['yunze:error:updArr']" @click.native="BatchUpdate">批量修改</el-dropdown-item>
                  <el-dropdown-item v-hasPermi="['yunze:error:delArr']" @click.native="BatchDelete">批量删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

        </el-form>

        <el-table v-loading="loading" :data="cardList" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" v-if="IsUpdInfo" width="55" align="center"/>
          <el-table-column label="iccid" align="center" prop="iccid" v-if="columns[1].visible"/>
          <el-table-column label="错误代码" align="center" prop="codeOn" v-if="columns[2].visible"/>
          <el-table-column label="错误信息" align="center" prop="message" v-if="columns[3].visible"/>
          <el-table-column label="通道编码" align="center" prop="cd_code" v-if="columns[4].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(channelCodeOptions, scope.row.cd_code) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="create_date" v-if="columns[5].visible">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_date) }}</span>
            </template>
          </el-table-column>
<!--          <el-table-column label="修改时间" align="center" prop="upd_date" v-if="columns[6].visible"/>-->
          <el-table-column label="是否通知" align="center" prop="is_notice" v-if="columns[7].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(customize_whether, scope.row.is_notice) }}
            </template>
          </el-table-column>
          <el-table-column label="返回数据" align="center" prop="rt_map" v-if="columns[8].visible">
            <template slot-scope="scope">
              <el-button type="text" @click="RtMap(scope.row)">返回数据</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-hasPermi="['yunze:error:upd']"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                v-hasPermi="['yunze:error:del']"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>

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

    <el-dialog :modal-append-to-body="false" title="返回数据" :visible.sync="open" width="500px" append-to-body>
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        readonly =""
        v-model="textarea1">
      </el-input>
    </el-dialog>

    <el-dialog :modal-append-to-body="false" :visible.sync="modifyu" width="300px" append-to-body>
      <el-form v-model="queryUpd">
        <el-form-item label="是否通用" prop="status">
          <el-select
            v-model="queryUpd.is_notice"
            placeholder="是否通用"
            clearable
            size="small"
            style="width: 80px"
          >
            <el-option
              v-for="dict in customize_whether"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="primary" @click="submitForm">确 定</el-button>
        <el-button type="success" v-if="success" @click="submitUpd">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import {listError,UpdateId,DeleteId,DeleteArr,UpdateArr} from "@/api/monitor/error";
import tools from "@/utils/yunze/tools";
export default {
  name: "index",
  data() {
    return {

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
      tools: tools,

      selTime: '',//时间选择
      mainwidth: 24,//宽度
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: false,
      success:false,//控制确定按钮
      primary:false,//控制确定按钮
      // 总条数
      total: 0,
      // 用户表格数据
      cardList: null,
      // 是否显示弹出层
      open: false,
      //修改控制
      modifyu:false,
      // 时间数组
      timetypeHis:[],
      // 是否通用
      customize_whether: [],
      // 显示 变更按钮
      IsUpdInfo: false,
      // 查询条件
      typeOptionsError: [],
      //通道编码
      channelCodeOptions: [],
      // 表单参数
      form: {},
      textarea1: '',
      //修改参数
      queryUpd: {
        is_notice: null,
        UpdaArr: null,
      },
      PublicArrList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        is_notice: null,
      },
      //操作参数
      Operation: {
        id: [],
      },
      //勾选数组
      TickArray: [],
      // 列信息
      columns: [
        {key: 0, label: `iccid`, visible: true},
        {key: 1, label: `错误代码`, visible: true},
        {key: 2, label: `错误信息`, visible: true},
        {key: 3, label: `通道编码`, visible: true},
        {key: 4, label: `创建时间`, visible: true},
        {key: 5, label: `修改时间`, visible: true},
        {key: 6, label: `是否通知`, visible: true},
        {key: 7, label: `返回数据`, visible: true},
        {key: 8, label: `返回数据`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },

  created() {

    //加载 查询条件
    if (window['typeOptionsError'] != undefined && window['typeOptionsError'] != null && window['typeOptionsError'] != '') {
      this.typeOptionsError = window['typeOptionsError'];
    } else {
      this.getDicts("yunze_typeOptionsError").then(response => {
        window['typeOptionsError'] = response.data;
        this.typeOptionsError = window['typeOptionsError'];
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


    //加载 时间赛选查询条件
    if (window['timetypeHis'] != undefined && window['timetypeHis'] != null && window['timetypeHis'] != '') {
      this.timetypeHis = window['timetypeHis'];
    } else {
      this.getDicts("yunze_CcHis_timetype").then(response => {
        window['timetypeHis'] = response.data;
        this.timetypeHis = window['timetypeHis'];
      });
    }

    //加载 通道模板
    if (window['channelCodeOptions'] != undefined && window['channelCodeOptions'] != null && window['channelCodeOptions'] != '') {
      this.channelCodeOptions = window['channelCodeOptions'];
    } else {
      this.getDicts("channel_code").then(response => {
        window['channelCodeOptions'] = response.data;
        this.channelCodeOptions = window['channelCodeOptions'];
      });
    }

    //默认选中第一个
    this.queryParams.type = '1';

    this.getList();
  },
  methods: {

    //返回数据
    RtMap(row){
      // console.log(row)
      this.open = true;
      this.textarea1 =  tools.formatJson(row.rt_map);
    },


    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /*获取查询参数*/
    getParams() {

      if (this.$refs.dept != undefined & this.$refs.dept != null & this.$refs.dept != 'undefined') {
        //console.log(this.$refs.dept.getCheckedKeys());
        if (this.$refs.dept.getCheckedKeys().length > 0) {
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }
      if (tools.Is_null(this.queryParams.timetype) && this.selTime != null) {
        //console.log(this.selTime);
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
    },
    /**修改*/
    handleUpdate(row){
      this.modifyu = true;
      this.primary = true;
      this.success = false;
      this.queryUpd = row;
      this.queryUpd.is_notice = ""+row.is_notice;
    },
    /**删除*/
    handleDelete(row){
      let map = {};
      map.id = row.id;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      tools.openAsk(this,'warning', "您确定要删除这条数据吗？", this.deleteData, Pwd_Str);
    },
    deleteData(Pwd_Str){
      DeleteId(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          console.log(jsonobj)
          this.msgSuccess(jsonobj.msg);
          this.getList();
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }})
    },
    //下面公共的的方法
    PublicMethod() {
      let _this = this;
      _this.TickArray = _this.$refs.multipleTable.selection;
      let max = 500;
      if (_this.TickArray.length <= max){
        this.$refs.multipleTable.clearSelection();//清除选中
        let iccids = [];
        for (let i = 0; i < _this.TickArray.length; i++) {
          iccids.push(_this.TickArray[i].id);
        }
          _this.PublicArrList = iccids;
          _this.queryUpd.UpdaArr = iccids; //自己定义 UpdaArr

      }else {
        tools.open(_this, "一次最多操作更新" + max + "个号码！");
      }
    },
    /**勾选操作*/
    ShowUpdInfo(){
      this.IsUpdInfo = !this.IsUpdInfo;
    },
    /**批量删除*/
    BatchDelete(){
      this.PublicMethod();
      let _this = this;
      let title = '';
      if (_this.TickArray.length > 0) {
        _this.$confirm('批量【删除】-->卡信息 [' + _this.PublicArrList.length + '] 张, ' + title + '是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          let map = {};
          map.DeleArr = this.PublicArrList;
          console.log(map)
          let Pwd_Str = tools.encrypt(JSON.stringify(map));
          DeleteArr(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            if (jsonobj.code == 200) {
              console.log(jsonobj)
              this.msgSuccess(jsonobj.msg);
              this.getList();
            }else{
              let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
              this.msgError(msg);
            }})
        })
      } else {
        tools.open(_this, "请勾选需要删除的卡号！");
      }
    },
    /**批量修改*/
    BatchUpdate(){
      this.queryUpd = {};
      this.PublicMethod();
      let _this = this;
      if (_this.TickArray.length > 0){
        this.modifyu = true;
        this.primary = false;
        this.success = true;
      }else {
        tools.open(_this, "请勾选需要删除的卡号！");
      }
    },
    /**修改是否确定按钮*/
    submitForm(){
      let _this = this;
      if (tools.VerificationsText(_this, _this.queryUpd.is_notice, "是否通知必须选中其中一个") == true){
        // console.log(this.queryUpd)
        let Pwd_Str = tools.encrypt(JSON.stringify(this.queryUpd));
        UpdateId(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            console.log(jsonobj)
            this.msgSuccess(jsonobj.msg);
            this.modifyu = false;
            this.getList();
          }else{
            let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
            this.msgError(msg);
          }})
      }
    },
    /**批量修改确定按钮*/
    submitUpd(){
      let _this = this;
      if (tools.VerificationsText(_this, _this.queryUpd.is_notice, "是否通知必须选中其中一个") == true) {
        let title = '';
        _this.$confirm('批量【修改】-->是否通知 [' + _this.PublicArrList.length + '] 张, ' + title + '是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
         console.log(this.queryUpd)

          let Pwd_Str = tools.encrypt(JSON.stringify(this.queryUpd));
          UpdateArr(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            if (jsonobj.code == 200) {
              console.log(jsonobj)
              this.modifyu = false;
              this.msgSuccess(jsonobj.msg);
              this.getList();
            }else{
              let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
              this.msgError(msg);
            }})
        })
      }
    },
   /**查询列表*/
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
      //console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      listError(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          // console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.cardList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
          } else {
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },


    // 取消按钮
    cancel() {
      this.open = false;
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


  }
};
</script>

<style scoped>

.el-table .cell {
  line-height: 17px;
  padding-left: 10px;
  padding-right: 0px;
}

.el-form-item {
  margin-bottom: 10px;
}

.my_checkbox__inner {
  border: 1px;
}

</style>

