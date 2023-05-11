import request from "@/http/request";


export function getEmail(data) {
    return request({
        url:'/common/getEmailCode',
        method:'post',
        data
    })
}

export function havaEmailCode(email,emailCode) {
    return request({
        url:'/common/havaEmailCode',
        method:'post',
        data:{
            'email':email,
            'emailCode':emailCode
        }
    })
}

export function emailWithUser(data){
    return request({
        url:'/user/emailwithuser',
        method:'post',
        data
    });
}
export function findPassword(data){
    return request({
        url:'/user/v1/findPassword',
        method:'put',
        data
    });
}