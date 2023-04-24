import request from "@/http/request";

export function getSelfInviteCodeList(params) {
    return request({
        url:'/api2/invitecode/listSelf',
        method:'get',
        params
    })
}

export function addInviteCodeOne(data) {
    return request({
        url:'/api2/invitecode/addOne',
        method:'post',
        data:data
    })
}
export function addInviteCodeList(data) {
    return request({
        url:'/api2/invitecode/addList',
        method:'post',
        data:data
    })
}
export function delInviteCodeList(params) {
    return request({
        url:'/api2/invitecode/deleteList',
        method:'delete',
        params
    })
}

export function delInviteCodeOne(params) {
    return request({
        url:'/api2/invitecode/deleteOne',
        method:'delete',
        params
    })
}
