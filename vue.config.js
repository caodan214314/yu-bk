// const RAP = 'http://mock.jhling.com/eolinker_os/Mock/simple?projectID=5&uri='
// const RAP = 'http://yapi.jhling.com/mock/22'

module.exports = {
    outputDir: '../static-build/xxx-static-backend',
    assetsDir: 'static',
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        // 设置路径别名
        const resolve = dir => require('path').join(__dirname, dir)
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('libs', resolve('src/libs'))
            .set('store', resolve('src/store'))
            .set('views', resolve('src/views'))
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        open: true,
        proxy: {
            '/server': {
                target: 'http://47.111.7.164:13620/', // ''中可代理任意服务，包括本地服务
                // target: RAP,
                pathRewrite: {
                }
            }
            // ...require('./proxy.config') // 复杂可切换路由代理
        }
    }
}
