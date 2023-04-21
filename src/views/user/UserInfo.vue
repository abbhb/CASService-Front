<template>
<div>
  <div>
          <el-form class="myinfo userform" :model="form" label-width="100px">
              <div style="">
                  <el-form-item :rules="[{ required: true, message: 'id is required' },]" label="id">
                      <el-input v-model="form.id" disabled=""/>
                  </el-form-item>
                  <el-form-item :rules="[{ required: true, message: '用户名 is required' },]" label="用户名">
                      <el-input v-model="form.username" disabled=""/>
                  </el-form-item>
                  <el-form-item :rules="[{ required: true, message: '昵称 is required' },]" label="昵称">
                      <el-input v-model="form.name" />
                  </el-form-item>
                  <el-form-item :rules="[{ required: true, message: '性别 is required' },]" label="性别">
                      <el-select v-model="form.sex" placeholder="请选择你的性别">
                          <el-option label="男" value="男" />
                          <el-option label="女" value="女" />
                      </el-select>
                  </el-form-item>
                  <el-form-item   :rules="[
        { required: true, message: 'studentId is required' },
        { type: 'number', message: 'studentId must be a number' }
      ]"  label="学号">
                      <el-input v-model="form.studentId" />
                  </el-form-item>
                  <el-form-item   :rules="[
        { required: true, message: '手机号码必须填写' },
        { type: 'number', message: '手机号码必须是数字' }
      ]"  label="手机号码">
                      <el-input v-model="form.phone" />
                  </el-form-item>

                  <el-form-item>
                      <el-button type="primary" @click="onSubmit" :disabled="(form_serve.id === form.id)&&(form_serve.username === form.username)&&(form_serve.name === form.name)&&(form_serve.sex === form.sex)&&(form_serve.studentId === form.studentId)&&(form_serve.phone === form.phone)&&(form_serve.avatar === form.avatar) ? true:false">更新</el-button>
                      <el-button @click="reWrite">重置</el-button>
                  </el-form-item>
              </div>


          </el-form>




  </div>
</div>
</template>

<script>

import router from "@/router";



export default {
  name: "UserInfo",
  data(){
    return{
      form:{
        id:'',
        username:'',
        name: '',
        sex: '',
        studentId:'',
        phone:'',
          avatar:'',
      },
      form_serve:{
        id:'',
        username:'',
        name: '',
        sex: '',
        studentId:'',
        phone:'',
          avatar:'',
      },
      userInfo:{},

    };
  },
  created() {

    this.init()
  },
  methods:{
    reWrite(){
      this.form.name = this.userInfo.name
      this.form.phone =  this.userInfo.phone
      this.form.sex = this.userInfo.sex
      this.form.username = this.userInfo.username
      this.form.studentId = this.userInfo.studentId
      this.form.id = this.userInfo.id
      this.form.avatar = this.userInfo.avatar

      this.form_serve.name = this.userInfo.name
      this.form_serve.phone =  this.userInfo.phone
      this.form_serve.sex = this.userInfo.sex
      this.form_serve.username = this.userInfo.username
      this.form_serve.studentId = this.userInfo.studentId
      this.form_serve.id = this.userInfo.id
      this.form_serve.avatar = this.userInfo.avatar

    },
    init(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo){
        this.userInfo = JSON.parse(userInfo)
        this.form.name = this.userInfo.name
        this.form.phone =  this.userInfo.phone
        this.form.sex = this.userInfo.sex
        this.form.username = this.userInfo.username
        this.form.studentId = this.userInfo.studentId
        this.form.id = this.userInfo.id
        this.form.avatar = this.userInfo.avatar

        this.form_serve.name = this.userInfo.name
        this.form_serve.phone =  this.userInfo.phone
        this.form_serve.sex = this.userInfo.sex
        this.form_serve.username = this.userInfo.username
        this.form_serve.studentId = this.userInfo.studentId
        this.form_serve.id = this.userInfo.id
        this.form_serve.avatar = this.userInfo.avatar
        loading.close();
        //注意用户名不能有重复
      }else {
        this.$message.error("数据错误,请刷新重试!")
      }
    },
    async onSubmit() {
      var that = this
      let data = {}
      if (!this.form.name) {
        this.$message.error("请你输入完整")
        return false;
      }
      if (!this.form.sex) {
        this.$message.error("请你输入完整")
        return false;
      }
      if (!this.form.phone) {
        this.$message.error("请你输入完整")
        return false;
      }
      if (!this.form.username) {
        this.$message.error("请你输入完整")
        return false;
      }
      if (!this.form.studentId) {
        this.$message.error("请你输入学号")
        return false;
      }
      data.id = this.form.id
      data.name = this.form.name
      data.sex = this.form.sex
      data.avatar = this.form.avatar
      data.permission = this.userInfo.permission
      data.phone = this.form.phone
      data.status = this.userInfo.status
      data.username = this.form.username
      data.studentId = this.form.studentId
      data.avatar = this.form.avatar
        const res = ""
      if (String(res.code)==='1'){
        that.$message.success(res.msg);

        if (String(data.code) === '1'){
          localStorage.setItem('userInfo',JSON.stringify(data.data))
          // localStorage.setItem('token',res.data.token)
          that.init()
        }else {
          this.$message.error(data.msg)
          router.push({name:'login'})
        }
      }
      else {
        this.$message.error(res.msg)
        
      }
    },

  }
}
</script>

<style>


.myinfo {
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    flex-flow: wrap;
}
.userform {

    padding: 2rem 4rem 1rem 1rem;
    border: #FFFFFF 1px solid;
    background-color: #FFFFFF;
    border-radius: 1rem;
}
.useravatar {
}

</style>