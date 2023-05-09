import request from "@/http/request";


export function getEmail(data) {
    return request({
        url:'/common/getEmailCode',
        method:'post',
        data
    })
}

export function emailWithUser(data){
    return request({
        url:'/user/emailwithuser',
        method:'post',
        data
    });
}