import Vue from 'vue'
import Login from '@/components/page/login/Login'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
import store from '@/vuex/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import axios from 'axios'
//import VueLazyload from 'vue-lazyload'
import util from '@/assets/js/util.js'

Vue.config.productionTip = false
//Vue.use(VueLazyload, {
//	preLoad: 1.3,
//	error: require('./assets/img/image_head.png'), //这个是请求失败后显示的图片
//	loading: require('./assets/img/image_head.png'), //这个是加载的loading过渡效果
//	try: 2 // 这个是加载图片数量
//})
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(util)
//全局时间过滤器
import moment from 'moment';


Vue.filter('dateFmt', (input, formatString) => {
	if(!!input) {
		formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
		return moment(input).format(formatString);
	}
})

const router = new VueRouter({
	routes
})

//vue实例
var app = new Vue({
	data: {},
	el: '#app',
	history: false,
	render: h => h(App),
	store, 
	router
})
router.beforeEach((to, from, next) => {
	if (to.path == '/') {
    	localStorage.removeItem('user');
    }
	let userInfo = JSON.parse(localStorage.getItem('user'));
	if(userInfo) {
		next();
	} else {
		if(to.path == '/' || to.path == '/register' || to.path == '/register-upload' || to.path == '/forgot-password' || to.path == '/set-password' || to.path == '/apply-suc' || to.path == '/apply-fail') {
			next();
		} else {
			next('/');
		}
	}
});
//监听返回事件
//window.addEventListener("popstate", function(e) {
//	location.reload();
//}, false);