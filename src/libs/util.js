/**
 * global util.js
 * @type {Object}
 */

export default {
    isMoney: function(v) {
        return /^\d+(\.\d+)?$/.test(v)
    },
    isObject: function(v) {
        return !v ? false : Object.prototype.toString.call(v) === '[object Object]'
    },
    isArray: function(v) {
        return typeof Array.isArray === 'function' ? Array.isArray(v) : Object.prototype.toString.call(v) === '[object Array]'
    },
    isDate: function(v) {
        return v instanceof Date || Object.prototype.toString.call(v) === '[object Date]'
    },
    // 是否为string
    isString: function(v) {
        return v instanceof String || Object.prototype.toString.call(v) === '[object String]'
    },
    isNumber: function(v) {
        return v instanceof Number || Object.prototype.toString.call(v) === '[object Number]'
    },
    isNull: function(input) {
        return input === undefined || input === null
    },
    // 校验邮箱
    isEmail(v) {
        return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(v)
    },
    // 校验url（isFull:完整验证, 默认为true）
    isUrl(v, isFull) {
        return new RegExp(`^${isFull === false ? '(http[s]?://)?' : 'http[s]?://'}[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-.,:@?^=%&/~+#]*[\\w\\-@?^=%&/~+#])?$`).test(v)
    },

    // 校验手机号
    isPhone(v) {
        return /^1[3-9]\d{9}$/.test(v)
    },

    // 批量处理对象属性空格, clear表示清除无效属性，默认true
    batchTrim(obj, clear = true) {
        if (typeof obj !== 'object') {
            return obj.toString().trim()
        }
        let res = this.deepClone(obj)
        for (let [key, val] of Object.entries(res)) {
            if (typeof val === 'string') {
                res[key] = val.trim()
            } else if (this.isObject(val)) {
                res[key] = this.batchTrim(val, clear)
            } else if (this.isArray(val)) {
                val.forEach(e => {
                    e = this.batchTrim(e, clear)
                })
            }
            if (clear && (this.isNull(val) || val === '')) {
                Reflect.deleteProperty(res, key)
            }
        }
        return res
    },

    // 带参路由处理（获取纯正的路由）
    routePath(route) {
        let { path } = route

        Object.keys(route.params).forEach((key) => {
            const param = route.params[key]
            const regExp = new RegExp(`/${param}(/|$)`)
            path = path.replace(regExp, '$1')
        })

        return path
    },

    // 日期格式转换(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    dateFormat(dt, fmt = 'yyyy-MM-dd hh:mm:ss') {
        if (!dt) {
            return new Date()
        }
        // debugger
        if (typeof dt === 'string') {
            // dt = dt.replace(/-/g, '/') // IOS上只支持yyyy/MM/dd这种标准格式
            dt = /^\d+$/.test(dt) ? parseInt(dt) : /.\+./.test(dt) ? new Date(dt) : dt.replace(/-/g, '/') // 传入的日期可能是个纯数字组成的字符串，如"1511107200000"
        }
        if (dt instanceof Date === false) {
            dt = new Date(dt)
        }
        if (!dt.getTime()) {
            return new Date()
        }
        let o = {
            'M+': dt.getMonth() + 1, // 月份
            'd+': dt.getDate(), // 日
            'h+': dt.getHours(), // 小时
            'm+': dt.getMinutes(), // 分
            's+': dt.getSeconds(), // 秒
            'q+': Math.floor((dt.getMonth() + 3) / 3), // 季度
            S: dt.getMilliseconds() // 毫秒
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (dt.getFullYear() + '').substr(4 - RegExp.$1.length)
            )
        }

        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                )
            }
        }

        return fmt
    },
    deepClone(x) {
        // 如果传入空值或者不是对象不是方法，则直接返回
        if (x == null || typeof x !== 'object') {
            return x
        }

        let isClone = v => this.isObject(v) || this.isArray(v)

        let root = x
        if (this.isArray(x)) {
            root = []
        } else if (this.isObject(x)) {
            root = {}
        }

        // 循环数组
        const loopList = [{
            parent: root,
            key: undefined,
            data: x
        }]

        while (loopList.length) {
            // 深度优先
            const node = loopList.pop()
            const { parent, key, data } = node

            // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
            let res = parent
            if (typeof key !== 'undefined') {
                res = parent[key] = this.isArray(data) ? [] : {}
            }

            if (this.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    // 避免一层死循环 a.b = a
                    if (data[i] === data) {
                        res[i] = res
                    } else if (isClone(data[i])) {
                        // 下一次循环
                        loopList.push({
                            parent: res,
                            key: i,
                            data: data[i]
                        })
                    } else {
                        res[i] = data[i]
                    }
                }
            } else if (this.isObject(data)) {
                for (let k in data) {
                    if (data.hasOwnProperty(k)) {
                        // 避免一层死循环 a.b = a
                        if (data[k] === data) {
                            res[k] = res
                        } else if (isClone(data[k])) {
                            // 下一次循环
                            loopList.push({
                                parent: res,
                                key: k,
                                data: data[k]
                            })
                        } else {
                            res[k] = data[k]
                        }
                    }
                }
            }
        }

        return root
    },
    existClone(handObj, sourceObj) {
        // debugger
        if (!this.isObject(handObj) || !this.isObject(sourceObj)) {
            return handObj
        }
        for (let k of Object.keys(handObj)) {
            handObj[k] = sourceObj[k] ? this.deepClone(sourceObj[k]) : handObj[k]
        }
        return handObj
    },

    // cookie方法
    cookie(key, value, options) {
        let days
        let time

        // A key and value were given. Set cookie.
        if (arguments.length > 1 && String(value) !== '[object Object]') {
            // Enforce object
            options = options || {}

            if (value === null || value === undefined) {
                options.expires = -1
            }

            if (typeof options.expires === 'number') {
                days = options.expires * 24 * 60 * 60 * 1000
                options.expires = new Date()
                time = options

                time.setTime(time.getTime() + days)
            }

            value = String(value)

            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? `; expires=${options.expires.toUTCString()}` : '',
                options.path ? `; path=${options.path}` : '',
                options.domain ? `; domain=${options.domain}` : '',
                options.secure ? '; secure' : ''
            ].join(''))
        }

        // Key and possibly options given, get cookie
        options = value || {}

        const decode = options.raw ? function(s) {
            return s
        } : decodeURIComponent

        const result = new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`).exec(document.cookie)

        return result ? decode(result[1]) : null
    },
    // 提交按钮防抖，传入的毫秒数内，以最后一次请求为准发送
    debounce(fn, t) {
        let delay = t || 500
        let timer
        return function() {
            let args = arguments
            if (timer) {
                clearTimeout(timer)
            }

            let callNow = !timer

            timer = setTimeout(() => {
                timer = null
            }, delay)

            if (callNow) fn.apply(this, args)
        }
    }
}
