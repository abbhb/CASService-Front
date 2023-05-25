import request from '../http/request';


export function login(data) {
    return request({
        url:'/user/auth/login',
        method:'post',
        data
    })
}

export function loginbytgc(data) {
    return request({
        url:'/user/auth/loginbytgc',
        method:'post',
        data
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

export function addAuth(data) {
    return request({
        url:'/oauth/addAuth',
        method:'post',
        data
    })
}
export function editAuth(data) {
    return request({
        url:'/oauth/editAuth',
        method:'put',
        data
    })
}

export function listAuth(page_num,page_size) {
    return request({
        url:'/oauth/list',
        method:'get',
        params:{
            page_num:page_num,
            page_size:page_size
        }
    })
}

export function deleteAuth(id) {
    return request({
        url:'/oauth/delete',
        method:'delete',
        params:{
            id:id
        }
    })
}
export function firstGitee(data) {
    return request({
        url:'/redirect/firstgitee',
        method:'post',
        data
    })
}