<template>
    <div class="all">
        <MainTopNav></MainTopNav>
        <div class="main">
            <div class="container">
                <div class="container-title">
                    <div class="container-title__split"></div>
                    <div class="container-title__content">找回密码</div>
                </div>
                <div class="container-inner" v-if="currentStep===1">
                    <div>
                        <div>
                            <span>请输入账号的邮箱</span>
                            <el-input
                                placeholder="邮箱"
                                v-model="email"
                                type="email"
                                clearable>
                            </el-input>
                        </div>
                    </div>
                    <div class="btn-area">
                        <button disabled="disabled"
                                class="btn-area__button button-color">
                            <el-button type="primary">下一步</el-button>
                        </button>
                    </div>
                </div>
                <div class="container-inner" v-else-if="currentStep===2">
                    <div>
                        <div>
                            <div>验证码已经发送到邮箱<span style="font-weight: 600;font-size: 15px;">{{email}}</span></div>
                            <el-input
                                placeholder="验证码"
                                v-model="code"
                                clearable>
                            </el-input>
                        </div>
                    </div>
                    <div class="btn-area">
                        <button disabled="disabled"
                                class="btn-area__button button-color">
                            <el-button type="primary">上一步</el-button>
                            <el-button type="primary">下一步</el-button>
                        </button>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import MainTopNav from "@/components/MainTopNav.vue";

export default {
    name: "FindPassword",
    components: {MainTopNav},
    data(){
        return{
            email:'',
            currentStep:2,//当前处于第几步
            code:'',//验证码
        }
    }
}
</script>

<style>
.all {
    background: #f9fbff;
    height: 100%;

    .main {
        background: #f9fbff;
        height: auto;
        width: 100%;

        .container {
            -webkit-box-pack: center;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 6px 32px -7px rgba(29, 102, 189, .16);
            -webkit-flex-direction: column;
            flex-direction: column;
            -webkit-justify-content: center;
            justify-content: center;
            margin: 40px auto;
            padding: 50px 0;
            width: 496px;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;


            .container-title {
                width: 316px;
                display: flex;
                flex-direction: row;
                align-items: center;

                .container-title__split {
                    background: #2b8dfd;
                    height: 14px;
                    margin-right: 6px;
                    width: 3px;
                }

                .container-title__content {
                    color: #000;
                    font-family: PingFangSC-Semibold;
                    font-size: 16px;
                }
            }

            .container-inner {
                margin-top: 28px;
                width: 298px;
                .btn-area {
                    margin-top: 30px;
                }
            }
        }
    }
}
</style>