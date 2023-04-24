import request from "@/http/request";

export function getCodeImg(data) {
    return request({
        url:'/common/getCaptcha',
        method:'post',
        data:data
    })
}
export function checkImageCode(data) {
    return request({
        url:'/common/checkImageCode',
        method:'post',
        data:data
    })
}