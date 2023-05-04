import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import Cookies from 'js-cookie'
Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'hash',//改为history模式，去除url里的#，history模式里不方便打包
	routes
});


router.beforeEach((to, from, next) => {
	console.log("to")
	console.log(to)
	if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
		if (Cookies.get('tgc')) {
			if (to.meta.needrole){
				// console.log(to.meta.roles)
				// console.log(localStorage.getItem("permission"))
				var roles = to.meta.roles
				var per = localStorage.getItem("permission")

				console.log(roles.includes(Number(per)))
				if(roles.includes(Number(per))){
					next()	//放行
				}else{
					router.push({path:"/404",query:{address:to.fullPath,type:"PERMISSION_FAILED"}})
				}


			}
			next()	//放行

		} else {
			router.push({
				path: '/login',
				query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	} else {//不需要认证的路由不存在权限的问题

		next()	//放行
		// if(to.meta.roles.includes(quanxian)){
		//
		// 	console.log("存在")
		//
		// }else{
		// 	router.push({name: 'NotFound'})
		//
		// 	// next({path:"/404"})	//跳到404页面
		// }
	}
})
export default router;
