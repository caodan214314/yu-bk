const ip = require('internal-ip').v4()
const rap = 'http://192.168.4.102:9999/mockjsdata/208'

// 项目名缩写
const project = 'common'
// 本地启动web端口
const webPort = '8080'
// 代理服务端口
const serverPort = '10400'
// 本地启动默认代理环境
const defaultProxy = 'mock' // 默认值：mock，与后端开始联调时请设置dev
// 后台真实菜单来源
const menuSource = 'test'

// 代理服务器列表
const servers = {
    'dev': '127.0.0.1', // 开发接口IP，默认本机：127.0.0.1，可修改如：172.16.5.196
    'test': '192.168.4.105',
    'testper': '192.168.4.25',
    'aliyun1': '101.37.173.182',
    'aliyun2': '101.37.90.97',
    'aliyun3': '118.31.102.3',
    'aliyun4': '47.97.22.207',
    'aliyun5': '101.37.162.50'
}

const proxyRouters = {}
const proxyCookies = {}
const proxyServer = {}

// 生成多路由映射表
Object.keys(servers).forEach(env => {
    // 组装路由代理列表
    let webUrl = `${project}-${env}:${webPort}`
    let proxyUrl = `http://${servers[env]}:${serverPort}`
    proxyRouters[webUrl] = proxyUrl

    // 组装重写cookie列表
    let proxyDomain = `${project}-${env}.${/^(dev|test)$/.test(env) ? 'aiyoumi' : 'aicaitest'}.com`
    proxyCookies[proxyDomain] = ''

    // 默认启动时的代理服务
    if (defaultProxy === env) {
        proxyRouters[`${ip}:${webPort}`] = proxyUrl
    }

    // 默认备用代理配置（当servers路由表里查找不到时）
    if (env === menuSource) {
        proxyServer.test = proxyUrl
        proxyServer.rap = rap
    }
})

// 开发时提示用户配置host
if (process.env.NODE_ENV === 'production') {
    console.log(`start building vue of ${project}, please wait...\n`)
} else {
    console.log('********************** HOST添加配置 ***********************\n')
    console.log('127.0.0.1', ['mock'].concat(Object.keys(servers)).map(env => `${project}-${env}`).join(' '), '\n')
    console.log('***********************************************************')
}

// 项目所有的api映射表
const proxyContexts = {
    '/api/loadMenu': proxyServer.test,
    '/api/doLogin': proxyServer.test,
    '/api': proxyServer.rap
}

// 重新组装proxy列表
let proxyList = {}
Object.keys(proxyContexts).forEach(function(context) {
    let target = proxyContexts[context]
    proxyList[context] = {
        // logLevel: 'debug',
        target: target,
        changeOrigin: true,
        cookieDomainRewrite: proxyCookies,
        router: proxyRouters,
        pathRewrite: { '^/api': '' },
        secure: false
    }
})

module.exports = proxyList
