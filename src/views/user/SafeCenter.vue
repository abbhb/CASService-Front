<template>
    <div id="changepassword" class="bos">
        <div style="position: relative;-webkit-box-flex: 1;flex: 1;z-index: 1;">
            <div class="profile-page personal__center-container">
                <div class="profile-user">
                    <div class="ui-cell">
                        <div class="ui-cell__hd" style="opacity: 1;"><img
                                :src="userInfo.avatar" alt=""></div>
                        <div class="ui-cell__bd">
                            <div class="ui-cell__title">你好！{{ userInfo.name }}</div>
                            <div class="ui-cell__info">{{ userInfo.id }}</div>
                        </div>
                        <div class="ui-cell__ft" @click="changeUser = true;"><span class="btn-link">切换帐号</span>
                        </div>
                    </div>
                </div>
                <div class="profile-ability">
                    <div class="profile-ability__list">
                        <div class="ui-cell">
                            <div class="ui-cell__hd"><span class="ui-icon ui-icon-pwd"></span></div>
                            <div class="ui-cell__bd">
                                <div class="ui-cell__title">修改密码</div>
                                <div class="ui-cell__info">重置登录密码</div>
                            </div>
                            <div class="ui-cell__ft" @click="changepassword"><span class="btn-link">去修改</span></div>
                        </div>
                        <div class="ui-cell">
                            <div class="ui-cell__hd"><span class="ui-icon ui-icon-mobile"></span></div>
                            <div class="ui-cell__bd">
                                <div class="ui-cell__title">电子邮箱</div>
                                <div class="ui-cell__info" v-if="userInfo.email">{{ userInfo.email }}</div>
                                <div class="ui-cell__info" v-else>暂未绑定</div>
                            </div>
                            <div class="ui-cell__ft" @click="EmailWithUser">
                <span role="button" class="btn-link" v-if="userInfo.email">
                  去更换
                </span><span role="button" class="btn-link" v-else>
                  去绑定
                </span>
                            </div>
                        </div>
                        <div class="ui-cell">
                            <div class="ui-cell__hd"><span class="ui-icon ui-icon-key"></span></div>
                            <div class="ui-cell__bd">
                                <div class="ui-cell__title">独立密码</div>
                                <div class="ui-cell__info">暂不开放</div>
                            </div>
                            <div class="ui-cell__ft"><span class="btn-link">暂未开放</span></div>
                        </div>
                    </div>
                    <div class="function_title">更多功能</div>
                    <div class="function_list">
                        <div class="function_item">
                            <div class="function_item-icon icon-account"></div>
                            <div class="function_item-content">
                                <div class="function_item-content-title">帐号解冻</div> <!----></div>
                            <div class="function_item-ft">去申请</div>
                        </div>
                        <div class="function_item">
                            <div class="function_item-icon icon-lock"></div>
                            <div class="function_item-content">
                                <div class="function_item-content-title">找回密码</div> <!----></div>
                            <div class="function_item-ft" @click="findPassword">去找回</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
                :title="classData.title"
                :visible.sync="classData.dialogVisible"
                width="55%"
                class="dialog"
                :show-close="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :append-to-body="true"
                style="z-index: 2100"
        >
            <el-card class="box-card">
                <el-form ref="emailform" label-position="left" label-width="100px">
                    <el-form-item v-if="this.emailform.originEmail" label="原邮箱验证码">
                        <div>
                            检测到你已经绑定<span style="font-weight: 800;">{{ this.emailform.originEmail }}</span>,请先验证!
                        </div>
                        <div style="display: flex;flex-direction: row;">
                            <el-input v-model="emailform.originCode" id="inputValue" type="text"
                                      placeholder="请输入原邮箱验证码"/>
                            <EmailButton :email="emailform.originEmail"></EmailButton>

                        </div>

                    </el-form-item>
                    <el-form-item label="电子邮箱">
                        <el-input v-model="emailform.newEmail" type="eamil" placeholder="请输入电子邮箱"/>
                    </el-form-item>
                    <el-form-item label="邮箱验证码" prop="newpassword">
                        <div style="display: flex;flex-direction: row;">
                            <el-input v-model="emailform.newCode" id="inputValue" type="text"
                                      placeholder="请输入新邮箱验证码"/>
                            <EmailButton :email="emailform.newEmail"></EmailButton>

                        </div>

                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">绑定邮箱</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-dialog>

    </div>
</template>

<script>

import router from "@/router";
import {emailWithUser, getEmail} from "@/api/email";
import EmailButton from "@/components/EmailButton.vue";


export default {
    name: "SafeCenter",
    components: {EmailButton},
    data() {
        return {
            msgText: "",
            emailform: {
                originEmail: '',
                originCode: '',
                newEmail: '',
                newCode: '',
            },
            userInfo: {},
            classData: {
                title: "",
                dialogVisible: false,
            },
            changeUser: false,
            getEmailCodeStatus1: false,
            count1: 60,//电子邮件倒计时
            timer1: null,//电子邮件倒计时
            getEmailCodeStatus2: false,
            count2: 60,//电子邮件倒计时
            timer2: null,//电子邮件倒计时
        }
    },
    watch: {
        'passform.newpassword': {
            handler(newname) {
                this.msgText = this.checkStrong(newname);
                if (this.msgText > 1 || this.msgText == 1) {
                    document.getElementById("one").style.background = "#ff0000";
                    console.log("red")
                } else {
                    document.getElementById("one").style.background = "#eee";
                }
                if (this.msgText > 2 || this.msgText == 2) {
                    document.getElementById("two").style.background = "orange";
                } else {
                    document.getElementById("two").style.background = "#eee";
                }
                if (this.msgText == 4) {
                    document.getElementById("three").style.background = "#00D1B2";
                } else {
                    document.getElementById("three").style.background = "#eee";
                }
            }
        }
    },
    created() {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            this.userInfo = JSON.parse(userInfo)
            if (this.userInfo.email) {
                this.emailform.originEmail = this.userInfo.email
            }
        }
    },
    methods: {
        EmailWithUser() {
            if (this.userInfo.email) {
                this.classData.title = '改绑电子邮箱';
            } else {
                this.classData.title = '绑定电子邮箱';
            }

            this.classData.dialogVisible = true;

        },
        changepassword() {
            router.push({name: 'changepassword'})
        },
        async onSubmit() {
            const data = await emailWithUser({
                originEmail: this.emailform.originEmail,
                originCode: this.emailform.originCode,
                newEmail: this.emailform.newEmail,
                newCode: this.emailform.newCode
            });
            if (String(data.code) === '1') {
                this.$message.success(data.msg);
                this.classData.dialogVisible = false;
                router.push({name: "login"})
            } else {
                this.$message.error(data.msg);
            }
        },
        async getCode(email, type) {
            const TIME_COUNT = 60;
            if (type === 1) {
                if (this.getEmailCodeStatus1) {
                    this.$message.error("请1分钟后尝试")
                    return
                }
                this.getEmailCodeStatus1 = true
                if (!this.timer1) {
                    this.count1 = TIME_COUNT;
                    this.timer1 = setInterval(() => {
                        if (this.count1 > 0 && this.count1 <= TIME_COUNT) {
                            this.count1 -= 1;
                        } else {
                            clearInterval(this.timer1);
                            this.getEmailCodeStatus1 = false
                            this.timer1 = null;
                        }
                    }, 1000);
                }
            } else {
                if (this.getEmailCodeStatus2) {
                    this.$message.error("请1分钟后尝试")
                    return
                }
                this.getEmailCodeStatus2 = true
                if (!this.timer2) {
                    this.count2 = TIME_COUNT;
                    this.timer2 = setInterval(() => {
                        if (this.count2 > 0 && this.count2 <= TIME_COUNT) {
                            this.count2 -= 1;
                        } else {
                            clearInterval(this.timer2);
                            this.getEmailCodeStatus2 = false
                            this.timer2 = null;
                        }
                    }, 1000);
                }
            }

            const data = await getEmail({email: email});
            if (String(data.code) === '1') {
                this.$message.success(data.msg);
            } else {
                this.$message.error(data.msg);
            }
        },
        findPassword() {
            router.push({name: 'findPassword'})
        },
    }
}
</script>

<style>
.box-card {
    width: 50rem;
}

.dialog .box-card {
    width: auto;
}


.input_span span {
    width: 14rem;
}

.bos {
    display: flex;
    flex-direction: row;
}


@media screen and (min-width: 1025px) {
    .home-banner__text h1, .home-banner__text h2 {
        font-size: 0;
        text-indent: -9999px
    }



}


@-webkit-keyframes banner-logo {
    0% {
        -webkit-transform: translate(0);
        transform: translate(0)
    }

    50% {
        -webkit-transform: translateY(-7px);
        transform: translateY(-7px)
    }

    to {
        -webkit-transform: translate(0);
        transform: translate(0)
    }
}

@keyframes banner-logo {
    0% {
        -webkit-transform: translate(0);
        transform: translate(0)
    }

    50% {
        -webkit-transform: translateY(-7px);
        transform: translateY(-7px)
    }

    to {
        -webkit-transform: translate(0);
        transform: translate(0)
    }
}


@-webkit-keyframes light-kf-run {
    0% {
        -webkit-transform: translate(0);
        transform: translate(0)
    }

    25%, to {
        -webkit-transform: translate(-6012px);
        transform: translate(-6012px)
    }
}

@keyframes light-kf-run {
    0% {
        -webkit-transform: translate(0);
        transform: translate(0)
    }

    25%, to {
        -webkit-transform: translate(-6012px);
        transform: translate(-6012px)
    }
}


.home-ability .ui-cell__title {
    background: transparent 50% no-repeat
}


@media screen and (min-width: 1025px) {

    .home-ability .ui-cell {
        background: #fff;
        border-radius: 8.54px;
        box-shadow: 0 -1px 32px 0 rgba(29, 102, 189, .16);
        cursor: pointer;
        float: left;
        height: 220px;
        overflow: hidden;
        padding: 0;
        position: relative;
        text-align: center;
        width: 240px
    }

    .home-ability .ui-cell:after {
        background: -webkit-linear-gradient(left, #24b4ff, #0f84ff);
        background: linear-gradient(90deg, #24b4ff 0, #0f84ff);
        border-radius: 0 0 12px 12px;
        bottom: 0;
        content: "";
        height: 8px;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        -webkit-transition: opacity .2s ease;
        transition: opacity .2s ease;
        width: 100%
    }

    .home-ability .ui-cell:hover {
        box-shadow: 0 19px 79px rgba(105, 156, 216, .64);
        -webkit-transform: translateY(-16px);
        transform: translateY(-16px)
    }

    .home-ability .ui-cell:hover:after {
        opacity: 1
    }

    .home-ability .ui-cell + .ui-cell {
        margin-left: 30px;
        margin-top: 0
    }

    .home-ability .ui-cell__hd {
        float: none;
        margin-right: 0;
        margin-top: 50px
    }

    .home-ability .ui-cell__hd .ui-icon {
        margin: 0 auto
    }

    .home-ability .ui-cell__bd {
        float: none
    }

    .home-ability .ui-cell__title {
        color: #000;
        font-size: 16px;
        font-weight: 700;
        height: 22px;
        line-height: 22px;
        margin-top: 30px
    }

    .home-ability .ui-cell__info {
        font-size: 14px;
        line-height: 20px;
        margin-top: 6px
    }

    .home-ability .ui-cell__ft {
        display: none
    }
}

@media screen and (max-width: 1024px) {

    .home-ability .ui-cell {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0 3px 9px rgba(29, 102, 189, .16);
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        min-height: 80px;
        padding: 0 13px 0 20px
    }

    .home-ability .ui-cell + .ui-cell {
        margin-top: 26px
    }

    .home-ability .ui-cell__hd {
        -webkit-flex-shrink: 0;
        flex-shrink: 0;
        margin-right: 13px
    }

    .home-ability .ui-cell__hd .ui-icon {
        height: 39px;
        width: 39px
    }

    .home-ability .ui-cell__hd img {
        border-radius: 100%;
        height: 39px;
        width: 39px
    }

    .home-ability .ui-cell__bd {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        min-width: 0
    }

    .home-ability .ui-cell__info {
        font-size: 11px;
        line-height: 15px
    }
}

.btn-link {
    color: #2b8dfd;
    display: inline-block
}

.btn-link:after {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
    background-repeat: no-repeat;
    background-size: 100%;
    content: "";
    display: inline-block
}

@media screen and (min-width: 1025px) {
    .btn-link {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        cursor: pointer;
        display: -webkit-inline-flex;
        display: inline-flex;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        vertical-align: middle
    }

    .btn-link:after {
        height: 12px;
        margin-left: 2px;
        vertical-align: -3px;
        width: 12px
    }
}

@media screen and (max-width: 1024px) {
    .btn-link {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        color: #909090;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        font-size: 12.6px;
        line-height: 14px
    }

    .btn-link:after {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        height: 14px;
        line-height: 14px;
        margin-left: 5px;
        width: 14px
    }
}

@media screen and (min-width: 1025px) {
    .profile-page {
        margin-top: 45px
    }
}

@media screen and (max-width: 1024px) {
    .profile-page {
        padding: 14px
    }
}

@media screen and (min-width: 1025px) {
    .profile-user {
        height: 82px;
        margin-bottom: 16px;
        width: 545px
    }

    .profile-user .ui-cell {
        padding: 19px
    }

    .profile-user .ui-cell__hd {
        height: 43px;
        margin-right: 19px;
        width: 43px
    }

    .profile-user .ui-cell__hd img {
        border-radius: 43px
    }

    .profile-user .ui-cell__bd {
        float: left
    }

    .profile-user .ui-cell__title {
        font-size: 16px;
        font-weight: 600
    }

    .profile-user .ui-cell__txt {
        font-size: 16px;
        line-height: 22px;
        margin-top: 10px
    }
}

@media screen and (max-width: 1024px) {
    .profile-user {
        margin-bottom: 14px
    }

    .profile-user .ui-cell {
        border: none;
        border-radius: 7px;
        padding: 0 14px
    }

    .profile-user .ui-cell__ft:after {
        display: none
    }

    .profile-user .ui-cell__ft .btn-link {
        display: -webkit-inline-flex;
        display: inline-flex
    }
}

.profile-ability .ui-icon-mobile {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/icon-g-pwd-54baa.svg);
}

.profile-ability .ui-icon-app {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/icon-g-pwd-54baa.svg);
}

.profile-ability .ui-icon-key {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/icon-g-pwd-54baa.svg)
}

.profile-ability .ui-icon-pwd {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/icon-g-pwd-54baa.svg);
}

@media screen and (min-width: 1025px) {
    .profile-ability {
        height: 82px;
        width: 545px
    }
}

@media screen and (max-width: 1024px) {
    .profile-ability__list {
        background: #fff;
        border-radius: 7px;
        padding: 0 14px
    }
}


.qui-input input, .qui-input textarea {
    -webkit-box-flex: 1;
    border: 0;
    -webkit-flex: 1;
    flex: 1;
    font-size: 16px;
    min-width: 0;
    resize: none
}





a, address, b, blockquote, body, div, em, fieldset, form, h1, h2, h3, h4, h5, h6, html, i, iframe, img, label, legend, li, ol, p, s, span, table, tbody, td, tfoot, th, thead, tr, ul {
    border: 0;
    font-family: -apple-system, sans-serif;
    font-size: 100%;
    font-style: inherit;
    font-weight: inherit;
    margin: 0;
    padding: 0
}

ol, ul {
    list-style: none
}

a img {
    border: none;
    vertical-align: top
}

a {
    text-decoration: none
}

button {
    background-color: transparent;
    border: 0;
    font-family: inherit;
    margin: 0;
    overflow: visible;
    padding: 0
}

button::-moz-focus-inner {
    padding: 0
}

input, textarea {
    -webkit-appearance: none;
    background: none;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    font-family: inherit;
    padding: 0
}

input[type=password] {
    -webkit-text-security: disc
}

button:focus, input:focus, textarea:focus {
    outline: none
}

body {
    word-wrap: break-word
}

* {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
}

.hybrid a, .hybrid img {
    -webkit-touch-callout: none
}

body, html {
    height: 100%
}

body {
    -webkit-font-smoothing: antialiased;
    background-color: #f9fbff;
    font-family: system-ui, -apple-system, PingFangSC-Regular, helvetica neue, tahoma, PingFang SC, microsoft yahei, arial, hiragino sans gb, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: hidden;
    width: 100%
}

@media screen and (max-width: 1024px) {
    body {
        background-color: #f4f5f6
    }
}

@media screen and (min-width: 1025px) {
    .personal__center-container {
        margin-left: auto;
        margin-right: auto;
        width: 545px
    }

    .personal__center-container:after {
        clear: both;
        content: "";
        display: block
    }

    .app-page {
        min-height: 1000px
    }
}

@font-face {
    font-family: fzruizh;
    font-style: normal;
    font-weight: 400;
    src: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/fonts/fzruizh-b6910.eot);
    src: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/fonts/fzruizh-b6910.eot?#iefix) format("embedded-opentype"), url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/fonts/fzruizh-f0eb2.woff) format("woff"), url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/fonts/fzruizh-5d463.ttf) format("truetype"), url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/fzruizh-17f45.svg#../font/fzruizh) format("svg")
}

.ui-cell__hd {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex
}

.ui-cell__hd .ui-icon {
    background-repeat: no-repeat;
    background-size: 100%;
    display: block
}

.ui-cell__title {
    color: #000
}

.ui-cell__info, .ui-cell__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

.ui-cell__info {
    color: #707070
}

.ui-cell__info.reviewing span {
    color: #ff596a
}

@media screen and (min-width: 1025px) {
    .ui-cell {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 -1px 45px rgba(29, 102, 189, .16);
        padding: 19px;
        -webkit-transition: all .25s ease;
        transition: all .25s ease
    }

    .ui-cell:after {
        clear: both;
        content: "";
        display: block
    }

    .ui-cell + .ui-cell {
        margin-top: 16px
    }

    .ui-cell__hd {
        float: left;
        margin-right: 19px
    }

    .ui-cell__hd .ui-icon {
        height: 43.6px;
        width: 43.6px
    }

    .ui-cell__hd img {
        border-radius: 100%;
        display: block;
        height: 100%;
        width: 100%
    }

    .ui-cell__bd {
        float: left
    }

    .ui-cell__title {
        font-size: 16px;
        font-weight: 400;
        line-height: 22px
    }

    .ui-cell__info {
        color: #999;
        font-size: 14px;
        line-height: 20px;
        margin-top: 4px
    }

    .ui-cell__ft {
        float: right;
        margin-top: 13px
    }
}

@media screen and (max-width: 1024px) {
    .ui-cell {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        background-color: #fff;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        min-height: 66.5px
    }

    .ui-cell:not(:last-child) {
        border-bottom: .5px solid #e6e6e6
    }

    .ui-cell__hd {
        -webkit-flex-shrink: 0;
        flex-shrink: 0;
        margin-right: 13px
    }

    .ui-cell__hd .ui-icon, .ui-cell__hd img {
        height: 47.4px;
        width: 47.4px
    }

    .ui-cell__hd img {
        border-radius: 100%
    }

    .ui-cell__bd {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        min-width: 0
    }

    .ui-cell__title {
        font-size: 15.3px;
        line-height: 18px;
        margin: 4.5px 0
    }

    .ui-cell__info {
        color: #999;
        font-size: 12.6px;
        line-height: 15px
    }

    .ui-cell__ft {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-shrink: 0;
        flex-shrink: 0;
        margin-left: 10px
    }

    .ui-cell__ft:after {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-gray-14fc2.svg);
        background-repeat: no-repeat;
        background-size: 100%;
        content: "";
        display: inline-block;
        height: 14px;
        margin-left: 5px;
        width: 14px
    }

    .ui-cell__ft .btn-link {
        display: none
    }

}

.function_title {
    color: #000;
    font-size: 15.5px;
    font-weight: 700;
    margin-bottom: 14px;
    margin-top: 21px
}

.function_item {
    background: #fff;
    box-sizing: border-box
}

.function_item-icon {
    display: inline-block
}

.function_item .icon-lock {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/lock-95d86.png);
    background-position: 50%
}

.function_item .icon-account {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/persion-a6ffb.png);
    background-position: 50%
}

@media screen and (min-width: 1025px) {


    .function_list {
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between
    }

    .function_item, .function_list {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex
    }

    .function_item {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        border-radius: 8px;
        box-shadow: 0 6px 35px -8px rgba(29, 102, 189, .16);
        height: 82px;
        padding: 19px;
        width: 265px
    }

    .function_item-icon {
        height: 43.6px;
        width: 43.6px
    }

    .function_item .icon-account, .function_item .icon-lock {
        background-size: 43.3px 43.3px
    }

    .function_item-content {
        -webkit-box-flex: 1;
        display: inline-block;
        -webkit-flex: 1;
        flex: 1;
        margin-left: 19px
    }

    .function_item-content-title {
        color: #000;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px
    }

    .function_item-ft {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        color: #2b8dfd;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        font-size: 14px;
        font-weight: 400
    }

    .function_item-ft:after {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        background-repeat: no-repeat;
        background-size: 100%;
        content: "";
        display: inline-block;
        height: 12px;
        margin-left: 2px;
        width: 12px
    }
}

@media screen and (max-width: 1024px) {
    .function_list {
        background: #fff;
        border-radius: 7px;
        padding: 0 14px
    }

    .function_item {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        height: 66.5px;
        width: 100%
    }

    .function_item:not(:last-child) {
        border-bottom: .5px solid #e6e6e6
    }

    .function_item-icon {
        height: 47.4px;
        width: 47.4px
    }

    .function_item .icon-account, .function_item .icon-lock {
        background-size: 47.4px 47.4px
    }

    .function_item-content {
        -webkit-box-flex: 1;
        display: inline-block;
        -webkit-flex: 1;
        flex: 1;
        margin-left: 7px
    }

    .function_item-content-title {
        color: #000;
        font-size: 15.3px;
        line-height: 18px;
        margin-bottom: 4px
    }

    .function_item-ft {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-shrink: 0;
        flex-shrink: 0
    }

    .function_item-ft:after {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        background-repeat: no-repeat;
        background-size: 100%;
        content: "";
        display: inline-block;
        height: 14px;
        margin-left: 5px;
        width: 14px
    }
}

.login-container iframe {
    height: 100%;
    width: 100%
}

</style>