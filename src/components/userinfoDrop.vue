<template>
  <el-dropdown class="rt">
                <span class="el-dropdown-link">
                    {{ this.userInfo.username }}({{ this.userInfo.name }})
                </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>{{ this.userInfo.name }}</el-dropdown-item>
      <el-dropdown-item @click.native="onLogOut">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>


import router from "@/router";

export default {
  name: "userinfoDrop",
  data() {
    return {
      userInfo: {},

    }
  },
  created() {
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
    }
  },
  methods: {
    onLogOut() {
      router.push({name: 'safeLogout'})
    },
  }

}
</script>

<style scoped>
.el-dropdown {
  color: #fff;

}
</style>