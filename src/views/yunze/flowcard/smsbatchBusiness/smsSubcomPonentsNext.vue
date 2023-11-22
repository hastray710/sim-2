<template>
  <!--标签页面-->
  <div class="main">
    <el-form>
       <textarea name="content" id="content" v-model="Msg" readonly
                 style="width: 100%;height:150px;font-size:9pt;font-family:verdana;
              color:#333333;margin-left: 10px;margin-right: 10px">
    </textarea>

    </el-form>


    <!-- 触发加载数据函数-->
    <span v-if="show_ds_one ==true && implement_one == false">
        {{ LoadData_one() }}
    </span>
  </div>

</template>

<script>
export default {
  props: {
    show_ds_one: Boolean,//当前界面是否显示
    implement_one: Boolean,//编辑时加载是否 已执行
    Msg: String,
  },
  name: "smsSubcomPonentsNext",
  data() {
    return {

    }
  },



  methods: {
    //初始化函数
    LoadData_one() {
      this.$emit("SetObj_one", "Setimplement_one", true);//已加载



    }
  }
}
</script>

<style scoped>

</style>
