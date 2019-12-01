<template>
    <div class="app">
        <my-header></my-header>
        <div class="content">
            <my-aside></my-aside>
            <div class="main">
                <div class="main-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import headbar from './header.vue'
import aside from './sidebar.vue'
export default {
    name: 'viewport',
    data() {
        return {
            username: '',
            menuList: [],
            resourceList: []
        }
    },
    components: {
        'my-header': headbar,
        'my-aside': aside
    },
    created() {
        this.getIndex()
    },
    methods: {
        getIndex() {
            this.$ajax.post('/index', {}, res => {
                if (res.success) {
                    this.username = res.result.username
                    this.menuList = res.result.menuList
                    this.resourceList = res.result.resourceList
                    this.$store.commit('setMenuList', res.result.menuList)
                    this.$store.commit('setUsername', res.result.username)
                } else {
                    if (res.code === '-1998' || res.code === '103') {
                        this.$router.push({
                            path: '/login'
                        })
                    }
                }
            }, { diy: true })
        }
    }
}
</script>
<style>
body {
    background-color: #f7f7f7 !important;
}

.content {
    display: table;
    margin-top: 60px;
    padding: 0;
    width: 100%;
}

.main {
    padding: 20px;
    width: 86%;
    margin-left: 14%;
    position: absolute;
    display: block;
    top: 60px;
    bottom: 0px;
    right: 0px;
}

.main-content {
    padding: 0 20px 20px;
    background: #fff;
    min-height: 100%;
}
</style>
