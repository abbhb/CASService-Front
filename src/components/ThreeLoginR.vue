<template>
    <div>
        <div class="loader-box">
            <div class="lable">认证中,请稍安勿躁!</div>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 style="margin: auto; background: rgb(241, 242, 243); display: block;" width="200px" height="200px"
                 viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <g>
                    <circle cx="60" cy="50" r="4" fill="#41455f">
                        <animate attributeName="cx" repeatCount="indefinite" dur="1s" values="95;35" keyTimes="0;1"
                                 begin="-0.67s"></animate>
                        <animate attributeName="fill-opacity" repeatCount="indefinite" dur="1s" values="0;1;1"
                                 keyTimes="0;0.2;1" begin="-0.67s"></animate>
                    </circle>
                    <circle cx="60" cy="50" r="4" fill="#41455f">
                        <animate attributeName="cx" repeatCount="indefinite" dur="1s" values="95;35" keyTimes="0;1"
                                 begin="-0.33s"></animate>
                        <animate attributeName="fill-opacity" repeatCount="indefinite" dur="1s" values="0;1;1"
                                 keyTimes="0;0.2;1" begin="-0.33s"></animate>
                    </circle>
                    <circle cx="60" cy="50" r="4" fill="#41455f">
                        <animate attributeName="cx" repeatCount="indefinite" dur="1s" values="95;35" keyTimes="0;1"
                                 begin="0s"></animate>
                        <animate attributeName="fill-opacity" repeatCount="indefinite" dur="1s" values="0;1;1"
                                 keyTimes="0;0.2;1" begin="0s"></animate>
                    </circle>
                </g>
                <g transform="translate(-15 0)">
                    <path d="M50 50L20 50A30 30 0 0 0 80 50Z" fill="#52b548" transform="rotate(90 50 50)"></path>
                    <path d="M50 50L20 50A30 30 0 0 0 80 50Z" fill="#52b548">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s"
                                          values="0 50 50;45 50 50;0 50 50" keyTimes="0;0.5;1"></animateTransform>
                    </path>
                    <path d="M50 50L20 50A30 30 0 0 1 80 50Z" fill="#52b548">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s"
                                          values="0 50 50;-45 50 50;0 50 50" keyTimes="0;0.5;1"></animateTransform>
                    </path>
                </g>
            </svg>
        </div>
        <div>
            <el-dialog
                    :title="classData.title"
                    :visible.sync="classData.dialogVisible"
                    width="55%"
                    :show-close="true"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :append-to-body="true"
                    style="z-index: 2100"
            >
                <el-card class="box-card">
                    <el-form ref="emailform" label-position="left" label-width="100px">
                        <el-form-item label="请选择类型" prop="type">
                            <el-radio v-model="classData.type" label="1">绑定原有账号</el-radio>
                            <el-radio v-model="classData.type" label="2">新建账号</el-radio>
                        </el-form-item>
                        <div>
                            <el-form-item label="用户名" prop="username">

                                <el-input v-if="classData.type==='1'" v-model="classData.username" type="username"
                                          placeholder="请输入原用户名"/>
                                <el-input v-else-if="classData.type==='2'" v-model="classData.username" type="username"
                                          placeholder="请输入新用户名"/>

                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-if="classData.type==='1'" v-model="classData.password" type="password"
                                          placeholder="请输入原密码"/>
                                <el-input v-else-if="classData.type==='2'" v-model="classData.password" type="password"
                                          placeholder="请输入新密码"/>
                            </el-form-item>
                            <!--绑定-->
                        </div>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">确认</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-dialog>
        </div>
    </div>
</template>

<script>
/**
 * 第三方登录组件
 */
export default {
    name: "ThreeLoginR",
    props: {
        // 控制是否展示或隐藏对话框
        classData: {
            type: Object,
            default: undefined,
        }
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        // 关闭弹出框
        onSubmit() {
            // 父组件监听@onSubmitF
            this.$emit("onSubmitF", false);
        }

    },
}
</script>

<style scoped>
body {
    text-align: center;
    background-color: #f2f2f2;
}

.loader-box {
    width: 200px;
    height: 200px;
    margin: auto;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    background-color: #ffffff;
    margin-top: 100px;
    text-align: center;
}

.lable {
    height: 30px;
    line-height: 30px;
    padding-top: 20px;
    font-family: Gotham, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #404040;
    font-size: 20px;
}

.loader {
    width: 90px;
    height: 90px;
    background-color: #FFFFFF;
    overflow: hidden;
    display: block;
    -moz-border-radius: 100%;
    -webkit-border-radius: 100%;
    border-radius: 100%;
    border: 3px solid #5dba9d;
    position: relative;
    margin: 15px auto;
    z-index: 1;
}

.element-animation {
    animation: animationFrames linear 3s;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards; /*when the spec is finished*/
    -webkit-animation: animationFrames linear 3s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-fill-mode: forwards; /*Chrome 16+, Safari 4+*/
    -moz-animation: animationFrames linear 3s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-fill-mode: forwards; /*FF 5+*/
    -o-animation: animationFrames linear 3s;
    -o-animation-iteration-count: infinite;
    -o-animation-fill-mode: forwards; /*Not implemented yet*/
    -ms-animation: animationFrames linear 3s;
    -ms-animation-iteration-count: infinite;
    -ms-animation-fill-mode: forwards; /*IE 10+*/
}


@keyframes animationFrames {
    0% {
        transform: translate(-1160px, 15px);
    }
    100% {
        transform: translate(0px, 15px);
    }
}

@-moz-keyframes animationFrames {
    0% {
        transform: translate(-1160px, 15px);
    }
    100% {
        transform: translate(0px, 15px);
    }
}

@-webkit-keyframes animationFrames {
    0% {
        transform: translate(-1160px, 15px);
    }
    100% {
        transform: translate(0px, 15px);
    }
}

@-o-keyframes animationFrames {
    0% {
        transform: translate(-1160px, 15px);
    }
    100% {
        transform: translate(-0px, 15px);
    }
}

@-ms-keyframes animationFrames {
    0% {
        transform: translate(-1160px, 15px);
    }
    100% {
        transform: translate(0px, 15px);
    }
}
</style>