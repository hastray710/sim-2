<template>
  <div class="app-container">
    <el-row :gutter="20" v-for="items in itemsArr">
      <el-col :span="mainwidth" :xs="24">
                <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                  <a href="https://www.5iot.com/" target="view_frame"><h2 style="text-align:center;">山东云则信息技术有限公司</h2></a>
                  <a href="http://i.5iot.cn/" target="view_frame"><h2 style="text-align:center;color:blue;">
                    <u>
                      i.5iot.cn
                    </u>
                  </h2>
                  </a>
                </el-form>

        <!--接口说明-->
        <el-collapse v-model="AccountActiveNames" style="margin-left: 10px; margin-top: 10px;">
          <el-collapse-item name="0">
            <template slot="title">
              <div style="line-height :10px">
                <h2 style=" padding-left: 15px; ">一、接口说明</h2>
              </div>
            </template>
            <p data-v-md-line="2" style="text-align:center;font-size:24px;line-height :8px;">版本说明</p>
            <el-table :data="items.editionList" border>
              <el-table-column label="版本号" align="center" prop="a"/>
              <el-table-column label="更新时间" align="center" prop="b"/>
              <el-table-column label="更新人" align="center" prop="c"/>
              <el-table-column label="主要内容或重大修改" align="center" prop="d"/>
            </el-table>
            <br>
            <h4 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;text-align:center;">
              <li>目录</li>
            </h4>
            <p data-v-md-line="2" style=" padding-left: 50px; font-size:17px;text-align:center;">
              1.1： 接口命名规则..........................................................................................3<br>
              1.2：
              请求方式.................................................................................................3<br>
              1.3：
              参数规则.................................................................................................3<br>
              1.4：
              API接口支撑...........................................................................................3<br>
            </p>
            <hr>
            <p data-v-md-line="2" style=" padding-left: 50px; font-size:17px;">1.1 接口命名规则</p>
            <ul data-v-md-line="5" style=" padding-left: 110px; line-height :20px; font-size:17px;">
              <li style="line-height :10px;">服务器地址：<code style="color:blue;">{{ items.ServerUrl }}</code></li>
              <div style="width: 300px;line-height :50px">
                <li>域名：<code style="color:blue;">{{ items.domainName }}</code></li>
              </div>
              <li>接口名：<code style="color:blue;">{{ items.InterfaceName }}</code></li>
            </ul>
            <div>
              <h2 style=" padding-left: 15px; ">通用参数</h2>
            </div>


            <el-table :data="items.cardList" border>
              <el-table-column label="名称" align="center" prop="a"/>
              <el-table-column label="类型" align="center" prop="b"/>
              <el-table-column label="必填" align="center" prop="c"/>
              <el-table-column label="说明" align="center" prop="d"/>
              <el-table-column label="备注" align="center" prop="e"/>
            </el-table>

            <p data-v-md-line="2" style=" padding-left: 50px; font-size:17px;">1.2 请求方式</p>
            <h2 style=" padding-left: 90px; font-size:17px;">请求方式: post</h2>
            <p data-v-md-line="2" style=" padding-left: 50px; font-size:17px;">1.3 参数规则</p>
            <ol type="1" style=" padding-left: 110px; line-height :20px; font-size:17px;">
              <li style="line-height :30px;"> 采用HTTP传输协议。</li>
              <li style="line-height :30px;"> 通过POST请求把提交的数据则放置在HTTP包的包体中。</li>
              <li style="line-height :35px;"> 所有参数值默认需要转换为UTF-8编码。</li>
              <li style="line-height :35px;"> 支持POST请求方式的API接口。</li>
            </ol>
            <p data-v-md-line="2" style=" padding-left: 50px; font-size:17px;">1.4 API接入支撑</p>
            <ul data-v-md-line="5" style=" padding-left: 110px; line-height :20px; font-size:17px;">
              <li style="line-height :10px;">技术支持人员联系邮箱：<code style="color:blue;">{{ items.mailbox }}</code></li>
            </ul>
            <p data-v-md-line="2" style=" padding-left: 50px; font-size:17px;">1.5免责声明</p>
            <p data-v-md-line="2" style=" padding-left: 90px; font-size:18px;">
              伴随着物联网业务的发展，在后续版本迭代过程中可能存在特定接口的参数出现变更的情况，请时刻关注文档更新，实际接入以最新版本文档为准。
            </p>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <!--二、接口列表-->
    <el-row :gutter="20" v-for="items in ListArr">
      <el-col :span="mainwidthArr" :xs="24">
        <el-collapse v-model="InterfaceList" style="margin-left: 10px; margin-top: 10px;">
          <el-collapse-item name="0">
            <template slot="title">
              <div style="line-height :10px">
                <h2 style=" padding-left: 15px; ">二、接口列表</h2>
              </div>
            </template>
            <!--   循环体-->
            <div  v-for="obj in apiTable">

              <p data-v-md-line="2" style=" padding-left: 50px; font-size:23px;">{{obj.T1_title}}</p>
              <p data-v-md-line="2" style=" padding-left: 50px; line-height :7px; font-size:17px;">{{obj.T2_title}}</p>
              <h2 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;">
                <li>简要描述</li>
              </h2>
              <p data-v-md-line="2" style=" padding-left: 107px; font-size:17px; line-height :7px;">{{obj.describe}}</p>
              <h2 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;">
                <li>请求URL</li>
              </h2>
              <p data-v-md-line="2" style=" padding-left: 107px; font-size:17px; line-height :20px;color:blue;">{{obj.url}}</p>
              <h2 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;">
                <li>请求方式</li>
              </h2>
              <p data-v-md-line="2" style=" padding-left: 107px; font-size:17px; line-height :7px;">{{obj.type}}</p>
              <h2 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;">
                <li>请求参数说明</li>
              </h2>
              <el-table :data="obj.requestParameterArr" border>
                <el-table-column label="参数名" align="center" prop="name"/>
                <el-table-column label="必选" align="center" prop="requiredType"/>
                <el-table-column label="类型" align="center" prop="type"/>
                <el-table-column label="说明" align="center" prop="explanation"/>
              </el-table>
              <h2 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;">
                <li>请求示例</li>
              </h2>
              <el-input type="textarea" :rows="2" style="width: 100%;border:0.5px solid #007d65;" autosize  placeholder="请输入内容"v-model="obj.requestInstance"/>
              <h2 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;">
                <li>返回参数说明</li>
              </h2>
              <p data-v-md-line="2" style=" padding-left: 150px; font-size:17px; line-height :7px;">应答公共信息：</p>
              <el-table :data="obj.returnParameterDescription_publicIn" border>
                <el-table-column label="参数名" align="center" prop="name"/>
                <el-table-column label="必选" align="center" prop="requiredType"/>
                <el-table-column label="类型" align="center" prop="type"/>
                <el-table-column label="说明" align="center" prop="explanation"/>
              </el-table>
              <p data-v-md-line="2" style=" padding-left: 150px; font-size:17px; line-height :7px;">应答数据信息：</p>
              <el-table :data="obj.returnParameterDescription_answer" border>
                <el-table-column label="参数名" align="center" prop="name"/>
                <el-table-column label="必选" align="center" prop="requiredType"/>
                <el-table-column label="类型" align="center" prop="type"/>
                <el-table-column label="说明" align="center" prop="explanation"/>
              </el-table>
              <h2 data-v-md-line="2" style=" padding-left: 75px; font-size:20px;">
                <li>返回报文举例</li>
              </h2>
              <p data-v-md-line="2" style=" padding-left: 50px; line-height :7px; font-size:17px;">成功：</p>
              <el-input type="textarea" :rows="2" style="width: 100%;border:0.5px solid #007d65;" autosize  placeholder="请输入内容" v-model="obj.backExample_success"/>
              <p data-v-md-line="2" style=" padding-left: 50px; line-height :7px; font-size:17px;">失败：</p>
              <el-input type="textarea" :rows="2" style="width: 100%;border:0.5px solid #007d65;" autosize  placeholder="请输入内容" v-model="obj.backExample_fail"/>

            </div>




          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <!--三、辅助说明-->
    <el-row :gutter="20" v-for="items in gitListArr">
      <el-col :span="mainwidthArrL" :xs="24">
        <el-collapse v-model="InterfaceList2" style="margin-left: 10px; margin-top: 10px;">
          <el-collapse-item name="0">
            <template slot="title">
              <div style="line-height :10px">
                <h2 style=" padding-left: 15px; ">三、辅助说明</h2>
              </div>
            </template>
            <h2 data-v-md-line="2" style="  font-size:20px;">
              3.1 卡状态说明
            </h2>
            <table  border="2px" width="1000px" height="30px" cellspacing="0" cellpadding="2">
              <tr>
                <td>字段说明</td>
                <td>对应状态</td>
              </tr>
              <tr>
                <td>库存</td>
                <td style="padding-left: 50px; font-size:10px;">1</td>
              </tr>
              <tr>
                <td>可测试</td>
                <td style="padding-left: 50px; font-size:10px;">2</td>
              </tr>
              <tr>
                <td>待激活</td>
                <td style="padding-left: 50px; font-size:10px;">3</td>
              </tr>
              <tr>
                <td>已激活</td>
                <td style="padding-left: 50px; font-size:10px;">4</td>
              </tr>
              <tr>
                <td>已停机</td>
                <td style="padding-left: 50px; font-size:10px;">5</td>
              </tr>
              <tr>
                <td>预销户</td>
                <td style="padding-left: 50px; font-size:10px;">6</td>
              </tr>
              <tr>
                <td>已销户</td>
                <td style="padding-left: 50px; font-size:10px;">7</td>
              </tr>
              <tr>
                <td>未知</td>
                <td style="padding-left: 50px; font-size:10px;">8</td>
              </tr>
            </table>
            <h2 data-v-md-line="2" style="  font-size:20px;">
              3.2 卡类型说明
            </h2>
            <table  border="2px" width="1000px" height="30px" cellspacing="0" cellpadding="2">
              <tr>
                <td>字段说明</td>
                <td>对应状态</td>
              </tr>
              <tr>
                <td>中国移动</td>
                <td style="padding-left: 50px; font-size:10px;">1</td>
              </tr>
              <tr>
                <td>中国联通</td>
                <td style="padding-left: 50px; font-size:10px;">2</td>
              </tr>
              <tr>
                <td>中国电信</td>
                <td style="padding-left: 50px; font-size:10px;">3</td>
              </tr>
              <tr>
                <td>其他</td>
                <td style="padding-left: 50px; font-size:10px;">4</td>
              </tr>
            </table>
            <h2 data-v-md-line="2" style="  font-size:20px;">
              3.3 生效类型说明
            </h2>
            <table  border="2px" width="1000px" height="30px" cellspacing="0" cellpadding="2">
              <tr>
                <td>字段说明</td>
                <td>对应状态</td>
              </tr>
              <tr>
                <td>已失效</td>
                <td style="padding-left: 50px; font-size:10px;">0</td>
              </tr>
              <tr>
                <td>生效中</td>
                <td style="padding-left: 50px; font-size:10px;">1</td>
              </tr>
            </table>
            <h2 data-v-md-line="2" style="  font-size:20px;">
              3.4 生效类别说明
            </h2>
            <table  border="2px" width="1000px" height="30px" cellspacing="0" cellpadding="2">
              <tr>
                <td>字段说明</td>
                <td >对应状态</td>
              </tr>
              <tr>
                <td>当月生效</td>
                <td style="padding-left: 50px; font-size:10px;">1</td>
              </tr>
              <tr>
                <td>次月生效</td>
                <td style="padding-left: 50px; font-size:10px;">2</td>
              </tr>
              <tr>
                <td>周期延顺</td>
                <td style="padding-left: 50px; font-size:10px;">3</td>
              </tr>
            </table>
            <h2 data-v-md-line="2" style="  font-size:20px;">
              3.5 返回错误编码说明
            </h2>
            <table  id="tab"  border="2px" width="1000px" height="30px" cellspacing="0" cellpadding="2">
              <tr>
                <td >字段说明</td>
                <td style="padding-left: 210px;">对应状态</td>
              </tr>
              <tr>
                <td>缺少路径或appId</td>
                <td style="padding-left: 50px;">-1</td>
              </tr>
              <tr>
                <td>账户查询失败</td>
                <td style="padding-left: 50px; ">1001</td>
              </tr>
              <tr>
                <td>访问频率超限，请稍后访问</td>
                <td style="padding-left: 50px; ">1002</td>
              </tr>
              <tr>
                <td>无访问权限</td>
                <td style="padding-left: 50px;">1003</td>
              </tr>
              <tr>
                <td>未找到集团对应号码信息请核对后重试！</td>
                <td style="padding-left: 50px; ">1004</td>
              </tr>
              <tr>
                <td>操作失败请稍后重试！（具体看返回信息）</td>
                <td style="padding-left: 50px; ">500</td>
              </tr>
              <tr>
                <td >参数错误</td>
                <td style="padding-left: 50px; ">400</td>
              </tr>
            </table>
            <h2 data-v-md-line="2" style="  font-size:20px;">
              3.6 审核是否通过说明
            </h2>
            <table  border="2px" width="1000px" height="30px" cellspacing="0" cellpadding="2">
              <tr>
                <td>字段说明</td>
                <td>对应状态</td>
              </tr>
              <tr>
                <td>已失效</td>
                <td style="padding-left: 50px; font-size:10px;">0</td>
              </tr>
              <tr>
                <td>生效中</td>
                <td style="padding-left: 50px; font-size:10px;">1</td>
              </tr>

            </table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <!--四、请求案例-->
    <el-row :gutter="20" v-for="items in gitListArr4">
      <el-col :span="mainwidthArr4" :xs="24">
        <el-collapse v-model="InterfaceList4" style="margin-left: 10px; margin-top: 10px;">
          <el-collapse-item name="0">
            <template slot="title">
              <div style="line-height :10px">
                <h2 style=" padding-left: 15px; ">四、请求案例</h2>
              </div>
            </template>

            <el-input type="textarea" :rows="2" style="width: 100%;border:0.5px solid #007d65;" autosize  placeholder="请输入内容"
                      v-model="Requestcase"/>


          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import tools from "@/utils/yunze/tools";



export default {
  name: "apifile",
  data() {
    return {
      tools:tools,
      AccountActiveNames: ['1'],//面板默认 展开 【接口说明】
      InterfaceList: ['1'],//面板默认 展开 【接口列表】
      InterfaceList2: ['1'],//面板默认 展开 【辅助说明】
      InterfaceList4: ['1'],//面板默认 展开 【请求案例】
      textarea: '{\n' +
        '\t"Param": {\n' +
        '\t\t"type": "iccid",\n' +
        '\t\t"cardno": "89860423123123132135"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea1: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": [\n' +
        '{\n' +
        '      \n' +
        '}\n' +
        '           ]\n' +
        '}',
      textarea3: '失败：\n' +
        '{\n' +
        '    "message": "账户查询失败",\n' +
        '    "result": null,\n' +
        '    "status": "1001"\n' +
        '}',
      textarea2: '{\n' +
        '\t"Param": {\n' +
        '\t\t"type": "iccid",\n' +
        '\t\t"cardno": "89860423123123132135"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea4: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": [\n' +
        '{\n' +
        '      \n' +
        '}\n' +
        '           ]\n' +
        '}',
      textarea5: '失败：\n' +
        '{\n' +
        '    "message": "账户查询失败",\n' +
        '    "result": null,\n' +
        '    "status": "1001"\n' +
        '}',
      textarea6: '{\n' +
        '\t"Param": {\n' +
        '\t\t"iccid": "89860423123123132135"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea7: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": {\n' +
        '        "useUnit": "MB",\n' +
        '        "useAmount": 2503\n' +
        '}\n' +
        '}',
      textarea8: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea9: '{\n' +
        '\t"Param": {\n' +
        '\t\t"iccid": "89860423123123132135",\n' +
        '\t\t"dateTime": "202101"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea10: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": {\n' +
        '        "useUnit": "MB",\n' +
        '        "useAmount": 29.63\n' +
        '}\n' +
        '}',
      textarea11: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea12: '{\n' +
        '\t"Param": {\n' +
        '\t\t"iccid": "89860423123123132135"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}   ',
      textarea13: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": {\n' +
        '        "statusMessage": "正常",\n' +
        '        "statusCode": 1\n' +
        '}\n' +
        '}',
      textarea14: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea15: '{\n' +
        '\t"Param": {\n' +
        '\t\t"iccid": "89860423123123132135"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea16: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": {\n' +
        '        "typeName": "移动EC",\n' +
        '        "imei": null,\n' +
        '        "Data": {\n' +
        '            "apnId": "CMIOT",\n' +
        '            "rat": "6",\n' +
        '            "ipv6": "",\n' +
        '            "ip": "192.168.0.1",\n' +
        '            "ipv6Prefix": "",\n' +
        '            "status": "01",\n' +
        '            "createDate": "2021-01-02 13:07:39"\n' +
        '        },\n' +
        '        "type": 1,\n' +
        '        "statusMessage": null,\n' +
        '        "statusCode": -1}\n' +
        '}',
      textarea17: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea18: '{\n' +
        '\t"Param": {\n' +
        '\t\t"companyId": "3365"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea19: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": [\n' +
        ' \t\t{\n' +
        '\t\t  "blocPlantGroupId": "YZ202107020435363732",\n' +
        '"blocPlantId": "YZ3742202107020448446521",\n' +
        '"blocPlanName": "NB1年50MB",\n' +
        '"blocPlanPrice": "10.00",\n' +
        '"blocPlanCapacity": "50.00",\n' +
        '"blocPlanCost": "8.00",\n' +
        '"blocPlanTimeValue": "1",\n' +
        '"blocPlanTimeUnit": "年",\n' +
        '}\n' +
        ']\t       \n' +
        '}',
      textarea20: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea21: '{\n' +
        '\t"Param": {\n' +
        '\t\t"companyId": "3365"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea22: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": [\n' +
        ' \t\t{\n' +
        '\t\t  "blocPlantGroupId": "YZ202107020435363732",\n' +
        '"blocPlantId": "YZ3742202107020448446521",\n' +
        '"blocPlanName": "NB1年50MB",\n' +
        '"blocPlanPrice": "10",\n' +
        '"blocPlanCapacity": "50",\n' +
        '"blocPlanCost": "8",\n' +
        '"blocPlanTimeValue": "1",\n' +
        '"blocPlanTimeUnit": "年",\n' +
        '}\n' +
        ']\t       \n' +
        '}',
      textarea23: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea24: '{\n' +
        '\t"Param": {\n' +
        '\t\t"iccid": "89860423123123132135",\n' +
        '\t\t"Status": "0"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea25: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": {}\n' +
        '}',
      textarea26: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea27: '{\n' +
        '\t"Param": {\n' +
        '\t\t"iccid": "89860423123123132135",\n' +
        '\t\t"StatusBreak": "0"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea28: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": {}\n' +
        '}',
      textarea29: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',
      textarea30: '{\n' +
        '\t"Param": {\n' +
        '\t\t"iccid": "89860423123123132135",\n' +
        '\t\t"companyId": "3365",\n' +
        '"effectiveType": "1",\n' +
        '"blocPlantId": "YZ3742202107020448446521"\n' +
        '\t},\n' +
        '\t"verify": {\n' +
        '\t\t"timeStamp": "1625120582169",\n' +
        '\t\t"password": "uhbhkh223123",\n' +
        '\t\t"appId": "test",\n' +
        '\t\t"sign": "C0EBF5F9FCBFFE72CAA5AAF753EACCA5"\n' +
        '\t}\n' +
        '}',
      textarea31: '成功：\n' +
        '{\n' +
        '\t"status": "0"，\n' +
        '     "message": "success",\n' +
        '     "result": {}\n' +
        '}',
      textarea32: '失败：\n' +
        '{\n' +
        '    "message": "无访问权限",\n' +
        '    "result": null,\n' +
        '    "status": "1003"\n' +
        '}',


      //参数
      queryParams: {},
      mainwidth: 24,//宽度
      mainwidthArr: 24,
      mainwidthArrL: 24,
      mainwidthArr4: 24,
      // 显示搜索条件
      showSearch: true,
      itemsArr: [//接口说明
        {
          ServerUrl: 'http://5iot.com/api',
          domainName: 'api.5iot.cn',
          InterfaceName: 'API 接口名称',
          mailbox: 'feizhenlong@139.com',
          editionList: [//版本说明
            {a: 'V1.0.0', b: '2021-1-11', c: '', d: '新增接口：'},
            {a: 'V1.0.1', b: '2021-7-15', c: '', d: '新增接口： tariffplan| balance| subscribe：'},
            {
              a: 'V1.0.2', b: '2022-1-20', c: '', d: 'cardPacketInfo接口新增参数 all 可查询所有 【生效中】、【未生效】资费计划详情\n' +
                '卡信息接口新增 备注、分组、发货日期、激活日期、到期时间\n' +
                '卡状态说明更新\n' +
                'V1.0.2因变更【卡状态说明】所以独立出新的调用接口地址 临时地址（api1.0.1.5iot.cn）[后续还是以api.5iot.cn]\n' +
                'V1.0.1版本接口保留至 2022-03-15 23:59:59 后自动更新为V1.0.2 版本：'
            },
            {
              a: 'V1.3.0', b: '2023-07-02', c: '', d: '资费计划订购完善、集团预存余额查询完善增加字段返回：'
            },
          ],
          cardList: [//接口命名规则
            {a: 'appId', b: 'String', c: '是', d: 'Verify Map 内', e: 'appId用于唯一标识请求'},
            {a: 'password', b: 'String', c: '是', d: 'Verify Map 内', e: '密码'},
            {a: 'timeStamp', b: 'String', c: '是', d: 'Verify Map 内', e: '时间戳 “”+System.currentTimeMillis()'},
            {a: 'sign', b: 'String', c: '是', d: 'Verify Map 内', e: '签名，根据算法获取 详情参考 案例'},
          ],
        },
      ],
      ListArr: [//  二、接口列表
        {

          ArrList: [// 请求参数说明
            {
              a: 'type', b: '是', c: 'String', d: 'msisdn：所查询的物联卡号码，最长13位数字，举例：14765004176。\n' +
                'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。\n' +
                'imsi:国际移动用户识别码，其总长度不超过15位，使用0~9的数字，举例：460079650004176。 \n' +
                'vid：物联网卡虚拟编号'
            },
            {a: 'cardno', b: '是', c: 'String', d: ''},

          ],
          AnswerList: [//  应答公共信息
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          DataList: [//   应答数据信息
            {a: 'vid', b: '是', c: 'String', d: '物联网卡虚拟编号'},
            {a: 'msisdn', b: '是', c: 'String', d: '所查询的物联卡号码，最长13位数字，举例：14765004176。'},
            {a: 'iccid', b: '是', c: 'String', d: '集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
            {a: 'imsi', b: '是', c: 'String', d: '国际移动用户识别码，其总长度不超过15位，使用0~9的数字，举例：460079650004176。 '},
            {a: 'imei', b: '是', c: 'String', d: '国际移动设备识别码，共有15~17位数字，前8位（TAC）是型号核准号码（早期为6位），是区分品牌和型号的编码。'},
            {a: 'deptName', b: '是', c: 'String', d: '所属集团名称'},
            {a: 'statusId', b: '是', c: 'int', d: '卡状态  详细请参考 3.1 卡状态说明'},
            {a: 'packageId', b: '是', c: 'String', d: '套餐编号'},
            {a: 'packageName', b: '是', c: 'String', d: '套餐名称'},
            {a: 'used', b: '是', c: 'double', d: '周期用量'},
            {a: 'remaining', b: '是', c: 'double', d: '周期剩余'},
            {a: 'type', b: '是', c: 'String', d: '卡类型  详细请参考 3.2 卡类型说明'},
            {a: 'packetArr', b: '是', c: 'list', d: 'List<Map<String,Object>>资费计划仅展示最后生效1条'},
            {a: 'validName', b: '是', c: 'String', d: '计费单位 （月/年） packetArr{}里数据'},
            {a: 'validTime', b: '是', c: 'int', d: '计费时间 int packetArr{}里数据'},
            {a: 'startTime', b: '否', c: 'datetime', d: '计费开始时间 packetArr{}里数据'},
            {a: 'endTime', b: '否', c: 'datetime', d: '计费结束时间 packetArr{}里数据'},
            {a: 'packetName', b: '是', c: 'String', d: '资费计划名称 packetArr{}里数据'},
            {a: 'status', b: '是', c: 'int', d: '生效状态详细请参3.3生效类型说明packetArr{}里数据'},
            {a: 'remark', b: '否', c: 'String', d: '备注'},
            {a: 'grouping', b: '否', c: 'String', d: '分组'},
            {a: 'deliverDate', b: '否', c: 'String', d: '发货日期 yyyy-MM-dd'},
            {a: 'activateDate', b: '否', c: 'String', d: '激活日期 yyyy-MM-dd'},
            {a: 'expireTime', b: '否', c: 'datetime', d: '到期时间 yyyy-MM-dd HH:mm:ss'},
          ],
          ExplainList: [ // 请求参数说明
            {
              a: 'type', b: '是', c: 'String', d: 'msisdn：所查询的物联卡号码，最长13位数字，举例：14765004176。\n' +
                'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。\n' +
                'imsi:国际移动用户识别码，其总长度不超过15位，使用0~9的数字，举例：460079650004176。 \n' +
                'vid：物联网卡虚拟编号'
            },
            {a: 'cardno', b: '是', c: 'String', d: ''},
            {a: 'all', b: '否', c: 'String', d: '默认不填写时为 ‘0’填写为‘1’时查询 【生效中】、【未生效】所有 资费计划详情'},
          ],
          FromList: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          PublieList: [
            {a: 'packageName', b: '是', c: 'String', d: '资费组名称'},
            {a: 'createTime', b: '否', c: 'datetime', d: '创建时间'},
            {a: 'startTime', b: '否', c: 'datetime', d: '计费开始时间 '},
            {a: 'endTime', b: '否', c: 'datetime', d: '计费结束时间 '},
            {a: 'packetName', b: '是', c: 'String', d: '资费计划名称 '},
            {a: 'status', b: '是', c: 'int', d: '生效状态 详细请参3.3生效类型说明 '},
            {a: 'packageId', b: '是', c: 'String', d: '资费组编号'},
            {a: 'packetId', b: '是', c: 'String', d: '资费计划编号'},
            {a: 'ordType', b: '是', c: 'String', d: '生效类别 详细请参3.4生效类别说明 '},
          ],
          getList: [
            {a: 'iccid', b: '是', c: 'String', d: 'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
          ],
          getList1: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          getList2: [
            {a: 'useUnit', b: '是', c: 'String', d: '用量单位'},
            {a: 'useAmount', b: '是', c: 'double', d: '用量'},
          ],
          getList3: [
            {a: 'iccid', b: '是', c: 'String', d: 'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
            {a: 'dateTime', b: '是', c: 'String', d: '时间 yyyyMM 如 202101 注意：当月的去账期用量查询！'},
          ],
          getList4: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {a: 'result', b: '是', c: 'Object', d: '返回结果集（status为“0”时，result包含正确的结果数据；status'},
            {a: '', b: '', c: '', d: '为“非0”时， result可能为空，也可能包含其他提示数据）'},
          ],
          getList5: [
            {a: 'useUnit', b: '是', c: 'String', d: '用量单位'},
            {a: 'useAmount', b: '是', c: 'double', d: '用量'},
          ],
          getList6: [
            {a: 'iccid', b: '是', c: 'String', d: 'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
          ],
          getList7: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          getList8: [
            {a: 'statusMessage', b: '是', c: 'String', d: '状态描述'},
            {a: 'statusCode', b: '是', c: 'double', d: '生命周期状态 详细参考 3.1 卡状态说明'},
          ],
          getList9: [
            {a: 'iccid', b: '是', c: 'String', d: 'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
          ],
          getList10: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          getList11: [
            {a: 'typeName', b: '是', c: 'String', d: '运营商系统类型'},
            {a: 'imei', b: '否', c: 'String', d: '获取当前绑定IMEI (typeName为‘电信CMP’取值 )'},
            {a: 'statusMessage', b: '否', c: 'String', d: '断开网状态说明(typeName为‘电信CMP’取值 )'},
            {
              a: 'statusCode', b: '否', c: 'String', d: '断开网编码 1 开网状态 2 断网状态\n' +
                '(typeName为‘电信CMP’取值 )'
            },
            {a: 'Data', b: '否', c: 'Map', d: '(typeName为‘移动EC’取值 )'},
            {a: 'apnId', b: '是', c: 'String', d: 'APN ID [Data 内部数据]'},
            {
              a: 'rat', b: '是', c: 'String', d: '接入方式：[Data 内部数据]\n' +
                '1: 3G\n' +
                '2: 2G\n' +
                '6: 4G\n' +
                '8: NB'
            },
            {a: 'ipv6', b: '否', c: 'String', d: 'Ipv6 地址[Data 内部数据]'},
            {a: 'ip', b: '是', c: '无', d: 'IP 地址[Data 内部数据]'},
            {a: 'ipv6Prefix', b: '是', c: '无', d: 'Ip6前缀[Data 内部数据]'},
            {
              a: 'status', b: '是', c: '无', d: '在线状态[Data 内部数据]\n' +
                '00: 离线\n' +
                '01：在线'
            },
            {a: 'createDate', b: '是', c: '无', d: '会话创建时间[Data 内部数据]'},
          ],
          getList12: [
            {a: 'companyId', b: '是', c: 'String', d: '集团编号 '},
          ],
          getList13: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败 '},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          getList14: [
            {a: 'blocPlantGroupId', b: '是', c: 'String', d: '资费组编号'},
            {a: 'blocPlantId', b: '否', c: 'String', d: '资费计划编号'},
            {a: 'blocPlanName', b: '否', c: 'String', d: '资费计划名称'},
            {a: 'blocPlanPrice', b: '否', c: 'String', d: '资费计划售价'},
            {a: 'blocPlanCapacity', b: '否', c: 'Map', d: '资费计划规格(单位为 MB)'},
            {a: 'blocPlanCost', b: '否', c: 'String', d: '资费计划成本'},
            {a: 'blocPlanTimeValue', b: '是', c: 'String', d: '资费计划 时间值 如： 1'},
            {a: 'blocPlanTimeUnit', b: '是', c: '无', d: '资费计划时间单位 如 ：月/年'},
          ],
          getList15: [
            {a: 'companyId', b: '是', c: 'String', d: '集团编号 '},
          ],
          getList16: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          getList17: [
            {a: 'companyName', b: '否', c: 'String', d: '集团名称'},
            {a: 'companyBalance', b: '否', c: 'String', d: '集团可用余额'},
          ],
          getList18: [
            {a: 'iccid', b: '是', c: 'String', d: 'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
            {a: 'Status', b: '是', c: 'String', d: '0 开机 1 停机'},
          ],
          getList19: [
            {a: 'status', b: '是', c: 'String', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: 'String', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {
              a: 'result',
              b: '是',
              c: 'Object',
              d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'
            },
          ],
          getList20: [],
          getList21: [
            {a: 'iccid', b: '是', c: 'String', d: 'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
            {a: 'StatusBreak', b: '是', c: 'String', d: '0 开网 1 断网'},
          ],
          getList22: [
            {a: 'status', b: '是', c: '无', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: '无', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {a: 'result', b: '是', c: '无', d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'},
          ],
          getList23: [
            {a: 'iccid', b: '是', c: 'String', d: 'iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。'},
            {a: 'companyId', b: '是', c: 'String', d: '集团编号 '},
            {
              a: 'effectiveType', b: '是', c: 'String', d: '生效类型详细请参3.4生效类别说明\n' +
                '当月生效\t1\n' +
                '次月生效\t2\n' +
                '周期延顺\t3 '
            },
            {a: 'blocPlantId', b: '是', c: 'String', d: '资费计划编号 (来源 2.1.6 资费计划 可用查询 ) '},
          ],
          getList24: [
            {a: 'status', b: '是', c: '无', d: '错误码。0-成功   非0-失败'},
            {a: 'message', b: '是', c: '无', d: '错误信息。错误码对应的错误描述，参考错误码列表'},
            {a: 'result', b: '是', c: '无', d: '返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）'},
          ],
        },
      ],
      //三、 辅助说明
      gitListArr: [
        {

        }
      ],
      //
      gitListArr4: [
        {

        }
      ],




      //请求案例

      Requestcase:"// 服务器请求地址     http://api.5iot.com/route/open/cardInfo\n" +
        "\tprotected  static String server_Ip = \"http://api.5iot.cn/route/open\";\n" +
        "\t// appId\n" +
        "\tpublic static String appId = null;\n" +
        "\t//秘钥密码\n" +
        "\tpublic static String password= null;\n" +
        "\n" +
        "\n" +
        "\t/**\n" +
        "\t * Sign 加密类\n" +
        "\t * @param map\n" +
        "\t * @param key\n" +
        "\t * @return\n" +
        "\t */\n" +
        "\tpublic static String getSign(Map<String,Object> map,String key){\n" +
        "\t\tList<String> list=new ArrayList<>(map.keySet());\n" +
        "\t\tCollections.sort(list);\n" +
        "\t\tStringBuffer sb=new StringBuffer();\n" +
        "\t\tfor(int i=0;i<list.size();i++){\n" +
        "\t\t\tString k =list.get(i);\n" +
        "\t\t\tString v=(String )map.get(k);\n" +
        "\t\t\tsb.append(k).append(\"=\").append(v).append(\"&\");\n" +
        "\t\t}\n" +
        "\t\tString signstr=sb.append(\"key=\").append(key).toString();\n" +
        "\t\tString sign = MD5Util.MD5Encode(signstr).toUpperCase();\n" +
        "\t\treturn sign;\n" +
        "\t}\n" +
        "\n" +
        "\n" +
        "\tpublic static void main(String[] args) {\n" +
        "\n" +
        "\t\tMap<String, Object> map = new HashMap<String, Object>();\n" +
        "\t\tMap<String, Object> Parmap = new HashMap<String, Object>();\n" +
        "\t\tMap<String, Object> verify = new HashMap<String, Object>();\n" +
        "\n" +
        "\t\tString appId = \"test\";\n" +
        "\t\tString password = \"uhbhkh223123\";\n" +
        "\t\tString access_key = \"1234567896132\";\n" +
        "\t\tString timeStamp = \"\"+System.currentTimeMillis() ;\n" +
        "\n" +
        "\t\tverify.put(\"password\", password);\n" +
        "\t\tverify.put(\"appId\", appId);\n" +
        "\t\tverify.put(\"timeStamp\", timeStamp);\n" +
        "\t\tverify.put(\"sign\", getSign(verify, access_key));\n" +
        "\n" +
        "\t\tParmap.put(\"type\", \"iccid\");\n" +
        "\t\tParmap.put(\"cardno\", \"89860423123123132135\");\n" +
        "\n" +
        "\n" +
        "\t\tmap.put(\"verify\", verify);\n" +
        "\t\tmap.put(\"Param\", Parmap);\n" +
        "\n" +
        "\t\tserver_Ip +=\"/cardInfo\";\n" +
        "\t\tString result = null;\n" +
        "\n" +
        "\t\tString data = JSON.toJSONString(map);\n" +
        "\t\tresult = HttpUtil.post(server_Ip, data);// 返回结果字符串\n" +
        "\t\tSystem.out.println(result);\n" +
        "\t}",



      //接口列表
      apiTable:[
        {
          T1_title:"2.1 查询类",
          T2_title:"2.1.1 SIM卡信息详情",
          describe:"查询物联卡码号信息基础信息。",
          url:"http://api.5iot.cn/route/open/cardInfo",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"type",
              requiredType:"是",
              type:"String",
              explanation:"msisdn：所查询的物联卡号码，最长13位数字，举例：14765004176。 iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。 imsi:国际移动用户识别码，其总长度不超过15位，使用0~9的数字，举例：460079650004176。 vid：物联网卡虚拟编号",
            },
            {
              name:"cardno",
              requiredType:"是",
              type:"String",
              explanation:"",
            },
          ],
          requestInstance:tools.formatJson('{"Param":{"type":"iccid","cardno":"89860423123123132135"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}'),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"vid",
              requiredType:"是",
              type:"String",
              explanation:"物联网卡虚拟编号",
            },
            {
              name:"msisdn",
              requiredType:"是",
              type:"String",
              explanation:"所查询的物联卡号码，最长13位数字，举例：14765004176。",
            },
            {
              name:"iccid",
              requiredType:"是",
              type:"Object",
              explanation:"集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。",
            },
            {
              name:"imsi",
              requiredType:"是",
              type:"String",
              explanation:"国际移动用户识别码，其总长度不超过15位，使用0~9的数字，举例：460079650004176。",
            },
            {
              name:"imei",
              requiredType:"是",
              type:"String",
              explanation:"国际移动设备识别码，共有15~17位数字，前8位（TAC）是型号核准号码（早期为6位），是区分品牌和型号的编码。",
            },
            {
              name:"deptName",
              requiredType:"是",
              type:"String",
              explanation:"所属集团名称",
            },
            {
              name:"statusId",
              requiredType:"是",
              type:"int",
              explanation:"卡状态 详细请参考 3.1 卡状态说明",
            },
            {
              name:"packageId",
              requiredType:"是",
              type:"String",
              explanation:"套餐编号",
            },
            {
              name:"packageName",
              requiredType:"是",
              type:"String",
              explanation:"套餐名称",
            },
            {
              name:"used",
              requiredType:"是",
              type:"double",
              explanation:"周期用量",
            },
            {
              name:"remaining",
              requiredType:"是",
              type:"double",
              explanation:"周期剩余",
            },
            {
              name:"type",
              requiredType:"是",
              type:"String",
              explanation:"卡类型 详细请参考 3.2 卡类型说明",
            },
            {
              name:"packetArr",
              requiredType:"是",
              type:"list",
              explanation:"List<Map<String,Object>>资费计划仅展示最后生效1条",
            },
            {
              name:"validName",
              requiredType:"是",
              type:"String",
              explanation:"计费单位 （月/年） packetArr{}里数据",
            },
            {
              name:"validTime",
              requiredType:"是",
              type:"int",
              explanation:"计费时间 int packetArr{}里数据",
            },
            {
              name:"startTime",
              requiredType:"是",
              type:"datetime",
              explanation:"计费开始时间 packetArr{}里数据",
            },
            {
              name:"endTime",
              requiredType:"是",
              type:"datetime",
              explanation:"计费结束时间 packetArr{}里数据",
            },
            {
              name:"packetName",
              requiredType:"是",
              type:"String",
              explanation:"资费计划名称 packetArr{}里数据",
            },
            {
              name:"status",
              requiredType:"是",
              type:"int",
              explanation:"生效状态详细请参3.3生效类型说明packetArr{}里数据\n",
            },
            {
              name:"remark",
              requiredType:"是",
              type:"String",
              explanation:"备注",
            },
            {
              name:"grouping",
              requiredType:"是",
              type:"String",
              explanation:"分组",
            },
            {
              name:"deliverDate",
              requiredType:"是",
              type:"String",
              explanation:"发货日期 yyyy-MM-dd",
            },
            {
              name:"activateDate",
              requiredType:"是",
              type:"String",
              explanation:"激活日期 yyyy-MM-dd",
            },
            {
              name:"expireTime",
              requiredType:"是",
              type:"datetime",
              explanation:"到期时间 yyyy-MM-dd HH:mm:ss",
            },

          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":[{}]}'),
          backExample_fail:tools.formatJson('{"message":"账户查询失败","result":null,"status":"1001"}'),
        },
        {
          T1_title:"",
          T2_title:"2.1.2 SIM卡资费计划详情",
          describe:"查询物联卡码号 有效时间周期内资费计划详情。",
          url:"http://api.5iot.cn/route/open/cardPacketInfo",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"type",
              requiredType:"是",
              type:"String",
              explanation:"msisdn：所查询的物联卡号码，最长13位数字，举例：14765004176。 iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。 imsi:国际移动用户识别码，其总长度不超过15位，使用0~9的数字，举例：460079650004176。 vid：物联网卡虚拟编号",
            },
            {
              name:"cardno",
              requiredType:"是",
              type:"String",
              explanation:"",
            },
            {
              name:"all",
              requiredType:"否",
              type:"String",
              explanation:"默认不填写时为 ‘0’填写为‘1’时查询 【生效中】、【未生效】所有 资费计划详情",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"type":"iccid","cardno":"89860423123123132135"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功 非0-失败",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"packageName",
              requiredType:"是",
              type:"String",
              explanation:"资费组名称",
            },
            {
              name:"createTime",
              requiredType:"否",
              type:"datetime",
              explanation:"创建时间",
            },
            {
              name:"startTime",
              requiredType:"否",
              type:"datetime",
              explanation:"计费开始时间",
            },
            {
              name:"endTime",
              requiredType:"否",
              type:"datetime",
              explanation:"计费结束时间",
            },
            {
              name:"packetName",
              requiredType:"是",
              type:"String",
              explanation:"资费计划名称",
            },
            {
              name:"status",
              requiredType:"是",
              type:"int",
              explanation:"生效状态 详细请参3.3生效类型说明",
            },
            {
              name:"packageId",
              requiredType:"是",
              type:"String",
              explanation:"资费组编号",
            },
            {
              name:"packetId",
              requiredType:"是",
              type:"String",
              explanation:"资费计划编号",
            },
            {
              name:"ordType",
              requiredType:"是",
              type:"String",
              explanation:"生效类别 详细请参3.4生效类别说明",
            },

          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":[{}]}'),
          backExample_fail:tools.formatJson('{"message":"账户查询失败","result":null,"status":"1001"}'),
        },
        {
          T1_title:"",
          T2_title:"2.1.3 SIM卡账期用量查询",
          describe:"查询物联卡码号 账期用量。",
          url:"http://api.5iot.cn/route/open/simDataUsage",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"ccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。",
            }
          ],
          requestInstance:tools.formatJson({"Param":{"iccid":"89860423123123132135"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功 非0-失败",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"useUnit",
              requiredType:"是",
              type:"String",
              explanation:"用量单位",
            },
            {
              name:"useAmount",
              requiredType:"否",
              type:"double",
              explanation:"用量",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":{"useUnit":"MB","useAmount":2503}}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.1.4 SIM卡历史用量查询",
          describe:"查询物联卡码号 历史用量。" ,
          url:"http://api.5iot.cn/route/open/simDataUsageMonthly",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"ccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。",
            },
            {
              name:"dateTime",
              requiredType:"是",
              type:"String",
              explanation:"时间 yyyyMM 如 202101 注意：当月的去账期用量查询！",
            }
          ],
          requestInstance:tools.formatJson({"Param":{"iccid":"89860423123123132135","dateTime":"202101"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功 非0-失败",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"useUnit",
              requiredType:"是",
              type:"String",
              explanation:"用量单位",
            },
            {
              name:"useAmount",
              requiredType:"否",
              type:"double",
              explanation:"用量",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":{"useUnit":"MB","useAmount":29.63}}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.1.5 SIM卡生命周期查询",
          describe:"查询物联卡码号 生命周期。" ,
          url:"http://api.5iot.cn/route/open/simStatus",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"ccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"iccid":"89860423123123132135"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功 非0-失败",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"statusMessage",
              requiredType:"是",
              type:"String",
              explanation:"状态描述",
            },
            {
              name:"statusCode",
              requiredType:"否",
              type:"double",
              explanation:"生命周期状态 详细参考 3.1 卡状态说明",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":{"statusMessage":"正常","statusCode":1}}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.1.6 SIM卡在网状态查询",
          describe:"查询物联卡码号 在网状态信息等。" ,
          url:"http://api.5iot.cn/route/open/simSession",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"ccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"iccid":"89860423123123132135"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功 非0-失败",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"typeName",
              requiredType:"是",
              type:"String",
              explanation:"运营商系统类型",
            },
            {
              name:"imei",
              requiredType:"否",
              type:"String",
              explanation:"获取当前绑定IMEI (typeName为‘电信CMP’取值 )",
            }
            ,
            {
              name:"statusMessage",
              requiredType:"否",
              type:"String",
              explanation:"断开网状态说明(typeName为‘电信CMP’取值 ))",
            },
            {
              name:"statusCode",
              requiredType:"否",
              type:"String",
              explanation:"断开网编码 1 开网状态 2 断网状态 (typeName为‘电信CMP’取值 ))",
            },
            {
              name:"Data",
              requiredType:"否",
              type:"Map",
              explanation:"(typeName为‘移动EC’取值 )",
            },
            {
              name:"apnId",
              requiredType:"是",
              type:"String",
              explanation:"APN ID [Data 内部数据]",
            },
            {
              name:"rat",
              requiredType:"是",
              type:"String",
              explanation:"接入方式：[Data 内部数据] 1: 3G,2: 2G,6: 4G,8: NB",
            },
            {
              name:"ipv6",
              requiredType:"否",
              type:"String",
              explanation:"Ipv6 地址[Data 内部数据]",
            },
            {
              name:"ip",
              requiredType:"否",
              type:"String",
              explanation:"IP 地址[Data 内部数据]",
            },
            {
              name:"ipv6Prefix",
              requiredType:"否",
              type:"String",
              explanation:"Ip6前缀[Data 内部数据]",
            },
            {
              name:"status",
              requiredType:"否",
              type:"String",
              explanation:"在线状态[Data 内部数据] 00: 离线 ,01：在线",
            },
            {
              name:"createDate",
              requiredType:"否",
              type:"String",
              explanation:"会话创建时间[Data 内部数据]",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":{"typeName":"移动EC","imei":null,"Data":{"apnId":"CMIOT","rat":"6","ipv6":"","ip":"192.168.0.1","ipv6Prefix":"","status":"01","createDate":"2021-01-02 13:07:39"},"type":1,"statusMessage":null,"statusCode":-1}}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.1.7资费计划 可用查询",
          describe:"查询 集团下可用资费计划。" ,
          url:"http://api.5iot.cn/route/open/tariffplan",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"companyId",
              requiredType:"是",
              type:"String",
              explanation:"集团编号 ",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"companyId":"3365"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功 非0-失败",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"blocPlantGroupId",
              requiredType:"是",
              type:"String",
              explanation:"资费组编号",
            },
            {
              name:"blocPlantId",
              requiredType:"否",
              type:"String",
              explanation:"资费计划编号",
            }
            ,
            {
              name:"blocPlanName",
              requiredType:"否",
              type:"String",
              explanation:"资费计划名称",
            },
            {
              name:"blocPlanPrice",
              requiredType:"否",
              type:"Map",
              explanation:"资费计划规格(单位为 MB)",
            },
            {
              name:"blocPlanCost",
              requiredType:"否",
              type:"String",
              explanation:"资费计划成本",
            },
            {
              name:"blocPlanTimeValue",
              requiredType:"是",
              type:"String",
              explanation:"资费计划 时间值 如： 1",
            },
            {
              name:"blocPlanTimeUnit",
              requiredType:"是",
              type:"String",
              explanation:"资费计划时间单位 如 ：月/年",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":[{"blocPlantGroupId":"YZ202107020435363732","blocPlantId":"YZ3742202107020448446521","blocPlanName":"NB1年50MB","blocPlanPrice":"10.00","blocPlanCapacity":"50.00","blocPlanCost":"8.00","blocPlanTimeValue":"1","blocPlanTimeUnit":"年"}]}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.1.8 集团 预存余额查询",
          describe:"查询集团预存可用余额。" ,
          url:"http://api.5iot.cn/route/open/balance",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"companyId",
              requiredType:"是",
              type:"String",
              explanation:"集团编号 ",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"companyId":"3365"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功 非0-失败",
            },
            {
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。错误码对应的错误描述，参考错误码列表",
            },
            {
              name:"result",
              requiredType:"是",
              type:"Object",
              explanation:"返回结果集（status为“0”时，result包含正确的结果数据；status为“非0”时， result可能为空，也可能包含其他提示数据）",
            },
          ],
          returnParameterDescription_answer:[//返回参数说明 应答参数
            {
              name:"companyName",
              requiredType:"否",
              type:"String",
              explanation:"集团名称",
            },
            {
              name:"companyBalance",
              requiredType:"否 ",
              type:"Double",
              explanation:"集团可用余额",
            }
            ,
            {
              name:"companyCredit",
              requiredType:"否",
              type:"Double",
              explanation:"集团可用授信",
            }
          ],
          backExample_success:tools.formatJson('{"result":{"companyName":"技术部-测试用","companyCredit":4.0,"companyBalance":0.0},"message":"success","status":"0"}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"2.2业务类",
          T2_title:"2.2.1 SIM卡状态变更",
          describe:"变更生命周期 停复机。" ,
          url:"http://api.5iot.cn/route/open/changeSimStatus",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。 ",
            },{
              name:"Status",
              requiredType:"是",
              type:"String",
              explanation:"0 开机 1 停机",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"iccid":"89860423123123132135","Status":"0"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"",
              requiredType:"",
              type:"",
              explanation:"",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":{}}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.2.2 SIM卡数据功能开关",
          describe:"单卡断开网 操作。" ,
          url:"http://api.5iot.cn/route/open/simApnFunction",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。 ",
            },{
              name:"StatusBreak",
              requiredType:"是",
              type:"String",
              explanation:"0 开机 1 停机",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"iccid":"89860423123123132135","StatusBreak":"0"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"",
              requiredType:"",
              type:"",
              explanation:"",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":{}}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.2.3 资费计划订购",
          describe:"单卡订购 资费计划。" ,
          url:"http://api.5iot.cn/route/open/subscribe",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。 ",
            },{
              name:"companyId",
              requiredType:"是",
              type:"String",
              explanation:"集团编号 ",
            },{
              name:"effectiveType",
              requiredType:"是",
              type:"String",
              explanation:"生效类型详细请参3.4生效类别说明,当月生效,次月生效,周期延顺 ",
            },{
              name:"blocPlantId",
              requiredType:"是",
              type:"String",
              explanation:"资费计划编号 (来源 2.1.6 资费计划 可用查询 )",
            },{
              name:"callbackAddress",
              requiredType:"否",
              type:"String",
              explanation:"回调通知地址 必须是 http:// 或 https:// 开头 ,详细请查看 【2.2.3.1 资费订购回调说明】,如http://5iot.com:8080/mysys",
            },
          ],
          requestInstance:tools.formatJson({"Param":{"iccid":"89860423123123132135","companyId":"3365","effectiveType":"1","blocPlantId":"YZ3742202107020448446521"},"verify":{"timeStamp":"1625120582169","password":"uhbhkh223123","appId":"test","sign":"C0EBF5F9FCBFFE72CAA5AAF753EACCA5"}}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"",
              requiredType:"",
              type:"",
              explanation:"",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":{}}'),
          backExample_fail:tools.formatJson('{"message":"无访问权限","result":null,"status":"1003"}'),
        },
        {
          T1_title:"",
          T2_title:"2.2.3.1 资费订购回调说明",
          describe:"单卡订购 资费计划回调接口，如果您填写了 2.2.3 资费订购 回调地址，需要您开放该接口，如果没有开放该接口无需填写回调地址信息。" ,
          url:"您的域名或公网IP/iotlink/callback " +
            "如:http://5iot.com:8080/mysys/iotlink/callback 如:https://192.168.1.1:1234/prj/iotlink/callback,/iotlink/callback为固定请求地址拼接，" +
            "仅需提供,http://5iot.com:8080/mysys",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。 ",
            },{
              name:"ordNo",
              requiredType:"是",
              type:"String",
              explanation:"订单号  ",
            },{
              name:"auditStatus",
              requiredType:"是",
              type:"String",
              explanation:"审核是否通过详细请参3.6审核是否通过说明 未通过 已通过 ",
            }
          ],
          requestInstance:tools.formatJson({"iccid":"8986123123123123123","ordNo":"2022101008500411843105","auditStatus":"1"}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功   非0-失败",
            } ,{
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"已成功接收消息"}'),
          backExample_fail:tools.formatJson('{"message":"返回消息保存异常","status":"500"}'),
        },
        {
          T1_title:"",
          T2_title:"2.2.4 机卡解绑",
          describe:"一般官方仅提供一月两次解绑API请求，超过次数无法通过API或界面人工操作！请谨慎使用！尽量不要机卡分离！！！",
          url:"http://api.5iot.cn/route/open/MachineCardBinding",
          type:"POST",
          requestParameterArr:[//请求参数
            {
              name:"iccid",
              requiredType:"是",
              type:"String",
              explanation:"iccid:集成电路卡识别码，IC卡的唯一识别号码，共有20位字符组成，举例：89860423123123132135。 ",
            },{
              name:"contactName",
              requiredType:"是",
              type:"String",
              explanation:"解绑操作人姓名全拼 首字母大写，举例：ZhangSan  ",
            },{
              name:"contactPhone",
              requiredType:"是",
              type:"String",
              explanation:"解绑操作人联系手机号，举例：16812345678 ",
            }
          ],
          requestInstance:tools.formatJson({"iccid":"8986123123123123123","contactName":"ZhangSan","contactPhone":"16812345678"}),//请求实例
          returnParameterDescription_publicIn:[//返回参数说明 公共参数
            {
              name:"status",
              requiredType:"是",
              type:"String",
              explanation:"错误码。0-成功   非0-失败",
            } ,{
              name:"message",
              requiredType:"是",
              type:"String",
              explanation:"错误信息。",
            }
          ],
          backExample_success:tools.formatJson('{"status":"0","message":"success","result":"下发指令成功！"}'),
          backExample_fail:tools.formatJson('{"result":null,"message":"业务校验失败（单卡本月调用次数已超过限定次数！）","status":"500"}'),
        },
      ],

    }
  },
  created() {


  },

  methods: {},
}
</script>

<style scoped>

</style>
