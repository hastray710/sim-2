/**
 *  基于 VUE + Element 的常用 函数 封装
 *  @Data 2021-12-12 ~ 至今
 *  @Author:root;
 *  @mailbox:546558392@qq.com;
 */
import CryptoJS from 'crypto-js/crypto-js'
import "crypto-js/aes"
import "crypto-js/pad-zeropadding"
import $ from "jquery";


let tools = {}


//-----[Element 表格编辑(<td class="MyEl_edit"></td>)] 2021-10-13
tools.Element_edit = function () {
  //数据可编辑
  $(".cell .MyEl_edit").on("toggle", function () {
      console.log(text);
      var text = $(this).html();
      $(this).html('<input type="text" class="el-input__inner Myel-table-edit" value="' + text + '">');
      $(this).children("input").val("").focus().val(text);
    }, function () {
      $(this).html($(this).children("input").val());
    }
  )
  $(".cell .MyEl_edit").on("click", function () {
    console.log("click" + text);
    var text = $(this).html();
    $(this).html('<input type="text" class="el-input__inner Myel-table-edit" value="' + text + '">');
    $(this).children("input").val("").focus().val(text);
  })
  $(".cell .MyEl_edit").click(function () {
    console.log("click" + text);
    var text = $(this).html();
    $(this).html('<input type="text" class="el-input__inner Myel-table-edit" value="' + text + '">');
    $(this).children("input").val("").focus().val(text);
  })


  $(".cell .MyEl_edit").toggle(function () {
    var text = $(this).html();
    console.log(text);
    $(this).html('<input type="text" class="el-input__inner Myel-table-edit" value="' + text + '">');
    $(this).children("input").val("").focus().val(text);
  }, function () {
    $(this).html($(this).children("input").val());
  })
  //数据编辑失去焦点失效
  $(".Myel-table-edit").on("blur", function () {
    var text = $(this).val();
    $(this).parent().html(text);
  })
}
//-----[Element 表格编辑END]


/**
 * 查询当前用户是否有操作权限
 */
tools.hasResource = function (id) {
  let _this = this
  let requests = JSON.parse(sessionStorage.getItem("loginUser"))
  if (requests.account === null) {
    return false
  }
  for (let i = 0; i < requests.functionList.length; i++) {
    if (id === requests.functionList[i].id) {
      return true
    }
  }
  return false
}

// import qs from 'qs'

tools.encrypt = function (data, key, iv) {
  key = tools.Is_null(key) ? key : "YunZeIot@5iot.cn";
  iv = tools.Is_null(iv) ? iv : "www_5iot_cn@2022";
  //window.console.log(key.length)
  //console.log(key+" "+iv);
  //console.log(key+"  =  "+iv);
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  /* return CryptoJS.AES.encrypt(data, key, {
       iv: iv,
       mode: CryptoJS.mode.CBC,
       padding: CryptoJS.pad.ZeroPadding
   }).toString();
*/
  // console.log(key+"  =  "+iv);
  return CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  }).toString();
}

tools.install = function (Vue, options) {
  Vue.prototype.$tools = tools
  Vue.tools = tools
}


// 解密
tools.Decrypt = function (text, key, iv) {
  key = tools.Is_null(key) ? key : "YunZeIot@5iot.cn";
  iv = tools.Is_null(iv) ? iv : "www_5iot_cn@2022";
  //console.log(key+"  = = =   "+iv);
  let decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  //console.log(key+"  = = =   "+iv);
  return decrypted.toString(CryptoJS.enc.Utf8)
}

tools.open = function (_this, Message) {
  _this.$notify.warning(Message);
}


//-----[验证文本并提示]
tools.VerificationsText = function (_this, _val, Message) {
  //console.log(_val);
  let bool = tools.Is_null(_val);
  //console.log(bool);
  if (bool == false) {
    tools.open(_this, Message)
  }
  return bool;
}

//-----[验证文本并提示]
tools.VerificationsText_wx = function (_this, _val, Message) {
  //console.log(_val);
  let bool = tools.Is_null(_val);
  //console.log(bool);
  if (bool == false) {
    _this.$notify.error(Message);
  }
  return bool;
}


//-----[验证数组并提示]
tools.VerificationsArr = function (_this, _arr, Message) {
  let bool = _arr.length > 0;
  if (bool == false) {
    tools.open(_this, Message)
  }
  return bool;
}
/**
 * 判断是否为空值
 * @param val
 * @returns
 */
tools.Is_null = function (val) {
  //console.log(val)
  //console.log(Object.is(val, NaN))
  if (Object.is(val, NaN)) {
    //console.log("fffffff")
    return false;
  } else {
    val = tools.isNumber(val) == true ? val + "" : val;//如果是一个数字类型过滤成字符串 && isNaN(val)==false  && val.trim() != ""
    return val != undefined && val != null && val != "" && val != "undefined" && val != "null" && val != 'NaN' ? true : false;//
  }
}


/**
 * 通道接口调用时 计算 Sign
 * @param _this
 * @param map
 * @param key
 * @returns {string}
 */
tools.getSign = function (_this, map, key) {
  // console.log("getSign====")
  let signstr = "";
  let key_arr = [];
  $.each(map, function (key, val) {
    key_arr.push(key)
  })
  //console.log(key_arr)
  key_arr.sort();
  //console.log(key_arr)
  $.each(key_arr, function (i, o) {
    signstr += o + "=" + map.o + "&";
  })
  signstr = "key=" + key;
  //console.log(signstr);
  let sign = _this.$md5(signstr).toUpperCase();
  // console.log(sign);
  return sign;
}

/**
 * obj 判断是否是一个数（number）
 * @param obj
 * @returns
 */
tools.isNumber = function (obj) {
  return typeof obj === 'number' && !isNaN(obj);
}


/**
 * 询问对话框
 * @param: _this = this
 * @param: _type = 提示类型 【success，error，info，warning】
 * @param: Message = 消息主体
 * @param: TrueFun = 确定时 执行 函数 例【this.add】 前提是 add 必须有
 * @param: TrunPar = 确定时 执行 函数 参数
 * @param: FalseFun = 取消时 执行 函数 例【this.add】 前提是 add 必须有
 * @param: FalsePar = 取消时 执行 函数 参数
 */
tools.openAsk = function (_this, _type, Message, TrueFun, TrunPar, FalseFun, FalsePar) {
  _type = tools.Is_null(_type) ? _type : "info";
  _this.$confirm(Message, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: _type
  }).then(() => {
    TrueFun(TrunPar)
  }).catch(() => {
    if (FalseFun != null) {
      FalseFun(FalsePar);
    }
  });
}


/**
 * 获取一个double值
 * @param P_number 传入值【任意字符】
 * @param De_val 【默认值】选参
 * @returns
 */
tools.set_double = function (val, De_val) {
  //console.log(val);
  //console.log(De_val);
  De_val = tools.Is_null(De_val) == true ? De_val : 1;//默认值为空时给 1
  let reg_Tow = /^(?!0{2,})(?:\d{1,9}(\.\d+)?|10{9})$/;
  let map = {};
  if (val != undefined && val != null && val.trim() != "") {
    val = parseFloat(val);
    val = tools.toFixed(val, 2);//保留两位小数数据格式化
    val = reg_Tow.test(val) ? val : De_val;//单价
    val = val == "0.00" ? De_val : val;
  } else {//默认单价
    val = De_val;
  }
  return val;
}


/**
 * toFixed(四舍五入重写)
 * @param number
 * @param decimal
 * @returns
 */
tools.toFixed = function (number, decimal) {
  decimal = decimal || 0;
  let s = String(number);
  let decimalIndex = s.indexOf('.');
  if (decimalIndex < 0) {
    let fraction = '';
    for (let i = 0; i < decimal; i++) {
      fraction += '0';
    }
    return s + '.' + fraction;
  }
  let numDigits = s.length - 1 - decimalIndex;
  if (numDigits <= decimal) {
    let fraction = '';
    for (let i = 0; i < decimal - numDigits; i++) {
      fraction += '0';
    }
    return s + fraction;
  }
  let digits = s.split('');
  let pos = decimalIndex + decimal;
  let roundDigit = digits[pos + 1];
  if (roundDigit > 4) {
    //跳过小数点
    if (pos == decimalIndex) {
      --pos;
    }
    digits[pos] = Number(digits[pos] || 0) + 1;
    //循环进位
    while (digits[pos] == 10) {
      digits[pos] = 0;
      --pos;
      if (pos == decimalIndex) {
        --pos;
      }
      digits[pos] = Number(digits[pos] || 0) + 1;
    }
  }
  //避免包含末尾的.符号
  if (decimal == 0) {
    decimal--;
  }
  return digits.slice(0, decimalIndex + decimal + 1).join('');
}


/**
 * 针对文本域 换行符切割 过滤前后空格获取数组
 * @param lets
 */
tools.textareaGet = function (vars) {
  vars = vars.split(/[\s\n]/);
  //console.log(vars);
  vars = $.grep(vars, function (x) {
    return $.trim(x).length > 0;
  });
  //console.log(vars);
  return vars;
}


//-----[获取当前时间]
tools.getTime = function () {
  let myDate = new Date();
  let h = myDate.getHours(); //获取当前小时数(0-23)
  let m = myDate.getMinutes(); //获取当前分钟数(0-59)
  let s = myDate.getSeconds();
  let now = tools.p(h) + ':' + tools.p(m) + ":" + tools.p(s);
  return now;
}


//-----[获取当前时间]
tools.getdatetime = function () {
  let myDate = new Date();
  //获取当前年
  let year = myDate.getFullYear();
  //获取当前月
  let month = myDate.getMonth() + 1;
  //获取当前日
  let date = myDate.getDate();
  let h = myDate.getHours(); //获取当前小时数(0-23)
  let m = myDate.getMinutes(); //获取当前分钟数(0-59)
  let s = myDate.getSeconds();
  let now = year + '-' + tools.p(month) + "-" + tools.p(date) + " " + tools.p(h) + ':' + tools.p(m) + ":" + tools.p(s);

  return now;
}

tools.p = function (s) {
  return s < 10 ? '0' + s : s;
}


//-----[获取前n天的日期]
tools.getBeforeDate = function (n) {

  let d = new Date();
  let year = d.getFullYear();
  let mon = d.getMonth() + 1;
  let day = d.getDate();
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
  return s;
}


//-- 获取两个日期之间所有日期
Date.prototype.format = function () {
  let s = '';
  let mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
  let day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
  s += this.getFullYear() + '-'; // 获取年份。
  s += mouth + "-"; // 获取月份。
  s += day; // 获取日。
  return (s); // 返回日期。
};

tools.getdateAll = function (begin, end) {
  let $resdata = [];
  let ab = begin.split("-");
  let ae = end.split("-");
  let db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  let de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  let unixDb = db.getTime();
  let unixDe = de.getTime();
  for (let k = unixDb; k <= unixDe;) {
    $resdata.push(new Date(parseInt(k)).format());
    k = k + 24 * 60 * 60 * 1000;
  }
  return $resdata;
}


//----[获取当前日期 年 月 日 时 分 秒]
tools.gitData = function () {
  function p(s) {
    return s < 10 ? '0' + s : s;
  }

  let myDate = new Date();
  //获取当前年
  let year = myDate.getFullYear();
  //获取当前月
  let month = myDate.getMonth() + 1;
  //获取当前日
  let date = myDate.getDate();

  let Hours = myDate.getHours();

  let Minutes = myDate.getMinutes();

  let Seconds = myDate.getSeconds();


  return (year + '-' + p(month) + "-" + p(date) + " " + p(Hours) + ":" + p(Minutes) + ":" + p(Seconds));
}
//----[获取当前日期 年 月 日 ]
tools.gitDataCurrent = function () {
  let nowDate = new Date();
  let year = nowDate.getFullYear();
  let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
    : nowDate.getMonth() + 1;
  let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
    .getDate();
  return (year + "-" + month + "-" + day);
}
/**
 * 格式化 数字每三位加逗号的方法（包含小数）
 * @param str
 * @returns {string}
 */
tools.formatNum = function (str) {
  let newStr = "";
  let count = 0;
  str = str + "";
  //console.log(str)
  // 当数字是整数
  if (str.indexOf(".") == -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + "," + newStr;
      } else {
        newStr = str.charAt(i) + newStr;
      }
      count++;
    }
    str = newStr; //自动补小数点后两位
    return str;
  }
  // 当数字带有小数
  else {
    for (let i = str.indexOf(".") - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + "," + newStr;
      } else {
        newStr = str.charAt(i) + newStr; //逐个字符相接起来
      }
      count++;
    }
    str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
    return str;
  }
}


/**
 * 获取增长百分比
 * @param val1
 * @param val2
 * @returns {{}}
 */
tools.getPercentage = function (val1, val2) {
  let map = {};

  //let percentage = tools.NumberMul(tools.NumberSub((val1/val2),'1'),'100');
  //let percentage = tools.NumberMul(((val1/val2)-1),'100');
  //let percentage = ((val1/val2)-1)*100;

  let percentage = tools.NumberMul(tools.NumberSub(tools.NumberDiv(val1, val2, 4), '1'), '100');
  //console.log("percentage   = "+percentage);
  //let percentage = ((180/80)-1)*100;
  //console.log(percentage>0);
  // console.log(parseFloat(percentage)>0);
  percentage = parseFloat(percentage);
  // console.log(percentage>0);
  // console.log(percentage);

  if (percentage > 0) {
    map.type = "up";
    map.percentage = percentage + "%";
  } else {
    percentage = tools.Is_null(percentage) ? percentage : 0;
    map.type = "down";
    map.percentage = Math.abs(percentage) + "%";
  }
  return map;
}

/**
 * 乘法
 * @param arg1
 * @param arg2
 * @returns {number}
 * @constructor
 */
tools.NumberMul = function (arg1, arg2) {
  var m = 0;
  var s1 = arg1.toString();
  var s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
  }

  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 加法
 * @param arg1
 * @param arg2
 * @returns {string}
 * @constructor
 */
tools.NumberAdd = function (arg1, arg2) {
  var r1, r2, m, n;
  arg1 = arg1 + "";
  arg2 = arg2 + "";
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2;
  return Number(((arg1 * m + arg2 * m) / m).toFixed(n));
}


/**
 * 减法
 * @param arg1
 * @param arg2
 * @returns {string}
 * @constructor
 */
tools.NumberSub = function (arg1, arg2) {
  var re1, re2, m, n;
  arg1 = arg1 + "";
  arg2 = arg2 + "";
  try {
    re1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    re1 = 0;
  }
  try {
    re2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    re2 = 0;
  }
  m = Math.pow(10, Math.max(re1, re2));
  n = (re1 >= re2) ? re1 : re2;
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}


/**
 * 除法
 * @param arg1 除数
 * @param arg2 被除数
 * @param digit 保留的小数点后的位数
 * @returns {number}
 * @constructor
 */
tools.NumberDiv = function (arg1, arg2, digit) {
  arg1 = arg1 + "";
  arg2 = arg2 + "";
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  //获取小数点后的计算值
  var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString()
  var result2 = result.split(".")[1];
  result2 = result2 + "";
  result2 = result2.substring(0, digit > result2.length ? result2.length : digit);

  return Number(result.split(".")[0] + "." + result2);
}


/**
 * 消息提示
 * @param _this
 * @param _message
 * @param _type
 * @constructor
 */
tools.MessageShow = function (_this, _message, _type) {
  _type = tools.Is_null(_type) ? _type : "";
  if (_type != 'error') {
    _this.$notify.warning(_message)
  } else {
    _this.$notify.error(_message)
  }
}


/*
tools.set_double = function (val,Defaults_val){
    Defaults_val=tools.Is_null(Defaults_val)==true?Defaults_val:1;//默认值为空时给 1
    let reg_Tow = /^(?!0{2,})(?:\d{1,9}(\.\d+)?|10{9})$/;
    let map={};
    if(val!=undefined && val!=null && val.trim()!=""){
        val=parseFloat(val);
        val=tools.toFixed(val,2);//保留两位小数数据格式化
        val = reg_Tow.test(val)?val:Defaults_val;//单价
        val  = val =="0.00"? Defaults_val:val;
    }else{//默认单价
        val=Defaults_val;
    }
    return val;
}*/


/**
 * 获取一个整数值
 * @param P_number 传入值【任意字符】
 * @param Defaults_val 【默认值】选参
 * @returns
 */
tools.set_number = function (P_number, Defaults_val) {
  Defaults_val = tools.Is_null(Defaults_val) == true ? Defaults_val : 1;//默认值为空时给 1
  let reg_Tow = /^(?!0{2,})(?:\d{1,9}(\.\d+)?|10{9})$/;
  if (P_number != undefined && P_number != null && P_number.trim() != "") {
    P_number = parseInt(P_number);
    P_number = reg_Tow.test(P_number) ? P_number : Defaults_val;//数量
    P_number = P_number == "0" ? Defaults_val : P_number;
  } else {//默认 值 赋值
    P_number = Defaults_val;
  }
  return P_number;
}


//----[多少毫秒后刷新界面]
tools.loadSX = function (s) {
  setTimeout(function () {
    window.location.reload();
  }, s);
}
//----[多少毫秒后刷新界面]


/**
 * 减法运算
 * @param num1
 * @param num2
 * @returns
 */
tools.numSub = function (num1, num2) {
  var baseNum, baseNum1, baseNum2;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  var precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 * @param num1
 * @param num2
 * @data 2019-01-14
 * @returns
 */
tools.numDiv = function (num1, num2) {
  var baseNum1 = 0, baseNum2 = 0;
  var baseNum3, baseNum4;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  // with (Math) {
  baseNum3 = Number(num1.toString().replace(".", ""));
  baseNum4 = Number(num2.toString().replace(".", ""));
  return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
  //}
};

//-----[加法函数，用来得到精确的加法结果]2018-12-23
tools.accAdd = function (arg1, arg2) {

  var r1, r2, m;

  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }

  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }

  m = Math.pow(10, Math.max(r1, r2));

  return (tools.accMul(arg1, m) + tools.accMul(arg2, m)) / m;

}
//-----[加法函数，用来得到精确的加法结果END]
//-----[乘法]2018-12-23
tools.accMul = function (arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//-----[乘法end]


/**
 * 获取值 为空时获取null
 * @param val
 * @returns
 */
tools.not_null_Get_value = function (val) {
  return val != undefined && val != null && val != "" ? val : null;
}


/**
 * obj 判断是否是一个数（number）
 * @param obj
 * @returns
 */
tools.isNumber = function (obj) {
  return typeof obj === 'number' && !isNaN(obj);
}

//-----[计算时间差]
tools.GetDateDiff = function (startTime, endTime, diffType) {
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  //startTime = startTime.replace(/\-/g, "/");
  startTime.replace(RegExp("-", "g"), "/");
  //endTime = endTime.replace(/\-/g, "/");
  endTime.replace(RegExp("-", "g"), "/");
  //将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase();
  var sTime = new Date(startTime); //开始时间
  var eTime = new Date(endTime); //结束时间
  //作为除数的数字
  var timeType = 1;
  switch (diffType) {
    case "second":
      timeType = 1000;
      break;
    case "minute":
      timeType = 1000 * 60;
      break;
    case "hour":
      timeType = 1000 * 3600;
      break;
    case "day":
      timeType = 1000 * 3600 * 24;
      break;
    default:
      break;
  }
  return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}
//-----[END][计算时间差]


//-----[清除特殊字符并提示element: 元素，df_val:默认值,MaxLeng 最大长度]2019-01-04
tools.KeyUP_Cler = function (_this, $val, df_val, MaxLeng, Msg) {
  var $bool = tools.RegeMatch($val) ? false : true;
  MaxLeng = tools.Is_null(MaxLeng) ? MaxLeng : 50;
  //console.log($bool)
  if (!$bool) {
    Msg = tools.Is_null(Msg) ? Msg : "不能有特殊字符哦~";
    _this.msgError(Msg);
    $val = window["df_val"];
  } else {
    window["df_val"] = $val;
  }//赋值默认val
  if (tools.Is_null($val) && $val.length > MaxLeng) {
    _this.msgError("最大长度为[" + MaxLeng + "] !");
    $val = $val.substring(0, MaxLeng);
  }
  return $bool;
}
//-----[END][清除特殊字符并提示]

//-----[过滤特殊字符]
tools.RegeMatch = function ($name) {
  var pattern = new RegExp("[-` ~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）—+|{}【】‘；：”“’。，、？《》]");
  if ($name != undefined && $name != null && $name != "" && $name.length > 0) {
    if (pattern.test($name)) {
      return true;
    } else {
      return false;
    }
  }
}
//-----[END][过滤特殊字符]


//-----[过滤特殊字符]
tools.Textfilter = function (element, df_val) {
  // 键盘按下过滤
  element.on("keyup", function () {
    tools.KeyUP_Cler(element, df_val);
  })
  // 编辑文本框 失焦过滤
  element.on("blur", function () {
    tools.KeyUP_Cler(element, df_val);
  })
}


/**
 * 设置 编辑值为 int 或者 double 类型
 * @param element 【元素】如： $("#A")
 * @param type 获取数类型 int or double
 * @param Defaults_val 默认值 选填
 * @param maxlength 最大长度
 * @returns
 */
tools.val_number = function (element, type, Defaults_val, maxlength) {
  //焦时获取元素 当前行,当前td
  element.live("focus", function (data) {
    window["_parent"] = $(this).parent().parent();
    window["_e"] = $(this).parent();
  })

  // 键盘按下过滤
  element.live("keyup", function (data) {
    $(this).attr("maxlength", maxlength);
    var value = num_value($(this).val());//只能输入两位数小数和整数
    $(this).val(value);
  })
  // 编辑文本框 失焦过滤
  element.live("blur", function (data) {
    var _parent = window["_parent"];
    var _this = window["_e"];
    var val = _this.html();
    if ("int" == type.toLowerCase()) {
      val = set_number(val, Defaults_val)
    } else if ("double" == type.toLowerCase()) {
      val = set_double(val, Defaults_val)
    }
    //延迟赋值 【解决动态编辑赋值的bug】
    setTimeout(function () {
      _this.html(val);
    }, 10);
  })

}

//格式化 Double  保留后两位
tools.handleInput2 = function (e) {
  // 通过正则过滤小数点后两位
  e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
},


//获取cookie
  tools.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    //console.log("获取cookie,现在循环")
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


/*获取字典数据中的匹对key value*/
tools.getDkeyValue = function (arr, key) {
  /*let value = '';
  key = ""+key+"";
  for (let i = 0; i < arr.length; i++) {
    let map =  arr[i];
    if(map.dictValue==key){
      value = map.dictLabel;
      break;
    }
  }
  return value;*/
  return tools.getkeyValue(arr, key, "dictValue", "dictLabel");
}


/*获取字典数据中的匹对key value 部门数据*/
tools.getDeptNamekeyValue = function (arr, key) {
  /*let value = '';
  key = ""+key+"";
  for (let i = 0; i < arr.length; i++) {
    let map =  arr[i];
    if(map.dept_id==key){
      value = map.dept_name;
      break;
    }
  }
  return value;*/
  return tools.getkeyValue(arr, key, "dept_id", "dept_name");
}


/*获取字典数据中的匹对key value 用户数据*/
tools.getUserNamekeyValue = function (arr, key) {
  /* let value = '';
   key = ""+key+"";
   for (let i = 0; i < arr.length; i++) {
     let map =  arr[i];
     if(map.user_id==key){
       value = map.nick_name;
       break;
     }
   }*/
  //return value;
  return tools.getkeyValue(arr, key, "user_id", "nick_name");
}


/*获取 资费组 中的匹对key value 用户数据*/
tools.getPackageNNamekeyValue = function (arr, key) {
  /*let value = '';
  key = ""+key+"";
  for (let i = 0; i < arr.length; i++) {
    let map =  arr[i];
    if(map.package_id==key){
      value = map.package_agentname;
      break;
    }
  }*/
  return tools.getkeyValue(arr, key, "package_id", "package_agentname");
}


/*获取 arr 中的匹对 keyVlue Rvalue 数据*/
tools.getkeyValue = function (arr, key, keyVlue, Rvalue) {
  //console.log(arr);
  let value = '';
  key = "" + key + "";
  for (let i = 0; i < arr.length; i++) {
    let map = arr[i];
    if (map[keyVlue] == key) {
      value = map[Rvalue];
      break;
    }
  }
  return value;
}


/*获取 判断 key 是否在 arr 中*/
tools.IsArrInside = function (arr, key, keyVlue) {
  let bool = false;
  key = "" + key + "";
  for (let i = 0; i < arr.length; i++) {
    let map = arr[i];
    if (map[key] == keyVlue) {
      bool = true;
      break;
    }
  }
  return bool;
}


// 格式方法
// 公共方法
tools.transitionJsonToString = function (jsonObj, callback) {
  // 转换后的jsonObj受体对象
  var _jsonObj = null;
  // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
  if (Object.prototype.toString.call(jsonObj) !== "[object String]") {
    try {
      _jsonObj = JSON.stringify(jsonObj);
    } catch (error) {
      // 转换失败错误信息
      //callback(error);
      console.error(error);
    }
  } else {
    try {
      jsonObj = jsonObj.replace(/(\')/g, '\"');
      _jsonObj = JSON.stringify(JSON.parse(jsonObj));
    } catch (error) {
      // 转换失败错误信息
      //callback(error);
      console.error(error);
    }
  }
  return _jsonObj;
}
// callback为数据格式化错误的时候处理函数
tools.formatJson = function (jsonObj, callback) {
  // 正则表达式匹配规则变量
  var reg = null;
  // 转换后的字符串变量
  var formatted = '';
  // 换行缩进位数
  var pad = 0;
  // 一个tab对应空格位数
  var PADDING = '    ';
  // json对象转换为字符串变量
  var jsonString = tools.transitionJsonToString(jsonObj, callback);
  if (!jsonString) {
    return jsonString;
  }
  // 存储需要特殊处理的字符串段
  var _index = [];
  // 存储需要特殊处理的“再数组中的开始位置变量索引
  var _indexStart = null;
  // 存储需要特殊处理的“再数组中的结束位置变量索引
  var _indexEnd = null;
  // 将jsonString字符串内容通过\r\n符分割成数组
  var jsonArray = [];
  // 正则匹配到{,}符号则在两边添加回车换行
  jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
  // 正则匹配到[,]符号则在两边添加回车换行
  jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
  // 正则匹配到,符号则在两边添加回车换行
  jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
  // 正则匹配到要超过一行的换行需要改为一行
  jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
  // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
  jsonString = jsonString.replace(/\r\n\,/g, ',');
  // 特殊处理双引号中的内容
  jsonArray = jsonString.split('\r\n');
  jsonArray.forEach(function (node, index) {
    // 获取当前字符串段中"的数量
    var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
    // 判断num是否为奇数来确定是否需要特殊处理
    if (num % 2 && !_indexStart) {
      _indexStart = index
    }
    if (num % 2 && _indexStart && _indexStart != index) {
      _indexEnd = index
    }
    // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
    if (_indexStart && _indexEnd) {
      _index.push({
        start: _indexStart,
        end: _indexEnd
      })
      _indexStart = null
      _indexEnd = null
    }
  })
  // 开始处理双引号中的内容，将多余的"去除
  _index.reverse().forEach(function (item, index) {
    var newArray = jsonArray.slice(item.start, item.end + 1)
    jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''))
  })
  // 奖处理后的数组通过\r\n连接符重组为字符串
  jsonString = jsonArray.join('\r\n');
  // 将匹配到:后为回车换行加大括号替换为冒号加大括号
  jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
  // 将匹配到:后为回车换行加中括号替换为冒号加中括号
  jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
  // 将上述转换后的字符串再次以\r\n分割成数组
  jsonArray = jsonString.split('\r\n');
  // 将转换完成的字符串根据PADDING值来组合成最终的形态
  jsonArray.forEach(function (item, index) {
    //console.log(item)
    var i = 0;
    // 表示缩进的位数，以tab作为计数单位
    var indent = 0;
    // 表示缩进的位数，以空格作为计数单位
    var padding = '';
    if (item.match(/\{$/) || item.match(/\[$/)) {
      // 匹配到以{和[结尾的时候indent加1
      indent += 1
    } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
      // 匹配到以}和]结尾的时候indent减1
      if (pad !== 0) {
        pad -= 1
      }
    } else {
      indent = 0
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING
    }
    formatted += padding + item + '\r\n'
    pad += indent
  })
  // 返回的数据需要去除两边的空格
  return formatted.trim();
}


/**
 * 时间格式化
 */
tools.dateFormat = function (fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "D+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "1")))
    }
    ;
  }
  ;
  return fmt;
}




/**
 *推算月日期
 * @param mothSize 推算月日期 如 获取 近三个月 日期 传入 3
 * @returns {string}
 */
tools.getDateMonth = function (mothSize) {
  var date1 = new Date();
  date1.setMonth(date1.getMonth() - mothSize);
  var year1 = date1.getFullYear();
  var month1 = date1.getMonth() + 1;
  var day1 = date1.getDay();
  month1 = (month1 < 10 ? '0' + month1 : month1);
  day1 = (day1 < 10 ? '0' + day1 : day1);
  var sDate = (year1.toString() + '-' + month1.toString() + '-' + day1);
  return sDate;
}

/**
 * 创建唯一的字符串
 * @return {string} ojgdvbvaua40
 */
tools.createUniqueString = function () {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * 数字存储大小格式化
 * @param {number} num 存储大小 单位：Byte
 * @param {number} digits 保留几位小数
 * @return {string} 2MB
 */
tools.toStorage = function (num, digits) {
  digits = digits || 2
  if (num < 1024) {
    return num + 'B'
  }
  num = (num * 1000 / 1024)
  const si = [
    {value: 1E18, symbol: 'E'},
    {value: 1E15, symbol: 'P'},
    {value: 1E12, symbol: 'T'},
    {value: 1E9, symbol: 'G'},
    {value: 1E6, symbol: 'M'},
    {value: 1E3, symbol: 'K'}
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
        si[i].symbol + 'B'
    }
  }
}


tools.validImgUpload = function (file, size) {
  size = +size || 10240;
  const isSizeOut = file.size / 1024 > size;
  if (isSizeOut) {
    Message.error('上传图片大小不能超过' + tools.toStorage(size * 1024))
  }
  return !isSizeOut
}


/*
 * @Name: [Layui打开子窗体]
 * @param: map-子窗体传递数据
 * @param: $URL-打开界面URl访问路径
 * @param: title-窗口标题
 * @param: R_fn-子窗返回参数执行函数名函数(选填)
 * @param: area-窗口宽，高(选填，默认最大化)
 * @param: btn-按钮组如['确认','取消'](选填)
 * @param: btnAlign-按钮排序
 * @param: getParameter - 获取参数函数 (用于回调时获取父界面的执行函数参数获取 的函数)
 * @author zf
 * @date 2018-12-23
 * */
tools.OpenView = function (_this, map, $URL, title, R_fn, area, btn, btnAlign, getParameter) {
  area = area != undefined && area != null && area != "" ? area : ['' + $(window).width() + 'px', '' + $(window).height() + 'px'];//默认宽高
  btn = area != undefined && area != null && area != "" ? btn : [];//按钮默认无
  btnAlign = btnAlign != undefined && btnAlign != null && btnAlign != "" ? btnAlign : "r";//按钮排列 l c r:左 中 右
  var Rmap = {};
  _this.$layer.open({
    type: 2, //此处以iframe举例
    title: '' + title,
    area: area,
    shade: 0,
    maxmin: true,
    content: window.open($URL),
    btn: btn,
    btnAlign: btnAlign,
    zIndex: _this.$layer.zIndex,//重点1
    success: function (layero, index) {
      console.log($URL)
      console.log(layero)
      console.log(index)
      // 获取子页面的iframe
      var iframe = window['layui-layer-iframe' + index];
      // 向子页面的全局函数child传参
      Rmap = iframe.child(map);
    }/*,cancel: function(){ //右上角关闭回调
	    	console.log("关闭")
	       //如果父窗体等待子界面传递参数，执行函数名R_fn不为空的请款下，执行函数并传递参数
	    	if(R_fn!=undefined && R_fn!=null && R_fn!=""){
	    		 if(getParameter!=undefined && getParameter!=null ){//父界面调函数时获取参数定义时，执行父界面执行函数参数获取
	    			 Rmap = Is_null(Rmap)==true?Rmap:getParameter();
	    		 }
	    		 R_fn(Rmap);//执行父界面等待参数函数
	    	}
	    },yes: function(){//第一个按钮点击事件
	    	console.log("yes关闭")
	    	if(R_fn!=undefined && R_fn!=null && R_fn!=""){
	    		if(getParameter!=undefined && getParameter!=null ){//父界面调函数时获取参数定义时，执行父界面执行函数参数获取
	    			 Rmap = Is_null(Rmap)==true?Rmap:getParameter();
	    		 }
	    		 R_fn(Rmap);//执行父界面等待参数函数
	    	}
	    	layer.closeAll();//关闭窗口
        }*/, end: function () {
      if (R_fn != undefined && R_fn != null && R_fn != "") {
        if (getParameter != undefined && getParameter != null) {//父界面调函数时获取参数定义时，执行父界面执行函数参数获取
          Rmap = Is_null(Rmap) == true ? Rmap : getParameter();
        }
        R_fn(Rmap);//执行父界面等待参数函数
      }
      _this.$layer.closeAll();//关闭窗口
    }
  });
}
//-----[打开子窗体(map:传递数据;$URL:打开界面;title:标题;)END]2018-12-13


//-----[传入数组，值判断这个值是否在这个数组中true:在False:不在][2018-12-14]
tools.VerificationValIsArray = function (arr, val) {
  var bool = false;
 /* for (let i = 0; i < arr.length; i++) {
    bool = arr[i] == val ? true : false;
    if (bool) {
      break;
    }
  }*/
  bool = arr.indexOf(val)===-1?false:true;

  return bool;
}
//-----[END][传入数组，值判断这个值是否在这个数组中]


/**
 * js日期比较 yyyy-mm-dd
 * @param firstDate
 * @param lastDate
 * @returns {boolean}
 * @constructor
 */
tools.DateBiJiao = function (firstDate, lastDate) {
  var arr = firstDate.split("-");
  var firsttime = new Date(arr[0], arr[1], arr[2]);
  var firsttimes = firsttime.getTime();

  var arrs = lastDate.split("-");
  var lasttime = new Date(arrs[0], arrs[1], arrs[2]);
  var lasttimes = lasttime.getTime();

  if (firsttimes > lasttimes) {
    return false;
  } else
    return true;
}


/**
 *  js时间比较  yyyy-mm-dd hh:mi:ss
 * @param firstDate
 * @param lastDate
 * @returns {string}
 */
tools.comptime = function (firstDate, lastDate) {
  var beginTime = firstDate;
  var endTime = lastDate;
  var beginTimes = beginTime.substring(0, 10).split('-');
  var endTimes = endTime.substring(0, 10).split('-');

  beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
  endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);

  var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
  let Rval = '';
  if (a < 0) {
    //alert("endTime小!");
    Rval = 'xiao';
  } else if (a > 0) {
    //alert("endTime大!");
    Rval = 'da';
  } else if (a == 0) {
    //alert("时间相等!");
    Rval = 'deng';
  } else {
    Rval = 'exception'
  }
  return Rval;
}

tools.copyThat = function (data, _this) {
  let url= data;
  let oInput= document.createElement('textarea');
  oInput.value= url;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  //console.log(oInput.value)
  document.execCommand("Copy"); // 执行浏览器复制命令
  _this.$message.success("复制成功！");
  oInput.remove()
}


/**
 * 打开新窗口
 * @param url
 * @param target
 */
tools.windowOpen = function (url, target) {
  window.open(url, target);
}

/**
 * 针对文本域 换行符切割 过滤前后空格获取数组 [不重复的数据]
 * @param lets
 */
tools.textareaGetNotRepeating = function (vars){
  let rMap = {};
  let notArr = tools.textareaGet(vars);
  let rArr  = [];
  for (let i = 0; i < notArr.length; i++) {
    let notIccid =  notArr[i];
    if(rArr.length>0){
      let bool = true;
      for (let j = 0; j < rArr.length; j++) {
        let iccid = rArr[j];
        if(notIccid!=iccid){
          rArr.push(notIccid);
          break;
        }
      }
    }else{
      rArr.push(notIccid);
    }
  }
  rMap.rArr = rArr;//已过滤 后不重复数组
  rMap.notArr = notArr;//所有数组
  rMap.repeatCount = notArr!=null && notArr.length>0?tools.numSub(notArr.length,rArr.length):0;//重复号码
  return rMap;
}




export default tools
