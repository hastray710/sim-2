1.登录界面右上角去掉
2.去掉了短信验证
3.背景页面去除
4.首页下面，index，去掉了业务告警
5.上方navbar，去掉了执行任务和批量日志
6.单卡管理（原物联卡管理），去掉了 是否轮询、已达停机阈值、所属分组、维度字段、纬度值
7.所属通道改成了套餐
8.改路由，在router下增加myRouter.json,修改modle下的permission.js鉴权文件，注释掉getRouters().then(res => {，增加const res = myRouter，可有F12network查看是否有getrouter
9.一期（9月25版本），左侧暂定暴露路由 首页 通信管理/单卡管理 流量池管理/流量池管理 客户管理：账号管理：企业管理/用户信息/角色管理
10.单卡管理，去掉了button-划卡等一堆按钮
11.cardInfoBrief.vue是单卡信息的组件（仅有上半部分），去掉了右上角两个按钮，诊断和通道信息
12.在单卡管理（card=>index。vue）里注释掉了cardInfoDetails的静态，故单卡信息的子组建下半部分没有了
13.
