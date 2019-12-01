<template>
    <aside>
        <!-- <el-menu :router="true" :default-active="$route.fullPath" :default-openeds="defaultOpeneds">
            <div v-for="(item1, i) in sideMenu" :key="i">
                <el-menu-item :index="item1.path" v-if="!(item1.children && item1.children.length) && !item1.hide" :class="(item1.path === $util.routePath($route) ? 'is-active' : '')">{{ item1.title }}</el-menu-item>
                <el-submenu :index="item1.path" v-if="item1.children && item1.children.length">
                    <template slot="title">{{ item1.title }}</template>
                    <template v-for="(item2, j) in item1.children">
                        <el-menu-item :key="j" :index="item2.path" v-if="!item2.hide" :class="(item2.path === $util.routePath($route) ? 'is-active' : '')">{{ item2.title }}</el-menu-item>
                    </template>
                </el-submenu>
            </div>
        </el-menu> -->

        <el-menu default-active="0" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <div v-for="(item1, i) in menuList" :key="i">
                <el-submenu :index="String(item1.level)">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item1.menuName}}</span>
                    </template>
                    <template v-if="item1.children && item1.children.length">
                        <el-menu-item-group v-for="(item2, i2) in item1.children" :key="i2">
                            <template slot="title">{{item2.menuName}}</template>
                            <template v-if="item2.children && item2.children.length">
                                <div v-for="(item3, i2) in item2.children" :key="i2">
                                    <el-menu-item :index="String(item3.level)">{{item3.menuName}}</el-menu-item>
                                </div>
                            </template>
                        </el-menu-item-group>
                    </template>
                </el-submenu>
            </div>
        </el-menu>
    </aside>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'sidebar',
    data() {
        return {
            defaultOpeneds: []
        }
    },
    created() {
        console.log(this.menuList)
    },
    computed: {
        ...mapState(['menuList'])
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        }
    }
}
</script>
<style lang="scss">
aside {
    position: fixed;
    display: block;
    top: 60px;
    bottom: 0px;
    left: 0px;
    width: 14%;
    overflow-x: hidden;
    color: #333;
    z-index: 999;
    .el-menu {
        border: 0;
    }
    // .el-menu {
    //     border-right: 0 none;
    //     background-color: transparent;
    //     .el-submenu,
    //     .el-menu-item {
    //         border-bottom: 1px solid #DCDFEA;
    //         &:hover {
    //             background-color: #E4E7E8;
    //         }
    //     }
    //     .el-submenu {
    //         li:last-child {
    //             border-bottom: 0;
    //         }
    //     }
    // }
}
</style>
