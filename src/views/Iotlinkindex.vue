<template>
  <div class="app-container home">

    <el-row :gutter="20">

      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>
          <a href="https://gitee.com/sdyunze/iotlink" target="_blank">IoTLink</a> &nbsp;&nbsp;
          <a href="https://gitee.com/sdyunze/iotlink/stargazers" target="_blank"><img src="https://gitee.com/sdyunze/iotlink/badge/star.svg?theme=gvp" alt="star"/></a>
          <a style="margin-left: 10px;" href="https://gitee.com/sdyunze/iotlink/members" target="_blank"><img src="https://gitee.com/sdyunze/iotlink/badge/fork.svg?theme=gvp" alt="fork"/></a>
        </h2>
        <h3>  IoTLink 快速开发框架无需授权即可商业使用，代码全部开源免费且无任何加密。</h3>
        <h4>  IoTLink基于 SpringBoot、Vue、Mybatis、RabbitMq、Mysql、Redis 等开发,支持物联网卡、物联网模组、卡+模组融合管理。</h4>
        <h4>  提供状态、资费、客户、进销存、合同、订单、续费、充值、诊断、账单等功能。</h4>
        <h4>  可同时接入中国移动、中国电信、中国联通、第三方物联网卡进行统一管理。逐步完善平台，助您快速接入物联网，让万物互联更简单。</h4>
        <h4>  通信管理:主要用于所有物联卡的综合信息查询，同时提供不涉及资费产品订购的终端和物联卡的功能配置管理。</h4>
        <h4>  资费管理:资费决定了用户使用通信服务功能，如数据、短信和语言服务的权限和计费方式。</h4>
        <h4>  生命周期:物联卡在使用过程中各个特征时期，包括：可测试、库存、待激活、已激活、已停机、预销户、已销户(参考移动EC)。</h4>
        <h3>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </h3>
        <p>
          <el-button type="danger">&yen;免费开源</el-button>

          <el-button
            type="danger"
            size="mini"
            icon="el-icon-cloudy"
            plain
            @click="goTarget('https://www.aliyun.com/minisite/goods?userCode=3mwvbeng')"
          >领取阿里云通用云产品1888优惠券</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-video-camera-solid"
            plain
            @click="goTarget('https://www.bilibili.com/video/BV1ZK411Q7Vk/?spm_id_from=333.999.0.0')"
          >视频教程</el-button>
        </p>
        <p>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-cloudy"
            plain
            @click="goTarget('https://gitee.com/sdyunze/iotlink?_from=gitee_search')"
          >访问码云</el-button>
          <el-button
            size="mini"
            icon="el-icon-s-home"
            plain
            @click="goTarget('http://demo.5iot.com')"
          >访问主页</el-button>

        </p>
      </el-col>
      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>RabbtMQ</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-divider />

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>联系信息</span>
          </div>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 官网：<el-link
              href="http://www.5iot.com"
              target="_blank"
            >http://www.5iot.com</el-link
            >
            </p>
            <p>
              <i class="el-icon-money"></i> 文档：
              <el-link
                href="http://doc.5iot.com"
                target="_blank"
              >http://doc.5iot.com</el-link>
            </p>
            <p>
              <i class="el-icon-video-camera-solid"></i> 教程：
              <el-link
                href="https://space.bilibili.com/481336443"
                target="_blank"
              >https://space.bilibili.com/481336443</el-link>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="13" :lg="11">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>更新日志</span>
          </div>
          <el-collapse accordion v-model="activeName">
            <el-collapse-item title="v1.29.0 - 2023-6-20"  name="13">
              <ol>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-用量补偿-正常</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-用量补偿-所有-近三天</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-订单请求API重试</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-资费计划-卡数量同步</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>API接口资费充值</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.29.0 - 2023-6-20"  name="12">
              <ol>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-生命周期补偿近七天</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-生命后期补偿-所有-近三天</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-用量补偿-所有-近七天</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-用量补偿-所有-近三天</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.25.0 - 2023-5-15"  name="11">
              <ol>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>卡管理增加排序</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>批量短信抄送</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>通道管理增加短信配置</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>短信抄送记录</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>短信接收记录</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>通道增加查看上游成员组</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>通道增加上有同步卡号功能自动同步</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-自动同步卡号邮件通知</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-同步通道成员组</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-通道组同步成员</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-接入号同步iccid数据等</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-对比主表数据进行标记</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>定时任务-上游标记数据新增</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag>通道管理界面优化</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.10.0 - 2023-04-05"  name="10">
              <ol>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 第三方接口 梦网</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>第三方接口 腾宇</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.8.0 - 2023-03-09"  name="9">
              <ol>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 第三方接口 翼控</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>第三方接口 中创</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>第三方接口 旭宇</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.5.2 - 2023-02-14"  name="8">
              <ol>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag>第三方接口 电信CMP5G</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag>web端部署教程视频 <a href="https://www.bilibili.com/video/BV1J84y1p7uU/?spm_id_from=333.999.0.0" style="color: red"> 视频地址 </a></li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag>新增卡用量轮训实时调试视频<a href="https://www.bilibili.com/video/BV1ee4y1w7wF/?spm_id_from=333.999.0.0" style="color: red"> 视频地址 </a></li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.5.0 - 2023-02-02"  name="7">
              <ol>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag>第三方接口 联通CMP</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag>第三方接口 硕朗</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag>第三方接口 移远</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.2.1 - 2023-01-12"  name="6">
              <ol>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 对外接口模块 <a style="color: red" target="_blank" href="https://gitee.com/sdyunze/iotlink/tree/master/yunze-iotapi">yunze-iotapi</a> </li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 微信端部署教程</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag>电信DCP查询激活时间接口</li>
                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 所属卡 已到沉默期 无激活时间 无发货日期SQL</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.1.2 - 2022-12-05"  name="6">
              <ol>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 对外接口模块 <a style="color: red" target="_blank" href="https://gitee.com/sdyunze/iotlink/tree/master/yunze-iotapi">yunze-iotapi</a> </li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag>API账号管理</li>
                <li><el-tag  type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 电信CMP在线信息返回解析</li>
                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 电信CMP5G卡状态解析</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> MQ初始化改为读取JSON文件初始化</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 资费订购生效类型为周期延顺时获取资费开始时间bug</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.0.0 - 2022-08-31"  name="5">
              <ol>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 资费订单 退订且在此订购其他资费同时操作</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 企业预存、授信</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 企业可续费、可充值空套餐卡号</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 续费需通过审核通过后方可到账</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 上游资费信息同步</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 轮询错误数据记录、业务错误、非业务错误通知指定自动化配置邮箱</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 批量任务执行、可查看执行状态数据提供导出和下载上传源文件</li>
                <li><el-tag ><i class="el-icon-plus"></i>新增</el-tag> 微信端商品管理</li>


                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 卡详情界面UI</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 智能诊断界面UI</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 独立出定时任务执行程序避免因为定时任务占用主程序线程导致主程序卡顿</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 通道、平台资费、客户资费卡总数统计</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 新增 登录地址、账号、密码、是否正常、对接信息</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 关闭用量详情单独菜单点击进入 仅允许输入卡号查询</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 卡列表导出通道和运营信息写入</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v0.8.0 - 2022-04-30"  name="4">
              <ol>

                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 单卡增加是否轮询业务实现</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 无需登录查询简要卡信息界面</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 当网络类型为 'NB' 时查询上游接口是为当前账期内用量</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 通道与资费组关联 选择单个资费组时加载出对接的通道 选择通道时同理</li>

                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 流量计算核心算法</li>
                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 时间格式默认为 yyyy-MM-dd</li>
                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 卡详情界面增加查看通道信息</li>
                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 通道、平台资费、客户资费卡总数统计</li>
                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 新增 登录地址、账号、密码、是否正常、对接信息</li>
                <li><el-tag type="success"><i class="el-icon-s-promotion"></i>优化</el-tag> 关闭用量详情单独菜单点击进入 仅允许输入卡号查询</li>

              </ol>
            </el-collapse-item>
            <el-collapse-item title="v0.7.0 - 2022-03-31"  name="3">
              <ol>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 智能诊断、卡号匹对</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 通道-轮询算法类型 高频轮询、智能轮询</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 批量取消实名 批量更新卡信息</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 定时任务[未划分通道-邮件抄送通知]</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 定时任务[未划分资费组-邮件抄送通知]</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 定时任务[归属为总平台-有用量-邮件抄送通知]</li>
                <li><el-tag><i class="el-icon-plus"></i>新增</el-tag> 定时任务[清除大于X天用量记录(默认为开启状态清除100之前用量记录)]</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 界面操作 高级查询默认隐藏</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 登录界面样式</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 执行日志导出csv文件转换换EXCLE</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag> 轮询同步消费者、轮询算法类型实现</li>
                <li><el-tag type="warning" ><i class="el-icon-info"></i>整合</el-tag> 用户信息、企业列表、内部管理</li>
                <li><el-tag type="warning" ><i class="el-icon-info"></i>开放</el-tag> 微信Web端用量查询 充值续费 商品购买</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v0.6.0 - 2022-02-14"  name="2">
              <ol>
                <li><el-tag icon="el-icon-plus"><i class="el-icon-plus"></i>新增</el-tag>首页看板、看板选项点击快速跳转查询</li>
                <li><el-tag icon="el-icon-plus"><i class="el-icon-plus"></i>新增</el-tag>首页数据生成任务</li>
                <li><el-tag type="success" ><i class="el-icon-s-promotion"></i>优化</el-tag>说明文档架构图</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v0.5.0 - 2022-01-14"  name="1">
              <ol>
                <li>IoTLink系统开发版发布</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>关注公众号获取一手行业信息</span>
          </div>
          <div class="body">
            <img
              src="../../public/wxgzh.jpg"
              alt="donate"
            />

          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "iotlinkindex",
    data() {
      return {
        // 版本号
        version: "1.43.0",
        activeName:'12',
      };
    },
    methods: {
      goTarget(href) {
        window.open(href, "_blank");
      },
    },
  };
</script>

<style scoped lang="scss">
  .home {
    blockquote {
      padding: 10px 20px;
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
  }
</style>

