
<template>
    <div>
        <div class="logins" v-if="!isRegistration">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
                <el-form-item prop="username">
                    <el-input
                            v-model="loginForm.username"
                            type="text"
                            auto-complete="off"
                            placeholder="账号"
                            maxlength="40"
                            prefix-icon="el-icon-user"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" show-password placeholder="密码"
                              prefix-icon="el-icon-lock" maxlength="20"
                              @keyup.enter.native="handleLogin"/>
                </el-form-item>

                <el-form-item style="width:100%;">

                    <div style="display: flex;flex-flow: column;justify-content: center;align-items: flex-end;">
                        <el-button :loading="loading" class="login-btn" size="medium" type="primary" style="width:100%;"
                                   @click.native.prevent="handleLogin">
                            <span v-if="!loading">登录</span>
                            <span v-else>登录中...</span>
                        </el-button>
                        <el-button :loading="loading" class="login-btn" size="medium" type="primary" style="width:100%;"
                                   @click.native.prevent="handleRe">
                            <span>注册</span>

                        </el-button>
                    </div>
                    <div class="goto" @click="goto('oauthen')">
                        <span>EN-oauth2.0认证(暂时J掉了)></span>
                    </div>

                </el-form-item>
            </el-form>
        </div>
        <div class="logins" v-else-if="isRegistration">
            <el-form ref="registrationForm" :model="registrationForm" :rules="registrationRules">
                <el-form-item prop="username">
                    <el-input
                            v-model="registrationForm.username"
                            type="text"
                            auto-complete="off"
                            placeholder="用户名"
                            maxlength="20"
                            prefix-icon="el-icon-user"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="registrationForm.password" type="password" show-password placeholder="密码"
                              prefix-icon="el-icon-lock" maxlength="20"
                              @keyup.enter.native="handleLogin"/>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input
                            v-model="registrationForm.name"
                            type="text"
                            auto-complete="off"
                            placeholder="昵称"
                            maxlength="20"
                            prefix-icon="el-icon-user"/>
                </el-form-item>
                <el-form-item prop="sex">
                    <el-select v-model="registrationForm.sex" placeholder="请选择用户性别">
                        <el-option
                                v-for="item in sexoptions"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item
                        prop="phone"
                >
                    <el-input
                            v-model="registrationForm.phone"
                            placeholder="请填写用户手机号"
                            maxlength="11"
                    />
                </el-form-item>
                <el-form-item
                        prop="studentId"
                >
                    <el-input
                            v-model="registrationForm.studentId"
                            placeholder="请填写用户学号"
                            maxlength="18"
                    />
                </el-form-item>


                <el-form-item style="width:100%;">

                    <div style="display: flex;flex-flow: column;justify-content: center;align-items: flex-end;">
                        <el-button :loading="loading" :disabled="loading" class="login-btn" size="medium" type="primary"
                                   style="width:100%;"
                                   @click.native.prevent="ButtonRe">
                            <span v-if="!loading">注册</span>
                            <span v-else>注册中...</span>
                        </el-button>
                        <el-button class="login-btn" size="medium" type="primary" style="width:100%;"
                                   @click.native.prevent="handleLo">
                            <span>返回登录</span>

                        </el-button>
                    </div>

                </el-form-item>
            </el-form>
        </div>
    </div>


</template>

<script>
/**
 * 登录模块
 */
import router from "@/router";
import {login, login302, loginbytgc, loginbytgc302} from "@/api/auth";

export default {
    name: "LoginComponents",
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            sexoptions: [{label: "男", value: "男"}, {label: "女", value: "女"}],
            registrationForm: {
                username: '',
                password: '',
                name: '',
                phone: '',
                studentId: '',
                sex: '',
                permission: '2',
                status: '1',//默认启用
                avatar: '',//url
            },
            loading: false,
            isRegistration: false,//默认是登录
        }
    },
    computed: {
        loginRules() {
            const validateUsername = (rule, value, callback) => {
                if (value.length < 1) {
                    callback(new Error('请输入用户名'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码必须在6位以上'))
                } else {
                    callback()
                }
            }
            return {
                'username': [{'validator': validateUsername, 'trigger': 'blur'}],
                'password': [{'validator': validatePassword, 'trigger': 'blur'}]
            }
        },
        registrationRules() {
            return {
                'name': [
                    {'required': true, 'message': '请填写用户名称', 'trigger': ['blur']}
                ],
                'username': [
                    {
                        'required': true,
                        // 'message': '请填写用户密码',
                        validator: async (rules, value, callback) => {
                            if (!value) {
                                callback(new Error('请填写用户名称'))
                            } else {
                                // let params = {"username": this.registrationForm.username}
                                const res = "await Api.hasUserName(params)"
                                if (String(res.code) === '1') {
                                    callback()
                                } else {
                                    callback(new Error(res.msg))
                                }
                            }
                        },
                        'trigger': ['change']
                    }
                ],
                'password': [
                    {
                        'required': true,
                        // 'message': '请填写用户密码',
                        validator: (rules, value, callback) => {
                            if (!value) {
                                callback(new Error('请填写用户密码'))

                            }
                            callback()
                        },
                        'trigger': ['blur']
                    },
                ],
                'phone': [
                    {
                        'required': true,
                        // 'message': '请填写用户密码',
                        validator: (rules, value, callback) => {
                            if (!value) {
                                this.$message.error("请填写用户手机号")
                                callback(new Error('请填写用户手机号'))
                            } else {
                                if (!/^1[34578]\d{9}$/.test(value)) {
                                    this.$message.error("格式错误")
                                    callback(new Error('格式错误'))
                                }
                                callback()

                            }
                        },
                        'trigger': ['blur']
                    },
                ],
                'studentId': [
                    {
                        'required': true,
                        // 'message': '请填写用户密码',
                        validator: (rules, value, callback) => {
                            if (!value) {
                                this.$message.error("请填写用户学号")
                                callback(new Error('请填写用户学号'))
                            } else {
                                if (!/^[2-2][0-0][2-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(value)) {
                                    this.$message.error("格式错误")
                                    callback(new Error('格式错误'))
                                }
                                callback()
                            }
                        },
                        'trigger': ['blur']
                    },
                ],
            }
        }
    },
    async created() {
        if (window.location.search){
            const service = window.location.search.split("?service=")[1]
            const res = await loginbytgc302(service)
            if (String(res.code) === '1') {
                //正常登录
                localStorage.setItem('userInfo', JSON.stringify(res.data))
                localStorage.setItem("permission", res.data.permission)
                localStorage.setItem('userId', String(res.data.id))
                // Cookies.set('tgc',res.data.tgc)
                router.push({name: 'userinfo'})

            } else if (String(res.code)==='302'){
                //需要重定向
                window.location.href = res.data.service + '?ticket='+res.data.st;
            }
        }else {
            const res = await loginbytgc()
            if (String(res.code) === '1') {
                //正常登录
                localStorage.setItem('userInfo', JSON.stringify(res.data))
                localStorage.setItem("permission", res.data.permission)
                localStorage.setItem('userId', String(res.data.id))
                // Cookies.set('tgc',res.data.tgc)
                router.push({name: 'userinfo'})

            } else if (String(res.code)==='302'){
                //需要重定向
                window.location.href = res.data.service + '?ticket='+res.data.st;
            }
        }

    },
    methods: {
        goto(val) {
            this.$message.info("这个服务暂时停用，努力适配中")
            console.log(val)
            return
            // if (val === 'oauthen') {
            //
            //     this.openLoading()
            //
            //     if (window.location.href.indexOf('10.15.247.254') !== -1) {
            //
            //         window.location.href = 'http://10.15.247.254/en/oauth/authorize/?client_id=WFIko9MEhg1BuOFDRlnGc4JvxEnhi48e2F9cr8Ud&response_type=code'
            //     } else if (window.location.href.indexOf('vpn') !== -1) {
            //         window.location.href = 'https://webvpn.beihua.edu.cn/http/77726476706e69737468656265737421a1a70fcd727e3a042946dbf9cc/en/oauth/authorize/?client_id=WFIko9MEhg1BuOFDRlnGc4JvxEnhi48e2F9cr8Ud&response_type=code'
            //     } else if (window.location.href.indexOf('192.168') !== -1) {
            //         window.location.href = 'http://10.15.247.254/en/oauth/authorize/?client_id=WFIko9MEhg1BuOFDRlnGc4JvxEnhi48e2F9cr8Ud&response_type=code'
            //     } else {
            //         window.location.href = 'http://10.15.247.254/en/oauth/authorize/?client_id=WFIko9MEhg1BuOFDRlnGc4JvxEnhi48e2F9cr8Ud&response_type=code'
            //     }
            //
            // }
        },
        openLoading() {
            const loading = this.$loading({
                lock: true,
                text: '请耐心等待!\n这个第三方有点慢',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            return loading;
        },
        async ButtonRe() {
            this.$refs["registrationForm"].validate(async (valid) => {  //开启校验
                if (valid) {   // 如果校验通过，请求接口，允许提交表单
                    let data = {}
                    if (!this.registrationForm.name) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!this.registrationForm.sex) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!this.registrationForm.password) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!this.registrationForm.permission) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!this.registrationForm.phone) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!this.registrationForm.status) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!this.registrationForm.username) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (this.registrationForm.username.indexOf('@') !== -1) {
                        this.$message.error("不可在用户名中包含'@'")
                        return false;
                    }
                    if (!this.registrationForm.studentId) {
                        this.$message.error("请你输入学号")
                        return false;
                    }
                    data.name = this.registrationForm.name
                    data.sex = this.registrationForm.sex
                    data.avatar = this.registrationForm.avatar
                    data.password = this.registrationForm.password
                    data.permission = this.registrationForm.permission
                    data.phone = this.registrationForm.phone
                    data.status = this.registrationForm.status
                    data.username = this.registrationForm.username
                    data.studentId = this.registrationForm.studentId
                    const res = "await Api.createUser(data)"
                    if (String(res.code) === '1') {
                        this.$message.success(res.msg)
                        this.handleLo()
                    } else {
                        this.$message.error(res.msg)
                    }
                    console.log(res)
                } else {   //校验不通过
                    return false;
                }
            });
        },
        cancelForm() {
            this.registrationForm.sex = ''
            this.registrationForm.password = ''
            this.registrationForm.name = ''
            this.registrationForm.avatar = ''
            this.registrationForm.studentId = ''
            this.registrationForm.phone = ''
            this.registrationForm.username = ''
            this.loginForm.password = ''
            this.loginForm.username = ''
        },
        handleRe() {
            this.isRegistration = true;
        },
        handleLo() {
            this.isRegistration = false;
            this.cancelForm()
        },
        async handleLogin() {
            //登录
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true
                    let data = {}
                    data.username = this.loginForm.username
                    data.password = this.loginForm.password

                    if (window.location.search) {
                        const service = window.location.search.split("?service=")[1]
                        const res = await login302(data,service)
                        if (String(res.code) === '1') {
                            //正常登录
                            localStorage.setItem('userInfo', JSON.stringify(res.data))
                            localStorage.setItem("permission", res.data.permission)
                            localStorage.setItem('userId', String(res.data.id))
                            // Cookies.set('tgc',res.data.tgc)
                            router.push({name: 'userinfo'})

                        } else if (String(res.code)==='302'){
                            //需要重定向
                            window.location.href = res.data.service + '?ticket='+res.data.st;
                        }
                        else {
                            this.$message.error(res.msg)
                            this.loading = false
                        }
                    }else {
                        const res = await login(data)
                        if (String(res.code) === '1') {
                            //正常登录
                            localStorage.setItem('userInfo', JSON.stringify(res.data))
                            localStorage.setItem("permission", res.data.permission)
                            localStorage.setItem('userId', String(res.data.id))
                            // Cookies.set('tgc',res.data.tgc)
                            router.push({name: 'userinfo'})

                        } else if (String(res.code)==='302'){
                            //需要重定向
                            window.location.href = res.data.service + '?ticket='+res.data.st;
                        }
                        else {
                            this.$message.error(res.msg)
                            this.loading = false
                        }
                    }




                }
            })
        },
    }
}
</script>

<style scoped>
.logins {

    display: flex;
    flex-flow: row wrap;
    box-sizing: content-box;
    justify-content: center;
    align-items: center;

}

.logins .el-form {
    margin-top: 3rem;
    width: 214px;
    height: 307px;
}

.logins .el-form-item {
    margin-bottom: 15px;
}

.logins .el-form-item.is-error .el-input__inner {
    border: 0 !important;
    border-bottom: 1px solid #fd7065 !important;
    background: #fff !important;
}

.logins .input-icon {
    height: 32px;
    width: 18px;
    margin-left: -2px;
}

.logins .el-input__inner {
    border: 0;
    border-bottom: 1px solid #e9e9e8;
    border-radius: 0;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    height: 32px;
    line-height: 32px;
}

.logins .el-input__prefix {
    left: 0;
}

.logins .el-input--prefix .el-input__inner {
    padding-left: 26px;
}

.logins .el-input__inner::placeholder {
    color: #aeb5c4;
}

.logins .el-form-item--medium .el-form-item__content {
    line-height: 32px;
}

.logins .el-input--medium .el-input__icon {
    line-height: 32px;
}

.login-btn {
    border-radius: 17px;
    padding: 11px 20px !important;
    margin-top: 10px;
    font-weight: 500;
    font-size: 14px;
    border: 0;
    background-color: #2fa4de;
}

.login-btn:hover,
.login-btn:focus {
    /* background: #FFC200; */
    /* color: #ffffff; */
}

.login-form-title {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
}

.login-form-title .title-label {
    font-weight: 500;
    font-size: 20px;
    color: #333333;
    margin-left: 10px;
}

.goto {
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #0f84ff;
}
</style>