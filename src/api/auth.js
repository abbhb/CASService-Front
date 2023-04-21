import request from '../http/request';


export function login(data) {
    return request({
        url:'/user/auth/login',
        method:'post',
        data
    })
}
export function login302(data,service) {
    return request({
        url:'/user/auth/login'+'?service='+service,
        method:'post',
        data
    })
}
export function loginbytgc() {
    return request({
        url:'/user/auth/loginbytgc',
        method:'get'
    })
}
export function loginbytgc302(service) {
    return request({
        url:'/user/auth/loginbytgc'+'?service='+service,
        method:'get'
    })
}


export function redirectEN(code) {
    return request({
        url:'/redirect/en',
        method:'get',
        params:{
            code:code
        }
    })
}
export function redirectGitee(code) {
    return request({
        url:'/redirect/gitee',
        method:'get',
        params:{
            code:code
        }
    })
}


export function firstEN(data) {
    return request({
        url:'/redirect/firsten',
        method:'post',
        data
    })
}
export function firstGitee(data) {
    return request({
        url:'/redirect/firstgitee',
        method:'post',
        data
    })
}