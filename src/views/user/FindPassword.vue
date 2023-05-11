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
                        <div
                                class="btn-area__button button-color">
                            <EmailButton button-name="下一步" @successAdditionalMethod="successAdditionalMethod()" v-if="currentStep===1" :email="email"></EmailButton>
                            <el-button @click.native="NextB()" v-else type="primary">下一步</el-button>
                        </div>
                    </div>
                </div>
                <div class="container-inner" v-else-if="currentStep===2">
                    <div>
                        <div>
                            <div>验证码已经发送到邮箱
                                <span style="font-weight: 600;font-size: 15px;">{{email}}</span>
                                <span style="font-weight: 200;font-size: 8px;color: #2b8dfd" @click="gotoEamil()">去查看</span>
                            </div>
                            <EmailCode :email="email" :code.sync="code"></EmailCode>
                        </div>
                    </div>
                    <div class="btn-area">
                        <el-button @click.native="NextB()" type="primary">下一步</el-button>
                    </div>
                </div>
                <div class="container-inner" v-else-if="currentStep===3">
                    <div>
                        <div>
                            <div>请重设密码</div>
                            <el-input v-model="password" type="password" show-password placeholder="密码"
                                      prefix-icon="el-icon-lock" maxlength="20"
                            />
                            <el-input v-model="rePassword" type="password" show-password placeholder="确认密码"
                                      prefix-icon="el-icon-lock" maxlength="20"
                            />
                        </div>
                    </div>
                    <div class="btn-area">
                        <el-button @click.native="NextB()" type="primary">提交修改</el-button>
                    </div>
                </div>
                <div class="container-inner" v-else-if="currentStep===4">
                    <div>
                        <div>
                            <div>密码重设完成</div>
                        </div>
                    </div>
                    <div class="btn-area">
                        <el-button @click.native="NextB()" type="primary">返回登录</el-button>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import MainTopNav from "@/components/MainTopNav.vue";
import EmailButton from "@/components/EmailButton.vue";
import EmailCode from "@/components/EmailCode.vue";
import {findPassword} from "@/api/email";

export default {
    name: "FindPassword",
    components: {EmailCode, EmailButton, MainTopNav},
    data(){
        return{
            email:'test@163.com',
            currentStep:1,//当前处于第几步
            code:'',//验证码
            rePassword:'',//确认密码
            password:'',//密码
        }
    },
    methods:{

        gotoEamil(){
            window.open('https://mail.'+this.email.split('@')[1])
        },
        NextB(){
            console.log(this.currentStep)
            if (String(this.currentStep)==='1'){
                //调用随机验证码，成功后允许下一步
                //调用获取邮箱验证码api
                //通过组件实现
            }else if (String(this.currentStep)==='2'){
                //输入验证码阶段
                //此阶段进行一次不删除验证码校验，验证码需要留着第三步一起提交
                if (this.code===''){
                    //修改失败
                    this.$message.error("请输入验证码")
                }else {
                    this.currentStep=3
                }
            }else if (String(this.currentStep)==='3'){
                //保存密码阶段
                //此阶段进行前端密码判空
                if (this.code===''){
                    //修改失败
                    this.$message.error("失败,请刷新重试")
                }
                if (this.password===''){
                    //修改失败
                    this.$message.error("请输入密码")
                }
                if (this.rePassword===''){
                    //修改失败
                    this.$message.error("请输入确认密码")
                }
                if (this.rePassword!==this.password){
                    //修改失败
                    this.$message.error("两次密码必须一致")
                }
                //此处调用后端接口
                this.Commit()
            }else if (String(this.currentStep)==='4'){
                //返回登录
                this.$router.push({path:'/login'})
            }
        },
        successAdditionalMethod(){
            this.currentStep=2
        },
        async Commit() {
            //提交修改
            let data = {}
            data.email = this.email
            data.password = this.password
            data.rePassword = this.rePassword
            data.mailCode = this.code
            const res = await findPassword(data)
            if (String(res.code) === '1') {
                //修改成功
                this.$message.success(res.data)
                this.currentStep = 4
            } else {
                //修改失败
                this.$message.error(res.msg)
            }
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