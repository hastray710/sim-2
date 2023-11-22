<template>
      <div >


        <el-form :model="AddformObj" ref="queryForm" :inline="true"  label-width="68px">
          <template>
            <div>
              <el-divider content-position="left"><span color="#2894FF"><h2>添加入库登记
                <el-button @click="Colse()" size="mini" type="primary" style="margin-left: 35px">关闭</el-button>
              </h2></span></el-divider>
            </div>
          </template>
          <template>
            <div>
              <el-divider>入库具体信息</el-divider>
            </div>
          </template>

          <!--入库源 -->
          <el-form-item label="入库源" prop="status" label-width="150px">
            <el-select
              v-model="AddformObj.CSE_Stid"
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
              v-model="AddformObj.CSE_Manager_ID"
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
              v-model="AddformObj.CSE_warehouseman_ID"
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
          <el-form-item label="入库日期" prop="status">
            <el-date-picker
              v-model="AddformObj.CSE_Time"
              placeholder="选择日期"
              size="small"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <br>
          <!--概述-->
          <el-form-item label="概述" prop="remarks" label-width="150px">
            <el-input v-model="AddformObj.CSE_Overview" type="textarea" style="width: 480px" placeholder="请输入内容"></el-input>
          </el-form-item>
          <!--入库商品信息-->
          <template>
            <div>
              <el-divider>入库商品信息</el-divider>
            </div>
          </template>
          <!--分类 大分类-->
          <el-form-item label="大分类" prop="status" label-width="70px">
            <el-select
              v-model="commodity.Cy_Sort"
              placeholder="请选中"
              @change="changOneClass"
              size="small"
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
              v-model="commodity.Cy_Category"
              placeholder="请选中"
              size="small"
              style="width: 115px"
            >
              <el-option
                v-for="dict in Small_classification"
                :key="dict.CODE"
                :label="dict.NAME"
                :value="dict.CODE"
              />
            </el-select>
          </el-form-item>
          <!--加载入库商品-->
          <el-button @click="LoadCommodity"
                     type="success"
                     size="small"
                     plain
          >加载入库商品</el-button>

        </el-form>
        <el-table  :data="CommodityList" >

          <el-table-column   label="分类" align="center"  prop="Cy_Sort"  >
            <template slot-scope="scope">
              {{tools.getkeyValue(Large_classification,scope.row.Cy_Sort,"CODE","NAME")}}
            </template>
          </el-table-column>
          <el-table-column   label="类别" align="center"  prop="Cy_Category" >
            <template slot-scope="scope">
              {{tools.getkeyValue(window['TowClass'+window['child_id_9_'+scope.row.Cy_Sort][0]],scope.row.Cy_Category,"CODE","NAME")}}
            </template>
          </el-table-column>
          <el-table-column   label="商品名称" align="center"  prop="Cy_Name" />
          <el-table-column   label="编号" align="center"  prop="Cy_ModelAndNumber" />
          <el-table-column   label="单位" align="center"  prop="Cy_Unit" />
          <el-table-column   label="建议售价" align="center"  prop="Cy_SuggestedPrice" />
          <el-table-column   label="供应商" align="center"  prop="Cy_Supplier" />
          <el-table-column   label="运营商" align="center"  prop="Operator" />
          <el-table-column   label="本次入库数量" property="pricing"  prop="CSDS_Storage_Quantity" >
            <template slot-scope="scope">
              <el-input type=number v-model="scope.row.CSDS_Storage_Quantity" min="1" placeholder="请输入内容" ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  class-name="small-padding fixed-width" >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="DelAccount(scope.$index,scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div style="float: right;margin-right: 50px;">
          <el-button
            type="primary"
            @click="preservation"
          >保 存</el-button>
        </div>


        <!--加载入库商品 -->
        <el-drawer
          size="80%"
          :append-to-body="true"
          :visible.sync="innerDrawer">
          <el-row>
            <el-col :span="24">
              <!--商品选择组件-->
              <CommoditySelection ref="commoditySelection"
                                  :checkedCities.sync="checkedCities"
                                  :innerDrawer="innerDrawer"
                                  :preservationadd="preservationadd"
                                  :cities.sync="cities"
                                  :cityOptions="cityOptions"
              />
            </el-col>
          </el-row>
        </el-drawer>



      </div>
</template>

<script>
  import tools from "@/utils/yunze/tools";
  import CommoditySelection from "../../yunze/common/CommoditySelection";
  import { Commodity,Queryloading} from "@/api/yunze/warehouse/Inout";



  export default {
    components:{//挂载
      CommoditySelection
    },
    /*获取传值
    * 官方文档
    * https://cn.vuejs.org/v2/guide/components-props.html#%E4%BC%A0%E5%85%A5%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%80%E6%9C%89-property
    * String Number Boolean Array Object Date Function Symbol
    * */
    props: {
      AddformObj: Object,// 新增 form 对象
      Warehousing_source: Array, //入库源
      Handler: Array,//经办人
      Warehouse_keeper: Array, //库管员
      Large_classification: Array,// 大分类
      Small_classification: Array, // 小分类
      commodity: Object, // 商品表参数
      drawer: Boolean,//新增展示
      SubAdd: Function,//新增展示
      window:Window,//window 操作对象
    },
    data() {
      return {

        cities: [],// 复选框 数组
        cityOptions: [],//  复选框 检索临时缓存
        innerDrawer: false, //回显展示
        checkedCities: [],//商品选择
        selTime:'',//时间选择

        ThischeckedCities:[],//当前界面 商品选择 arr
        checkAll: false,//全选按钮 绑定值
        isIndeterminate: false,//全选按钮 是否选中
        selName: '',//商品 名称检索
        tools:tools,
        CommodityList: [],// 入库商品 表格数据
        cardList_delArr: [],

        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', tools.gitData());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', tools.getBeforeDate(1));
            }
          }, {
            text: '一周前',
            onClick(picker) {
              picker.$emit('pick', tools.getBeforeDate(7));
            }
          }]
        },

      };
    },
    methods: {


      //选择商品
      LoadCommodity(){
        //清空选择
        this.FindCommodity();
      },

      //查询商品简称
      FindCommodity(){
        //console.log(this.commodity)
        let Pwd_Str = tools.encrypt(JSON.stringify(this.commodity));
        Commodity(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          this.cities = JSON.parse(JSON.stringify(jsonobj.Data));
          this.cityOptions = JSON.parse(JSON.stringify(jsonobj.Data));
          this.innerDrawer = true;
        });

      },


      changOneClass(val){
        let child_id = window['child_id_9_'+val];
        this.getTowClass({'Cy_Sort':child_id[0],"child_id_sel":val});
      },



      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        this.$emit("update:checkedCities",this.ThischeckedCities);
      },


      //全选
      handleCheckAllChange(val) {
        // console.log(this.checkedCities)
        if(val){
          let arr = [];
          for (let i = 0; i < this.cityOptions.length; i++) {
            arr.push(this.cityOptions[i].id);
          }
          this.ThischeckedCities = arr;
          this.$emit("update:checkedCities",arr);
        }else{
          this.ThischeckedCities =  [];
          this.$emit("update:checkedCities",[]);
        }
        this.isIndeterminate = false;
      },
      //查询 多选框
      selCheckboxOPtion(){

        let value = this.selName;
        let arr = [];
        if(value!=null && value!=''){
          for (let i = 0; i < this.cityOptions.length; i++) {
            if(this.cityOptions[i].c_name.indexOf(value)!=-1){
              arr.push(this.cityOptions[i]);
            }
          }
        }else{
          arr = JSON.parse(JSON.stringify(this.cityOptions));
        }
        //console.log(arr)
        this.$emit("update:cities",arr);
      },



      /**删除入库商品信息*/
      DelAccount(index,row){
        console.log(this.row)
        /*  if(row.Cy_ID!=null && row.Cy_ID!="" && row.Cy_ID>0){
            this.cardList_delArr.push(row.Cy_ID);
          }*/
        this.CommodityList.splice(index,1);
        console.log(this.CommodityList)
        this.msgSuccess("已删除界面缓存，需点击确认保存！");
      },


      /**入库保存按钮*/
      preservationadd(){
        //清空子组件选择
        this.$refs.commoditySelection.ThischeckedCities = [];
        this.$refs.commoditySelection.checkAll = false;
        this.$refs.commoditySelection.selName = '';

        let _this = this;
        if(this.checkedCities != null && this.checkedCities.length>0){
          let FindArr = [];///需要去数据库查询数据的
          //表格中还没有数据的时候直接去查询
          console.log(this.CommodityList)
          console.log(this.checkedCities)
          if(this.CommodityList!=null && this.CommodityList.length>0){
            for (let i = 0; i < this.checkedCities.length; i++) {
              let id = this.checkedCities[i];
              let Csd_Univalent = 999999;//默认等于 数据库 单价
              let IsEx = false;
              for (let j = 0; j < this.CommodityList.length; j++) {
                let obj_j = this.CommodityList[j];
                console.log(obj_j)
                if(id==obj_j.Cy_ID){
                  let CSDS_Storage_Quantity = tools.accAdd(''+obj_j.CSDS_Storage_Quantity,'1');
                  Csd_Univalent = obj_j.Csd_Univalent;//当前 单价
                  obj_j.CSDS_Storage_Quantity = CSDS_Storage_Quantity;//数量
                  this.CommodityList[j] = obj_j;
                  IsEx = true;
                  break;
                }
              }
              if(!IsEx){
                FindArr.push(id);
              }
            }
          }else{
            FindArr = this.checkedCities;
          }

          if(FindArr.length>0) {
            let map = {};
            map.idarr = FindArr;
            let Pwd_Str = tools.encrypt(JSON.stringify(map));
            // console.log(Pwd_Str);
            Queryloading(Pwd_Str).then(response => {
              let jsonobj = JSON.parse(tools.Decrypt(response));
              //console.log(jsonobj);
              if (jsonobj.code == 200) {
                // this.cardList = jsonobj.Data;
                let Arr = [];
                if (this.CommodityList.length > 0) {
                  for (let i = 0; i < jsonobj.Data.length; i++) {
                    let obj = jsonobj.Data[i];
                    let CSDS_Storage_Quantity = 1;
                    for (let j = 0; j < this.CommodityList.length; j++) {
                      let obj_j = this.CommodityList[j];
                      if (obj.Cy_ID == obj_j.Cy_ID) {
                        // console.log(obj_j.CSDS_Storage_Quantity)
                        CSDS_Storage_Quantity = tools.accAdd('' + obj_j.CSDS_Storage_Quantity, '1');
                      }
                    }
                    obj.CSDS_Storage_Quantity = CSDS_Storage_Quantity;
                    Arr.push(obj);
                  }
                } else {
                  for (let i = 0; i < jsonobj.Data.length; i++) {
                    let obj = jsonobj.Data[i];
                    obj.CSDS_Storage_Quantity = 1;
                    Arr.push(obj);
                  }
                }
                this.CommodityList.push(...JSON.parse(JSON.stringify(Arr)));
                this.cardList_delArr.push(...JSON.parse(JSON.stringify(Arr)));

              } else {
                this.msgError(jsonobj.msg);
              }
            });

          }
          this.innerDrawer = false;
          this.loading = false;
          this.checkAll = [];//清空数据
          this.checkedCities = [];//清空数据

        }else {
          tools.open(_this,"勾选商品不能为空！");
        }
      },

      // 关闭
      Colse(){
        this.$emit("SetObj","Setdrawer",false);//已加载 载入合同
      },


      /**保存按钮*/
      preservation(){
        let _this = this;
        console.log(_this.AddformObj.CSE_Time)
        if(tools.VerificationsText(_this, _this.AddformObj.CSE_Stid, "入库源不能为空！") == true &&
          tools.VerificationsText(_this, _this.AddformObj.CSE_Time, "入库日期不能为空！") == true &&
          tools.VerificationsText(_this, _this.AddformObj.CSE_Manager_ID, "经办人不能为空！") == true &&
          tools.VerificationsText(_this, _this.AddformObj.CSE_warehouseman_ID, "库管员不能为空！") == true
        ){
          let map = {};
          map.CMap = this.AddformObj;
          map.CatArrs = this.CommodityList;
          //map.Cy_ID = this.CommodityList;
          this.SubAdd(map);
        }
      },


    }
  };
</script>
