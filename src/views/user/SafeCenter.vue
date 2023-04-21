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
                        <div class="ui-cell__ft" @click="changeUser = true;"><span class="btn-link">切换帐号</span></div>
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
                            <div class="function_item-ft">去找回</div>
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
                    <el-form-item label="电子邮箱" prop="password">
                        <el-input v-model="emailform.email" type="eamil" placeholder="请输入电子邮箱"/>
                    </el-form-item>
                    <el-form-item label="邮箱验证码" prop="newpassword">
                        <div style="display: flex;flex-direction: row;">
                            <el-input v-model="emailform.code" id="inputValue" type="text"
                                      placeholder="请输入邮箱验证码"/>
                            <el-button type="primary" @click="getCode" style="margin-left: 1rem;">获取验证码</el-button>
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



export default {
    name: "SafeCenter",
    data() {
        return {
            msgText: "",
            emailform: {
                email: '',
                code: '',
            },
            userInfo: {},
            classData: {
                title: "",
                dialogVisible: false,
            },
            changeUser:false,

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
            const data =" await Api.emailWithUser({email: this.emailform.email, code: this.emailform.code});"
            if (String(data.code) === '1') {
                this.$message.success(data.msg);
            } else {
                this.$message.error(data.msg);
            }
        },
        async getCode() {
            const data = "await Api.createEmailCode({email: this.emailform.email});"
            if (String(data.code) === '1') {
                this.$message.success(data.msg);
            } else {
                this.$message.error(data.msg);
            }
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

.input_span {
    display: flex;
    flex-direction: row;

    height: 0.5rem;


}

.input_span span {
    width: 14rem;
}

.bos {
    display: flex;
    flex-direction: row;
}

.bos .lists {

}

.home-banner {
    background-position: 50% 50%;
    background-repeat: no-repeat
}

@media screen and (min-width: 1025px) {
    .home-banner {
        background-color: #21abfd;
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        height: 444px;
        min-width: 1200px
    }

    .home-banner__inner {
        height: 100%;
        position: relative
    }

    .home-banner__text {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        background-repeat: no-repeat;
        height: 127.3px;
        left: 360px;
        overflow: hidden;
        position: absolute;
        top: 155.5px;
        width: 389.9px
    }

    .home-banner__text h1, .home-banner__text h2 {
        font-size: 0;
        text-indent: -9999px
    }

    .home-banner__imgs {
        height: 295px;
        left: 14px;
        position: absolute;
        top: 55px;
        width: 334px
    }

    .home-banner__logo {
        -webkit-animation: banner-logo 2.5s linear infinite;
        animation: banner-logo 2.5s linear infinite;
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        height: 148px;
        left: 111px;
        top: 78px;
        width: 113.8px;
        z-index: 1
    }

    .home-banner__line, .home-banner__logo {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute
    }

    .home-banner__line {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        height: 202.1px;
        left: 58px;
        top: 85px;
        width: 221.3px;
        z-index: 2
    }

    .home-banner__light {
        height: 295px;
        left: -3px;
        position: absolute;
        top: 32px;
        width: 334px;
        z-index: 3
    }
}

@media screen and (max-width: 1024px) {
    .home-banner {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        background-size: 100% 100%;
        padding-top: 24.933333%;
        width: 100%
    }

    .home-banner__imgs, .home-banner__text {
        display: none
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

.light-kf {
    overflow: hidden
}

.light-kf:after {
    clear: both;
    content: "";
    display: block
}

.light-kf__inner {
    -webkit-animation: light-kf-run 4s steps(18) infinite;
    animation: light-kf-run 4s steps(18) infinite;
    left: 0;
    position: absolute;
    top: 0;
    width: 6012px;
    will-change: transform
}

.light-kf__item {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
    background-repeat: no-repeat;
    float: left;
    height: 295px;
    overflow: hidden;
    width: 334px
}

.light-kf__item-00 {
    background-position: -1px -1px;
    margin-left: 334px
}

.light-kf__item-01 {
    background-position: -1px -298px
}

.light-kf__item-02 {
    background-position: -1px -595px
}

.light-kf__item-03 {
    background-position: -337px -1px
}

.light-kf__item-05 {
    background-position: -337px -595px
}

.light-kf__item-04 {
    background-position: -337px -298px
}

.light-kf__item-06 {
    background-position: -673px -1px
}

.light-kf__item-07 {
    background-position: -673px -298px
}

.light-kf__item-09 {
    background-position: -1009px -1px
}

.light-kf__item-08 {
    background-position: -673px -595px
}

.light-kf__item-10 {
    background-position: -1345px -1px
}

.light-kf__item-11 {
    background-position: -1681px -1px
}

.light-kf__item-12 {
    background-position: -1009px -298px
}

.light-kf__item-14 {
    background-position: -1345px -298px
}

.light-kf__item-13 {
    background-position: -1009px -595px
}

.light-kf__item-15 {
    background-position: -1681px -298px
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

.home-ability .ui-icon-lock {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.home-ability .ui-icon-account {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.home-ability .ui-icon-more {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.home-ability .ui-cell__title {
    background: transparent 50% no-repeat
}

.home-ability .unfreeze_account {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.home-ability .find_pwd {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.home-ability .more_features {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

@media screen and (min-width: 1025px) {
    .home-ability {
        margin-top: -41px
    }

    .home-ability__inner:after {
        clear: both;
        content: "";
        display: block
    }

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
    .home-ability__inner {
        padding: 26px 20px
    }

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

.alert {
    position: absolute;
    top: 130px;
    width: 100%;
    z-index: 999
}

.alert, .alert-container {
    -webkit-box-pack: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center
}

.alert-container {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background: #fff;
    border-radius: 22.5px;
    box-shadow: 0 2px 16px -2px rgba(29, 102, 189, .14);
    padding: 13px 30px
}

.icon {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    height: 24px;
    width: 24px
}

.message {
    color: #000;
    font-size: 16px;
    margin-left: 10px
}

.icon.info {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.icon.success {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.icon.error {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.alert.in-mobile {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background: rgba(0, 0, 0, .5);
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    left: 0;
    position: fixed;
    right: 0;
    top: 0
}

.in-mobile .alert-container {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    box-sizing: border-box;
    -webkit-flex-direction: column;
    flex-direction: column;
    height: 150px;
    width: 213px
}

.in-mobile .icon {
    height: 40px;
    margin-bottom: 15px;
    width: 40px
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


.qui-input, .qui-input__label {
    display: -webkit-flex;
    display: -webkit-box;
    display: flex
}

.qui-input {
    background-color: #fff;
    padding: 16px 0;
    position: relative
}

.qui-input__label {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
    font-size: 17px;
    margin-left: 16px;
    margin-right: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

.qui-input__label-textarea {
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start
}

.qui-input__wrap {
    -webkit-box-flex: 1;
    -webkit-box-pack: justify;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-flex;
    display: -webkit-box;
    display: flex;
    -webkit-flex: 1;
    flex: 1;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    min-width: 0;
    padding: 0 16px;
    position: relative
}

.qui-input__btn-clear {
    margin-left: 16px;
    position: relative;
    z-index: 1
}

.qui-input__btn-clear:after {
    background-color: transparent;
    content: "";
    display: block;
    height: 44px;
    left: 50%;
    position: absolute;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 44px;
    z-index: 8
}

.qui-input__textarea {
    position: relative
}

.qui-input__textarea .qui-icon-close-o {
    bottom: 0
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

.qui-input input::-webkit-input-placeholder, .qui-input textarea::-webkit-input-placeholder {
    color: #b0b3bf
}

.qui-input__textarea .qui-input__indicator {
    bottom: -10px;
    right: 12px
}

.qui-input__indicator {
    bottom: -36px;
    color: #878b99;
    font-size: 12px;
    position: absolute;
    right: 0
}

.qui-input__extra {
    -webkit-flex-shrink: 0;
    flex-shrink: 0
}

@font-face {
    font-display: block;
    font-family: qq-icons;
    font-style: normal;
    font-weight: 400;
    src: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/fonts/qq-icons.d9c1edc2-6a1df.woff) format("woff"), url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/fonts/qq-icons.d5c8ff33-9fc2b.ttf) format("truetype")
}

[class*=" qui-icon-"], [class^=qui-icon-] {
    speak: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: inherit;
    font-family: qq-icons !important;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    font-weight: 400;
    line-height: 1;
    text-transform: none
}

.qui-icon-edit:before {
    content: "\e900"
}

.qui-icon-smile:before {
    content: "\e902"
}

.qui-icon-music-list:before {
    content: "\e903"
}

.qui-icon-no-preview:before {
    content: "\e904"
}

.qui-icon-no-color-label:before {
    content: "\e905"
}

.qui-icon-color-label:before {
    content: "\e906"
}

.qui-icon-vip:before {
    content: "\e907"
}

.qui-icon-punch-card:before {
    content: "\e909"
}

.qui-icon-level:before {
    content: "\e90a"
}

.qui-icon-like:before {
    content: "\e90b"
}

.qui-icon-phone:before {
    content: "\e90c"
}

.qui-icon-pc:before {
    content: "\e90d"
}

.qui-icon-location:before {
    content: "\e90e"
}

.qui-icon-success:before {
    content: "\e90f"
}

.qui-icon-qrcode:before {
    content: "\e910"
}

.qui-icon-share:before {
    content: "\e911"
}

.qui-icon-copy:before {
    content: "\e912"
}

.qui-icon-more:before {
    content: "\e913"
}

.qui-icon-more-app:before {
    content: "\e914"
}

.qui-icon-notice:before {
    content: "\e915"
}

.qui-icon-close-o:before {
    content: "\e916"
}

.qui-icon-close:before {
    content: "\e917"
}

.qui-icon-red-pccket:before {
    content: "\e918"
}

.qui-icon-newline:before {
    content: "\e919"
}

.qui-icon-action:before {
    content: "\e91a"
}

.qui-icon-add-contacts:before {
    content: "\e91b"
}

.qui-icon-add-o:before {
    content: "\e91c"
}

.qui-icon-add:before {
    content: "\e91d"
}

.qui-icon-left:before {
    content: "\e91e"
}

.qui-icon-up:before {
    content: "\e91f"
}

.qui-icon-right:before {
    content: "\e920"
}

.qui-icon-down:before {
    content: "\e921"
}

.qui-icon-crop:before {
    content: "\e922"
}

.qui-icon-report:before {
    content: "\e923"
}

.qui-icon-kandian:before {
    content: "\e924"
}

.qui-icon-zoom-in:before {
    content: "\e926"
}

.qui-icon-volume:before {
    content: "\e927"
}

.qui-icon-gift:before {
    content: "\e928"
}

.qui-icon-link:before {
    content: "\e929"
}

.qui-icon-setting:before {
    content: "\e92a"
}

.qui-icon-signal:before {
    content: "\e92b"
}

.qui-icon-fast-pass:before {
    content: "\e92c"
}

.qui-icon-business-card:before {
    content: "\e92d"
}

.qui-icon-friend-zone:before {
    content: "\e92f"
}

.qui-icon-shield:before {
    content: "\e930"
}

.qui-icon-sign-in:before {
    content: "\e931"
}

.qui-icon-wallet:before {
    content: "\e932"
}

.qui-icon-group-member:before {
    content: "\e933"
}

.qui-icon-calendar:before {
    content: "\e934"
}

.qui-icon-scan:before {
    content: "\e935"
}

.qui-icon-filter:before {
    content: "\e936"
}

.qui-icon-remove:before {
    content: "\e937"
}

.qui-icon-upload:before {
    content: "\e938"
}

.qui-icon-upload-cloud:before {
    content: "\e939"
}

.qui-icon-setting-o:before {
    content: "\e93b"
}

.qui-icon-setting-switch:before {
    content: "\e93c"
}

.qui-icon-time:before {
    content: "\e93d"
}

.qui-icon-video:before {
    content: "\e93e"
}

.qui-icon-favorite:before {
    content: "\e940"
}

.qui-icon-receive-payment:before {
    content: "\e941"
}

.qui-icon-mobile:before {
    content: "\e942"
}

.qui-icon-search:before {
    content: "\e943"
}

.qui-icon-zoom-out:before {
    content: "\e944"
}

.qui-icon-tencent-doc:before {
    content: "\e945"
}

.qui-icon-info:before {
    content: "\e946"
}

.qui-icon-warning:before {
    content: "\e947"
}

.qui-icon-success-o:before {
    content: "\e948"
}

.qui-icon-alert:before {
    content: "\e949"
}

.qui-icon-phone-o:before {
    content: "\e94a"
}

.qui-icon-vote:before {
    content: "\e94b"
}

.qui-icon-quit:before {
    content: "\e94c"
}

.qui-icon-web:before {
    content: "\e94d"
}

.qui-icon-wechat:before {
    content: "\e94e"
}

.qui-icon-cloud:before {
    content: "\e94f"
}

.qui-icon-place:before {
    content: "\e950"
}

.qui-icon-text:before {
    content: "\e951"
}

.qui-icon-folder:before {
    content: "\e952"
}

.qui-icon-download:before {
    content: "\e953"
}

.qui-icon-camera:before {
    content: "\e954"
}

.qui-icon-weibo:before {
    content: "\e955"
}

.qui-icon-night:before {
    content: "\e956"
}

.qui-icon-email:before {
    content: "\e957"
}

.qui-icon-voice:before {
    content: "\e958"
}

.qui-icon-preview:before {
    content: "\e959"
}

.qui-icon-image:before {
    content: "\e95a"
}

.qui-icon-dress-up:before {
    content: "\e95b"
}

.qui-icon-fullscreen:before {
    content: "\e95c"
}

.qui-icon-exit-fullscreen:before {
    content: "\e95d"
}

.qui-icon-page:before {
    content: "\e95e"
}

.qui-icon-gif:before {
    content: "\e95f"
}

.qui-icon-ipad:before {
    content: "\e960"
}

.qui-icon-ptv:before {
    content: "\e961"
}

.qui-icon-qq:before {
    content: "\e962"
}

.qui-icon-qzone:before {
    content: "\e963"
}

.qui-icon-qq-sport:before {
    content: "\e966"
}

.qui-icon-safari:before {
    content: "\e967"
}

.qui-button {
    background-color: #fff;
    border-radius: 6px;
    color: #03081a;
    font-size: 17px;
    line-height: normal
}

.qui-button__inner {
    -webkit-box-pack: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-flex;
    display: -webkit-box;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center
}

.qui-button_large {
    height: 45px;
    width: 100%
}

.qui-button_medium {
    height: 40px;
    min-width: 168px
}

.qui-button_small {
    border-radius: 45px;
    font-size: 14px;
    height: 30px;
    padding: 0 16px
}

.qui-button_default {
    background-color: #fff
}

.qui-button_default:not(:disabled):active {
    background-color: #ebedf5
}

.qui-button_default:disabled {
    color: #b0b3bf
}

.qui-button_primary {
    background-color: #00cafc;
    color: #fff
}

.qui-button_primary:not(:disabled):active {
    background-color: #00afdb
}

.qui-button_primary:disabled {
    background-color: #b3effe
}

.qui-button_warning {
    background-color: #fff;
    color: #ff596a
}

.qui-button_warning:not(:disabled):active {
    background-color: #ebedf5
}

.qui-button_warning:disabled {
    color: rgba(255, 89, 106, .3)
}

.qui-button_gray {
    background-color: #ebedf5;
    color: #03081a
}

.qui-button_gray:not(:disabled):active {
    background-color: #d4d6dc
}

.qui-button_gray:disabled {
    background-color: #ebedf5;
    color: #b0b3bf
}

.qui-button_vip {
    background-color: #ffcd00;
    color: #03081a
}

.qui-button_vip:not(:disabled):active {
    background-color: #ffc200
}

.qui-button_vip:disabled {
    background-color: #fff0b2;
    color: rgba(3, 8, 26, .3)
}

.qui-button_link {
    background-color: transparent;
    color: #4d94ff;
    width: auto
}

.qui-button_link:disabled, .qui-button_link:not(:disabled):active {
    opacity: .5
}

.qui-button_link.qui-button_link_small {
    font-size: 14px
}

.qui-button .qui-loading {
    line-height: 1;
    margin-right: 4px
}

.qui-button .qui-loading__icon {
    font-size: 14px
}

.qui-button.qui-button_small .qui-loading__icon {
    font-size: 12px
}

@-webkit-keyframes QUILoading {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

@keyframes QUILoading {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

.qui-loading__icon {
    -webkit-animation: QUILoading 1s steps(12) infinite;
    animation: QUILoading 1s steps(12) infinite;
    font-size: 16px;
    height: 1.42457em;
    margin: 0 auto;
    vertical-align: middle;
    width: 1.42457em
}

.qui-loading__icon i {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%
}

.qui-loading__icon i:before {
    background-color: currentColor;
    border-radius: 40%;
    content: "";
    display: block;
    height: 25%;
    margin: 0 auto;
    width: 2px
}

.qui-loading__icon, .qui-loading_normal, .qui-loading_normal .qui-loading__inner {
    display: inline-block
}

.qui-loading_normal .qui-loading__txt-tips {
    color: currentColor;
    font-size: 14px;
    margin-left: 4px;
    vertical-align: middle
}

.qui-loading_float {
    left: 50%;
    position: fixed;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 10002
}

.qui-loading_float .qui-loading__inner {
    background-color: #03081a;
    border-radius: 6px;
    box-sizing: border-box;
    min-height: 100px;
    min-width: 100px;
    padding: 25px 22px
}

.qui-loading_float .qui-loading__icon {
    display: block
}

.qui-loading_float .qui-loading__icon i:before {
    background-color: #fff
}

.qui-loading_float .qui-loading__txt-tips {
    color: #fff;
    display: block;
    font-size: 16px;
    margin-top: 12px;
    text-align: center
}

.qui-loading__icon i:first-of-type {
    opacity: 1;
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg)
}

.qui-loading__icon i:nth-of-type(2) {
    opacity: .9375;
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg)
}

.qui-loading__icon i:nth-of-type(3) {
    opacity: .875;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg)
}

.qui-loading__icon i:nth-of-type(4) {
    opacity: .8125;
    -webkit-transform: rotate(120deg);
    transform: rotate(120deg)
}

.qui-loading__icon i:nth-of-type(5) {
    opacity: .75;
    -webkit-transform: rotate(150deg);
    transform: rotate(150deg)
}

.qui-loading__icon i:nth-of-type(6) {
    opacity: .6875;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
}

.qui-loading__icon i:nth-of-type(7) {
    opacity: .625;
    -webkit-transform: rotate(210deg);
    transform: rotate(210deg)
}

.qui-loading__icon i:nth-of-type(8) {
    opacity: .5625;
    -webkit-transform: rotate(240deg);
    transform: rotate(240deg)
}

.qui-loading__icon i:nth-of-type(9) {
    opacity: .5;
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg)
}

.qui-loading__icon i:nth-of-type(10) {
    opacity: .4375;
    -webkit-transform: rotate(300deg);
    transform: rotate(300deg)
}

.qui-loading__icon i:nth-of-type(11) {
    opacity: .375;
    -webkit-transform: rotate(330deg);
    transform: rotate(330deg)
}

.qui-loading__icon i:nth-of-type(12) {
    opacity: .3125;
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
}

.loading-fade-enter-active {
    -webkit-animation: fadeIn .15s linear;
    animation: fadeIn .15s linear
}

.loading-fade-leave-active {
    -webkit-animation: fadeOut .15s linear;
    animation: fadeOut .15s linear
}

.aq-password-container {
    background: #fff
}

.aq-password-container.mobile .input {
    position: relative
}

.aq-password-container.mobile .input:after {
    background: #dedfe0;
    bottom: 0;
    content: "";
    height: 1px;
    position: absolute;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    width: 100%
}

.aq-password-container.mobile .input .q-input__label, .aq-password-container.mobile .input .qui-input__label {
    margin-left: 0
}

.aq-password-container .tips, .aq-password-container.mobile .aq-password-container__content {
    margin-bottom: 20px;
    padding: 0 27px
}

.aq-password-container .tips span {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 9px
}

.aq-password-container .tips span i {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    line-height: 14px;
    margin-right: 7px
}

.aq-password-container .tips span.success {
    color: #878b99
}

.aq-password-container .tips span.success > i:before {
    color: #00cafc
}

.aq-password-container .tips span.warning {
    color: #878b99
}

.aq-password-container .tips span.warning > i:before {
    color: #b0b3be
}

.aq-password-container .tips span.error, .aq-password-container .tips span.error > i:before {
    color: #ff5975
}

.aq-password-container .tips span > i:before {
    font-size: 16px
}

.aq-password-container .tips span:last-child {
    margin-bottom: 0
}

.aq-password-container .operation {
    padding: 0 16px
}

.aq-password-container .operation .q-button, .aq-password-container .operation .qui-button {
    height: 45px;
    text-align: center;
    width: 100%
}

.aq-password-container .footer {
    color: #999;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    margin-top: 11px;
    padding: 0 23px
}

.aq-password-container.pc .q-input, .aq-password-container.pc .qui-input {
    background-color: #f5f6fa;
    border-radius: 12px;
    box-sizing: border-box;
    height: 44px;
    margin-bottom: 24px
}

.aq-password-container.pc .q-input:last-child, .aq-password-container.pc .qui-input:last-child {
    margin-bottom: 8px
}

.aq-password-container.pc .tips {
    margin-bottom: 50px;
    margin-left: 0
}

.aq-password-container.pc .tips span {
    margin-bottom: 8px
}

.aq-password-container.pc .tips span.success > i:before {
    color: #21d9c6
}

.aq-password-container.pc .tips span.warning, .aq-password-container.pc .tips span.warning > i:before {
    color: #b0b3bf
}

.aq-password-container.pc .operation .q-button, .aq-password-container.pc .operation .qui-button {
    background-image: -webkit-linear-gradient(326deg, #3382fd, #64c4fe);
    background-image: linear-gradient(124deg, #3382fd, #64c4fe);
    border-radius: 12px;
    font-size: 20px;
    height: 55px
}

.aq-password-container.pc .operation .q-button:disabled, .aq-password-container.pc .operation .qui-button:disabled {
    opacity: .5
}

@-webkit-keyframes fadeIn {
    0% {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

@-webkit-keyframes fadeOut {
    0% {
        opacity: 1
    }

    to {
        opacity: 0
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1
    }

    to {
        opacity: 0
    }
}

@-webkit-keyframes fadeZoomIn {
    0% {
        opacity: 0;
        -webkit-transform: translate(-50%, -50%) scale(.8);
        transform: translate(-50%, -50%) scale(.8)
    }

    to {
        opacity: 1;
        -webkit-transform: translate(-50%, -50%) scale(1);
        transform: translate(-50%, -50%) scale(1)
    }
}

@keyframes fadeZoomIn {
    0% {
        opacity: 0;
        -webkit-transform: translate(-50%, -50%) scale(.8);
        transform: translate(-50%, -50%) scale(.8)
    }

    to {
        opacity: 1;
        -webkit-transform: translate(-50%, -50%) scale(1);
        transform: translate(-50%, -50%) scale(1)
    }
}

@-webkit-keyframes fadeZoomOut {
    0% {
        opacity: 1;
        -webkit-transform: translate(-50%, -50%) scale(1);
        transform: translate(-50%, -50%) scale(1)
    }

    to {
        opacity: 0;
        -webkit-transform: translate(-50%, -50%) scale(.8);
        transform: translate(-50%, -50%) scale(.8)
    }
}

@keyframes fadeZoomOut {
    0% {
        opacity: 1;
        -webkit-transform: translate(-50%, -50%) scale(1);
        transform: translate(-50%, -50%) scale(1)
    }

    to {
        opacity: 0;
        -webkit-transform: translate(-50%, -50%) scale(.8);
        transform: translate(-50%, -50%) scale(.8)
    }
}

@-webkit-keyframes slideTopIn {
    0% {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@keyframes slideTopIn {
    0% {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@-webkit-keyframes slideTopOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0)
    }
}

@keyframes slideTopOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0)
    }
}

@-webkit-keyframes slideBottomIn {
    0% {
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@keyframes slideBottomIn {
    0% {
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@-webkit-keyframes slideBottomOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0)
    }
}

@keyframes slideBottomOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0)
    }
}

@-webkit-keyframes slideRightIn {
    0% {
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@keyframes slideRightIn {
    0% {
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@-webkit-keyframes slideRightOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0)
    }
}

@keyframes slideRightOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0)
    }
}

@-webkit-keyframes slideLeftIn {
    0% {
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-100%, 0, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@keyframes slideLeftIn {
    0% {
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-100%, 0, 0)
    }

    to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }
}

@-webkit-keyframes slideLeftOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-100%, 0, 0)
    }
}

@keyframes slideLeftOut {
    0% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    to {
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-100%, 0, 0)
    }
}

.primary-bg-color {
    background-color: #00cafc
}

.warning-bg-color {
    background-color: #ff596a
}

.success-bg-color {
    background-color: #67c23a
}

.gray-bg-color {
    background-color: #ebedf5
}

.white-bg-color {
    background-color: #fff
}

.link-bg-color {
    background-color: #4d94ff
}

.text-bg-color {
    background-color: #03081a
}

.fade-enter-active {
    -webkit-animation: fadeIn .3s;
    animation: fadeIn .3s
}

.fade-leave-active {
    -webkit-animation: fadeOut .3s;
    animation: fadeOut .3s
}

.fade-zoom-enter-active {
    -webkit-animation: fadeZoomIn .35s;
    animation: fadeZoomIn .35s
}

.fade-zoom-leave-active {
    -webkit-animation: fadeZoomOut .35s;
    animation: fadeZoomOut .35s
}

.slide-top-enter-active {
    -webkit-animation: slideTopIn .3s;
    animation: slideTopIn .3s
}

.slide-top-leave-active {
    -webkit-animation: slideTopOut .3s;
    animation: slideTopOut .3s
}

.slide-right-enter-active {
    -webkit-animation: slideRightIn .3s;
    animation: slideRightIn .3s
}

.slide-right-leave-active {
    -webkit-animation: slideRightOut .3s;
    animation: slideRightOut .3s
}

.slide-bottom-enter-active {
    -webkit-animation: slideBottomIn .3s;
    animation: slideBottomIn .3s
}

.slide-bottom-leave-active {
    -webkit-animation: slideBottomOut .3s;
    animation: slideBottomOut .3s
}

.slide-left-enter-active {
    -webkit-animation: slideLeftIn .3s;
    animation: slideLeftIn .3s
}

.slide-left-leave-active {
    -webkit-animation: slideLeftOut .3s;
    animation: slideLeftOut .3s
}

.qui-overflow-hidden {
    overflow: hidden
}

.qui-popup__mask {
    background-color: rgba(0, 0, 0, .5);
    bottom: 0;
    height: 100%;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000
}

.qui-popup__mask-content {
    left: 0;
    top: 0
}

.qui-popup__content, .qui-popup__mask-content {
    position: fixed;
    z-index: 1001
}

.qui-popup__content_top {
    left: 0;
    right: 0;
    top: 0
}

.qui-popup__content_right {
    bottom: 0;
    right: 0;
    top: 0
}

.qui-popup__content_bottom {
    bottom: 0;
    left: 0;
    right: 0
}

.qui-popup__content_left {
    bottom: 0;
    left: 0;
    top: 0
}

.qui-popup__content_center {
    left: 50%;
    position: fixed;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%)
}

.fade-enter-active, .fade-leave-active, .fade-zoom-enter-active, .fade-zoom-leave-active, .slide-bottom-enter-active, .slide-bottom-leave-active, .slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active, .slide-top-enter-active, .slide-top-leave-active {
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

.qui-picker-box {
    background-color: #f5f6fa;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    overflow: hidden;
    position: relative;
    z-index: 10001
}

.qui-picker__header {
    -webkit-box-pack: justify;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    border-bottom: 1px solid #ebedf5;
    display: -webkit-flex;
    display: -webkit-box;
    display: flex;
    height: 56px;
    -webkit-justify-content: space-between;
    justify-content: space-between
}

.qui-picker__btn {
    -webkit-appearance: none;
    appearance: none;
    color: #4d94ff;
    font-size: 17px;
    padding: 12px 16px
}

.qui-picker__content {
    display: -webkit-flex;
    display: -webkit-box;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    overflow: hidden;
    position: relative
}

.qui-picker__indicator {
    background-color: #fff;
    height: 45px;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 100%
}

.qui-picker-list {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    overflow: hidden;
    text-align: center
}

.qui-picker-column__item {
    font-size: 16px;
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap
}

.aq-area-code {
    position: relative;
    z-index: 99
}

.aq-area-code .btn {
    color: #4d94ff;
    font-size: 17px;
    letter-spacing: 0;
    line-height: 20px
}

.aq-area-code .area-code__list {
    background: #f5f6fa;
    border-radius: 12px;
    box-shadow: 0 6px 16px 0 rgba(19, 46, 78, .16);
    box-sizing: border-box;
    height: 127px;
    margin-top: 12px;
    opacity: .98;
    overflow: hidden;
    position: absolute;
    width: auto
}

.aq-area-code .area-code__list-wrap {
    height: 100%;
    overflow: scroll;
    padding: 3.8px 0
}

.aq-area-code .area-code__list-wrap::-webkit-scrollbar {
    width: 0
}

.aq-area-code .area-code__list-item {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    color: #000;
    cursor: pointer;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    line-height: 20px;
    padding: 5px
}

.aq-area-code .area-code__list-item span {
    display: block
}

.aq-area-code .area-code__list-item .id {
    margin-right: 10px;
    padding-left: 10px;
    text-align: right;
    width: 42.2px
}

.aq-area-code .area-code__list-item:hover {
    background: #e2e3e7
}

.aq-check-loading {
    background: #f5f6fa;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0
}

.aq-check-loading .inspect-content {
    position: absolute;
    top: 25%;
    width: 100%
}

.aq-check-loading .inspect-content .icon {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 50px;
    display: block;
    height: 100px;
    position: relative;
    z-index: 99
}

.aq-check-loading .inspect-content .icon.loading {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/safe-inspect.dc236a2c-66747.png)
}

.aq-check-loading .inspect-content .icon.success {
    -webkit-animation: logo-in .25s 1;
    animation: logo-in .25s 1;
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/success.a8aed900-8b3f0.svg);
    background-size: 60px
}

.aq-check-loading .inspect-content .icon.error {
    -webkit-animation: logo-in .25s 1;
    animation: logo-in .25s 1;
    background-image: url(data:image/png;base64,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);
    background-size: 60px
}

.aq-check-loading .inspect-content .result__title {
    color: #000;
    font-size: 16px;
    line-height: 20px;
    margin: 18px 0 7px 16px;
    text-align: center
}

.aq-check-loading .inspect-content .result__desc {
    box-sizing: border-box;
    color: #878b99;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 28px;
    padding: 0 40px;
    text-align: center;
    width: 100%
}

.aq-check-loading .inspect-content .result__desc .desc-item:last-child {
    margin-left: 14px
}

.aq-check-loading .page-back {
    -webkit-box-align: center;
    -webkit-box-pack: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 100px;
    -webkit-justify-content: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    z-index: 1
}

.aq-check-loading .page-back .back-icon {
    background-size: contain;
    height: 80px;
    width: 80px
}

.aq-check-loading .page-back .loading {
    -webkit-animation: back-loading 1.2s infinite;
    animation: back-loading 1.2s infinite;
    background: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/back.e8846354-c3fc2.png) no-repeat;
    background-size: contain;
    height: 80px;
    width: 80px
}

.aq-check-loading .page-back .success {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/back-success.b9f38ed5-723f7.png);
    background-size: contain;
    height: 80px;
    width: 80px
}

.aq-check-loading .page-back .error {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
    background-size: contain;
    height: 80px;
    width: 80px
}

@-webkit-keyframes back-loading {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    30% {
        -webkit-transform: scale(1.11);
        transform: scale(1.11)
    }

    to {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@keyframes back-loading {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    30% {
        -webkit-transform: scale(1.11);
        transform: scale(1.11)
    }

    to {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@-webkit-keyframes logo-in {
    0% {
        opacity: .2;
        -webkit-transform: scale(.3);
        transform: scale(.3)
    }

    70% {
        opacity: .7;
        -webkit-transform: scale(1.11);
        transform: scale(1.11)
    }

    to {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@keyframes logo-in {
    0% {
        opacity: .2;
        -webkit-transform: scale(.3);
        transform: scale(.3)
    }

    70% {
        opacity: .7;
        -webkit-transform: scale(1.11);
        transform: scale(1.11)
    }

    to {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

.aq-app-topbar .aq-app-topbar__inner {
    overflow: hidden
}

.aq-app-topbar .clearfix:after {
    clear: both;
    content: "";
    display: block
}

.aq-app-topbar-logo {
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer
}

@media screen and (min-width: 751px) {
    .aq-app-topbar {
        background-color: #3480fd;
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        background-image: -webkit-radial-gradient(50% -200px, circle, #b0e0ff 0, #18a7fd 45%, #3480fd 100%);
        background-image: radial-gradient(circle at 50% -200px, #b0e0ff 0, #18a7fd 45%, #3480fd 100%);
        height: 32px;
        overflow: hidden;
        padding: 12px 0;
        position: relative
    }

    .aq-app-topbar__inner {
        overflow: hidden;
        width: auto
    }

    .aq-app-topbar__inner:after {
        clear: both;
        content: "";
        display: block
    }

    .app-home .aq-app-topbar {
        background: transparent;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 99
    }

    .aq-app-topbar-logo {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        float: left;
        height: 35px;
        margin: -2px 0 0 32px;
        width: 148px
    }

    .aq-app-topbar-menu {
        float: right;
        margin-right: 40px
    }

    .aq-app-topbar-menu:after {
        clear: both;
        content: "";
        display: block
    }

    .aq-app-topbar-menu__item {
        color: #fff;
        float: left;
        font-size: 14px;
        font-weight: 500;
        line-height: 33px
    }

    .aq-app-topbar-menu__split {
        background-color: #fff;
        float: left;
        height: 14px;
        line-height: 33px;
        margin: 9.5px 24px 0;
        width: 1px
    }

    .aq-app-topbar .topbar-user {
        float: left;
        margin-right: 48px
    }
}

@media screen and (max-width: 750px) {
    .aq-app-topbar {
        background-color: #fff;
        position: relative
    }

    .aq-app-topbar:after {
        border-bottom: 1px solid #e7e7e7;
        bottom: 0;
        content: "";
        height: 0;
        left: 0;
        position: absolute;
        right: 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5)
    }

    .aq-app-topbar__inner {
        -webkit-box-align: center;
        -webkit-box-pack: justify;
        -webkit-align-items: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        height: 32px;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        padding: 0 14px 0 9px
    }

    .aq-app-topbar-logo {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
        height: 20px;
        width: 79px
    }

    .aq-app-topbar-menu {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex
    }

    .aq-app-topbar-menu__item {
        color: #4d94ff;
        font-size: 11px;
        margin-left: 13px
    }
}

.aq-footer {
    color: #909090;
    left: 0;
    right: 0;
    text-align: center
}

@media screen and (min-width: 751px) {
    .aq-footer {
        font-size: 12px;
        padding: 30px 0
    }

    .aq-footer__menu {
        margin-bottom: 3px
    }

    .aq-footer__menu a {
        color: #909090;
        margin: 0 15px
    }

    .aq-footer__menu a:hover {
        text-decoration: underline
    }
}

@media screen and (max-width: 750px) {
    .aq-footer {
        font-size: 9px;
        padding: 15px
    }

    .aq-footer__menu {
        display: none
    }
}

.phone-info {
    -webkit-box-align: center;
    -webkit-box-pack: center;
    -webkit-align-items: center;
    align-items: center;
    color: #03081a;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 25px;
    -webkit-justify-content: center;
    justify-content: center;
    position: relative
}

.phone-info .hidden-input {
    height: 40px;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0
}

.phone-info .q-input, .phone-info .qui-input {
    border: 1px solid #c5c8d3;
    border-radius: 2px;
    height: 40px;
    padding: 0;
    width: 30px
}

.phone-info .q-input.active, .phone-info .qui-input.active {
    border-color: #00cafc
}

.phone-info .q-input .q-input__wrap, .phone-info .q-input .qui-input__wrap, .phone-info .qui-input .q-input__wrap, .phone-info .qui-input .qui-input__wrap {
    padding: 0
}

.phone-info .q-input input, .phone-info .qui-input input {
    font-size: 25px;
    text-align: center
}

.phone-info span:not(:last-child) {
    margin-right: 8px
}

.account-info {
    background: #fff;
    height: 100%
}

.account-info__input {
    padding: 0 27px
}

.account-info__title {
    color: #03081a;
    font-size: 36px;
    line-height: 40px;
    padding: 26px 0 36px
}

.account-info .qui-input {
    border-bottom: .5px solid #dedfe0
}

.account-info .qui-input .qui-input__label {
    height: 20px;
    line-height: 20px;
    margin: 0 20px 0 0
}

.account-info .qui-input .qui-input__wrap {
    height: 20px;
    line-height: 20px;
    padding: 0
}

.account-info .qui-input .qui-input__wrap input {
    font-size: 17px
}

.account-info .qui-input .qui-input_clear i {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
    color: transparent !important;
    height: 16px;
    width: 16px
}

.account-info .q-input {
    border-bottom: .5px solid #dedfe0
}

.account-info .q-input .q-input__label {
    height: 20px;
    line-height: 20px;
    margin: 0 20px 0 0
}

.account-info .q-input .q-input__wrap {
    height: 20px;
    line-height: 20px;
    padding: 0
}

.account-info .q-input .q-input__wrap input {
    font-size: 17px
}

.account-info .q-input .q-input_clear i {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
    color: transparent !important;
    height: 16px;
    width: 16px
}

.account-info__confirm {
    margin-top: 37px;
    padding: 0 16px
}

.aq-authentication {
    box-sizing: border-box;
    padding: 0 14px;
    position: relative
}

.aq-authentication .q-cell__hd-icon {
    background: #f5f5fc;
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 24px auto;
    border-radius: 4px;
    height: 37px;
    margin-right: 12px;
    width: 37px
}

.aq-authentication .face {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAOKADAAQAAAABAAAAOAAAAAANV2hTAAAFaklEQVRoBe1aT2gdRRifb/clFdrLq5dWPVQE48XQQrStItJDkb5YVNQoShNTm6Q3wYMn8eTFk+ApfzT/EMG0Sg/NK+IhFpEGeijYi7lYkVi9tLWKFpq3O/6+3WzevH07u7OzL1HDLixv9pvv32/mm5lvZp4Q5VO2QNkCZQuULWDfAqQTnZyrH5OenJRCPqDjaafTwumT/a+0080p49OLnwshB0wlSNAquTQ6OlS7kCTjJBGZlh9cIGXsmM5uHnCBRXQA+6rTpweYq+d06reGnhZlWoA2rhGRtJHbTJlKHuWI95s6fklSYkCf0dWb0mHjU0HpY1BK0W2qzxgg987YcP+9popt+cZO9p+ALL/aZ2Jm8Y6U8h4tg1LR0RBV9P5nitseoHGI2nTJx3P1Aw1PPE9CPiVI3I+wuo/1INyvCyl+kYK+rbji3Kmh2hUb/SYymwJwaq7+kufJ9xue38NOBFOrMr8C6MMg45VH0ADvYXFfcV16d2SodtbE6Tw8HQU4Nf/Vg57X+Mzz/EN5nADQHjTImfGZxWXXrbw2MvjMtXzyeu6OjcHJ+frTnrd2WUiZE5ziHGRZB+tSqIWKxgARVkqQtdpkh2RDfo1YLL6MQAfrSgOJzEXrS6tnQqQApAWVmUi0fEd1HJa+538Bo10Rregv62KdrDtRl6RYQtHqqyqj3U2oTGlljJtLalhC4SXRuycMse9/u4imPqyTD1I7t3vf2ODRnydm6+9I3/+ghZdo+fRwv1a+hVfzkdKDGgmFzLOlCi6oIrE61te3xi+WhlWFPaEofQYXVEj/WhsDxmRgo63CnFAIIC8F5qbsOIvasAbIizhP73Zu55GSPaGtPDJNXmuAnKE01TRLyE42Mn213ORoljAX0tLSUrAWEzkbck2OsKSzFedL+rZe6Dn9SpqrQT+GieccG+NyEo/iiLPy09/fTMycv+6nrJ9BqqcI5SlaA+TcMszBWs2hV9AT8jmmZoALBaV8MuRL4WZblo91iGLdDxLnNLtYBq5iA/uhjgd1H6GfV3T1Ed3EVsQb/7UGGFcU/3aIxqs79/VhA/u264hTAHN7g4foD4ecN1H31u5d1QPYXsxu1CUUsLamdG+CgEKyBhhseRRF8SI8OvTnjls7mD7yxrOfVHdV9zrkPl5xKwd376zuGR2uTXPd3bu/d2GM9XJZ+xD9qq3LqLAfg9jPQTe2PMkPwmp/4+bt73C88DqOOq4ODDxxB5yXVe6puQu9f635cxi3+1V6Wzm01UY2IVgD5M0qIudImhGAfBQ57BWArCPMvvRJ/OhKF3i8h1D3ArZVNejI9CG0lWZJX5epXCfKO3HerOrqIzrQuABxHCF7nEeSJxpRFX7NhhbbUoRyFdGw9g924j/AyU3OZmgF1wGP2HppPcmwQT5msDVsKlfURqEeZCfj2yVTx434OrBd0o7B+C0PnzivH8q2+MZnKOFRRQd286pmEjdYt0qKykjtZjG2h6JvJAvaW62UEI0dn2uO0/mAyHGdF9EAa02DxUqsi3XqDp8wNcVusWK+KuZTACpcGcXRwdpFqtBR5Kc3Mlizq6GDdbHObOZsjo4AZDPskOt2PYa0aznbrIYDsqyjU+DYinYMalxIJa+H1OHo4Nd8CaH/x8FvhH79hPrstj26j4Cu3zls2r1DZCftt2NjMM3Iv1m37QEaTzJYWLvHp89rs+PgEFeIBWyNXi3SY9h5zEP+ZdjTZ1lSBvtMEzsd60Fsf3BLLwv9R4Ydho4TeHE9zSB0rwm0kKdjAM1Nbi2nFiDSpdWtdcXeWpqveoD4e1SaYLI7+lueZP4kaj4d7CP/lStJU0krW6BsgbIFyhYo2gL/AHDl6k/sCqpQAAAAAElFTkSuQmCC)
}

.aq-authentication .account {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.aq-authentication .scan {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.aq-authentication .sms {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
}

.aq-authentication .q-cells__title {
    color: #878b99;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 9px;
    margin-left: 4px
}

.aq-authentication .q-cells {
    letter-spacing: 0;
    padding: 12px
}

.aq-authentication .q-cells.sub {
    padding-top: 0
}

.aq-authentication .q-cell {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .06);
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-bottom: 12px;
    min-height: 72px;
    padding: 22px 12px;
    position: relative
}

.aq-authentication .q-cell_access {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
}

.aq-authentication .q-cell_access.disabled {
    opacity: .3
}

.aq-authentication .q-cell:before {
    border-top: 1px solid #f7f7f9;
    content: " ";
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    z-index: 2
}

.aq-authentication .q-cell:first-child:before {
    display: none
}

.aq-authentication .q-cell__hd .q-cell__icon-img, .aq-authentication .q-cell__hd-icon {
    display: block
}

.aq-authentication .q-cell__bd {
    -webkit-box-flex: 1;
    box-sizing: border-box;
    -webkit-flex: 1;
    flex: 1;
    height: 44px;
    min-width: 0
}

.aq-authentication .q-cell__main {
    box-sizing: border-box;
    color: #03081a;
    font-size: 17px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%
}

.aq-authentication .q-cell__sub {
    box-sizing: border-box;
    color: #878b99;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    margin-top: 4px
}

.aq-authentication .q-cell_access .q-cell__ft {
    padding-right: 22px;
    position: relative
}

.aq-authentication .q-cell_access .q-cell__ft:after {
    background-color: currentColor;
    color: #b0b3bf;
    content: " ";
    height: 12px;
    margin-top: -6px;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE0IDBIMHYyNGgxNHoiLz48cGF0aCBkPSJtLjcyOSAxLjQxMi43NDItLjcyNmExIDEgMCAwIDEgMS40IDBsMTAuNCAxMC4xOWExIDEgMCAwIDEgMCAxLjQyOEwzLjA1NCAyMi4zMTRhMSAxIDAgMCAxLTEuNCAwbC0uNzQtLjcyNmExIDEgMCAwIDEgMC0xLjQyOWw4Ljc0NS04LjU2OUwuNzMgMi44NGExIDEgMCAwIDEgMC0xLjQyOHoiIGZpbGw9IiNCMEIzQkYiLz48L2c+PC9zdmc+);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE0IDBIMHYyNGgxNHoiLz48cGF0aCBkPSJtLjcyOSAxLjQxMi43NDItLjcyNmExIDEgMCAwIDEgMS40IDBsMTAuNCAxMC4xOWExIDEgMCAwIDEgMCAxLjQyOEwzLjA1NCAyMi4zMTRhMSAxIDAgMCAxLTEuNCAwbC0uNzQtLjcyNmExIDEgMCAwIDEgMC0xLjQyOWw4Ljc0NS04LjU2OUwuNzMgMi44NGExIDEgMCAwIDEgMC0xLjQyOHoiIGZpbGw9IiNCMEIzQkYiLz48L2c+PC9zdmc+);
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100%;
    mask-size: 100%;
    position: absolute;
    right: 0;
    top: 50%;
    width: 7px
}

.aq-authentication-item {
    box-sizing: border-box;
    padding: 0 16px;
    position: relative
}

.aq-authentication-item .q-cell__hd-icon {
    background: transparent;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 24px auto;
    display: block;
    height: 36px;
    margin-right: 12px;
    width: 36px
}

.aq-authentication-item .default {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAOKADAAQAAAABAAAAOAAAAAANV2hTAAAEVUlEQVRoBe1ZS2gTQRie2cREbD0oCj5OngRfiFjQk+IrTdpSFI0HNZqipnjQiyKiBy8qePB10D608YVCFEUwqzdRBBU8FV+nWh/4RKuSFmmT/f2nMTam6e4/O7uUll0om+183z//98/rnxnGvMeLgBcBLwJeBOxHgNun5pmp1L3KHz09IQC2kgGbD5zN4ACVwHiAM/iC3+854/dB0242bg4/Uq1Plm9LYPOlu1NZLluHouoZ8OWMQZBSMQp9wvza7kQs/JCCdwJDFnju0p2Z2T4jwThbAQBzVSpHoUe3xyP7OOeGih0KlyywKZl+xAAWUYxSMCjuxoSKSDQa5TkK3i5GoxI5sJdULAWHvWBNV7d+hIJVwZAFIvCWSkXluChyT2syvbJcmVP/IwsM+MY+darSYjs4CA8Vfzv9mywwFlv2ASeHPqcdwFasarmoL3HabsEeWSBOCoDLwe8C0ck35KDaSXvFtsgC+0mcy+GLazL7DTD8LSj8AwauCMRsZ5KZfpUySYedH4N55/l4FRFmXCmBmGNmzIwplLkytoU/UgIxTetSEDEkFZPyb0MWKhbICWTupFU4PbuWrpFyUV3Xg+8+wzVcs+oUA2pGv8nnTVmfWLjQ0bWW1IJvv/IFLosTwlf7nn+ZYxYBO2UkgUGDfbRjXJaT07RPshwrPElgPB7uxDTtu5UxlXLMlD4mNlU7HkiSwLzjcF1FgCUX2DVLjA0AXSAfcxztu7QD59kxQThpw39LCllgIh56hZnoaUuLdgAaP9GwobbDDtWKQxYoDFX4tf04Ft9bGZUp55y9Hqf5DspwZLBSAjdujPzC5OeATAVWWABtXywW6rbC2S33SxPnTb7C2z8dxuxjmjS3hIC94c2EyvC/yaspeTuNW5ZICYz+yZneGK+tKSZItaAg5jMNzanDoiP/naqpiBPOleFLCxR2MOpnMPpqZzScP8az0VZhz83HlkAR9QDX1mEi+9mOc2JRD4A/im+Xlp0Br+TH4F+uyG5aL9xZZeSMe7jTnzhg0vyXyIh8Pv+qhljonTmSscaGWsvNQFPbbZwOhn5stWDB3LbN4Xa8a6gvfFPeeOixemss9IyCdQKjJFA4kL9I4S8ozmCXbG/cUvOAgnUKoyxQOIInitQk+YNTjlPt2B6DhQpwn6i1nE9PKXxbvKm4fjNW48uirv5ipRZsS+mTm5P6VbwnnE2pDIMxHxfzy4JHwTuBsSWw7bI+qyWpn+rLGJ24ukalHAG2oTdjdDS3pV3ZPZT6Qu6iZ1N3J+Z6jPXMMDb19hqLSw1JfuMVN+xEzi5JnjTcVGAqBb6fGb3W4GxLrjsbwa4YkK5hmAllBQph37vTO/BvL/o3HXO8EfuUFdiV0Y+hItGFRvwzaJIRYw0bLDHilf0VMKgFcz3ZtVgWHC0CB7UgGHzpaBEndAwSiBchVaNaIN4gDd9SgEcOKsHFZD6twve4XgS8CHgR8CJQGoE/lbwvNpRUM4kAAAAASUVORK5CYII=)
}

.aq-authentication-item .q-cell {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    min-height: 72px;
    padding: 12px 16px;
    position: relative
}

.aq-authentication-item .q-cell:active {
    background: #f9f9f9
}

.aq-authentication-item .q-cell_access {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
}

.aq-authentication-item .q-cell_access.disabled {
    opacity: .3
}

.aq-authentication-item .q-cell:before {
    border-top: 1px solid #f7f7f9;
    content: " ";
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    z-index: 2
}

.aq-authentication-item .q-cell:first-child:before {
    display: none
}

.aq-authentication-item .q-cell__bd {
    -webkit-box-flex: 1;
    box-sizing: border-box;
    -webkit-flex: 1;
    flex: 1;
    height: 48px;
    min-width: 0
}

.aq-authentication-item .q-cell__main {
    box-sizing: border-box;
    color: #000;
    font-size: 17px;
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%
}

.aq-authentication-item .q-cell__sub {
    box-sizing: border-box;
    color: #999;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    margin-top: 4px
}

.aq-authentication-item .q-cell_access .q-cell__ft {
    padding-right: 22px;
    position: relative
}

.aq-authentication-item .q-cell_access .q-cell__ft:after {
    background-color: currentColor;
    color: #999;
    content: " ";
    height: 11px;
    margin-top: -6px;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE0IDBIMHYyNGgxNHoiLz48cGF0aCBkPSJtLjcyOSAxLjQxMi43NDItLjcyNmExIDEgMCAwIDEgMS40IDBsMTAuNCAxMC4xOWExIDEgMCAwIDEgMCAxLjQyOEwzLjA1NCAyMi4zMTRhMSAxIDAgMCAxLTEuNCAwbC0uNzQtLjcyNmExIDEgMCAwIDEgMC0xLjQyOWw4Ljc0NS04LjU2OUwuNzMgMi44NGExIDEgMCAwIDEgMC0xLjQyOHoiIGZpbGw9IiNCMEIzQkYiLz48L2c+PC9zdmc+);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE0IDBIMHYyNGgxNHoiLz48cGF0aCBkPSJtLjcyOSAxLjQxMi43NDItLjcyNmExIDEgMCAwIDEgMS40IDBsMTAuNCAxMC4xOWExIDEgMCAwIDEgMCAxLjQyOEwzLjA1NCAyMi4zMTRhMSAxIDAgMCAxLTEuNCAwbC0uNzQtLjcyNmExIDEgMCAwIDEgMC0xLjQyOWw4Ljc0NS04LjU2OUwuNzMgMi44NGExIDEgMCAwIDEgMC0xLjQyOHoiIGZpbGw9IiNCMEIzQkYiLz48L2c+PC9zdmc+);
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100%;
    mask-size: 100%;
    position: absolute;
    right: 0;
    top: 50%;
    width: 6.5px
}

.countdown {
    color: #878b99;
    font-size: 14px;
    letter-spacing: 0;
    margin: 0;
    padding: 0
}

.countdown-start {
    color: #4d94ff;
    cursor: pointer
}

.countdown-counting, .countdown-disabled {
    color: #878b99;
    cursor: default
}

.aq-sms__inner {
    padding: 0 16px
}

.aq-sms__hd {
    padding: 24px 0
}

.aq-sms__text-title {
    color: #222;
    display: block;
    font-size: 41px
}

.aq-sms__text-description {
    color: #999;
    display: block;
    font-size: 14px
}

.aq-sms__text-highlight {
    color: #ff8343
}

.aq-sms__bd {
    padding-bottom: 43px
}

.aq-sms__card-list {
    background-color: #fff;
    border-radius: 8px
}

.aq-sms__item {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    padding: 18px 16px;
    position: relative;
    z-index: 1
}

.aq-sms__item:after {
    background-color: #e5e5e5;
    bottom: 0;
    content: "";
    height: 1px;
    left: 16px;
    position: absolute;
    right: 16px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5)
}

.aq-sms__item:last-of-type:after {
    display: none
}

.aq-sms__item-bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1
}

.aq-sms__text-content, .aq-sms__text-label {
    color: #000;
    display: block;
    font-size: 17px
}

.aq-sms__btn-copy {
    color: #2d77e5;
    display: block;
    font-size: 17px
}

.aq-sms__ft {
    padding: 0 25px
}

.aq-sms__text-tips {
    color: #ff5765;
    display: block;
    font-size: 14px;
    padding-top: 12px;
    text-align: center
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

.hybrid {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
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

#app {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    min-height: 100%
}

.app-container {
    position: relative
}

.app-container, .verify-container {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    z-index: 1
}

.verify-container {
    margin-top: 58px
}

.panel-wrap {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10
}

.panel-wrap__iframe {
    display: block;
    height: 100%;
    width: 100%
}

.clearfix:after {
    clear: both;
    content: "";
    display: block
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

    .ui-cell__ft-unlogin:after {
        background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg)
    }

    .ui-cell__ft .btn-link {
        display: none
    }

    .ui-cell__ft .btn-link__show-text {
        display: inline-block
    }

    .ui-cell__ft .btn-link__show-text:after {
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
    .function_float-right {
        float: right
    }

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

    .function_item-content-descript {
        color: #999;
        font-size: 12.6px;
        line-height: 15px
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

.login-container {
    background-color: rgba(0, 0, 0, .5);
    bottom: 0;
    height: 100%;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 100
}

.login-container .login-iframe {
    left: 50%;
    position: absolute;
    top: 50%
}

.login-container .close-btn {
    background-image: url(https://security-web.cdn-go.cn/security-web/7b1a0436/home/page/index/assets/images/arrow-right-ad5cf.svg);
    background-size: cover;
    cursor: pointer;
    height: 16px;
    position: absolute;
    right: 10px;
    top: 10px;
    width: 16px
}

.login-container iframe {
    height: 100%;
    width: 100%
}

</style>