import request from "@/http/request";


export function getEmail(data) {
    return request({
        url:'/common/getEmailCode',
        method:'post',
        data
    })
}

export function havaEmailCode(email,email_code) {
    return request({
        url:'/common/havaEmailCode',
        method:'post',
        data:{
            'email':email,
            'email_code':email_code
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