<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in inventorydetails_timetype"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="selTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 360px"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <span class="el-form-item__label" style="font-weight: 700;">起止条件 </span>
            <el-select
              v-model="queryParams.StartAndEndtype"
              placeholder="起止条件"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in inventorydetails_StartAndEnd_type"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryParams.StartValue"
              placeholder="开始号段"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryParams.EndValue"
              placeholder="结束号段"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>


        </el-form>

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                :loading="exportLoading"
                @click="handleExport"
                v-hasPermi="['yunze:inventorydetails:Exportdetails']"
              >导出
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="info"
                plain
                icon="el-icon-upload2"
                size="mini"
                @click="ImportCard"
                v-hasPermi="['yunze:inventorydetails:cardInfo']"
              >导入至卡信息
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-link"
                size="mini"
                @click="handleDivide"

              >划分
              </el-button>
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">

          <el-table-column label="虚拟编号" align="center" prop="VID" v-if="columns[0].visible"/>
          <el-table-column label="序列号" align="center" prop="arraylNumber" v-if="columns[1].visible"/>
          <el-table-column label="箱号" align="center" prop="CaseNumber" v-if="columns[2].visible"/>
          <el-table-column label="盘号" align="center" prop="PlateNumber" v-if="columns[3].visible"/>
          <el-table-column label="产品编码" align="center" prop="productCode" v-if="columns[4].visible"/>
          <el-table-column label="批号" align="center" prop="batchNumber" v-if="columns[5].visible"/>
          <el-table-column label="卷盘号" align="center" prop="Pkg_Id" v-if="columns[6].visible"/>
          <el-table-column label="MAC" align="center" prop="MAC" v-if="columns[7].visible"/>
          <el-table-column label="设备码" align="center" prop="DeviceCode" v-if="columns[8].visible"/>
          <el-table-column label="串号" align="center" prop="SerialNumber" v-if="columns[9].visible"/>
          <el-table-column label="SN" align="center" prop="SN" v-if="columns[10].visible"/>
          <el-table-column label="原SN" align="center" prop="Original_SN" v-if="columns[11].visible"/>
          <el-table-column label="iccid" align="center" prop="iccid" v-if="columns[12].visible"/>
          <el-table-column label="IMSI" align="center" prop="IMSI" v-if="columns[13].visible"/>
          <el-table-column label="IMEI" align="center" prop="IMEI" v-if="columns[14].visible"/>
          <el-table-column label="CMEI" align="center" prop="CMEI" v-if="columns[15].visible"/>
          <el-table-column label="创建时间" align="center" prop="create_time" v-if="columns[16].visible"/>
          <el-table-column label="入库时间" align="center" prop="enteringwarehousetime" v-if="columns[17].visible"/>

        </el-table>

        <!--导入至卡信息对话框-->
        <el-dialog :title="title" :visible.sync="open" width="65%" append-to-body>

          <el-row>
            <el-form ref="form" :model="ImportParams" label-width="80px">
              <el-col :span="9">
                <div class="head-container">
                  <el-input
                    v-model="treeName"
                    placeholder="请输入企业名称"
                    clearable
                    size="small"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 20px"
                  />
                </div>
                <div class="head-container">
                  <el-tree :data="deptOptions" :check-on-click-node="false" ref="tree" :filter-node-method="filterNode"
                           show-checkbox :check-strictly="true" default-expand-all node-key="id"
                           :props="defaultProps" @check-change="treeNodeClick" empty-text="暂无数据">
                  </el-tree>
                </div>
              </el-col>

              <el-main style="padding-top: 1%;padding-left: 7%">
                <el-row :gutter="1.5" class="mb8">
                  <el-col>
                    <el-form-item prop="status">
                      <h4> 资费组划分、通道划分 、超量停机阈值设定
                        <el-tooltip placement="bottom">
                          <div slot="content">
                            选择需要修改的属性后 需选择是否同步修改
                            <br/>同步修改 选择为 是:同步修改该属性，<br/>
                            如： 超量停机阈值 不填写 且 为同步修改 将会不再对该卡进行超量停机管控。
                          </div>
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </h4>
                    </el-form-item>
                    <el-form-item label="所属用户" prop="cd_code" label-width="112px">
                      <el-select v-model="ImportParams.user_id" placeholder="请选择" style="width: 223px" size="small">
                        <el-option
                          v-for="item in userArr"
                          :key="item.user_id"
                          :label="item.nick_name"
                          :value="item.user_id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="status" label-width="113px">
               <span slot="label">
                资费选择
                <el-tooltip placement="right">
                  <div slot="content">
                    选择 划分 资费组
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
                      <el-select
                        v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
                        v-model="ImportParams.package_id"
                        placeholder="资费组"
                        clearable
                        ref="packageSel"
                        size="small"
                        style="width: 310px;"
                      >
                        <el-option
                          v-for="dict in packageOptions"
                          :key="dict.package_id"
                          :label="dict.package_agentname"
                          :value="dict.package_id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="status" label-width="115px">
              <span slot="label">
                所属上游通道
                <el-tooltip placement="right">
                  <div slot="content">
                    调用API请求通道，划分错误会导致同步信息数据失败。
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
                      <el-select
                        v-model="ImportParams.channel_id"
                        placeholder="所属通道"
                        clearable

                        size="small"
                        style="width: 310px"
                      >
                        <el-option
                          v-for="dict in findCr_RouteOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="dict.dictValue"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label-width="115px">
              <span slot="label">
                超停阈值MB
                <el-tooltip placement="right">
                  <div slot="content">
                    超量停机阈值 达到指定 MB 后会 进行停机 指令，停机后需手动复机
                    <br/>且在同一上游结算周期内，停机后复机不扩大超停阈值会继续触发超量停机！
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
                      <el-input style="width: 310px" @keydown.native="handleInput" v-model="ImportParams.remind_ratio"
                                placeholder="请输入超量停机 阈值（MB）"/>

                    </el-form-item>

                    <el-form-item label-width="115px">
              <span slot="label">
                超停是否同步
                <el-tooltip placement="right">
                  <div slot="content">
                    设置超量停机时需要 选择是
                    <br/> 如 想取消超量停机 》 超停阈值MB （不用填写） ，超停是否同步（选择是）【此时会更新超量停机阈值】
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
                      <el-radio-group>
                        <label class="el-radio " v-for="(item,index) in customize_whether">
                                    <span class="el-radio__input my_checkbox__inner">
                                    <input type="radio" v-model="ImportParams.Is_remind_ratio"
                                           name="in_stock"
                                           :value="item.dictValue"/>
                                     </span>
                          <span class="el-radio__label ">{{ item.dictLabel }}</span>
                        </label>
                      </el-radio-group>
                    </el-form-item>
                    <!--未订购资费 是否 轮询停机-->
                    <el-form-item label-width="200px">
              <span slot="label">
                未订购资费 是否 轮询停机
                <el-tooltip placement="right">
                  <div slot="content">
                   未订购资费 轮询断网 选择否不轮询停机或断网,相当于取消
                    <br/>
                    选择是?如果他未订购资费会进行断网,或者停机操作!~~~默认选中不操作.
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
                      <el-radio-group v-model="ImportParams.is_Disconnected">
                        <el-radio :label="999">不操作</el-radio>
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-button type="primary" @click="submitFileForm">确 定</el-button>
                  <el-button @click="cancel">取 消</el-button>
                </el-row>
              </el-main>
            </el-form>
          </el-row>

        </el-dialog>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 卡号划分 -->
        <el-dialog :title="title" :visible.sync="Divide_show" width="960px" append-to-body>
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="12">
                <div class="head-container">
                  <el-input
                    v-model="treeName"
                    placeholder="请输入企业名称"
                    clearable
                    size="small"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 20px"
                  />
                </div>
                <div class="head-container">
                  <el-tree :data="deptOptions" :check-on-click-node="false" ref="tree" :filter-node-method="filterNode"
                           show-checkbox :check-strictly="true" default-expand-all node-key="id"
                           :props="defaultProps" @check-change="treeNodeClick" empty-text="暂无数据">
                  </el-tree>
                </div>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属用户" prop="cd_code">
                  <el-select v-model="ImportParams.user_id" placeholder="请选择" size="small">
                    <el-option
                      v-for="item in userArr"
                      :key="item.user_id"
                      :label="item.nick_name"
                      :value="item.user_id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button  v-if="Dividebtn" type="primary" @click="Divide">保 存</el-button>
          </div>
        </el-dialog>


      </el-col>
    </el-row>
  </div>
</template>

<script>
import {findDeptUser} from "@/api/yunze/flowcard/card/card";
import {queryPackageSimple, findCr} from "@/api/yunze/flowcard/card/card";
import {Inventorydetails, ExportInventorydetails, ImportCardInfo,DivideCard} from "@/api/yunze/warehouse/Inventorydetails";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {treeselect} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import tools from "@/utils/yunze/tools";

export default {
  name: "Inventorydetails",
  components: {Treeselect},
  data() {
    return {
      tools: tools,
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
      userArr: [],//企业下用户数组
      // 部门树选项
      deptOptions: undefined,
      // 导出遮罩层
      exportLoading: false,
      submitFileFormBtn: true,
      //划卡企业
      treeName: undefined,
      show_ds: false, //详情查询
      selTime: '',//时间选择
      mainwidth: 24,//宽度
      // 遮罩层
      loading: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      //时间类型
      inventorydetails_timetype: [],
      inventorydetails_StartAndEnd_type: [],// 起止条件查询类别
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      packageOptions: [],
      findCr_RouteOptions: [],// API通道信息
      customize_whether: [],//自定义是否
      selectList: [],

      Divide_show: false,//卡划分

      Dividebtn: true,//划卡 btn

      // 总条数
      total: 0,
      // 用户表格数据
      cardList: [],
      // 是否显示弹出层
      open: false,
      title: '',
      // 默认密码
      initPassword: undefined,

      // 表单参数
      form: {},

      typeOptions: [],
      //当前查询参数
      sel: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staTime: null,
        endTime: null,
        StartAndEndtype: null,
        StartValue: null,
        EndValue: null,
        timetype: null,
        type: null,
        CSE_ID: null,

      },
      // 导入至卡信息参数
      ImportParams: {

        dept_id: '',
        user_id: '',
        Is_remind_ratio: '0',
        is_Disconnected: 999,
      },
      // 列信息
      columns: [
        {key: 0, label: `虚拟编号`, visible: true},
        {key: 1, label: `序列号`, visible: true},
        {key: 2, label: `箱号`, visible: true},
        {key: 3, label: `盘号`, visible: true},
        {key: 4, label: `产品编码`, visible: true},
        {key: 5, label: `批号`, visible: true},
        {key: 6, label: `卷盘号`, visible: true},
        {key: 7, label: `MAC`, visible: false},
        {key: 8, label: `设备码`, visible: true},
        {key: 9, label: `串号`, visible: false},
        {key: 10, label: `SN`, visible: false},
        {key: 11, label: `原SN`, visible: false},
        {key: 12, label: `iccid`, visible: true},
        {key: 13, label: `IMSI`, visible: true},
        {key: 14, label: `IMEI`, visible: true},
        {key: 15, label: `CMEI`, visible: false},
        {key: 16, label: `创建时间`, visible: true},
        {key: 17, label: `入库时间`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },
  watch: {
    // 根据名称筛选企业树
    treeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    const Cy_ID = this.$route.params.Cy_ID;
    if (tools.Is_null(Cy_ID)) {
      this.queryParams.value = Cy_ID;
      this.queryParams.type = '17';
    }
    //加载 查询条件
    if (window['InventoryDetails_selType'] != undefined && window['InventoryDetails_selType'] != null && window['InventoryDetails_selType'] != '') {
      this.typeOptions = window['InventoryDetails_selType'];
    } else {
      this.getDicts("yunze_InventoryDetails_selType").then(response => {
        window['InventoryDetails_selType'] = response.data;
        this.typeOptions = window['InventoryDetails_selType'];
      });
    }

    //加载 时间赛选查询条件
    if (window['inventorydetails_timetype'] != undefined && window['inventorydetails_timetype'] != null && window['inventorydetails_timetype'] != '') {
      this.inventorydetails_timetype = window['inventorydetails_timetype'];
    } else {
      this.getDicts("yunze_inventorydetails_timetype").then(response => {
        // console.log(response.data)
        window['inventorydetails_timetype'] = response.data;
        this.inventorydetails_timetype = window['inventorydetails_timetype'];
      });
    }

    //加载 起止条件查询类别
    if (window['inventorydetails_StartAndEnd_type'] != undefined && window['inventorydetails_StartAndEnd_type'] != null && window['inventorydetails_StartAndEnd_type'] != '') {
      this.inventorydetails_StartAndEnd_type = window['inventorydetails_StartAndEnd_type'];
    } else {
      this.getDicts("yunze_inventorydetails_StartAndEnd_type").then(response => {
        window['inventorydetails_StartAndEnd_type'] = response.data;
        this.inventorydetails_StartAndEnd_type = window['inventorydetails_StartAndEnd_type'];
      });
    }
    //加载 资费组名称
    if (window['packageOptions'] != undefined && window['packageOptions'] != null && window['packageOptions'] != '') {
      this.packageOptions = window['packageOptions'];
    } else {
      queryPackageSimple().then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        window['packageOptions'] = jsonobj.Data;
        this.packageOptions = window['packageOptions'];
      });
    }
    //加载 API通道名称
    if (window['findCr_RouteOptions'] != undefined && window['RouteOptions'] != null && window['findCr_RouteOptions'] != '') {
      this.findCr_RouteOptions = window['findCr_RouteOptions'];
    } else {
      findCr().then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        window['findCr_RouteOptions'] = jsonobj.Data;
        this.findCr_RouteOptions = window['findCr_RouteOptions'];
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

    //条件查询 默认选择第一个
    this.queryParams.type = '1';

    this.getTreeselect();
    this.getList();
  },
  methods: {
    handleInput(e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
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
      this.queryParams.StartValue = tools.Is_null(this.queryParams.StartValue) ? this.queryParams.StartValue : null;
      this.queryParams.EndValue = tools.Is_null(this.queryParams.EndValue) ? this.queryParams.EndValue : null;
    },

    /** 查询库存明细列表 */
    getList() {
      this.loading = true;
      this.getParams();
      // console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      Inventorydetails(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
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
    /**划卡*/
    handleDivide(){
      this.Divide_show = true;

    },
    /**划卡保存按钮*/
    Divide(){
      this.Dividebtn = false;
      //console.log(this.formDivide.dept_id+"   "+this.formDivide.user_id);
      if (tools.VerificationsText(this, this.ImportParams.dept_id, "请选择所属企业！") == true &&
        tools.VerificationsText(this, this.ImportParams.user_id, "请选择所属用户！") == true) {
        //1.先按当期筛选条件查询出数据 询问是否保存
        this.handleQuery();
        let map = this.queryParams;
        let user_name = tools.getUserNamekeyValue(this.userArr, this.ImportParams.user_id);
        map.set_dept_id = this.ImportParams.dept_id;
        map.set_user_id = this.ImportParams.user_id;
        map.set_dept_name = this.ImportParams.dept_name;
        map.set_user_name = user_name;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        tools.openAsk(this, 'warning', "确定将筛选 [ " + this.total + " ] 条数据  划分给  [ " + this.ImportParams.dept_name + " ]  [ " + user_name + " ] 吗？", this.DivideSave, Pwd_Str);
      }
    },

    //划卡保存
    DivideSave(Pwd_Str) {
      DivideCard(Pwd_Str).then(response => {
        this.Dividebtn = true;
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.Divide_show = false;
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgSuccess(msg);
          this.handleQuery();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    /**导出*/
    handleExport() {
      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      ExportInventorydetails(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.Data);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**导入至卡信息*/
    ImportCard() {
      this.open = true;


    },
    // 确定 按钮
    submitFileForm() {
      let _this = this;
      this.Tips(_this);

    },
    Tips(_this) {
      if (tools.VerificationsText(_this, _this.ImportParams.dept_id, "所属公司不能为空！") == true &&
        tools.VerificationsText(_this, _this.ImportParams.user_id, "用户不能为空！") == true) {
        let msg = '';
        if (tools.Is_null(_this.ImportParams.package_id)) {
          msg += ' 设置 资费组为【' + tools.getPackageNNamekeyValue(packageOptions, _this.ImportParams.package_id) + '】 ';
        }
        if (tools.Is_null(_this.ImportParams.channel_id)) {
          msg += ' 设置 上游通道为【' + tools.getkeyValue(findCr_RouteOptions, _this.ImportParams.channel_id, "dictValue", "dictLabel") + '】 ';
        }
        if (_this.ImportParams.Is_remind_ratio == "1") {
          if (tools.Is_null(_this.ImportParams.remind_ratio)) {
            msg += ' 更新 》设置 超量停机阈值 为【' + _this.ImportParams.remind_ratio + '】MB ';
          } else {
            _this.ImportParams.remind_ratio = '';
            msg += ' 更新 》取消 超量停机设置  ';
          }
        }
        if (_this.ImportParams.is_Disconnected == "0") {
          if (tools.Is_null(_this.ImportParams.remind_ratio)) {
            msg += ' 轮询 》设置 未订购资费 轮询断网 为【' + _this.ImportParams.remind_ratio + '】MB ';
          } else {
            _this.ImportParams.remind_ratio = '';
            msg += ' 轮询 》设置 未订购资费 轮询断网  ';
          }
        }
        if (_this.ImportParams.is_Disconnected == "1") {
          if (tools.Is_null(_this.ImportParams.remind_ratio)) {
            msg += ' 轮询 》设置 未订购资费 轮询断网 为【' + _this.ImportParams.remind_ratio + '】MB ';
          } else {
            _this.ImportParams.remind_ratio = '';
            msg += ' 轮询 》设置 未订购资费 轮询断网  ';
          }
        }
        this.handleQuery();
        let map = this.queryParams;
        let user_name = tools.getUserNamekeyValue(this.userArr, this.ImportParams.user_id);
        map.set_dept_id = this.ImportParams.dept_id;
        map.set_user_id = this.ImportParams.user_id;
        map.set_dept_name = this.ImportParams.dept_name;
        map.set_user_name = user_name;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        tools.openAsk(this, 'warning', "确定将筛选 [ " + this.total + " ] 条数据  划分给  [ " + this.ImportParams.dept_name + " ]  [ " + user_name + " ]  " + msg + "  吗？", this.uploadUp, Pwd_Str);
      }
    },

    //确定按钮
    uploadUp(_this) {
      let obj = Object.assign(this.ImportParams, this.queryParams);
      // console.log(obj)
      let Pwd_Str = tools.encrypt(JSON.stringify(obj));
      ImportCardInfo(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.open = false;
          this.getList();
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgSuccess(msg);
        } else {
          this.msgError(jsonobj.msg);
        }
      });


    },
    // 取消按钮
    FalseFun(Pwd_Str) {

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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 查询企业下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
        //console.log(this.deptOptions)
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // tree单选
    treeNodeClick(data, checked) {
      this.userArr = [];
      const node = this.$refs.tree.getNode(data);
      //console.log(node)
      const str = [];

      // 获取当前选择的id在数组中的索引
      const indexs = this.selectList.indexOf(data.id);
      // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
      if (indexs < 0 && this.selectList.length === 1 && checked) {
        this.msgError("单选操作请勿多选！");
        // 设置已选择的节点为false 很重要
        this.$refs.tree.setChecked(data, false);
      } else if (this.selectList.length === 0 && checked) {
        // 发现数组为空 并且是已选择
        // 防止数组有值，首先清空，再push
        this.selectList = [];
        this.ImportParams.dept_id = '';
        this.selectList.push(data.id);
        //filterName(node);

        //this.ImportParams.dept_id = str.reverse().join('/');
        //this.ImportParams.dept_id = str[0];
        this.ImportParams.dept_id = data.id;
        this.ImportParams.dept_name = data.label;
        //获取企业下用户
        this.userArr = [];
        this.ImportParams.user_id = null;
        let map = {};
        map.dept_id = this.ImportParams.dept_id;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        findDeptUser(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if (jsonobj.code == 200) {
              this.userArr = jsonobj.Data;
            } else {
              this.msgError(jsonobj.msg);
            }
            this.loading = false;
          }
        );

        //console.log(this.ImportParams.dept_id);
      } else if (indexs >= 0 && this.selectList.length === 1 && !checked) {
        // 再次直接进行赋值为空操作
        this.selectList = [];
        this.ImportParams.dept_id = '';
      }
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

