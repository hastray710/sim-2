<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" v-show="option_show">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入公司名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>



          <el-tree
            :data="deptOptions"
            show-checkbox
            :filter-node-method="filterNode"
            default-expand-all
            node-key="id"
            ref="dept"
            highlight-current
            :check-strictly="!deptCheckStrictly"
            @node-click="handleNodeClick"
            :props="defaultProps" />

        </div>
      </el-col>
      <!--数据-->
      <el-col :span="mainwidth" :xs="24" >
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="交易类型" prop="status">
            <el-select
              v-model="queryParams.ord_type"
              placeholder="交易类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in orderTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>


          <el-form-item label="支付状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="支付状态"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in OrderStateOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>


          <el-form-item label="资费选择" prop="status">
            <el-select
              v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
              v-model="queryParams.package_id"
              placeholder="资费组"
              clearable
              ref="packageSel"
              @change="packageSelChange"
              size="small"
              style="width: 210px"
            >
              <el-option
                v-for="dict in packageOptions"
                :key="dict.package_id"
                :label="dict.package_agentname"
                :value="dict.package_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item  >
            <el-select
              v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
              v-model="queryParams.packet_idSig"
              placeholder="资费计划"
              clearable
              size="small"
              style="width: 210px"
            >
              <el-option
                v-for="dict in PacketSelOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>



          <el-form-item label="支付方式" prop="status" >
            <el-select
              v-model="queryParams.payment"
              placeholder="选择支付方式"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in Payment_method"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="加包执行" prop="status" >
            <el-select
              v-model="queryParams.Addpackage"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in customize_whether"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="已审核" prop="status" >
            <el-select
              v-model="queryParams.is_audit"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in customize_whether"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生成方式" prop="status" >
            <el-select
              v-model="queryParams.cre_type"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in creTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-form>


        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
          <el-form-item  prop="status"   >
            <span class="el-form-item__label" style="font-weight: 700;" >检索类型 </span>
            <el-select

              v-model="queryParams.StartAndEndtype"
              placeholder="起止条件"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option

                v-for="dict in OrderStartAndEndTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item  >
            <el-input
              v-model="queryParams.StartValue"
              placeholder="开始号段(小)"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item  >
            <el-input
              v-model="queryParams.EndValue"
              placeholder="结束号段(大)"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 110px"
            >
              <el-option
                v-for="dict in timetypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-date-picker
              v-model="selTime"
              type="datetimerange"
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

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: -10px;line-height:35px">

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-input
                v-model="queryParams.value"
                placeholder="查询值"
                clearable
                size="small"
                style="width: 350px"
                @keyup.enter.native="handleQuery"
                v-show="this.switch"
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

              <el-select
                v-model="queryParams.batch_query_type"
                placeholder="批量查询条件"
                style="width: 110px"
                size="small"
                v-show="!this.switch"
              >
                <el-option
                  v-for="dict in batch_sel_order_type"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>

              <el-input
                v-model="queryParams.Bcvalue"
                placeholder="按行输入 换行隔开 "
                autosize
                size="small"
                type="textarea"
                style="width: 238px;"
                @keyup.enter.native="handleQuery"
                v-show="!this.switch"
              >
              </el-input>
              <el-button type="primary" icon="el-icon-d-caret" style="height: 30px" size="mini"
                         title="切换搜索方式"
                         @click="switchMode"></el-button>
            </el-col>
            <el-col :span="1.5">
              <el-form-item label="显示删除" prop="status" v-hasPermi="['yunze:order:dellist']" style="margin-bottom: 10px;line-height:35px">
                <el-select
                  v-model="queryParams.del_flag"
                  placeholder="显示删除订单"
                  clearable
                  size="small"
                  style="width: 110px"
                >
                  <el-option
                    v-for="dict in customize_whether"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="1.5">
              <el-dropdown>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="Importquery"
                      v-hasPermi="['yunze:order:cardNumberAge']"
                    >导入查询
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>


            <el-col :span="1.5">
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-col>

            <el-col :span="1.5">
              <el-button size="mini" v-hasPermi="['yunze:card:listAgent']"  @click="agentShow" >公司所属</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                :loading="exportLoading"
                @click="handleExport"
                v-hasPermi="['yunze:card:exportData']"
              >导出</el-button>
            </el-col>

            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-sort"
                size="mini"
                @click="Unsubscribe"
                v-hasPermi="['yunze:order:nobscribe']"
              >退订</el-button>
            </el-col>

            <el-col :span="1.5">
              <el-button
                type="success"
                plain
                icon="el-icon-check"
                size="mini"
                @click="ShowUpdInfo()"
              >勾选操作
              </el-button>
            </el-col>
            <!--勾选操作-->
            <el-dropdown v-if="IsUpdInfo">
              <el-button
                type="success"
                plain
                icon="el-icon-user-solid"
                size="mini"
                style="width: 110px;"
              >操作
              </el-button>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-hasPermi="['yunze:order:package']" @click.native="SleAddpackage">执行加包</el-dropdown-item>
                <el-dropdown-item v-hasPermi="['yunze:order:audit']" @click.native="auditOrder">充值审核</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>

            <right-toolbar :showSearch.sync="showSearch"   v-hasPermi="['yunze:card:list']" @queryTable="getList" :columns="columns"></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="cardList" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" v-if="IsUpdInfo" width="55" align="center"/>
          <el-table-column label="交易名称" align="center" key="ord_name" prop="ord_name" v-if="columns[0].visible" :show-overflow-tooltip="true" width="150"  />
          <el-table-column label="订单号" align="center" v-if="columns[1].visible"  :show-overflow-tooltip="true" width="190"  >
            <template slot-scope="scope">
                <span  @click="ViewDetails(scope.row)" class="link-type"
                       v-hasPermi="['yunze:card:find']" >{{ scope.row.ord_no }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易类型" align="center"  key="ord_type" prop="ord_type" v-if="columns[2].visible" :show-overflow-tooltip="true" width="80"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(orderTypeOptions,scope.row.ord_type)}}
            </template>
          </el-table-column>
          <el-table-column label="ICCID" align="center" key="iccid" prop="iccid" v-if="columns[3].visible" :show-overflow-tooltip="true" width="190" />
          <el-table-column label="微信订单号" align="center" key="wx_ord_no" prop="wx_ord_no" v-if="columns[4].visible"  width="190"  />
          <el-table-column label="支付状态" align="center" key="status"  v-if="columns[5].visible" :show-overflow-tooltip="true" width="80"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(orderStatusOptions,scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="交易金额" align="center" key="price" prop="price" v-if="columns[6].visible" :show-overflow-tooltip="true"  width="80" />
          <el-table-column label="交易后金额" align="center" key="account" prop="account" v-if="columns[7].visible" width="90" />
          <el-table-column label="支付方式" align="center" key="pay_type" prop="pay_type" v-if="columns[8].visible" width="80" >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(payTypeOptions,scope.row.pay_type)}}
            </template>
          </el-table-column>
          <el-table-column label="生成方式" align="center" key="cre_type" prop="cre_type" v-if="columns[9].visible"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(creTypeOptions,scope.row.cre_type)}}
            </template>
          </el-table-column>
          <el-table-column label="所属公司" align="center" key="agent_id" prop="agent_id" v-if="columns[10].visible"  >
            <template slot-scope="scope" >
              {{tools.getDeptNamekeyValue(DeptOptions,scope.row.agent_id)}}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" key="create_time" prop="create_time" v-if="columns[11].visible" width="120" >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" key="info" prop="info" v-if="columns[12].visible" :show-overflow-tooltip="true"  width="80" />
          <el-table-column label="生效类型" align="center" key="validate_type" prop="validate_type" v-if="columns[13].visible"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(validateTypeOptions,scope.row.validate_type)}}
            </template>
          </el-table-column>

          <el-table-column label="资费计划" align="center" key="packet_id" prop="packet_id" v-if="columns[14].visible"  width="200"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(PacketOptions,scope.row.packet_id)}}
            </template>
          </el-table-column>
          <el-table-column label="分润" align="center" key="is_profit" prop="is_profit" v-if="columns[15].visible"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(customize_whether,scope.row.is_profit)}}
            </template>
          </el-table-column>
          <el-table-column label="C端显示" align="center" key="profit_type" prop="profit_type" v-if="columns[16].visible"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(customize_whether,scope.row.profit_type)}}
            </template>
          </el-table-column>
          <el-table-column label="已加包" align="center" key="add_package" prop="add_package" v-if="columns[17].visible"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(customize_whether,scope.row.add_package)}}
            </template>
          </el-table-column>
          <el-table-column label="C端显示" align="center" key="show_status" prop="show_status" v-if="columns[18].visible"  >
            <template slot-scope="scope" >
              {{tools.getDkeyValue(customize_whether,scope.row.show_status)}}
            </template>
          </el-table-column>
          <el-table-column label="open_id" align="center" key="open_id" prop="open_id" v-if="columns[19].visible" width="80" :show-overflow-tooltip="true"  />


          <el-table-column
            label="操作"
            align="center"
            width="90"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-dropdown >
                <el-button type="primary"  size="small" >
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item   v-hasPermi="['yunze:order:package']"  @click.native="manualaddPackage(scope.row)">执行加包</el-dropdown-item>
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
      </el-col>
    </el-row>





    <!-- 详情查看 -->
    <el-dialog :title="title" :visible.sync="show_ds" width="960px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="资费计划" prop="packetName">
              <el-input v-model="form.packetName" placeholder="资费计划" />

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加包时间" prop="add_package_time">
              <el-input v-model="form.add_package_time" placeholder="加包时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已加包" prop="add_package">
              <el-input v-model="form.add_package" placeholder="已加包" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="加包参数" prop="cd_code">
              <el-input type="textarea" style="min-height: 300px;" v-model="form.add_parameter" placeholder="加包参数" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 导入查询 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-form ref="form" label-width="80px">
        <el-col :span="35">
          <el-form-item prop="status">
            <span slot="label">
                  号码类型
              </span>
            <el-tooltip placement="right">
              <div slot="content">
                1:下载模板2:选择您的号码类型3:点击上传文件、然后确定4:列如你上传100个号码,可以在此界面进行筛选,
              </div>
              <div slot="content">
                添加筛选条件点击搜索,
                如想取消此页面,可以点击重置或者关闭页面
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-select
              v-model="queryParams.UpType"
              placeholder="请输入您的卡号"
              clearable
              size="small"
              @change="SelectChange()"
              style="width: 200px"
            >
              <el-option
                v-for="dict in cardNumberAge"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-form>

      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handlenumberFile"
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
          <el-link type="info" style="font-size:12px" @click="importCardSel">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="submitFileFormBtn" @click="submitNumber">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>


    <!--退订-->
    <el-dialog :title="order" :visible.sync="orderFlow" width="60%" append-to-body>
      <el-form ref="formCard" :model="formBscribe">
        <el-form-item  style="margin-top:10px">
           <span slot="label">
                退订:
              </span>
          <el-radio v-model="formBscribe.radio" label="delete">删除订单并删除资费计划</el-radio>
          <el-radio v-model="formBscribe.radio" label="update">订单状态‘退款’并删除资费计划</el-radio>

        </el-form-item>


        <el-form-item style="margin-top:10px">
          <el-switch
            style="margin-left: 10px"
            v-model="formBscribe.valueIs"
            active-color="#13ce66"
            active-text="资费订购"
            inactive-text="不操作"
          >
          </el-switch>
        </el-form-item>

        <div v-if="formBscribe.valueIs">
          <el-form-item  prop="status">
               <span slot="label">
                资费选择
                <el-tooltip placement="right">
                  <div slot="content">
                    选择充值资费组 与 资费计划 进行充值
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>

            <el-select
              v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
              v-model="formBscribe.package_id"
              placeholder="资费组"
              clearable
              ref="packageSel"
              @change="packageChange"
              size="small"
              style="width: 210px"
            >
              <el-option
                v-for="dict in packageOptions"
                :key="dict.package_id"
                :label="dict.package_agentname"
                :value="dict.package_id"
              />
            </el-select>

            <el-select
              v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
              v-model="formBscribe.packet_id"
              placeholder="资费计划"
              clearable
              @change="PacketSelChange"
              size="small"
              style="width: 210px"
            >
              <el-option
                v-for="dict in PacketSelOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item  prop="status">
              <span slot="label">
                生效类型
                <el-tooltip placement="right">
                  <div slot="content">
                    选择  资费计划 时生效类型会根据当前资费计划切换为推荐类型
                    <br />当然，生效类型是可选择的 灵活的，可根据实际需求切换。
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>

            <el-select
              v-model="formBscribe.validate_type"
              placeholder="生效类型"
              clearable
              ref="packageSel"
              size="small"
              @change="validateTypeChange"
              style="width: 210px"
            >
              <el-option
                v-for="dict in validateTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
                <span slot="label">
                  资费详情
                  <el-tooltip placement="right">
                    <div slot="content">
                      资费计划详情
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>

            <el-row >
              <el-col :span="4" >
                <span>资费周期 : </span>  <el-tag size="small">{{packet.packet_valid_time}}</el-tag>
              </el-col>
              <el-col :span="4" ><span>周期单位 : </span><el-tag size="small">{{packet.packet_valid_name}}</el-tag></el-col>
              <el-col :span="8"  ><span>周期用量MB : </span><el-tag size="small">{{packet.packet_flow}}</el-tag></el-col>
            </el-row>
          </el-form-item>

        </div>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBscribe">确 定</el-button>
        <el-button @click="orderFlow = false">取 消</el-button>
      </div>
    </el-dialog>



    <!--API续费订单审核-->
    <el-dialog title="API续费订单审核" :visible.sync="auditShow" width="30%" append-to-body>
      <el-form ref="formCard" :model="auditForm" :inline="true">
        <el-form-item  style="margin-top:10px">
           <span slot="label">
               审核是否通过：
           </span>
          <el-select
            v-model="auditForm.is_audit"
            placeholder="请选择"
            size="small"
            style="width: 110px"
          >
            <el-option
              v-for="dict in customize_whether"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>

        </el-form-item>
        <el-form-item style="margin-top:10px">
           <span slot="label">
                回调通知:
            </span>
          <el-switch
            style="margin-left: 10px"
            v-model="auditForm.notice"
            active-color="#13ce66"
            active-text="通知"
            inactive-text="不操作"
          >
          </el-switch>
        </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subAudit">确 定</el-button>
        <el-button @click="auditShow = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { FindPacket } from "@/api/yunze/flowcard/rechargeTariff";
import {Exportallorders, listOrder, queryPacketSimple,NoTbscribe,AddpackageTime,orderAudit} from "@/api/yunze/order/order";
import {  queryPackageSimple} from "@/api/yunze/flowcard/card/card";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import tools from "@/utils/yunze/tools";



export default {
  name: "OrderTariff",
  components: { Treeselect },
  data() {
    return {
      batch_sel_order_type:[],//批量查询条件
      switch:true,//搜索切换显示
      submitFileFormBtn: true,//导入 btn
      CardBindingForm:{
        bind_type:'2',
        imei:null,
        contactName:null,
        iccid:null,
        contactPhone:null
      },

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

      tools:tools,
      deptCheckStrictly: true,
      deptExpand: true,
      deptNodeAll: false,
      Divide_show: false,//卡划分
      cardDivide: false,//卡划分 保存
      CardBindingShow: false,//机卡绑定 操作界面
      dialogVisible: false,
      treeData: [],
      selectList: [],
      userArr:[],//企业下用户数组

      orderFlow:false,//退订控制
      auditShow:false,//审核显示
      order:"",

      auditForm: {
        is_audit: '1',
        notice: false,

      },


      formBscribe: {
        radio: 'update',
        valueIs: false,
        package_id: null,
        packet_id: null,
        validate_type: null,


      },

      Payment_method: [], // 支付方式
      customize_whether: [], //加包执行
      orderStatusOptions: [],//订单状态
      payTypeOptions: [],//支付类型
      creTypeOptions: [],//生成方式
      validateTypeOptions: [],//生效类型
      PacketOptions: [],//资费计划
      PacketSelOptions:[],//资费计划查询
      OrderStartAndEndTypeOptions:[],//订单查询起止条件
      DeptOptions:[],//所属企业
      OrderStateOptions:[],//订单支付状态

      SetMealImport:false, //详情查询 套餐信息
      ifsel:false, //详情查询 只是只读
      show_ds:false, //详情查询
      selTime:'',//时间选择
      mainwidth:24,//宽度
      option_show:false, //公司所属查询
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
      // 企业名称
      deptName: undefined,
      //划卡企业
      treeName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      typeOptions: [],
      // 连接管理时间查询类型 数据字典
      timetypeOptions: [],
      // 简要套餐名称
      packageOptions: [],

      //详情
      tablefrom: [],

      FlowData : [],
      selIccid:[{FlowData:''}],
      activeNames:[0],
      cardNumberAge: [],//选择卡号
      //勾选操作
      IsUpdInfo:false,
      //订单状态
      status_type: "",
      // 订单交易类型 字典
      orderTypeOptions: [],
      // 运营商类别 字典
      operators_type: [],

      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 勾选数组
      TickArray: [],
      PublicArrList: [],
      queryUpd: {
        UpdaArr: null,
      },
      // 表单参数
      form: {

      },
      formDivide: {
        dept_id:'',
        user_id:'',
      },
      defaultProps: {
        children: "children",
        label: "label"
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
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/yunze/order/cardNumberAge",
        Pstr:'',//携带参数
      },
      //当前查询参数
      sel:{
        iccid:'',
        agent_id:'',
        package_id:'',
      },
      packet:{
        packet_flow:'-',
        packet_valid_time:'-',
        packet_valid_name:'-'
      },
      // 查询参数
      queryParams: {
        Bcvalue:'',// 文本域字符串
        pageNum: 1,
        pageSize: 10,
        type: null,
        value: null,
        timetype: null,
        staTime: null,
        endTime: null,
        agent_id: null,
        is_pool: null,
        pool_id: null,
        channel_id: null,
        del_flag: "0",
        Addpackage: null,
        payment: null,
        status_id:null,
        package_id:null,
        StartAndEndtype:null,
        StartValue:null,
        EndValue:null,
        cd_operator_type:null,
        selType:'Tariff',
        UpType: null,
        is_audit: null,
        UpArrList: [],
        ord_type: null,
        UpdaArr: [],
        cre_type: null,
        batch_query_arr:[] ,//拆分后的数组
        batch_query_type:null,  //批量查询条件
      },
      // 列信息
      columns: [
        { key: 0, label: `交易名称`, visible: true },
        { key: 1, label: `订单号`, visible: true },
        { key: 2, label: `交易类型`, visible: true },
        { key: 3, label: `ICCID`, visible: true },
        { key: 4, label: `微信订单号`, visible: true },
        { key: 5, label: `支付状态`, visible: true },
        { key: 6, label: `交易金额`, visible: true },
        { key: 7, label: `交易后金额`, visible: true },
        { key: 8, label: `支付方式`, visible: true },
        { key: 9, label: `生成方式`, visible: true },
        { key: 10, label: `所属公司`, visible: true },
        { key: 11, label: `创建时间`, visible: true },
        { key: 12, label: `备注`, visible: true },
        { key: 13, label: `生效类型`, visible: true },
        { key: 14, label: `资费计划`, visible: true },
        { key: 15, label: `是否分润`, visible: true },
        { key: 16, label: `是否C端显示`, visible: true },
        { key: 17, label: `是否已加包`, visible: true },
        { key: 18, label: `是否C端显示`, visible: true },
        { key: 19, label: `open_id`, visible: true },

      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选企业树
    deptName(val) {
      this.$refs.dept.filter(val);

    },
    // 根据名称筛选企业树
    treeName(val) {
      this.$refs.tree.filter(val);
    }
  },

  created() {
    let str = this.$route.params.Pstr;
    this.queryParams.batch_query_type='1';


    //加载 查询条件
    if(window['order_seltype']!=undefined &&  window['order_seltype']!=null && window['order_seltype']!=''){
      this.typeOptions = window['order_seltype'];
    }else{
      this.getDicts("yunze_order_seltype").then(response => {
        window['order_seltype'] = response.data;
        this.typeOptions = window['order_seltype'];
      });
    }


    //加载 资费组名称
    if(window['packageOptions']!=undefined &&  window['packageOptions']!=null && window['packageOptions']!=''){
      this.packageOptions = window['packageOptions'];
    }else{
      queryPackageSimple().then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        window['packageOptions'] = jsonobj.Data;
        this.packageOptions = window['packageOptions'];
      });
    }


    //加载 时间赛选查询条件
    if(window['order_sel_timetype']!=undefined &&  window['order_sel_timetype']!=null && window['order_sel_timetype']!=''){
      this.timetypeOptions = window['order_sel_timetype'];
    }else{
      this.getDicts("yunze_order_sel_timetype").then(response => {
        window['order_sel_timetype'] = response.data;
        this.timetypeOptions = window['order_sel_timetype'];
      });
    }

    // 支付方式：w微信支付-b余额支付-s平台记录
    if(window['Payment_method']!=undefined &&  window['Payment_method']!=null && window['Payment_method']!=''){
      this.Payment_method = window['Payment_method'];
    }else{
      this.getDicts("yunze_card_pay_type").then(response => {
        window['Payment_method'] = response.data;
        this.Payment_method = window['Payment_method'];
      });
    }


    //加载 自定义 是否 0 1 否 是
    if (window['customize_whether'] != undefined && window['customize_whether'] != null && window['customize_whether'] != '') {
      this.customize_whether = window['customize_whether'];
    } else {
      this.getDicts("yunze_customize_whether").then(response => {
        window['customize_whether'] = response.data;
        this.customize_whether = window['customize_whether'];
      });
    }



    //加载 订单交易类型
    if(window['orderTypeOptions']!=undefined &&  window['orderTypeOptions']!=null && window['orderTypeOptions']!=''){
      this.orderTypeOptions = window['orderTypeOptions'];
    }else{
      this.getDicts("yunze_order_type").then(response => {
        window['orderTypeOptions'] = response.data;
        this.orderTypeOptions = window['orderTypeOptions'];
      });
    }

    //加载 订单状态
    if(window['orderStatusOptions']!=undefined &&  window['orderStatusOptions']!=null && window['orderStatusOptions']!=''){
      this.orderStatusOptions = window['orderStatusOptions'];
    }else{
      this.getDicts("yunze_order_status").then(response => {
        window['orderStatusOptions'] = response.data;
        this.orderStatusOptions = window['orderStatusOptions'];
      });
    }

    //加载 支付类型
    if(window['payTypeOptions']!=undefined &&  window['payTypeOptions']!=null && window['payTypeOptions']!=''){
      this.payTypeOptions = window['payTypeOptions'];
    }else{
      this.getDicts("yunze_card_pay_type").then(response => {
        window['payTypeOptions'] = response.data;
        this.payTypeOptions = window['payTypeOptions'];
      });
    }

    //加载 生成方式
    if(window['creTypeOptions']!=undefined &&  window['creTypeOptions']!=null && window['creTypeOptions']!=''){
      this.creTypeOptions = window['creTypeOptions'];
    }else{
      this.getDicts("yunze_order_creType").then(response => {
        window['creTypeOptions'] = response.data;
        this.creTypeOptions = window['creTypeOptions'];
      });
    }




    //加载 自定义 是否 0 1 否 是
    if(window['customize_whether']!=undefined &&  window['customize_whether']!=null && window['customize_whether']!=''){
      this.customize_whether = window['customize_whether'];
    }else{
      this.getDicts("yunze_customize_whether").then(response => {
        window['customize_whether'] = response.data;
        this.customize_whether = window['customize_whether'];
      });
    }


    //加载 资费计划生效类别
    if(window['validateTypeOptions']!=undefined &&  window['validateTypeOptions']!=null && window['validateTypeOptions']!=''){
      this.validateTypeOptions = window['validateTypeOptions'];
    }else{
      this.getDicts("yunze_card_takeEffect_type").then(response => {
        window['validateTypeOptions'] = response.data;
        this.validateTypeOptions = window['validateTypeOptions'];
      });
    }



    //加载 企业名称
    if(window['DeptOptions']!=undefined &&  window['DeptOptions']!=null && window['DeptOptions']!=''){
      this.DeptOptions = window['DeptOptions'];
    }else{
      this.getDeptName().then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        window['DeptOptions'] = jsonobj.Data;
        this.DeptOptions = window['DeptOptions'];
      });
    }



    //加载 企业名称
    if(window['PacketOptions']!=undefined &&  window['PacketOptions']!=null && window['PacketOptions']!=''){
      this.PacketOptions = window['PacketOptions'];
    }else{
      queryPacketSimple().then(response => {
        let jsonobj =  JSON.parse(tools.Decrypt(response));
        window['PacketOptions'] = jsonobj.Data;
        let arr = jsonobj.Data;
        var new_map = {},
          dest = [];
        if(arr!=null && arr.length>0){
          for(var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            if(!new_map[ai.package_id]) { //依赖分组字段可自行更改！
              dest.push({
                package_id: ai.package_id, //依赖分组字段可自行更改！
                data: [ai]
              });
              new_map[ai.package_id] = ai; //依赖分组字段可自行更改！
            } else {
              for(var j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if(dj.package_id == ai.package_id) { //依赖分组字段可自行更改！
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }
          //存储资费计划
          for (let i = 0; i < dest.length; i++) {
            let obj = dest[i];
            window['PackageOptions_'+obj.package_id] = obj.data;
            //存储生效类型
            if(obj.data!=null && obj.data.length>0){
              for (let j = 0; j < obj.data.length; j++) {
                let Pobj = obj.data[j];
                window['validateTypeOptions_'+Pobj.dictValue] = Pobj.packet_valid_type;
              }
            }
          }
        }


        this.PacketOptions = window['PacketOptions'];


        this.getTreeselect();



        if(str!=null && str!='' && str.length>0){
          var reg_1 = new RegExp( "%2F" , "g" );
          var reg_2 = new RegExp( " " , "g" );
          str = str.replace(reg_1, "/");//转义 /
          str = str.replace(reg_2, "+");//转义 [ ]  》 +
          //console.log(str);
          let jsonobj =  JSON.parse(tools.Decrypt(str));
          //console.log(jsonobj);
          if(jsonobj!=null ){
            this.queryParams = jsonobj;
            if(jsonobj.staTime!=undefined && jsonobj.staTime!=null && jsonobj.staTime.length>0){
              this.selTime[0] = jsonobj.staTime;
              this.selTime[1] = jsonobj.endTime;
            }
          }
          this.getList();
        }else{
          this.getList();
        }



      });
    }



    //加载 起止条件查询类别
    if(window['OrderStartAndEndTypeOptions']!=undefined &&  window['OrderStartAndEndTypeOptions']!=null && window['OrderStartAndEndTypeOptions']!=''){
      this.OrderStartAndEndTypeOptions = window['OrderStartAndEndTypeOptions'];
    }else{
      this.getDicts("yunze_order_StartAndEnd_type").then(response => {
        window['OrderStartAndEndTypeOptions'] = response.data;
        this.OrderStartAndEndTypeOptions = window['OrderStartAndEndTypeOptions'];
      });
    }


    //加载 订单状态
    if(window['OrderStateOptions']!=undefined &&  window['OrderStateOptions']!=null && window['OrderStateOptions']!=''){
      this.OrderStateOptions = window['OrderStateOptions'];
    }else{
      this.getDicts("yunze_order_status").then(response => {
        window['OrderStateOptions'] = response.data;
        this.OrderStateOptions = window['OrderStateOptions'];
      });
    }
    //加载 批量查询类型
    if(window['batch_sel_order_type']!=undefined &&  window['batch_sel_order_type']!=null && window['batch_sel_order_type']!=''){
      this.batch_sel_order_type = window['batch_sel_order_type'];
    }else{
      this.getDicts("batch_sel_order_type").then(response => {
        window['batch_sel_order_type'] = response.data;
        this.batch_sel_order_type = window['batch_sel_order_type'];
      });
    }

    //加载 卡号类别
    if (window['cardNumberAge'] != undefined && window['cardNumberAge'] != null && window['cardNumberAge'] != '') {
      this.cardNumberAge = window['cardNumberAge'];
    } else {
      this.getDicts("cardNumberAge").then(response => {
        window['cardNumberAge'] = response.data;
        this.cardNumberAge = window['cardNumberAge'];
      });
    }


    //条件查询 默认选择第一个
    this.queryParams.type = '1';


  },
  methods: {
    //切换文本域输入
    switchMode(){ //切换搜索方式

      let sw=this.switch
      if (sw==true){
        this.switch= false
      }
      if (sw!=true){
        this.switch=true
      }
    },

    /**退订按钮*/
    Unsubscribe(){
      // 清空
      this.formBscribe ={
        radio: 'update',
        valueIs: false,
        package_id: null,
        packet_id: null,
        validate_type: null,
      };
      this.orderFlow = true;
      this.order = "";
    },

    validateTypeChange(){

    },
    /**勾选操作*/
    ShowUpdInfo(){
      this.IsUpdInfo = !this.IsUpdInfo;
    },

    /**资费组选择*/
    packageChange(){
      if(tools.Is_null(this.formBscribe.package_id)){
        //console.log(window['PackageOptions_'+this.queryParams.package_id]);
        //重置选项
        this.formBscribe.packet_id =null;
        this.formBscribe.validate_type =null;
        this.PacketSelOptions = window['PackageOptions_'+this.formBscribe.package_id];
        this.packet.packet_flow = '-';
        this.packet.packet_valid_time = '-';
        this.packet.packet_valid_name = '-';
      }
    },

    //资费计划切换
    PacketSelChange(){
      if(tools.Is_null(this.formBscribe.packet_id)){
        this.formBscribe.validate_type =  ""+window['validateTypeOptions_'+this.formBscribe.packet_id];
        let map = {};
        map.package_id = this.formBscribe.package_id;
        map.packet_id = this.formBscribe.packet_id;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        FindPacket(Pwd_Str).then(response => {
          let jsonobj =  JSON.parse(tools.Decrypt(response));
          if(jsonobj.code==200){
            this.packet = jsonobj.Data;
          }else{
            this.msgError("查询单条 资费计划  简要 异常！");
          }
        });
      }
    },

    /**退订确定按钮*/
    submitBscribe(){
      let _this = this;
      if (this.formBscribe.valueIs == true){
        if (tools.VerificationsText(_this, _this.formBscribe.package_id, "请选择资费组！") == true &&
          tools.VerificationsText(_this, _this.formBscribe.packet_id, "请选择资费计划！") == true &&
          tools.VerificationsText(_this, _this.formBscribe.validate_type, "请选择生效类型！") == true ){
          tools.openAsk(this, 'warning', "确定将筛选 [ " + this.total + " ] 条数据" );
          let obj = Object.assign(this.queryParams, this.formBscribe);//两个map合并
          //console.log(obj)
          let Pwd_Str = tools.encrypt(JSON.stringify(obj));
          tools.openAsk(this, 'warning', "确定将筛选 [ " + this.total + " ] 条数据",this.TextElse, Pwd_Str);
        }
      }else {
        let obj = Object.assign(this.queryParams, this.formBscribe);//两个map合并
        // console.log(obj)
        // console.log(this.formBscribe.radio)
        //console.log(obj)

        let Pwd_Str = tools.encrypt(JSON.stringify(obj));
        tools.openAsk(this, 'warning', "确定将筛选 [ " + this.total + " ] 条数据",this.TextElse, Pwd_Str);
      }
    },

    /**API续费审核确定*/
    subAudit(){
      let _this = this;
      let title = '';
      if (this.PublicArrList.length > 0){
        _this.$confirm('【API续费审核】-->订单号 [' + _this.PublicArrList.length + '] 张, ' + title + '是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          if (tools.VerificationsText(_this, _this.auditForm.is_audit, "请选择审核状态！") == true ){
            let map = {};
            map.is_audit = _this.auditForm.is_audit;
            map.notice = _this.auditForm.notice;
            map.idArr = _this.PublicArrList;
            console.log(map)
            let Pwd_Str = tools.encrypt(JSON.stringify(map));
            orderAudit(Pwd_Str).then(response => {
              let jsonobj = JSON.parse(tools.Decrypt(response));
              //console.log(jsonobj);
              if (jsonobj.code == 200) {
                this.msgSuccess(jsonobj.msg);
                this.getList();
              }else{
                this.msgError(jsonobj.msg);
              }
            })

          }

        }).catch(()=>{});
      }else {
        tools.open(_this, "请勾选需要操作的卡号！");
      }
    },
    //else 下面的操作
    TextElse(Pwd_Str){
      NoTbscribe(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        // console.log(jsonobj);
        if (jsonobj.code == 200) {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgSuccess(msg);
          this.orderFlow = false;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })
    },

    /**下面是勾选操作*/
    PublicMethod() {
      this.PublicMethodFilter(false);
    },

    /**下面是勾选操作 过滤 已经审核卡号*/
    PublicMethodFilter(bool) {
      let _this = this;
      _this.TickArray = _this.$refs.multipleTable.selection;
      let max = 500;
      let noApi = 0;
      if (this.TickArray.length <= max){
        this.$refs.multipleTable.clearSelection();//清除选中
        let ord_no =[];
        for (let i = 0; i < _this.TickArray.length; i++) {
          let obj = _this.TickArray[i];
          if(bool){
            if(obj.cre_type=="api" ){
              ord_no.push(obj.id);
            }else{
              noApi +=1;
            }
          }else{
            ord_no.push(obj.id);
          }
        }
        this.PublicArrList = ord_no;
        _this.queryParams.UpdaArr = ord_no; //自己定义 UpdaArr
        if(noApi>0){
          this.msgSuccess("已为您过滤非API 提交" + noApi + " 个号码！");
        }
      }else {
        tools.open(_this, "一次最多操作" + max + "个号码！");
      }
    },






    /**勾选执行加包*/
    SleAddpackage(){
      this.PublicMethod();
      let _this = this;
      let title = '';
      if (this.TickArray.length > 0){
        _this.$confirm('批量【加包】-->订单号 [' + _this.PublicArrList.length + '] 张, ' + title + '是否继续?', '提示', {
          type: 'warning'
        }).then(() => {

          let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
          AddpackageTime(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if (jsonobj.code == 200) {
              this.msgSuccess(jsonobj.Data);
              this.getList();
            }else{
              this.msgError(jsonobj.Data);
            }
          })
        }).catch(()=>{});
      }else {
        tools.open(_this, "请勾选需要操作的卡号！");
      }
    },

    /**勾选 审核API提价充值订单*/
    auditOrder(){
      this.PublicMethodFilter(true);
      let _this = this;
      let title = '';
      if (this.PublicArrList.length > 0){
        this.auditShow = true;
      }else {
        tools.open(_this, "请勾选需要操作的卡号！");
      }
    },



    //手动执行加包
    manualaddPackage(row){
      let opArr = [];
      opArr.push(row.id);
      this.queryParams.UpdaArr = opArr;

      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      AddpackageTime(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.Data);
          this.getList();
        }else{
          this.msgError(jsonobj.Data);
        }
      })

    },

    SelectChange(){
      this.getPwd_Str();
    },
    // 加密数据
    getPwd_Str() {
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      this.upload.Pstr = Pwd_Str;
    },
    /** 导入查询 按钮*/
    Importquery(){
      this.upload.title = "导入查询";
      this.queryParams.UpArrList = [];
      this.queryParams.UpType = "";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    //导入查询
    handlenumberFile(response, file, fileList){
      let jsonobj = JSON.parse(tools.Decrypt(response.msg));
      //console.log(jsonobj.Pmap)
      if (response.code == 200) {
        this.cardList = jsonobj.Data;
        this.total = jsonobj.Pu.rowCount;
        this.queryParams = jsonobj.Pmap;
      } else {
        this.msgError(jsonobj.msg);
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.submitFileFormBtn = true;
    },
    importCardSel() {
      let map = {};
      map.path = "/getcsv/ImportCardSel.cvs";
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API + "/yunze/ExecutionTask/downloadConversion?Pstr=" + Pwd_Str, '_blank');
    },
    // 提交上传文件
    submitNumber(){
      let _this = this;
      this.SelectChange();
      this.submitFileFormBtn = false;
      if (tools.Is_null(this.queryParams.UpType)
      ) {
        this.titleUp(_this);
      } else {
        this.submitFileFormBtn = true;
        tools.open(this, "请选择需要设置更新的属性条件！")
      }
    },
    titleUp(_this) {
      let msg = '';
      if (tools.Is_null(_this.queryParams.UpType)) {
        msg += ' 导入查询 卡号类型  ' + tools.getPackageNNamekeyValue(packageOptions, _this.queryParams.UpType) + '  ';
      }
      msg += ' 是否确定以上操作 ？ ';
      tools.openAsk(this, 'warning', msg, this.uploadUp, _this, this.FalseFun, null);
    },
    uploadUp(_this) {
      _this.$refs.upload.submit();
    },

    FalseFun(Pwd_Str) {
      this.submitFileFormBtn = true;
    },
    /*获取查询参数*/
    getParams(){
      this.queryParams.staTime = null;
      this.queryParams.endTime = null;
      this.queryParams.agent_id = null;
      if(tools.Is_null(this.queryParams.timetype) && this.selTime !=null){
        //console.log(this.selTime);
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
      if(this.$refs.dept!=undefined & this.$refs.dept!=null & this.$refs.dept!='undefined' ){
        //console.log(this.$refs.dept.getCheckedKeys());
        if(this.$refs.dept.getCheckedKeys().length>0){
          this.queryParams.agent_id = this.$refs.dept.getCheckedKeys();
        }
      }

      this.queryParams.batch_query_arr = [];
      if (this.switch==false){
        if(this.queryParams.Bcvalue!='' & this.queryParams.Bcvalue!=null){
          let rMap = tools.textareaGetNotRepeating(this.queryParams.Bcvalue);
          let repeatCount = rMap.repeatCount;
          if(repeatCount>0){
            tools.open(this,"已过滤重复号码 [ "+repeatCount+" ] 条！");
          }
          this.queryParams.batch_query_arr=rMap.rArr;
          this.queryParams.type=null;
          this.queryParams.value=null;
        }
      }


      this.queryParams.batch_query_arr = tools.Is_null(  this.queryParams.batch_query_arr) ?  this.queryParams.batch_query_arr : null;
      this.queryParams.StartValue = tools.Is_null(this.queryParams.StartValue)?this.queryParams.StartValue:null;
      this.queryParams.EndValue = tools.Is_null(this.queryParams.EndValue)?this.queryParams.EndValue:null;


    },


    /** 查询列表 */
    getList() {
      this.loading = true;
      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      //console.log(Pwd_Str);
      listOrder(Pwd_Str).then(response => {
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
    /*代理查询拓展*/
    agentShow(){
      let _this = this;
      _this.option_show=!_this.option_show;
      _this.mainwidth = _this.option_show?20:24;
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

    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.agent_id = [data.id];
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    ViewDetails(row) {
      //console.log(row);
      this.show_ds = true;
      this.form.add_package = tools.getDkeyValue(customize_whether,row.add_package);
      this.form.packetName = tools.getDkeyValue(PacketOptions,row.packet_id);
      this.form.add_package_time = row.add_package_time;
      this.form.add_parameter = tools.formatJson(row.add_parameter);


    },




    /** 导出按钮操作 */
    handleExport() {

      this.getParams();
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      Exportallorders(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.Data);
        }else{
          let msg = jsonobj.Data!=null && jsonobj.Data!=''?jsonobj.Data:jsonobj.msg;
          // this.msgError(msg);
        }

      })

    },
    /**资费组选择*/
    packageSelChange(){
      if(tools.Is_null(this.queryParams.package_id)){
        //console.log(window['PackageOptions_'+this.queryParams.package_id]);
        this.PacketSelOptions = window['PackageOptions_'+this.queryParams.package_id];
      }
    },



    //同步订单状态
    SynStatus(iccid){
      let map = {};
      map.iccid = iccid;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      SynCarStatus(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.getList();
        }else{
          this.msgError(jsonobj.msg);
        }
      })
    },
    //同步用量
    SynFlow(iccid){
      this.loading = true;
      let map = {};
      map.iccid = iccid;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      SynCarFlow(Pwd_Str).then(response => {
        this.loading = false;
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.getList();
        }else{
          this.msgError(jsonobj.msg);
        }
      })
    },





  }
};
</script>

<style scoped>

.el-table .cell{
  line-height: 17px;
  padding-left: 10px;
  padding-right: 0px;
}

.el-form-item {
  margin-bottom: 10px;
}

</style>

