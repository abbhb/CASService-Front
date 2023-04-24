<template>
    <div class="login" id="login-app">
        <div class="login-box">
            <div class="gQMFXb imn">
                <div class="sc-hLBbgP ipKqCS">
                    <div class="sc-hLBbgP bVBmg promoContainer">
                        <div class="sc-hLBbgP bVBmg promoHeader">CAS 认证服务</div>
                        <div class="sc-hLBbgP bVBmg promoInfo">一处登录 处处登录.</div>
                        <div class="sc-hLBbgP bVBmg promoInfo">节省时间 方便管理.</div>
                        <div class="sc-hLBbgP bVBmg promoInfo">created by QC(1057117849@qq.com).</div>
                        <div class="sc-hLBbgP bVBmg promoInfo">At 2023-04-24 19:33:39.</div>
                    </div>
                </div>
                <div class="sc-hLBbgP bVBmg videoContainer">
                    <video autoplay playsinline loop disablepictureinpicture
                           poster="@/assets/static/media/loginAnimationPoster.9aa924bfe619e71d5d29.png" class="videoBG">
                        <source src="@/assets/static/media/videoBG.17363418b3c2246a0e27.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
            <div class="waiqian bWXzON">
                <div class="sc-hLBbgP bWXzON logoContainer">
                    <!--            <img width="70%" src="@/assets/static/media/AILOGO2.png">-->
                    <span style="color: #000000;font-size: 48px;font-weight: 900;">CAS 认证服务</span>
                </div>
                <div>
                    <LoginComponents></LoginComponents>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import router from "@/router";
import LoginComponents from "@/components/LoginComponents.vue";

export default {
    name: "login",

    data() {
        return {}
    },
    components: {
        LoginComponents
    },
    created() {
        this.checkToken()
    },
    methods: {
        async checkToken() {
            // const res = await checkToken()
            const res = ""
            if (String(res.code) === '1') {
                console.log("验证")

                localStorage.setItem("type", res.data.permissions)
                localStorage.setItem('userInfo', JSON.stringify(res.data))
                localStorage.setItem('userId', String(res.data.id))
                const sss = JSON.parse(localStorage.getItem('myAllUser'))
                let list = []
                let par = {}
                par.id = res.data.id
                par.token = res.data.token
                list.push(par)
                if (sss) {
                    for (let i = 0; i < sss.length; i++) {
                        if (sss[i].id === res.data.id) {
                            continue;
                        }
                        let par = {}
                        par.id = sss[i].id
                        par.token = sss[i].token
                        list.push(par)
                    }
                }
                localStorage.setItem('myAllUser', JSON.stringify(list))
                // localStorage.setItem('token',res.data.token)
                router.push({name: 'dh'})

            } else {
                sessionStorage.setItem("userLastStoreId", "")
                // this.$message.error(res.msg)
                //此处就不提示token校验失败了，可能第一次本来就没有token
            }
        },

    }
}
</script>

<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #333;
}

.login-box {
    width: 100%;
    height: 100%;
    flex-flow: row nowrap;
    box-sizing: content-box;
    border-radius: 8px;
    display: flex;
}


.login-box .imn {
    position: relative;
    background-color: rgb(0, 1, 16);
}

@media (min-width: 768px) {
    .gQMFXb {
        -webkit-box-flex: 1;
        flex-grow: 1;
    }
}

@media (min-width: 520px) and (max-width: 768px) {
    .gQMFXb {
        display: none;
    }
}

@media (min-width: 576px) {
    .gQMFXb {

        -webkit-box-flex: 1;
        flex-grow: 1;
    }
}

@media (max-width: 576px) {
    .gQMFXb {
        display: none;
    }
}

.gQMFXb {
    box-sizing: border-box;
}


.ipKqCS {
    display: flex;
    flex-flow: row wrap;
    box-sizing: content-box;
}

.promoContainer {
    z-index: 100;
    width: 80%;
    max-width: 687px;
    position: absolute;
    top: 190px;
    left: 50%;
    transform: translateX(-50%);
}

.bVBmg {
    box-sizing: border-box;
}

.promoHeader {
    color: rgb(255, 255, 255);
    font-size: 46px;
    text-align: left;
    font-weight: 900;
    line-height: 60px;
}

.bVBmg {
    box-sizing: border-box;
}

.sc-hLBbgP {
    color: #FFFFFF;
}

.promoInfo {
    margin-top: 31px;
    max-width: 542px;
    color: rgb(166, 223, 239);
    font-size: 18px;
    text-align: left;
    font-weight: 300;
    line-height: 30px;
}

.bVBmg {
    box-sizing: border-box;
}

.promoInfo a {
    color: rgb(166, 223, 239);
    text-decoration: none;
    font-weight: bold;
}

.videoContainer {
    width: 100%;
    height: auto;
    min-height: 200px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    filter: none;
}

.videoBG {
    width: 100%;
}

.bVBmg {
    box-sizing: border-box;
}

video {
    object-fit: contain;
    overflow-clip-margin: content-box;
    overflow: clip;
}


.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}

@media (min-width: 0px) {
    .logins {
        -webkit-box-flex: 1;
        flex-grow: 1;
        flex-basis: 100%;
        width: 100%;
    }
}

.waiqian {
    max-width: 520px;
    height: 100%;
    background-color: rgb(255, 255, 255);
}

@media (min-width: 0px) {
    .bWXzON {
        -webkit-box-flex: 1;
        flex-grow: 1;
        flex-basis: 100%;
        width: 100%;
    }
}

.bWXzON {
    box-sizing: border-box;
}

.logoContainer {
    display: flex;
    height: 218px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    box-shadow: rgb(0 0 0 / 6%) 0px 3px 10px 2px;

}

@media (min-width: 0px) {
    .bWXzON {
        -webkit-box-flex: 1;
        flex-grow: 1;
        flex-basis: 100%;
        width: 100%;
    }
}

.bWXzON {
    box-sizing: border-box;
}

.eczWhG .formPanel .logoContainer svg {
    width: 325px;
}


</style>