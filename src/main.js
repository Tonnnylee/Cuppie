// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import store from './vuex/store';
import VueRouter from 'vue-router';
import routes from './router/index';
import vueResource from 'vue-resource';
import infiniteScroll from 'vue-infinite-scroll';
import VueLazyload from 'vue-lazyload';
import AV from 'leancloud-storage';

import 'common/css/common.less'; //公共样式

//inject plugins
Vue.use(infiniteScroll);
Vue.use(VueRouter);
Vue.use(vueResource);

Vue.use(VueLazyload, {
	error: require('./assets/404.png'),
	loading: require('./assets/loading.gif'),
	attempt: 1
});

//inital AV
const appId = 'Y4jjtYdC5pYT9Yziv35zId2u-gzGzoHsz';
const appKey = 'AxXbuk03QneniP8rIvfNdywj';
AV.init({ appId, appKey });

//inital realtime
// var realtime = new RT.Realtime({
// 	appId: 'Y4jjtYdC5pYT9Yziv35zId2u-gzGzoHsz',
// 	region: 'cn'
// });

const router = new VueRouter({
	mode:'history',
	'linkActiveClass': 'active',
	routes, //相当于 routes: routes
	scrollBehavior (to, from, savedPosition) {
	  return { x: 0, y: 0 }
	}
});
/**
 * 创建挂载根实例。
 * 注册路由，从而让整个应用都有路由功能
 */
var routerApp = new Vue({
	store,
	router
}).$mount('#app');

routerApp.$watch('store.state.showLogin',function(){
	if(store.state.showLogin){
		this.$store.commit("UPDATE_SHOWUSER",false);
	}
})

export default routerApp;


