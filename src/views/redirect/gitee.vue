<template>
  <div style="display: flex;flex-direction: column">
    <ThreeLoginR :classData="this.classData" @onSubmitF="this.onSubmit"></ThreeLoginR>
  </div>

</template>

<script>
import * as Auth from "@/api/auth";
import router from "@/router";
import ThreeLoginR from "@/components/ThreeLoginR.vue";

export default {
  name: "gitee",
  components: {ThreeLoginR},
  data(){
    return{
      code:'',
      classData:{
        title:"尊贵的用户,您首此使用该第三方登录授权本服务,请简单绑定一下资料",
        dialogVisible:false,
        type:'1',//默认绑定
        username:'',
        password:'',
        trId:'',
      }
    }
  },
  async created() {
    if (localStorage.getItem('token')){
      const res = "!"

      if (String(res.code) === '1'){
        localStorage.setItem("type",res.data.permissions)
        localStorage.setItem('userInfo',JSON.stringify(res.data))
        localStorage.setItem('userId',String(res.data.id))
        window.location.search=''
        router.push({name:'dh'})
      }else {
        sessionStorage.setItem("userLastStoreId","")
      }
    }
    if (window.location.search===''){
      this.$message.error("认证服务出错了,请联系开发者!")
    }else {
      this.code = window.location.search.split('?')[1].split('&')[0].split('=')[1]
      if (this.code===''){
        this.$message.error("认证服务出错了,请联系开发者!")
        return
      }
      const res = await Auth.redirectGitee(this.code)
      console.log(res.data)
      if (String(res.code) === '1') {
        this.successLogin(res)
        router.push({name:'dh'})

      } else if (String(res.code)==='2'){
        //需要绑定或者注册
        this.classData.trId = res.data.id
        this.classData.dialogVisible = true
      }
      else {
        this.$message.error(res.msg)
        sessionStorage.setItem("userLastStoreId","")
      }

    }

  },
  methods:{
    async onSubmit() {
      if (!this.classData.trId) {
        this.$message.error("参数缺少,请从头再来")
        return
      }
      if (!this.classData.type) {
        this.$message.error("参数缺少")
        return
      }
      if (!this.classData.username) {
        this.$message.error("参数缺少")
        return
      }
      if (!this.classData.password) {
        this.$message.error("参数缺少")
        return
      }
      let data = {}
      data.trId = this.classData.trId
      data.type = this.classData.type
      data.username = this.classData.username
      data.password = this.classData.password
      const resd = await Auth.firstGitee(data)
      console.log(resd)
      if (String(resd.code)==='1'){
        this.successLogin(resd)
        router.push({name:'dh'})
      }else {
        this.$message.error(resd.msg)
      }
    },
    successLogin(res){
      localStorage.setItem('userInfo',JSON.stringify(res.data))
      localStorage.setItem("permission",res.data.permission)
      localStorage.setItem('userId',String(res.data.id))
      localStorage.setItem('token',res.data.token)
      window.location.search=''
    }
  }
}
</script>

<style scoped>

</style>