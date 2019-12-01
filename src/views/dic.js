export const DIC = {
    ordStatus: [{
        label: '未支付',
        value: 'TRADE_NO_CREATE_PAY'
    }, {
        label: '等待付款',
        value: 'WAIT_BUYER_PAY'
    }, {
        label: '交易成功',
        value: 'TRADE_FINISHED'
    }, {
        label: '等待机构确认',
        value: 'WAIT_ORG_ENSURE'
    }, {
        label: '已退款',
        value: 'TRADE_CLOSED_BY_REFUND'
    }, {
        label: '订单关闭',
        value: 'TRAND_CLOSED'
    }],
    orderTypes: [{
        label: '预定交易',
        value: 'step'
    }, {
        label: '正常交易',
        value: 'fix'
    }],
    payList: [{
        label: '无',
        value: '0'
    }, {
        label: '支付宝',
        value: '1'
    }, {
        label: '微信',
        value: '2'
    }],
    statusList: [{
        label: '未下架',
        value: '0'
    }, {
        label: '下架',
        value: '1'
    }],
    sexList: [{
        label: '男',
        value: '0'
    }, {
        label: '女',
        value: '1'
    }],
    roleList: [{
        label: '区域经理',
        value: 'AREA_M'
    }, {
        label: '校园经理',
        value: 'SCHOOL_M'
    }, {
        label: '合伙人',
        value: 'PARTNER'
    }],
    channelList: ['ios', 'android', 'h5']
}
