<template>
    <div class="login-page">
        <div class="head">
            <span>重庆管理后台</span>
        </div>
        <div class="login-box" @keydown.enter="onLogin">
            <div class="tipcont">
                <span class="tip">{{tipCont}}</span>
            </div>
            <a href="javascript:;" :class="logstyle" @click="changeLog"></a>
            <div class="logo">{{logTitle}}</div>
            <div v-show="logShow">
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="0px">
                    <el-form-item label="" prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="" class="btn-wrap">
                        <el-button type="primary" @click="onLogin">立即登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-show="!logShow">
                <div class="codeBox">
                    <div class="refresh" v-if="refresh">
                        <p>二维码已失效</p>
                        <p><el-button size="mini" type="primary" @click="onrefresh">点击刷新</el-button></p>
                    </div>
                    <div class="qrcodebox" ref="qrCodeUrl"></div>
                </div>
                <p class="app">请使用<el-popover placement="top" trigger="hover" width="220">
                    <slot>
                        <p style="padding:0;margin:0; text-align: center;">扫码下载诸葛狮</p>
                        <img src="/static/image/qr.png" class="slotimg" style="width:190px;height:190px;">
                    </slot>
                    <el-button type="text" slot="reference" class="fz16">诸葛狮App</el-button></el-popover>扫码登录更安全</p>
            </div>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2' // 引入qrcode
export default {
    name: 'login',
    mounted() {
        // this.$store.commit('setusername', '')
        this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: this.qrCodeUrl,
            width: 140,
            height: 140,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        })
    },
    data() {
        return {
            tipCont: '扫码登录',
            logTitle: '账号密码登录',
            refresh: false,
            logShow: true,
            logstyle: 'pwdlog',
            qrcode: '',
            url: {
                login: '/login/pwd/check', // 手机密码登录接口
                getcodeUrl: '/login/qrcode/get', // 获取生成二维码的地址
                check: '/login/qrcode/check'
            },
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            qrCodeUrl: '', // 服务端返回二维码生成的url
            code: '', // 服务端返回的qrcode
            t: null
        }
    },
    methods: {
        onLogin() {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    let params = {
                        username: this.loginForm.username,
                        password: this.loginForm.password
                    }
                    this.$ajax.post(this.url.login, params, res => {
                        // 保存登录信息
                        // this.$store.commit('setusername', this.loginForm.username)
                        this.$router.push({
                            path: '/index'
                        })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        changeLog() {
            this.logstyle = this.logstyle === 'pwdlog' ? 'qrcode' : 'pwdlog'
            this.logShow = this.logstyle === 'pwdlog'
            if (this.logstyle === 'qrcode') {
                this.logTitle = '扫码登录'
                this.tipCont = '密码登录'
                this.newCode()
            } else {
                this.logTitle = '账号密码登录'
                this.tipCont = '扫码登录'
                clearInterval(this.t)
            }
        },
        newCode() {
            this.$ajax.post(this.url.getcodeUrl, {}, res => {
                this.qrCodeUrl = res.qrcodeurl
                this.code = res.qrcode

                this.qrcode.clear()
                this.qrcode.makeCode(this.qrCodeUrl)
                this.queryDetail()
            })
        },
        // 生成二维码后，每隔2秒发一次请求，直到success=false且code=10011停止请求，说明令牌实效了，需要在二维码上展示一个遮罩层显示刷新的字样
        queryDetail() {
            this.t = setInterval(() => {
                this.$ajax.post(this.url.check, { qrcode: this.code }, res => {
                    if (res.success === false && res.code === '10011') {
                        clearInterval(this.t)
                        this.refresh = true
                    }
                    if (res.success) {
                        clearInterval(this.t)
                        window.location.href = res.result.indexUrl
                        // this.$router.push({
                        //     path: res.result.indexUrl
                        // })
                    }
                }, { diy: true })
            }, 2000)
        },
        onrefresh() {
            this.refresh = false
            this.newCode()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/style/style.scss';
@import 'src/assets/style/base.scss';
/deep/ .el-form-item__error {
    left: 55px;
}
.login-page {
    background: url(/static/image/bg.png) no-repeat 0 0;
    background-size: 100% auto;
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .head {
        height: 60px;
        background: #333;
        span{
            display: inline-block;
            padding: 16px 47px;
            background:#6294FF;
            color: #fff;
            font-size: 20px;
        }
    }
    .login-box {
        box-shadow: 0 0 6px rgba(0,0,0,.08);
        width: 450px;
        height: 370px;
        margin: 0px auto;
        text-align: center;
        position: relative;
        top:50%;
        margin-top: -185px;
        background: #fff;
        .tipcont {
            width: 40px;
            height: 40px;
            position: absolute;
            right: 15px;
            top: 10px;
            font-size: 12px;
        }
        .tip {
            display: inline-block;
            background-color: rgba(51,136,255,.13);
            color: #38f;
            border: 1px solid #38f;
            padding: 2px 3px;
            white-space: nowrap;
            position: absolute;
            right: 100%;
            top: 0;
            margin-right: 6px;
        }
        .tip:before, .tip:after {
            content: " ";
            display: block;
            position: absolute;
            left: 100%;
            top: 50%;
            margin-top: -6px;
        }
        .tip:before {
            border: 6px solid transparent;
            border-left-color: #38f;
            z-index: 1;
        }
        .tip:after {
            border: 6px solid transparent;
            border-left-color: #e5f0ff;
            transform: translateX(.5px);
            margin-left: -2px;
            z-index: 2;
        }
        .qrcodebox {
            display: inline-block;
            border: 1px solid #ebebeb;
            padding: 15px;
            img {
                width: 140px;
                height: 140px;
                background-color: #fff; //设置白色背景色
                padding: 6px; // 利用padding的特性，挤出白边
                border: 1px solid #ebebeb;
            }
        }
        .pwdlog {
            background: url(/static/image/qrcode.png) no-repeat 0 0;
            background-size: 50px 50px;
            width:50px;
            height: 50px;
            position: absolute;
            right:10px;
            top:10px;
        }
        .qrcode {
            background: url(/static/image/pc.png) no-repeat 0 0;
            background-size: 50px 50px;
            width:50px;
            height: 50px;
            position: absolute;
            right:10px;
            top:10px;
        }
        .qrimg{
            text-align: center;
            width:160px;
            height:160px;
            margin:0 0 10px 30px;
            border: 1px solid #ebebeb;
        }

        .app {
            padding:0 0 20px 30px;
            .slotimg{
                width:80px;
                height: 80px;
                display: inline-block;
            }
        }
        .fz16{
            font-size: 16px;
            font-weight: normal;
        }
        .el-popover {
            text-align: center !important;
        }
        .logo {
            display: inline-block;
            margin: 0 0 40px 0px;
            padding-top: 45px;
            width: 200px;
            font-size: 24px;
            // background: url(../../assets/img/login-logo.png) no-repeat center 20px;
            // background-size: 80px 80px;
        }
        label {
            min-width: 90px !important;
            color: #333;
        }
        .el-input {
            width: 340px;
        }
        .el-form-item__error {
            color: #f5bf46;
            top: 9px;
            left: 410px;
            width: 100px;
            text-align: left;
        }
        .btn-wrap {
            text-align: center;
            button {
                width: 340px;
                height: 45px;
                font-size: 16px;
                padding: 10px 35px;
                background: #6294FF;
                border:0;
                font-weight: normal;
                margin: 20px 0;
            }
        }
        .codeBox {
            position: relative;
            .refresh {
                width: 100%;
                height: 132px;
                background: #fff;
                opacity: 0.9;
                position: absolute;
                left: 0%;
                top:0;
                padding-top: 20px;
            }
        }
    }
}

</style>
