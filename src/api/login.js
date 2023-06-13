import request from '../http/request';


export function logoutApi(){
    return request({
        url: '/user/logout',
        method: 'post',
    })
}
export function logoutSize(){
    return request({
        url: '/user/logoutSize',
        method: 'get',
    })
}

export function checkToken(){
    return request({
        url:'/user/loginbytoken',
        method:'post',
        data:{
        }
    });
}

export function createUser(data){
    return request({
        url:'/user/create',
        method:'post',
        data:data
    });
}





export function addUser(data){
    return request({
        url:'/user/add',
        method:'post',
        data:data
    });
}
export function registerUser(data){
    return request({
        url:'/user/register',
        method:'post',
        data:data
    });
}

export function createNavItem(data){
    return request({
        url:'/quicknavigation/createItem',
        method:'post',
        data:data
    });
}

export function createCategorize(data) {
    return request({
        url: '/quicknavigation/createCategorize',
        method: 'post',
        data: data
    });
}


export function getNavListForFenlei(params) {
    return request({
        url: '/quicknavigation/listnavfenlei',
        method: 'get',
        params
    });
}

export function getListnavfenleiitem(params) {
    return request({
        url: '/quicknavigation/listnavfenleiitem',
        method: 'get',
        params
    });
}

export function getNavList(params) {
    return request({
        url: '/quicknavigation/list',
        method: 'get',
        params
    });
}

export function getCategorizeSelectOptionsList(params) {
    return request({
        url: '/quicknavigation/getCategorizeSelectOptionsList',
        method: 'get',
        params
    });
}

export function getUserList(params) {
    return request({
        url: '/user/get',
        method: 'get',
        params
    });
}

export function hasUserName(params) {
    return request({
        url:'/user/hasUserName',
        method:'get',
        params
    });
}


export function delUserList(params){
    return request({
        url:'/user/delete',
        method:'delete',
        params
    });
}

export function deleteNavigationCategorize(params){
    return request({
        url:'/quicknavigation/deleteCategorize',
        method:'delete',
        params
    });
}

export function deleteNavigationItem(params) {
    return request({
        url: '/quicknavigation/deleteItem',
        method: 'delete',
        params
    });
}


export function updataforquicknavigationcategorize(data) {
    return request({
        url: '/quicknavigation/updataforquicknavigationcategorize',
        method: 'put',
        data
    });
}

export function updataforquicknavigationitem(data) {
    return request({
        url: '/quicknavigation/updataforquicknavigationitem',
        method: 'put',
        data
    });
}


// 文件上传
export function postUploadFile(file, copies, printingDirection, printBigValue, needPrintPagesEndIndex, isDUPLEX) {
    return request({
        url: '/printer/uploadPrint?copies=' + copies + '&printingDirection=' + printingDirection + '&printBigValue=' + printBigValue + '&needPrintPagesEndIndex=' + needPrintPagesEndIndex + '&isDuplex=' + isDUPLEX,
        method: 'post',
        data: file,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// export function postUploadForWord (file,numberOfPrintedPages,printingDirection) {
//     return request({
//         url: '/printer/uploadword?numberOfPrintedPages='+numberOfPrintedPages+'&printingDirection='+printingDirection,
//         method: 'post',
//         data: file,
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })
// }


export function updataforuser(data){
    return request({
        url:'/user/updataforuser',
        method:'put',
        data
    });
}

export function updataforuserself(data){
    return request({
        url:'/user/updataforuserself',
        method:'put',
        data
    });
}



export function uploadImage(data){
    return request({
        url:'/common/uploadimage',
        method:'post',
        config:{headers: {'Content-Type': 'multipart/form-data'}},
        data
    });
}

export function updatauserstatus(data){
    return request({
        url:'/user/updatauserstatus',
        method:'put',
        data
    });
}

export function changePassWord(id,username,password,newpassword,checknewpassword){
    return request({
        url:'/user/changepassword',
        method:'put',
        data:{
            id:String(id),
            username:String(username),
            password:String(password),
            newpassword:String(newpassword),
            checknewpassword:String(checknewpassword)
        }
    });
}