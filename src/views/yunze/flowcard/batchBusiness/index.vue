<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <!--业务类别-->
          <el-form-item label="业务类型" prop="status">
            <el-select
              v-model="queryParams.type"
              placeholder="业务类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in BatchBusiness_type"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <!--业务状态   -->
          <el-form-item label="业务状态" prop="status">
            <el-select
              v-model="queryParams.state_id"
              placeholder="业务状态"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in BatchBusiness_state"
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
                v-for="dict in yunzePublicTime"
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
                    v-for="dict in typeBatchBusiness"
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
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
          <el-table-column label="任务名" align="center" prop="task_name" v-if="columns[0].visible"/>

          <el-table-column label="编号" align="center" prop="code" v-if="columns[1].visible">
            <template slot-scope="scope">
                <span @click="Details(scope.row)" class="link-type"
                      v-hasPermi="['yunze:businessDtails:success']">{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="type" v-if="columns[2].visible" width="150">
            <template slot-scope="scope">
               <span @click="openExecutionTaskInfo(scope.row)" class="link-type"
                     v-hasPermi="['yunze:executionTask:download']">
              {{ tools.getDkeyValue(BatchBusiness_type, scope.row.type) }}
               </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="state_id" v-if="columns[3].visible" width="80">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(BatchBusiness_state, scope.row.state_id) }}
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center" prop="start_time" v-if="columns[4].visible" />
          <el-table-column label="结束时间" align="center" prop="end_time" v-if="columns[5].visible" />
          <el-table-column label="创建人" align="center" prop="auth" v-if="columns[6].visible"/>
        </el-table>

        <el-dialog :visible.sync="show_ds" width="80%" :close-on-click-modal="false" append-to-body>

          <!-- 加载子组件 -->
          <Subcomponents ref="Subcomponents"
                         @SetObj="SetObj"
                         :show_ds="show_ds"
                         :implement="implement"
                         :form="form"
          />

        </el-dialog>


        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>




    <el-dialog :close-on-click-modal="false"
    title="下载执行日志结果" :visible.sync="executionTaskDis">
    <hr style="color:green"/>
    <el-row :gutter="20">
      <ul class="list-group" v-for="(item,index) in Urls">
        <li>
            <span @click="getDownloadExecutionTask(item)" class="link-type"
                  v-hasPermi="['yunze:executionTask:download']">{{ item.name }} CSV</span>

          <span style="margin-left: 20px;" @click="getdownloadConversionk(item)" class="link-type"
                v-hasPermi="['yunze:executionTask:download']">{{ item.name }} XLS</span>
        </li>
      </ul>
    </el-row>
    </el-dialog>

  </div>
</template>

<script>
import {getListArr} from "@/api/yunze/flowcard/bulk/batchBusiness";
import tools from "@/utils/yunze/tools";
import Subcomponents from "./Subcomponents";
import {getToken} from "@/utils/auth";




export default {
  name: "batchBusiness",
  components: {
    Subcomponents,

  },
  data() {
    return {
      executionTaskDis: false,
      Urls: [],
      ExecutionTask_OutType: [],// 执行日志导出类别

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
      // 详情查看
      show_ds:false,
      // 加载是否 已执行
      implement:false,
      // 时间数组
      yunzePublicTime:[],
      //业务类型
      BatchBusiness_type: [],
      //业务状态
      BatchBusiness_state: [],
      // 查询条件
      typeBatchBusiness: [],
      // 表单参数
      form: {
        pageNum: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 列信息
      columns: [
        {key: 1, label: `任务名`, visible: true},
        {key: 2, label: `编号`, visible: true},
        {key: 3, label: `类型`, visible: true},
        {key: 4, label: `状态`, visible: true},
        {key: 5, label: `开始时间`, visible: true},
        {key: 6, label: `结束时间`, visible: true},
        {key: 7, label: `创建人`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },

  created() {

    //加载 查询条件
    if (window['typeBatchBusiness'] != undefined && window['typeBatchBusiness'] != null && window['typeBatchBusiness'] != '') {
      this.typeBatchBusiness = window['typeBatchBusiness'];
    } else {
      this.getDicts("yunze_batchBusiness_type").then(response => {
        window['typeBatchBusiness'] = response.data;
        this.typeBatchBusiness = window['typeBatchBusiness'];
      });
    }


    //加载 业务类型
    if (window['BatchBusiness_type'] != undefined && window['BatchBusiness_type'] != null && window['BatchBusiness_type'] != '') {
      this.BatchBusiness_type = window['BatchBusiness_type'];
    } else {
      this.getDicts("yz_bulk_business_type").then(response => {
        window['BatchBusiness_type'] = response.data;
        this.BatchBusiness_type = window['BatchBusiness_type'];
      });
    }

    //加载 业务状态
    if (window['BatchBusiness_state'] != undefined && window['BatchBusiness_state'] != null && window['BatchBusiness_state'] != '') {
      this.BatchBusiness_state = window['BatchBusiness_state'];
    } else {
      this.getDicts("yz_bulk_business_state_id").then(response => {
        window['BatchBusiness_state'] = response.data;
        this.BatchBusiness_state = window['BatchBusiness_state'];
      });
    }

    //加载 时间赛选查询条件
    if (window['yunzePublicTime'] != undefined && window['yunzePublicTime'] != null && window['yunzePublicTime'] != '') {
      this.yunzePublicTime = window['yunzePublicTime'];
    } else {
      this.getDicts("yunze_task_sel_timetype").then(response => {
        window['yunzePublicTime'] = response.data;
        this.yunzePublicTime = window['yunzePublicTime'];
      });
    }

    //加载 执行日志导出类别
    if (window['ExecutionTask_OutType'] != undefined && window['ExecutionTask_OutType'] != null && window['ExecutionTask_OutType'] != '') {
      this.ExecutionTask_OutType = window['ExecutionTask_OutType'];
    } else {
      this.getDicts("yunze_ExecutionTask_OutType").then(response => {
        window['ExecutionTask_OutType'] = response.data;
        this.ExecutionTask_OutType = window['ExecutionTask_OutType'];
      });
    }

    this.getList();
  },
  methods: {



    //下载 xls 文件 格式
    getdownloadConversionk(row) {
      let map = {};
      map.path = row.value;
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API + "/yunze/ExecutionTask/downloadConversion?Pstr=" + Pwd_Str, '_blank');

    },


    //任务下载详情
    openExecutionTaskInfo(ExecutionTask) {
      // console.log(ExecutionTask.end_time)
      if (ExecutionTask.end_time) {
        let _this = this;
        _this.Urls = [];
        //console.log(ExecutionTask);
        let url = ExecutionTask.url;
        let reg = RegExp(/,/);
        let Url_list = [];
        //console.log(url.match(reg))
        //console.log(url.match(reg).index)
        if (url.match(reg)) {
          Url_list = url.split(",");
        } else {
          if (url != null) {
            Url_list.push(url);
          }
        }
        // console.log(Url_list)
        for (let i = 0; i < Url_list.length; i++) {
          let Url_map = {};
          let url_val = Url_list[i];
          for (let j = 0; j < ExecutionTask_OutType.length; j++) {
            let obj = ExecutionTask_OutType[j];
            let type = obj.dictValue;
            if (url_val.indexOf(type) != -1) {
              Url_map.name = obj.dictLabel;
            }
          }
          Url_map.value = url_val;
          _this.Urls.push(Url_map);
        }
        _this.executionTaskDis = true;
      } else {
        this.msgError("下载执行日志时间还没有结束");
      }

    },




    /*下载执行日志*/
    getDownloadExecutionTask(row) {
      let map = {};
      map.path = row.value;
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API + "/yunze/ExecutionTask/download?Pstr=" + Pwd_Str, '_blank');

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

    /**详情查看按钮*/
    Details(row){

    this.form = row;
      // console.log(this.form = row)

      this.implement = false;
      this.show_ds = true;
    },

    //设置数据
    SetObj(Key, obj) {
      //console.log(obj);
      switch (Key) {
        case 'Setshow_ds':
          this.show_ds = obj;// 设置 drawer
          break;
        case 'Setimplement':
          this.implement = obj;
          break;
        case 'SetFrom':
          this.form = obj;
          break;
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
      getListArr(Pwd_Str).then(response => {
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

