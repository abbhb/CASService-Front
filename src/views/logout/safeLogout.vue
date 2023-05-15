<template>
    <div class="all">
        <MainTopNav></MainTopNav>
        <div class="main">
            <div class="container">
                <div class="container-title">
                    <div class="container-title__split"></div>
                    <div class="container-title__content">安全登出</div>
                </div>
                <div class="container-inner">
                    <div>
                        <div>
                            <span style="font-weight: 700;font-size: large">您确定要退出登录吗？</span>
                            <div style="display: flex;flex-direction: column;">
                              <div style="font-family: 宋体">
                                  退出后您通过本系统登录的所有应用都将退出登录
                              </div>
                                <div style="font-family: 宋体;font-size: 18px">
                                  本次预计下线{{nums}}个服务
                              </div>

                            </div>
                        </div>
                    </div>
                    <div class="btn-area">
                        <div
                                class="btn-area__button button-color">
                            <el-button @click="NextB(1)" >返回</el-button>
                            <el-button @click="NextB(2)" type="primary">单点登出</el-button>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
import MainTopNav from "@/components/MainTopNav.vue";
import {logoutSize} from "@/api/login";
import * as Api from "@/api/login";
import router from "@/router";

export default {
    name: "safeLogout",
    components: {MainTopNav},
    data() {
        return {
            nums: 0,
        };
    },
    async created() {
        const res = await logoutSize();
        if (String(res.code) === "1") {
            this.nums = res.data;
        }
    },
    methods:{
        async NextB(type) {
            if (type === 1) {
                this.$router.go (-1)
            } else {
                const data = await Api.logoutApi()
                console.log(data)

                if (String(data.code) === '900') {
                    this.$message.success(data.msg);
                    sessionStorage.clear();
                    localStorage.clear();
                    router.push({name: 'login'})
                } else {
                    this.$message.error(data.msg);
                }
            }
        }
    }
}
</script>

<style scoped>
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
            display: -webkit-box;
            display: -webkit-flex;
            display: flex !important;
            flex-direction: column;
            -webkit-justify-content: center;
            justify-content: center;
            margin: 40px auto;
            padding: 50px 0;
            width: 496px;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;

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