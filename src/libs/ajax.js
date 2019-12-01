/*
 * 用例： ajax.post(url, params, callback, { enctype: 'form' })
 * enctype: json: 默认值，form: 普通form类型，multi: 二进制文件form类型
 */

import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

// 跨域允许传cookie
axios.defaults.withCredentials = true
// 表明是异步ajax请求，而非传统的同步请求，在会话过期时后端拦截器跳转时有用
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

const doAction = (type, url, params, callback, opts) => {
    // 默认选项(enctype: 'multi' 时，可进行二进制form提交)
    opts = Object.assign({ enctype: 'json', diy: false, msg: '数据返回错误！' }, opts)

    params = params || {}
    // 参数处理，get包一层
    if (type === 'get') {
        params = { params }
    } else {
        // 只有form类型需要qs序列化（multipart/form-data除外）
        params = opts.enctype === 'form' ? qs.stringify(params) : params
    }
    let ossUrls = ['https://guihuashi-uploads-env.oss-cn-hangzhou.aliyuncs.com', 'https://guihuashi-uploads-dev.oss-cn-hangzhou.aliyuncs.com']
    // 本地代理时需要（为区别history模式的路由），先加上前缀，再config/index.js代理时去掉
    if (ossUrls.includes(url)) {
        axios.defaults.withCredentials = false
    } else {
        url = `/server${url}`
    }

    // 请求主体
    return axios[type](url, params).then(response => {
        // 拦截未登录状态
        const res = response.data.ret || response.data

        // 回调函数里报错会上升到Promise，触发错误catch，所以用try处理
        callback = callback || function() {}
        try {
            // 自定义处理结果
            if (opts.diy) {
                callback(res)
            } else if (res.success || res.data) {
                callback(res.data || res.result)
            } else {
                Message({
                    type: 'warning',
                    message: res.msg || opts.msg,
                    showClose: true
                })
            }
        } catch (e) {
            Message({
                type: 'error',
                message: String(e),
                showClose: true
            })
        }
        return Promise.resolve(res)
    }).catch(error => {
        let msg = `Code：[${error.response.status}]，接口错误，请检查！`
        // 若自定义，组装成统一的结构
        if (opts.diy) {
            let res = {
                success: false,
                msg
            }
            callback(res)
        } else {
            Message.error(msg)
        }
        return Promise.reject(error)
    })
}

export default {
    get(...args) {
        return doAction('get', ...args)
    },
    post(...args) {
        return doAction('post', ...args)
    },
    all(reqs) {
        return axios.all(reqs).then(axios.spread((...res) => Promise.resolve(res)))
            .catch(error => Promise.reject(error))
    }
}
