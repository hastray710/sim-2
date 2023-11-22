<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">

        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <!--入库源 -->
          <el-form-item label="入库源" prop="status">
            <el-select
              v-model="queryParams.CSE_Stid"
              placeholder="请选择入库源"
              clearable
              size="small"
              style="width: 130px"
            >
              <el-option
                v-for="dict in Warehousing_source"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!--经办人-->
          <el-form-item label="经办人" prop="status" label-width="70px">
            <el-select
              v-model="queryParams.CSE_Manager_ID"
              placeholder="请选中"
              clearable
              size="small"
              style="width: 115px"
            >
              <el-option
                v-for="dict in Handler"
                :key="dict.user_id"
                :label="dict.nick_name"
                :value="dict.user_id"
              />
            </el-select>
          </el-form-item>
          <!--库管员-->
          <el-form-item label="库管员" prop="status" label-width="70px">
            <el-select
              v-model="queryParams.CSE_warehouseman_ID"
              placeholder="请选中"
              clearable
              size="small"
              style="width: 115px"
            >
              <el-option
                v-for="dict in Warehouse_keeper"
                :key="dict.user_id"
                :label="dict.nick_name"
                :value="dict.user_id"
              />
            </el-select>
          </el-form-item>
          <!--  时间类型-->
          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.CSE_Time"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in CSE_Time_date"
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
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="drawer = true"
                v-hasPermi="['yunze:XsglCustomer:add']"
              >新增
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="CkglcommodityStorage">
          <el-table-column label="入库源" align="CSE_Stid" prop="CSE_Stid" v-if="columns[0].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(Warehousing_source, scope.row.CSE_Stid) }}
            </template>
          </el-table-column>
          <el-table-column label="入库日期" align="CSE_Time" prop="CSE_Time" v-if="columns[1].visible"/>
          <el-table-column label="概述" align="CSE_Overview" prop="CSE_Overview" v-if="columns[2].visible"/>
          <el-table-column label="经办人" align="CSE_Manager_ID" prop="CSE_Manager_ID" v-if="columns[3].visible">
            <template slot-scope="scope">
              {{ tools.getkeyValue(Handler, scope.row.CSE_Manager_ID, "user_id", "nick_name") }}
            </template>
          </el-table-column>
          <el-table-column label="库管员" align="CSE_warehouseman_ID" prop="CSE_warehouseman_ID" v-if="columns[4].visible">
            <template slot-scope="scope">
              {{ tools.getkeyValue(Warehouse_keeper, scope.row.CSE_warehouseman_ID, "user_id", "nick_name") }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="90" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-dropdown>
                <el-button type="primary" size="small">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item size="small"
                                    @click.native="DetailedSee(scope.row)">明细查看
                  </el-dropdown-item>

                </el-dropdown-menu>

              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getList"
        />


        <el-drawer
          :visible.sync="drawer"
          :with-header="false"
          size="92%">
          <!-- 销售合同 组件-->
          <AddInout ref="addInout"
                    :AddformObj="AddformObj"
                    :Warehousing_source="Warehousing_source"
                    :Handler="Handler"
                    :Warehouse_keeper="Warehouse_keeper"
                    :Large_classification="Large_classification"
                    :Small_classification="Small_classification"
                    :commodity="commodity"
                    :drawer="drawer"
                    @SetObj="SetObj"
                    :SubAdd="SubAdd"
                    :window="window"
          />
        </el-drawer>

        <!--明细-->
        <el-drawer
          :visible.sync="detailed"
          :with-header="false"
          size="92%">
          <DetailedObj ref="detailedObj"
                       :AddformObj="AddformObj"
                       :Large_classification="Large_classification"
                       :Small_classification="Small_classification"
                       :Warehousing_source="Warehousing_source"
                       :Handler="Handler"
                       :detailed="detailed"
                       :Warehouse_keeper="Warehouse_keeper"
                       :Detail_view="Detail_view"
                       @SetObj="SetObj"
                       :window="window"
          />
        </el-drawer>


        <!-- 导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
          <el-upload
            ref="upload"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="upload.headers"
            :action="upload.url + '?updateSupport=' + upload.updateSupport"
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
              <!--<el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据-->
              <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
            </div>
            <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="submitFileFormBtn" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="textarea1">
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import {Administration, Warehousingadd} from "@/api/yunze/Dictionaries/type";
import {Commodity, Queryloading, listStorage} from "@/api/yunze/warehouse/Inout";
import tools from "@/utils/yunze/tools";
import {getToken} from "@/utils/auth";
import AddInout from "./AddInout";
import DetailedObj from "./DetailedObj"
import {findSalesPartner} from "@/api/yunze/XSGL/customer/customer";


export default {
  name: "index",
  components: {//挂载
    AddInout,
    DetailedObj,
  },

  data() {
    return {

      // 查询参数
      queryParams: {
        staTime: null,
        endTime: null,
        CSE_Stid: null,
        CSE_Manager_ID: null,
        CSE_warehouseman_ID: null,
        CSE_Time: null,
      },
      title: "",
      textarea1: "",
      Detail_view: false,
      window: window,
      tools: tools,
      value: "",
      //导入
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        Number: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/yunze/inventorydetails/importData",
        Pstr: '',//携带参数
      },
      submitFileFormBtn: true,//导入 btn
      // 是否显示弹出层
      open: false,
      drawer: false,//新增展示
      detailed: false,//详情展示
      //回显展示
      innerDrawer: false,
      mainwidth: 24,//宽度
      //分页
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      // 新增 form 对象
      AddformObj: {
        staTime: null,
        endTime: null,
        CSE_Stid: '1',
        CSE_Overview: null,
        CSE_Time: tools.gitData(),
        CSE_Manager_ID: null,
        CSE_warehouseman_ID: null,
        CSE_ID: "",
        DICTIONARY_ID: null,
        Cy_Sort: null,
        Cy_Category: null,
        Cy_ID: null,
        CSDS_Storage_Quantity: null,
        idarr: null,
      },
      // 商品表参数
      commodity: {
        Cy_Sort: null,
        Cy_Category: null,
      },
      Large_classification: [],// 大分类
      Small_classification: [], // 小分类
      selTime: [],//时间选择
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 选中数组
      ids1: [],
      // 非单个禁用
      single1: true,
      // 非多个禁用
      multiple1: true,
      // 入库商品 表格数据
      cardList: [],
      //时间选择
      CSE_Time_date: [],
      // 遮罩层
      loading: false,
      // 遮罩层
      loading1: false,
      // 显示搜索条件
      showSearch: false,

      Warehousing_source: [], //入库源
      Handler: [],//经办人
      Warehouse_keeper: [], //库管员
      HeadquartersOption: [], //  总部门所有人
      HeadquartersnOrmalOption: [], //  总部门所有人 【状态正常 】

      //条件选择
      typeOptions: [],
      //全选，全不选
      deptNodeAll: false,
      //商品多选框查询
      Item_multi_selection_box: [],
      // 多选框
      checkAll: false,
      checkedCities: [],

      isIndeterminate: false,
      selName: '',//商品名称检索

      // 表单参数
      form: {},
      // 列信息
      columns: [
        {key: 0, label: `入库源`, visible: true},
        {key: 1, label: `入库日期`, visible: true},
        {key: 2, label: `概述`, visible: true},
        {key: 3, label: `经办人`, visible: true},
        {key: 4, label: `库管员`, visible: true},
        {key: 5, label: `上传文件地址`, visible: true},
      ],
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
      // 表单校验
      rules: {},
      pricing: '',

    };
  },

  created() {

    //加载 时间选择
    if (window['CSE_Time_date'] != undefined && window['CSE_Time_date'] != null && window['CSE_Time_date'] != '') {
      this.CSE_Time_date = window['CSE_Time_date'];
    } else {
      this.getDicts("CSE_Time_date").then(response => {
        console.log(response.data)
        window['CSE_Time_date'] = response.data;
        this.CSE_Time_date = window['CSE_Time_date'];
      });
    }

    //加载 入库源类型
    if (window['Warehousing_source'] != undefined && window['Warehousing_source'] != null && window['Warehousing_source'] != '') {
      this.Warehousing_source = window['Warehousing_source'];
    } else {
      this.getDicts("Warehousing_source").then(response => {
        window['Warehousing_source'] = response.data;
        this.Warehousing_source = window['Warehousing_source'];
      });
    }
    //加载 条件查询
    if (window['Warehousing_type'] != undefined && window['Warehousing_type'] != null && window['Warehousing_type'] != '') {
      this.typeOptions = window['Warehousing_type'];
    } else {
      this.getDicts("Warehousing_type_condition").then(response => {
        window['Warehousing_type'] = response.data;
        this.typeOptions = window['Warehousing_type'];
      });
    }


    //加载  总部门所有人
    if (window['HeadquartersOption'] != undefined && window['HeadquartersOption'] != null && window['HeadquartersOption'] != '') {
      this.HeadquartersOption = window['HeadquartersOption'];
      this.SetHeadquartersOption();
    } else {
      let map = {};
      map.isdept_id = 100;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findSalesPartner(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          window['HeadquartersOption'] = jsonobj.Data;
          this.HeadquartersOption = window['HeadquartersOption'];
          this.SetHeadquartersOption();
        } else {
          this.msgError(jsonobj.msg);
        }
      })
    }


    //加载 大分类
    if (window['Large_classification'] != undefined && window['Large_classification'] != null && window['Large_classification'] != '') {
      this.Large_classification = window['Large_classification'];
      let map = {};
      map.Cy_Sort = '9';
      if (tools.Is_null(window['details_' + map.Cy_Sort])) {
        this.getTowClass({'Cy_Sort': window['details_' + map.Cy_Sort]});
      }
      this.commodity.Cy_Sort = this.Large_classification[0].CODE;

    } else {
      let map = {};
      map.Cy_Sort = '9';
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      Administration(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        window['Large_classification'] = jsonobj.Data;
        this.Large_classification = window['Large_classification'];
        if (this.Large_classification != null && this.Large_classification.length > 0) {
          let val = '';
          for (let i = 0; i < this.Large_classification.length; i++) {
            let obj = this.Large_classification[i];
            // console.log(obj)
            window['child_id_' + map.Cy_Sort + "_" + obj.CODE] = [];
            (window['child_id_' + map.Cy_Sort + "_" + obj.CODE]).push(obj.child_id);
            if (i == 0) {
              window['details_' + map.Cy_Sort] = obj.child_id;
            }
          }
          if (tools.Is_null(window['details_' + map.Cy_Sort])) {
            this.getTowClass({'Cy_Sort': window['details_' + map.Cy_Sort]});
            this.commodity.Cy_Sort = this.Large_classification[0].CODE;
          }
        }
      });
    }
    this.Checkbox();
    this.getList();
  },
  methods: {


    //设置  选项
    SetHeadquartersOption() {
      if (this.HeadquartersOption != null && this.HeadquartersOption.length > 0) {
        this.HeadquartersnOrmalOption = [];
        let username = tools.getCookie("username");

        for (let i = 0; i < this.HeadquartersOption.length; i++) {
          let Obj = this.HeadquartersOption[i];
          if (Obj.del_flag == '0' && Obj.status == '0') {//获取 未删除的 状态正常的
            this.HeadquartersnOrmalOption.push(Obj);
            //选中当前登录用户信息
            if (Obj.user_name == username) {
              this.AddformObj.CSE_Manager_ID = Obj.user_id;
              this.AddformObj.CSE_warehouseman_ID = Obj.user_id;
            }
          }
        }
        //加载 经办人
        window['Handler'] = this.HeadquartersnOrmalOption;
        this.Handler = window['Handler'];
        //加载 库官员
        window['Warehouse_keeper'] = this.HeadquartersnOrmalOption;
        this.Warehouse_keeper = window['Warehouse_keeper'];
      }
    },

    /**详情查看 按钮*/
    DetailedSee(row) {
      this.detailed = true;
      this.Detail_view = false;
      this.resetQuery();
      row.CSE_Stid = "" + row.CSE_Stid;
      row.CSE_warehouseman_ID = "" + row.CSE_warehouseman_ID;
      row.CSE_Manager_ID = Number(row.CSE_Manager_ID);
      row.CSE_warehouseman_ID = Number(row.CSE_warehouseman_ID);
      this.AddformObj = row;
      // console.log(this.AddformObj = row)
      this.getList();
    },



    //设置数据
    SetObj(Key, obj) {
      //console.log(obj);
      switch (Key) {
        case 'SetEditexecute':
          this.Editexecute = obj;//设置  编辑  是否已经加载 [提供给子组件使用]
          break;
        case 'Setform':
          this.form = obj;// 设置 form
          break;
        case 'Setdrawer':
          this.drawer = obj;// 设置 drawer
          break;
        case 'Setdetailed':
          this.detailed = obj;// 设置 detailed
          break;
        case 'SetDetail_view':
          this.Detail_view = obj;//提供子组件使用的参数
          break;
      }
    },

    Checkbox() {
      //console.log(map)
      let map = {};
      map.Cy_Sort = true;
      map.Cy_Category = true;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(Pwd_Str)
      Commodity(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        this.cities = JSON.parse(JSON.stringify(jsonobj.Data));
        this.cityOptions = JSON.parse(JSON.stringify(jsonobj.Data));
      });
    },


    //获取二级分类
    getTowClass(map) {
      //加载 大分类
      if (window['TowClass' + map.Cy_Sort] != undefined && window['TowClass' + map.Cy_Sort] != null && window['TowClass' + map.Cy_Sort] != '') {
        this.Small_classification = window['TowClass' + map.Cy_Sort]
      } else {
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        Administration(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          window['TowClass' + map.Cy_Sort] = jsonobj.Data;
          window['TowClasschildArr' + map.child_id_sel] = window['TowClass' + map.Cy_Sort];
          // console.log(jsonobj.Data)
          this.Small_classification = window['TowClass' + map.Cy_Sort]
          this.commodity.Cy_Category = this.Small_classification[0].CODE;
        });
      }
    },


    //全选
    handleCheckAllChange(val) {
      // console.log(this.checkedCities)

      if (val) {
        let arr = [];
        for (let i = 0; i < this.cityOptions.length; i++) {
          arr.push(this.cityOptions[i].id);
        }
        this.checkedCities = arr;
      } else {
        this.checkedCities = [];
      }
      this.isIndeterminate = false;
    }
    ,
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    }
    ,
    /*获取查询参数*/
    getParams() {
      if (this.$refs.dept != undefined & this.$refs.dept != null & this.$refs.dept != 'undefined') {
        //console.log(this.$refs.dept.getCheckedKeys());
        if (this.$refs.dept.getCheckedKeys().length > 0) {
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }
      if (tools.Is_null(this.queryParams.CSE_Time) && this.selTime != null) {
        //console.log(this.selTime);
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
    },

    //查询 多选框
    selCustomerName() {
      let value = this.selName;
      let arr = [];
      if (value != null && value != '') {
        for (let i = 0; i < this.cityOptions.length; i++) {
          if (this.cityOptions[i].c_name.indexOf(value) != -1) {
            arr.push(this.cityOptions[i]);
          }
        }
      } else {
        arr = JSON.parse(JSON.stringify(this.cityOptions));
      }
      this.cities = arr;
    }
    ,

    /**编辑按钮*/
    handleUpdate(row, column, cell, event) {
      console.log(row, column, cell, event);
      event.target.innerHTML = "";
      let cellInput = document.createElement("input");
      cellInput.value = "";
      cellInput.setAttribute("type", "text");
      cellInput.style.width = "80%";
      cell.appendChild(cellInput);
      cellInput.onblur = function () {
        cell.removeChild(cellInput);
        event.target.innerHTML = cellInput.value;
      };
    }
    ,

    /**输入框正则表达式*/
    UpNumber(e) {
      e.target.value = e.target.value.replace(/^0|\D/g, "")
    }
    ,
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    }
    ,
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {};
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.selTime = null;
      this.handleQuery();
    }
    ,
    // 多选框选中数据
    handleSelectionChange(selection1) {
      this.ids1 = selection1.map(item => item.userId);
      this.single1 = selection1.length != 1;
      this.multiple1 = !selection1.length;
    }
    ,
    // 多选框选中数据
    CkglcommodityStorage(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    }
    ,
    /**返回按钮*/
    returnok() {
      this.drawer = false;
    },

    /**编辑*/
    handleAdd() {

    },


    SubAdd(map) {
      //console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      Warehousingadd(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.drawer = false;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },


    /** 商品入库信息列表 */
    getList() {

      this.loading = true;
      //console.log(this.page);
      this.getParams();
      // console.log(this.queryParams)
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      listStorage(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
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


    // 加密数据
    getPwd_Str(row) {
      let map = {};
      map.CSE_ID = row.CSE_ID;
      // console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      this.upload.Pstr = Pwd_Str;
    },


    /** 下载模板操作 */
    importTemplate() {
      let map = {};
      map.path = "/getcsv/ImportInventoryDetails.cvs";
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API + "/yunze/ExecutionTask/downloadConversion?Pstr=" + Pwd_Str, '_blank');
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    }
    ,
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },

    // 提交上传文件
    submitFileForm() {
      this.submitFileFormBtn = false;
      this.$refs.upload.submit();
    },


  }
};
</script>



