import Vue from 'vue'
import VueAMap from 'vue-amap'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import Global from './libs/global'
import 'assets/style/theme.scss'
import 'assets/style/style.scss'
import mComponents from './components'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(VueAMap)

Vue.use(mavonEditor)

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(mComponents)
Vue.use(Global)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
