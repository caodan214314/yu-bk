<template>
    <header class="clear">
        <span class="fl headLeft">管理后台</span>
        <div class="fr headRight">
            <el-avatar class="iconset mr10" :size="28" :src="circleUrl"></el-avatar>
            <a href="javascript:;" class="mr20">{{username}}</a>
            <a href="javascript:;" @click="onLogout" class="mr15" v-if="username">退出</a>
        </div>
    </header>
</template>
<script>
// import { mapActions, mapState } from 'vuex'
import { mapState } from 'vuex'
export default {
    name: 'headbar',
    mounted() {
        // if (!token) {
        //     this.$store.commit('setUsername', '')
        //     return false
        // }
        // let token = this.getCookie('sso_token')
        // token && this.getUsername()
    },
    data() {
        return {
            circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        }
    },
    computed: {
        ...mapState(['username'])
        // userName() { 等价于上面一行，获取状态：...mapState(['username'])
        //     return this.$store.state.userName
        // }
    },
    methods: {
        // ...mapActions([
        //     'getUsername'
        // ]),
        // getUsername() { // this.$store.dispatch等价于上面mapActions，里面封装过dispatch了
        //     return this.$store.dispatch('getUsername')
        // },
        onLogout() {
            // let params = {
            //     cmd: 'logout'
            // }
            // this.$ajax.post('/doLogin', params, res => {
            //     // 保存登录信息
            //     this.$store.commit('setUserName', '')
            //     this.$router.push('/login')
            // })
        }
    }
}
</script>
<style lang="scss">
header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 60px;
    color: #fff;
    z-index: 999;
    background: #333;
    width: 100%;
    .headLeft {
        display: inline-block;
        padding: 0 0 0 60px;
        color: #fff;
        font-size: 16px;
        background:#6294FF url(/static/image/logo.png) no-repeat 15px center;
        background-size: 34px 29px;
        display: inline-block;
        width: 14%;
        height: 60px;
        line-height: 60px;
    }
    .headRight {
        height: 60px;
        line-height: 60px;
        .iconset {
            vertical-align: middle;
        }
    }
    h1 {
        margin: 15px 0 10px 25px !important;
        font-size: 22px;
        letter-spacing: 1.5px;
        font-weight: normal;
    }
    nav {
        margin: 22px 0 0 80px;
        a {
            margin: 0 15px;
        }
    }
    .info {
        margin: 20px 20px 0 0;
        strong {
            padding: 0 10px;
        }
        a {
            margin-left: 8px;
        }
        .el-icon-question {
            margin-left: 10px;
            color: #e9c849;
        }
    }
}
</style>
