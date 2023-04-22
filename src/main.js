import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.scss'
import './assets/scss/global.scss'
import router from "@/router";

//全局变量
let globl = {
  isNeedZoom:false,
  Version:'3.0.0',
}
Vue.config.productionTip = false;
Vue.prototype.$globl=globl


Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
