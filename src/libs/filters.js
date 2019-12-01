import Vue from 'vue'

const pattern = {
    num: /\d+(\.\d+)?/
}

Vue.filter('dateFormat', function(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (!date) {
        return ''
    }
    if (date instanceof Date === false) {
        date = new Date(date)
    }
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }

    return fmt
})

Vue.filter('toFixed', function(data, float) {
    return (data && pattern.num.test(data)) ? parseFloat(data).toFixed(float || 2) : '0.00'
})

Vue.filter('toString', function(data) {
    return typeof data === 'object' ? JSON.stringify(data) : data
})

Vue.filter('toPercent', function(data) {
    return (data && pattern.num.test(data)) ? ((parseFloat(data) * 100).toFixed(2) + '%') : '0.00%'
})

Vue.filter('toRate', function(data, total) {
    return (data && total && pattern.num.test(data) && pattern.num.test(total)) ? (parseFloat(data / total * 100).toFixed(2) + '%') : '0.00%'
})

Vue.filter('toRMB', function(data, precision = 1000) {
    return (data && pattern.num.test(data)) ? (parseFloat(data / precision).toFixed(2)) : '0.00'
})
