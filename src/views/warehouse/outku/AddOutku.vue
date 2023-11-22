<template>
  <div>
    <el-form :model="AddformObj" ref="queryForm" :inline="true" label-width="68px">
      <template>
        <div>
          <el-divider content-position="left"><span color="#2894FF"><h2>添加出库登记
          <el-button @click="Colse()" size="mini" type="primary" style="margin-left: 35px">关闭</el-button>
          </h2></span></el-divider>
        </div>
      </template>

      <template>
        <div>
          <el-divider>发货申请登录</el-divider>
        </div>
      </template>

      <!--时间段选择-->
      <el-form-item label="发货申请时间段选择" prop="status" label-width="150px">
        <el-date-picker
          v-model="findOddNumbersObj.SAN_Time"
          type="daterange"
          :picker-options="COTTimeOptions"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 360px"
          @change="SAN_TimeChange"
          align="right">
        </el-date-picker>
      </el-form-item>
      <!--单号 -->
      <el-form-item label="发货申请单号" prop="status" label-width="130px">
        <el-select
          v-model="findOddNumbersObj.SAN_ID"
          placeholder="选择单号"
          clearable
          size="small"
          style="width: 180px"
        >
          <el-option
            v-for="dict in OddNumbersArr"
            :key="dict.index"
            :label="dict.SAN_ID"
            :value="dict.SAN_ID"
          />
        </el-select>
      </el-form-item>
      <template>
        <el-button
          type="primary"
          @click="IdArr"
        >加载
        </el-button>
      </template>
      <template>
        <el-button
          type="primary"
          @click="CancelLoading"
        >取消加载
        </el-button>
      </template>

      <template>
        <div>
          <el-divider>出库具体信息</el-divider>
        </div>
      </template>

      <!--出库方式 -->
      <el-form-item label="出库方式" prop="status" label-width="150px">
        <el-select
          v-model="AddformObj.COT_Otid"
          placeholder="请选择出库方式"
          clearable
          size="small"
          style="width: 130px"
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
          v-model="AddformObj.COT_Use_People"
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
          v-model="AddformObj.COT_warehouseman_ID"
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
      <el-form-item label="出库日期" prop="status">
        <el-date-picker
          v-model="AddformObj.COT_Time"
          placeholder="选择日期"
          size="small"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 160px"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <br>
      <!--用途-->
      <el-form-item label="用途" prop="remarks" label-width="150px">
        <el-input v-model="AddformObj.COT_Use" type="textarea" style="width: 480px" placeholder="请输入内容"></el-input>
      </el-form-item>


      <div v-show="!show_bool">

        <template>
          <div>
            <el-divider>出库商品信息</el-divider>
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
        >选择商品
        </el-button>

        <el-table :data="CommodityList">
          <el-table-column label="分类" align="center" prop="Cy_Sort">
            <template slot-scope="scope">
              {{ tools.getkeyValue(Large_classification, scope.row.Cy_Sort, "CODE", "NAME") }}
            </template>
          </el-table-column>
          <el-table-column label="类别" align="center" prop="Cy_Category">
            <template slot-scope="scope">
              {{
                tools.getkeyValue(window['TowClass' + window['child_id_9_' + scope.row.Cy_Sort][0]], scope.row.Cy_Category, "CODE", "NAME")
              }}
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center" prop="Cy_Name"/>
          <el-table-column label="编号" align="center" prop="Cy_ModelAndNumber"/>
          <el-table-column label="单位" align="center" prop="Cy_Unit"/>
          <el-table-column label="本次出库数量" property="pricing" prop="CSDS_Storage_Quantity">
            <template slot-scope="scope">
              <el-input type=number v-model="scope.row.CSDS_Storage_Quantity" min="1" placeholder="请输入内容"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="DelAccount(scope.$index,scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <div v-show="show_bool">
        <template>
          <div>
            <el-divider>加载商品信息</el-divider>
          </div>
        </template>
        <el-table :data="deliverList">
          <el-table-column label="分类" align="center" prop="Cy_Sort">
            <template slot-scope="scope">
              {{ tools.getkeyValue(Large_classification, scope.row.Cy_Sort, "CODE", "NAME") }}
            </template>
          </el-table-column>
          <el-table-column label="类别" align="center" prop="Cy_Category">
            <template slot-scope="scope">
              {{
                tools.getkeyValue(window['TowClass' + window['child_id_9_' + scope.row.Cy_Sort][0]], scope.row.Cy_Category, "CODE", "NAME")
              }}
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center" prop="Cy_Name"/>
          <el-table-column label="编号" align="center" prop="Cy_ModelAndNumber"/>
          <el-table-column label="单位" align="center" prop="Cy_Unit"/>
          <el-table-column label="本次出库数量" align="center" prop="CSDS_Storage_Quantity"/>
        </el-table>
      </div>

      <div style="float: right;margin-right: 50px;">
        <el-button
          type="primary"
          @click="preservation"
        >保 存
        </el-button>
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
    </el-form>
  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";
import CommoditySelection from "../../yunze/common/CommoditySelection";
import {Commodity, Queryloading} from "@/api/yunze/warehouse/Inout";
import {OddNumbers} from "@/api/yunze/FHGL/FhglShippingApplication";
import {findOut} from "@/api/yunze/FHGL/FhglShippingApplication";
import {OutofWarehouse} from "@/api/yunze/warehouse/outku";

export default {
  components: {//挂载
    CommoditySelection
  },
  /*获取传值
  * 官方文档
  * https://cn.vuejs.org/v2/guide/components-props.html#%E4%BC%A0%E5%85%A5%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%80%E6%9C%89-property
  * String Number Boolean Array Object Date Function Symbol
  * */
  props: {
    findOddNumbersObj: Object, //单号 对象
    AddformObj: Object,// 新增 form 对象
    Warehouse_People: Array, //领用人
    Outof_warehouse_mode: Array,//出库方式
    Warehouse_keeper: Array, //库管员
    Large_classification: Array,// 大分类
    Small_classification: Array, // 小分类
    commodity: Object, // 商品表参数
    drawer: Boolean,//新增展示
    SubAdd: Function,//新增展示
    window: Window,//window 操作对象
  },
  data() {
    return {
      OddNumbersArr: [],//时间段筛选出的发货申请订单号
      show_bool: false, //控制 商品选择 显示
      deliver_goods_bool: false, // 控制 商品选择 显示
      //查询参数
      oddNumbersId: {
        staTime: null,
        endTime: null,
        SAN_ID: null,
        SAN_Time: null,
        Outbound_status: null,
      },
      cities: [],// 复选框 数组
      cityOptions: [],//  复选框 检索临时缓存
      innerDrawer: false, //回显展示
      checkedCities: [],//商品选择
      selTime: '',//时间选择

      ThischeckedCities: [],//当前界面 商品选择 arr
      checkAll: false,//全选按钮 绑定值
      isIndeterminate: false,//全选按钮 是否选中
      selName: '',//商品 名称检索
      tools: tools,
      CommodityList: [],// 入库商品 表格数据
      deliverList: [], // 加载单号
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
      COTTimeOptions: {
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

    };
  },
  //加载完执行的钩子
  mounted() {
    window['load_outku_addOutku'] = '1';
  },
  methods: {

    //选择商品
    LoadCommodity() {
      //清空选择
      this.FindCommodity();
    },

    //查询商品简称
    FindCommodity() {
      //console.log(this.commodity)
      let Pwd_Str = tools.encrypt(JSON.stringify(this.commodity));
      Commodity(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        this.cities = JSON.parse(JSON.stringify(jsonobj.Data));
        this.cityOptions = JSON.parse(JSON.stringify(jsonobj.Data));
        this.innerDrawer = true;
      });

    },


    changOneClass(val) {
      let child_id = window['child_id_9_' + val];
      this.getTowClass({'Cy_Sort': child_id[0], "child_id_sel": val});
    },


    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      this.$emit("update:checkedCities", this.ThischeckedCities);
    },


    //全选
    handleCheckAllChange(val) {
      // console.log(this.checkedCities)
      if (val) {
        let arr = [];
        for (let i = 0; i < this.cityOptions.length; i++) {
          arr.push(this.cityOptions[i].id);
        }
        this.ThischeckedCities = arr;
        this.$emit("update:checkedCities", arr);
      } else {
        this.ThischeckedCities = [];
        this.$emit("update:checkedCities", []);
      }
      this.isIndeterminate = false;
    },
    //查询 多选框
    selCheckboxOPtion() {

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
      //console.log(arr)
      this.$emit("update:cities", arr);
    },


    /**删除入库商品信息*/
    DelAccount(index, row) {
      // console.log(this.row)
      /*  if(row.Cy_ID!=null && row.Cy_ID!="" && row.Cy_ID>0){
          this.cardList_delArr.push(row.Cy_ID);
        }*/
      this.CommodityList.splice(index, 1);
      // console.log(this.CommodityList)
      this.msgSuccess("已删除界面缓存，需点击确认保存！");
    },


    /** 确认 载入 按钮*/
    preservationadd() {
      //清空子组件选择
      this.$refs.commoditySelection.ThischeckedCities = [];
      this.$refs.commoditySelection.checkAll = false;
      this.$refs.commoditySelection.selName = '';


      let _this = this;
      if (this.checkedCities != null && this.checkedCities.length > 0) {
        let FindArr = [];///需要去数据库查询数据的

        if (this.CommodityList != null && this.CommodityList.length > 0) {
          for (let i = 0; i < this.checkedCities.length; i++) {

            let id = this.checkedCities[i];
            let Csd_Univalent = 999999;//默认等于 数据库 单价
            let IsEx = false;
            for (let j = 0; j < this.CommodityList.length; j++) {
              let obj_j = this.CommodityList[j];
              console.log(obj_j)
              if (id == obj_j.Cy_ID) {
                let CSDS_Storage_Quantity = tools.accAdd('' + obj_j.CSDS_Storage_Quantity, '1');
                Csd_Univalent = obj_j.Csd_Univalent;//当前 单价
                obj_j.CSDS_Storage_Quantity = CSDS_Storage_Quantity;//数量
                this.CommodityList[j] = obj_j;
                IsEx = true;
                break;
              }
            }
            if (!IsEx) {
              FindArr.push(id);
            }
          }
        } else {
          FindArr = this.checkedCities;
        }

        if (FindArr.length > 0) {
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

      } else {
        tools.open(_this, "勾选商品不能为空！");
      }
    },


    //发货申请时间段选择
    SAN_TimeChange() {
      if (this.findOddNumbersObj.SAN_Time != null) {
        // console.log(this.findOddNumbersObj.SAN_Time)
        let map = {};
        map.sta_time = this.findOddNumbersObj.SAN_Time[0];
        map.end_time = this.findOddNumbersObj.SAN_Time[1];
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        //console.log(Pwd_Str);
        OddNumbers(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          // console.log(jsonobj);
          if (jsonobj.code == 200) {

            this.OddNumbersArr = jsonobj.Data;
            this.findOddNumbersObj.SAN_ID = this.OddNumbersArr[0].SAN_ID;
          } else {
            this.msgError(jsonobj.msg);
          }
        });
      }
    },

    // 关闭
    Colse() {
      this.$emit("SetObj", "Setdrawer", false);//已加载 载入合同
    },

    /**加载单号*/
    IdArr() {
      this.show_bool = true;
      if (this.findOddNumbersObj.SAN_ID != null) {
        let map = {};
        map.SAN_ID = this.findOddNumbersObj.SAN_ID;
        this.deliverList = [];
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        findOut(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          console.log(jsonobj)
          var Rmap = jsonobj.Data.SAN_Map;
          var SAN_Map = JSON.parse(JSON.stringify(Rmap));
          var SAN_Shipping_MethodArr = SAN_Map.SAN_Shipping_Method.indexOf(',') != -1 ? SAN_Map.SAN_Shipping_Method.split(",") : [SAN_Map.SAN_Shipping_Method];//获取发货方式数组

          SAN_Map.SAN_Shipping_MethodArr = SAN_Shipping_MethodArr;
          console.log(SAN_Shipping_MethodArr)

          if (jsonobj.Data.ASOY_arr != undefined && jsonobj.Data.ASOY_arr.length > 0 || jsonobj.Data.SAFDS_arr != undefined && jsonobj.Data.SAFDS_arr.length > 0) {

            for (let i = 0; i < SAN_Shipping_MethodArr.length; i++) {
              switch (SAN_Shipping_MethodArr[i]) {
                case "2": //合同发货
                  let SAFDS_arr = jsonobj.Data.SAFDS_arr;
                  console.log(SAFDS_arr)
                  for (let j = 0; j < SAFDS_arr.length; j++) {
                    let id = SAFDS_arr[j];
                    let IsEx = false;
                    for (let x = 0; x < this.deliverList.length; x++) {
                      let obj_j = this.deliverList[x];
                      console.log(obj_j)
                      if (id.Cy_ID == obj_j.Cy_ID) {
                        let CSDS_Storage_Quantity = tools.accAdd('' + obj_j.CSDS_Storage_Quantity, '1');
                        obj_j.CSDS_Storage_Quantity = CSDS_Storage_Quantity;//数量
                        this.deliverList[x] = obj_j;
                        IsEx = true;
                        break;
                      }
                    }
                    if (!IsEx) {
                      this.deliverList.push(id);
                    }
                  }
                  break;
                case "3": //普通发货
                  let ASOY_arr = jsonobj.Data.ASOY_arr;
                  console.log(ASOY_arr)
                  for (let j = 0; j < ASOY_arr.length; j++) {
                    let idArr = ASOY_arr[j];
                    let IsEx = false;
                    for (let x = 0; x < this.deliverList.length; x++) {
                      let obj_j = this.deliverList[x];
                      console.log(obj_j)
                      if (idArr.Cy_ID == obj_j.Cy_ID) {
                        let CSDS_Storage_Quantity = tools.accAdd('' + obj_j.CSDS_Storage_Quantity, '1');
                        obj_j.CSDS_Storage_Quantity = CSDS_Storage_Quantity;//数量
                        this.deliverList[x] = obj_j;
                        IsEx = true;
                        break;
                      }
                    }
                    if (!IsEx) {
                      this.deliverList.push(idArr);
                    }
                  }
                  break;
              }
            }
          } else {
            this.msgError("没有数据");
          }
        })
      }


    },
    /**取消加载*/
    CancelLoading() {
      this.show_bool = false;
      this.deliverList = [];
    },

    /**保存按钮*/
    preservation() {
      //加载触发
      let _this = this;
      if (tools.VerificationsText(_this, _this.AddformObj.COT_Otid, "出库方式不能为空！") == true &&
        tools.VerificationsText(_this, _this.AddformObj.COT_Time, "出库日期不能为空！") == true &&
        tools.VerificationsText(_this, _this.AddformObj.COT_Use_People, "领用人不能为空！") == true &&
        tools.VerificationsText(_this, _this.AddformObj.COT_warehouseman_ID, "库管员不能为空！") == true
      ) {
        let CODS_arr = this.show_bool == true ? this.deliverList : this.CommodityList;
        if (CODS_arr != null && CODS_arr.length > 0) {
          let map = {};
          map.COT_Map = this.AddformObj;
          map.CODS_arr = CODS_arr;
          map.arr = CODS_arr;
          map.SAN_ID= this.findOddNumbersObj.SAN_ID;
          console.log(map)
          this.SubAdd(map);
        } else {
          tools.open(_this, "选择出库商品！")
        }
      }

    },


  }
};
</script>















