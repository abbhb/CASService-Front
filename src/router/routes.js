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
export default [
	{
		path: '/',
		component: App,
		meta:{
			requireAuth: false,
			needrole:false
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
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
	{
		path: '/redirect-gitee',
		name: 'redirect-gitee',
		component: gitee,
		meta:{
			requireAuth: false,
			needrole:false
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
				meta:{
					requireAuth: true,
					needrole:false
				}
			},
			{
				path: '/changepassword',
				name: 'changepassword',
				component: ChangePassword,
				meta:{
					requireAuth: true,
					needrole:false
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
				path: '/safecenter',
				name: 'safecenter',
				component: safeCenter,
				meta:{
					requireAuth: true,
					needrole:false
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

