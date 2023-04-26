<template>
    <div class="home">
        <MainTopNav @menuCollapseChange="menuCollapseChange"></MainTopNav>
        <section class="section">
            <div class="tac">
                <div class="col1">
                    <el-menu
                            default-active="2"
                            class="el-menu-vertical-demo"
                            @open="handleOpen"
                            @close="handleClose"
                            :collapse="menuCollapse"
                            :unique-opened="true"
                            :default-openeds="defaultUnfoldedMenu"
                            select="1-1"
                            background-color="#ffffff"
                            text-color="#5c5c5c"
                            active-text-color="#ffd04b"
                    >
                        <div v-for="(item) in menuData" :key="item.index">
                            <el-submenu
                                    v-if="item.childList && item.childList.length > 0"
                                    :index="item.index"
                            >
                                <template slot="title">
                                    <i :class="item.iconClassName"></i>
                                    <span slot="title">{{ !menuCollapse ? item.optionName : '' }}</span>
                                </template>
                                <el-menu-item
                                        v-for="(item1) in item.childList"
                                        :key="item1.index"
                                        :index="item1.index"
                                        :routerName="item1.routerName"
                                        @click="onClickMenu(item1)"
                                >
                                    <!--                  {{ item1.optionName }}-->
                                    <template slot="title">
                                        <i :class="item1.iconClassName"></i>
                                        <span slot="title">{{
                                            !menuCollapse ? item1.optionName : item1.optionName
                                            }}</span>
                                    </template>
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="item.index"
                                    :disabled="item.disabled"
                                    :routerName="item.routerName"
                                    @click="onClickMenu(item)"
                            >
                                <i :class="item.iconClassName"></i>
                                <span slot="title">{{ !menuCollapse ? item.optionName : '' }}</span>
                            </el-menu-item>
                        </div>
                    </el-menu>
                </div>
                <div class="col2">
                    <header class="col2_header">
                        <el-tag
                                v-for="tag in tags"
                                :key="tag.routerName"
                                closable
                                @close="close(tag)"
                                @click="clickTag(tag)"
                                :type="tag.type?tag.type:'info'"
                                class="item"
                        >{{ tag.name }}
                        </el-tag>
                    </header>
                    <div class="warp">
                        <slot></slot>

                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>

import {menuData} from "@/views/mencCofig";
import MainTopNav from "@/components/MainTopNav.vue";


export default {
    name: "MainNavFrame",
    components: {MainTopNav},
    data() {
        return {
            // 菜单配置
            menuData: menuData,
            menuCollapse: false, //是否水平折叠收起菜单
            defaultUnfoldedMenu: '1', // 默认展开第一项
            tags: [],
            userInfo: {},

        };
    },

    created() {


        this.defaultUnfoldedMenu = [
            localStorage.getItem("defaultUnfoldedMenu")
        ];
        this.tags = JSON.parse(localStorage.getItem("tagsNavList")) || [];
        const userInfo = window.localStorage.getItem('userInfo')
        if (userInfo) {
            this.userInfo = JSON.parse(userInfo)
        }
        this.getMenuData()


    },
    methods: {
        // 收取菜单按钮
        onMenuCollapse() {
            this.defaultUnfoldedMenu = [
                localStorage.getItem("defaultUnfoldedMenu")
            ];
        },
        getMenuData() {
            this.menuData = this.menuData.filter(item => item.roles.includes(String(this.userInfo.permission)))
        },
        // 菜单展开
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
            localStorage.setItem("defaultUnfoldedMenu", "" + key);
        },
        menuCollapseChange(data) {
            this.menuCollapse = data
        },
        // 菜单收取
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        // 点击菜单项
        onClickMenu(item) {
            let _this = this;
            // 如果要跳转的路由和当前路由一致就 return
            if (this.$router.history.current.name == item.routerName) return;
            this.$router.push({
                name: item.routerName
            });
            // 如果tags中已经存在 return
            let temp = includes(item.routerName);
            if (temp) {
                this.tags.forEach(item => {
                    item.type = "info";
                });
                temp.type = "success";
                return;
            }
            this.tags.forEach(item => {
                item.type = "info";
            });
            this.tags.push({
                name: item.optionName,
                routerName: item.routerName,
                type: "success"
            });

            this.changeTagColor(item.routerName);
            localStorage.setItem("tagsNavList", JSON.stringify(this.tags));

            // 查看当前 tags里有没有传进来的路由，返回 true false

            function includes(routerName) {
                let tags = _this.tags;
                return tags.find(item => {
                    return item.routerName == routerName;
                });
            }
        },
        // 点击 tag
        clickTag(tag) {
            console.log(tag.routerName);
            if (this.$router.history.current.name == tag.routerName) return;
            this.$router.push({
                name: tag.routerName
            });
            this.changeTagColor(tag.routerName);
            localStorage.setItem("tagsNavList", JSON.stringify(this.tags));
        },
        // 点击 tag 的小×
        close(tag) {
            console.log(tag);
            let spliceIndex = this.tags.findIndex(item => {
                return item.routerName == tag.routerName;
            });
            console.log(spliceIndex);
            this.tags.splice(spliceIndex, 1);
            localStorage.setItem("tagsNavList", JSON.stringify(this.tags));
        },
        // 改变tag的颜色 公用的
        changeTagColor(routerName) {
            this.tags.forEach(item => {
                if (item.routerName == routerName) {
                    item.type = "success";
                } else {
                    item.type = "info";
                }
            });
        },

    }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #eee;
  display: flex;
  flex-direction: column;


  .section {
    flex: 1;
    box-sizing: border-box;
    overflow: auto;


    .tac {
      flex: 1;
      display: flex;
      height: 100%;
      box-sizing: border-box;

      .col1 {
        //border: rgba(129, 164, 190, 0.86) 0.01rem;
        //background-color: #ffffff;
        background-color: #ffffff;
      }

      .col2 {
        flex: 1;
        background: #f9fbff;
        padding: 0 15px 15px 15px;
        border-radius: 5px;
        margin-right: 5px;
        height: 96%;
        overflow: auto;

        .col2_header {
          width: 85%;
          height: 3rem;
          overflow: hidden;
          //border-bottom: 1px solid rgba(238, 238, 238, 0.24);
          background: #f9fbff;
          padding: 1rem;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          position: fixed;
          z-index: 2000;

          .item {
            margin-right: 8px;


          }
        }

        .warp {
          margin: 15px;
          padding-top: 2.3rem;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-flex-direction: column;
          -ms-flex-direction: column;
          /*布局方向是垂直的*/
          flex-direction: column;
        }
      }
    }
  }

  // border: 1px solid #f00;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

// 下拉菜单
.el-dropdown-link {
  cursor: pointer;
  color: #5c5c5c;
}

.el-icon-arrow-down {
  font-size: 12px;
}

@media screen and (min-width: 1000px) {
  .style-logo-NxwZ7 {
    display: inline-flex;
    width: 148px;
    height: 60px;
    margin-right: 7rem;
    border-radius: 2px;
  }

}

@media screen and (max-width: 1000px) {
  .style-logo-NxwZ7 {
    display: inline-flex;
    width: 36px;
    height: 36px;
    margin-right: 7rem;
    border-radius: 2px;
  }

}


//点击后样式
.el-menu-item.is-active {
  background-color: #d0d8e7 !important;
  color: #fff;

  span {
    color: #165DFF !important;
  }

  i {
    color: #3a8ee6;
  }
}

</style>