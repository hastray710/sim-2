<template>
      <div >
        <!-- 销售合同 新增编辑  组件-->

        <el-card shadow="always">
          <el-divider content-position="left">合同信息
            <el-button @click="Close" size="mini" type="primary" style="margin-left: 60px">关闭</el-button>
          </el-divider>
          <el-form ref="form" :model="form" label-width="160px">
            <el-row>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                  合同日期：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      合同日期
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>

                  <el-date-picker
                    v-model="form.c_time"
                    placeholder="选择合同日期"
                    size="small"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsDay">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                  开票要求：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      开票要求：不开票;增值票;普通票;
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.c_brId" placeholder="请选择">
                    <el-option
                      v-for="item in InvoicingTypeOption"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                  分润模式：<span class="redColor">*</span>
                  <el-tooltip placement="right">
                    <div slot="content">
                      分润模式：（前提为设置上了对应的利润分成）不分润 = 不产生利润分成;/n
                      正常分润 = 合伙人+销售+售后分润;合伙人分润;销售分润;售后分润;/n
                      合伙人+销售分润;合伙人+售后分润;销售+售后分润
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.profit_sharing" placeholder="请选择">
                    <el-option
                      v-for="item in profitSharingTypeOption"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>


            <!-- 客户查询条件 组件 -->
            <CustomerInquiries
              ref="customerInquiries"
              :CustomerOneCategoryOption="CustomerOneCategoryOption"
              :CustomerTowCategoryOption="CustomerTowCategoryOption"
              :Sel="Sel"
              :loadingSelOption="loadingSelOption"
              :CustomerGradeOption="CustomerGradeOption"
              :selFindoptions="selFindoptions"
              :setCustomerArr="setCustomerArr"
              @SetSel="SetSel"
            />


            <el-row>
              <el-col :span="8">
                <el-form-item>
                <span slot="label">
                  企业名称：
                  <el-tooltip placement="right">
                    <div slot="content">
                      合同甲方 根据上方筛选条件得到
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.c_id" placeholder="请选择" @change="changeC_id" style="width: 350px;">
                    <el-option
                      v-for="item in CustomerOption"
                      :key="item.id"
                      :label="item.c_name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                <span slot="label">
                  销售单位：
                  <el-tooltip placement="right">
                    <div slot="content">
                      销售单位：乙方
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.c_fatId" placeholder="请选择" @change="changeC_fatId" style="width: 400px;">
                    <el-option
                      v-for="item in firmAccountOption"
                      :key="item.Fat_ID"
                      :label="item.Fat_Name"
                      :value="item.Fat_ID"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item>
                <span slot="label">
                  销售业务员：
                  <el-tooltip placement="right">
                    <div slot="content">
                      销售业务员：
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                  <el-select v-model="form.c_userId" placeholder="请选择" @change="changeC_fatId" style="width: 400px;">
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

            <el-collapse v-model="AccountActiveNames" style="margin-left: 10px; margin-top: 10px;">
              <el-collapse-item name="0">
                <template slot="title" class="item_iccid">
                  <div style="font-size:20px;">产品信息</div>
                </template>
                <div>
                  <el-form  ref="queryForm" :inline="true" v-if="!FindOption_show" label-width="68px">
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
                    <el-form-item>
                      <!--加载商品-->
                      <el-button @click="LoadCommodity"
                                 type="success"
                                 size="small"
                                 plain
                      >选择商品
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <template>
                  <el-table :data="CommodityList" >

                    <el-table-column   label="分类" align="center"  prop="Cy_Sort"  >
                      <template slot-scope="scope">
                        {{tools.getkeyValue(Large_classification,scope.row.Cy_Sort,"CODE","NAME")}}
                      </template>
                    </el-table-column>
                    <el-table-column   label="类别" align="center"  prop="Cy_Category"  >
                      <template slot-scope="scope">
                        {{tools.getkeyValue(window['TowClass'+window['child_id_9_'+scope.row.Cy_Sort][0]],scope.row.Cy_Category,"CODE","NAME")}}
                      </template>
                    </el-table-column>
                    <el-table-column   label="商品名称" align="center"  prop="Cy_Name" />
                    <el-table-column   label="编号" align="center"  prop="Cy_ModelAndNumber"  />
                    <el-table-column   label="单位" align="center"  prop="Cy_Unit"  />
                    <el-table-column   label="建议售价" align="center"  prop="Cy_SuggestedPrice"  />
                    <el-table-column   label="单价" align="center"  prop="Csd_Univalent"  >
                      <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.Csd_Univalent" :min="scope.row.Cy_LowestPrice" precision="2" placeholder="单价" @blur="CalculateTheAmount(scope.row)" @keyup.native="tools.handleInput2"  ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column   label="数量" property="pricing"  prop="Csd_Quantity" >
                      <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.Csd_Quantity" min="1" precision="0" placeholder="数量" @blur="CalculateTheAmount(scope.row)" @keyup.native="tools.handleInput2"  ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column   label="折扣%" align="center"  prop="Csd_Discount" >
                      <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.Csd_Discount" min="1" max="100" precision="2" @blur="CalculateTheAmount(scope.row)"	 placeholder="100=100% 不打折" @keyup.native="tools.handleInput2" ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column   label="金额" align="center"  prop="Csd_Amount"  />
                    <el-table-column   label="备注" align="center"  prop="Csd_Remarks"  >
                      <template slot-scope="scope">
                        <el-input type="textarea" v-model="scope.row.Csd_Remarks" min="1" placeholder="选填备注" max-length="100" ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center"  class-name="small-padding fixed-width" >
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-delete"
                          v-if="!RateSetting_show"
                          @click="DelAccount(scope.$index,scope.row)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-collapse-item>
              <el-collapse-item name="1">
                <template slot="title" class="item_iccid">
                  <div style="font-size:20px;">资费信息</div>
                </template>
                <div>

                  <el-form :model="queryPacketParams" :inline="true" ref="queryForm"   label-width="87px">
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
                        v-model="queryPacketParams.package_id"
                        placeholder="资费组"
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

                      <el-select
                        v-hasPermi="['yunze:cardFlow:queryPackageSimple']"
                        v-model="queryPacketParams.packet_id"
                        placeholder="资费计划"
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
                        v-model="queryPacketParams.validate_type"
                        placeholder="生效类型"
                        clearable
                        ref="packageSel"
                        size="small"
                        style="width: 210px"
                      >
                        <el-option
                          v-for="dict in cardTakeEffectTypeOption"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="dict.dictValue"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                        <span slot="label">
                          资费详情
                          <el-tooltip placement="right">
                            <div slot="content">
                              资费计划详情
                            </div>
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </span>
                            <el-row style="width: 400px;">
                              <el-col :span="6" >
                                <span>资费周期 : </span>  <el-tag size="small">{{packet.packet_valid_time}}</el-tag>
                              </el-col>
                              <el-col :span="6" ><span>周期单位 : </span><el-tag size="small">{{packet.packet_valid_name}}</el-tag></el-col>
                              <el-col :span="12"  ><span>周期用量MB : </span><el-tag size="small">{{packet.packet_flow}}</el-tag></el-col>
                            </el-row>
                    </el-form-item>
                    <el-form-item>
                      <!--加载商品-->
                      <el-button @click="savePacket"
                                 type="success"
                                 size="small"
                                 plain>添加资费
                      </el-button>
                    </el-form-item>
                  </el-form>

                </div>
                <template>
                  <el-table :data="PacketList" >

                    <el-table-column   label="资费ID"  prop="ctf_packet_id" width="230"/>
                    <el-table-column   label="资费组" align="center"  prop="ctf_package_agent_name" width="120"  />
                    <el-table-column   label="资费计划" align="center"  prop="ctf_packet_agent_name" width="200" />
                    <el-table-column   label="流量(MB)" align="center"  prop="ctf_packet_flow" />
                    <el-table-column   label="周期" align="center"  prop="ctf_packet_valid_time" />
                    <el-table-column   label="单位" align="center"  prop="ctf_packet_valid_name" />
                    <el-table-column   label="建议售价" align="center"  prop="ctf_suggested_price"  />
                    <el-table-column   label="生效类型" align="center"  prop="ctf_packet_valid_type"  >
                      <template slot-scope="scope">
                        {{tools.getDkeyValue(cardTakeEffectTypeOption,scope.row.ctf_packet_valid_type)}}
                      </template>
                    </el-table-column>
                    <el-table-column   label="单价" align="center"  prop="ctf_unit_price"  >
                      <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.ctf_unit_price" :min="scope.row.ctf_packet_price" precision="2" placeholder="单价" @blur="CalculateTariffAmount(scope.row)" @keyup.native="tools.handleInput2"  ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column   label="数量" property="pricing"  prop="ctf_quantity" >
                      <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.ctf_quantity" min="1" precision="0" placeholder="数量" @blur="CalculateTariffAmount(scope.row)" @keyup.native="tools.handleInput2"  ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column   label="折扣%" align="center"  prop="ctf_discount" >
                      <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.ctf_discount" min="1" max="100" precision="2" @blur="CalculateTariffAmount(scope.row)"	 placeholder="100=100% 不打折" @keyup.native="tools.handleInput2" ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column   label="金额" align="center"  prop="ctf_amount"  />
                    <el-table-column   label="备注" align="center"  prop="ctf_remarks"  >
                      <template slot-scope="scope">
                        <el-input type="textarea" v-model="scope.row.ctf_remarks" min="1" placeholder="选填备注" max-length="100" ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center"  class-name="small-padding fixed-width" >
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-delete"
                          v-if="!RateSetting_show"
                          @click="DelPacket(scope.$index,scope.row)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-collapse-item>
            </el-collapse>


            <el-row>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    原价合计：
                    <el-tooltip placement="right">
                      <div slot="content">
                        合同原价总和
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_total_original_price" readonly placeholder="原价合计"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    单价合计：
                    <el-tooltip placement="right">
                      <div slot="content">
                        合同单价总和
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_total_unit_price" readonly placeholder="单价合计"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    运费：
                    <el-tooltip placement="right">
                      <div slot="content">
                        合同运费
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_transportation_costs" @blur="CalculateTheTotal()" placeholder="运费"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    资费费用：
                    <el-tooltip placement="right">
                      <div slot="content">
                        资费计划费用信息
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_total_tariff" @blur="CalculateTheTotal()" placeholder="资费费用"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    合同金额：
                    <el-tooltip placement="right">
                      <div slot="content">
                        合同金额 [合同金额=商品单价合计+运费+资费单价合计]
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_contract_amount" readonly placeholder="合同金额"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    实际金额：
                    <el-tooltip placement="right">
                      <div slot="content">
                        合同实际金额  = 商品金额总和+运费+资费金额总和
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_the_actual_amount" readonly placeholder="实际金额"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    优惠金额：
                    <el-tooltip placement="right">
                      <div slot="content">
                        优惠金额 =(合同金额-实际金额) （保留两位小数）
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_discountl_price" readonly placeholder="优惠金额"/>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item>
                <span slot="label">
                    折扣：
                    <el-tooltip placement="right">
                      <div slot="content">
                        折扣 =(实际金额-运费)/原价合计 *100 （保留两位小数）
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.c_discount" readonly placeholder="折扣"/>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="tip">
              <el-row>
                <el-col :span="12">
                  <el-form-item>
                <span slot="label">
                    甲方代表：
                    <el-tooltip placement="right">
                      <div slot="content">
                        甲方代表
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                    <el-select v-model="form.c_party_a_id" placeholder="甲方代表" @change="changeParty_a">
                      <el-option
                        v-for="item in PeopleOption"
                        :key="item.id"
                        :label="item.NAME"
                        :value="item.id"
                      />
                    </el-select>

                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                <span slot="label">
                    乙方代表：
                    <el-tooltip placement="right">
                      <div slot="content">
                        乙方代表
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                    <el-select v-model="form.c_party_b_id" placeholder="乙方代表" @change="changeParty_b">
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
                <el-col :span="12">
                  <el-form-item>
              <span slot="label">
                  甲方电话：
                  <el-tooltip placement="right">
                    <div slot="content">
                      甲方电话
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-input v-model="form.c_party_a_phone" readonly placeholder="甲方电话"/>

                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                <span slot="label">
                    乙方电话：
                    <el-tooltip placement="right">
                      <div slot="content">
                        乙方电话
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                    <el-input v-model="form.c_party_b_phone" readonly placeholder="乙方电话"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item>
              <span slot="label">
                  甲方地址：
                  <el-tooltip placement="right">
                    <div slot="content">
                      甲方地址
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                    <el-select v-model="form.c_party_a_address" placeholder="甲方地址" style="width: 100%;">
                      <el-option
                        v-for="item in AccountOption"
                        :key="item.Cat_ID"
                        :label="item.Cat_Address"
                        :value="item.Cat_Address"
                      />
                    </el-select>

                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                <span slot="label">
                    乙方地址：
                    <el-tooltip placement="right">
                      <div slot="content">
                        乙方地址
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                    <el-input v-model="form.c_party_b_address" readonly placeholder="乙方地址"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>


            <el-row>
              <el-col :span="24">
                <el-form-item>
                <span slot="label">
                    备注：
                    <el-tooltip placement="right">
                      <div slot="content">
                        选填 合同 备注
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input type="textarea" v-model="form.remarks" placeholder="备注"/>
                </el-form-item>
              </el-col>
            </el-row>


          </el-form>

        </el-card>
        <div style="float: right; margin-right: 50px;margin-top: 50px;">
          <el-input v-model="form.cd_id" v-if="false"/>
          <el-button v-if="CustomerAdd" v-hasPermi="['yunze:XsglContract:add']" type="primary" @click="Add">新 增
          </el-button>
          <el-button v-if="CustomerEdie" v-hasPermi="['yunze:XsglContract:upd']" type="primary" @click="Edie">保 存
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

        <!-- 编辑、详情 触发加载数据函数-->
        <span v-if="show_ds ==true && Editexecute == false"  >
          {{LoadData()}}
        </span>

      </div>
</template>

<script>
  import tools from "@/utils/yunze/tools";
  import {CodeToText} from "element-china-area-data";
  import CustomerInquiries from '../../common/CustomerInquiries';
  import CommoditySelection from "../../common/CommoditySelection";
  import { Commodity,Queryloading} from "@/api/yunze/warehouse/Inout";
  import { findCustomerArr, fnidAccountArr, fnidPeopleArr} from "@/api/yunze/XSGL/customer/customer";
  import {find} from "@/api/yunze/XSGL/Contract/Contract";
  import { FindPacket } from "@/api/yunze/flowcard/rechargeTariff";
  import { queryPacketSimple } from "@/api/yunze/order/order";
  import { queryPackageSimple} from "@/api/yunze/flowcard/card/card";


  //客户筛选条件 组件

  export default {
    components:{//挂载
      CustomerInquiries,
      CommoditySelection
    },
    /*获取传值
    * 官方文档
    * https://cn.vuejs.org/v2/guide/components-props.html#%E4%BC%A0%E5%85%A5%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%80%E6%9C%89-property
    * String Number Boolean Array Object Date Function Symbol
    * */
    props: {
      Large_classification: Array,// 大分类
      Small_classification: Array,// 小分类
      CustomerOneCategoryOption: Array,// 客户一级分类
      CustomerTowCategoryOption: Array, // 客户二级分类
      form: Object,//销售合同 信息查询参数.
      loadingSelOption: Boolean,//是否 加载 查询客户信息框
      CustomerGradeOption: Array,// 客户级别
      selFindoptions: Array,//是省市区三级联动数据（带“全部”选项）
      CustomerAdd: Boolean,//新增
      CustomerEdie: Boolean,//编辑
      SubAdd: Function,//新增 函数
      SubUpd: Function,//编辑 函数
      firmAccountOption: Array, // 销售单位信息
      SalesOption: Array,//销售
      getTowClass: Function,//获取二级分类
      commodity: Object,// 商品表参数
      InvoicingTypeOption: Array,  // 销售合同开票类型
      profitSharingTypeOption: Array, //数据字典 销售合同分润模式
      RateSetting_show: Boolean,//费率设置 显示
      window:Window,//window 操作对象
      Editexecute: Boolean,//编辑时加载是否 已执行
      show_ds: Boolean,//当前界面是否显示
      sales_idArr: Array,// 控制查询时仅可看 所属销售的客户信息
    },

    created() {


      //加载 资费计划生效类别
      if(window['cardTakeEffectTypeOption']!=undefined &&  window['cardTakeEffectTypeOption']!=null && window['cardTakeEffectTypeOption']!=''){
        this.cardTakeEffectTypeOption = window['cardTakeEffectTypeOption'];
      }else{
        this.getDicts("yunze_card_takeEffect_type").then(response => {
          window['cardTakeEffectTypeOption'] = response.data;
          this.cardTakeEffectTypeOption = window['cardTakeEffectTypeOption'];
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


      //加载 资费计划
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
                  window['cardTakeEffectTypeOption'+Pobj.dictValue] = Pobj.packet_valid_type;
                }
              }
            }
          }

          this.PacketOptions = window['PacketOptions'];
        });
      }


    },
    data() {
      return {
        //资费计划查询参数
        queryPacketParams:{
          validate_type:'',
          packet_id:'',
          package_id:'',
        },
        packet:{
          packet_flow:'-',
          packet_valid_time:'-',
          packet_valid_name:'-'
        },
        packageOptions: [],
        PacketOptions: [],//资费计划
        PacketSelOptions:[],//资费计划查询
        cardTakeEffectTypeOption:[],//生效类型
        PacketList:[],//资费计划数组
        PacketList_delArr :[],// 资费计划数组 删除

        //当前查询参数
        Sel: {
          gradeIdArr: [],
          oneIdArr: [],
          TowIdArr: [],
          sourceIdArr: [],
          province: null,
          city: null,
          district: null,
          c_name: null,
          sales_idArr: [],
        },
        tools:tools,//tools 工具类
        PeopleOption: [],//根据 查询条件加载的 客户联系人
        AccountOption: [],//根据 查询条件加载的 客户地址
        FindOption_show: false,//查询商品按钮 显示
        selectedOptions: [], //地址选项
        CustomerOption: [],//根据 查询条件加载的销售客户信息
        AccountActiveNames: ['0'],//面板默认 展开 【账号】
        PeopleActiveNames: ['0'],//面板默认 展开 【联系人】
        //  商品 信息 数据
        CommodityList: [], //普通发货
        CommodityList_delArr :[],// 普通发货 删除
        checkedCities: [],//商品选择
        cities: [],// 复选框 数组
        cityOptions: [],//  复选框 检索临时缓存
        innerDrawer: false, //回显展示
        pickerOptionsDay: {
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
    mounted() {
      this.Sel.sales_idArr = this.sales_idArr;
      //console.log(this.Sel)
    },
    methods: {

      //加载界面 数据
      LoadData(){
        this.$emit("SetObj","SetEditexecute",true);//已加载 载入合同
        this.finddata(this.form);

      },

      //添加资费
      savePacket(){
        let _this  = this;
        if(tools.VerificationsText(_this, _this.packet.packet_id, "请选择需要添加的资费信息！") == true ){
          let ctf_discount = 100;//默认等于 100 折扣
          let IsEx = false;
          let packet_id = this.packet.packet_id;
          //console.log(packet_id)
          for (let j = 0; j < this.PacketList.length; j++) {
            let obj_j = this.PacketList[j];
            //console.log(obj_j)
            if(packet_id==obj_j.ctf_packet_id){
              let ctf_quantity = tools.accAdd(''+obj_j.ctf_quantity,'1');
              let ctf_unit_price = obj_j.ctf_unit_price;//当前 单价
              ctf_discount = obj_j.ctf_discount;//当前 折扣
              let   ctf_discountText = ''+ctf_discount+'%';//折扣 显示字段
              obj_j.ctf_quantity = ctf_quantity;//数量
              obj_j.ctf_amount = tools.accMul(tools.accMul(''+ctf_quantity,''+ctf_unit_price),''+tools.numDiv(ctf_discount,'100'));// 金额 = 数量 * 单价 * (折扣/100)
              obj_j.ctf_amount = tools.toFixed(''+obj_j.ctf_amount,2);
              this.PacketList[j] = obj_j;
              IsEx = true;
              break;
            }
          }
          if(!IsEx){
            let packetMap = {};
            packetMap.ctf_packet_id = this.packet.packet_id; //资费计划id
            packetMap.ctf_package_id = this.packet.package_id;//资费组id
            packetMap.ctf_packet_price = this.packet.packet_cost;//资费计划成本
            packetMap.ctf_quantity = "1";// 数量
            packetMap.ctf_suggested_price = this.packet.packet_price;//建议售价》资费售价
            packetMap.ctf_remarks = "";//备注
            packetMap.ctf_packet_agent_name = tools.getDkeyValue(this.PacketSelOptions,this.queryPacketParams.packet_id);//资费计划名称
            packetMap.ctf_package_agent_name = tools.getkeyValue(this.packageOptions,this.queryPacketParams.package_id,"package_id","package_agentname");//资费组名称
            packetMap.ctf_parameter = JSON.toString(this.packet);//资费计划详细参数数据
            packetMap.ctf_unit_price = this.packet.packet_price;// 单价》最终售价
            packetMap.ctf_discount = '100';
            packetMap.ctf_amount =  tools.accMul(tools.accMul(''+packetMap.ctf_quantity,''+packetMap.ctf_unit_price),''+tools.numDiv(''+packetMap.ctf_discount,'100'));// 金额 = 数量 * 单价 * (折扣/100);//折扣
            packetMap.ctf_packet_flow = this.packet.packet_flow;//套餐包流量
            packetMap.ctf_packet_valid_name = this.packet.packet_valid_name;//  资费计划规则 月 年
            packetMap.ctf_packet_valid_time = this.packet.packet_valid_time;//  资费计划规格，根据packet_valid_name定义，表示为月或年
            packetMap.ctf_packet_valid_type = this.queryPacketParams.validate_type;//资费计划生效类型
            this.PacketList.push(packetMap);
          }
          this.CalculateTheTotal();//计算 原价合计单价合计
        }









      },

      /**资费组选择*/
      packageSelChange(){
        if(tools.Is_null(this.queryPacketParams.package_id)){
          //console.log(window['PackageOptions_'+this.queryPacketParams.package_id]);
          //重置选项
          this.PacketSelOptions = window['PackageOptions_'+this.queryPacketParams.package_id];
          this.queryPacketParams.packet_id = this.PacketSelOptions[0].dictValue;
           this.packet.packet_flow = '-';
           this.packet.packet_valid_time = '-';
           this.packet.packet_valid_name = '-';
           this.packet = {};
           this.PacketSelChange();
        }
      },

      //资费计划切换
      PacketSelChange(){
        if(tools.Is_null(this.queryPacketParams.packet_id)){
          this.queryPacketParams.validate_type =  ""+window['cardTakeEffectTypeOption'+this.queryPacketParams.packet_id];
          let map = {};
          map.package_id = this.queryPacketParams.package_id;
          map.packet_id = this.queryPacketParams.packet_id;
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






      handleChange(value) {//省市区 获取
        //console.log(value)
        let Map = JSON.parse(JSON.stringify(this.Sel));
        for (let i = 0; i < value.length; i++) {
          if (i == 0) {
            Map.province = CodeToText[value[i]];
          } else if (i == 1) {
            Map.city = CodeToText[value[i]];
          } else if (i == 2) {
            Map.district = CodeToText[value[i]];
          }
        }
        //选择 非省 市 区 时  重新赋值 市 区
        if(value.length==2){
          Map.district = null;
        }else if(value.length==1){
          Map.city = null;
          Map.district = null;
        }
        this.SetSel(Map);
      },
      //删除 商品 信息
      DelAccount(index, row) {
        if (row.Csd_ID != null && row.Csd_ID != "" && row.Csd_ID > 0) {
          this.CommodityList_delArr.push(row.Csd_ID);
        }
        this.CommodityList.splice(index, 1);
        this.CalculateTheTotal();//计算 原价合计单价合计
        this.msgSuccess("已删除界面缓存，需点击确认保存！");
      },

      //删除 资费 信息
      DelPacket(index, row) {
        if (row.ctf_id != null && row.ctf_id != "" && row.ctf_id > 0) {
          this.PacketList_delArr.push(row.ctf_id);
        }
        this.PacketList.splice(index, 1);
        this.CalculateTheTotal();//计算 原价合计单价合计
        this.msgSuccess("已删除界面缓存，需点击确认保存！");
      },

      //set 客户信息 查询参数
      SetSel(Map){
        this.Sel = Map;
        //console.log(this.Sel)
      },




      //计算单行 资费金额
      CalculateTariffAmount(row){
        //console.log(row)
        //格式化 数量
        if(tools.Is_null(row.ctf_quantity)){
          row.ctf_quantity = Number(row.ctf_quantity)<=0?1:Number(row.ctf_quantity);//折扣不可 小等于 0
        }else{
          row.ctf_quantity = '1';
        }
        //格式化 折扣
        if(tools.Is_null(row.ctf_discount)){
          row.ctf_discount = Number(row.ctf_discount)==0?100:Number(row.ctf_discount);//折扣不可等于 0
        }else{
          row.ctf_discount = '100';
        }

        //格式化单价
        if(tools.Is_null(row.ctf_unit_price)){
          if(Number(row.ctf_unit_price)<Number(row.ctf_packet_price)){
            row.ctf_unit_price = Number(row.ctf_packet_price)// 单价 不可 小于 最低限价
            this.msgError("单价 不可 小于 最低限价！,已纠正为最低限价！");
          }else{
            row.ctf_unit_price = Number(row.ctf_unit_price);
          }
        }else{
          row.ctf_discount = row.ctf_suggested_price;//为空时自动改为 建议售价
        }

        row.ctf_amount = tools.accMul(tools.accMul(''+row.ctf_quantity,''+row.ctf_unit_price),''+tools.numDiv(''+row.ctf_discount,'100'));// 金额 = 数量 * 单价 * (折扣/100)
        row.ctf_amount = tools.toFixed(''+row.ctf_amount,2);

        //纠正折扣 计算出价格 小于 最低 限价 * 数量价格
        let LowestPriceSum = tools.accMul(''+row.ctf_quantity,''+row.ctf_packet_price);
        if(LowestPriceSum>row.ctf_amount){
          row.ctf_discount = '100'; //纠正折扣 为 100 计算
          row.ctf_amount = tools.accMul(tools.accMul(''+row.ctf_quantity,''+row.ctf_unit_price),''+tools.numDiv(''+row.ctf_discount,'100'));// 金额 = 数量 * 单价 * (折扣/100)
          this.msgError("折扣 计算出价格 小于 最低 限价 * 数量价格,已纠正折扣为100！");
        }
        // console.log(row)
        this.CalculateTheTotal();//计算 原价合计单价合计
      },





      //计算单行 商品金额
      CalculateTheAmount(row){
        //console.log(row)
        //格式化 数量
        if(tools.Is_null(row.Csd_Quantity)){
          row.Csd_Quantity = Number(row.Csd_Quantity)<=0?1:Number(row.Csd_Quantity);//折扣不可 小等于 0
        }else{
          row.Csd_Quantity = '1';
        }
        //格式化 折扣
        if(tools.Is_null(row.Csd_Discount)){
          row.Csd_Discount = Number(row.Csd_Discount)==0?100:Number(row.Csd_Discount);//折扣不可等于 0
        }else{
          row.Csd_Discount = '100';
        }
        row.Csd_Amount = tools.accMul(tools.accMul(''+row.Csd_Quantity,''+row.Csd_Univalent),''+tools.numDiv(''+row.Csd_Discount,'100'));// 金额 = 数量 * 单价 * (折扣/100)
        row.Csd_Amount = tools.toFixed(''+row.Csd_Amount,2);
        //console.log(row.Cy_LowestPrice+"  "+row.Csd_Univalent)
        //格式化单价
        if(tools.Is_null(row.Csd_Univalent)){
          if(Number(row.Csd_Univalent)<Number(row.Cy_LowestPrice)){
            row.Csd_Univalent = Number(row.Cy_LowestPrice)// 单价 不可 小于 最低限价
            this.msgError("单价 不可 小于 最低限价！,已纠正为最低限价！");
          }else{
            row.Csd_Univalent = Number(row.Csd_Univalent);
          }
        }else{
          row.Csd_Discount = row.Cy_SuggestedPrice;//为空时自动改为 建议售价
        }
        //纠正折扣 计算出价格 小于 最低 限价 * 数量价格
        let LowestPriceSum = tools.accMul(''+row.Csd_Quantity,''+row.Cy_LowestPrice);
        if(LowestPriceSum>row.Csd_Amount){
          row.Csd_Discount = '100'; //纠正折扣 为 100 计算
          row.Csd_Amount = tools.accMul(tools.accMul(''+row.Csd_Quantity,''+row.Csd_Univalent),''+tools.numDiv(''+row.Csd_Discount,'100'));// 金额 = 数量 * 单价 * (折扣/100)
          this.msgError("折扣 计算出价格 小于 最低 限价 * 数量价格,已纠正折扣为100！");
        }
        //console.log(row)
        this.CalculateTheTotal();//计算 原价合计单价合计
      },

      //计算 原价合计单价 * 数量
      CalculateTheTotal(){
        let  UnivalentSum = 0;
        let  SuggestedPriceSum = 0;
        let  actualAmountSum = 0;
        let c_transportation_costs = 0;
        let c_total_tariff = 0;

        let c_discount = 100;
        if(this.CommodityList!=null && this.CommodityList.length>0){
          for (let i = 0; i < this.CommodityList.length; i++) {
            let obj = this.CommodityList[i];
            UnivalentSum = tools.accAdd('' + UnivalentSum, '' + tools.accMul('' + obj.Csd_Quantity, '' + obj.Csd_Univalent));
            SuggestedPriceSum = tools.accAdd('' + SuggestedPriceSum, '' + tools.accMul('' + obj.Csd_Quantity, '' + obj.Cy_SuggestedPrice));
            actualAmountSum = tools.accAdd('' + actualAmountSum, '' + obj.Csd_Amount);
          }
        }

        if(this.PacketList!=null && this.PacketList.length>0){
          for (let i = 0; i < this.PacketList.length; i++) {
            let obj = this.PacketList[i];
            UnivalentSum = tools.accAdd('' + UnivalentSum, '' + tools.accMul('' + obj.ctf_quantity, '' + obj.ctf_unit_price));
            SuggestedPriceSum = tools.accAdd('' + SuggestedPriceSum, '' + tools.accMul('' + obj.ctf_quantity, '' + obj.ctf_suggested_price));
            actualAmountSum = tools.accAdd('' + actualAmountSum, '' + obj.ctf_amount);
            c_total_tariff = tools.accAdd('' + c_total_tariff, '' + obj.ctf_amount);
          }
        }


        this.form.c_total_tariff = c_total_tariff;//资费费用
        //运费 格式化

        if(this.form.c_the_actual_amount!=null ){
          if(Number(this.form.c_the_actual_amount)<0){
            c_transportation_costs = 0;
          }else{
            c_transportation_costs = Number(this.form.c_transportation_costs)
          }
        }else{
          c_transportation_costs = 0;
        }


        c_discount = tools.toFixed(''+tools.accMul('' +tools.numDiv('' + actualAmountSum, '' + SuggestedPriceSum),100),2);//折扣 =(实际金额-运费)/原价合计 *100 （保留两位小数）




        this.form.c_total_unit_price = UnivalentSum;
        this.form.c_total_original_price = SuggestedPriceSum;
        this.form.c_transportation_costs = c_transportation_costs;//运费
        this.form.c_the_actual_amount = tools.accAdd('' + actualAmountSum, '' + c_transportation_costs);//实际金额 = 商品金额总和+运费
        this.form.c_contract_amount = tools.accAdd('' + UnivalentSum, '' + c_transportation_costs);//合同金额 = 单价合计+运费
        this.form.c_discount = c_discount;
        //console.log(this.form.c_contract_amount +' ' +this.form.c_the_actual_amount);
        this.form.c_discountl_price = tools.numSub('' + this.form.c_contract_amount ,'' +this.form.c_the_actual_amount);//优惠金额
      },


      /** 确认 载入 按钮*/
      preservationadd(){
        //清空子组件选择
        this.$refs.commoditySelection.ThischeckedCities = [];
        this.$refs.commoditySelection.checkAll = false;
        this.$refs.commoditySelection.selName = '';

        let _this = this;
        let FindArr = [];///需要去数据库查询数据的
        if(this.checkedCities != null && this.checkedCities.length>0){
          let Arr = [];
          //表格中还没有数据的时候直接去查询
          if(this.CommodityList!=null && this.CommodityList.length>0){
            for (let i = 0; i < this.checkedCities.length; i++) {
              let id = this.checkedCities[i];
              let Csd_Univalent = 999999;//默认等于 数据库 单价
              let Csd_Discount = 100;//默认等于 100 折扣
              let IsEx = false;
              for (let j = 0; j < this.CommodityList.length; j++) {
                let obj_j = this.CommodityList[j];
                if(id==obj_j.Cy_ID){
                  let Csd_Quantity = tools.accAdd(''+obj_j.Csd_Quantity,'1');
                  Csd_Univalent = obj_j.Csd_Univalent;//当前 单价
                  Csd_Discount = obj_j.Csd_Discount;//当前 折扣
                  let   Csd_DiscountText = ''+Csd_Discount+'%';//折扣 显示字段
                  //console.log("Csd_Quantity "+Csd_Quantity+" Csd_Univalent "+Csd_Univalent+" Csd_Discount "+Csd_Discount);
                  obj_j.Csd_Quantity = Csd_Quantity;//数量
                  obj_j.Csd_Amount = tools.accMul(tools.accMul(''+Csd_Quantity,''+Csd_Univalent),''+tools.numDiv(Csd_Discount,'100'));// 金额 = 数量 * 单价 * (折扣/100)
                  obj_j.Csd_Amount = tools.toFixed(''+obj_j.Csd_Amount,2);
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

          if(FindArr.length>0){
            let map = {};
            map.idarr = FindArr;
            map.publish_status = '1';//上下架状态
            let Pwd_Str = tools.encrypt(JSON.stringify(map));
            // console.log(Pwd_Str);
            Queryloading(Pwd_Str).then(response => {
              let jsonobj =  JSON.parse(tools.Decrypt(response));
              //console.log(jsonobj);
              if(jsonobj.code==200){
                let CommodityList = jsonobj.Data;
                let Arr = [];
                if(CommodityList.length>0){
                  for (let i = 0; i < CommodityList.length; i++) {
                    let obj = CommodityList[i];
                    let Csd_Quantity = 1;
                    let Csd_Univalent = obj.Cy_SuggestedPrice;//单价 默认等于 数据库  建议售价
                    let Csd_Discount = 100;//默认等于 100 折扣
                    let   Csd_DiscountText = ''+Csd_Discount+'%';//折扣 显示字段

                    obj.Csd_Discount = Csd_Discount;//折扣
                    obj.Csd_DiscountText = Csd_DiscountText;//折扣 显示字段
                    obj.Csd_Univalent = Csd_Univalent;//单价
                    obj.Csd_Quantity = Csd_Quantity;//数量
                    obj.Csd_Amount = tools.accMul(tools.accMul(''+Csd_Quantity,''+Csd_Univalent),''+tools.numDiv(Csd_Discount,'100'));// 金额 = 数量 * 单价 * (折扣/100)
                    obj.Csd_Amount = tools.toFixed(''+obj.Csd_Amount,2);
                    Arr.push(obj);
                  }
                }
                this.CommodityList.push(...JSON.parse(JSON.stringify(Arr)));
                this.CalculateTheTotal();//计算 原价合计单价合计
              }else{
                this.msgError(jsonobj.msg);
              }
            });
          }
          this.innerDrawer = false;
          this.loading = false;
          this.checkAll = [];//清空数据
          this.checkedCities = [];//清空数据

          this.CalculateTheTotal();//计算 原价合计单价合计
        }else {
          tools.open(_this,"勾选商品不能为空！");
        }
      },


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

      //甲方代表切换 联动变更 联系人电话
      changeParty_a() {
        this.form.c_party_a_phone = window["customerPeopleTelephone_" + this.form.c_party_a_id];
      },

      //企业名称 切换联动变更 甲方代表 、电话 地址
      changeC_id() {
        let map = {};
        map.id = this.form.c_id;

        // 清空 甲方代表 电话 地址 信息
        this.form.c_party_a_id = null;
        this.form.c_party_a_phone = null;
        this.form.c_party_a_address = null;
        this.setPeopleArr(map,null); //加载联系人信息
        this.setAccountArr(map,null); //加载 地址 信息
      },
      //乙方代表切换 联动变更 联系人电话
      changeParty_b() {
        this.form.c_party_b_phone = window["SalesOptionPhonenumber_" + this.form.c_party_b_id];
      },

      //销售单位 切换 联动变更 乙方地址
      changeC_fatId() {
        this.form.c_party_b_address = window["firmAccountOptionAddress_" + this.form.c_fatId];
      },




      //加载 地址信息
      setAccountArr(map,Selected) {
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        fnidAccountArr(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          // console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.AccountOption = jsonobj.Data;
            if (this.AccountOption != null && this.AccountOption.length > 0) {

              if(Selected!=null){
                for (let i = 0; i < this.AccountOption.length; i++) {
                  let obj = this.AccountOption[i];
                  if(obj.Cat_Address==Selected){
                    this.form.c_party_a_address = obj.Cat_Address;
                  }
                }
              }else{
                this.form.c_party_a_address = this.AccountOption[0].Cat_Address;//默认选择第一个
              }
            }
          } else {
            let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
            this.msgError(msg);
          }
        })
      },


      handleInput2(e) {
        // 通过正则过滤小数点后两位
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      },

      changOneClass(val){
        let child_id = window['child_id_9_'+val];
        this.getTowClass({'Cy_Sort':child_id[0],"child_id_sel":val});
      },


      /*获取详细信息*/
      finddata(row) {

        this.CommodityList_delArr = [];
        this.PacketList_delArr = [];

        let map = {};
        map.id = row.id;
        map.Csd_CtID = row.code;
        map.ctf_ctId = row.code;
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        find(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            if (jsonobj.code == 200) {
              //console.log(jsonobj);
              let CMap = jsonobj.Data.CMap;
              // 数据格式化
              CMap.c_party_b_id = Number(CMap.c_party_b_id);
              CMap.c_brId = ""+CMap.c_brId;
              //CMap.c_id = ""+CMap.c_id;
              CMap.c_fatId = ""+CMap.c_fatId;
              CMap.profit_sharing = ""+CMap.profit_sharing;
              this.CommodityList = jsonobj.Data.standardList;
              this.PacketList = jsonobj.Data.tariffList;
              let ActiveNames = [];
              if(jsonobj.Data.standardList!=null && jsonobj.Data.standardList.length>0){
                ActiveNames.push('0');
              }
              if(jsonobj.Data.tariffList!=null && jsonobj.Data.tariffList.length>0){
                ActiveNames.push('1');
              }
              this.AccountActiveNames = ActiveNames;

              //赋值 查询条件为 当前 用户名 加载客户信息
              this.Sel.c_name = CMap.c_name;
              let SelMap = {};
              SelMap.Sel_c_party_a_name = CMap.c_party_a_name;
              SelMap.Sel_c_party_a_address = CMap.c_party_a_address;
              SelMap.Sel_c_name = CMap.c_name;
              this.setCustomerArr(SelMap);


              /* //根据 名称 选中
               let vleue = 'NAME';
               let key = 'id';
               let text = this.form.c_party_a_name;
               console.log(this.PeopleOption)
               for (let i = 0; i < this.PeopleOption.length(); i++) {
                 let obj = this.PeopleOption[i]
                 if(obj.key==text){
                   this.form.c_party_a_id = obj.vleue;
                   console.log(" get key "+obj.vleue)
                 }
               }*/

              this.$emit("SetObj","Setform",CMap);//已加载

            } else {
              this.msgError(jsonobj.msg);
            }
          }
        );
      },


      //获取公司信息
      setCustomerArr(SelectedMap) {
        // console.log(SelectedMap);
        if (this.Sel.gradeIdArr.length > 0 || this.Sel.oneIdArr.length > 0 || this.Sel.TowIdArr.length > 0 ||
          tools.Is_null(this.Sel.province) == true || tools.Is_null(this.Sel.city) == true || tools.Is_null(this.Sel.district) == true ||
          tools.Is_null(this.Sel.c_name) == true) {
          // 清空 甲方代表 电话 地址 信息
          this.form.c_id = null;
          this.form.c_party_a_id = null;
          this.form.c_party_a_phone = null;
          this.form.c_party_a_address = null;

          let Pwd_Str = tools.encrypt(JSON.stringify(this.Sel));
          findCustomerArr(Pwd_Str).then(response => {
            let jsonobj = JSON.parse(tools.Decrypt(response));
            //console.log(jsonobj);
            if (jsonobj.code == 200) {
              this.CustomerOption = jsonobj.Data;
              if (this.CustomerOption != null && this.CustomerOption.length > 0) {
                let map = {};

                let Sel_c_party_a_name = null;
                let Sel_c_party_a_address = null;
                if(SelectedMap!=null){
                  Sel_c_party_a_name = SelectedMap.Sel_c_party_a_name;
                  Sel_c_party_a_address = SelectedMap.Sel_c_party_a_address;
                  let Sel_c_name = SelectedMap.Sel_c_name;
                  for (let i = 0; i < this.CustomerOption.length; i++) {
                    let obj = this.CustomerOption[i];
                    if(Sel_c_name==obj.c_name){
                      this.form.c_id = obj.id;
                    }
                  }
                }else{
                  this.form.c_id = this.CustomerOption[0].id;//默认选择第一个  企业名称
                }
                map.id = this.form.c_id;
                this.setPeopleArr(map,Sel_c_party_a_name); //加载联系人信息
                this.setAccountArr(map,Sel_c_party_a_address); //加载 地址 信息
              }
            } else {
              let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
              this.msgError(msg);
            }
          })
        } else {
          this.msgError("请选择查询条件！");
        }
      },

      //加载联系人信息
      setPeopleArr(map,Selected) {
        let Pwd_Str = tools.encrypt(JSON.stringify(map));
        fnidPeopleArr(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          //console.log(jsonobj);
          if (jsonobj.code == 200) {
            this.PeopleOption = jsonobj.Data;
            if (this.PeopleOption != null && this.PeopleOption.length > 0) {
              let bool = false;
              if(Selected==null){
                this.form.c_party_a_id = this.PeopleOption[0].id;//默认选择第一个
                this.form.c_party_a_phone = this.PeopleOption[0].telephone;//默认选择第一个
              }else{
                bool = true;
              }
              //界面储存联系人电话
              for (let i = 0; i < this.PeopleOption.length; i++) {
                window["customerPeopleTelephone_" + this.PeopleOption[i].id] = this.PeopleOption[i].telephone;
                if(bool){//有指定选中时 选中 指定的 数据
                  //console.log(this.PeopleOption[i].NAME+"    "+Selected)
                  if(this.PeopleOption[i].NAME==Selected){
                    this.form.c_party_a_id = this.PeopleOption[i].id;
                    this.form.c_party_a_phone = this.PeopleOption[i].telephone;
                  }
                }
              }
            }
          } else {
            let msg = jsonobj.Data != null && jsonobj.Data != '' ? jsonobj.Data : jsonobj.msg;
            this.msgError(msg);
          }
        })
      },

      //新增
      Add() {
        //console.log(this.form);
        //console.log(this.CustomerAccountData);
        // console.log(this.CustomerPeopleData);
        let _this = this;
        if (
          tools.VerificationsText(_this, _this.form.c_id, "请根据筛选条件查询并选择企业信息！") == true &&
          tools.VerificationsText(_this, _this.form.c_fatId, "请选择销售单位！") == true &&
          tools.VerificationsText(_this, _this.form.c_party_a_id, "请选择 甲方代表！") == true &&
          tools.VerificationsText(_this, _this.form.c_party_a_address, "请选择 甲方地址！") == true &&
          tools.VerificationsText(_this, _this.form.c_time, "请选择 合同日期！") == true) {

          // 获取 c_name 客户名称  c_fatName 销售单位名称 c_userName 销售名称 c_party_a_name 甲方代表 c_party_b_name 已方代表
          this.form.c_name = tools.getkeyValue(this.CustomerOption,this.form.c_id,"id","c_name");
          this.form.c_fatName = tools.getkeyValue(this.firmAccountOption,this.form.c_fatId,"Fat_ID","Fat_Name");
          this.form.c_userName = tools.getkeyValue(this.SalesOption,this.form.c_userId,"user_id","nick_name");
          this.form.c_party_a_name = tools.getkeyValue(this.PeopleOption,this.form.c_party_a_id,"id","NAME");
          this.form.c_party_b_name = tools.getkeyValue(this.SalesOption,this.form.c_party_b_id,"user_id","nick_name");
          let addBool = false;
          if(this.CommodityList!=null && this.CommodityList.length>0){
            addBool = true;
          }
          if(this.PacketList!=null && this.PacketList.length>0){
            addBool = true;
          }

          if(addBool){
            // console.log("SubUpd");
            let map = {};
            map.CMap = this.form;
            map.Csd_CtID = this.form.code;
            map.code = this.form.id;
            map.standardList = this.CommodityList;
            map.tariffList = this.PacketList;
            this.SubAdd(map);
          }else{
            tools.open(this, "请选择合同商品或资费 信息！");
          }

        }
      },


      //编辑
      Edie() {
        let _this = this;
        //console.log(this.CommodityList_delArr)
        if (
          tools.VerificationsText(_this, _this.form.c_id, "请根据筛选条件查询并选择企业信息！") == true &&
          tools.VerificationsText(_this, _this.form.c_fatId, "请选择销售单位！") == true &&
          tools.VerificationsText(_this, _this.form.c_party_a_id, "请选择 甲方代表！") == true &&
          tools.VerificationsText(_this, _this.form.c_party_a_address, "请选择 甲方地址！") == true &&
          tools.VerificationsText(_this, _this.form.id, "必要参数缺失请刷新后重试！") == true &&
          tools.VerificationsText(_this, _this.form.c_time, "请选择 合同日期！") == true) {


          // 获取 c_name 客户名称  c_fatName 销售单位名称 c_userName 销售名称 c_party_a_name 甲方代表 c_party_b_name 已方代表
          this.form.c_name = tools.getkeyValue(this.CustomerOption,this.form.c_id,"id","c_name");
          this.form.c_fatName = tools.getkeyValue(this.firmAccountOption,this.form.c_fatId,"Fat_ID","Fat_Name");
          this.form.c_userName = tools.getkeyValue(this.SalesOption,this.form.c_userId,"user_id","nick_name");
          this.form.c_party_a_name = tools.getkeyValue(this.PeopleOption,this.form.c_party_a_id,"id","NAME");
          this.form.c_party_b_name = tools.getkeyValue(this.SalesOption,this.form.c_party_b_id,"user_id","nick_name");

          //console.log(this.form);
          //console.log(this.CommodityList);
          let addBool = false;
          if(this.CommodityList!=null && this.CommodityList.length>0){
            addBool = true;
          }
          if(this.PacketList!=null && this.PacketList.length>0){
            addBool = true;
          }

          if(addBool){
            // console.log("SubUpd");
            let map = {};
            map.CMap = this.form;
            map.Csd_CtID = this.form.code;
            map.ctf_ctId = this.form.code;

            map.code = this.form.id;
            map.standardList = this.CommodityList;
            map.tariffList = this.PacketList;
            map.CommodityList_delArr = this.CommodityList_delArr;
            map.PacketList_delArr = this.PacketList_delArr;



            this.SubUpd(map);
          }else{
            tools.open(this, "请选择合同商品或资费 信息！");
          }

        }
      },


      //关闭
      Close(){
        this.$emit("SetObj","Setshow_ds",false);//关闭显示
      },



    }
  };
</script>
