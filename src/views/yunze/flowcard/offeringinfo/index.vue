<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <!--通道类型 -->
          <el-form-item label="通道类型" prop="status">
            <el-select
              v-model="queryParams.cd_code"
              placeholder="通道类型"
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

          <!--资费类型 -->
          <el-form-item label="资费类型" prop="status">
            <el-select
              v-model="queryParams.typePackage"
              placeholder="资费类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in typePackageOptions"
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
                v-for="dict in timetypeinfoTim"
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
                    v-for="dict in typeOptionsinfo"
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
            <right-toolbar :showSearch.sync="showSearch" v-hasPermi="['yunze:offeringinfolist:list']" @queryTable="getList"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
          <el-table-column label="通道类型" align="center" prop="cd_code" v-if="columns[0].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(channelCodeOptions, scope.row.cd_code) }}
            </template>
          </el-table-column>
          <el-table-column label="资费 ID" align="center" prop="offeringId" v-if="columns[1].visible"/>
          <el-table-column label="资费名称" align="center" prop="offeringName" v-if="columns[2].visible"/>
          <el-table-column label="APN 名称" align="center" prop="apnName" v-if="columns[3].visible"/>
          <el-table-column label="创建时间" align="center" prop="create_date" v-if="columns[4].visible"/>
          <el-table-column label="最近一次修改时间" align="center" prop="upd_date" v-if="columns[5].visible"/>
          <el-table-column label="资费类型" align="center" prop="type" v-if="columns[6].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(typePackageOptions, scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-hasPermi="['yunze:offeringinfolist:list']"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                v-hasPermi="['yunze:offeringinfo:delete']"
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

    <!--修改-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!--资费类型 -->
        <el-form-item label="资费类型" prop="status">
          <el-select
            v-model="form.type"
            placeholder="资费类型"
            clearable
            size="medium"
            style="width: 200px"
          >
            <el-option
              v-for="dict in typePackageOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {listInfo,DeleteInfo,UpdateInfo} from "@/api/yunze/flowcard/offeringinfo";
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
      // 总条数
      total: 0,
      // 用户表格数据
      cardList: null,
      // 是否显示弹出层
      open: false,
      title:"",
      // 时间数组
      timetypeinfoTim:[],
      //通道编码
      channelCodeOptions: [],
      // 查询条件
      typeOptionsinfo: [],
      // 资费类型
      typePackageOptions:[],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 列信息
      columns: [
        {key: 1, label: `抄送任务id`, visible: true},
        {key: 2, label: `推送API`, visible: true},
        {key: 3, label: `推送邮件`, visible: true},
        {key: 4, label: `抄送状态`, visible: true},
        {key: 5, label: `抄送结果`, visible: true},
        {key: 6, label: `抄送次数`, visible: true},
        {key: 7, label: `备注`, visible: true},
        {key: 8, label: `抄送参数`, visible: true},
        {key: 9, label: `创建时间`, visible: true},
        {key: 10, label: `最近一次抄送时间`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },

  created() {

    //加载 查询条件
    if (window['typeOptionsinfo'] != undefined && window['typeOptionsinfo'] != null && window['typeOptionsinfo'] != '') {
      this.typeOptionsinfo = window['typeOptionsinfo'];
    } else {
      this.getDicts("yunze_offeringinfo_type").then(response => {
        window['typeOptionsinfo'] = response.data;
        this.typeOptionsinfo = window['typeOptionsinfo'];
      });
    }


    //加载 时间赛选查询条件
    if (window['timetypeinfoTim'] != undefined && window['timetypeinfoTim'] != null && window['timetypeinfoTim'] != '') {
      this.timetypeinfoTim = window['timetypeinfoTim'];
    } else {
      this.getDicts("yunze_offeringinfo_timetype").then(response => {
        window['timetypeinfoTim'] = response.data;
        this.timetypeinfoTim = window['timetypeinfoTim'];
      });
    }

    //加载 通道编码
    if (window['channelCodeOptions'] != undefined && window['channelCodeOptions'] != null && window['channelCodeOptions'] != '') {
      this.channelCodeOptions = window['channelCodeOptions'];
    } else {
      this.getDicts("channel_code").then(response => {
        window['channelCodeOptions'] = response.data;
        this.channelCodeOptions = window['channelCodeOptions'];
      });
    }

    //加载 上游API返回资费计划类型
    if (window['typePackageOptions'] != undefined && window['typePackageOptions'] != null && window['typePackageOptions'] != '') {
      this.typePackageOptions = window['typePackageOptions'];
    } else {
      this.getDicts("card_api_offeringinfo_type").then(response => {
        window['typePackageOptions'] = response.data;
        this.typePackageOptions = window['typePackageOptions'];
      });
    }

    //默认条件选择选中第一个
    this.queryParams.type ='0';

    this.getList();
  },
  methods: {


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


    /** 查询执行日志列表 */
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
      //console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      listInfo(Pwd_Str).then(response => {
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

    //修改
    handleUpdate(row){
      this.open = true;
      this.title = "上游资费组管理"
      row.type = ""+row.type;
      this.form = row;
    },
    // 修改确定按钮
    submitForm(){
      let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
      UpdateInfo(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.open = false;
          //更新数据
          this.queryParams.page = 1;
          this.getList();
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    //删除
    handleDelete(row){
      let map ={};
      map.id = row.id;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      tools.openAsk(this,'warning', "确定要删除ID '"+row.id+"' 的这条数据吗？", this.deleteCcUrl, Pwd_Str);
    },
    deleteCcUrl(Pwd_Str){
      DeleteInfo(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getList();
          this.msgSuccess(jsonobj.msg);
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
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

