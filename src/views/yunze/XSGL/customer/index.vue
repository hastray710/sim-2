<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :span="mainwidth" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="一级分类">
            <el-select v-model="queryParams.oneIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerOneCategoryOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类">
            <el-select v-model="queryParams.TowIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerTowCategoryOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="回收">
            <el-select v-model="queryParams.is_Recycle" size="small" clearable style="width:100px;" placeholder="请选择">
              <el-option
                v-for="item in customize_whether"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="来源">
            <el-select v-model="queryParams.sourceIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerSourceOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="级别">
            <el-select v-model="queryParams.gradeIdArr" multiple placeholder="请选择">
              <el-option
                v-for="item in CustomerGradeOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="地址">
            <template>
              <div>
                <el-cascader
                  size="large"
                  :options="selFindoptions"
                  v-model="SelselectedOptions"
                  style="width: 400px;"
                  @change="SelhandleChange">
                </el-cascader>
              </div>
            </template>
          </el-form-item>


          <el-form-item label="时间类型" prop="status">
            <el-select
              v-model="queryParams.timetype"
              placeholder="时间类型"
              clearable
              size="small"
              style="width: 130px"
            >
              <el-option
                v-for="dict in timetypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="selTime"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="合伙人">
            <el-select v-model="queryParams.affiliation_id" clearable placeholder="请选择">
              <el-option
                v-for="item in PartnerOption"
                :key="item.user_id"
                :label="item.nick_name"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="销售">
            <el-select v-model="queryParams.sales_idArr" multiple clearable :disabled="clearableBool" placeholder="请选择">
              <el-option
                v-for="item in SalesOption"
                :key="item.user_id"
                :label="item.nick_name"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>

        </el-form>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
              v-hasPermi="['yunze:XsglCustomer:add']"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleImport"
              v-hasPermi="['yunze:XsglCustomer:import']"
            >批量上传
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-user"
              size="mini"
              @click="handleDivide({'IsAdmin':true})"
              v-hasPermi="['yunze:XsglCustomer:Divide']"
            >客户划分
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-user"
              size="mini"
              @click="handleDivide({'IsAdmin':false})"
              v-hasPermi="['yunze:XsglCustomer:Divide']"
            >回收客户
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" v-hasPermi="['yunze:Customer:list']" @queryTable="getList"
                         :columns="columns"></right-toolbar>
        </el-row>
      </el-form>

        <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
          <el-table-column label="名称" align="center" key="c_name" prop="c_name" v-if="columns[0].visible"
                           :show-overflow-tooltip="true" width="350"/>
          <el-table-column label="级别" align="center" key="grade_id" prop="grade_id" v-if="columns[1].visible"
                           width="50">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(CustomerGradeOption, scope.row.grade_id) }}
            </template>
          </el-table-column>

          <el-table-column label="一级分类" align="center" key="one_category_id" prop="one_category_id"
                           v-if="columns[2].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(CustomerOneCategoryOption, scope.row.one_category_id) }}
            </template>
          </el-table-column>
          <el-table-column label="二级分类" align="center" key="two_category_id" prop="two_category_id"
                           v-if="columns[3].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(CustomerTowCategoryOption, scope.row.two_category_id) }}
            </template>
          </el-table-column>
          <el-table-column label="来源类型" align="center" key="source_id" v-if="columns[4].visible"
                           :show-overflow-tooltip="true" width="200">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(CustomerSourceOptions, scope.row.source_id) }}
            </template>
          </el-table-column>
          <el-table-column label="省" align="center" key="province" prop="province" v-if="columns[5].visible"/>
          <el-table-column label="市" align="center" key="city" prop="city" v-if="columns[6].visible"/>
          <el-table-column label="区" align="center" key="district" prop="district" v-if="columns[7].visible"/>
          <el-table-column label="详细地址" align="center" key="address" prop="address" v-if="columns[8].visible"
                           width="100" :show-overflow-tooltip="true"/>
          <el-table-column label="合伙人" align="center" key="affiliation_id" prop="affiliation_id"
                           v-if="columns[9].visible">
            <template slot-scope="scope">
              {{ tools.getkeyValue(PartnerOption, "" + scope.row.affiliation_id, "user_id", "nick_name") }}
            </template>
          </el-table-column>
          <el-table-column label="销售" align="center" key="sales_id" prop="sales_id" v-if="columns[10].visible">
            <template slot-scope="scope">
              {{ tools.getkeyValue(SalesOption, "" + scope.row.sales_id, "user_id", "nick_name") }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="state_id" prop="state_id" v-if="columns[11].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(customerStateOptions, scope.row.state_id) }}
            </template>
          </el-table-column>
          <el-table-column label="回收" align="center" key="is_Recycle" prop="is_Recycle" v-if="columns[12].visible">
            <template slot-scope="scope">
              {{ tools.getDkeyValue(customize_whether, scope.row.is_Recycle) }}
            </template>
          </el-table-column>
          <el-table-column label="税号" align="center" key="tax_number" prop="tax_number" v-if="columns[13].visible"
                           width="100" :show-overflow-tooltip="true"/>
          <el-table-column label="备注" align="center" key="remarks" prop="remarks" v-if="columns[14].visible"
                           :show-overflow-tooltip="true" width="200"/>
          <el-table-column label="创建时间" align="center" key="create_time" prop="create_time" v-if="columns[15].visible"
                           width="180"/>
          <el-table-column label="最近修改" align="center" key="modified_time" prop="modified_time"
                           v-if="columns[16].visible" width="180"/>


          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">

              <el-dropdown>
                <el-button type="primary" size="small">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-hasPermi="['yunze:XsglCustomer:upd']"
                                    @click.native="handleUpdate(scope.row,'Edit')">修改
                  </el-dropdown-item>
                  <el-dropdown-item v-hasPermi="['yunze:XsglCustomer:Rate']"
                                    @click.native="handleUpdate(scope.row,'RateSetting')">费率设置
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
      </el-col>
    </el-row>

    <!-- 详情查看 -->

    <el-drawer
      :with-header="false"
      :visible.sync="show_ds"
      :close-on-click-modal="false"
      @close="DrawerClose"
      size="90%">
      <el-scrollbar style="height:1000px;min-height: 100%;">
        <el-card shadow="always">
          <el-form ref="form" :model="form" label-width="160px">
            <el-row>
              <el-col :span="12">
                <el-divider content-position="left">客户账号信息
                  <el-button @click="Close" size="mini" type="primary" style="margin-left: 35px">关闭</el-button>
                </el-divider>
                <el-form-item>
                <span slot="label">
                  客户名称：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      客户名称
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-input v-model="form.c_name" placeholder="请输入 客户名称" :disabled="IsDisabled"/>
                  <el-input v-model="form.dept_id" v-show="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                <span slot="label">
                  来源：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      渠道来源：来自于哪个渠道 如：属于最新渠道，需字典管理 渠道来源 新增 渠道名称；
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.source_id" placeholder="请选择">
                    <el-option
                      v-for="item in CustomerSourceOptions"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item>
                <span slot="label">
                    类型：<span class="redColor">*</span>
                    <el-tooltip placement="right">
                      <div slot="content">
                        企业 或 个人 等
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-select v-model="form.sort_id" placeholder="请选择" @change="sortChange()" :disabled="IsDisabled">
                    <el-option
                      v-for="item in CustomerSortTypeOption"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-show="credit_code_Show">
                <span slot="label">
                    统一社会信用代码：<span class="redColor">*</span>
                    <el-tooltip placement="right">
                      <div slot="content">
                        统一社会信用代码 来源于 天眼查 或 企查查 等；
                        一般指法人和其他组织统一社会信用代码，相当于让法人和其他组织拥有了一个全国统一的“身份证号”。
                        标准规定统一社会信用代码用18位阿拉伯数字或大写英文字母表示，分别是1位登记管理部门代码、1位机构类别代码、6位登记管理机关行政区划码、9位主体标识码、1位校验码。
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.credit_code" placeholder="请输入 统一社会信用代码" :disabled="IsDisabled"/>
                </el-form-item>
                <el-form-item v-show="id_card_Show">
                <span slot="label">
                    身份证：<span class="redColor">*</span>
                    <el-tooltip placement="right">
                      <div slot="content">
                        客户身份证号码
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.id_card" placeholder="请输入 身份证号码" :disabled="IsDisabled"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item prop="cd_code">
                 <span slot="label">
                    一级分类：<span class="redColor">*</span>
                    <el-tooltip placement="right">
                      <div slot="content">
                        企业定位 所属 一级分类
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-select v-model="form.one_category_id" placeholder="请选择">
                    <el-option
                      v-for="item in CustomerOneCategoryOption"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="cd_code">
                 <span slot="label">
                    二级分类：<span class="redColor">*</span>
                    <el-tooltip placement="right">
                      <div slot="content">
                        企业定位 所属 二级分类
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-select v-model="form.two_category_id" placeholder="请选择">
                    <el-option
                      v-for="item in CustomerTowCategoryOption"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>


            <el-row>
              <el-col :span="12">
                <el-form-item>
                <span slot="label">
                    地址信息：<span class="redColor">*</span>
                    <el-tooltip placement="right">
                      <div slot="content">
                        企业 所在地址信息
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <template>
                    <div id="app">
                      <el-cascader
                        size="large"
                        :options="options"
                        v-model="selectedOptions"
                        style="width: 400px;"
                        @change="handleChange">
                      </el-cascader>
                    </div>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="cd_code">
                <span slot="label">
                    客户级别：<span class="redColor">*</span>
                    <el-tooltip placement="right">
                      <div slot="content">
                        客户级别： 如创建 最新级别 需字典管理 客户级别 新增 客户级别详情；
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-select v-model="form.grade_id" placeholder="请选择">
                    <el-option
                      v-for="item in CustomerGradeOption"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item>
                <span slot="label">
                    详细地址：
                    <el-tooltip placement="right">
                      <div slot="content">
                        选填 企业 详细地址
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.address" placeholder="详细地址"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item>
                <span slot="label">
                    备注：
                    <el-tooltip placement="right">
                      <div slot="content">
                        选填 企业 备注
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.remarks" placeholder="备注"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item>
                <span slot="label">
                  企业税号：
                  <el-tooltip placement="right">
                    <div slot="content">
                      企业税号号是税务登记证上的号码，通常简称为“税号”，每个企业的纳税人识别号都是唯一的，由15位、17位、18或者20位码（字符型）组成。
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-input v-model="form.tax_number" placeholder="请输入 税号"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                <span slot="label">
                  别名：
                  <el-tooltip placement="right">
                    <div slot="content">
                      对外展示用
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-input v-model="form.alias" placeholder="请输入 客户别名"/>
                </el-form-item>
                <!-- <el-form-item >
                   <span slot="label" >
                     优惠折扣：
                     <el-tooltip placement="right">
                       <div slot="content">
                         合同 优惠折扣 最低 限制 默认 100%
                       </div>
                       <i class="el-icon-question"></i>
                     </el-tooltip>
                   </span>
                   <el-input v-model="form.Co_Discount" placeholder="请输入 优惠折扣"   />
                 </el-form-item>-->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item>
                <span slot="label">
                  客户状态：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      客户状态：正常 、已停用。（已停用客户，不在新增合同时出现。）
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.state_id" placeholder="请选择" :disabled="IsDisabled">
                    <el-option
                      v-for="item in customerStateOptions"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                <span slot="label">
                  是否回收：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      是否回收：客户是否在 系统设定规定 期限内 未产生成交合同金额 进行回收到 总平台。
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.is_Recycle" placeholder="请选择" :disabled="IsDisabled">
                    <el-option
                      v-for="item in customize_whether"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                <span slot="label">
                  合伙人：
                  <el-tooltip placement="right">
                    <div slot="content">
                      所属合伙人：来源于那个合伙人
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.affiliation_id" clearable placeholder="请选择" :disabled="IsDisabled">
                    <el-option
                      v-for="item in PartnerOption"
                      :key="item.user_id"
                      :label="item.nick_name"
                      :value="item.user_id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>


            <div style="border-radius: 4px;border: 2px solid #ff4949;" v-if="RateSetting_show">
              <el-divider><span style="color: #ff4949;font-size: 20px;">费率设置操作部分</span></el-divider>
              <el-row>
                <el-col :span="8">
                  <el-form-item>
                <span slot="label">
                  合伙人：
                  <el-tooltip placement="right">
                    <div slot="content">
                      所属合伙人：来源于那个合伙人
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-select v-model="form.affiliation_id" clearable placeholder="请选择" :disabled="IsDisabled">
                      <el-option
                        v-for="item in PartnerOption"
                        :key="item.user_id"
                        :label="item.nick_name"
                        :value="item.user_id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                <span slot="label">
                  销售员：
                  <el-tooltip placement="right">
                    <div slot="content">
                      所属销售员：销售员
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-select v-model="form.sales_id" clearable placeholder="请选择" :disabled="IsDisabled">
                      <el-option
                        v-for="item in SalesOption"
                        :key="item.user_id"
                        :label="item.nick_name"
                        :value="item.user_id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item>
                <span slot="label">
                  合伙人费率：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      合伙人费率：当前客户 合伙人 分成比例 5 = 5%
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-input @keydown.native="handleInput2" v-model="form.affiliation_rate"
                              placeholder="请输入 合伙人费率 5 = 5% "/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                <span slot="label">
                  销售费率：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      销售费率：当前客户 销售 分成比例 5 = 5%。
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-input @keydown.native="handleInput2" v-model="form.sales_rate" placeholder="请输入 销售费率 5 = 5% "/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                <span slot="label">
                  售后费率：
                  <el-tooltip placement="right">
                    <div slot="content">
                      售后费率：当前客户 售后 分成比例 5 = 5%。
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-input @keydown.native="handleInput2" v-model="form.afterSale_rate"
                              placeholder="请输入 销售费率 5 = 5% "/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>


            <el-collapse v-model="AccountActiveNames" style="margin-left: 10px; margin-top: 10px;"
                         v-if="!RateSetting_show">
              <el-collapse-item name="0">
                <template slot="title" class="item_iccid">
                  <div style="font-size:20px;"> 客户账号信息</div>
                </template>
                <div>
                  <div>
                    <el-button @click="addAccount()" type="primary" style="margin-left: 3px">新增账号信息</el-button>
                    <el-button @click="loadAccount()" v-if="CustomerEdie" style="margin-left: 5px">加载账号信息</el-button>
                  </div>
                </div>
                <template>
                  <el-table
                    :data="CustomerAccountData"
                    style="width: 100%">
                    <el-table-column
                      prop="Cat_Name"
                      label="开户行账号名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="Cat_Bank_Name"
                      label="银行名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="Cat_Number"
                      label="银行卡号">
                    </el-table-column>
                    <el-table-column
                      prop="Cat_User_Name"
                      label="用户名称">
                    </el-table-column>
                    <el-table-column
                      prop="Cat_Zip_Code"
                      label="邮编">
                    </el-table-column>
                    <el-table-column
                      prop="Cat_Address"
                      label="地址">
                    </el-table-column>
                    <el-table-column
                      prop="Cat_atId"
                      label="地址类型">
                      <template slot-scope="scope">
                        {{ tools.getDkeyValue(AccountAddressTypeOption, '' + scope.row.Cat_atId) }}
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="操作"
                      align="center"
                      width="120"
                      class-name="small-padding fixed-width"
                    >
                      <template slot-scope="scope">

                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-edit"
                          @click="EditAccount(scope.row)"
                        >编辑
                        </el-button>
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
                </template>
              </el-collapse-item>
            </el-collapse>

            <!--联系人-->
            <el-collapse v-model="PeopleActiveNames" style="margin-left: 10px; margin-top: 10px;"
                         v-if="!RateSetting_show">
              <el-collapse-item name="0">
                <template slot="title" class="item_iccid">
                  <div style="font-size:20px;"> 客户联系人信息</div>
                </template>
                <div>
                  <div>
                    <el-button @click="addPeople()" type="primary" style="margin-left: 3px">新增联系人信息</el-button>
                    <el-button @click="loadPeople()" v-if="CustomerEdie" style="margin-left: 5px">加载联系人信息</el-button>
                  </div>
                </div>

                <template>
                  <el-table
                    :data="CustomerPeopleData"
                    style="width: 100%">
                    <el-table-column
                      prop="name"
                      label="姓名"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="telephone"
                      label="联系电话"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="qq"
                      label="QQ">
                    </el-table-column>
                    <el-table-column
                      prop="nailed"
                      label="钉钉">
                    </el-table-column>
                    <el-table-column
                      prop="email"
                      label="邮箱">
                    </el-table-column>
                    <el-table-column
                      prop="remarks"
                      label="备注信息">
                    </el-table-column>
                    <el-table-column
                      prop="job_title"
                      label="职务">
                    </el-table-column>
                    <el-table-column
                      prop="is_maste"
                      label="主联系人">
                      <template slot-scope="scope">
                        {{ tools.getDkeyValue(customize_whether, '' + scope.row.is_maste) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="gender_id"
                      label="性别">
                      <template slot-scope="scope">
                        {{ tools.getDkeyValue(SexTypeOption, '' + scope.row.gender_id) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="state"
                      label="状态">
                      <template slot-scope="scope">
                        {{ tools.getDkeyValue(AccountPeopleStateTypeOption, '' + scope.row.state) }}
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="操作"
                      align="center"
                      width="180"
                      class-name="small-padding fixed-width"
                    >
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-edit"
                          @click="EditPeople(scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-edit"
                          @click="onPreview(scope.row)"
                        >图片查看
                        </el-button>
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-delete"
                          @click="DelPeople(scope.$index,scope.row)"
                        >删除
                        </el-button>
                      </template>
                    </el-table-column>

                  </el-table>
                </template>
              </el-collapse-item>
            </el-collapse>


            <el-collapse v-model="CustomerPicture" style="margin-left: 10px; margin-top: 10px;" v-if="Picture_show">
              <el-collapse-item name="0">
                <template slot="title" class="item_iccid">
                  <div style="font-size:20px;"> 客户图片信息</div>
                </template>
                <div>
                  <el-button @click="PictureAdd()" type="primary" style="margin-left: 3px">新增客户图片</el-button>

                  <el-button @click="getcustomerImgArr('1')" type="primary" style="margin-left: 10px">重载图片</el-button>
                </div>
                <br>
                <el-row class="demo-image" flex-direction="row">
                    <el-col :lg="4" :md="6" :sm="8" :xs="12" class="block" v-for="(fit,index) in customerImgArr" style="margin-bottom: 20px;"
                            :key="index">
                      <div class="box">
                        <el-image
                          class="demo-image__preview"
                          :src="fit.pic_url"
                          fit="scale-down"
                          :preview-src-list="getArrListDeptId()"
                        ></el-image>
                      </div>

                    </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>

          </el-form>

        </el-card>
        <div style="float: right; margin-right: 50px;margin-top: 50px;">
          <el-input v-model="form.cd_id" v-if="false"/>
          <el-button v-if="CustomerAdd" v-hasPermi="['yunze:XsglCustomer:add']" type="primary" @click="Add">新 增
          </el-button>
          <el-button v-if="CustomerEdie" v-hasPermi="['yunze:XsglCustomer:upd']" type="primary" @click="Edie">保 存
          </el-button>
          <el-button v-if="RateSetting_show" v-hasPermi="['yunze:XsglCustomer:Rate']" type="primary" @click="RateUpd">费率
            设置
          </el-button>
        </div>
        <div style="height: 2000px;"></div>
      </el-scrollbar>
    </el-drawer>


    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>


    <!--  新增账户信息 -->
    <el-dialog :title="Accounttitle" :visible.sync="Account_show" width="960px" append-to-body>
      <el-form ref="form" :model="Accountform" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户行">
              <el-input v-model="Accountform.Cat_Name" placeholder="如：中国建设银行股份有限公司济南名泉支行"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行">
              <el-input v-model="Accountform.Cat_Bank_Name" placeholder="如：中国建设银行"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户">
              <el-input v-model="Accountform.Cat_User_Name" placeholder="用户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡号">
              <el-input v-model="Accountform.Cat_Number" placeholder="银行卡号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮编">
              <el-input v-model="Accountform.Cat_Zip_Code"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址类型">
              <el-select
                v-model="Accountform.Cat_atId"
                placeholder="查询条件"
                size="medium"
                style="width: 110px"
              >
                <el-option
                  v-for="dict in AccountAddressTypeOption"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址">
              <el-input v-model="Accountform.Cat_Address" placeholder="如 ：山东省济南市历下区山钢新天地9号楼513室"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasPermi="['yunze:XsglCustomer:add']" v-if="addAccountBtn" type="primary"
                   @click="addAccountPush()">新增
        </el-button>
        <el-button v-hasPermi="['yunze:XsglCustomer:add']" v-if="editPeopleBtn" type="primary"
                   @click="editPeoplePush()">关闭
        </el-button>
      </div>
    </el-dialog>

    <!--  新增 联系人  信息 -->
    <el-dialog :title="Peopletitle" :visible.sync="People_show" width="960px" append-to-body>
      <el-form ref="form" :model="Peopleform" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="Peopleform.name" placeholder="姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="Peopleform.telephone" placeholder="联系电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="QQ">
              <el-input v-model="Peopleform.qq" placeholder="QQ/微信"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钉钉">
              <el-input v-model="Peopleform.nailed" placeholder="钉钉"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="Peopleform.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务">
              <el-input v-model="Peopleform.job_title"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="主联系人">
              <el-select
                v-model="Peopleform.is_maste"
                placeholder="主联系人"
                size="medium"
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
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select
                v-model="Peopleform.gender_id"
                placeholder="性别"
                size="medium"
                style="width: 110px"
              >
                <el-option
                  v-for="dict in SexTypeOption"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select
                v-model="Peopleform.state"
                placeholder="状态"
                size="medium"
                style="width: 110px"
              >
                <el-option
                  v-for="dict in AccountPeopleStateTypeOption"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="Peopleform.remarks"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 图片上传 -->
        <el-row v-if="PictureBtn" v-hasPermi="['yunze:XsglCustomer:Prdedit']">
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
                  ref="uploadPrdImgUpload"
                  action="#"
                  :headers="upload.headers"
                  :action="upload.url"
                  :disabled="upload.isUploading"
                  :multiple="multiple"
                  :accept="acceptConfig"
                  list-type="picture-card"
                  style="border: 1px dashed #c0ccda;"
                  :on-change="customUpload"
                  :on-progress="handleFileUploadProgressUpload"
                  :on-success="handleFileSuccessUpload"
                  :data="{PstrArr:this.Peopleform.PstrArr}"
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
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button v-hasPermi="['yunze:XsglCustomer:add']" v-if="addPeopleBtn" type="primary" @click="addPeoplePush()">
          新增
        </el-button>
        <el-button v-hasPermi="['yunze:XsglCustomer:guest']" v-if="PictureBtn" type="primary" @click="AddImg()">图片新增</el-button>
        <el-button v-if="editPeopleBtn" type="primary" @click="editPeoplePush()">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 新增客户照片信息模板 -->
    <el-dialog :title="Picture" :visible.sync="PictureTemplate" width="960px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <h1>客户照片信息上传图片</h1>
        <!-- 客户照片信息上传图片 -->
        <el-row v-if="CustomerPhotos" v-hasPermi="['yunze:XsglCustomer:guest']">
          <el-col :span="24">
            <ul class="el-upload-list__item  is-ready image-container">
              <vuedraggable>
                <li tabindex="0" class="Mylist__item-thumbnail is-ready draggable-item"
                    v-for="(image, index) in customerImg" :key="index" style=" position: relative;">
                  <img :src="image.uri" alt="" style="width:100%;" class="my_el-upload-list__item-thumbnail"
                       :preview-src-list="getArrList(index)"/>
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
                  ref="uploadPrdImgCat"
                  action="#"
                  :headers="CustomerUpload.headers"
                  :action="CustomerUpload.url"
                  :disabled="CustomerUpload.isUploading"
                  :multiple="multipleCat"
                  :accept="acceptConfigCtr"
                  list-type="picture-card"
                  style="border: 1px dashed #c0ccda;"
                  :on-change="customUploadCtr"
                  :on-progress="handleFileUploadProgressCat"
                  :on-success="handleFileSuccessCat"
                  :data="{PstrFrom:this.form.PstrFrom}"
                  :auto-upload="false" id="MyuploadImgCat"
                >
                  <div slot="file" slot-scope="{file}">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url" alt=""
                    >
                    <span
                      v-if="!disabled"
                      @click="handleRemoveCat(file)"
                    >
                        <i class="el-icon-delete"></i>
                      </span>
                  </div>
                </el-upload>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasPermi="['yunze:XsglCustomer:guest']" type="primary" @click="LoadPictureBtn()">图片新增</el-button>
        <el-button type="primary" @click="editPeoplePush()">关闭</el-button>
      </div>
    </el-dialog>


    <!--  客户划分  信息 -->
    <el-dialog :title="Dividetitle" :visible.sync="CustomerDivide_show" width="960px" append-to-body>
      <el-form ref="form" :model="CtDivideform" label-width="110px">

        <el-row>
          <el-col :span="8" v-if="DivideBool">
            <el-form-item label="划分给销售员">
              <el-select
                v-model="CtDivideform.sales_id"
                placeholder="销售员"
                size="medium"
                style="width: 150px"
              >
                <el-option
                  v-for="item in SalesOption"
                  :key="item.user_id"
                  :label="item.nick_name"
                  :value="item.user_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="RecycleBool">
            <el-form-item label="回收到系统">
              <el-select
                v-model="CtDivideform.sales_id"
                placeholder="总平台"
                size="medium"
                style="width: 150px"
              >
                <el-option
                  v-for="item in AdminOption"
                  :key="item.user_id"
                  :label="item.nick_name"
                  :value="item.user_id"
                />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <template>
              <div>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                             style="float: left;margin-top: 10px;">全选
                </el-checkbox>
                <el-form-item label="名称" style="float: left;" label-width="60px">
                  <el-input v-model="selName" placeholder="名称" style="width: 200px;"
                            @keyup.enter.native="selCustomerName"/>
                </el-form-item>
              </div>
              <div style="float: left;width:100%;">
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{ city.c_name }}</el-checkbox>
                  <!---->
                </el-checkbox-group>
              </div>
            </template>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasPermi="['yunze:XsglCustomer:Divide']" v-if="DivideBool" type="primary"
                   @click="CustomerDivide()">划分
        </el-button>
        <el-button v-hasPermi="['yunze:XsglCustomer:Divide']" v-if="RecycleBool" type="primary"
                   @click="CustomerDivide()">回收
        </el-button>
      </div>
    </el-dialog>

    <el-image
      v-show="false"
      ref="preview"
      class="hideImgDiv"
      :src="url"
      :preview-src-list="srcList"></el-image>


    <!-- 卡板导入对话框 -->
    <el-dialog :title="uploadCustomer.title" :visible.sync="uploadCustomer.open" width="400px" append-to-body>
      <el-upload
        ref="uploadCustomer"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadCustomer.headers"
        :action="uploadCustomer.url + '?updateSupport=' + uploadCustomer.updateSupport"
        :disabled="uploadCustomer.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">注意！：上传时，如上传客户在系统没有对应名称企业信息 会自动创建
          企业管理信息，填写联系人信息时会自动创建登录账号，账号为联系人全拼，密码为(账号+年月日+时 如:feizong2022010107)
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="submitFileFormBtn" @click="submitFileForm">确 定</el-button>
        <el-button @click="uploadCustomer.open = false">取 消</el-button>
      </div>
    </el-dialog>



  </div>
</template>


<script>
import {regionData, regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data';
import {
  getList,
  add,
  find,
  upd,
  ContactsList,
  findSalesPartner,
  CustomerDividefind,
  CustomerDivide,
  CustomerRate,
  urlPictureArr,
  urlPictureList
} from "@/api/yunze/XSGL/customer/customer";
import tools from "@/utils/yunze/tools";
import Treeselect from "@riophae/vue-treeselect";
import {treeselect} from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getToken} from "@/utils/auth";
import $ from 'jquery';
import vuedraggable from 'vuedraggable'

export default {
  name: "customer",
  components: {Treeselect, vuedraggable},
  data() {
    return {
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
      customerImgArr: [],

      submitFileFormBtn: true,//导入 btn
      // 导入参数
      uploadCustomer: {
        // 是否显示弹出层（导入）
        open: false,
        Number: false,
        // 弹出层标题（导入）v
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/yunze/XsglCustomer/importData"
      },

      IsDisabled: true,//是否禁用
      checkAll: false,
      checkedCities: [],
      cities: [],//'上海', '北京', '广州', '深圳'
      isIndeterminate: false,
      cityOptions: [],//'上海', '北京', '广州', '深圳'

      AdminOption: [],
      selName: '',//客户名称检索
      RateSetting_show: false,//费率设置 显示hi

      Picture_show: false,//客户图片信息

      credit_code_Show: true,//统一社会信用代码 展示
      id_card_Show: false,//身份证 展示


      DivideBool: false,//划分按钮
      RecycleBool: false,//回收按钮


      SexTypeOption: [],//性别
      CustomerAccountData_Cache: [],//账户信息 表格 修改时 缓存 最初加载数据
      CustomerAccountData_delArr: [],//账户 数据库 删除的id
      CustomerAccountData: [
        /* {
           Cat_ID: 'AAAAA',
           Cat_Name: 'AAAAAB',
           Cat_Bank_Name: 'AAAAAC',
           Cat_Number: 'AAAAAD',
           Cat_CoID: 'AAAAAe',
           Cat_User_Name: 'AAAAAf',
           Cat_Zip_Code: 'AAAAAg',
           Cat_Address: 'AAAAAh',
           Cat_atId: '1',
         }*/

      ],//账户信息 表格
      Accounttitle: '',
      Account_show: false,//账户信息 显示
      addAccountBtn: false,
      editAccountBtn: false,
      // 账户信息 map
      Accountform: {
        Cat_ID: null,
        Cat_Name: null,
        Cat_Bank_Name: null,
        Cat_Number: null,
        Cat_CoID: null,
        Cat_User_Name: null,
        Cat_Zip_Code: null,
        Cat_Address: null,
        Cat_atId: '1',
      },


      AccountActiveNames: ['0'],//面板默认 展开 【账号】
      PeopleActiveNames: ['0'],//面板默认 展开 【联系人】
      CustomerPicture: ['0'], //面板默认 展开 【客户照片】

      // 时间查询类型 数据字典
      timetypeOptions: [],
      selTime: '',//时间选择
      //客户联系人 数组

      CustomerPeopleData_delArr: [],//联系人 数据库 删除的id
      CustomerPeopleData_Cache: [],//联系人 表格 修改时 缓存 最初加载数据
      CustomerPeopleData: [
        /* {
           id:1,
           cu_id:1,
           name:'AA',
           telephone:'18660430320',
           qq:'546558392',
           nailed:'5465583921',
           email:'546558392@qq.com',
           remarks:null,
           job_title:'技术',
           state:'1',
           is_maste:'1',
           gender_id:'1',
         }*/
      ],
      //联系人 表格
      Peopletitle: '',
      Picture: '',// 模板标题
      People_show: false,//账户信息 显示
      PictureTemplate: false, //模板 显示
      CustomerDivide_show: false,//客户划分 显示
      addPeopleBtn: false,
      LoadPicture: false,
      editPeopleBtn: false,
      PictureBtn: false,
      CustomerPhotos: false,
      //划分联系人
      CtDivideform: {
        sales_id: null,
        CDdeptIdArr: [],
      },

      // 客户联系人 map
      Peopleform: {
        id: null,
        cu_id: null,
        name: null,
        telephone: null,
        qq: null,
        nailed: null,
        email: null,
        remarks: null,
        job_title: null,
        state: '1',
        is_maste: '1',
        gender_id: '0',
        PstrArr: '',
      },

      PartnerOption: [],//合伙人
      SalesOption: [],//销售
      clearableBool: false,//所属销售是否 禁止选择
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


      options: regionData,
      selFindoptions: regionDataPlus,


      CodeToText: CodeToText,
      TextToCode: TextToCode,
      selectedOptions: [],
      SelselectedOptions: [],

      images: [],
      sortImages: !this.images ? [] : [].concat(this.images),

      cterImg: [],
      customerImg: !this.cterImg ? [] : [].concat(this.cterImg), //客户照片 数组

      acceptConfig: 'image/jpeg,image/png,image/jpg,image/gif',
      acceptConfigCtr: 'image/jpeg,image/png,image/jpg,image/gif',//客户
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
        url: process.env.VUE_APP_BASE_API + "/yunze/XsglCustomer/Prdedit",
        PstrArr: '',//携带参数
      },

      // 客户 导入参数
      CustomerUpload: {
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
        url: process.env.VUE_APP_BASE_API + "/yunze/XsglCustomer/guest",
        Pstr: '',//携带参数
      },
      Is_notAddCtr: false,
      Is_notAdd: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,

      //保存 编辑 按钮
      CustomerAdd: false,
      CustomerEdie: false,
      tools: tools,
      deptCheckStrictly: false,
      deptExpand: true,
      deptNodeAll: false,
      show_ds: false,//详情查看
      table_Online: [],//在线状态信息gradeIdArr
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
      multipleCat: true,
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
      //详情
      tablefrom: [],
      imgArr: [],//上传图片

      CatArr: [],//客户图片上传

      SelectImgArr: [],//  商品图片查看图片

      checkStateOption: [], //加载 商品出售状态
      FlowData: [],
      selIccid: [
        {
          Cat_ID: '',
          Cat_Name: 'oooop',
          Cat_Bank_Name: '',
          Cat_Number: '',
          Cat_CoID: '',
          Cat_User_Name: '',
          Cat_Zip_Code: '',
          Cat_Address: '',
          Cat_atId: '',
        }
      ],
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down', '123'],
      activeNames: [0],
      Dividetitle: '',
      //卡状态
      status_type: "",
      // 卡状态 字典
      stateOptions: [
        {
          dictLabel: ''
        }
      ],
      // 客户地址类型
      AccountAddressTypeOption: [],
      AccountPeopleStateTypeOption: [],// 客户 联系人 状态
      // 客户类型
      CustomerSortTypeOption: [],
      // 客户一级分类
      CustomerOneCategoryOption: [],
      // 客户二级分类
      CustomerTowCategoryOption: [],
      // 客户级别
      CustomerGradeOption: [],
      // 客户状态
      customerStateOptions: [],
      CustomerSourceOptions: [],// 客户 来源
      // 渠道来源 字典
      sourceOption: [],
      // 通道编码 字典
      channelCodeOptions: [],
      // 表单参数
      form: {
        id: '',
        c_name: '',
        dept_id: '',
        grade_id: '',
        province: '',
        city: '',
        district: '',
        address: '',
        create_time: '',
        modified_time: '',
        one_category_id: '',
        two_category_id: '',
        remarks: '',
        source_id: '',
        is_Recycle: '',
        affiliation_id: '',
        tax_number: '',
        Co_Discount: '',
        state_id: '',
        sort_id: '',
        credit_code: '',
        id_card: '',
        affiliation_rate: '',
        sales_rate: '',
        afterSale_rate: '',
        sales_id: '',
        alias: '',
        PstrFrom: '',
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
        oneIdArr: [],
        TowIdArr: [],
        sourceIdArr: [],
        gradeIdArr: [],
        sales_idArr: [],
        pageNum: 1,
        pageSize: 10,
        type: null,
        value: null,
        cd_status: [],
        province: null,
        city: null,
        district: null,
        is_Recycle: null,
        affiliation_id: null,

      },

      // 列信息
      columns: [
        {key: 0, label: `名称`, visible: true},
        {key: 1, label: `级别`, visible: true},
        {key: 2, label: `一级分类`, visible: true},
        {key: 3, label: `二级分类`, visible: true},
        {key: 4, label: `来源类型`, visible: true},
        {key: 5, label: `省`, visible: true},
        {key: 6, label: `市`, visible: true},
        {key: 7, label: `区`, visible: true},
        {key: 8, label: `详细地址`, visible: false},
        {key: 9, label: `合伙人`, visible: true},
        {key: 10, label: `销售`, visible: true},
        {key: 11, label: `状态`, visible: true},
        {key: 12, label: `回收`, visible: true},
        {key: 13, label: `税号`, visible: false},
        {key: 14, label: `备注`, visible: false},
        {key: 15, label: `创建时间`, visible: false},
        {key: 16, label: `修改时间`, visible: false},
      ],
      // 表单校验
      rules: {}
    };
  },
  created() {
    let str = this.$route.query.str;


    //加载  销售
    if (window['SalesOption'] != undefined && window['SalesOption'] != null && window['SalesOption'] != '') {
      this.SalesOption = window['SalesOption'];
      this.SetAdminOption();
      this.Sales_execution();//过滤 Btns 权限 销售尽可看自身数据
    } else {
      let map = {};
      map.isSales = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findSalesPartner(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          window['SalesOption'] = jsonobj.Data;
          this.SalesOption = window['SalesOption'];
          //console.log(this.SalesOption)
          this.SetAdminOption();
          this.Sales_execution();//过滤 Btns 权限 销售尽可看自身数据
        } else {
          this.msgError(jsonobj.msg);
        }
      })
    }
    //加载  合伙人
    if (window['PartnerOption'] != undefined && window['PartnerOption'] != null && window['PartnerOption'] != '') {
      this.PartnerOption = window['PartnerOption'];
    } else {
      let map = {};
      map.isPartner = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findSalesPartner(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          window['PartnerOption'] = jsonobj.Data;
          this.PartnerOption = window['PartnerOption'];
        } else {
          this.msgError(jsonobj.msg);
        }
      })

    }


    //加载 系统 性别
    if (window['SexTypeOption'] != undefined && window['SexTypeOption'] != null && window['SexTypeOption'] != '') {
      this.SexTypeOption = window['SexTypeOption'];
    } else {
      this.getDicts("sys_user_sex").then(response => {
        window['SexTypeOption'] = response.data;
        this.SexTypeOption = window['SexTypeOption'];
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
    //加载 客户地址类型
    if (window['AccountAddressTypeOption'] != undefined && window['AccountAddressTypeOption'] != null && window['AccountAddressTypeOption'] != '') {
      this.AccountAddressTypeOption = window['AccountAddressTypeOption'];
    } else {
      this.getDicts("yz_Account_AddressType").then(response => {
        window['AccountAddressTypeOption'] = response.data;
        this.AccountAddressTypeOption = window['AccountAddressTypeOption'];
      });
    }


    //加载 客户 联系人 状态
    if (window['AccountPeopleStateTypeOption'] != undefined && window['AccountPeopleStateTypeOption'] != null && window['AccountPeopleStateTypeOption'] != '') {
      this.AccountPeopleStateTypeOption = window['AccountPeopleStateTypeOption'];
    } else {
      this.getDicts("yz_customer_state").then(response => {
        window['AccountPeopleStateTypeOption'] = response.data;
        this.AccountPeopleStateTypeOption = window['AccountPeopleStateTypeOption'];
      });
    }

    //加载 查询条件
    if (window['customer_selType'] != undefined && window['customer_selType'] != null && window['customer_selType'] != '') {
      this.typeOptions = window['customer_selType'];
    } else {
      this.getDicts("yz_customer_selType").then(response => {
        window['customer_selType'] = response.data;
        this.typeOptions = window['customer_selType'];
      });
    }

    //加载 查询时间类型 条件
    if (window['customer_selTimeType'] != undefined && window['customer_selTimeType'] != null && window['customer_selTimeType'] != '') {
      this.timetypeOptions = window['customer_selTimeType'];
    } else {
      this.getDicts("yz_customer_selTimeType").then(response => {
        window['customer_selTimeType'] = response.data;
        this.timetypeOptions = window['customer_selTimeType'];
      });
    }


    //加载 客户类型
    if (window['CustomerSortTypeOption'] != undefined && window['CustomerSortTypeOption'] != null && window['CustomerSortTypeOption'] != '') {
      this.CustomerOneCategoryOption = window['CustomerOneCategoryOption'];
    } else {
      this.getDicts("yz_CustomerSort_type").then(response => {
        window['CustomerSortTypeOption'] = response.data;
        this.CustomerSortTypeOption = window['CustomerSortTypeOption'];
      });
    }


    //加载 客户一级分类
    if (window['CustomerOneCategoryOption'] != undefined && window['CustomerOneCategoryOption'] != null && window['CustomerOneCategoryOption'] != '') {
      this.CustomerOneCategoryOption = window['CustomerOneCategoryOption'];
    } else {
      this.getDicts("yz_customer_grade_one").then(response => {
        window['CustomerOneCategoryOption'] = response.data;
        this.CustomerOneCategoryOption = window['CustomerOneCategoryOption'];
      });
    }


    //加载 客户二级分类
    if (window['CustomerTowCategoryOption'] != undefined && window['CustomerTowCategoryOption'] != null && window['CustomerTowCategoryOption'] != '') {
      this.CustomerTowCategoryOption = window['CustomerTowCategoryOption'];
    } else {
      this.getDicts("yz_customer_grade_tow").then(response => {
        window['CustomerTowCategoryOption'] = response.data;
        this.CustomerTowCategoryOption = window['CustomerTowCategoryOption'];
      });
    }


    //加载 客户 级别
    if (window['CustomerGradeOption'] != undefined && window['CustomerGradeOption'] != null && window['CustomerGradeOption'] != '') {
      this.CustomerGradeOption = window['CustomerGradeOption'];
    } else {
      this.getDicts("yz_customer_grade").then(response => {
        window['CustomerGradeOption'] = response.data;
        this.CustomerGradeOption = window['CustomerGradeOption'];
      });
    }

    //加载 客户 状态
    if (window['AccountPeopleStateTypeOption'] != undefined && window['AccountPeopleStateTypeOption'] != null && window['AccountPeopleStateTypeOption'] != '') {
      this.customerStateOptions = window['AccountPeopleStateTypeOption'];
    } else {
      this.getDicts("yz_customer_state").then(response => {
        window['AccountPeopleStateTypeOption'] = response.data;
        this.customerStateOptions = window['AccountPeopleStateTypeOption'];
      });
    }
    //加载 客户 来源
    if (window['CustomerSourceOptions'] != undefined && window['CustomerSourceOptions'] != null && window['CustomerSourceOptions'] != '') {
      this.CustomerSourceOptions = window['CustomerSourceOptions'];
    } else {
      this.getDicts("yz_customer_source").then(response => {
        window['CustomerSourceOptions'] = response.data;
        this.CustomerSourceOptions = window['CustomerSourceOptions'];
      });
    }


    // this.getTreeselect();

    //tools.Element_edit();

    // 新增客户
    if (str != null && str != '' && str.length > 0) {
      var reg_1 = new RegExp("%2F", "g");
      var reg_2 = new RegExp(" ", "g");
      str = str.replace(reg_1, "/");//转义 /
      str = str.replace(reg_2, "+");//转义 [ ]  》 +
      //console.log(str);
      let jsonobj = JSON.parse(tools.Decrypt(str));
      if (jsonobj != null && jsonobj.dept_id != null && jsonobj.dept_name != null) {
        console.log(jsonobj)
        this.form.c_name = jsonobj.dept_name;
        this.form.dept_id = jsonobj.dept_id;
        this.form.state_id = '1';
        this.form.is_Recycle = '1';
        this.show_ds = true;
        this.CustomerAdd = true;
        this.CustomerEdie = false;
        this.IsDisabled = false;
        this.RateSetting_show = false;
      }
      //console.log(jsonobj)
    }
    // 查询条件 默认选择第一个
    this.queryParams.type ='1'

  },
  watch: {
    //监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to, from) {
      //做一些路由变化的响应
      //打开加载动画
      this.loading = true;
      let str = this.$route.query.str;

      if (str != null && str != '' && str.length > 0) {
        var reg_1 = new RegExp("%2F", "g");
        var reg_2 = new RegExp(" ", "g");
        str = str.replace(reg_1, "/");//转义 /
        str = str.replace(reg_2, "+");//转义 [ ]  》 +
        //console.log(str);
        let jsonobj = JSON.parse(tools.Decrypt(str));
        if (jsonobj != null && jsonobj.dept_id != null && jsonobj.dept_name != null) {
          this.form.c_name = jsonobj.dept_name;
          this.form.dept_id = jsonobj.dept_id;
          this.form.state_id = '1';
          this.form.is_Recycle = '1';
          this.show_ds = true;
          this.CustomerAdd = true;
          this.CustomerEdie = false;
          this.IsDisabled = false;
        }
        //console.log(jsonobj)
      }
    },
  },
  mounted() {


  },
  methods: {

    //销售执行函数 清除 所属销售其他选项只留自己的
    Sales_execution() {
      let username = tools.getCookie("username");
      //console.log(username)
      if (username != 'admin') {
        //console.log(this.SalesOption)
        if (this.SalesOption != null && this.SalesOption.length > 0) {
          let SalesOption = JSON.parse(JSON.stringify(this.SalesOption));
          this.SalesOption = [];
          for (let i = 0; i < SalesOption.length; i++) {
            let Obj = SalesOption[i];
            if (Obj.user_name == username) {
              let arr = [];
              if (Obj.Btns != null && Obj.Btns.indexOf(',') != -1) {
                arr = Obj.Btns.split(",");
              } else {
                arr = [Obj.Btns]
              }
              if (tools.VerificationValIsArray(arr, "yunze:sys:Sales")) {
                this.SalesOption.push(Obj);
                this.queryParams.sales_idArr = [Obj.user_id];
                this.clearableBool = true;
              } else {
                this.SalesOption = SalesOption;
              }
              break;
            } else {
              if (i == SalesOption.length - 1) {
                this.getList();
              }
            }
          }
        }
        this.getList();
      } else {
        this.getList();
      }
    },


    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.uploadCustomer.open = false;
      this.uploadCustomer.isUploading = false;
      this.$refs.uploadCustomer.clearFiles();
      this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadCustomer.isUploading = true;
    },


    //图片上传处理
    handleFileSuccessUpload(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$message.success(response.msg)
      // this.$refs.uploadPrdImgUpload.clearFiles();
    },
    //客户图片上传处理
    handleFileSuccessCat(response, file, fileList) {
      this.CustomerUpload.open = false;
      this.CustomerUpload.isUploading = false;
      this.$message.success(response.msg)
      // this.$refs.uploadPrdImgCat.clearFiles();
    },
    // 图片上传文件处理
    handleFileUploadProgressUpload(event, file, fileList) {
      this.upload.isUploading = true;
      this.Is_notAdd = true;
    },
    // 客户 图片上传文件处理
    handleFileUploadProgressCat(event, file, fileList) {
      this.CustomerUpload.isUploading = true;
      this.Is_notAddCtr = true;
    },

    /** 导入按钮操作 */
    handleImport() {
      this.uploadCustomer.title = "客户导入";
      this.uploadCustomer.open = true;
      this.submitFileFormBtn = true;
    },

    // 提交上传文件
    submitFileForm() {
      this.submitFileFormBtn = false;
      this.$refs.uploadCustomer.submit();
    },

    SelectChangeCat() {
      this.getPwd_StrCat();
    },
    //加密数据
    getPwd_StrCat() {
      if (this.customerImg.length > 0) {
        let imgArr = [];
        for (let i = 0; i < this.customerImg.length; i++) {
          let obj = this.customerImg[i];
          obj.pic_order = i;
          imgArr.push(obj);
        }
        this.CatArr = imgArr;
      }
      let map = {};
      map.is_master = '1';
      map.dept_id = this.form.dept_id;
      map.CatArr = this.CatArr;
      // console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      this.form.PstrFrom = Pwd_Str;
    },


    /** 下载模板操作 */
    importTemplate() {
      let map = {};
      map.path = "/getcsv/ImportCustomer.cvs";
      map.token = getToken();
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      //console.log(map);
      window.open(process.env.VUE_APP_BASE_API + "/yunze/ExecutionTask/downloadConversion?Pstr=" + Pwd_Str, '_blank');
    },
    /** 新增客户照片信息 */
    PictureAdd() {
      this.Picture = '新增客户照片信息';
      this.PictureTemplate = true;
      this.CustomerPhotos = true;


    },
    /**客户图片新增按钮*/
    LoadPictureBtn() {
      this.SelectChangeCat();

      if(this.customerImg.length > 0){
        if (this.customerImg.length < 10) {
          this.customerImg = [];
          this.cterImg = [];
          this.$refs.uploadPrdImgCat.submit();
        } else {
          this.$message.error('最多上传10张图片！');
        }
      } else {
        this.$message.error('请选择需要上传的格式图片！');
      }


    },

    //客户划分
    CustomerDivide() {
      let _this = this;
      //console.log(_this.checkedCities)
      if (tools.VerificationsText(_this, _this.CtDivideform.sales_id, "请选择 划分销售员！") == true) {
        if (_this.checkedCities != null && _this.checkedCities.length > 0) {
          let map = {}
          map.sales_id = _this.CtDivideform.sales_id;
          map.salesIdArr = _this.checkedCities;
          //console.log(map)
          let Pwd_Str = tools.encrypt(JSON.stringify(map));
          CustomerDivide(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if (jsonobj.code == 200) {
              this.msgSuccess(jsonobj.msg);
              this.CustomerDivide_show = false;
              //更新数据
              this.form.dept_id = '';
              this.form.c_name = '';
              this.queryParams.page = 1;
              this.getList();
            } else {
              let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
              this.msgError(msg);
            }
          })

        } else {
          tools.open(_this, "请选择 需要划分客户！")
        }
      }


    },

    //设置管理员 选项
    SetAdminOption() {
      if (this.SalesOption != null && this.SalesOption.length > 0) {
        this.AdminOption = [];
        for (let i = 0; i < this.SalesOption.length; i++) {
          let Obj = this.SalesOption[i];
          if (Obj.user_id == '1') {
            this.AdminOption.push(Obj);
          }
        }
      }
    },


    //全选
    handleCheckAllChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < this.cityOptions.length; i++) {
          arr.push(this.cityOptions[i].id);
        }
        this.checkedCities = arr;
      } else {
        this.checkedCities = [];
      }

      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },

    /*客户类型切换 */
    sortChange() {
      let sort_id = this.form.sort_id;
      if (sort_id == '1') {
        this.credit_code_Show = true;
        this.id_card_Show = false;
      } else if (sort_id == '2') {
        this.credit_code_Show = false;
        this.id_card_Show = true;
      }
    },

    rowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    //编辑账户信息
    EditAccount(row) {
      this.Accounttitle = '修改客户账号';
      this.Account_show = true;
      this.addAccountBtn = false;
      this.editAccountBtn = true;
      row.Cat_atId = "" + row.Cat_atId;
      this.Accountform = row;
    },
    //删除账户信息
    DelAccount(index, row) {
      // console.log(row)
      if (row.Cat_ID != null && row.Cat_ID != "" && row.Cat_ID > 0) {
        this.CustomerAccountData_delArr.push(row.Cat_ID);
      }
      this.CustomerAccountData.splice(index, 1);
      this.msgSuccess("已删除界面缓存，需点击确认保存！");
    },
    //新增账户信息
    addAccount() {
      this.Accounttitle = '新增客户账号';
      this.Account_show = true;
      this.addAccountBtn = true;
      this.editAccountBtn = false;
      //新增时 id 赋值为空
      this.Accountform.Cat_ID = '';
      this.Accountform = JSON.parse(JSON.stringify(this.Accountform));
    },
    //加载客户信息
    loadAccount() {
      let _this = this;
      let msg = "加载会重新加载首次点击进入修改界面数据，是否确认？";
      tools.openAsk(this, 'warning', msg, this.loadSetAccount, _this, null, null);

    },
    loadSetAccount() {
      //加载缓存数据 清空数据库删除id数组
      this.CustomerAccountData = JSON.parse(JSON.stringify(this.CustomerAccountData_Cache));
      this.CustomerAccountData_delArr = [];
    },

    //新增 账户信息
    addAccountPush() {
      let _this = this;
      if (tools.VerificationsText(_this, _this.Accountform.Cat_Name, "开户行账号名称不能为空！") == true &&
        tools.VerificationsText(_this, _this.Accountform.Cat_Bank_Name, "银行名称不能为空！") == true &&
        tools.VerificationsText(_this, _this.Accountform.Cat_Number, "银行卡号不能为空！") == true &&
        tools.VerificationsText(_this, _this.Accountform.Cat_User_Name, "用户名称不能为空！") == true &&
        tools.VerificationsText(_this, _this.Accountform.Cat_atId, "请选择地址类型！") == true) {
        let map = JSON.parse(JSON.stringify(this.Accountform));
        this.CustomerAccountData.push(map);
        this.msgSuccess("已添加至界面缓存，需点击确认保存！");
      }
    },
    editAccountPush() {
      this.Account_show = false;
    },


    //编辑联系人信息
    EditPeople(row) {
      this.Peopletitle = '修改客户联系人';
      row.state = "" + row.state;
      row.is_maste = "" + row.is_maste;
      row.gender_id = "" + row.gender_id;
      this.Peopleform = row;
      // console.log(row)

      this.People_show = true;
      this.addPeopleBtn = false;
      this.editPeopleBtn = true;
      this.PictureBtn = true;

      //console.log(this.Peopleform );
      /*this.Peopleform.is_maste = this.Peopleform.is_maste+"";
      this.Peopleform.gender_id = this.Peopleform.gender_id+"";
      this.Peopleform.state = this.Peopleform.state+"";*/
    },
    //删除联系人信息
    DelPeople(index, row) {
      //console.log(row)
      if (row.id != null && row.id != "" && row.id > 0) {
        this.CustomerPeopleData_delArr.push(row.id);
      }
      this.CustomerPeopleData.splice(index, 1);
      this.msgSuccess("已删除界面缓存，需点击确认保存！");
    },
    //新增联系人信息
    addPeople() {
      this.Peopletitle = '新增客户联系人';
      // this.Peopleform.id = "";//新增时赋值为空
      this.Peopleform = JSON.parse(JSON.stringify(this.Peopleform));
      this.People_show = true;
      this.addPeopleBtn = true;
      this.editPeopleBtn = false;
      this.PictureBtn = false;
    },
    //加载客户信息
    loadPeople() {
      let _this = this;
      let msg = "加载会重新加载首次点击进入修改界面数据，是否确认？";
      tools.openAsk(this, 'warning', msg, this.loadSetPeople, _this, null, null);
    },
    loadSetPeople() {
      //加载缓存数据 清空数据库删除id数组
      this.CustomerPeopleData = JSON.parse(JSON.stringify(this.CustomerPeopleData_Cache));
      this.CustomerPeopleData_delArr = [];
    },

    //新增 联系人信息
    addPeoplePush() {
      let _this = this;
      if (tools.VerificationsText(_this, _this.Peopleform.name, "联系人名称不能为空！") == true &&
        tools.VerificationsText(_this, _this.Peopleform.state, "请选择联系人状态！") == true &&
        tools.VerificationsText(_this, _this.Peopleform.gender_id, "请选择联系人性别！") == true &&
        tools.VerificationsText(_this, _this.Peopleform.is_maste, "请选择是否主要联系人！") == true) {
        let map = JSON.parse(JSON.stringify(this.Peopleform));
        // console.log(map)
        this.CustomerPeopleData.push(map);
        this.msgSuccess("已添加至界面缓存，需点击确认保存！");
      }
    },
    editPeoplePush() {
      this.People_show = false;
      this.PictureTemplate = false;
    },


    //查询 客户姓名
    selCustomerName() {
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
      this.cities = arr;
    },


    onPreview(row) {

      this.SelectImgArr = [];
      let Name = 'customerPeopleImg_' + row.id;
      //console.log(Name)
      if (window[Name] != undefined && window[Name] != null && window[Name] != '') {
        this.SelectImgArr = window[Name];
        this.$refs.preview.clickHandler();
      } else {
        this.findImg(row.id,Name);
      }
    },

    findImg(cup_id,Name) {
      let map = {};
      map.id = cup_id;
      map.pic_status = "1";
      // console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      ContactsList(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          let Arrimg = [];
          // console.log(jsonobj)
          if (jsonobj.Data.length > 0) {
            for (let i = 0; i < jsonobj.Data.length; i++) {
              // console.log(jsonobj.Data)
              let Pwd_Str = tools.encrypt(JSON.stringify({"imagePath": jsonobj.Data[i].pic_url}));
              // console.log(jsonobj.Data[i].pic_url)
              Arrimg.push(process.env.VUE_APP_BASE_API + "/yunze/productPic/readImage?map=" + Pwd_Str);
              // console.log(Arrimg.push(process.env.VUE_APP_BASE_API+"/yunze/productPic/readImage?map="+Pwd_Str))
              if (i == jsonobj.Data.length - 1) {
                window[Name] = Arrimg;
                this.SelectImgArr = Arrimg;
                this.srcList = Arrimg;
                //调用image组件中的大图浏览图片方法
                this.$refs.preview.clickHandler();
              }
            }
          } else {
            this.msgError("暂未上传联系人图片！");
          }
        } else {
          this.msgError(jsonobj.msg);
        }
      })
    },


    SelhandleChange(value) {//省市区 获取
      for (let i = 0; i < value.length; i++) {
        if (i == 0) {
          this.queryParams.province = CodeToText[value[i]];
        } else if (i == 1) {
          this.queryParams.city = CodeToText[value[i]];
        } else if (i == 2) {
          this.queryParams.district = CodeToText[value[i]];
        }
      }
      //选择 非省 市 区 时  重新赋值 市 区
      if (value.length == 2) {
        this.queryParams.district = null;
      } else if (value.length == 1) {
        this.queryParams.city = null;
        this.queryParams.district = null;
      }
    },
    handleChange(value) {//省市区 获取
      for (let i = 0; i < value.length; i++) {
        if (i == 0) {
          this.form.province = CodeToText[value[i]];
        } else if (i == 1) {
          this.form.city = CodeToText[value[i]];
        } else if (i == 2) {
          this.form.district = CodeToText[value[i]];

        }
      }
    },
    //获取商品代理 选中
    getAgentSel() {
      let map = {};
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      findAgentList(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          let AgentSelArr = jsonobj.Data;
          if (AgentSelArr.length > 0) {
            // console.log(AgentSelArr);
            this.$refs.dept.setCheckedKeys(AgentSelArr);
          }
        } else {
          this.msgError(jsonobj.msg);
        }
      })
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
      map.is_master = this.Peopleform.is_maste;
      map.cup_id = this.Peopleform.id;
      map.dept_id = this.form.dept_id;
      map.imgArr = this.imgArr;
      //console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      this.Peopleform.PstrArr = Pwd_Str;
    },
    AddImg() {
      this.SelectChange();
      if (this.sortImages.length < 10) {
        this.sortImages = [];
        this.images = [];
        this.$refs.uploadPrdImgUpload.submit();
      } else {
        this.$message.error('最多上传10张图片！');
      }
    },
    Close(){
      this.show_ds = false;
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
    /*客户联系人 操作--查看 图片预览*/
    getArrList(index) {
      let images = JSON.parse(JSON.stringify(this.customerImg));
      for (let i = 0; i < index; i++) {
        images.push(images[0]);
        images.splice(0, 1);
      }
      return images
    },

    /*客户 查看 图片预览*/
    getArrListDeptId(index) {
      let images = [];
      for (let i = 0; i < this.customerImgArr.length; i++) {
        images.push(this.customerImgArr[i].pic_url);
      }
      return images
    },
    /** 客户文件处理 */
    customUploadCtr(file) {
      if (!this.Is_notAddCtr) {
        const that = this;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过10M');
          this.resetFlie();
          return false
        }
        if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(file.raw.type) === -1) {
          this.$message.error('格式为JPG、JPEG、PNG、GIF');
          this.resetFlie();
          return false
        }
        that.customerImg.push({
          uri: file.url,
          fileName: file.name,
          fileSize: file.size / 1024 / 1024
        })
        this.resetFlie();

      } else {
        this.Is_notAddCtr = false;
      }
    },

    resetFlie(){
      //延迟 清除显示 解决 自配置组件的界面显示问题
      setTimeout(function () {
        $('#MyuploadImgCat ul').html("");
      }, 400);
      //延迟 清除显示
      setTimeout(function () {
        $('#MyuploadImgCat ul').html("");
      }, 1000);
      this.SelectChangeCat();
    },





    customUpload(file) {

      if (!this.Is_notAdd) {


        const that = this;
        // if (file.size > 1024 * 1024 * 10) {
        //   this.$message({
        //     message: "单个文件 " + file.name + " 不能大于10M",
        //     type: "warning"
        //   })
        //   return false
        // } else if (file.size <= 0) {
        //   this.$message({
        //     message: "文件 " + file.name + " 不能为空",
        //     type: "warning"
        //   })
        //   return false
        // }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过10M');
          return false
        }
        if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(file.raw.type) === -1) {
          this.$message.error('格式为JPG、JPEG、PNG、GIF');
          return false
        }


        that.sortImages.push({
          uri: file.url,
          fileName: file.name,
          fileSize: file.size / 1024 / 1024
        })

        //延迟 清除显示 解决 自配置组件的界面显示问题
        setTimeout(function () {
          $('#MyuploadImg ul').html("");
        }, 400);
        //延迟 清除显示
        setTimeout(function () {
          $('#MyuploadImg ul').html("");
        }, 1000);
        this.SelectChange();
      } else {
        this.Is_notAdd = false;
      }
    },

    changeImages() {

    },
    handleRemove(file) {
      console.log(file);

    },
    handleRemoveCat(file) {
      console.log(file);
    },
    handleRemoveArr(fit) {
      console.log(fit);
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
      if (tools.Is_null(this.queryParams.timetype) && this.selTime != null) {
        this.queryParams.staTime = this.selTime[0];
        this.queryParams.endTime = this.selTime[1];
      }
      if (this.queryParams.province != null && this.queryParams.province == '全部') {
        this.queryParams.province = null;
        this.queryParams.city = null;
        this.queryParams.district = null;
      }
      if (this.queryParams.city != null && this.queryParams.city == '全部') {
        this.queryParams.city = null;
        this.queryParams.district = null;
      }
      if (this.queryParams.district != null && this.queryParams.district == '全部') {
        this.queryParams.district = null;
      }
      //console.log(this.queryParams);
    },


    /** 查询通道列表 */
    getList() {
      this.loading = true;
      this.getParams();
      this.queryParams.page = 1;
      let Pwd_Str = tools.encrypt(JSON.stringify(this.queryParams));
      getList(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
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

        this.show_ds = true;
        this.CustomerAdd = true;
        this.CustomerEdie = false;
        this.IsDisabled = false;//是否被禁用
        this.Picture_show = false;//不显示图片上传 【需要新增好客户信息之后再上传照片信息】
        this.getList();

      // if (this.form.dept_id != '' && this.form.c_name != '') {
      //   //this.form = {};//清空数据
      //   this.show_ds = true;
      //   this.CustomerAdd = true;
      //   this.CustomerEdie = false;
      // } else {
      //   this.msgError("新增客户请从 【用户管理》企业列表》新增客户】点击！");
      // }

    },
    /*客户划分*/
    handleDivide(map) {
      this.CtDivideform.sales_id = null;
      this.CtDivideform.CDdeptIdArr = [];
      this.findCustomerDivide(map);
      if (map.IsAdmin == true) {
        this.Dividetitle = "客户划分";
        this.DivideBool = true;
        this.RecycleBool = false;
      } else {
        this.Dividetitle = "回收客户";
        this.DivideBool = false;
        this.RecycleBool = true;
      }

    },

    findCustomerDivide(map) {
      //console.log(map)
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      CustomerDividefind(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj)
          if (jsonobj.code == 200) {
            this.cities = JSON.parse(JSON.stringify(jsonobj.Data));
            this.cityOptions = JSON.parse(JSON.stringify(jsonobj.Data));
            this.CustomerDivide_show = true;
          } else {
            this.msgError(jsonobj.msg);
          }
        }
      );

    },


    /*客户信息关闭 触发 */
    DrawerClose() {
      //如果当期是 修改操作关闭界面 清空 dept_id 和 name
      if (this.CustomerEdie == true) {
        this.form.dept_id = '';
        this.form.c_name = '';
      }
      //console.log(this.CustomerEdie)
    },

    RateSetting() {

    },


    /** 修改按钮操作 */
    handleUpdate(row, Operate) {

      this.form = {
        id: '',
        c_name: '',
        dept_id: '',
        grade_id: '',
        province: '',
        city: '',
        district: '',
        address: '',
        create_time: '',
        modified_time: '',
        one_category_id: '',
        two_category_id: '',
        remarks: '',
        source_id: '',
        is_Recycle: '',
        affiliation_id: '',
        tax_number: '',
        Co_Discount: '',
        state_id: '',
        alias: '',
      };//清空数据
      this.IsDisabled = true;
      this.Picture_show = true;//
      this.CustomerAccountData = [];//清空数据
      this.CustomerPeopleData = [];//清空数据
      this.CustomerAccountData_Cache = [];//清空数据
      this.CustomerPeopleData_Cache = [];//清空数据
      this.CustomerPeopleData_delArr = [];//清空数据
      this.CustomerAccountData_delArr = [];//清空数据
      row = JSON.parse(JSON.stringify(row));
      row.dept_id = "" + row.dept_id;
      row.grade_id = "" + row.grade_id;
      row.is_Recycle = "" + row.is_Recycle;
      row.one_category_id = "" + row.one_category_id;
      row.two_category_id = "" + row.two_category_id;
      //row.sales_id = ""+row.sales_id;
      row.source_id = "" + row.source_id;
      row.state_id = "" + row.state_id;
      row.sort_id = "" + row.sort_id;
      if (row.affiliation_id != null && row.affiliation_id.length > 0) {
        row.affiliation_id = Number(row.affiliation_id);
      }
      //省市区选中
      let selectedOptions = [];
      selectedOptions.push(TextToCode[row.province].code);
      selectedOptions.push(TextToCode[row.province][row.city].code);
      selectedOptions.push(TextToCode[row.province][row.city][row.district].code);
      this.selectedOptions = selectedOptions;
      this.form = row;

      //this.form = JSON.parse(JSON.stringify(row));
      //this.show_ds = true;
      // console.log(row);
      this.finddata(row);
      if (Operate == "Edit") {
        this.CustomerAdd = false;
        this.CustomerEdie = true;
        this.RateSetting_show = false;
        //------------------------------------------------------------
        // this.getcustomerImgArr();


      } else if (Operate == "RateSetting") {
        this.CustomerAdd = false;
        this.CustomerEdie = false;
        this.RateSetting_show = true;
      }
    },

    getcustomerImgArr(refresh){
      this.customerImgArr = [];
      let Name = 'customerImg_' + this.form.dept_id;
      if(tools.Is_null(refresh) && refresh=='1'){
        this.ArrImg(this.form.dept_id,Name);
      }else if (window[Name] != undefined && window[Name] != null && window[Name] != '') {
        this.customerImgArr = window[Name];
        this.$refs.preview.clickHandler();
      }else {
        this.ArrImg(this.form.dept_id,Name);
      }
    },



    ArrImg(cup_id,Name) {
      let map = {};
      map.dept_id = cup_id;

      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      urlPictureArr(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          let imgArr = [];
          for (let i = 0; i < jsonobj.Data.length; i++) {
            let obj = jsonobj.Data[i];
            let Pwd_Str = tools.encrypt(JSON.stringify({"imagePath": obj.pic_url}));
            obj.pic_url = (process.env.VUE_APP_BASE_API + "/yunze/productPic/readImage?map=" + Pwd_Str);
            imgArr.push(obj);


          }
          window[Name] = imgArr;
          this.customerImgArr = imgArr;
          // console.log(imgArr)
          this.$refs.preview.clickHandler();

        }
      })
    },

    /** 详情按钮操作 */
    ViewDetails(row) {
      //console.log(row);
      this.form = {};//清空数据
      this.CustomerAdd = false;
      this.CustomerEdie = false;
      this.form = JSON.parse(JSON.stringify(row));
      this.finddata(row);
      //this.show_ds = true;
    },

    /*获取详细信息*/
    finddata(row) {
      this.CustomerAccountData = [];//清空数据
      this.CustomerPeopleData = [];//清空数据
      this.CustomerAccountData_Cache = [];//清空数据
      this.CustomerPeopleData_Cache = [];//清空数据
      this.CustomerPeopleData_delArr = [];//清空数据
      this.CustomerAccountData_delArr = [];//清空数据
      let map = {};
      map.id = row.id;
      map.CoID = row.id;
      map.IsMaster = null;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      find(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj)
          if (jsonobj.code == 200) {
            this.CustomerAccountData_Cache = jsonobj.Data.CatArrs;
            this.CustomerPeopleData_Cache = jsonobj.Data.CpeopleArrs;
            this.CustomerAccountData = JSON.parse(JSON.stringify(this.CustomerAccountData_Cache));
            this.CustomerPeopleData = JSON.parse(JSON.stringify(this.CustomerPeopleData_Cache));

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
      //console.log(this.form);
      //console.log(this.CustomerAccountData);
      // console.log(this.CustomerPeopleData);

     /* tools.VerificationsText(_this, _this.form.c_name, "新增客户请从 【用户管理》企业列表》新增客户】点击！") == true &&
      tools.VerificationsText(_this, _this.form.dept_id, "新增客户请从 【用户管理》企业列表》新增客户】点击！") == true &&*/
      let _this = this;
      if (
        tools.VerificationsText(_this, _this.form.c_name, "请选择客户名称！") == true &&
        tools.VerificationsText(_this, _this.form.grade_id, "请选择客户级别！") == true &&
        tools.VerificationsText(_this, _this.form.sort_id, "请选择 客户类型！") == true &&
        tools.VerificationsText(_this, _this.form.province, "请选择省市区！") == true &&
        tools.VerificationsText(_this, _this.form.city, "请选择省市区！") == true &&
        tools.VerificationsText(_this, _this.form.district, "请选择省市区！") == true &&
        tools.VerificationsText(_this, _this.form.one_category_id, "请选择一级分类！") == true &&
        tools.VerificationsText(_this, _this.form.two_category_id, "请选择二级分类！") == true &&
        tools.VerificationsText(_this, _this.form.source_id, "请选择客户来源！") == true &&
        tools.VerificationsText(_this, _this.form.is_Recycle, "请选择客户是否回收！") == true) {


        let sort_id = _this.form.sort_id;
        if (sort_id == '1') {
          if (tools.VerificationsText(_this, _this.form.credit_code, "统一社会信用代码不能为空！") == true) {
            this.SubAdd();
          }
        } else if (sort_id == '2') {
          if (tools.VerificationsText(_this, _this.form.id_card, "身份证不能为空！") == true) {
            this.SubAdd();
          }
        }

      }
    },
    SubAdd() {
      let map = {};
      this.form.sales_id = null;
      map.CMap = this.form;
      map.CatArrs = this.CustomerAccountData;
      map.CpeopleArrs = this.CustomerPeopleData;
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
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
    },

    //费率设置
    RateUpd() {
      let _this = this;
      //console.log(this.form);
      if (tools.VerificationsText(_this, _this.form.id, "必要参数缺失请刷新后重试！") == true &&
        tools.VerificationsText(_this, _this.form.affiliation_rate, "请填写 合伙人费率！") == true &&
        tools.VerificationsText(_this, _this.form.sales_rate, "请填写 销售费率！") == true &&
        tools.VerificationsText(_this, _this.form.afterSale_rate, "请填写 售后费率！") == true) {

        _this.form.affiliation_rate = parseFloat(_this.form.affiliation_rate);
        _this.form.sales_rate = parseFloat(_this.form.sales_rate);
        _this.form.afterSale_rate = parseFloat(_this.form.afterSale_rate);

        let affiliation_rate = _this.form.affiliation_rate;
        let sales_rate = _this.form.sales_rate;
        let afterSale_rate = _this.form.afterSale_rate;

        // affiliation_rate =
        let Sum = tools.NumberAdd(tools.NumberAdd(affiliation_rate, sales_rate), afterSale_rate);
        if (Sum > 60) {
          tools.open(_this, "合伙人费率+销售费率+售后费率 不得大于 60 》 60%");
        } else {
          let map = {};
          map.affiliation_rate = affiliation_rate;
          map.sales_rate = sales_rate;
          map.affiliation_rate = affiliation_rate;
          map.afterSale_rate = afterSale_rate;
          map.salesIdArr = [_this.form.id];
          //console.log(map)
          let Pwd_Str = tools.encrypt(JSON.stringify(map));
          CustomerRate(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if (jsonobj.code == 200) {
              this.msgSuccess(jsonobj.msg);
              this.show_ds = false;
              //更新数据
              this.getList();
            } else {
              let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
              this.msgError(msg);
            }
          })

        }
      }
    },


    //编辑
    Edie() {
      let _this = this;
      if (tools.VerificationsText(_this, _this.form.c_name, "新增客户请从 【用户管理》企业列表》新增客户】点击！") == true &&
        tools.VerificationsText(_this, _this.form.dept_id, "新增客户请从 【用户管理》企业列表》新增客户】点击！") == true &&
        tools.VerificationsText(_this, _this.form.grade_id, "请选择客户级别！") == true &&
        tools.VerificationsText(_this, _this.form.sort_id, "请选择 客户类型！") == true &&
        tools.VerificationsText(_this, _this.form.province, "请选择省市区！") == true &&
        tools.VerificationsText(_this, _this.form.city, "请选择省市区！") == true &&
        tools.VerificationsText(_this, _this.form.district, "请选择省市区！") == true &&
        tools.VerificationsText(_this, _this.form.one_category_id, "请选择一级分类！") == true &&
        tools.VerificationsText(_this, _this.form.two_category_id, "请选择二级分类！") == true &&
        tools.VerificationsText(_this, _this.form.source_id, "请选择客户来源！") == true &&
        tools.VerificationsText(_this, _this.form.is_Recycle, "请选择客户是否回收！") == true) {


        let sort_id = _this.form.sort_id;
        if (sort_id == '1') {
          if (tools.VerificationsText(_this, _this.form.credit_code, "统一社会信用代码不能为空！") == true) {
            this.SubUpd();
          }
        } else if (sort_id == '2') {
          if (tools.VerificationsText(_this, _this.form.id_card, "身份证不能为空！") == true) {
            this.SubUpd();
          }
        }
      }
    },
    SubUpd() {
      let map = {};
      map.CMap = this.form;
      map.CoID = this.form.id;
      map.CatArrs = this.CustomerAccountData;
      map.CpeopleArrs = this.CustomerPeopleData;
      map.CatArrs_delArr = this.CustomerAccountData_delArr;
      map.CpeopleArrs_delArr = this.CustomerPeopleData_delArr;
      //console.log(map);
      let Pwd_Str = tools.encrypt(JSON.stringify(map));
      upd(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        //console.log(jsonobj);
        if (jsonobj.code == 200) {
          this.msgSuccess(jsonobj.msg);
          this.show_ds = false;
          //更新数据
          this.form.dept_id = '';
          this.form.c_name = '';
          this.queryParams.page = 1;
          this.getList();
        } else {
          let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
          this.msgError(msg);
        }
      })

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

.redColor {
  color: red;
}


.sidebar {
  position: fixed;
  border-right: 1px solid rgba(0, 0, 0, .07);
  overflow-y: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  transition: transform .25s ease-out;
  width: 300px;
  z-index: 3;
}

.sidebar::-webkit-scrollbar {
  width: 4px
}

.sidebar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px
}

.sidebar:hover::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, .4)
}

.sidebar:hover::-webkit-scrollbar-track {
  background: hsla(0, 0%, 53%, .1)
}
.box {
  max-width: 180px;
  height: 180px;
  overflow: hidden;
}


</style>

