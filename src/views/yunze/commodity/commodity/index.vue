<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

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
                @click="handleAdd"
                v-hasPermi="['yunze:CkglCommodity:add']"
              >新增
              </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" v-hasPermi="['yunze:commodity:list']" @queryTable="getList"
                           :columns="columns"></right-toolbar>
          </el-row>

        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
          <el-table-column :label="columns[0].label" align="center" key="Cy_ID" prop="Cy_ID" v-if="columns[0].visible"/>
          <el-table-column :label="columns[1].label" align="center" key="Cy_Name" prop="Cy_Name"
                           v-if="columns[1].visible"/>
          <el-table-column :label="columns[2].label" align="center" key="Cy_Sort" prop="Cy_Sort"
                           v-if="columns[2].visible">
            <template slot-scope="scope">
              {{tools.getkeyValue(Large_classification,scope.row.Cy_Sort,"CODE","NAME")}}
            </template>
          </el-table-column>
          <el-table-column :label="columns[3].label" align="center" key="Cy_Category" prop="Cy_Category"
                           v-if="columns[3].visible">
            <template slot-scope="scope">
              {{tools.getkeyValue(Small_classification,scope.row.Cy_Category,"CODE","NAME")}}
            </template>
          </el-table-column>
          <el-table-column :label="columns[4].label" align="center" key="Cy_ModelAndNumber" prop="Cy_ModelAndNumber"
                           v-if="columns[4].visible"/>
          <el-table-column :label="columns[5].label" align="center" key="Cy_Unit" prop="Cy_Unit"
                           v-if="columns[5].visible"/>
          <el-table-column :label="columns[6].label" align="center" key="Cy_PurchasePrice" prop="Cy_PurchasePrice"
                           v-if="columns[6].visible"/>
          <el-table-column :label="columns[7].label" align="center" key="Cy_LowestPrice" prop="Cy_LowestPrice"
                           v-if="columns[7].visible"/>
          <el-table-column :label="columns[8].label" align="center" key="Cy_SuggestedPrice" prop="Cy_SuggestedPrice"
                           v-if="columns[8].visible"/>
          <el-table-column :label="columns[9].label" align="center" key="Cy_Supplier" v-if="columns[9].visible"
                           :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              {{tools.getDkeyValue(CommoditySupplierArr,scope.row.Cy_Supplier)}}
            </template>
          </el-table-column>
          <el-table-column :label="columns[10].label" align="center" key="Operator" v-if="columns[10].visible"
                           :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              {{tools.getDkeyValue(CommodityOperatorArr,scope.row.Operator)}}
            </template>
          </el-table-column>
          <el-table-column :label="columns[11].label" align="center" key="publish_status" v-if="columns[11].visible"
                           :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              {{tools.getDkeyValue(commoditySellOption,scope.row.publish_status)}}
            </template>
          </el-table-column>
          <el-table-column :label="columns[12].label" align="center" key="Cy_Remarks" prop="Cy_Remarks"
                           v-if="columns[12].visible"/>

          <el-table-column :label="columns[13].label" align="center" key="create_time" prop="create_time"
                           v-if="columns[13].visible">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="columns[14].label" align="center" key="modified_time" prop="modified_time"
                           v-if="columns[14].visible">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.modified_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">

              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['yunze:CkglCommodity:upd']"
              >修改
              </el-button>

             <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="onPreview(scope.row)"
              >图片查看
              </el-button>-->

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

    <!-- 详情查看 -->

    <el-dialog :title="title" :visible.sync="show_ds" width="960px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称" >
              <el-input v-model="form.Cy_Name" placeholder="请输入 商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号" >
              <el-input v-model="form.Cy_ModelAndNumber" :disabled="disabled" placeholder="请输入 型号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" >
              <el-input v-model="form.Cy_Unit" placeholder="请输入 单位"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="进价" >
              <el-input v-model="form.Cy_PurchasePrice" @keydown.native="handleInput2"  placeholder="请输入 进价"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最低售价" >
              <el-input v-model="form.Cy_LowestPrice" @keydown.native="handleInput2" placeholder="请输入 最低售价"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="建议售价" >
              <el-input v-model="form.Cy_SuggestedPrice" @keydown.native="handleInput2" placeholder="请输入 建议售价"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <!--分类 大分类-->
            <el-form-item label="大分类" prop="status" >
              <el-select
                v-model="form.Cy_Sort"
                placeholder="请选中"
                @change="changOneClass"
                size="small"
              >
                <el-option
                  v-for="dict in Large_classification"
                  :key="dict.CODE"
                  :label="dict.NAME"
                  :value="dict.CODE"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!--类别 小分类-->
            <el-form-item label="小分类" prop="status" >
              <el-select
                v-model="form.Cy_Category"
                placeholder="请选中"
                size="small"
              >
                <el-option
                  v-for="dict in Small_classification"
                  :key="dict.CODE"
                  :label="dict.NAME"
                  :value="dict.CODE"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售卖状态" prop="cd_code">
              <el-select v-model="form.publish_status" placeholder="请选择">
                <el-option
                  v-for="item in commoditySellOption"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <!--类别 小分类-->
            <el-form-item label="供应商" prop="status" >
              <el-select
                v-model="form.Cy_Supplier"
                placeholder="请选中"
                size="small"
              >
                <el-option
                  v-for="item in CommoditySupplierArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运营商" prop="cd_code">
              <el-select v-model="form.Operator" placeholder="请选择">
                <el-option
                  v-for="item in CommodityOperatorArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="cardRouteEdie" v-hasPermi="['yunze:product:AddImg']">
           <!-- <el-form-item label="第一张为主图" label-width="150px">
              <el-radio-group>
                <label class="el-radio " v-for="(item,index) in customize_whether">
                                    <span class="el-radio__input my_checkbox__inner">
                                    <input type="radio" v-model="form.is_master"
                                           name="in_stock"
                                           @change="SelectChange()"
                                           :value="item.dictValue"/>
                                     </span>
                  <span class="el-radio__label ">{{item.dictLabel}}</span>
                </label>
              </el-radio-group>
            </el-form-item>-->
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.Cy_Remarks" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- -->
       <!-- <el-row v-if="cardRouteEdie" v-hasPermi="['yunze:product:AddImg']">
          <el-col :span="24">
            <ul class="el-upload-list__item  is-ready image-container">
              <vuedraggable>
                <li tabindex="0" class="Mylist__item-thumbnail is-ready draggable-item"
                    v-for="(image, index) in sortImages" :key="index" style=" position: relative;">
                  <img :src="image.uri" alt="" style="width:100%;" class="my_el-upload-list__item-thumbnail"
                       :preview-src-list="getImgList(index)"/>
                  <span class="My_el-upload-list__item-actions">
                          <span class="my_upload-list__item-actions">
                            <i class="el-icon-zoom-in"></i>
                          </span>
                          <span class="my_upload-list__item-actions-left">
                            <i class="el-icon-download"></i>
                          </span>
                          <span class="my_upload-list__item-actions-left">
                            <i class="el-icon-delete"></i>
                          </span>
                        </span>
                </li>
              </vuedraggable>
              <li class="Mylist__item-thumbnail">
                <el-upload
                  ref="uploadPrdImg"
                  action="#"
                  :headers="upload.headers"
                  :action="upload.url"
                  :disabled="upload.isUploading"
                  :multiple="multiple"
                  :accept="acceptConfig"
                  list-type="picture-card"
                  style="border: 1px dashed #c0ccda;"
                  :on-change="customUpload"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :data="{Pstr:this.form.Pstr}"
                  :auto-upload="false" id="MyuploadImg">
                  <div slot="file" slot-scope="{file}">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url" alt=""
                    >
                    <span
                      v-if="!disabled"
                      @click="handleRemove(file)"
                    >
                        <i class="el-icon-delete"></i>
                      </span>
                  </div>
                </el-upload>
              </li>
            </ul>
          </el-col>
        </el-row>-->


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-input v-model="form.cd_id" v-if="false"/>
        <el-button v-if="cardRouteAdd" v-hasPermi="['yunze:CkglCommodity:add']" type="primary" @click="Add">新 增</el-button>
       <!-- <el-button v-if="cardRouteEdie" v-hasPermi="['yunze:product:AddImg']" type="primary" @click="AddImg">图片新增
        </el-button>-->
        <el-button v-if="cardRouteEdie" v-hasPermi="['yunze:CkglCommodity:upd']" type="primary" @click="Edie">保 存
        </el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>





    <el-image
      v-show="false"
      ref="preview"
      class="hideImgDiv"
      :src="url"
      :preview-src-list="srcList"></el-image>

  </div>
</template>


<script>
  import {SelMap, add, edit,findData} from "@/api/yunze/commodity/commodity";
  import tools from "@/utils/yunze/tools";
  import Treeselect from "@riophae/vue-treeselect";
  import {treeselect} from "@/api/system/dept";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {getToken} from "@/utils/auth";
  import vuedraggable from 'vuedraggable';
  import $ from 'jquery';
  import {Administration} from "@/api/yunze/Dictionaries/type";


  export default {
    name: "commodity",
    components: {Treeselect, vuedraggable},
    data() {
      return {
        images: [],
        sortImages: !this.images ? [] : [].concat(this.images),
        acceptConfig: 'image/jpeg,image/png,image/jpg,image/gif',
        fileList: {},

        url: '',
        srcList: [],


        Divide_show: false,//卡划分
        Dividebtn: true,//商品代理 btn
        //商品代理企业
        treeName: undefined,
        formDivide: {
          dept_id: '',
          user_id: '',
        },


        // 导入参数
        upload: {
          // 是否显示弹出层（导入）
          open: false,
          // 弹出层标题（导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/yunze/productPic/Prdedit",
          Pstr: '',//携带参数
        },

        Is_notAdd: false,
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,

        //保存 编辑 按钮
        cardRouteAdd: false,
        cardRouteEdie: false,
        tools: tools,
        deptCheckStrictly: false,
        deptExpand: true,
        deptNodeAll: false,
        show_ds: false,//详情查看
        table_Online: [],//在线状态信息
        DeptOptions: [],// 公司信息
        customize_whether: [],//自定义是否

        mainwidth: 24,//宽度
        option_show: false, //公司所属查询
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
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
        // 用户表格数据
        cardList: null,
        // 弹出层标题
        title: "",
        // 部门树选项
        deptOptions: undefined,
        // 是否显示弹出层
        open: false,
        // 部门名称
        deptName: undefined,
        // 默认密码
        initPassword: undefined,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        typeOptions: [],
        PrdcategoryOption: [],//商品分类
        TreePrdcategoryOption: [],//商品分类 树
        //详情
        tablefrom: [],
        commoditySellOption: [],//加载 商品出售状态
        imgArr: [],//上传图片
        SelectImgArr: [],//  商品图片查看图片

        checkStateOption: [], //加载 商品出售状态
        FlowData: [],
        selIccid: [{FlowData: ''}],
        activeNames: [0],
        CommoditySupplierArr: [], //商品供应商
        CommodityOperatorArr: [],// 商品运营商
        //卡状态
        status_type: "",
        // 卡状态 字典
        stateOptions: [
          {
            dictLabel: ''
          }
        ],
        // 运营商类别 字典
        operators_type: [],
        // 通道状态 字典
        channelStatusOptions: [],
        // 通道编码 字典
        channelCodeOptions: [],
        // 大分类
        Large_classification: [],
        // 小分类
        Small_classification: [],
        // 表单参数
        form: {
          Cy_ID : null,
          Cy_Sort : null,
          Cy_Category : null,
          Cy_Name : null,
          Cy_ModelAndNumber : null,
          Cy_Unit : null,
          Cy_Remarks : null,
          Cy_PurchasePrice : null,
          Cy_LowestPrice : null,
          Cy_SuggestedPrice : null,
          Cy_Supplier : null,
          Operator : null,
          publish_status : null,
        },
        defaultProps: {
          children: "children",
          label: "label"
        },
        //当前查询参数
        sel: {
          iccid: '',
          agent_id: '',
          package_id: '',
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: null,
          value: null,
          cd_status: [],
        },
        // 列信息
        columns: [
          {key: 0, label: `编码`, visible: true},
          {key: 1, label: `名称`, visible: true},
          {key: 2, label: `大分类`, visible: true},
          {key: 3, label: `小分类`, visible: true},
          {key: 4, label: `型号`, visible: true},
          {key: 5, label: `单位`, visible: true},
          {key: 6, label: `进价`, visible: true},
          {key: 7, label: `最低售价`, visible: true},
          {key: 8, label: `建议售价`, visible: true},
          {key: 9, label: `供应商`, visible: true},
          {key: 10, label: `运营商`, visible: true},
          {key: 11, label: `状态`, visible: true},
          {key: 12, label: `备注`, visible: true},
          {key: 13, label: `创建时间`, visible: true},
          {key: 14, label: `修改时间`, visible: true},
        ],
        // 表单校验
        rules: {}
      };
    },
    watch: {},

    created() {

      //加载 自定义 是否 0 1 否 是
      if (window['customize_whether'] != undefined && window['customize_whether'] != null && window['customize_whether'] != '') {
        this.customize_whether = window['customize_whether'];
      } else {
        this.getDicts("yunze_customize_whether").then(response => {
          window['customize_whether'] = response.data;
          this.customize_whether = window['customize_whether'];
        });
      }




      //加载 查询条件
      if (window['Ccommodity_selType'] != undefined && window['Ccommodity_selType'] != null && window['Ccommodity_selType'] != '') {
        this.typeOptions = window['Ccommodity_selType'];
      } else {
        this.getDicts("yz_Ccommodity_selType").then(response => {
          window['Ccommodity_selType'] = response.data;
          this.typeOptions = window['Ccommodity_selType'];
        });
      }

      //加载 商品供应商
      if(window['CommoditySupplierArr']!=undefined &&  window['CommoditySupplierArr']!=null && window['CommoditySupplierArr']!=''){
        this.CommoditySupplierArr = window['CommoditySupplierArr'];
      }else{
        this.getDicts("yz_Commodity_supplier").then(response => {
          window['CommoditySupplierArr'] = response.data;
          this.CommoditySupplierArr = window['CommoditySupplierArr'];
        });
      }

      //加载 商品运营商
      if(window['CommodityOperatorArr']!=undefined &&  window['CommodityOperatorArr']!=null && window['CommodityOperatorArr']!=''){
        this.CommodityOperatorArr = window['CommodityOperatorArr'];
      }else{
        this.getDicts("yz_Commodity_Operator").then(response => {
          window['CommodityOperatorArr'] = response.data;
          this.CommodityOperatorArr = window['CommodityOperatorArr'];
        });
      }











      //加载 商品分类


      //加载 大分类
      if (window['Large_classification'] != undefined && window['Large_classification'] != null && window['Large_classification'] != '') {
        this.Large_classification = window['Large_classification'];
        let map = {};
        map.Cy_Sort = '9';
        this.LoadTowClass(map);
      } else {
        let map = {};
        map.Cy_Sort = '9';
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        Administration(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          window['Large_classification'] = jsonobj.Data;
          this.Large_classification = window['Large_classification'];
          /*if (this.Large_classification != null && this.Large_classification.length > 0) {
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
            }
          }*/
          this.LoadTowClass(map);
        });
      }


      //加载 商品出售状态
      if (window['commoditySellOption'] != undefined && window['commoditySellOption'] != null && window['commoditySellOption'] != '') {
        this.commoditySellOption = window['commoditySellOption'];
      } else {
        this.getDicts("yz_commodity_sell").then(response => {
          window['commoditySellOption'] = response.data;
          this.commoditySellOption = window['commoditySellOption'];
        });
      }
      //条件查询 默认选择第一个
      this.queryParams.type ='1';
      this.getTreeselect();
      this.getList();
    },
    methods: {



      LoadTowClass(map){
        if (this.Large_classification != null && this.Large_classification.length > 0) {
          let val = '';
          for (let i = 0; i < this.Large_classification.length; i++) {
            let obj = this.Large_classification[i];
            window['child_id_' + map.Cy_Sort + "_" + obj.CODE] = [];
            (window['child_id_' + map.Cy_Sort + "_" + obj.CODE]).push(obj.child_id);
            if (i == 0) {
              window['details_' + map.Cy_Sort] = obj.child_id;
            }
          }
          if (tools.Is_null(window['details_' + map.Cy_Sort])) {
            this.getTowClass({'Cy_Sort': window['details_' + map.Cy_Sort]});
          }
        }
      },











      onPreview(row) {
        this.SelectImgArr = [];
        let Name = 'PrdImg_' + row.product_id;
        //console.log(Name)
        if (window[Name] != undefined && window[Name] != null && window[Name] != '') {
          this.SelectImgArr = window[Name];
          this.$refs.preview.clickHandler();
        } else {
          this.findImg(row.product_id);
        }
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
            this.Small_classification = window['TowClass' + map.Cy_Sort]
          });
        }
      },


      findImg(product_id) {
        let map = {};
        map.product_id = product_id;
        map.pic_status = "1";
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        PrdImgfindList(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            let Arrimg = [];
            //console.log(jsonobj)
            if (jsonobj.Data.length > 0) {
              for (let i = 0; i < jsonobj.Data.length; i++) {
                let Pwd_Str = tools.encrypt(JSON.stringify({"imagePath": jsonobj.Data[i].pic_url}));
                Arrimg.push(process.env.VUE_APP_BASE_API + "/yunze/productPic/readImage?map=" + Pwd_Str);
                if (i == jsonobj.Data.length - 1) {
                  let Name = 'PrdImg_' + product_id;
                  window[Name] = Arrimg;
                  this.SelectImgArr = Arrimg;
                  this.srcList = Arrimg;
                  //调用image组件中的大图浏览图片方法
                  this.$refs.preview.clickHandler();
                }
              }
            } else {
              this.msgError("该商品暂未上传商品图片！");
            }
          } else {
            this.msgError(jsonobj.msg);
          }
        })


      },

      changOneClass(val) {
        let child_id = window['child_id_9_' + val];
        this.getTowClass({'Cy_Sort': child_id[0], "child_id_sel": val});
      },


      /**保存商品代理*/
      Divide() {
        //this.Dividebtn = false;
        let dept_id = this.$refs.dept.getCheckedKeys();
        if (dept_id.length > 0) {
          let map = {};
          map.IdArr = dept_id;
          let Pwd_Str = tools.encrypt(JSON.stringify(map));
          AgentEdit(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if (jsonobj.code == 200) {
              this.msgSuccess(jsonobj.msg);
              this.getAgentSel();
            } else {
              this.msgError(jsonobj.msg);
            }
          })
        } else {
          this.msgError("请选择售卖代理商！");
        }
      },


      SelectChange() {
        this.getPwd_Str();
      },
      // 加密数据
      getPwd_Str() {
        if (this.sortImages.length > 0) {
          let imgArr = [];
          for (let i = 0; i < this.sortImages.length; i++) {
            let obj = this.sortImages[i];
            obj.pic_order = i;
            imgArr.push(obj);
          }
          this.imgArr = imgArr;
        }
        let map = {};
        map.is_master = this.form.is_master;
        map.product_id = this.form.product_id;
        map.imgArr = this.imgArr;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        this.form.Pstr = Pwd_Str;
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
        this.Is_notAdd = true;
      },


      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.uploadPrdImg.clearFiles();
        this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
        this.submitFileFormBtn = true;
      },
      AddImg() {
        this.SelectChange();
        if (this.sortImages.length < 10) {
          let _this = this;
          if (tools.VerificationsText(_this, _this.form.is_master, "请选择 第一张是否主图！") == true &&
            tools.VerificationsText(_this, _this.form.product_id, "必要参数缺失刷新后重试！") == true) {
            this.sortImages = [];
            this.images = [];
            _this.$refs.uploadPrdImg.submit();
          }
        } else {
          this.$message.error('最多上传10张图片！');
        }
      },

      handleInput2(e) {
        // 通过正则过滤小数点后两位
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      },

      /* 操作--查看 图片预览 */
      getImgList(index) {
        let images = JSON.parse(JSON.stringify(this.sortImages));
        for (let i = 0; i < index; i++) {
          images.push(images[0]);
          images.splice(0, 1);
        }
        return images
      },


      customUpload(file) {
        if (!this.Is_notAdd) {
          const that = this;
          const isLt10M = file.size / 1024 / 1024 < 10;
          if (!isLt10M) {
            this.$message.error('上传图片大小不能超过10M');
            return false
          }
          if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(file.raw.type) === -1) {
            this.$message.error('格式为JPG、JPEG、PNG、GIF');
            return false
          }
          const name = file.name.split('.')[0];
          const type = file.name.split('.')[1];
          const copyFile = new File([file.raw], `${name}.${type}`);
          that.sortImages.push({
            uri: file.url,
            fileName: file.name,
            fileSize: file.size / 1024 / 1024
          })
          //console.log(that.sortImages);
          // this.$refs.uploadPrdImg.clearFiles();

          //延迟 清除显示 解决 自配置组件的界面显示问题
          setTimeout(function () {
            $('#MyuploadImg ul').html("");
          }, 400);
          //延迟 清除显示
          setTimeout(function () {
            $('#MyuploadImg ul').html("");
          }, 1000);
        } else {
          this.Is_notAdd = false;
        }
      },

      changeImages() {

      },
      handleRemove(file) {
        console.log(file);

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },


      MysetTreePrdcategoryOption() {
        if (this.PrdcategoryOption != null && this.PrdcategoryOption.length > 0) {
          for (let i = 0; i < this.PrdcategoryOption.length; i++) {
            let obj = this.PrdcategoryOption[i];
            let map = {};
            map.id = obj.category_id;
            map.label = obj.category_name;
            this.TreePrdcategoryOption.push(map);
          }
        }
      },


      /** 查询企业下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value, type) {
        if (type == 'dept') {
          let treeList = this.deptOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
          }
        }
      },
      // 树权限（全选/全不选）
      handleCheckedTreeNodeAll(value, type) {
        if (type == 'dept') {
          //console.log(value);
          this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
        }
      },
      // 树权限（父子联动）
      handleCheckedTreeConnect(value, type) {
        if (type == 'menu') {
          this.menuCheckStrictly = value ? true : false;
        } else if (type == 'dept') {
          this.$refs.dept.setCheckedNodes(false ? this.deptOptions : []);
          this.deptCheckStrictly = value ? true : false;

        }
      },


      /*获取查询参数*/
      getParams() {

        if (this.$refs.dept != undefined & this.$refs.dept != null & this.$refs.dept != 'undefined') {
          //console.log(this.$refs.dept.getCheckedKeys());
          if (this.$refs.dept.getCheckedKeys().length > 0) {
            this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
          }
        }

      },


      /** 查询通道列表 */
      getList() {
        this.loading = true;
        this.getParams();
        this.queryParams.page = 1;
        //console.log(this.queryParams);
        let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
        SelMap(Pwd_Str).then(response => {
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
      /*代理查询拓展*/
      agentShow() {
        let _this = this;
        _this.option_show = !_this.option_show;
        _this.mainwidth = _this.option_show ? 20 : 24;
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
      /** 新增按钮操作 */
      handleAdd() {

        this.form = {};//清空数据
        this.show_ds = true;
        this.cardRouteAdd = true;
        this.cardRouteEdie = false;
        this.disabled = false;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.form = {};//清空数据
        this.show_ds = true;
        this.cardRouteAdd = false;
        this.cardRouteEdie = true;
        this.disabled = true;
        this.finddata(row);


      },
      /** 详情按钮操作 */
      ViewDetails(row) {
        //console.log(row);
        this.cardRouteAdd = false;
        this.cardRouteEdie = false;
        this.finddata(row);
      },


      /*获取详细信息*/
      finddata(row) {
        this.form = {};//清空数据
        let map = {};
        map.Cy_ID = row.Cy_ID;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        findData(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            if (jsonobj.code == 200) {
              this.form = jsonobj.Data;
              this.form.Cy_Sort = "" + this.form.Cy_Sort;
              this.form.Cy_Category = "" + this.form.Cy_Category;
              this.form.publish_status = "" + this.form.publish_status;
              this.show_ds = true;
            } else {
              this.msgError(jsonobj.msg);
            }
            this.loading = false;

          }
        );

      },
      //新增
      Add() {
        let _this = this;
        if (tools.VerificationsText(_this, _this.form.Cy_Name, "商品名称不能为空！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_ModelAndNumber, "请填写型号！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Unit, "请填写商品单位！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Category, "请选择商品小分类！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Sort, "请选择商品大分类！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_PurchasePrice, "请填写进价！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_LowestPrice, "请填写最低售价！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_SuggestedPrice, "请填写建议售价！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Supplier, "请选择供应商！") == true &&
          tools.VerificationsText(_this, _this.form.publish_status, "请选择售卖状态！") == true) {


          let Cy_PurchasePrice = parseFloat(this.form.Cy_PurchasePrice).toFixed(2);// 进价
          let Cy_LowestPrice = parseFloat(this.form.Cy_LowestPrice).toFixed(2);// 最低售价
          let Cy_SuggestedPrice = parseFloat(this.form.Cy_SuggestedPrice).toFixed(2); // 建议售价

          this.form.Cy_PurchasePrice = Cy_PurchasePrice;
          this.form.Cy_LowestPrice = Cy_LowestPrice;
          this.form.Cy_SuggestedPrice = Cy_SuggestedPrice;

          if(Cy_PurchasePrice<=Cy_LowestPrice ){
            if(Cy_SuggestedPrice>=Cy_LowestPrice ){
              if(Cy_LowestPrice<=Cy_SuggestedPrice){


                let Pwd_Str = tools.encrypt(JSON.stringify(this.form));
                add(Pwd_Str).then(response => {
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
              }
              }else{
                this.msgError("最低售价 需小于等于 建议售价 售价！");
              }
            }else{
              this.msgError("建议售价 需大于等于 最低售价！");
            }
          }else{
            this.msgError("进价需小于最低售价！");
          }
      },
      //编辑
      Edie() {
        let _this = this;
        if (tools.VerificationsText(_this, _this.form.Cy_Name, "商品名称不能为空！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_ModelAndNumber, "请填写型号！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Unit, "请填写商品单位！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Category, "请选择商品小分类！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Sort, "请选择商品大分类！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_PurchasePrice, "请填写进价！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_LowestPrice, "请填写最低售价！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_SuggestedPrice, "请填写建议售价！") == true &&
          tools.VerificationsText(_this, _this.form.Cy_Supplier, "请选择供应商！") == true &&
          tools.VerificationsText(_this, _this.form.publish_status, "请选择售卖状态！") == true) {

          let Cy_PurchasePrice = parseFloat(this.form.Cy_PurchasePrice).toFixed(2);// 进价
          let Cy_LowestPrice = parseFloat(this.form.Cy_LowestPrice).toFixed(2);// 最低售价
          let Cy_SuggestedPrice = parseFloat(this.form.Cy_SuggestedPrice).toFixed(2); // 建议售价

          this.form.Cy_PurchasePrice = Cy_PurchasePrice;
          this.form.Cy_LowestPrice = Cy_LowestPrice;
          this.form.Cy_SuggestedPrice = Cy_SuggestedPrice;

          if(Cy_PurchasePrice<=Cy_LowestPrice ){
            if(Cy_SuggestedPrice>=Cy_LowestPrice ){
              if(Cy_LowestPrice<=Cy_SuggestedPrice){
                let Pwd_Str = tools.encrypt(JSON.stringify(_this.form));
                edit(Pwd_Str).then(response => {
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
              }
            }else{
              this.msgError("最低售价 需小于等于 建议售价 售价！");
            }
          }else{
            this.msgError("建议售价 需大于等于 最低售价！");
          }
        }else{
          this.msgError("进价需小于最低售价！");
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


  .Mylist__item-thumbnail {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
    font-size: 14px;
    color: #606266;
    line-height: 1.8;
  }


  .My_el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
  }

  .My_el-upload-list__item-actions:hover {
    opacity: 1;
  }


  .My-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }

  .my_upload-list__item-actions-left {
    margin-left: 15px;
  }

  .my_upload-list__item-actions-left, .my_upload-list__item-actions {
    display: inline-block;
    cursor: pointer;
    text-align: center;
    color: #fff;
    font-size: 20px;
    line-height: 1.8;
    margin-top: 35%;

  }

</style>

