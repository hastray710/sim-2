<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :span="mainwidth" :xs="24">

        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <!--分类 大分类-->
          <el-form-item label="大分类" prop="status" label-width="70px">
            <el-select
              v-model="queryParams.Cy_Sort"
              placeholder="请选中"
              @change="changOneClass"
              size="small"
              clearable
              style="width: 115px"
            >
              <el-option
                v-for="dict in Large_classification"
                :key="dict.CODE"
                :label="dict.NAME"
                :value="dict.CODE"
              />
            </el-select>
          </el-form-item>
          <!--类别 小分类-->
          <el-form-item label="小分类" prop="status" label-width="70px">
            <el-select
              v-model="queryParams.Cy_CategoryArr"
              placeholder="请选中"
              size="small"
              multiple
              style="width: 600px"
            >
              <el-option
                v-for="dict in Small_classification"
                :key="dict.CODE"
                :label="dict.NAME"
                :value="dict.CODE"
              />
            </el-select>
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
                  style="width: 110px;background-color: transparent;color: black;"
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
                v-hasPermi="['yunze:InventoryList:add']"
              >新增
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" v-hasPermi="['yunze:InventoryList:list']" @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>


        <el-table v-loading="loading" :data="dataList" >
          <el-table-column :label="columns[0].label"  prop="Cy_Name" v-if="columns[0].visible"  />
          <el-table-column :label="columns[1].label"  prop="Cy_ModelAndNumber" v-if="columns[1].visible"  />
          <el-table-column :label="columns[2].label"  prop="Cy_Unit" v-if="columns[2].visible"  />
          <el-table-column :label="columns[3].label"  prop="CSK_Stock_Quantity" v-if="columns[3].visible"  />
          <el-table-column label="操作" align="center" width="90" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-dropdown >
                <el-button type="primary"  size="small" >
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item  v-hasPermi="['yunze:InventoryList:upd']"   @click.native="Edit(scope.row)">手动编辑库存</el-dropdown-item>
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

      </el-col>
    </el-row>


    <!-- 手动编辑库存 -->
    <el-dialog title="手动编辑库存" :visible.sync="ds_Show" width="660px" append-to-body>
      <el-form ref="form" :model="AddformObj"  label-width="180px">
        <el-row>
          <el-form-item label="库存数量：" >
            <el-input v-model="AddformObj.CSK_Stock_Quantity" type="number"  min="1"  @blur="formatQuantity()" @keyup.native="tools.handleInput2"   placeholder="请输入库存数量" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button   v-hasPermi="['yunze:InventoryList:upd']"  type="primary" @click="EdidUp">保 存</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>

import { findlist,updInfo} from "@/api/yunze/warehouse/InventoryList";
import tools from "@/utils/yunze/tools";
import { Administration} from "@/api/yunze/Dictionaries/type";



export default {

  name: "InventoryList",
  data() {
    return {

      // 查询参数
      queryParams: {
        Cy_Sort:null,
        Cy_CategoryArr:[],
        value:null,
        type:null,
      },
      ds_Show:false,//手动编辑显示
      tools:tools,
      typeOptions:[],//查询条件类型
      mainwidth:24,//宽度
      //分页
      page :{
        pageNum: 1,
        pageSize: 10,
      },
      // 新增 form 对象
      AddformObj: {
        CSK_Stock_Quantity: '1',
        CSK_ID: null,
      },
      Large_classification: [],// 大分类
      Small_classification: [], // 小分类
      selTime:'',//时间选择
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 显示搜索条件
      showSearch: false,
      // 列信息
      columns: [
        { key: 0, label: `名称`, visible: true },
        { key: 1, label: `型号`, visible: true },
        { key: 2, label: `单位`, visible: true },
        { key: 3, label: `数量`, visible: true },
      ],
    };
  },

  created() {

    //加载 查询条件
    if(window['CustomerInquiries_selType']!=undefined &&  window['CustomerInquiries_selType']!=null && window['CustomerInquiries_selType']!=''){
      this.typeOptions = window['CustomerInquiries_selType'];
    }else{
      this.getDicts("yunze_CustomerInquiries_selType").then(response => {
        window['CustomerInquiries_selType'] = response.data;
        this.typeOptions = window['CustomerInquiries_selType'];
      });
    }

    //加载 大分类
    if(window['Large_classification']!=undefined &&  window['Large_classification']!=null && window['Large_classification']!=''){
      this.Large_classification = window['Large_classification'];
      let map ={};
      map.Cy_Sort = '9';
      if(tools.Is_null(window['details_'+map.Cy_Sort])){
        this.getTowClass({'Cy_Sort':window['details_'+map.Cy_Sort]});
      }
    }else{
      let map ={};
      map.Cy_Sort = '9';
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      Administration(Pwd_Str).then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        window['Large_classification'] = jsonobj.Data;
        this.Large_classification = window['Large_classification'];
        if(this.Large_classification!=null && this.Large_classification.length>0){
          let val = '';
          for (let i = 0; i < this.Large_classification.length; i++) {
            let obj = this.Large_classification[i];
            // console.log(obj)
            window['child_id_'+map.Cy_Sort+"_"+obj.CODE] = [];
            (window['child_id_'+map.Cy_Sort+"_"+obj.CODE]).push(obj.child_id);
            if(i==0){
              window['details_'+map.Cy_Sort]= obj.child_id;
            }
          }
          if(tools.Is_null(window['details_'+map.Cy_Sort])){
            this.getTowClass({'Cy_Sort':window['details_'+map.Cy_Sort]});
          }
        }
      });
    }

    //条件查询 默认选择第一个
    this.queryParams.type = '1';

    this.getList();
  },
  methods: {

//商品一级分类 切换加载
    changOneClass(val){
      if(tools.Is_null(val)){
        let child_id = window['child_id_9_'+val];
        this.getTowClass({'Cy_Sort':child_id[0],"child_id_sel":val});
      }

    },


    //获取二级分类
    getTowClass(map){
      // console.log(map)
      //加载 大分类
      if(window['TowClass'+map.Cy_Sort]!=undefined &&  window['TowClass'+map.Cy_Sort]!=null && window['TowClass'+map.Cy_Sort]!=''){
        this.Small_classification = window['TowClass'+map.Cy_Sort];
      }else{
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        Administration(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          window['TowClass'+map.Cy_Sort] = jsonobj.Data;
          window['TowClasschildArr'+map.child_id_sel] = window['TowClass'+map.Cy_Sort];
          //console.log(jsonobj.Data)
          this.Small_classification = window['TowClass'+map.Cy_Sort]
        });
      }
    },

    //格式化
    formatQuantity(){

      let  CSK_Stock_Quantity = this.AddformObj.CSK_Stock_Quantity;

      if(tools.Is_null(CSK_Stock_Quantity)){
        CSK_Stock_Quantity = Number(CSK_Stock_Quantity);
        if(CSK_Stock_Quantity<0){
          CSK_Stock_Quantity = 0;
          this.msgError("库存数量不能小于0！已自动格式化 为 0！");
        }
      }else{
        CSK_Stock_Quantity = 0;
        this.msgError("库存数量不能为空！已自动格式化 为 0！");
      }
      this.AddformObj.CSK_Stock_Quantity = CSK_Stock_Quantity;
    },


    /**编辑按钮*/
    Edit(row){
      console.log(row);
      this.AddformObj = row;
      this.ds_Show = true;
    },

    //编辑提交
    EdidUp(){
      let _this = this;
      this.AddformObj.CSK_Stock_Quantity =  Number(this.AddformObj.CSK_Stock_Quantity);
      if (
        tools.VerificationsText(_this, _this.AddformObj.CSK_ID, "必要参数缺失，请刷新后重试！！") == true &&
        tools.VerificationsText(_this, _this.AddformObj.CSK_Stock_Quantity, "库存数量不能为空！") == true){
          this.SubEdit(this.AddformObj);
      }
    },



      /** 搜索按钮操作 */
      handleQuery() {
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

    SubEdit(map){
      //console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      updInfo(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.ds_Show = false;
          this.dataList = [];//清空数据
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
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      findlist(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          if(jsonobj.code==200){
            this.dataList = jsonobj.Data.Data;
            this.total = jsonobj.Data.Pu.rowCount;
          }else{
            this.msgError(jsonobj.msg);
          }
          this.loading = false;
        }
      );
    },






  }
};
</script>



