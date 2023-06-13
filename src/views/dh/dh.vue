<template>
  <div>
    <div v-for="card in cards"
         :key="card.id"
         class="bigBody"
    >
      <div
          v-show="card.item.length!==0"
          class="smallBody"
      >
        <div class="head">
          <h4 class="text">
            {{ card.name }}
          </h4>
        </div>
        <div v-for="item in card.item"
             v-show="item.permission.includes(real_cards.permission)||String(real_cards.permission)==='10'"
             :key="item.id"
             class="box_"
        >
          <div class="acard">
            <div class="box-card" shadow="hover">
              <div class="ico_ cont_" @click="pathGoTo(item,1)">

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

        </div>
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
</template>

<script>
import * as Api from "@/api/login";
import MarkDownDialog from "@/components/MarkDownDialog.vue";

// import { marked } from "marked";
export default {
  name: "dh.vue",
  components: {MarkDownDialog},
  data() {
    return {
      // todos: JSON.parse(localStorage.getItem('todos')) || []
      cards: [],
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
      //   this.$confirm("是否关闭", "提示", {
      //     confirmButtonText: "确认关闭",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   })
      //     .then(() => {
      this.markdownDialog.dialogVisible = flag;
      // })
      // .catch(() => {
      //   // 不关闭
      // });
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
.text {
  color: #9d7bc5;
  font-size: 1.2rem !important;
  margin-bottom: 1.5rem !important;

  font-weight: 700;
}

.bigBody {
  padding: 1rem 1rem 1rem 1rem;
  border: #FFFFFF 1px solid;
  background-color: #f9f9f9;
}

.smallBody {
  background-color: #f9f9f9;
  padding: 1rem 1rem 1rem 1rem;
  border: rgba(185, 182, 182, 0.26) 1px solid;
}

.box-card {
  width: 15rem;
  height: 4.4rem;
  display: flex;
  flex-direction: row;

  align-items: center;
  background-color: #FFFFFF;
}

.head {
  margin-top: 1.5rem;
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
  position: relative;
}

.acard:before {
  transition: all 0.6s cubic-bezier(0.7, -0.5, 0.2, 2);
  content: '';
  width: 1%;
  height: 100%;
  background: #a859ce;
  position: absolute;
  top: 0;
  left: 0;
}

.acard:hover:before {
  background: #d4b1e5;
  width: 83%;
  left: 17%;

}

</style>