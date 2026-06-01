import request from '@/utils/request'

export function createAlipay(params) {
    return request.post('/front/pay/alipay/create', params);
}

export function queryPayResult(params) {
    return request.get('/front/pay/result', { params });
}