<template>
  <div>
    <!-- 这里是标签页 -->
    <div class="main">

      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">

        <el-tab-pane  name="success">
            <span slot="label">
              <span><i class="el-icon-circle-check"></i>
                成功
                <el-badge :value="totalSum" v-if="totalSum>0" :max="99" class="my-badge" type="primary">
               </el-badge>
              </span>
            </span>

          <el-col :span="1.5" style="margin-bottom: 10px; margin-left: -10px" >

            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="exportLoading"
              @click="successExport"
              v-hasPermi="['yunze:businessDtails:export']"
            >导出</el-button>
          </el-col>

          <el-table :data="successList" >
            <el-table-column label="号码" prop="card_number"/>
            <el-table-column label="创建时间" prop="create_time"/>
            <el-table-column label="修改时间" prop="update_time"/>
            <el-table-column label="结束时间" prop="end_time"/>
            <el-table-column label="描述" prop="mydescribe"/>
            <el-table-column label="状态" prop="state_id">
              <template slot-scope="scope">
                {{ tools.getDkeyValue(businessDetails_state, scope.row.state_id) }}
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="totalSum>0"
            :total="totalSum"
            :page.sync="Successtotal.pageNum"
            :limit.sync="Successtotal.pageSize"
            @pagination="pbSel(activeName)"
          />
        </el-tab-pane>

        <el-tab-pane  name="fail">
            <span slot="label">
              <span><i class="el-icon-warning-outline"></i>
                失败
                <el-badge :value="Failtotal" v-if="Failtotal>0" :max="99" class="my-badge" >
               </el-badge>
              </span>
            </span>
          <el-col :span="1.5" style="margin-bottom: 10px; margin-left: -10px" >
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="exportFail"
              @click="failExport"
              v-hasPermi="['yunze:businessDtails:export']"
            >导出</el-button>
          </el-col>

          <el-table :data="failList">
            <el-table-column label="号码" prop="card_number"/>
            <el-table-column label="创建时间" prop="create_time"/>
            <el-table-column label="修改时间" prop="update_time"/>
            <el-table-column label="结束时间" prop="end_time"/>
            <el-table-column label="描述" prop="mydescribe"/>
            <el-table-column label="状态" prop="state_id">
              <template slot-scope="scope">
                {{ tools.getDkeyValue(businessDetails_state, scope.row.state_id) }}
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="Failtotal>0"
            :total="Failtotal"
            :page.sync="FailFrom.pageNum"
            :limit.sync="FailFrom.pageSize"
            @pagination="pbSel(activeName)"
          />
        </el-tab-pane>

        <el-tab-pane  name="Pending">
            <span slot="label">
              <span><i class="el-icon-loading"></i>
                待处理
                <el-badge :value="Pendingtotal" v-if="Pendingtotal>0" :max="99" class="my-badge" type="info" >
               </el-badge>
              </span>
            </span>
          <el-col :span="1.5" style="margin-bottom: 10px; margin-left: -10px" >
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="exportPending"
              @click="PendingExport"
              v-hasPermi="['yunze:businessDtails:export']"
            >导出</el-button>
          </el-col>

          <el-table :data="PendingList">
            <el-table-column label="号码" prop="card_number"/>
            <el-table-column label="创建时间" prop="create_time"/>
            <el-table-column label="修改时间" prop="update_time"/>
            <el-table-column label="结束时间" prop="end_time"/>
            <el-table-column label="描述" prop="mydescribe"/>
            <el-table-column label="状态" prop="state_id">
              <template slot-scope="scope">
                {{ tools.getDkeyValue(businessDetails_state, scope.row.state_id) }}
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="Pendingtotal>0"
            :total="Pendingtotal"
            :page.sync="PendingFrom.pageNum"
            :limit.sync="PendingFrom.pageSize"
            @pagination="pbSel(activeName)"
          />
        </el-tab-pane>
      </el-tabs>

    </div>

    <!-- 触发加载数据函数-->
    <span v-if="show_ds ==true && implement == false">
        {{ LoadData(this.form) }}
    </span>

  </div>
</template>

<script>
import {successArr,exportExport} from "@/api/yunze/flowcard/bulk/businessDetails";
import tools from "@/utils/yunze/tools";

export default {
  props: {
    show_ds: Boolean,//当前界面是否显示
    implement: Boolean,//编辑时加载是否 已执行
    form: Object,//对象

  },
  name: "Subcomponents",
  data() {
    return {
      activeName: "success",//选择那个表格
      successList: [],//成功数组
      failList: [],//失败数组
      PendingList: [],//待处理数组

      tools: tools,
      businessDetails_state: [],//状态

      //成功分页
      totalSum: 0,
      Successtotal:{
        pageNum: 1,
        pageSize: 10,
      },

      //失败分页
      Failtotal: 0,// 总条数
      FailFrom:{
        pageNum: 1,
        pageSize: 10,
      },

      //待处理分页
      Pendingtotal:0,
      PendingFrom:{
        pageNum: 1,
        pageSize: 10,
      },

      exportLoading:false,//控制成功导出
      exportFail:false,//控制失败导出
      exportPending:false,//控制待处理导出

      whether_loadSuccess:false,////是否加载  【成功】
      whether_loadFail:false,////是否加载  【失败】
      whether_loadPending:false,////是否加载  【待处理】
    }
  },
  created() {


    //加载 业务状态
    if (window['businessDetails_state'] != undefined && window['businessDetails_state'] != null && window['businessDetails_state'] != '') {
      this.businessDetails_state = window['businessDetails_state'];
    } else {
      this.getDicts("yz_bulk_businessDtails_state_id").then(response => {
        window['businessDetails_state'] = response.data;
        this.businessDetails_state = window['businessDetails_state'];
      });
    }

  },

  methods: {

    LoadData(row) {
      this.$emit("SetObj", "Setimplement", true);//已加载
      let map = {};
      map.b_id = row.id;
      map.type = this.activeName;
      // console.log(map)
      this.getSuccess(map);
    },

    getSuccess(map) {
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      successArr(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          // console.log(jsonobj);
          if (jsonobj.code == 200) {
            if (map.type =="success"){
              this.successList = jsonobj.Data.Data;
              this.totalSum = jsonobj.Data.Pu.rowCount;
            }else if (map.type =="fail"){
              this.failList = jsonobj.Data.Data;
              this.Failtotal = jsonobj.Data.Pu.rowCount;
            }else if (map.type =="Pending"){
              this.PendingList = jsonobj.Data.Data;
              this.Pendingtotal = jsonobj.Data.Pu.rowCount;
            }
          } else {
            this.msgError(jsonobj.msg);
          }
        }
      );
    },
    /**成功导出*/
    successExport(){
      let map = {};
      map.b_id = this.form.id;
      map.type = this.activeName;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      exportExport(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.Data);
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**失败导出*/
    failExport(){
      let map = {};
      map.b_id = this.form.id;
      map.type = this.activeName;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      exportExport(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.Data);
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**待处理导出*/
    PendingExport(){
      let map = {};
      map.b_id = this.form.id;
      map.type = this.activeName;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      exportExport(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.Data);
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          this.msgError(msg);
        }
      })
    },
    /**标签页*/
    handleClick(tab) {
      this.pbSel(tab.name);
    },
    pbSel(name) {
      let map = {};

      if (name =="success"){
        map = this.Successtotal;
      }else if (name =="fail"){
        map = this.FailFrom;
      }else if (name =="Pending"){
        map = this.PendingFrom;
      }
      map.b_id = this.form.id;
      map.type = name;
      this.getSuccess(map);
    },



  },
}
</script>

<style scoped>
.my-badge{
  top: 25px;
  right: 15px;
  float: right;
  -webkit-transform: translateY(-50%) translateX(100%);
}



</style>
