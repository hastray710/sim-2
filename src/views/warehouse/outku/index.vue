<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24" >
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <!--出库方式-->
          <el-form-item label="出库方式" prop="status" label-width="70px">
            <el-select
              v-model="queryParams.COT_Otid"
              placeholder="请选中"
              clearable
              size="small"
              style="width: 115px"
            >
              <el-option
                v-for="dict in Outof_warehouse_mode"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!--领用人-->
          <el-form-item label="领用人" prop="status" label-width="70px">
            <el-select
              v-model="queryParams.COT_Use_People"
              placeholder="请选中"
              clearable
              size="small"
              style="width: 115px"
            >
              <el-option
                v-for="dict in Warehouse_People"
                :key="dict.user_id"
                :label="dict.nick_name"
                :value="dict.user_id"
              />
            </el-select>
          </el-form-item>
          <!--库管员-->
          <el-form-item label="库管员" prop="status" label-width="70px">
            <el-select
              v-model="queryParams.COT_warehouseman_ID"
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
              v-model="queryParams.COT_Time"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in type_COT_Time"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item >
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
                      v-for="dict in yz_outpu_type"
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
                ref="navDrawer"
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="AddOpen"
                @select="menuActive"
                v-hasPermi="['yunze:output:outofWarehouse']"
              >新增
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch"  @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>



        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">

          <el-table-column   label="出库方式" align="center" key="COT_Otid" prop="COT_Otid" v-if="columns[0].visible">
            <template slot-scope="scope">
              {{tools.getDkeyValue(Outof_warehouse_mode,scope.row.COT_Otid)}}
            </template>
          </el-table-column>
          <el-table-column   label="出库日期" align="center"  prop="COT_Time" v-if="columns[1].visible" />
          <el-table-column   label="用途" align="center"  prop="COT_Uses" v-if="columns[2].visible" />
          <el-table-column   label="领用人" align="center"  prop="COT_Use_People" v-if="columns[3].visible" >
            <template slot-scope="scope">
              {{tools.getkeyValue(Warehouse_People,scope.row.COT_Use_People,"user_id","nick_name")}}
            </template>
          </el-table-column>
          <el-table-column   label="库管员" align="center"  prop="COT_warehouseman_ID" v-if="columns[4].visible">
            <template slot-scope="scope">
              {{tools.getkeyValue(Warehouse_keeper,scope.row.COT_warehouseman_ID,"user_id","nick_name")}}
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

        <el-drawer
          :visible.sync="drawer"
          :with-header="false"
          size="92%">

          <!-- 子 组件-->
          <AddOutku ref="addOutku"
                    :findOddNumbersObj="findOddNumbersObj"
                    :AddformObj="AddformObj"
                    :Warehouse_keeper="Warehouse_keeper"
                    :Warehouse_People="Warehouse_People"
                    :Outof_warehouse_mode="Outof_warehouse_mode"
                    :Large_classification="Large_classification"
                    :Small_classification="Small_classification"
                    :commodity="commodity"
                    :drawer="drawer"
                    @SetObj="SetObj"
                    :SubAdd="SubAdd"
                    :window="window"
          />
        </el-drawer>

      </el-col>
    </el-row>


  </div>
</template>

<script>
import {listOutku, OutofWarehouse} from "@/api/yunze/warehouse/outku";
import tools from "@/utils/yunze/tools";
import AddOutku from "./AddOutku";
import {findSalesPartner} from "@/api/yunze/XSGL/customer/customer";
import {Administration} from "@/api/yunze/Dictionaries/type";
import {Commodity} from "@/api/yunze/warehouse/Inout";
export default {
  components:{//挂载
    AddOutku,
  },
  name: "account",
  data() {
    return {
      window: window,
      // 遮罩层
      loading: true,
      tools: tools,
      drawer: false,//新增展示
      Warehouse_People: [],//领用人
      //抄送任务id 名字
      NameAddCcUrl: [],
      // 商品表参数
      commodity: {
        Cy_Sort: null,
        Cy_Category: null,
      },
      Large_classification: [],// 大分类
      Small_classification: [], // 小分类
      selTime:'',//时间选择
      mainwidth:24,//宽度
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      yz_outpu_type: [],//条件选择
      Outof_warehouse_mode: [],//出库方式
      // 总条数
      total: 0,
      ids: [], // 选中数组
      // 用户表格数据
      cardList: null,
      // 是否显示弹出层
      open: false,
      //时间类型
      type_COT_Time:[],
      // 表单参数
      form: {},
      HeadquartersnOrmalOption: [], //  总部门所有人 【状态正常 】
      Warehouse_keeper: [], //库管员
      // 查询参数
      queryParams: {
        staTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        COT_warehouseman_ID: null,
        COT_Time: null,
        COT_Use_People: null,
        COT_Otid: null,
        Cy_Sort: null,
      },
      //新增 form 对象
      AddformObj: {
        staTime: null,
        endTime: null,
        COT_warehouseman_ID: null,
        COT_Time: tools.gitData(),
        COT_Use_People: null,
        COT_Otid: '1',
        Cy_Sort: null,
        COT_Use: null,
      },
      //新增
      findOddNumbersObj: {
        SAN_ID: null,
        SAN_Time: null,
      },
      // 列信息
      columns: [
        { key: 1, label: `出库方式`, visible: true },
        { key: 2, label: `出库日期`, visible: true },
        { key: 3, label: `用途`, visible: true },
        { key: 4, label: `领用人`, visible: true },
        { key: 5, label: `库管员`, visible: true },

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
      rules: {

      }
    };
  },

  created() {
    this.getList();

    //加载 查询条件
    if(window['yz_outpu_type']!=undefined &&  window['yz_outpu_type']!=null && window['yz_outpu_type']!=''){
      this.yz_outpu_type = window['yz_outpu_type'];
    }else{
      this.getDicts("yz_outpu_type").then(response => {
        window['yz_outpu_type'] = response.data;
        this.yz_outpu_type = window['yz_outpu_type'];
      });
    }

    //加载 时间选择
    if(window['type_COT_Time']!=undefined &&  window['type_COT_Time']!=null && window['type_COT_Time']!=''){
      this.type_COT_Time = window['type_COT_Time'];
    }else{
      this.getDicts("type_COT_Time").then(response => {
        console.log(response.data)
        window['type_COT_Time'] = response.data;
        this.type_COT_Time = window['type_COT_Time'];
      });
    }

    //加载 出库方式
    if(window['Outof_warehouse_mode']!=undefined &&  window['Outof_warehouse_mode']!=null && window['Outof_warehouse_mode']!=''){
      this.Outof_warehouse_mode = window['Outof_warehouse_mode'];
    }else{
      this.getDicts("Outof_warehouse_mode").then(response => {
        window['Outof_warehouse_mode'] = response.data;
        this.Outof_warehouse_mode = window['Outof_warehouse_mode'];
      });
    }

    //加载  总部门所有人
    if(window['HeadquartersOption']!=undefined &&  window['HeadquartersOption']!=null && window['HeadquartersOption']!=''){
      this.HeadquartersOption = window['HeadquartersOption'];
      this.SetHeadquartersOption();
    }else{
      let map = {};
      map.isdept_id = 100;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findSalesPartner(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          window['HeadquartersOption'] = jsonobj.Data;
          this.HeadquartersOption = window['HeadquartersOption'];
          this.SetHeadquartersOption();
        }else{
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

    //条件查询 默认选择第一个
    // this.queryParams.type = '1';
    this.Checkbox();
    this.getList();
  },
  methods: {

    AddOpen(){
      //只有当子组件加载过了之后才执行 重置数据
      if(window['load_outku_addOutku']!=undefined && window['load_outku_addOutku']!=null){
        this.findOddNumbersObj= {
          SAN_ID: null,
          SAN_Time: null,
        };
        console.log("重置数据");
        this.$refs.addOutku.CommodityList = [];
        this.$refs.addOutku.deliverList = [];
      }
      this.drawer = true;
    },



    menuActive(){
      this.$refs.navDrawer.closeDrawer()
    } ,

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

    //设置  选项
    SetHeadquartersOption()
    {
      if (this.HeadquartersOption != null && this.HeadquartersOption.length > 0) {
        this.HeadquartersnOrmalOption = [];
        let username = tools.getCookie("username");

        for (let i = 0; i < this.HeadquartersOption.length; i++) {
          let Obj = this.HeadquartersOption[i];
          if (Obj.del_flag == '0' && Obj.status == '0') {//获取 未删除的 状态正常的
            this.HeadquartersnOrmalOption.push(Obj);
            //选中当前登录用户信息
            if (Obj.user_name == username) {
              this.AddformObj.COT_warehouseman_ID = Obj.user_id;
              this.AddformObj.COT_Use_People = Obj.user_id;
            }
          }
        }
        //加载 领用人
        window['Warehouse_People'] = this.HeadquartersnOrmalOption;
        this.Warehouse_People = window['Warehouse_People'];
        //加载 库官员
        window['Warehouse_keeper'] = this.HeadquartersnOrmalOption;
        this.Warehouse_keeper = window['Warehouse_keeper'];
      }
    },

    //设置数据
    SetObj(Key, obj){
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
      }
    },
    SubAdd(map) {

      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      OutofWarehouse(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.drawer = false;
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
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


    /*获取查询参数*/
    getParams(){

      if(this.$refs.dept!=undefined & this.$refs.dept!=null & this.$refs.dept!='undefined' ){
        //console.log(this.$refs.dept.getCheckedKeys());
        if(this.$refs.dept.getCheckedKeys().length>0){
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }
      if(tools.Is_null(this.queryParams.COT_Time) && this.selTime !=null){
        console.log(this.selTime);
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 查询执行任务列表 */
    getList() {
      this.loading = true;
      this.getParams();
      console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      listOutku(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if(jsonobj.code==200){
            this.cardList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
          }else{
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
      this.queryParams.pageNum= 1;
      this.queryParams.pageSize= 10;
      this.selTime = null;
      this.handleQuery();
    },



  }
};
</script>

<style>

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

