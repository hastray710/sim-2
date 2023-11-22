<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <!--账户状态-->
          <el-form-item label="账户状态" prop="status">
            <el-select
              v-model="queryParams.state"
              placeholder="账户状态"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in Account_State"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 10px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <!--条件选择-->
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
                    @change="$forceUpdate()"
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
                  @click="AddFirm"
                >新增
                </el-button>
            </el-col>

            <right-toolbar :showSearch.sync="showSearch"  @queryTable="getListArr"
                           :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
          <el-table-column label="Fat_ID" align="center" prop="Fat_ID" v-if="columns[0].visible"/>
          <el-table-column label="公司名称" align="center" prop="Fat_Name" v-if="columns[0].visible"/>
          <el-table-column label="简称" align="center" prop="Fat_Abbreviation" v-if="columns[1].visible"/>
          <el-table-column label="开户行" align="center" prop="Fat_Bank" v-if="columns[2].visible"/>
          <el-table-column label="行号" align="center" prop="Fat_Bank_Number" v-if="columns[3].visible"/>
          <el-table-column label="账号" align="center" prop="Fat_Account_Number" v-if="columns[4].visible"/>
          <el-table-column label="法人" align="center" prop="Fat_Legal_Person" v-if="columns[5].visible"/>
          <el-table-column label="电话" align="center" prop="Fat_Phone" v-if="columns[6].visible"/>
          <el-table-column label="地址" align="center" prop="Fat_Address" v-if="columns[7].visible"/>
          <el-table-column label="状态" align="center" prop="state" v-if="columns[8].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(Account_State, scope.row.state) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="FirmUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="DeleteID(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="真实删除" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  @click="FirmDelete(scope.row)"
                >真实删除
                </el-button>
              </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getListArr"
        />
        <!--面板-->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
          <el-form ref="form" :model="FirmArr" :rules="rules" label-width="80px">
            <el-form-item label="公司名称" prop="Fat_Name">
              <el-input v-model="FirmArr.Fat_Name" placeholder="请输入公司名称"/>
            </el-form-item>
            <el-form-item label="简称" prop="Fat_Abbreviation">
              <el-input v-model="FirmArr.Fat_Abbreviation" placeholder="请输入简称"/>
            </el-form-item>
            <el-form-item label="开户行" prop="Fat_Bank">
              <el-input v-model="FirmArr.Fat_Bank" placeholder="请输入开户行"/>
            </el-form-item>
            <el-form-item label="行号" prop="Fat_Bank_Number">
              <el-input v-model="FirmArr.Fat_Bank_Number" placeholder="请输入开户行"/>
            </el-form-item>
            <el-form-item label="账号" prop="Fat_Account_Number">
              <el-input v-model="FirmArr.Fat_Account_Number" placeholder="请输入账号"/>
            </el-form-item>
            <el-form-item label="法人" prop="Fat_Legal_Person">
              <el-input v-model="FirmArr.Fat_Legal_Person" placeholder="请输入法人"/>
            </el-form-item>
            <el-form-item label="电话" prop="Fat_Phone">
              <el-input v-model="FirmArr.Fat_Phone" placeholder="请输入电话"/>
            </el-form-item>
            <el-form-item label="地址" prop="Fat_Address">
              <el-input v-model="FirmArr.Fat_Address" placeholder="请输入地址"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-if="FirmSubmitForm" type="primary" @click="submitForm">确 定</el-button>
            <el-button v-if="FirmPreserved" type="primary" @click="Preserved">保 存</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import {getList, add, find, upd, deleteFat_IDArr, deleteFat_ID} from "@/api/yunze/CWGL/Firm/Firm";
import tools from "@/utils/yunze/tools";

export default {
  name: "account",
  data() {
    return {
      FirmSubmitForm: false,//确定按钮
      FirmPreserved: false,//保存按钮
      // 遮罩层
      loading: true,
      tools: tools,
      //抄送任务id 名字
      NameAddCcUrl: [],
      selTime: '',//时间选择
      mainwidth: 24,//宽度
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
      // 是否显示弹出层
      open: false,
      title: "",//弹出面板
      //条件选择
      typeOptions: [],
      // 选中数组
      ids: [],
      // 表单参数
      form: {},
      //账户状态
      Account_State: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        state: null,
      },
      FirmArr: {
        Fat_ID: null,
        Fat_Name: null,
        Fat_Abbreviation: null,
        Fat_Bank: null,
        Fat_Bank_Number: null,
        Fat_Account_Number: null,
        Fat_Legal_Person: null,
        Fat_Phone: null,
        Fat_Address: null,
      },
      // 列信息
      columns: [
        {key: 1, label: `公司名称`, visible: true},
        {key: 2, label: `简称`, visible: true},
        {key: 3, label: `开户行`, visible: true},
        {key: 4, label: `行号`, visible: true},
        {key: 5, label: `账号`, visible: true},
        {key: 6, label: `法人`, visible: true},
        {key: 7, label: `电话`, visible: true},
        {key: 8, label: `地址`, visible: true},
        {key: 9, label: `状态`, visible: true},
      ],
      // 表单校验
      rules: {}
    };
  },

  created() {
    this.getListArr();

    //加载 查询条件
    if (window['yz_Firm_Condition'] != undefined && window['yz_Firm_Condition'] != null && window['yz_Firm_Condition'] != '') {
      this.typeOptions = window['yz_Firm_Condition'];
    } else {
      this.getDicts("yz_Firm_Condition").then(response => {
        window['yz_Firm_Condition'] = response.data;
        this.typeOptions = window['yz_Firm_Condition'];
      });
    }
    //加载 账户状态
    if (window['Account_State'] != undefined && window['Account_State'] != null && window['Account_State'] != '') {
      this.Account_State = window['Account_State'];
    } else {
      this.getDicts("yz_Universal_delete").then(response => {
        window['Account_State'] = response.data;
        this.Account_State = window['Account_State'];
      });
    }
    //条件查询 默认选择第一个
    this.queryParams.type ='1';

  },
  methods: {


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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 查询公司账户列表 */
    getListArr() {
      this.loading = true;
      this.getParams();
      //console.log(this.queryParams);
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      getList(Pwd_Str).then(response => {
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

    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getListArr();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {};
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.selTime = null;
      this.handleQuery();
    },
    /**新增账户*/
    AddFirm() {
      this.open = true;
      this.title = "添加公司账户";
      this.FirmSubmitForm = true;//确定按钮
      this.FirmPreserved = false;//保存按钮
      this.FirmArr ={};

    },
    /**修改操作*/
    FirmUpdate(row) {
      this.open = true;
      row.Fat_Name = "" + row.Fat_Name;
      row.Fat_Abbreviation = "" + row.Fat_Abbreviation;
      this.FirmArr = row;
      // console.log(this.FirmArr = row)
      this.FirmSubmitForm = false;//确定按钮
      this.FirmPreserved = true;//保存按钮
    },
    /**真实删除操作*/
    FirmDelete(row) {
      let map = {};
      map.Fat_ID = row.Fat_ID;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      tools.openAsk(this, 'warning', "确定真实要删除公司账户表为 '" + row.Fat_ID + "' 的这条数据吗？", this.deleteFirml, Pwd_Str);
    },
    //删除公司账户表
    deleteFirml(Pwd_Str) {
      deleteFat_ID(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getListArr();
          this.msgSuccess(jsonobj.msg);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**删除*/
    DeleteID(row){
      let map = {};
      map.Fat_ID = row.Fat_ID;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      tools.openAsk(this, 'warning', "确定要删除公司账户表为 '" + row.Fat_ID + "' 的这条数据吗？", this.deleteFirmlID, Pwd_Str);
    },
    //删除公司账户表
    deleteFirmlID(Pwd_Str) {
      deleteFat_IDArr(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.getListArr();
          this.msgSuccess(jsonobj.msg);
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**新增确定按钮*/
    submitForm() {
      let _this = this;
      if (tools.VerificationsText(_this, _this.FirmArr.Fat_Name, "公司名称不能为空") == true &&
        tools.VerificationsText(_this, _this.FirmArr.Fat_Abbreviation, "简称不能为空") == true
      ) {
        let Pwd_Str = tools.encrypt(JSON.stringify(this.FirmArr));
        add(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.msgSuccess(jsonobj.msg);
            this.open = false;
          } else {
            this.msgError(jsonobj.msg);
          }
        });
      }
    },
    /**修改保存按钮*/
    Preserved() {
      let _this = this;
      if (tools.VerificationsText(_this, _this.FirmArr.Fat_Name, "公司名称不能为空") == true &&
        tools.VerificationsText(_this, _this.FirmArr.Fat_Abbreviation, "简称不能为空") == true
      ) {
        let Pwd_Str = tools.encrypt(JSON.stringify(this.FirmArr));
        //console.log(Pwd_Str)
        upd(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.msgSuccess(jsonobj.msg);
            this.open = false;
          } else {
            this.msgError(jsonobj.msg);
          }
        });
      }
    },

  }
};
</script>

<style>

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

