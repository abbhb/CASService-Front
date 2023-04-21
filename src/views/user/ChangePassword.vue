<template>
  <div id="changepassword">
    <el-card class="box-card">
      <el-form ref="passform" :model="passform" :rules="passrules" label-position="left" label-width="80px">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="passform.password" type="password" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input v-model="passform.newpassword" id="inputValue" type="password" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item style="text-align: center;" label="密码强度">
          <div class="input_span">
            <span id="one" style="background: #eee;"></span>
            <span id="two" style="background: #eee;"></span>
            <span id="three" style="background: #eee;"></span>
          </div>
          <div style="">
            <span style="padding-right: 15rem">弱</span>

            <span style="padding-right: 15rem">中</span>
            <span>强</span>
          </div>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkpassword" label-width="120px">
          <el-input v-model="passform.checkpassword" type="password" placeholder="请确认新密码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="((passform.password != '')&&(passform.newpassword == passform.checkpassword)&&(passform.newpassword!='')&&(passform.checkpassword!='')) ? false:true">提交修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "ChangePassword",
  data(){
    const validatePassword = (rule, value, callback) => {
      if (value !== this.passform.newpassword) {
        callback(new Error('请确认新密码'))
      } else {
        callback()
      }
    };
    return{
      msgText: "",
      passform: {
        password: '',
        newpassword: '',
        checkpassword: ''
      },
      userInfo:{},
      passrules: {
        password: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newpassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 4, max: 20, trigger: 'blur', message: '密码长度为4到20位'}
        ],
        checkpassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {validator: validatePassword}
        ]
      },

    }
  },
  watch: {
    'passform.newpassword': {
      handler(newname) {
        this.msgText = this.checkStrong(newname);
        if (this.msgText > 1 || this.msgText == 1) {
          document.getElementById("one").style.background = "#ff0000";
          console.log("red")
        } else {
          document.getElementById("one").style.background = "#eee";
        }
        if (this.msgText > 2 || this.msgText == 2) {
          document.getElementById("two").style.background = "orange";
        } else {
          document.getElementById("two").style.background = "#eee";
        }
        if (this.msgText == 4) {
          document.getElementById("three").style.background = "#00D1B2";
        } else {
          document.getElementById("three").style.background = "#eee";
        }
      }
    }
  },
  created() {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo){
      this.userInfo = JSON.parse(userInfo)
    }
  },
  methods:{
    checkStrong(sValue) {
      var modes = 0;
      //正则表达式验证符合要求的
      if (sValue.length < 1) return modes;
      if (/\d/.test(sValue)) modes++; //数字
      if (/[a-z]/.test(sValue)) modes++; //小写
      if (/[A-Z]/.test(sValue)) modes++; //大写
      if (/\W/.test(sValue)) modes++; //特殊字符

      //逻辑处理
      switch (modes) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
        case 4:
          return sValue.length < 4 ? 3 : 4;
      }
      return modes;
    },
    async onSubmit() {
      var that = this
      var id = that.userInfo.id;
      console.log(id)
      var i = new String(id)
        const data = i
      if (String(data.code)==='1'){
        that.$message.success(data.msg);
        localStorage.clear();
        sessionStorage.clear();
        router.push('/login')

      }
      else {
        that.$message.error(data.msg);
      }
    },
  }
}
</script>

<style>
.box-card{
  width: 50rem;
}
.input_span{
  display: flex;
  flex-direction: row;

  height: 0.5rem;


}
.input_span span {
  width: 14rem;
}
</style>