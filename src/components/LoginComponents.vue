<template>
    <div>
        <div class="logins" v-if="!isRegistration">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        auto-complete="off"
                        maxlength="40"
                        placeholder="账号(用户名、电子邮箱)"
                        prefix-icon="el-icon-user"
                        type="text"/>
                </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" maxlength="20" placeholder="密码" prefix-icon="el-icon-lock"
                          show-password type="password"
                          @keyup.enter.native="handleLogin"/>
              </el-form-item>


              <el-form-item prop="day30">
                <el-checkbox v-model="loginForm.day30">30天内免登录</el-checkbox>
              </el-form-item>
              <el-form-item style="width:100%;">

                <div style="display: flex;flex-flow: column;justify-content: center;align-items: flex-end;">
                  <el-button :loading="loading" class="login-btn" size="medium" style="width:100%;" type="primary"
                             @click.native.prevent="handleLogin">
                    <span v-if="!loading">登录</span>
                    <span v-else>登录中...</span>
                  </el-button>
                  <el-button :loading="loading" class="login-btn" size="medium" style="width:100%;" type="primary"
                             @click.native.prevent="handleRe">
                            <span>注册</span>

                        </el-button>
                    </div>
                    <div class="goto" @click="goto('findPassword')">
                        <span>找回密码</span>
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
                    />
                </el-form-item>
                <el-form-item prop="re_password">
                    <el-input v-model="registrationForm.re_password" type="password" show-password placeholder="确认密码"
                              prefix-icon="el-icon-lock" maxlength="20"
                    />
                </el-form-item>
                <el-form-item prop="invite_code">
                    <el-input v-model="registrationForm.invite_code" show-password placeholder="邀请码"
                              prefix-icon="el-icon-magic-stick" maxlength="20"
                    />
                </el-form-item>

                <el-form-item prop="email">
                    <el-input v-model="registrationForm.email" type="email" placeholder="请输入真实电子邮箱地址"
                              prefix-icon="el-icon-message"
                    />
                </el-form-item>
                <el-form-item prop="mail_code">
                    <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;margin:auto;">
                        <el-input v-model="registrationForm.mail_code" placeholder="请输入邮箱验证码"
                                  prefix-icon="el-icon-magic-stick"
                        />
                        <EmailButton :email="registrationForm.email"></EmailButton>
                    </div>
                </el-form-item>


                <el-form-item style="width:100%;">

                    <div style="display: flex;flex-flow: column;justify-content: center;align-items: flex-end;">
                        <el-button :loading="loading" :disabled="loading" class="login-btn" size="medium" type="primary"
                                   style="width:100%;"
                                   @click.native.prevent="ButtonRe">
                            <span v-if="!loading">注册</span>
                            <span v-else>注册中...</span>
                        </el-button>
                      <el-button class="login-btn" size="medium" style="width:100%;" type="primary"
                                 @click.native.prevent="handleLo">
                        <span>返回登录</span>

                      </el-button>
                    </div>

                </el-form-item>
            </el-form>
        </div>
      <el-dialog
          :append-to-body="true"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="true"
          :visible.sync="loginForm.needMFA"
          class="dialog"
          style="z-index: 2100"
          title="动态密码验证"
          width="20%"
      >
        <el-card class="box-card">
          <div style="display: flex;flex-direction: column">
            <span>动态密码</span>
            <div style="display: flex;flex-direction: row">
              <el-input v-model="loginForm.code"></el-input>
              <el-button style="margin-left: 5px;" type="primary" @click="handleLoginGoogle">校验</el-button>
            </div>

          </div>

        </el-card>
      </el-dialog>
    </div>


</template>

<script>
/**
 * 登录模块
 */
import router from "@/router";
import {login, loginbytgc} from "@/api/auth";
import {hasUserName, registerUser} from "@/api/login";
import EmailButton from "@/components/EmailButton.vue";


export default {
    name: "LoginComponents",
    components: {EmailButton},
    data() {
        return {
            loginForm: {
              username: '',
              password: '',
              day30: false,
              needMFA: false,
              code: '',
            },
            registrationForm: {
                username: '',
                password: '',
                sex: '未知',
                re_password: '',
                permission: '2',
                status: '1',//默认启用
                avatar: '',//url
                email: '',
                mail_code: '',
                invite_code: '',//邀请码
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
                'password': [{'validator': validatePassword, 'trigger': 'blur'}],
            }
        },
        registrationRules() {
            return {
                'username': [
                    {
                        'required': true,
                        // 'message': '请填写用户密码',
                        validator: async (rules, value, callback) => {
                            if (!value) {
                                callback(new Error('请填写用户名称'))
                            } else {
                                let params = {"username": this.registrationForm.username}
                                const res = await hasUserName(params)
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
                        'trigger': ['change']
                    },
                ],
                're_password': [
                    {
                        'required': true,
                        'message': '请填写确认密码',
                        validator: (rules, value, callback) => {
                            if (!value) {
                                callback(new Error('请填写确认密码'))
                            }
                            if (value === this.registrationForm.password) {
                                callback()
                            }
                            callback(new Error("请保证密码一致"))
                        },
                        'trigger': ['blur']
                    },
                ],
            }
        }
    },
    async created() {
        const data = {}
        if (this.isCASLogin()) {
            const service = window.location.search.split("service=")[1].split("&")[0]
            data.redirect_uri = service
        } else if (this.isOAuth2Login()){
            //OAuth2.0登录
            if (window.location.search.indexOf("redirect_uri") !== -1) {
                const redirect_uri = window.location.search.split("redirect_uri=")[1].split("&")[0]
                data.redirect_uri = redirect_uri
            }
            const client_id = window.location.search.split("client_id=")[1].split("&")[0]
            data.client_id = client_id
            const response_type = window.location.search.split("response_type=")[1].split("&")[0]
            data.response_type = response_type
            if (window.location.search.indexOf("state") !== -1) {
                const state = window.location.search.split("state=")[1].split("&")[0]
                data.state = state
            }
        }else {
            //普通登录
        }
        const res = await loginbytgc(data)
        this.loginSuccessR(res)

    },
    methods: {
        goto(val) {
            if (val==='findPassword'){
                //跳转找回密码
                router.push({name:'findPassword'})
            }else {
                this.$message.info("这个服务暂时停用，努力适配中")
                console.log(val)
                return
            }

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
        ButtonRe() {

            this.ReCommit()
        },
        ReCommit() {
            this.$refs["registrationForm"].validate(async (valid) => {  //开启校验
                if (valid) {   // 如果校验通过，请求接口，允许提交表单
                    let data = {}
                    if (!this.registrationForm.password) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!this.registrationForm.permission) {
                        this.$message.error("请你输入完整")
                        return false;
                    }
                    if (!(this.registrationForm.password === this.registrationForm.re_password)) {
                        this.$message.error("确认密码需要和密码一致")
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
                    if (!this.registrationForm.invite_code) {
                        this.$message.error("验证码问题")
                        return false;
                    }
                    if (!this.registrationForm.mail_code) {
                        this.$message.error("验证码问题")
                        return false;
                    }
                    data.sex = this.registrationForm.sex ? this.registrationForm.sex : "未知"
                    data.avatar = this.registrationForm.avatar
                    data.password = this.registrationForm.password
                    data.permission = this.registrationForm.permission
                    data.status = this.registrationForm.status
                    data.username = this.registrationForm.username
                    data.email = this.registrationForm.email
                    data.re_password = this.registrationForm.re_password
                    data.mail_code = this.registrationForm.mail_code
                    data.invite_code = this.registrationForm.invite_code
                    const res = await registerUser(data)
                    if (String(res.code) === '1') {
                        this.$message.success(res.msg)
                        this.handleLo()
                    } else {
                        this.$message.error(res.msg)
                    }
                    console.log(res)
                } else {   //校验不通过

                    this.$message.error("参数校验不通过")
                    return false;
                }
            });
        },
        cancelForm() {
          this.registrationForm.random_code = ''
          this.registrationForm.verification_code = ''
          this.registrationForm.sex = '未知'
          this.registrationForm.password = ''
          this.registrationForm.avatar = ''
          this.registrationForm.username = ''
          this.loginForm.password = ''
          this.loginForm.username = ''
          this.loginForm.day30 = false

        },
        handleRe() {
            this.isRegistration = true;
        },
        handleLo() {
            this.isRegistration = false;
            this.cancelForm()
        },
        isCASLogin() {
            return !!(window.location.search &&
                window.location.search.indexOf("service=") !== -1 &&
                window.location.search.indexOf("response_type") === -1 &&
                window.location.search.indexOf("redirect_uri") === -1);
        },
        isOAuth2Login() {
            //判断是不是需要走oauth2.0
            return !!(window.location.search &&
                window.location.search.indexOf("service=") === -1 &&
                window.location.search.indexOf("response_type") !== -1 &&
                window.location.search.indexOf("client_id") !== -1);
        },
        loginSuccessR(res){
          if (String(res.code) === '1') {
            //正常登录
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            localStorage.setItem("permission", res.data.permission)
            localStorage.setItem('userId', String(res.data.id))
            localStorage.setItem('tgc', String(res.data.tgc))
            // Cookies.set('tgc',res.data.tgc)
            router.push({name: 'dh'})

          } else if (String(res.code) === '203') {
            this.loginForm.needMFA = true
            this.$message.info("请校验动态密码")
          } else if (String(res.code) === '302') {
            //需要重定向
            localStorage.setItem('tgc', String(res.data.tgc))
            if (res.data.redirect_uri.indexOf('?') === -1) {
              window.location.href = res.data.redirect_uri + '?ticket=' + res.data.ticket;
            } else {
              window.location.href = res.data.redirect_uri + '&ticket=' + res.data.ticket;

            }
          } else if (String(res.code) === '303') {
            //oauth2.0协议部分
                console.log(res.data)
                localStorage.setItem('tgc',String(res.data.tgc))
                //此处验证可得必须加上该加的括号，前面最好加个字符串不然容易报错
                window.location.href = '' + res.data.redirect_uri + '?code='+res.data.code+(res.data.state?'&state='+res.data.state:'');
            } else if (String(res.code) === '308') {
                //必须补全信息
                localStorage.setItem('userInfo', JSON.stringify(res.data))
                localStorage.setItem("permission", res.data.permission)
                localStorage.setItem('tgc',String(res.data.tgc))
                localStorage.setItem('userId', String(res.data.id))
                router.push({name: 'userinfo', params: {mustUpdataUserInfo: true}})
            } else if (String(res.code)==='900'){
                localStorage.clear()
                sessionStorage.clear()
                router.push({name: 'login'})
            }
            else {
                if (res.msg){
                    this.$message.error(res.msg)
                }
                this.loading = false
            }
        },
        async handleLogin() {
            //登录
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                  this.loading = true
                  let data = {}
                  data.username = this.loginForm.username
                  data.password = this.loginForm.password
                  if (this.loginForm.day30) {
                    data.day30 = 1
                  } else {
                    data.day30 = 0
                  }
                  if (this.isCASLogin()) {
                    //CAS登录,data参数暂时只需需要添加redirectUri
                    const service = window.location.search.split("service=")[1].split("&")[0]
                    data.redirect_uri = service
                  } else if (this.isOAuth2Login()) {
                    //OAuth2.0登录
                    if (window.location.search.indexOf("redirect_uri") !== -1) {
                      const redirect_uri = window.location.search.split("redirect_uri=")[1].split("&")[0]
                      data.redirect_uri = redirect_uri
                    }
                        const client_id = window.location.search.split("client_id=")[1].split("&")[0]
                        data.client_id = client_id
                        const response_type = window.location.search.split("response_type=")[1].split("&")[0]
                        data.response_type = response_type
                        if (window.location.search.indexOf("state") !== -1) {
                            const state = window.location.search.split("state=")[1].split("&")[0]
                            data.state = state
                        }

                  } else {
                    //普通登录
                    //登录管理系统
                  }
                  const res = await login(data)
                  console.log("code" + res.code)
                  this.loginSuccessR(res)
                }
            })
        },
      async handleLoginGoogle() {
        //登录
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            this.loading = true
            let data = {}
            data.username = this.loginForm.username
            data.password = this.loginForm.password
            data.code = this.loginForm.code
            if (this.loginForm.day30) {
              data.day30 = 1
            } else {
              data.day30 = 0
            }
            if (this.isCASLogin()) {
              //CAS登录,data参数暂时只需需要添加redirectUri
              const service = window.location.search.split("service=")[1].split("&")[0]
              data.redirect_uri = service
            } else if (this.isOAuth2Login()) {
              //OAuth2.0登录
              if (window.location.search.indexOf("redirect_uri") !== -1) {
                const redirect_uri = window.location.search.split("redirect_uri=")[1].split("&")[0]
                data.redirect_uri = redirect_uri
              }
              const client_id = window.location.search.split("client_id=")[1].split("&")[0]
              data.client_id = client_id
              const response_type = window.location.search.split("response_type=")[1].split("&")[0]
              data.response_type = response_type
              if (window.location.search.indexOf("state") !== -1) {
                const state = window.location.search.split("state=")[1].split("&")[0]
                data.state = state
              }

            } else {
              //普通登录
              //登录管理系统
            }
            const res = await login(data)
            console.log("code" + res.code)
            this.loginSuccessR(res)
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