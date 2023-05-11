<template>
    <header class="header">
        <div class="left" @click="clickLogo">
            <span style="color: #ffffff;font-size: 32px;font-weight: 900;">CAS 认证服务</span>
            <div class="version">@Version:{{ Version }}</div>
        </div>
        <div class="right" style="display: flex;flex-direction: row;align-items: center;">
            <div style="margin-right: 30px;font-size: 12px;color: #FFFFFF">
                <span @click="changeThemes">切换主题</span>
            </div>
            <div style="margin-right: 30px;font-size: 12px;color: #FFFFFF">
                <span @click="setIsNeedZoom">显示异常?点击修复视图</span>
            </div>
            <div class="warp" style="margin-right: auto;">
                <el-dropdown v-if="isLogin">
                <span class="el-dropdown-link">
                    <el-avatar shape="circle" :size="40" :src="avatar"/>
                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item >{{ name }}</el-dropdown-item>
                        <el-dropdown-item @click.native="onLogOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div v-else>
                  <span class="el-dropdown-link">
                        <el-link style="margin-right: 1rem;color: #FFFFFF;font-weight: 600;font-size: 18px;" type="primary" @click="toLogin">登录</el-link>
                  </span>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import * as Api from "@/api/login";
import router from "@/router";
import {getImage} from "@/api/common";


export default {
    name: "MainTopNav",

    data(){
      return{
          userphoto: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          showPhotoMenu: false,
          name: '11',
          Version: this.$globl.Version,
          bigLogo:true,
          screenWidth: document.body.clientWidth,
          userInfo: {},
          menuCollapse:false,
          isLogin:true,
          avatar:require('@/assets/failed.png'),
      }
    },
    watch: {
        screenWidth(newVal) {
            console.log('newVal', newVal);
            if (newVal <= 1000) {
                this.menuCollapse = true;
                this.bigLogo = false;
                this.$emit('menuCollapseChange',this.menuCollapse);

            } else {
                this.menuCollapse = false;
                this.bigLogo = true;
                this.$emit('menuCollapseChange',this.menuCollapse);

            }

        }

    },
    created() {
        const that = this;
        window.onresize = () => {
            window.screenWidth = document.body.clientWidth;
            that.screenWidth = window.screenWidth;
        };
        const userInfo = window.localStorage.getItem('userInfo')
        if (userInfo) {
            this.userInfo = JSON.parse(userInfo)
            this.name = this.userInfo.name;
            this.userphoto = this.userInfo.avatar;
            this.getImage(this.userphoto)
            this.isLogin = true;
        }else {
            this.isLogin = false;
        }
    },
    methods:{
        async getImage(q) {
            if (!q.includes("http")) {
                const res = await getImage(q)
                if (String(res.code) === '1') {
                    this.avatar = res.data;
                    return String(res.data);
                }
                return '';
            }
            this.avatar = q;
            return q;
        },
        clickLogo(){
           this.menuCollapse = !this.menuCollapse;
           this.$emit('menuCollapseChange',this.menuCollapse);
        },
        changeThemes(){
          this.$message.info("开发中！请期待")
        },
        setIsNeedZoom() {
            this.$globl.isNeedZoom = true;
            document.body.style.zoom = 0.9
        },
        async onLogOut() {
            const data = await Api.logoutApi()
            console.log(data)

            if (String(data.code) === '900') {
                this.$message.success(data.msg);
                sessionStorage.clear();
                localStorage.clear();
                router.push({name:'login'})
            } else {
                this.$message.error(data.msg);
            }

        },
        toLogin(){
          router.push({name:'login'})
        },
    }
}
</script>

<style>
.header {
    background-image:radial-gradient(123.45% 123.45% at 50% -191.89%,#b0e0ff 0,#18a7fd 46.56%,#3a77fd 100%);
    height: 40px;
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
        display: flex;
        flex-direction: row;
        align-items: center;
        white-space: nowrap;
        color: #FFFFFF;
        font-weight: 600;
        font-size: 20px;
        text-overflow: ellipsis;
        font-family: 'system-ui';

    }
}

.version {
    font-family: 'MS Reference Sans Serif';
    font-size: 12px;
    font-weight: 200;
    justify-content: end;
    align-self: end;
}
</style>