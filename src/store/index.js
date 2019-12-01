import Vue from 'vue'
import Vuex from 'vuex'
import ajax from '@/libs/ajax.js'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        username: '',
        menuList: []
    },
    mutations: {
        setUsername(state, data) {
            state.username = data
        },
        setMenuList(state, data) {
            state.menuList = data
        }
    },
    actions: {
        getUsername({ commit, state, dispatch }) {
            return new Promise((resolve, reject) => {
                ajax.post('/index', {}).then(res => {
                    if (res.success) {
                        commit('setUsername', res.result.username || '')
                        resolve(res.result.list)
                    }
                }, reason => {
                    reject(reason)
                })
            })
        },
        getMenuList({ commit, state, dispatch }) {
            return ajax.post('/index', {}).then(res => {
                if (res.success) {
                    commit('setMenuList', res.result.menuList || [])
                }
            })
        }
    },
    modules: {},
    plugins: [
        createPersistedState({
            storage: window.localStorage
        })
    ]
})
