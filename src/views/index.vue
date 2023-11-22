<template>
  <el-container class="home">
    <el-main  >

      <!-- <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <el-card class="update-log">
            <div slot="header" class="clearfix">
              <span>业务告警 </span>
              <span style="float: right;margin-right: 10px;">
                统计截止时间 {{indexpage.update_date}}
                <el-tooltip class="My_tooltip_46a6ff" placement="top">
                    <div slot="content">
                      数据统计时间会更具您的登录时间间隔生成最新数据，时间差默认为15分钟。
                      （PS:15分钟内点击刷新获取数据不变！）
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                <el-button type="primary" style="margin-left: 10px;" size="mini" @click="loadIndex">刷 新</el-button>
                 <router-link v-if="indexpage.api_pending_order>0" :to="'/order/orderTariff/'+tools.encrypt(JSON.stringify({'is_audit':'0'}))"  >
                   <el-badge :value="indexpage.api_pending_order" v-if="indexpage.api_pending_order>0" :max="99" class="item">
                      <el-button type="primary" style="margin-left: 10px;" size="mini" @click="loadIndex">API续费</el-button>
                   </el-badge>
                 </router-link>
                <el-button type="primary" style="margin-left: 10px;" size="mini" @click="quickEntry()">快捷入口</el-button>
              </span>
            </div>
            <div class="body">
              <el-row :gutter="10" class="my_panel-group" >
                <el-col :xs="24" :sm="8" :md="6" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:downCount']">
                  <div class="card-panel">




                    <router-link v-if="status_ShowId_show" :to="'/card/card/'+tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_downCount))"  >
                      <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-simCard">
                          <svg-icon icon-class="close" class-name="card-panel-icon"/>
                        </div>
                        <div class="card-panel-description">
                          <div class="card-panel-text">
                            已停机
                          </div>
                          <div class="card-panel-text">
                                <span class="card-panel-text-font">
                                  <count-to :start-val="0" :end-val="indexpage.downCount" :duration="1500" class="card-panel-num"/>
                                </span> 张
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="6" :lg="6" class="card-panel-col" v-hasPermi="['yunze:index:overdoseCount']">
                  <div class="card-panel">
                    <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_overdoseCount))">
                      <div class="card-panel-icon-wrapper icon-upwardTrend">
                        <svg-icon icon-class="exceeded" class-name="card-panel-icon"/>
                      </div>
                      <div class="card-panel-description">
                        <div class="card-panel-text">
                          超用量
                        </div>
                        <div class="card-panel-text">
                            <span class="card-panel-text-font">
                              <count-to :start-val="0" :end-val="indexpage.overdoseCount" :duration="1500" class="card-panel-num"/>
                            </span> 张
                        </div>
                      </div>
                    </router-link>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="6" :lg="6" class="card-panel-col" v-hasPermi="['yunze:index:expiringSoonCount']">
                  <div class="card-panel">
                    <router-link v-if="status_ShowId_show" :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_expiringSoonCount))">
                      <div class="card-panel-icon-wrapper icon-used">
                        <svg-icon icon-class="cardMaturity" class-name="card-panel-icon"/>
                      </div>
                      <div class="card-panel-description">
                        <div class="card-panel-text">
                          快到期
                        </div>
                        <div class="card-panel-text">
                            <span class="card-panel-text-font">
                              <count-to :start-val="0" :end-val="indexpage.expiringSoonCount" :duration="1500" class="card-panel-num"/>
                            </span> 张
                        </div>
                      </div>
                    </router-link>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="6" :lg="6" class="card-panel-col" v-hasPermi="['yunze:index:thresholdReachedCount']">
                  <div class="card-panel">
                    <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_thresholdReachedCount))">
                      <div class="card-panel-icon-wrapper icon-Proportion">
                        <svg-icon icon-class="threshold" class-name="card-panel-icon"/>
                      </div>
                      <div class="card-panel-description">
                        <div class="card-panel-text">
                          已达停机阈值
                        </div>
                        <div class="card-panel-text">
                              <span class="card-panel-text-font">
                                <count-to :start-val="0" :end-val="indexpage.thresholdReachedCount" :duration="1500" class="card-panel-num"/>
                              </span> 张
                        </div>
                      </div>
                    </router-link>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row> -->

      <el-divider/>
      <!--数据面板-->
      <el-row :gutter="40" class="panel-group" style="margin-left: 0px;margin-right: 0px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:simCardCount']">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_simCardCount))">
              <div class="card-panel-icon-wrapper icon-simCard">
                <svg-icon icon-class="simCard" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  SIM卡总数
                </div>
                <div class="card-panel-text">
                  <span class="card-panel-text-font">
                    <count-to :start-val="0" :end-val="indexpage.simCardCount" :duration="1500" class="card-panel-num"/>
                  </span> 张
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:simCardNewCount']">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_simCardNewCount))">
              <div class="card-panel-icon-wrapper icon-upwardTrend">
                <svg-icon icon-class="upwardTrend" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  SIM卡本月新增
                </div>
                <div class="card-panel-text">
                  <span class="card-panel-text-font">
                    <count-to :start-val="0" :end-val="indexpage.simCardNewCount" :duration="1500" class="card-panel-num"/>
                  </span> 张
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:currentMonth']">
          <div class="card-panel" v-if="status_ShowId_show" @click="handleSetLineChartData('purchases')">
            <div class="card-panel-icon-wrapper icon-used">
              <svg-icon icon-class="used" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                本月数据用量
                <el-tooltip class="My_tooltip" placement="top">
                  <div slot="content">
                    数据统计截止日期 {{indexpage.record_date}}
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <div class="card-panel-text">
                  <span class="card-panel-text-font">
                    <count-to :start-val="0" :decimals="2" :end-val="indexpage.currentMonth" :duration="1500" class="card-panel-num"/>
                  </span> GB
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"   v-hasPermi="['yunze:index:simActivity']">
          <div class="card-panel" @click="handleSetLineChartData('Proportions')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_simActivity))">
              <div class="card-panel-icon-wrapper icon-Proportion">
                <svg-icon icon-class="Proportion" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  SIM卡月活跃度
                  <el-tooltip class="My_tooltip" placement="top">
                    <div slot="content">
                      数据统计截止日期 {{indexpage.record_date}}
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <div class="card-panel-text">
                  <span class="card-panel-text-font">
                    <count-to :start-val="0" :decimals="2" :end-val="indexpage.simActivity" :duration="1500" class="card-panel-num"/>
                  </span> %
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <!--数据面板 end-->
      <el-divider/>
      <!--生命周期 业务使用情况-->
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="8" :lg="8"  v-hasPermi="['yunze:index:lifeCycleDistribution']">
          <el-card class="update-log">
            <div slot="header" class="clearfix">
              <span>生命周期分布</span>
            </div>
            <div class="body" >
              <pie-chart className="status_ShowId" width="100%" height="350px" v-if="status_ShowId_show"
                         :P_legend="status_ShowId_P_legend" :P_series="status_ShowId_P_series"
                         :P_color="status_ShowId_P_color"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <el-card class="update-log">
            <div slot="header" class="clearfix">
              <span>业务量使用情况</span>
            </div>
            <div class="body">
              <el-tabs tab-position="right" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="数据" name="flow"  v-hasPermi="['yunze:index:businessVolumeFlow']" v-if="status_ShowId_show" >
                  <el-row :gutter="5">
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                      <line-chart className="CardFlow" width="92%" height="350px" v-if="CardFlow_show"
                                  :chart-data="CardFlowArr" :P_xAxis="CardFlow_xAxis" :P_ShowLable="CardFlow_ShowLable"
                                  :P_colorArr="CardFlow_colorArr"
                                  :CardFlow_config="CardFlow_config"/>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                      <el-row :gutter="5" style="padding: 10px;">
                        <el-col :xs="12" :sm="12" :md="12" :lg="12">
                          <i class="el-icon-top"></i>
                          TOP排行：
                          <el-tooltip class="My_tooltip" placement="top">
                            <div slot="content">
                              数据统计截止日期 {{indexpage.record_date}};
                              按月查询时显示当月用量排行榜[MB]，折线图用量规格为【GB】;
                              按日查询时显示昨日用量排行榜[MB]，折线图用量规格为[GB]。
                            </div>
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12">
                          <el-switch
                            style="display: block;text-align: right;"
                            v-model="flowType"
                            active-color="#1682e6"
                            @change="changeflowType"
                            inactive-color="#13ce66"
                            active-text="月"
                            inactive-text="日">
                          </el-switch>
                        </el-col>
                      </el-row>
                      <el-table :data="cardFlowList">
                        <el-table-column label="虚拟编号" align="left" width="125">
                          <template slot-scope="scope">
                            <router-link v-if="status_ShowId_show" :to="'/card/card/'+ tools.encrypt(JSON.stringify({'type':'1','value':scope.row.iccid}))" class="link-type">
                              <span>{{ scope.row.vid }}</span>
                            </router-link>
                          </template>
                        </el-table-column>
                        <el-table-column label="用量（MB）" align="right" prop="used"/>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <!--<el-tab-pane label="语音" name="voice"  v-hasPermi="['yunze:index:businessVolumeVoice']">语音</el-tab-pane>
                <el-tab-pane label="短信" name="ShortMessage"  v-hasPermi="['yunze:index:businessVolumeVoice']">短信</el-tab-pane>-->
              </el-tabs>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!--生命周期 业务使用情况 END-->
      <el-divider/>
      <!--业务面板-->
      <el-row :gutter="40" class="panel-group" style="margin-left: 0px;margin-right: 0px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:customerCount']">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ ''">
              <div class="card-panel-icon-wrapper icon-simCard">
                <svg-icon icon-class="customer" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  客户总数
                </div>
                <div class="card-panel-text">
                  <span class="card-panel-text-font">
                    <count-to :start-val="0" :end-val="indexpage.customerCount" :duration="1500" class="card-panel-num"/>
                  </span> 个
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:customerNewCount']">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_customerNewCount))">
              <div class="card-panel-icon-wrapper icon-upwardTrend">
                <svg-icon icon-class="trend" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  客户本月新增
                </div>
                <div class="card-panel-text">
                        <span class="card-panel-text-font">
                          <count-to :start-val="0" :end-val="indexpage.customerNewCount" :duration="1500" class="card-panel-num"/>
                        </span> 个
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:salesContractCount']">
          <div class="card-panel" @click="handleSetLineChartData('purchases')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_salesContractCount))">
              <div class="card-panel-icon-wrapper icon-used">
                <svg-icon icon-class="contract" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月销售合同总数
                </div>
                <div class="card-panel-text">
                      <span class="card-panel-text-font">
                        <count-to :start-val="0" :end-val="indexpage.salesContractCount" :duration="1500" class="card-panel-num"/>
                      </span> 份
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:salesContractDepositCount']">
          <div class="card-panel" @click="handleSetLineChartData('Proportions')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_salesContractCount))">
              <div class="card-panel-icon-wrapper icon-Proportion">
                <svg-icon icon-class="ContractAmount" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月合同入款金额
                </div>
                <div class="card-panel-text">
                    <span class="card-panel-text-font">
                      <count-to :start-val="0" :decimals="2" :end-val="indexpage.salesContractDepositCount" :duration="1500"
                                class="card-panel-num"/>
                    </span> 元
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <!--业务面板 END-->
      <el-divider/>

      <!--业务面板2-->
      <el-row :gutter="40" class="panel-group" style="margin-left: 0px;margin-right: 0px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:weChatOrderCollection']">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <router-link v-if="status_ShowId_show"  :to="'/order/ordeAll/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_getOrderSum))">
              <div class="card-panel-icon-wrapper icon-simCard">
                <svg-icon icon-class="wechat" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月微信订单收款
                </div>
                <div class="card-panel-text">
                     <span class="card-panel-text-font">
                          <count-to :start-val="0" :decimals="2" :end-val="indexpage.weChatOrderCollection" :duration="1500"
                                    class="card-panel-num"/>
                      </span> 元
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:orderAmount']">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <router-link v-if="status_ShowId_show"  :to="'/order/ordeAll/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_getOrderAmount))">
              <div class="card-panel-icon-wrapper icon-upwardTrend">
                <svg-icon icon-class="Collection" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月订单总金额
                </div>
                <div class="card-panel-text">
                       <span class="card-panel-text-font">
                              <count-to :start-val="0" :decimals="2" :end-val="indexpage.orderAmount" :duration="1500"
                                        class="card-panel-num"/>
                        </span> 元
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:systemCliqueCount']">
          <div class="card-panel" @click="handleSetLineChartData('purchases')">
            <router-link v-if="status_ShowId_show"  :to="'/agent/Dept/'">
              <div class="card-panel-icon-wrapper icon-used">
                <svg-icon icon-class="group" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  系统企业总数
                </div>
                <div class="card-panel-text">
                      <span class="card-panel-text-font">
                            <count-to :start-val="0" :end-val="indexpage.systemCliqueCount" :duration="1500" class="card-panel-num"/>
                      </span> 个
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:systemUserCount']">
          <div class="card-panel" @click="handleSetLineChartData('Proportions')">
            <router-link v-if="status_ShowId_show"  :to="'/agent/agentUser/'">
              <div class="card-panel-icon-wrapper icon-Proportion">
                <svg-icon icon-class="loggedUser" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  系统用户总数
                </div>
                <div class="card-panel-text">
                      <span class="card-panel-text-font">
                        <count-to :start-val="0" :end-val="indexpage.systemUserCount" :duration="1500" class="card-panel-num"/>
                      </span> 个
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <!--业务面板2 END-->
      <el-divider/>

      <!--业务面板 3-->
      <el-row :gutter="40" class="panel-group" style="margin-left: 0px;margin-right: 0px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:activationCardCount']">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_activationCardCount))">
              <div class="card-panel-icon-wrapper icon-simCard">
                <svg-icon icon-class="cardActivation" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月激活卡数
                </div>
                <div class="card-panel-text">
                     <span class="card-panel-text-font">
                          <count-to :start-val="0"  :end-val="indexpage.activationCardCount" :duration="1500"
                                    class="card-panel-num"/>
                      </span> 张
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:shipCard']">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <router-link v-if="status_ShowId_show"  :to="'/card/card/'+ tools.encrypt(JSON.stringify(indexpage.requestMap.Pmap_shipCard))">
              <div class="card-panel-icon-wrapper icon-upwardTrend">
                <svg-icon icon-class="cardShip" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月发货卡数
                </div>
                <div class="card-panel-text">
                   <span class="card-panel-text-font">
                          <count-to :start-val="0" :end-val="indexpage.shipCard" :duration="1500"
                                    class="card-panel-num"/>
                    </span> 张
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:logInIp']">
          <div class="card-panel" @click="handleSetLineChartData('purchases')">
            <router-link v-if="status_ShowId_show"  :to="'/log/logininfor/'">
              <div class="card-panel-icon-wrapper icon-used">
                <svg-icon icon-class="Ip" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月登录IP总数
                </div>
                <div class="card-panel-text">
                      <span class="card-panel-text-font">
                            <count-to :start-val="0" :end-val="indexpage.logInIp" :duration="1500" class="card-panel-num"/>
                      </span> 个
                </div>
              </div>
            </router-link>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col"  v-hasPermi="['yunze:index:onlineCount']">
          <div class="card-panel" @click="handleSetLineChartData('Proportions')">
            <router-link v-if="status_ShowId_show" :to="'/monitor/online/'">
              <div class="card-panel-icon-wrapper icon-Proportion">
                <svg-icon icon-class="onlineUser" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  当前在线用户
                  <el-tooltip style="color: red" placement="top">
                    <div slot="content">
                      数据统计截止日期 {{this.getOnelinCountTime}},默认 120S 刷新一次
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <div class="card-panel-text">
                      <span class="card-panel-text-font">
                        <count-to :start-val="0" :end-val="indexpage.onlineCount" :duration="1500" class="card-panel-num"/>
                      </span> 个
                </div>
              </div>
            </router-link>



          </div>
        </el-col>
      </el-row>
      <!--业务面板 3 END-->
      <el-divider/>


      <!-- <el-row :gutter="10">
         <el-col :xs="24" :sm="24" :md="12" :lg="8">
           <el-card class="update-log">
             <div slot="header" class="clearfix">
               <span>联系信息</span>
             </div>
             <div class="body">
               <p>
                 <i class="el-icon-s-promotion"></i> 官网：
                 <el-link
                   href="http://i.5iot.cn"
                   target="_blank"
                 >http://i.5iot.cn
                 </el-link
                 >
               </p>
               <p>
                 <i class="el-icon-user-solid"></i> QQ群：<s>满937441</s>
                 <s>满887144332</s> <s>满180251782</s> <s>满104180207</s>
                 <s>满186866453</s>
                 <a href="https://jq.qq.com/?_wv=1027&k=5vYAqA05" target="_blank">
                   201396349</a
                 >
               </p>
               <p>
                 <i class="el-icon-chat-dot-round"></i> 微信：<a
                 href="javascript:;"
               >/ *物联网</a
               >
               </p>
               <p>
                 <i class="el-icon-used"></i> 支付宝：<a
                 href="javascript:;"
                 class="支付宝信息"
               >/ *物联网</a
               >
               </p>
             </div>
           </el-card>
         </el-col>
         <el-col :xs="24" :sm="24" :md="12" :lg="8">
           <el-card class="update-log">
             <div slot="header" class="clearfix">
               <span>更新日志</span>
             </div>
             <el-collapse accordion>
               <el-collapse-item title="v3.5.0 - 2021-05-25">
                 <ol>
                   <li>新增菜单导航显示风格TopNav（false为左侧导航菜单，true为顶部导航菜单）</li>
                   <li>布局设置支持保存&重置配置</li>
                   <li>修复树表数据显示不全&加载慢问题</li>
                   <li>新增IE浏览器版本过低提示页面</li>
                   <li>用户登录后记录最后登录IP&时间</li>
                   <li>页面导出按钮点击之后添加遮罩</li>
                   <li>富文本编辑器支持自定义上传地址</li>
                   <li>富文本编辑组件新增readOnly属性</li>
                   <li>页签TagsView新增关闭右侧功能</li>
                   <li>显隐列组件加载初始默认隐藏列</li>
                   <li>关闭头像上传窗口还原默认图片</li>
                   <li>个人信息添加手机&邮箱重复验证</li>
                   <li>代码生成模板导出按钮点击后添加遮罩</li>
                   <li>代码生成模板树表操作列添加新增按钮</li>
                   <li>代码生成模板修复主子表字段重名问题</li>
                   <li>升级fastjson到最新版1.2.76</li>
                   <li>升级druid到最新版本v1.2.6</li>
                   <li>升级mybatis到最新版3.5.6 阻止远程代码执行漏洞</li>
                   <li>升级oshi到最新版本v5.6.0</li>
                   <li>velocity剔除commons-collections版本，防止3.2.1版本的反序列化漏洞</li>
                   <li>数据监控页默认账户密码防止越权访问</li>
                   <li>修复firefox下表单构建拖拽会新打卡一个选项卡</li>
                   <li>修正后端导入表权限标识</li>
                   <li>修正前端操作日志&登录日志权限标识</li>
                   <li>设置Redis配置HashKey序列化</li>
                   <li>删除操作日志记录信息</li>
                   <li>上传媒体类型添加视频格式</li>
                   <li>修复请求形参未传值记录日志异常问题</li>
                   <li>优化xss校验json请求条件</li>
                   <li>树级结构更新子节点使用replaceFirst</li>
                   <li>优化ExcelUtil空值处理</li>
                   <li>日志记录过滤BindingResult对象，防止异常</li>
                   <li>修改主题后mini类型按钮无效问题</li>
                   <li>优化通用下载完成后删除节点</li>
                   <li>通用Controller添加响应返回消息</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>
               <el-collapse-item title="v3.4.0 - 2021-02-22">
                 <ol>
                   <li>代码生成模板支持主子表</li>
                   <li>表格右侧工具栏组件支持显隐列</li>
                   <li>图片组件添加预览&移除功能</li>
                   <li>Excel注解支持Image图片导出</li>
                   <li>操作按钮组调整为朴素按钮样式</li>
                   <li>代码生成支持文件上传组件</li>
                   <li>代码生成日期控件区分范围</li>
                   <li>代码生成数据库文本类型生成表单文本域</li>
                   <li>用户手机邮箱&菜单组件修改允许空字符串</li>
                   <li>升级SpringBoot到最新版本2.2.13 提升启动速度</li>
                   <li>升级druid到最新版本v1.2.4</li>
                   <li>升级fastjson到最新版1.2.75</li>
                   <li>升级element-ui到最新版本2.15.0</li>
                   <li>修复IE11浏览器报错问题</li>
                   <li>优化多级菜单之间切换无法缓存的问题</li>
                   <li>修复四级菜单无法显示问题</li>
                   <li>修正侧边栏静态路由丢失问题</li>
                   <li>修复角色管理-编辑角色-功能权限显示异常</li>
                   <li>配置文件新增redis数据库索引属性</li>
                   <li>权限工具类增加admin判断</li>
                   <li>角色非自定义权限范围清空选择值</li>
                   <li>修复导入数据为负浮点数时丢失精度问题</li>
                   <li>移除path-to-regexp正则匹配插件</li>
                   <li>修复生成树表代码异常</li>
                   <li>修改ip字段长度防止ipv6地址长度不够</li>
                   <li>防止get请求参数值为false或0等特殊值会导致无法正确的传参</li>
                   <li>登录后push添加catch防止出现检查错误</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>
               <el-collapse-item title="v3.3.0 - 2021-12-14">
                 <ol>
                   <li>新增缓存监控功能</li>
                   <li>支持主题风格配置</li>
                   <li>修复多级菜单之间切换无法缓存的问题</li>
                   <li>多级菜单自动配置组件</li>
                   <li>代码生成预览支持高亮显示</li>
                   <li>支持Get请求映射Params参数</li>
                   <li>删除用户和角色解绑关联</li>
                   <li>去除用户手机邮箱部门必填验证</li>
                   <li>Excel支持注解align对齐方式</li>
                   <li>Excel支持导入Boolean型数据</li>
                   <li>优化头像样式，鼠标移入悬停遮罩</li>
                   <li>代码生成预览提供滚动机制</li>
                   <li>代码生成删除多余的数字float类型</li>
                   <li>修正转换字符串的目标字符集属性</li>
                   <li>回显数据字典防止空值报错</li>
                   <li>日志记录增加过滤多文件场景</li>
                   <li>修改缓存Set方法可能导致嵌套的问题</li>
                   <li>移除前端一些多余的依赖</li>
                   <li>防止安全扫描YUI出现的风险提示</li>
                   <li>修改node-sass为dart-sass</li>
                   <li>升级SpringBoot到最新版本2.1.18</li>
                   <li>升级poi到最新版本4.1.2</li>
                   <li>升级oshi到最新版本v5.3.6</li>
                   <li>升级bitwalker到最新版本1.21</li>
                   <li>升级axios到最新版本0.21.0</li>
                   <li>升级element-ui到最新版本2.14.1</li>
                   <li>升级vue到最新版本2.6.12</li>
                   <li>升级vuex到最新版本3.6.0</li>
                   <li>升级vue-cli到版本4.5.9</li>
                   <li>升级vue-router到最新版本3.4.9</li>
                   <li>升级vue-cli到最新版本4.4.6</li>
                   <li>升级vue-cropper到最新版本0.5.5</li>
                   <li>升级clipboard到最新版本2.0.6</li>
                   <li>升级core-js到最新版本3.8.1</li>
                   <li>升级echarts到最新版本4.9.0</li>
                   <li>升级file-saver到最新版本2.0.4</li>
                   <li>升级fuse.js到最新版本6.4.3</li>
                   <li>升级js-beautify到最新版本1.13.0</li>
                   <li>升级js-cookie到最新版本2.2.1</li>
                   <li>升级path-to-regexp到最新版本6.2.0</li>
                   <li>升级quill到最新版本1.3.7</li>
                   <li>升级screenfull到最新版本5.0.2</li>
                   <li>升级sortablejs到最新版本1.10.2</li>
                   <li>升级vuedraggable到最新版本2.24.3</li>
                   <li>升级chalk到最新版本4.1.0</li>
                   <li>升级eslint到最新版本7.15.0</li>
                   <li>升级eslint-plugin-vue到最新版本7.2.0</li>
                   <li>升级lint-staged到最新版本10.5.3</li>
                   <li>升级runjs到最新版本4.4.2</li>
                   <li>升级sass-loader到最新版本10.1.0</li>
                   <li>升级script-ext-html-webpack-plugin到最新版本2.1.5</li>
                   <li>升级svg-sprite-loader到最新版本5.1.1</li>
                   <li>升级vue-template-compiler到最新版本2.6.12</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>
               <el-collapse-item title="v3.2.1 - 2021-11-18">
                 <ol>
                   <li>阻止任意文件下载漏洞</li>
                   <li>代码生成支持上传控件</li>
                   <li>新增图片上传组件</li>
                   <li>调整默认首页</li>
                   <li>升级druid到最新版本v1.2.2</li>
                   <li>mapperLocations配置支持分隔符</li>
                   <li>权限信息调整</li>
                   <li>调整sql默认时间</li>
                   <li>解决代码生成没有bit类型的问题</li>
                   <li>升级pagehelper到最新版1.3.0</li>
                 </ol>
               </el-collapse-item>
               <el-collapse-item title="v3.2.0 - 2021-10-10">
                 <ol>
                   <li>升级springboot版本到2.1.17 提升安全性</li>
                   <li>升级oshi到最新版本v5.2.5</li>
                   <li>升级druid到最新版本v1.2.1</li>
                   <li>升级jjwt到版本0.9.1</li>
                   <li>升级fastjson到最新版1.2.74</li>
                   <li>修改sass为node-sass，避免el-icon图标乱码</li>
                   <li>代码生成支持同步数据库</li>
                   <li>代码生成支持富文本控件</li>
                   <li>代码生成页面时不忽略remark属性</li>
                   <li>代码生成添加select必填选项</li>
                   <li>Excel导出类型NUMERIC支持精度浮点类型</li>
                   <li>Excel导出targetAttr优化获取值，防止get方法不规范</li>
                   <li>Excel注解支持自动统计数据总和</li>
                   <li>Excel注解支持设置BigDecimal精度&舍入规则</li>
                   <li>菜单&数据权限新增（展开/折叠 全选/全不选 父子联动）</li>
                   <li>允许用户分配到部门父节点</li>
                   <li>菜单新增是否缓存keep-alive</li>
                   <li>表格操作列间距调整</li>
                   <li>限制系统内置参数不允许删除</li>
                   <li>富文本组件优化，支持自定义高度&图片冲突问题</li>
                   <li>富文本工具栏样式对齐</li>
                   <li>导入excel整形值校验优化</li>
                   <li>修复页签关闭所有时固定标签路由不刷新问题</li>
                   <li>表单构建布局型组件新增按钮</li>
                   <li>左侧菜单文字过长显示省略号</li>
                   <li>修正根节点为子部门时，树状结构显示问题</li>
                   <li>修正调用目标字符串最大长度</li>
                   <li>修正菜单提示信息错误</li>
                   <li>修正定时任务执行一次权限标识</li>
                   <li>修正数据库字符串类型nvarchar</li>
                   <li>优化递归子节点</li>
                   <li>优化数据权限判断</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>

               <el-collapse-item title="v3.1.0 - 2021-08-13">
                 <ol>
                   <li>表格工具栏右侧添加刷新&显隐查询组件</li>
                   <li>后端支持CORS跨域请求</li>
                   <li>代码生成支持选择上级菜单</li>
                   <li>代码生成支持自定义路径</li>
                   <li>代码生成支持复选框</li>
                   <li>Excel导出导入支持dictType字典类型</li>
                   <li>Excel支持分割字符串组内容</li>
                   <li>验证码类型支持（数组计算、字符验证）</li>
                   <li>升级vue-cli版本到4.4.4</li>
                   <li>修改 node-sass 为 dart-sass</li>
                   <li>表单类型为Integer/Long设置整形默认值</li>
                   <li>代码生成器默认mapper路径与默认mapperScan路径不一致</li>
                   <li>优化防重复提交拦截器</li>
                   <li>优化上级菜单不能选择自己</li>
                   <li>修复角色的权限分配后，未实时生效问题</li>
                   <li>修复在线用户日志记录类型</li>
                   <li>修复富文本空格和缩进保存后不生效问题</li>
                   <li>修复在线用户判断逻辑</li>
                   <li>唯一限制条件只返回单条数据</li>
                   <li>添加获取当前的环境配置方法</li>
                   <li>超时登录后页面跳转到首页</li>
                   <li>全局异常状态汉化拦截处理</li>
                   <li>HTML过滤器改为将html转义</li>
                   <li>检查字符支持小数点&降级改成异常提醒</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>

               <el-collapse-item title="v3.0.0 - 2021-07-20">
                 <ol>
                   <li>单应用调整为多模块项目</li>
                   <li>升级element-ui版本到2.13.2</li>
                   <li>删除babel，提高编译速度。</li>
                   <li>新增菜单默认主类目</li>
                   <li>编码文件名修改为uuid方式</li>
                   <li>定时任务cron表达式验证</li>
                   <li>角色权限修改时已有权限未自动勾选异常修复</li>
                   <li>防止切换权限用户后登录出现404</li>
                   <li>Excel支持sort导出排序</li>
                   <li>创建用户不允许选择超级管理员角色</li>
                   <li>修复代码生成导入表结构出现异常页面不提醒问题</li>
                   <li>修复代码生成点击多次表修改数据不变化的问题</li>
                   <li>修复头像上传成功二次打开无法改变裁剪框大小和位置问题</li>
                   <li>修复布局为small者mini用户表单显示错位问题</li>
                   <li>修复热部署导致的强换异常问题</li>
                   <li>修改用户管理复选框宽度，防止部分浏览器出现省略号</li>
                   <li>IpUtils工具，清除Xss特殊字符，防止Xff注入攻击</li>
                   <li>生成domain 如果是浮点型 统一用BigDecimal</li>
                   <li>定时任务调整label-width，防止部署出现错位</li>
                   <li>调整表头固定列默认样式</li>
                   <li>代码生成模板调整，字段为String并且必填则加空串条件</li>
                   <li>代码生成字典Integer/Long使用parseInt</li>
                   <li>
                     修复dict_sort不可update为0的问题&查询返回增加dict_sort升序排序
                   </li>
                   <li>修正岗位导出权限注解</li>
                   <li>禁止加密密文返回前端</li>
                   <li>修复代码生成页面中的查询条件创建时间未生效的问题</li>
                   <li>修复首页搜索菜单外链无法点击跳转问题</li>
                   <li>修复菜单管理选择图标，backspace删除时不过滤数据</li>
                   <li>用户管理部门分支节点不可检查&显示计数</li>
                   <li>数据范围过滤属性调整</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>

               <el-collapse-item title="v2.3.0 - 2021-06-01">
                 <ol>
                   <li>升级fastjson到最新版1.2.70 修复高危安全漏洞</li>
                   <li>dev启动默认打开浏览器</li>
                   <li>vue-cli使用默认source-map</li>
                   <li>slidebar eslint报错优化</li>
                   <li>当tags-view滚动关闭右键菜单</li>
                   <li>字典管理添加缓存读取</li>
                   <li>参数管理支持缓存操作</li>
                   <li>支持一级菜单（和主页同级）在main区域显示</li>
                   <li>限制外链地址必须以http(s)开头</li>
                   <li>tagview & sidebar 主题颜色与element ui(全局)同步</li>
                   <li>修改数据源类型优先级，先根据方法，再根据类</li>
                   <li>支持是否需要设置token属性，自定义返回码消息。</li>
                   <li>swagger请求前缀加入配置。</li>
                   <li>登录地点设置内容过长则隐藏显示</li>
                   <li>修复定时任务执行一次按钮后不提示消息问题</li>
                   <li>修改上级部门（选择项排除本身和下级）</li>
                   <li>通用http发送方法增加参数 contentType 编码类型</li>
                   <li>更换IP地址查询接口</li>
                   <li>修复页签变量undefined</li>
                   <li>添加校验部门包含未停用的子部门</li>
                   <li>修改定时任务详情下次执行时间日期显示错误</li>
                   <li>角色管理查询设置默认排序字段</li>
                   <li>swagger添加enable参数控制是否启用</li>
                   <li>只对json类型请求构建可重复读取inputStream的request</li>
                   <li>修改代码生成字典字段int类型没有自动选中问题</li>
                   <li>vuex用户名取值修正</li>
                   <li>表格树模板去掉多余的)</li>
                   <li>代码生成序号修正</li>
                   <li>全屏情况下不调整上外边距</li>
                   <li>代码生成Date字段添加默认格式</li>
                   <li>用户管理角色选择权限控制</li>
                   <li>修复路由懒加载报错问题</li>
                   <li>模板sql.vm添加菜单状态</li>
                   <li>设置用户名称不能修改</li>
                   <li>dialog添加append-to-body属性，防止ie遮罩</li>
                   <li>菜单区分状态和显示隐藏功能</li>
                   <li>升级fastjson到最新版1.2.68 修复安全加固</li>
                   <li>修复代码生成如果选择字典类型缺失逗号问题</li>
                   <li>登录请求params更换为data，防止暴露url</li>
                   <li>日志返回时间格式处理</li>
                   <li>添加handle控制允许拖动的元素</li>
                   <li>布局设置点击扩大范围</li>
                   <li>代码生成列属性排序查询</li>
                   <li>代码生成列支持拖动排序</li>
                   <li>修复时间格式不支持ios问题</li>
                   <li>表单构建添加父级class，防止冲突</li>
                   <li>定时任务并发属性修正</li>
                   <li>角色禁用&菜单隐藏不查询权限</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>

               <el-collapse-item title="v2.2.0 - 2021-03-18">
                 <ol>
                   <li>系统监控新增定时任务功能</li>
                   <li>添加一个打包Web工程bat</li>
                   <li>修复页签鼠标滚轮按下的时候，可以关闭不可关闭的tag</li>
                   <li>修复点击退出登录有时会无提示问题</li>
                   <li>修复防重复提交注解无效问题</li>
                   <li>修复通知公告批量删除异常问题</li>
                   <li>添加菜单时路由地址必填限制</li>
                   <li>代码生成字段描述可编辑</li>
                   <li>修复用户修改个人信息导致缓存不过期问题</li>
                   <li>个人信息创建时间获取正确属性值</li>
                   <li>操作日志详细显示正确类型</li>
                   <li>导入表单击行数据时选中对应的复选框</li>
                   <li>批量替换表前缀逻辑调整</li>
                   <li>固定重定向路径表达式</li>
                   <li>升级element-ui版本到2.13.0</li>
                   <li>操作日志排序调整</li>
                   <li>修复charts切换侧边栏或者缩放窗口显示bug</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>

               <el-collapse-item title="v2.1.0 - 2021-02-24">
                 <ol>
                   <li>新增表单构建</li>
                   <li>代码生成支持树表结构</li>
                   <li>新增导入</li>
                   <li>修复动态加载路由页面刷新问题</li>
                   <li>修复地址开关无效问题</li>
                   <li>汉化错误提示页面</li>
                   <li>代码生成已知问题修改</li>
                   <li>修复多数据源下配置关闭出现异常处理</li>
                   <li>添加HTML过滤器，用于去除XSS漏洞隐患</li>
                   <li>修复上传头像控制台出现异常</li>
                   <li>修改用户管理分页不正确的问题</li>
                   <li>修复验证码记录提示错误</li>
                   <li>修复request.js缺少Message引用</li>
                   <li>修复表格时间为空出现的异常</li>
                   <li>添加Jackson日期反序列化时区配置</li>
                   <li>调整根据用户权限加载菜单数据树形结构</li>
                   <li>调整成功登录不恢复按钮，防止多次点击</li>
                   <li>修改用户个人资料同步缓存信息</li>
                   <li>修复页面同时出现el-upload和Editor不显示处理</li>
                   <li>修复在角色管理页修改菜单权限偶尔未选中问题</li>
                   <li>配置文件新增redis密码属性</li>
                   <li>设置mybatis全局的配置文件</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>

               <el-collapse-item title="v2.0.0 - 2019-12-02">
                 <ol>
                   <li>新增代码生成</li>
                   <li>新增@RepeatSubmit注解，防止重复提交</li>
                   <li>新增菜单主目录添加/删除操作</li>
                   <li>日志记录过滤特殊对象，防止转换异常</li>
                   <li>修改代码生成路由脚本错误</li>
                   <li>用户上传头像实时同步缓存，无需重新登录</li>
                   <li>调整切换页签后不重新加载数据</li>
                   <li>添加jsencrypt实现参数的前端加密</li>
                   <li>系统退出删除用户缓存记录</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>
               <el-collapse-item title="v1.1.0 - 2019-11-11">
                 <ol>
                   <li>新增在线用户管理</li>
                   <li>新增按钮组功能实现（批量删除、导出、清空）</li>
                   <li>新增查询条件重置按钮</li>
                   <li>新增Swagger全局Token配置</li>
                   <li>新增后端参数校验</li>
                   <li>修复字典管理页面的日期查询异常</li>
                   <li>修改时间函数命名防止冲突</li>
                   <li>去除菜单上级校验，默认为顶级</li>
                   <li>修复用户密码无法修改问题</li>
                   <li>修复菜单类型为按钮时不显示权限标识</li>
                   <li>其他细节优化</li>
                 </ol>
               </el-collapse-item>
               <el-collapse-item title="v1.0.0 - 2019-10-08">
                 <ol>
                   <li>物联网前后端分离系统正式发布</li>
                 </ol>
               </el-collapse-item>
             </el-collapse>
           </el-card>
         </el-col>
         <el-col :xs="24" :sm="24" :md="12" :lg="8">
           <el-card class="update-log">
             <div slot="header" class="clearfix">
               <span>捐赠支持</span>
             </div>
             <div class="body">
               <img
                 src="https://oscimg.oschina.net/oscnet/up-d6695f82666e5018f715c41cb7ee60d3b73.png"
                 alt="donate"
                 width="100%"
               />
               <span style="display: inline-block; height: 30px; line-height: 30px"
               >你可以请作者喝杯咖啡表示鼓励</span
               >
             </div>
           </el-card>
         </el-col>
       </el-row>-->
    </el-main>
    <el-aside width="200px" v-if="quickEntryShow" style=" background-color: #ffffff;">
      <el-card class="update-log" style="height: 100%;">
        <div slot="header" class="clearfix" style="height: 18px;    margin-top: -8px;">
          <span style="font-size: 14px;">快捷入口</span>
        </div>
        <div class="body">
          <ul class="el-menu">
            <router-link  :to="'/card/ExecutionTask/'" class="link-type">

              <li role="menuitem" tabindex="1">
                <span>执行日志</span>
              </li>
            </router-link>
            <router-link  v-hasPermi="['yunze:card:list']" :to="'/card/card/'"
                          class="link-type">
              <li role="menuitem" tabindex="1">
                <span>物联卡管理</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:card:Setting']" :to="'/card/cardSetting/'"
                         class="link-type">
              <li role="menuitem" tabindex="2">
                <span>物联卡设置</span>
              </li>
            </router-link>
            <router-link  v-hasPermi="['yunze:card:diagnosis']" :to="'/card/diagnosis/'"
                          class="link-type">
              <li role="menuitem" tabindex="1">
                <span>智能诊断</span>
              </li>
            </router-link>



            <router-link  v-hasPermi="['yunze:order:addPackage']" :to="'/card/rechargeTariff'"
                          class="link-type">
              <li role="menuitem" tabindex="1">
                <span>资费订购</span>
              </li>
            </router-link>
            <router-link  v-hasPermi="['yunze:tariffGroup:list']" :to="'/card/tariffGroupT/'"
                          class="link-type">
              <li role="menuitem" tabindex="1">
                <span>平台资费</span>
              </li>
            </router-link>
            <router-link  v-hasPermi="['yunze:agentTariffGroup:list']" :to="'/card/agentTariffGroup/'"
                          class="link-type">
              <li role="menuitem" tabindex="1">
                <span>客户资费</span>
              </li>
            </router-link>


            <router-link v-hasPermi="['tool:apifile:list']" :to="'/system/apifile'"
                         class="link-type">
              <li role="menuitem" tabindex="2">
                <span>API使用</span>
              </li>
            </router-link>

            <router-link v-hasPermi="['system:dept:list']" :to="'/agent/Dept/'"
                         class="link-type">
              <li role="menuitem" tabindex="2">
                <span>企业管理</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:agent:list']" :to="'/agent/agentUser/'"
                         class="link-type">
              <li role="menuitem" tabindex="2">
                <span>用户信息</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:XsglCustomer:list']"  :to="'/customer/xsgl/customer/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>客户信息</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:order:list']" :to="'/order/ordeAll/'"
                         class="link-type">
              <li role="menuitem" tabindex="2">
                <span>全部订单</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['warehouse:Inout:list']"
                         :to="'/warehouse/Inout/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>商品入库</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:inventorydetails:list']"
                         :to="'/Inventorydetails/type/index/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>库存明细</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:XsglContract:list']"
                         :to="'/market/Contract/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>销售合同</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:FhglOrderDelivery:list']"
                         :to="'/Delivery/OrderDelivery/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>合同订单发货</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:ShippingApplication:list']"
                         :to="'/Delivery/FhglShippingApplication/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>其他发货</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:InventoryList:list']"
                         :to="'/warehouse/InventoryList/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>仓库盘点</span>
              </li>
            </router-link>
            <router-link v-hasPermi="['yunze:commodity:list']"
                         :to="'/commodity/CCommodity/'" class="link-type">
              <li role="menuitem" tabindex="2">
                <span>C端商品管理</span>
              </li>
            </router-link>
          </ul>

        </div>
      </el-card>
    </el-aside>

    <div  v-hasPermi="['yunze:index:onlineCount']">
      <div v-if="loadingOnelinCount==false" >
        {{this.getOnelinCount()}}
      </div>
    </div>
  </el-container>
</template>

<script>
import  { findToDay } from "@/api/yunze/system/index";
import  { list } from "@/api/monitor/online";

import tools from "@/utils/yunze/tools";
import LineChart from './dashboard/LineChart'
import PieChart from './dashboard/PieChart'
import CountTo from 'vue-count-to'
import {AssetDetails} from "@/api/yunze/system/index";

export default {
  name: "index",
  components: {
    PieChart,
    LineChart,
    CountTo,
  },
  created() {

    //不点击刷新按钮时获取的第一次缓存的数据
    if(window['IoTLink-indexData']!=undefined && window['IoTLink-indexData']!=null){
      this.indexpage =  window['IoTLink-indexData'];
      this.status_ShowId_show = false;
      this.Myload();
    }else{
      this.loadIndex();//加载首页
    }



    /* this.cardFlowList = [{
       'vid': '1410158305863',
       'used': '100000000.01',
       'iccid': '8986112124301965946'
     }, {'vid': '1410158305863', 'used': '100000000.01', 'iccid': '8986112124301965946'},
       {'vid': '1410158305863', 'used': '100000000.01', 'iccid': '8986112124301965946'}, {
         'vid': '1410158305863',
         'used': '100000000.01',
         'iccid': '8986112124301965946'
       },
       {'vid': '1410158305863', 'used': '100000000.01', 'iccid': '8986112124301965946'},];
*/

    this.CardFlow_ShowLable = {Day_CardFlowArr: "日用量GB", Month_CardFlowArr: "月用量GB"};
    this.CardFlow_config = {"smooth": false, 'areaStyle_show': "true"};
  },
  data() {
    return {
      loading: true,
      activeName: 'flow',
      allowloading:true,//是否允许加载
      loadingOnelinCount:true,//是否 已经加载在线人数
      getOnelinCountTime:"",//获取在线 人数 时间
      quickEntryShow: false,//快捷入口 是否显示
      indexpage:{
        id: null,
        downCount: 0,
        overdoseCount: 0,
        expiringSoonCount: 0,
        thresholdReachedCount: 0,
        simCardCount: 0,
        simCardNewCount: 0,
        currentMonth: 0,
        simActivity: 0,
        lifeCycleDistribution: {
          data:[],
        },
        businessVolumeFlow: {
          Day_CardFlowMap:{
            Day_CardFlowArr:[],
          },
          Day_CardFlow_xAxis:[],
          Day_cardFlowList:[
            {
              iccid:'',
              used:'',
              vid:'',
            }
          ],
          Month_CardFlowMap:{
            Month_CardFlowArr:[],
          },
          Month_CardFlow_xAxis:[],
          Month_cardFlowList:[
            {
              iccid:'',
              used:'',
              vid:'',
            }
          ],
          requestMap:{
            Pmap_simCardCount:{},
            Pmap_downCount:{},
            Pmap_overdoseCount:{},
            Pmap_expiringSoonCount:{},
            Pmap_thresholdReachedCount:{},
            Pmap_simCardNewCount:{},
            Pmap_currentMonth:{},
            Pmap_simActivity:{},
            Pmap_status_ShowIdGroup:{},
            Pmap_activationCardCount:{},
            Pmap_shipCard:{},
            Pmap_customerNewCount:{},
            Pmap_salesContractCount:{},
            Pmap_getOrderSum:{},
            Pmap_getOrderAmount:{},
            Pmap_logInIp:{},

          },
        },
        businessVolumeVoice: {},
        businessVolumeMessage: {},
        customerCount: 0,
        customerNewCount: 0,
        salesContractCount: 0,
        salesContractDepositCount: 0,
        weChatOrderCollection: 0,
        orderAmount: 0,
        systemCliqueCount: 0,
        systemUserCount: 0,
        activationCardCount: 0,
        shipCard: 0,
        logInIp: 0,
        create_date: '',
        update_date: '',
        record_date: '',
        dept_id: '',
        onlineCount: 0,
        api_pending_order: 0,
      },

      // 版本号
      version: "0.5.0",
      title: '12312312',
      linkArr: [],
      tools: tools,
      status_ShowId_P_legend: {},
      status_ShowId_show:false,
      status_ShowId_P_series: {
        data:[],
        name: "生命周期占比",
        radius: [15, 95],
      },
      status_ShowId_P_color: ['#b180f5', '#0186ff', '#61c5f9', '#38cb8e', '#fa535f', '#fe9e74', '#899caf', '#303133'],

      flowType: false,//false = 日查询 月查询 [用量]
      cardFlowList: [],//数据排行
      CardFlowArr: {},//折线图 【用量】
      CardFlow_show:false,
      CardFlow_ShowLable: {},//折线图 key 对应显示 lable
      CardFlow_xAxis: [],//折线图 X 轴显示
      CardFlow_colorArr: ['#3c97fd', '#67c23a'],//折线图 颜色
      CardFlow_config: {},//折线图 基础配置
    };




  },
  mounted() {

  },
  methods: {

    //快捷入口是否显示
    quickEntry(){
      this.quickEntryShow = !this.quickEntryShow;
    },

    goTarget(href) {
      window.open(href, "_blank");
    },
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    handleSetLineChartData(type) {

    },

    //按日按月查询 [数据]
    changeflowType(){

      if(this.indexpage.businessVolumeFlow.Day_CardFlow_xAxis!=null &&  this.indexpage.businessVolumeFlow.Day_CardFlow_xAxis.length>0){
        //this.CardFlow_xAxis = this.indexpage.lifeCycleDistribution.Day_CardFlow_xAxis;
        if(this.flowType==true){
          this.CardFlowArr = this.indexpage.businessVolumeFlow.Month_CardFlowMap;
          this.CardFlow_xAxis = this.indexpage.businessVolumeFlow.Month_CardFlow_xAxis;
          this.cardFlowList = this.indexpage.businessVolumeFlow.Month_cardFlowList;
          this.CardFlow_colorArr = ['#67c23a'];
        }else{
          this.CardFlowArr = this.indexpage.businessVolumeFlow.Day_CardFlowMap;
          this.CardFlow_xAxis = this.indexpage.businessVolumeFlow.Day_CardFlow_xAxis;
          this.cardFlowList = this.indexpage.businessVolumeFlow.Day_cardFlowList;
          this.CardFlow_colorArr = ['#3c97fd'];
        }
        this.CardFlow_show = true;
      }else{

      }
    },

    //获取在线用户总数
    getOnelinCount(){
      console.log("getOnelinCount")
      if(this.loadingOnelinCount==false){
        this.loadingOnelinCount = true;
        list(this.queryParams).then(response => {
          //console.log(response)
          this.getOnelinCountTime =  tools.getdatetime();
          this.indexpage.onlineCount = response.total;
          let _this = this;
          setTimeout(function(){
            _this.loadingOnelinCount = false;
            //console.log("setloadingOnelinCount")
          },120*1000);
        });
      }
    },


    loadIndex(){
      //console.log(this.allowloading)
      if(this.allowloading) {

        let Pwd_Str = tools.encrypt(JSON.stringify({}));
        findToDay(Pwd_Str).then(response => {
          this.allowloading = false;//禁止重复多次加载
          let jsonobj = JSON.parse(tools.Decrypt(response));
          // console.log(jsonobj);
          if (jsonobj.code == 200) {
            let data = jsonobj.Data.data;
            // console.log(data)
            if (data != null && data != undefined) {
              this.indexpage = data;
              this.indexpage.onlineCount = 1;
              if (tools.Is_null(data.businessVolumeFlow )) {
                let businessVolumeFlow = JSON.parse(data.businessVolumeFlow);
                // console.log(businessVolumeFlow)
                this.indexpage.businessVolumeFlow = businessVolumeFlow;
              }
              if (tools.Is_null(data.businessVolumeMessage )) {
                let businessVolumeMessage = JSON.parse(data.businessVolumeMessage);
                this.indexpage.businessVolumeMessage = businessVolumeMessage;
              }
              if (tools.Is_null(data.businessVolumeVoice )) {
                let businessVolumeVoice = JSON.parse(data.businessVolumeVoice);
                this.indexpage.businessVolumeVoice = businessVolumeVoice;
              }

              if (tools.Is_null(data.lifeCycleDistribution )) {
                let lifeCycleDistribution = JSON.parse(data.lifeCycleDistribution);
                // console.log(lifeCycleDistribution)
                this.indexpage.lifeCycleDistribution = lifeCycleDistribution;
              }


              if (data.requestMap != null) {
                let requestMap = JSON.parse(data.requestMap);
                this.indexpage.requestMap = requestMap;
              }
              console.log( this.indexpage.api_pending_order)
              window['IoTLink-indexData'] = this.indexpage;
              this.Myload();
            } else {
              /* this.status_ShowId_P_series.data = [
                 {value: 0, name: '库存'},
                 {value: 0, name: '可测试'},
                 {value: 0, name: '待激活'},
                 {value: 0, name: '已激活'},
                 {value: 0, name: '已停机'},
                 {value: 0, name: '预销户'},
                 {value: 0, name: '已销户'},
                 {value: 0, name: '未知'},
               ];
               this.status_ShowId_show = true;

               this.CardFlowArr = {
                 expectedData: [0, 0, 0, 0, 0, 0, 0],
                 /!*actualData: [120, 82, 91, 154, 162, 140, 145]*!/
               };
               this.CardFlow_xAxis = ['01-12', '01-13', '01-14', '01-15', '01-16', '01-17', '01-18'];
               this.CardFlow_show = true;*/
            }


            this.msgSuccess(jsonobj.Data.Message);
          } else {
            let msg = jsonobj.Data != null && jsonobj.Data != '' && jsonobj.Data.Message != null && jsonobj.Data.Message != '' ? jsonobj.Data.Message : jsonobj.msg;
            this.msgError(msg);
          }
          if (jsonobj.deptId == '100'){
            this.loadingOnelinCount = false;//加载 在线用户
          }
          let _this = this;
          setTimeout(function () {
            _this.allowloading = true;
            //console.log("setAllowloading")
          }, 30000);
        })

      }else{
        this.msgError("请30S后再请求刷新！");
      }
    },


    Myload(){

      //生命周期分布
      if(this.indexpage.lifeCycleDistribution.data!=null &&  this.indexpage.lifeCycleDistribution.data.length>0){
        this.status_ShowId_P_series.data = this.indexpage.lifeCycleDistribution.data;
      }else{
        this.status_ShowId_P_series.data = [
          {value: 0, name: '库存'},
          {value: 0, name: '可测试'},
          {value: 0, name: '待激活'},
          {value: 0, name: '已激活'},
          {value: 0, name: '已停机'},
          {value: 0, name: '预销户'},
          {value: 0, name: '已销户'},
          {value: 0, name: '未知'},
        ];
      }

      // 业务使用量
      // 数据
      if(this.indexpage.businessVolumeFlow.Day_CardFlow_xAxis!=null &&  this.indexpage.businessVolumeFlow.Day_CardFlow_xAxis.length>0){
        //this.CardFlow_xAxis = this.indexpage.lifeCycleDistribution.Day_CardFlow_xAxis;
        this.CardFlowArr = this.indexpage.businessVolumeFlow.Day_CardFlowMap;
        this.CardFlow_xAxis = this.indexpage.businessVolumeFlow.Day_CardFlow_xAxis;
        this.cardFlowList = this.indexpage.businessVolumeFlow.Day_cardFlowList;
      }else{
        this.CardFlowArr = {
          expectedData: [100, 120, 161, 134, 105, 160, 165],
          /*actualData: [120, 82, 91, 154, 162, 140, 145]*/
        };
        this.CardFlow_xAxis = ['01-12', '01-13', '01-14', '01-15', '01-16', '01-17', '01-18'];
      }
      this.CardFlow_show = true;
      this.status_ShowId_show = true;
      //console.log( this.indexpage.requestMap.Pmap_activationCardCount)
    },

  },








};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    /*padding: 10px 20px;*/
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }

  .app-container {
    padding: 8px !important;
  }

  .my-link-type {
    text-align: center;
  }

  .el-main {
    padding: 8px 10px !important;
  }

  aside {
    padding: 8px 10px !important;
  }

  .el-menu-item {
    padding: 0px !important;
    font-size: 16px;
  }

  .el-menu {
    border-right: solid 0px #e6e6e6;
  }

  .right_5 {
    margin-right: 5px;
  }

  .el-divider--horizontal {
    margin: 8px 0 !important;
  }


}


.el-card__body {
  padding: 0px 10px 0px 10px!important;
}

.My_tooltip {
  color: #fd883c;
}

.My_tooltip_46a6ff {
  color: #46a6ff;
}

.el-card__header {
  padding: 10px 19px !important;
}
</style>


<style lang="scss" scoped>
.panel-group {
  /*margin-top: 18px;*/

  .card-panel-col {
    /* margin-bottom: 32px;*/
  }

  .card-panel {
    height: 70px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-simCard {
        background: #40c9c6;
      }

      .icon-upwardTrend {
        background: #36a3f7;
      }

      .icon-used {
        background: #f4516c;
      }

      .icon-Proportion {
        background: #1682e6
      }
    }

    .icon-simCard {
      color: #40c9c6;
    }

    .icon-upwardTrend {
      color: #36a3f7;
    }

    .icon-used {
      color: #f4516c;
    }

    .icon-Proportion {
      color: #1682e6
    }

    .card-panel-icon-wrapper {
      float: left;
      /* margin: 14px 0 0 14px;*/
      padding: 10px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      margin-right: 5px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      /* float: right;*/
      font-weight: bold;
      margin: 10px;
      margin-left: 5px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 13px;
        margin-bottom: 12px;
      }

      .card-panel-text-font {
        font-weight: 700;
        font-size: 1.24rem;
        color: #3b4e66;
        margin-right: 0.1rem;
      }

      .card-panel-num {
        font-size: 18px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}


</style>


<style lang="scss" scoped>
.my_panel-group {
  /*margin-top: 18px;*/

  .card-panel-col {
    /* margin-bottom: 32px;*/
  }

  .card-panel {
    /*height: 70px;*/
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-simCard {
        background: #40c9c6;
      }

      .icon-upwardTrend {
        background: #36a3f7;
      }

      .icon-used {
        background: #f4516c;
      }

      .icon-Proportion {
        background: #1682e6
      }
    }

    .icon-simCard {
      color: #40c9c6;
    }

    .icon-upwardTrend {
      color: #36a3f7;
    }

    .icon-used {
      color: #f4516c;
    }

    .icon-Proportion {
      color: #1682e6
    }

    .card-panel-icon-wrapper {
      float: left;
      /* margin: 14px 0 0 14px;*/
      padding: 10px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      margin-right: 5px;
    }

    .card-panel-icon {
      float: left;
      font-size: 40px;
    }

    .card-panel-description {
      /* float: right;*/
      font-weight: bold;
      margin: 5px;
      margin-left: 2.5px;

      .card-panel-text {
        line-height: 24px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 13px;
        /*margin-bottom: 12px;*/
      }

      .card-panel-text-font {
        font-weight: 700;
        font-size: 1.24rem;
        color: #3b4e66;
        margin-right: 0.1rem;
      }

      .card-panel-num {
        font-size: 18px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}


</style>
<style>
body{
  background-color:  rgb(255 255 255 / 50%);
}
</style>
