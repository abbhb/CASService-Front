import request from "@/http/request";


export function getImage(id) {
    return request({
        url:'/common/getImage',
        method:'get',
        params:{
            id:id
        }
    })
}
