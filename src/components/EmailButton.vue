<template>
        <el-button :disabled="getEmailCodeStatus" class="" size="medium" type="primary"
                   @click.native.prevent="getEmailCode">
            <span v-if="!getEmailCodeStatus">{{buttonName}}</span>
            <span v-else>{{ count }}s</span>
            <el-dialog
                title="验证码校验"
                :visible.sync="openVerify"
                width="25rem"
                :show-close="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :append-to-body="true"
                style="z-index: 2100">
                <sliderVerify v-if="sliderVerifyKey" @success="verifySuccess"/>
            </el-dialog>
        </el-button>
</template>

<script>

import SliderVerify from "@/components/sliderVerify.vue";
import {getIfNeedCaptcha} from "@/api/common";
import {getEmail} from "@/api/email";

export default {
    name: "EmailButton",
    components: {SliderVerify},
    props:{
      email:{
          default:''
      },
        buttonName:{
          default:'获取'
      },
    },
    data(){
        return{
            openVerify: false,
            getEmailCodeStatus: false,
            count: 60,//电子邮件倒计时
            timer: null,//电子邮件倒计时
            randomCode:'',
            verificationCode:'',
            sliderVerifyKey:true,
        }
    },
    watch:{
        openVerify(news,olds) {
            console.log(news)
            console.log(olds)
            if (news){
                this.sliderVerifyKey= true
            }else {
                this.sliderVerifyKey= false
            }
        }
    },
    methods:{
        verifySuccess(data) {
            let that = this
            console.log(data)
            this.randomCode = data.nonceStr
            this.verificationCode = data.value
            setTimeout(async function () {
                that.openVerify = false;
                console.log('验证码已关闭...')
                await that.TGetEmailCode()

            }, 1000);
        },
        async getEmailCode() {
            this.getEmailCodeStatus = true
            const TIME_COUNT = 60;
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count -= 1;
                    } else {
                        this.show = true;
                        clearInterval(this.timer);
                        this.getEmailCodeStatus = false
                        this.timer = null;
                    }
                }, 1000);
            }
            if (!this.email) {
                this.$message.error("请先填写email")
            }

            const rres = await getIfNeedCaptcha()
            if (String(rres.code)==='1'){
                if (rres.data===1){
                    this.openVerify = true
                }else {
                    await this.TGetEmailCode()
                }
            }else {
                this.$message.error(rres.msg)
            }

        },
        async TGetEmailCode() {
            this.$message.info("点击成功，该过程较长，请等待!")

            let data = {
                "email": this.email,
                "randomCode": this.randomCode,
                "verificationCode": this.verificationCode
            }
            const res = await getEmail(data)
            if (String(res.code) === '1') {
                this.$message.success(res.msg)
                this.$emit('successAdditionalMethod');
                this.randomCode = ''
                this.verificationCode = ''
                this.getEmailCodeStatus = true
                const TIME_COUNT = 60;
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count -= 1;
                        } else {
                            this.show = true;
                            clearInterval(this.timer);
                            this.getEmailCodeStatus = false
                            this.timer = null;
                        }
                    }, 1000);
                }

            } else {
                this.$message.error(res.msg)
                this.getEmailCodeStatus = false
            }
        },
    }

}
</script>

<style scoped>

</style>