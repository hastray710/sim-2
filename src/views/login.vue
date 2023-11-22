<template>
  <el-container>
    <el-header style="padding:0px;height: 100%">
      <el-menu class="el-menu-demo " mode="horizontal"
               style="background: -webkit-linear-gradient(top, rgb(29 76 102), rgb(13 40 67));border: 1px solid #1e4b68;">
        <!-- <el-menu-item class="Mymenu-item" aria-readonly="true" index="3">关于</el-menu-item>
        <el-menu-item class="Mymenu-item" aria-readonly="true" index="2">开源计划</el-menu-item> -->
        <!-- <el-menu-item class="Mymenu-item"  index="3">解决方案</el-menu-item>
         <el-menu-item class="Mymenu-item"  index="2">产品中心</el-menu-item>-->
        <el-menu-item class="Mymenu-item" aria-readonly="true" index="1">登录</el-menu-item>
      </el-menu>
    </el-header>
    <el-main style="padding:0px;">
      <template>
        <!-- 此处是背景页面 -->
        <!-- <el-carousel :interval="5000" style="height: 658px;width: 100%;" arrow="never">
          <el-carousel-item class="carousel carousel_1">
          </el-carousel-item>
          <el-carousel-item class="carousel carousel_2">
          </el-carousel-item>
          <el-carousel-item class="carousel carousel_3">
          </el-carousel-item>
          <el-carousel-item class="carousel carousel_4">
          </el-carousel-item>
        </el-carousel> -->
      </template>


      <div style="position: absolute; top: 185px;right: 12%;  z-index: 199;">

        <h3 class="title">物联卡信息化管理系统</h3>


        <div class="main">

          <el-tabs v-model="activeName" @tab-click="handleClick" ref="multipleTable" class="el-tabs__item">
            <el-tab-pane label="密码登录" name="passwordLogin">

              <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账户或预留手机号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter.native="handleLogin"
                  >
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code" style="margin-bottom:10px;">
                  <el-input
                    v-model="loginForm.code"
                    auto-complete="off"
                    placeholder="验证码"
                    style="width: 63%"
                    @keyup.enter.native="handleLogin"
                  >
                    <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
                  </el-input>
                  <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                  </div>
                </el-form-item>
                <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;margin-bottom:10px">记住密码
                </el-checkbox>
                <el-form-item style="width:100%;">
                  <el-button
                    :loading="loading"
                    size="medium"
                    type="primary"
                    style="width:100%;"
                    @click.native.prevent="handleLogin"
                  >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                  </el-button>
                </el-form-item>

              </el-form>

            </el-tab-pane>

            <!--短信登录-->
            <!-- <el-tab-pane label="短信登录" name="messageLogin">
              <el-form :model="MessageloginForm" class="login-form">
                <el-form-item prop="username">
                  <el-input v-model="MessageloginForm.username" auto-complete="off" placeholder="请输入手机号"
                            oninput="value=value.replace(/[^\d]/g,'')" maxlength="11"
                  >
                    <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon"/>
                  </el-input>
                </el-form-item>

                <el-form-item prop="phoneCode" class="pr" style="margin-block: 10px;">
                  <el-input placeholder="请输入验证码"
                            v-model="MessageloginForm.code"
                            type="message"
                            auto-complete="off"
                            style="width: 350px"

                  >
                    <svg-icon slot="prefix" icon-class="message" class="el-input__icon input-icon"/>
                  </el-input>
                  <button @click.prevent="getShortMessageCode()" class="code-btn" :disabled="!show">
                    <span v-show="show">{{ codeMsg }}</span>
                    <span v-show="!show" class="count">{{ count }} s</span>
                  </button>
                </el-form-item>
                <el-checkbox v-model="MessageloginForm.rememberMe"
                             style="margin:0px 0px 25px 0px;margin-bottom:10px; margin-top: 55px;">记住手机号
                </el-checkbox> -->
                <!--              <el-row>-->
                <!--                <u>-->
                <!--                  <a href="" style="margin-left: 190px;color: white">忘记密码</a>-->
                <!--                </u>-->
                <!--               <u>-->
                <!--                 <a href="" style="margin-left: 30px; color: white">注册</a>-->
                <!--               </u>-->
                <!--              </el-row>-->

                <!-- <el-form-item style="width:100%;">
                  <el-button
                    :loading="SignIn"
                    size="medium"
                    type="primary"
                    style="width:100%;"
                    @click.native.prevent="handSignIn"
                  >
                    <span v-if="!SignIn">登 录</span>
                    <span v-else>登 录 中...</span>
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane> -->

          </el-tabs>

        </div>


      </div>
    </el-main>

    <el-dialog
      title="滑动验证"
      :visible.sync="Visible"
      width="25%">
      <div v-if="slide">
        <slide-verify :l="50"
                      :r="12"
                      :w="400"
                      :h="230"
                      :imgs="puzzleImgList"
                      slider-text="向右滑动"
                      @success="onSuccess"
                      @fail="onFail"
                      @refresh="onRefresh"
        ></slide-verify>
        <div>{{ msg }}</div>
      </div>
    </el-dialog>

  </el-container>

</template>

<script>
import {getCodeImg} from "@/api/login";
import Cookies from "js-cookie";
import {encrypt, decrypt} from '@/utils/jsencrypt'
import {GetPhone, UserPhone, MessageLogin} from "@/api/system/user";
import Vue from 'vue';
import SlideVerify from 'vue-monoplasty-slide-verify';

Vue.use(SlideVerify);
import tools from "@/utils/yunze/tools";
import {setToken} from '@/utils/auth';


export default {
  name: "Login",
  data() {
    return {
      tools: tools,
      activeName: 'passwordLogin',
      // 按钮上的文字
      codeMsg: '获取验证码',
      // 定时器
      show: true,
      timer: 0,
      count: 60,
      msg: '',
      slide: false,
      slide: false,
      loginWay: true, //true代表密码登录, false代表短信
      Visible: false,
      puzzleImgList: [
        require('../assets/images/carousel_1.jpg'),
        require('../assets/images/carousel_2.jpg'),
        require('../assets/images/carousel_3.jpg')
      ],
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
        phone: "",
        message: "",
      },

      MessageloginForm: {
        username: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "账户或手机号不能为空"}
        ],
        password: [
          {required: true, trigger: "blur", message: "密码不能为空"}
        ],
        code: [{required: true, trigger: "change", message: "验证码不能为空"}],

      },
      loading: false,
      SignIn: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  beforeCreate() {//创建之前调用


    document.querySelector('body').setAttribute('style', 'background-color:#0d2843;');
  },
  beforeDestroy() {//实例销毁之前调用
    document.querySelector('body').setAttribute('style', 'background-color:rgb(255 255 255 / 50%)');
    //document.querySelector('.el-tabs__item').setAttribute('style', 'color: #303133;');

  },
  mounted() {

    let username = Cookies.get("username");
     if (tools.Is_null(username)) {
       this.activeName = "passwordLogin";
       this.loginForm.username = username;
       this.loginForm.password = tools.Decrypt(Cookies.get("password"));
       this.loginForm.rememberMe = true;
     }

    let Msg_username = Cookies.get("Msg_username");

    if (tools.Is_null(Msg_username)) {
      this.activeName = "messageLogin";
      this.MessageloginForm.username = Msg_username;
      this.MessageloginForm.rememberMe = true;
    }

  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {

      let username = Cookies.get("username");
      if (tools.Is_null(username)) {
        this.activeName = "passwordLogin";
        const username = username;
        const password = Cookies.get("password");
        const rememberMe = Cookies.get('rememberMe');
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : tools.Decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      }
      let Msg_username = Cookies.get("Msg_username");
      if (tools.Is_null(Msg_username)){
        this.activeName = "messageLogin";
        const Msg_username = Msg_username;
        const Msg_rememberMe = Cookies.get('Msg_rememberMe');
        this.MessageloginForm = {
          username: Msg_username === undefined ? this.MessageloginForm.username : Msg_username,
          rememberMe: Msg_rememberMe === undefined ? false : Boolean(Msg_rememberMe)
        };
      }

    },


    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.remove("Msg_username");
            Cookies.remove('Msg_rememberMe');
            Cookies.set("username", this.loginForm.username, {expires: 30});
            Cookies.set("password", tools.encrypt(this.loginForm.password), {expires: 30});
            Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
            //console.log(this.loginForm) tools.Decrypt
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({path: this.redirect || "/"}).catch(() => {
            });
          }).catch(() => {
            this.loading = false;
            this.getCode();
          });
        }
      });
    },

    handleClick(tab, event) {
      let  selName = tab.name;
      if(selName == 'passwordLogin'){
        //再次加载二维码
        this.getCode();
      }
    },
    /**短信登录验证*/
    handSignIn() {

      let _this = this;
      let regs = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;// 11位手机
      if (regs.test(this.MessageloginForm.username)) {
        let Pwd_Str = tools.encrypt(JSON.stringify(this.MessageloginForm));
        UserPhone(Pwd_Str).then(response => {
          let jsonobj = JSON.parse(tools.Decrypt(response));
          if (jsonobj.code == 200) {
            if (this.MessageloginForm.code != null) {
              this.SignIn = true;//登录中
              MessageLogin(this.MessageloginForm).then(response => {
                this.SignIn = false;//登录中
                if (response.code == '200') {

                  if (this.MessageloginForm.rememberMe) {
                    Cookies.remove("username");
                    Cookies.remove("password");
                    Cookies.remove('rememberMe');
                    Cookies.set("Msg_username", this.MessageloginForm.username, {expires: 30});
                    Cookies.set('Msg_rememberMe', this.MessageloginForm.rememberMe, {expires: 30});
                  } else {
                    Cookies.remove("Msg_username");
                    Cookies.remove('Msg_rememberMe');
                  }

                  setToken(response.token);//存储token

                  this.$router.push({path: this.redirect || "/"}).catch(() => {
                  });
                } else {
                  this.msgError("网络异常，稍后重试！");
                }
              });
            } else {
              this.msgError("请先发送短信验证码");
            }
          } else {
            this.msgError("该手机号没有注册！");
          }
        })
      } else {
        this.msgError("手机号码格式不正确，请重新输入");
      }
    },


    // 获取短信验证码
    getShortMessageCode() {
      let regs = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;// 11位手机
      if (!regs.test(this.MessageloginForm.username)) {
        this.msgError("手机号码格式不正确，请重新输入");
      } else {
        this.slide = true;//滑动
        this.Visible = true;
      }
    },

    /**滑动验证*/
    onSuccess() {
      // this.msg = ''
      this.Visible = false;
      this.slide = false;
      let Pwd_Str = tools.encrypt(JSON.stringify(this.MessageloginForm));
      UserPhone(Pwd_Str).then(response => {
        let jsonobj = JSON.parse(tools.Decrypt(response));
        if (jsonobj.code == 200) {
          this.MessageApiShort();
        } else {
          this.msgError("该手机号没有注册！");
        }
      })
    },
    /**调用发送短信接口*/
    MessageApiShort() {
      GetPhone(this.MessageloginForm.username).then(response => {

        this.msgSuccess(response);
        // this.msgSuccess("验证成功 请查看手机验证码");
        // 验证码倒计时
        if (!this.timer) {
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= 60) {
              this.count--;
              if (this.count !== 0) {
                this.codeMsg = "重新发送";
              } else {
                this.count = 60;
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }
          }, 1000);
        }
      });
    },
    onFail() {
      this.msg = ''
    },
    onRefresh() {
      this.msg = ''
    }

  }
};
</script>

<style>
.is-top {
  color: #e8f4ff;
}

.is-active {
  color: #303133;
}
</style>


<style scoped rel="stylesheet/scss" lang="scss">


.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

/* 短信验证码css */
.pr {
  position: absolute;
  left: 26px;
  top: 75px;
}

.code-btn {
  width: 100px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: 5px;
  z-index: 222;
  color: #ef8466;
  font-size: 14px;
  border: none;
  border-left: 1px solid #bababa;
  padding-left: 10px;
  background-color: #fff;
  cursor: pointer;
}


.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #57a4c3;
}

.loginInner .login_header .login_logo {
  color: #02a774;
  font-weight: bolder;
  font-size: 40px;
  text-align: center;

}

.login_header .login_header_title {
  text-align: center;
  padding-top: 10px;
}

.login_header_title a {
  text-decoration: none;
  font-size: 16px;
  color: #333;
  padding-bottom: 10px;
}

.login_header_title a:first-child {
  margin-right: 40px;
}

.login_header_title a.on {
  color: #02a774;
  font-weight: bolder;
  border-bottom: 2px solid #02a774;
}

.login_content form div {
  display: none;
}

.login-form {
  border-radius: 6px;
  background: rgb(0 0 0 / 10%);
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}

.carousel {
  background-size: cover;
  min-height: 658px;
  height: 80%;
  background-position: 50% 0px;
  background-repeat: no-repeat no-repeat;
}

.carousel_1 {
  background-image: url('../assets/images/carousel_1.jpg');
}

.carousel_2 {
  background-image: url('../assets/images/carousel_2.jpg');
}

.carousel_3 {
  background-image: url('../assets/images/carousel_3.jpg');
}

.carousel_4 {
  background-image: url('../assets/images/carousel_4.jpg');
}

.Mymenu-item {
  float: right !important;
  color: white !important;
}

.Mymenu-item:hover {
  color: #57a4c3 !important;
  background-color: transparent !important;
}


.card-panel-icon-wrapper {
  padding: 10px;
  -webkit-transition: all .38s ease-out;
  transition: all .38s ease-out;
  border-radius: 6px;
  margin-right: 5px;
  font-size: 100px;
}


.my_loginCard {
  border: 1px solid #64bada;
}


.el-card.is-always-shadow {
  box-shadow: 1px 2px 11px 7px #2ea2d4;
  background-color: #0d2843;
  color: white;
}

.illustrateUl li:first-child {
  font-size: 25px;
}

ul, li {
  list-style: none
}

el-menu-item {
  list-style: none
}


</style>



