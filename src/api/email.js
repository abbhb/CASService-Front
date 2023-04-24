import request from "@/http/request";


export function getEmail(params) {
    return request({
        url:'/common/getCode',
        method:'get',
        params:params
    })
}

export function emailWithUser(data){
    return request({
        url:'/user/emailwithuser',
        method:'post',
        data:data
    });
}