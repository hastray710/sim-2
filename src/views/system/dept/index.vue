<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="企业状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-form :model="queryParams" ref="queryForm" @submit.native.prevent :inline="true" style="margin-bottom: -10px;line-height:35px">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-form-item label="企业名称" prop="deptName" style="margin-bottom: 10px;line-height:35px">
            <el-input
              v-model="queryParams.deptName"
              placeholder="请输入企业名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
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
            v-hasPermi="['system:dept:add']"
          >新增</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="changeStyleShow"
          >切换显示风格
          </el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" ></right-toolbar>
      </el-row>
    </el-form>


    <!--树形折叠显示-->



    <el-table
      v-show="!is_table"
      v-loading="loading"
      :data="deptList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :height="550"
            :key="scope.row.index"
            :data="scope.row.children"
          >
            <el-table-column type="expand">
              <template slot-scope="scope" >
                <el-table
                  v-if="scope.row.showChildren"
                  :height="550"
                  :key="scope.row.ancestors"
                  :data="scope.row.children"
                >
                  <el-table-column prop="deptName" label="企业名称" width="600" ></el-table-column>
                  <el-table-column prop="dname" label="企业简称"  ></el-table-column>
                  <el-table-column prop="orderNum" label="排序" ></el-table-column>
                  <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
                  <el-table-column label="创建时间" align="center" prop="createTime" >
                    <template slot-scope="scope">
                      <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
                    <template slot-scope="scope">
                      <el-dropdown >
                        <el-button type="primary"  size="small" >
                          操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item    v-hasPermi="['system:dept:edit']"  @click.native="handleUpdate(scope.row)">修改</el-dropdown-item>
                          <el-dropdown-item   v-hasPermi="['system:dept:add']"  @click.native="handleAdd(scope.row)">新增</el-dropdown-item>
                          <el-dropdown-item   v-hasPermi="['system:dept:remove']"  @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
                          <el-dropdown-item   v-hasPermi="['system:dept:credit']"  @click.native="handleCredit(scope.row)">授信</el-dropdown-item>
                          <el-dropdown-item v-hasPermi="['yunze:dept:initiatePreSave']" >
                            <router-link :to="'/system/deptPrestore/'+ tools.encrypt(JSON.stringify({'deptName':scope.row.deptName,'deptId':scope.row.deptId}))" class="link-type">
                              <span>企业预存</span>
                            </router-link>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>

                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="deptName" label="企业名称" width="600" ></el-table-column>
            <el-table-column prop="dname" label="企业简称"  ></el-table-column>
            <el-table-column prop="orderNum" label="排序" ></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
                {{scope.row.showChildren}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
              <template slot-scope="scope">
                <el-dropdown >
                  <el-button type="primary"  size="small" >
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item    v-hasPermi="['system:dept:edit']"  @click.native="handleUpdate(scope.row)">修改</el-dropdown-item>
                    <el-dropdown-item   v-hasPermi="['system:dept:add']"  @click.native="handleAdd(scope.row)">新增</el-dropdown-item>
                    <el-dropdown-item   v-hasPermi="['system:dept:remove']"  @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
                    <el-dropdown-item   v-hasPermi="['system:dept:credit']"  @click.native="handleCredit(scope.row)">授信</el-dropdown-item>
                    <el-dropdown-item v-hasPermi="['yunze:dept:initiatePreSave']" >
                      <router-link :to="'/system/deptPrestore/'+ tools.encrypt(JSON.stringify({'deptName':scope.row.deptName,'deptId':scope.row.deptId}))" class="link-type">
                        <span>企业预存</span>
                      </router-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="企业名称" width="600" ></el-table-column>
      <el-table-column prop="dname" label="企业简称"  ></el-table-column>
      <el-table-column prop="orderNum" label="排序" ></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template slot-scope="scope">
          <el-dropdown >
            <el-button type="primary"  size="small" >
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item    v-hasPermi="['system:dept:edit']"  @click.native="handleUpdate(scope.row)">修改</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['system:dept:add']"  @click.native="handleAdd(scope.row)">新增</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['system:dept:remove']"  @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['system:dept:credit']"  @click.native="handleCredit(scope.row)">授信</el-dropdown-item>
              <el-dropdown-item v-hasPermi="['yunze:dept:initiatePreSave']" >
                <router-link :to="'/system/deptPrestore/'+ tools.encrypt(JSON.stringify({'deptName':scope.row.deptName,'deptId':scope.row.deptId}))" class="link-type">
                  <span>企业预存</span>
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>



    <!--表格显示-->

    <el-table v-if="is_table" v-loading="loading" :data="tbdeptList" >
      <el-table-column :label="columns[0].label"  v-if="columns[0].visible" width="500" :show-overflow-tooltip="true">
        <template slot-scope="scope">
                <span @click="PrViewDetails(scope.row)" class="link-type">{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="columns[1].label"  prop="dname"   v-if="columns[1].visible"   />

      <el-table-column :label="columns[3].label"  prop="deposit_amount"   v-if="columns[3].visible"   />
      <el-table-column :label="columns[7].label"  prop="be_usable_line_of_credit"   v-if="columns[7].visible"   />


      <el-table-column :label="columns[2].label" align="center" prop="orderNum"   v-if="columns[2].visible"   />
      <el-table-column :label="columns[8].label" align="center" prop="status"  v-if="columns[8].visible"  width="70">
        <template slot-scope="scope" >
          {{tools.getDkeyValue(statusOptions,scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column :label="columns[9].label" align="center" prop="create_time"   v-if="columns[9].visible" >
        <template slot-scope="scope" >
          {{scope.row.create_time}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-dropdown >
            <el-button type="primary"  size="small" >
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item    v-hasPermi="['system:dept:edit']"  @click.native="handleUpdate(scope.row)">修改</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['system:dept:add']"  @click.native="handleAdd(scope.row)">新增</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['system:dept:remove']"  @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['system:dept:credit']"  @click.native="handleCredit(scope.row)">授信</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['yunze:dept:sysPreSaved']"  @click.native="handlesysPreSaved(scope.row)">平台预存</el-dropdown-item>
              <el-dropdown-item   v-hasPermi="['yunze:dept:sysDeduct']"  @click.native="handlesysDeduct(scope.row)">预存抵扣</el-dropdown-item>
              <el-dropdown-item v-hasPermi="['yunze:dept:initiatePreSave']" >
                <router-link :to="'/system/deptPrestore/'+ tools.encrypt(JSON.stringify({'deptName':scope.row.deptName,'deptId':scope.row.deptId}))" class="link-type">
                  <span>企业预存</span>
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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




    <!-- 添加或修改企业对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级企业" prop="parentId">
              <treeselect v-model="form.parentId" :disabled="CreditBool" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级企业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="deptName">
              <el-input v-model="form.deptName" :disabled="CreditBool" placeholder="请输入企业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业简称" prop="dname">
              <el-input v-model="form.dname" :disabled="CreditBool" placeholder="请输入企业简称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" :disabled="CreditBool" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" :disabled="CreditBool" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" :disabled="CreditBool" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" :disabled="CreditBool" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  :disabled="CreditBool"
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="CreditBool">
            <el-form-item label="已授信额度" prop="lineOfCredit">
              <el-input v-model="form.lineOfCredit"   @blur="handleInput3" @keydown.native="handleInput3" maxlength="8"  placeholder="已授信额度"   />
            </el-form-item>
          </el-col>
        </el-row>
          <el-col :span="12" v-if="CreditBool">
            <el-form-item label="已用授信额度" prop="lineOfCredit">
              <el-input v-model="form.usedLineOfCredit"  disabled  placeholder="已使用授信额度"   />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="CreditBool">
            <el-form-item label="可用授信额度" prop="lineOfCredit">
              <el-input v-model="form.beUsableLineOfCredit"  disabled  placeholder="可使用授信额度"   />
            </el-form-item>
          </el-col>
        <el-row>

        </el-row>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm"  v-if="CreditBool==false"  >确 定</el-button>
        <el-button type="primary" @click="credit"  v-if="CreditBool"  >授 信</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>







    <!--授信预存查看-->
    <el-dialog title="预存授信信息" :visible.sync="prestoreOpen" width="700px" append-to-body @close="prestoreOpen=false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12" >
            <el-form-item label="预存金额" >
              <el-input v-model="form.deposit_amount"  readonly  placeholder="预存金额"   />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="利润金额">
              <el-input v-model="form.profit_amount"  readonly  placeholder="利润金额"   />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" >
            <el-form-item label="已授信额度" >
              <el-input v-model="form.line_of_credit"  readonly  placeholder="已授信额度"   />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" >
            <el-form-item label="已用授信额度" >
              <el-input v-model="form.used_line_of_credit"  readonly  placeholder="已使用授信额度"   />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可用授信额度" >
              <el-input v-model="form.be_usable_line_of_credit"  readonly  placeholder="可使用授信额度"   />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prestoreOpen=false"    >关 闭</el-button>
      </div>
    </el-dialog>



    <!--授信预存查看-->
    <el-dialog :title="formPrestore.title" :visible.sync="sysPrestoreOpen" width="700px" append-to-body @close="prestoreOpen=false">
      <el-form ref="form" :model="formPrestore" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12" >
            <el-form-item label="企业名称" >
              <el-input v-model="formPrestore.deptName" readonly   placeholder="企业名称"   />
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item :label="formPrestore.paySumLabel" >
              <el-input v-model="formPrestore.paySum" @blur="handleInput3" @keydown.native="handleInput3"    :placeholder="formPrestore.paySumLabel"   />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" >
            <el-form-item label="备注" >
              <el-input type="textarea" v-model="formPrestore.info" placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="Dividebtn"  type="primary" @click="askSysPrestore"    >确 认</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild,listTbDept } from "@/api/system/dept";
import { updCredit,sysPreSaved,sysDeduct} from "@/api/yunze/system/mySysDept";
import tools from "@/utils/yunze/tools";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";




export default {
  treename: "Dept",
  components: { Treeselect },
  data() {
    return {


      formPrestore:{
        deptName:'',
        paySum:100.0,
        deptId:'',
        info:'',
        title:'',
        paySumLabel:'',
        type:'',
      },

      tableData: [/*{
        id: '12987122',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987123',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987125',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987126',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }*/],


      Dividebtn: true,//预存 btn

      tools:tools,
      CreditBool: false,//授信 bool
      sysCreditTypeOptions:[],//授信类型
      prestoreOpen: false,//授信详情查看



      sysPrestoreOpen: false,//平台预存 显示
      // 总条数
      total: 0,
      is_table:true,//是否表格显示
      tbdeptList:[],//表格展示数据
      // 列信息
      columns: [
        { key: 0, label: `企业名称`, visible: true },
        { key: 1, label: `企业简称`, visible: true },
        { key: 2, label: `排序`, visible: true },
        { key: 3, label: `预存金额`, visible: true },
        { key: 4, label: `利润金额`, visible: true },
        { key: 5, label: `已授信`, visible: true },
        { key: 6, label: `已用授信`, visible: true },
        { key: 7, label: `可用授信`, visible: true },
        { key: 8, label: `状态`, visible: true },
        { key: 9, label: `创建时间`, visible: true },

      ],


      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: false,
      // 表格树数据
      deptList: [],
      // 企业树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {

      },
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级企业不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        dname: [
          { required: true, message: "企业简称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {


    //加载 授信类型
    if(window['sysCreditTypeOptions']!=undefined &&  window['sysCreditTypeOptions']!=null && window['sysCreditTypeOptions']!=''){
      this.sysCreditTypeOptions = window['sysCreditTypeOptions'];
    }else{
      this.getDicts("sys_Credit_type").then(response => {
        window['sysCreditTypeOptions'] = response.data;
        this.sysCreditTypeOptions = window['sysCreditTypeOptions'];
      });
    }



    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getList();

  },
  methods: {
    /** 详情按钮操作 */
    PrViewDetails(row) {
      this.form = row;
      this.prestoreOpen = true;
    },

    //切换显示风格
    changeStyleShow(){
      this.msgSuccess("切换显示风格中。。。");
      this.is_table = !this.is_table;
      this.getList();
    },


    handleInput3(e) {
      // 通过正则过滤小数点后两位
      //this.$emit('update:value', (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null);
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || 100.0;
      //this.$emit("on-change-grant", val);
    },

    //再次确认
    askSysPrestore(){
      this.Dividebtn = false;
      let _this = this;
      if (tools.VerificationsText(_this, _this.formPrestore.paySum, "金额不能为空！") == true &&
        tools.VerificationsText(_this, _this.formPrestore.info, "请填写备注信息！") == true &&
        tools.VerificationsText(_this, _this.formPrestore.deptId, "必要参数缺失请刷新后重试！") == true) {
        let paySum = Number(this.formPrestore.paySum);
        this.sumTime = 0;
        if (paySum > 0.0) {
          let Pwd_Str = tools.encrypt(JSON.stringify(this.formPrestore));
          tools.openAsk(this, 'warning', "确定给 企业 [ "+ this.formPrestore.deptName+" ] ( "+this.formPrestore.paySumLabel+" ) [ " + this.formPrestore.paySum + " ] 元 吗？", this.chooseExecute, Pwd_Str,this.UnsubmitSysPrestore);
        }else {
          tools.open(_this, "请输入大于 0 的预存金额！！！")
        }
      }else{
        this.Dividebtn = true;
      }
    },
    UnsubmitSysPrestore(){
      this.Dividebtn = true;
    },
    //选择执行
    chooseExecute(Pwd_Str){
      switch (this.formPrestore.type) {
        case "add":
            this.subSysPrestore(Pwd_Str);
          break;
        case "sub":
          this.subSysDeduct(Pwd_Str);
          break;
      }
    },


    //提交 预存
    subSysPrestore(Pwd_Str) {
      sysPreSaved(Pwd_Str).then(response => {
        this.Dividebtn = true;
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        let msg = jsonobj.Data.Msg != null && jsonobj.Data.Msg != '' ? jsonobj.Data.Msg : jsonobj.msg;
        if (jsonobj.code == 200) {
          this.sysPrestoreOpen = false;
          let bool = jsonobj.Data.bool != null && jsonobj.Data.bool != '' ? jsonobj.Data.bool : false;
          if(bool){
            this.msgSuccess(msg);
            this.getList();
          } else {
            this.msgError(msg);
          }
        } else {
          this.msgError(msg);
        }
      })
    },

    //提交 扣款
    subSysDeduct(Pwd_Str) {
      sysDeduct(Pwd_Str).then(response => {
        this.Dividebtn = true;
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        let msg = jsonobj.Data.Msg != null && jsonobj.Data.Msg != '' ? jsonobj.Data.Msg : jsonobj.msg;
        if (jsonobj.code == 200) {
          this.sysPrestoreOpen = false;
          let bool = jsonobj.Data.bool != null && jsonobj.Data.bool != '' ? jsonobj.Data.bool : false;
          if(bool){
            this.msgSuccess(msg);
            this.getList();
          } else {
            this.msgError(msg);
          }
        } else {
          this.msgError(msg);
        }
      })
    },


    /** 查询企业列表 */
    getList() {
      this.loading = true;
      //console.log(this.is_table)
      if(this.is_table){

        let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
        listTbDept(Pwd_Str).then(response => {
            let jsonobj =  JSON.parse(tools.Decrypt(response));
            if(jsonobj.code==200){
              this.tbdeptList = jsonobj.Data.Data;
             //console.log(this.tbdeptList)
              this.total = jsonobj.Data.Pu.rowCount;
            }else{
              if(jsonobj.deptId=="100"){
                this.msgError(jsonobj.msg);
              }else{
                this.msgError("网络异常");
              }
            }
            this.loading = false;
          }
        );
      }else {
        //console.log(this.queryParams)
        this.is_table = true;
        this.loading = true;

        listDept(this.queryParams).then(response => {
          //console.log(response)
          this.tbdeptList = [];
          this.total = 0;
          this.deptList = this.handleTree(response.data, "deptId");
          //console.log(this.deptList)

          this.is_table = false;
          this.loading = false;
        });
      }

    },
    /** 转换企业数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.CreditBool = false;
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加企业";
      listDept().then(response => {
	        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /**  授信按钮操作 */
    handleCredit(row) {
      this.reset();
      this.CreditBool = true;
      getDept(row.deptId).then(response => {
        let Rdate = response.data;
        Rdate.CreditType = "1";
        this.form = Rdate;


        this.open = true;
        this.title = "企业授信";
      });
      listDeptExcludeChild(row.deptId).then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });

    },

    /*平台预存*/
    handlesysPreSaved(row){
      this.formPrestore.deptId = row.deptId;
      this.formPrestore.deptName = row.deptName;
      this.formPrestore.paySum = 100.0;
      this.formPrestore.title = '平台手动预存';
      this.formPrestore.paySumLabel = '预存金额';
      this.formPrestore.type = 'add';

      this.sysPrestoreOpen = true;
    },

    /*平台预存*/
    handlesysDeduct(row){
      //console.log(row)
      this.formPrestore.paySum = tools.Is_null(row.deposit_amount)?row.deposit_amount:'0.0';//预存金额 已经预存的金额
      this.formPrestore.deptId = row.deptId;
      this.formPrestore.deptName = row.deptName;
      this.formPrestore.title = '平台手动扣款';
      this.formPrestore.paySumLabel = '扣款金额';
      this.formPrestore.type = 'sub';
      this.sysPrestoreOpen = true;
    },



    //企业授信
    credit(){

      let _this = this;
      if (tools.VerificationsText(_this, _this.form.lineOfCredit, "已授信额度 不能为空！") == true &&
        tools.VerificationsText(_this, _this.form.deptId, "缺少必要参数请刷新后重试！") == true) {
          let map = {};
          map.line_of_credit = this.form.lineOfCredit;
          map.dept_id = this.form.deptId;
          map.agent_id = this.form.deptId;
          let Pwd_Str = tools.encrypt(JSON.stringify(map));
          updCredit(Pwd_Str).then(response => {
              let jsonobj =  JSON.parse(tools.Decrypt(response));
              if(jsonobj.code==200){
                this.msgSuccess(jsonobj.Data);
                this.open = false;
                this.getList();
              }else{
                this.msgError(jsonobj.msg);
              }

            }
          );
      }



    },





    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.CreditBool = false;
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改企业";
      });
      listDeptExcludeChild(row.deptId).then(response => {
	        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {

            updateDept(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDept(row.deptId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    }
  }
};
</script>


<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
