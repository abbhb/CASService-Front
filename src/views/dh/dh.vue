<template>
  <!--  https://blog.csdn.net/Darling_DL/article/details/131193553未完,参考此篇-->
  <div id="Oauth-management" class="bd">
    <div class="portal">
      <div class="tableBar">
        <el-link target="_blank" @click="pathGoTo('houtai','goto')">管理后台</el-link>
        <userinfo-drop/>
      </div>
      <div class="portal-wrap">
        <div class="portal-header"></div>
        <div class="portal-content">
          <div class="portal-content-inner">
            <div class="portal-content__anchor">
              <div class="el-scrollba__r">
                <div class="el-scrollba__r__wrap" style="margin-bottom: -15px; margin-right: -15px;">
                  <div class="el-scrollba__r__view">
                    <div v-for="(card,key) in cards" :key="key" :class="activate===key?'anchor__item_hover':'anchor__item'"
                         @click="scrollTo(key)">
                      {{ card.name }}
                    </div>
                  </div>
                </div>
                <div class="el-scrollba__r__bar is-horizontal">
                  <div class="el-scrollba__r__thumb" style="transform: translateX(0%);"></div>
                </div>
                <div class="el-scrollba__r__bar is-vertical">
                  <div class="el-scrollba__r__thumb" style="transform: translateY(0%);"></div>
                </div>
              </div>
            </div>
            <div class="portal-content__block">
              <el-scrollbar
                  class="scrollbar-for"
                  style="height: 100%;"
              >
                <div class="el-scrollba__r">
                  <div class="el-scrollba__r__wrap" style="margin-bottom: -15px; margin-right: -15px;">
                    <div class="el-scrollba__r__view">
                      <div v-for="(card,keys) in cards"
                           :id="`items-${keys}`"
                           :key="keys"
                           class="bigBody"
                      >
                        <div
                            v-show="card.item.length!==0"
                            class="right-content"
                        >
                          <div class="head">
                            <h4 class="text">
                              {{ card.name }}
                            </h4>
                          </div>
                          <ul v-for="item in card.item"
                              v-show="item.permission.includes(real_cards.permission)||String(real_cards.permission)==='10'"
                              :key="item.id"
                              class="box_"
                          >
                            <div class="acard">
                              <div class="box-card" shadow="hover">
                                <div class="ico_ cont_ image_box" @click="pathGoTo(item,1)">

                                  <img v-if="item.image===''" class="img_" src="@/assets/notimage.png">
                                  <img v-else :src="item.image" class="img_">
                                </div>
                                <div class="cont_" @click="pathGoTo(item,1)">
                                  <div>
                                    <strong class="cont_head">{{ item.name }}</strong>
                                  </div>
                                  <div class="cont_cont">
                                    <el-tooltip :content="item.introduction" effect="dark" placement="right">
                                      <span>{{ item.introduction | ellipsis }}</span>
                                    </el-tooltip>
                                  </div>

                                </div>
                                <div class="link_" @click="pathGoTo(item,2)">
                                  <el-tooltip content="直达" effect="dark" placement="right">
                                    <i class="el-icon-s-promotion"></i>
                                  </el-tooltip>
                                </div>
                              </div>

                            </div>

                          </ul>
                        </div>

                        <MarkDownDialog
                            :clickMaskClose="true"
                            :content="markdownDialog.dialogContent"
                            :isShowDialog.sync="markdownDialog.dialogVisible"
                            :mask="true"
                            :showCloseIcon="true"
                            :title="markdownDialog.dialogTitle"
                            @beforeClose="beforeClose">

                        </MarkDownDialog>

                      </div>
                    </div>
                  </div>
                  <div class="el-scrollba__r__bar is-horizontal">
                    <div class="el-scrollba__r__thumb" style="transform: translateX(0%);"></div>
                  </div>
                  <div class="el-scrollba__r__bar is-vertical">
                    <div class="el-scrollba__r__thumb" style="transform: translateY(0%); height: 44.6674%;"></div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>


      </div>
      <div class="footer">AI_EN 认证中心</div>
    </div>
  </div>

</template>

<script>
import * as Api from "@/api/login";
import MarkDownDialog from "@/components/MarkDownDialog.vue";
import router from "@/router";
import UserinfoDrop from "@/components/userinfoDrop.vue";

export default {
  name: "dh.vue",
  components: {UserinfoDrop, MarkDownDialog},
  data() {
    return {
      // todos: JSON.parse(localStorage.getItem('todos')) || []
      cards: [],
      userInfo: {},
      activate: 0,
      real_cards: JSON.parse(localStorage.getItem("userInfo")),
      markdownDialog: {
        dialogTitle: 'markdown',
        dialogVisible: false,
        dialogContent: '123123',
      },
      myloadingstatus: undefined,//状态默认没有
    };
  },
  created() {
    this.$message.info("若菜单图标异常请强制刷新!shift+f5")
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
    }

    if (window.location.search.indexOf("?") !== -1) {
      let wenhao = window.location.href.indexOf("?")
      let arraytemp = window.location.href.split("")
      arraytemp.splice(wenhao, window.location.search.length)
      let sss = arraytemp.join("")
      window.location.href = sss
    }
  },
  mounted() {
    this.init()
    // 监听滚动事件
    window.addEventListener('scroll', this.onScroll)
  },
  destroy() {
    // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    async init() {
      let params = {}
      params.userId = this.userInfo.id
      const res = await Api.getNavList(params)
      if (String(res.code) === '1') {
        // console.log(res.data)
        this.myloadingstatus = 'success'
        this.cards = res.data
      } else {
        this.myloadingstatus = 'error'
        this.$message.error(res.msg)
      }
    },

    pathGoTo(row, lo) {
      if (row === 'houtai' && lo === 'goto') {
        router.push({name: 'userinfo'})
        return
      }
      if (lo === 1) {
        if (String(row.type) === '0') {
          if (String(row.content)) {
            console.log("md")
            console.log(row.content)
            this.markdownDialog.dialogTitle = row.name;
            this.markdownDialog.dialogContent = row.content;
            this.markdownDialog.dialogVisible = true;
          } else {
            window.open(row.path, '_blank');
          }
        } else if (String(row.type) === '1') {
          console.log("md")
          console.log(row)
          this.markdownDialog.dialogTitle = row.name;
          this.markdownDialog.dialogContent = row.content;
          this.markdownDialog.dialogVisible = true;
        }
      } else if (lo === 2) {
        if (String(row.type) === '0') {
          window.open(row.path, '_blank');
        } else if (String(row.type) === '1') {
          console.log("md")
          this.markdownDialog.dialogTitle = row.name;
          this.markdownDialog.dialogContent = row.content;
          this.markdownDialog.dialogVisible = true;
        }
      }

    },
    beforeClose(flag) {
      this.markdownDialog.dialogVisible = flag;
    },
    // 滚动监听器
    onScroll() {
      // 获取所有锚点元素
      const navContents = document.querySelectorAll('.right-content div')
      // 所有锚点元素的 offsetTop
      const offsetTopArr = []
      navContents.forEach(item => {
        offsetTopArr.push(item.offsetTop)
      })
      // 获取当前文档流的 scrollTop
      const scrollTop = document.documentElement.scrollTop + 40 || document.body.scrollTop + 40
      // 定义当前点亮的导航下标
      let navIndex = 0
      // let count = 0
      // let menu = document.getElementById('menu');
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 如果 scrollTop 大于等于第 n 个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        // 那么此时导航索引就应该是 n 了
        if (scrollTop >= offsetTopArr[n]) {
          navIndex = n
          // if (navIndex >= 8) count++
        }
      }
      //当前active菜单赋值
      this.active = navIndex
      console.log(this.active)
      // 滚动到一定位置 将菜单整体向上移  确保能看的到更多的菜单
      if (navIndex >= 8) {
        // menu.style.top = - 100 * count + 'px'
      } else {
        // menu.style.top = 0 + 'px'
      }

    },
    // 跳转到指定索引的元素
    scrollTo(index) {
      this.activate = index
      var anchor = document.getElementById(`items-${index}`);
      // chrome
      anchor.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})
    },

  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 17) {
        return value.slice(0, 17) + "...";
      }
      return value;
    }
  },


};
</script>

<style scoped>
html, body, #app {
  background-color: #f2f4f8
}

.text {
  font-size: 1.2rem !important;
  margin-top: 0;
  margin-bottom: .5em;
  color: rgba(0, 0, 0, .85);
  font-weight: 500;

}

.text :after {
  content: "";
  display: block;
  position: absolute;
  width: 20px;
  left: 3px;
  height: 3px;
  bottom: -8px;
  background-color: #69c0ff;
}

.bigBody {
  padding: 1rem 1rem 1rem 1rem;
  border: #FFFFFF 1px solid;
  display: flex;
  flex-direction: column;
  flex-flow: wrap;
}

.smallBody {
  padding: 1rem 1rem 1rem 1rem;
  border: rgba(185, 182, 182, 0.26) 1px solid;
}

.box-card {
  width: 15rem;
  height: 4.4rem;
  display: flex;
  border-left: 4px solid #1890ff;

  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 4px;
}

.head {

//border-bottom: 4px solid #1890ff; font-size: 20px;
  line-height: 1;
  margin-bottom: 29px;
  position: relative;
}

.head:after {
//border-bottom: 4px solid #1890ff; content: "";
  display: block;
  position: absolute;
  width: 20px;
  left: 3px;
  height: 3px;
  bottom: -8px;
  background-color: #69c0ff;
}

.box_ {
  display: inline-block;
  margin-right: 3rem;

  margin-bottom: 2rem;
  cursor: pointer;
}


.ico_ {
  width: 2.2rem;
  border-radius: 10px;
  margin-right: 5px;
  margin-left: 5px;

}

.img_ {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.image_box {
  padding: 10px 10px 10px 10px;

}

.cont_ {
  color: #333333;
  display: inline-block;
}

.cont_head {
  font-size: .875rem !important;
  position: relative;

  bottom: .3rem;
}

.cont_cont {
  font-size: .1rem;
  color: #6c757d !important;
  position: relative;
  bottom: .3rem;
}

::v-deep .el-card__body {
  padding: 13px;
}

.link_ {
  position: relative;
  padding: 1rem 1rem 1rem 1rem;
  margin-left: auto;

  font-size: 20px;
}

.acard {
  border: 0.1px solid #e7e9eb;
  position: relative;

  color: #1890ff;
  transition: all .2s cubic-bezier(.645, .045, .355, 1);
  box-shadow: 0 0 0 0 rgb(255, 255, 255, 0.1%);
}

.acard:before {
  position: relative;
  transition: all .2s cubic-bezier(.645, .045, .355, 1);
  box-shadow: 0 0 0 0 rgb(255, 255, 255, 0.1%);

}

.acard:hover {
  position: relative;
  box-shadow: 0 17px 40px -24px rgba(0, 36, 100, .3);
  transform: translateY(-10px);

  content: '';
}

.el-link.el-link--default {
  color: #fff;
  font-weight: 400;
  font-size: 20px;
}

.bd {
  height: 100%;

  .portal {
    width: 100%;

    min-width: 1250px;
    position: relative;
    background-color: #f2f4f8;

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: #999999;
    }

    .tableBar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 20px 55px 0 75px;
      color: #fff;

      font-size: 16px;
      line-height: 20px;
      background-image: none;
      background-size: cover;
      background-color: transparent;
      background-position-x: center;
      z-index: 10;

      .rt {
        float: right;
      }
    }

    .portal-wrap {
      width: 100%;
      height: 100%;

      position: relative;
      z-index: 1;
      padding-top: 8rem;

      .portal-header {

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 43%;
        background-color: #1890ff;
        background-image: url(~@/assets/bg.113f602.png);
        background-size: cover;
        background-position-x: center;
        background-position-y: center;
        z-index: -1;
      }

      .portal-content {


        height: auto;

        width: 1300px;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        margin: 0 auto;
        background: #FFF;

        .portal-content-inner {
          width: 100%;
          display: flex;
          flex-direction: row;
          height: max-content;
          -webkit-animation-duration: 1s;
          animation-duration: 1s;
          -webkit-animation-name: fadeInUpShow;
          animation-name: fadeInUpShow;

          .portal-content__anchor {
            width: 20rem;
            border-right: #e7e9eb 1px solid;
          }

          .portal-content__block {
            width: 100%;
            height: 49rem;
            overflow-y: hidden;
          }

        }
      }
    }

    .anchor__item {
      padding: 1rem 1rem 1rem 1rem;
      color: #523e3e;
    }

    .anchor__item_hover {
      border-left: 4px solid #1890ff;
      padding: 1rem 1rem 1rem 1rem;
      color: #1890ff;
    }

    .anchor__item:hover {
      padding: 1rem 1rem 1rem 1rem;
      color: #1890ff;

    }

    .anchor__item:focus {
      padding: 1rem 1rem 1rem 1rem;
      color: #1890ff;

    }

    .anchor__item:visited {
      padding: 1rem 1rem 1rem 1rem;
      color: #1890ff;

    }


  }
}


.el-scrollba__r__view {
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 1rem 0rem 0rem 1rem;
}
</style>