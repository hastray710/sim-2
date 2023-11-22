<template>
  <div >
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24" >
        <el-form :model="AddformObj" ref="queryForm" :inline="true"  label-width="68px">
          <template>
            <div>
              <el-divider content-position="left"><span color="#2894FF"><h2>详情查看
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
              disabled="disabled"
              class="input"
              clearable
              size="small"
              style="width: 130px;"
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
              disabled="disabled"
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
              class="select"
              disabled="disabled"
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
            <el-input v-model="AddformObj.CSE_Time"  readonly="readonly"  style="width: 120px"></el-input>
          </el-form-item>
          <br>
          <!--概述-->
          <el-form-item label="概述" prop="remarks" label-width="150px">
            <el-input v-model="AddformObj.CSE_Overview"  readonly="readonly" type="textarea" style="width: 480px" placeholder="请输入内容"></el-input>
          </el-form-item>
          <!--入库商品信息-->
          <template>
            <div>
              <el-divider>入库商品信息</el-divider>
            </div>
          </template>

        </el-form>
        <el-table  :data="CommodityList" >
          <el-table-column   label="CSDS_ID" align="center"  prop="CSDS_ID" />
          <el-table-column   label="分类" align="center"  prop="Cy_Sort">
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
          <el-table-column   label="本次入库数量"   prop="CSDS_Storage_Quantity"/>
          <el-table-column   label="上传文件地址" align="center" prop="CSDS_URL">
            <template slot-scope="scope">
              <el-button type="text" @click="ArrListObj(scope.row)">地址内容</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  class-name="small-padding fixed-width" >
            <template slot-scope="scope">
              <el-dropdown>
                <el-button type="primary" size="small">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="ImportAccount(scope.row)"
                                    v-hasPermi="['yunze:Warehousing:importData']">
                    上传文件地址
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link :to="'/warehouse/Inventorydetails/'+ scope.row.Cy_ID" class="link-type">
                      <span>库存明细</span>
                    </router-link>
                  </el-dropdown-item>

                </el-dropdown-menu>

              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <!-- 导入对话框 -->
        <el-dialog :modal-append-to-body="false"  :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
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

        <el-dialog :modal-append-to-body="false"  :title="title" :visible.sync="open" width="500px" append-to-body>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入内容"
            v-model="textarea1">
          </el-input>
        </el-dialog>

        <!-- 编辑 详情查看 触发函数-->
        <span v-if="detailed ==true && Detail_view == false">
          {{ DetailData() }}
        </span>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";
import {DetailedID} from "@/api/yunze/warehouse/Inout";
import {getToken} from "@/utils/auth";
export default {
  components:{//挂载

  },
  name: "DetailedObj",
  /*获取传值
  * 官方文档
  * https://cn.vuejs.org/v2/guide/components-props.html#%E4%BC%A0%E5%85%A5%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%80%E6%9C%89-property
  * String Number Boolean Array Object Date Function Symbol
  * */
  props: {
    SetObj: Function,//父组件赋值 函数
    detailed: Boolean, //加载详情
    Detail_view: Boolean, //提供子组件使用的参数
    AddformObj: Object,// 新增 form 对象
    Warehousing_source: Array, //入库源
    Large_classification: Array,
    Small_classification: Array,
    Handler: Array,//经办人
    Warehouse_keeper: Array, //库管员
    window: Window,//window 操作对象
  },
  data() {
    return {
      selTime:'',//时间选择
      tools:tools,
      CommodityList: [],// 入库商品 表格数据
      textarea1:'',
      open: false,
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
      title: "",
      mainwidth:24,
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
        url: process.env.VUE_APP_BASE_API + "/yunze/Warehousing/importData",
        Pstr: '',//携带参数
      },
      submitFileFormBtn: true,

    };
  },
  created() {



  },

  methods: {

    DetailData(row){
      this.$emit("SetObj", "SetDetail_view", true);
      let map ={};
      map.CSE_ID = this.AddformObj.CSE_ID;
      console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      DetailedID(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            this.CommodityList = jsonobj.Data;
          } else {
            this.msgError(jsonobj.msg);
          }
        }
      );
    },


    ArrListObj(row){
      if(row.CSDS_URL != null && row.CSDS_URL != ''){
        // console.log(row.CSDS_URL)
        this.title ="上传文件地址";
        this.open = true;
        this.textarea1 = row.CSDS_URL;
        // console.log(row.CSDS_URL)
      }else {
        this.msgError("还没有上传的数据");
      }
    },

    /**文件上传*/
    ImportAccount(row){
      this.getPwd_Str(row);
      this.upload.title = "地址导入";
      this.upload.open = true;
    },
    // 加密数据
    getPwd_Str(row) {
      // console.log(row)
      let map = {};
      map.CSDS_ID = row.CSDS_ID;
      map.Cy_ID = row.Cy_ID;
      // console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      this.upload.Pstr = Pwd_Str;
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },

    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
      this.submitFileFormBtn = true;
      this.DetailData();
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
    // 提交上传文件
    submitFileForm() {
      this.submitFileFormBtn = false;
      this.$refs.upload.submit();
    },
    // 关闭
    Colse(){
      this.$emit("SetObj","Setdetailed",false);//已加载 载入合同
    },


  }
};
</script>


<style scoped>
.input:disabled{
  color:red;
  opacity: 1;
  -webkit-text-fill-color: red;
  background-color: #0c9bff;
}
</style>
