
import router from "@/router";
export function inject(service) {
    // request拦截器
    //添加请求拦截器，若token存在则在请求头中加token，不存在也继续请求
    service.interceptors.request.use(
        (config) => {
            // console.log(config, 'config')
            config.headers['Content-Type'] = 'application/json' // 关键所在
            // 可以进行token验证
            return config;
        },
        (error) => {
            Promise.reject(error);
        }
    );
    // response拦截器
    service.interceptors.response.use(
        (response) => {
            console.log(response)
            switch (response.data.status) {
                case 900:
                    //可能是票过期，清除它
                    sessionStorage.clear()
                    localStorage.clear()
                    router.replace({ //跳转到登录页面
                        path: '/login',
                        // 将跳转的路由path作为参数，登录成功后跳转到该路由
                        query: { redirect: router.currentRoute.value.fullPath }
                    });
            }
            switch(response.status){

                //token校验
                case 401:
                    //可能是token过期，清除它
                    sessionStorage.clear()
                    localStorage.clear()
                    router.replace({ //跳转到登录页面
                        path: '/login',
                        // 将跳转的路由path作为参数，登录成功后跳转到该路由
                        query: { redirect: router.currentRoute.fullPath}
                    });
            }
            // 对返回的数据进行错误码处理
            return response.data
        },
        (error) => {
            // console.log(JSON.stringify(error))
            switch (error.response.status) {
                case 400: error.message = '请求错误(400)';
                    break;
                case 401:

                    error.message = '未授权，请重新登录(401)';
                    sessionStorage.clear()
                    localStorage.clear()
                    router.replace({ //跳转到登录页面
                        path: '/login',
                        // 将跳转的路由path作为参数，登录成功后跳转到该路由
                        query: { redirect: router.currentRoute.fullPath }
                    });
                    break;
                case 900:
                    error.message = '未授权，请重新登录(900)';
                    sessionStorage.clear()
                    localStorage.clear()
                    router.replace({ //跳转到登录页面
                        path: '/login',
                        // 将跳转的路由path作为参数，登录成功后跳转到该路由
                        query: { redirect: router.currentRoute.fullPath }
                    });
                    break;
                case 403: error.message = '拒绝访问(403)';
                    break;
                case 404: error.message = '请求出错(404)';
                    break;
                case 408: error.message = '请求超时(408)';
                    break;
                case 500: error.message = '服务器错误(500)';
                    break;
                case 501: error.message = '服务未实现(501)';
                    break;
                case 502: error.message = '网络错误(502)';
                    break;
                case 503: error.message = '服务不可用(503)';
                    break;
                case 504: error.message = '网络超时(504)';
                    break;
                case 505: error.message = 'HTTP版本不受支持(505)';
                    break;
            }

        }
    );
}



export default inject;
