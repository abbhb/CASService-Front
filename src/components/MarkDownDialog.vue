<template>
  <!-- 打开弹框的动画 -->
  <div
      v-show="isShowDialog"
      :class="{ isShowMask: mask == true }"
      class="dialogBox"
      @click="clickMaskCloseFn"
  >
    <div class="dialogBoxContent" @click.stop>
      <div class="headheadsss">
        <!-- 这样写可以做到若有传递过来的title就用传递过来的title
        若有传递过来的插槽，就以插槽的为准 -->

        <span>{{ title }}</span>

        <i v-show="showCloseIcon" class="el-icon-close" @click="close"> </i>
      </div>
      <div class="bodybody">
        <!-- 内容区我们使用默认插槽 -->
        <!--          <div v-highlight v-html="compiledMarkdown" class="styleClass"></div>-->
        <v-md-preview :text="content"></v-md-preview>

        <slot></slot>
      </div>
      <div class="footfoot">
        <!-- 底部使用命名插槽 -->

      </div>
    </div>
  </div>

</template>

<script>


export default {
  props: {
    // 控制是否展示或隐藏对话框
    isShowDialog: {
      type: Boolean,
      default: false,
    },
    // 父组件传过来的标题值
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    // 是否显示关闭小图标
    showCloseIcon: {
      type: Boolean,
      default: true,
    },
    // 是否开启背景遮罩层
    mask: {
      type: Boolean,
      default: true,
    },
    // 是否点击遮罩层mask关闭弹出框
    clickMaskClose: {
      type: Boolean,
      default: false,
      require: true
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    // 关闭弹出框
    close() {
      this.$emit("beforeClose", false);
    },
    // 点击遮罩层关闭弹框
    clickMaskCloseFn() {
      if (this.clickMaskClose == true) {
        this.$emit("beforeClose", false);
      } else {
        /* 这里要控制一下冒泡事件，注意第十行使用@click.stop
           不控制冒泡的话，点击内容区也会导致弹出框关闭*/
        return;
      }
    },
  },
};
</script>

<style scoped>
.dialogBox {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 90000;
}

.dialogBox .dialogBoxContent {
  width: 85rem;
  z-index: 99000;
  height: 44rem;
  border: 2px solid #e9e9e9;
  border-radius: 2px;
  background-color: #fff;

}

.dialogBox .dialogBoxContent .headheadsss {
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e9e9e9;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialogBox .dialogBoxContent .headheadsss span {
  font-size: 24px;
}

.dialogBox .dialogBoxContent .headheadsss i {
  font-size: 24px;
  cursor: pointer;
}

.dialogBox .dialogBoxContent .bodybody {
  width: 100%;
  height: calc(100% - 120px);
}

.dialogBox .dialogBoxContent .footfoot {
  width: 100%;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
  border-top: 1px solid #e9e9e9;
  padding: 0 20px;
}

.dialogBox .dialogBoxContent .footfoot .el-button {
  margin-left: 12px;
}

.isShowMask {
  background-color: rgba(0, 0, 0, 0.3);
}


</style>