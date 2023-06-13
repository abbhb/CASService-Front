import App from '../App.vue'
import NotFound from "@/views/NotFound";
import index from "@/views/index";
import login from "@/views/login/login";
import UserInfo from "@/views/user/UserInfo";
import ChangePassword from "@/views/user/ChangePassword";
import UserManagement from "@/views/admin/UserManagement.vue";
import safeCenter from "@/views/user/SafeCenter.vue";
import en from "@/views/redirect/en.vue";
import gitee from "@/views/redirect/gitee.vue";
import InviteCode from "@/views/admin/invitecode/InviteCode.vue";
import findPassword from "@/views/user/FindPassword.vue";
import safeLogout from "@/views/logout/safeLogout.vue";
import MangerOauth from "@/views/oauth/MangerOauth.vue";
import dh from "@/views/dh/dh.vue";
import navfenleiitem from "@/views/nav/navfenleiitem.vue";
import navfenlei from "@/views/nav/navfenlei.vue";

export default [
	{
		path: '/',
		component: App,
		meta: {
			requireAuth: false,
			needrole: false
		},
		children: [
			{
				path: '',
				redirect: '/login',
				meta:{
					requireAuth: false,
					needrole:false
				}
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: login,
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
	{
		path: '/redirect-en',
		name: 'redirect-en',
		component: en,
		meta: {
			requireAuth: false,
			needrole: false
		}
	},
	{
		path: '/dh',
		name: 'dh',
		component: dh,
		meta: {
			requireAuth: true,
			needrole: false
		}
	},
	{
		path: '/redirect-gitee',
		name: 'redirect-gitee',
		component: gitee,
		meta: {
			requireAuth: false,
			needrole: false
		}
	},
	{
		path: '/findPassword',
		name: 'findPassword',
		component: findPassword,
		meta: {
			requireAuth: false,
			needrole: false
		}
	},

	{
		path: '/safeLogout',
		name: 'safeLogout',
		component: safeLogout,
		meta: {
			requireAuth: true,
			needrole: false
		}
	},
	{
		path: '/404',
		name: 'NotFound',
		component: NotFound,
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
	{
		path: '/index',
		name: 'index',
		component: index,
		meta:{
			requireAuth: true,
			needrole:false
		},
		children: [
			{
				path: '/userinfo',
				name: 'userinfo',
				component: UserInfo,
				meta: {
					requireAuth: true,
					needrole: false
				}
			},

			{
				path: '/navfenlei',
				name: 'navfenlei',
				component: navfenlei,
				meta: {
					requireAuth: false,
					needrole: false
				}
			},
			{
				path: '/navfenleiitem',
				name: 'navfenleiitem',
				component: navfenleiitem,
				meta: {
					requireAuth: false,
					needrole: false
				}
			},
			{
				path: '/changepassword',
				name: 'changepassword',
				component: ChangePassword,
				meta: {
					requireAuth: true,
					needrole: false
				}
			},
			{
				path: '/UserManagement',
				name: 'UserManagement',
				component: UserManagement,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[10,1]
				}
			},
			{
				path: '/MangerOauth',
				name: 'MangerOauth',
				component: MangerOauth,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[10]
				}
			},
			{
				path: '/safecenter',
				name: 'safecenter',
				component: safeCenter,
				meta:{
					requireAuth: true,
					needrole:false
				}
			},
			{
				path: '/InviteCode',
				name: 'InviteCode',
				component: InviteCode,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[10,1]
				}
			},

		]
	},
	{
		path: '*',
		name: '*',
		redirect: '/404',
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
];

