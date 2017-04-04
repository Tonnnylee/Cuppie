import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import getters from './getters';
import uz from '../common/js/nav.js';
import AV from 'leancloud-storage';

Vue.use(Vuex);

//init state
var state = {
	headerTitle: '首页',
	showReturn: false,
	showDismiss:false,
	showLogin:false,
	showSignup:false,
	showUpload: false,
	showUserIndex: false,
	loadingShow: false,
	tipsShow:false,
	tipsMessage:'for-test',
	showUploadBtn:false,
	navs:uz.NAME_TITLE,
	currentUser:false,
	user:{
		username:'update',
		id:'no',
		userSex:'Unknown'
	},
	settings:[
		'个人设置',
		'关于cuppie',
		'用户反馈',
		'退出登录'
	],
	// users:[],
	// currentUser:{}
	// lists: {
	// 	categories: [],
	// 	images:[]
	// }
};

var mutations = {
	UPDATE_LOADING(state, data) {
		state.loadingShow = data;
	},
	UPDATE_PRODUCTS(state, data) {
		state.users.push()
	},
	UPDATE_LOGIN(state, data) {
		state.showLogin = data;
	},
	UPDATE_SIGNUP(state, data) {
		state.showSignup = data;
	},
	UPDATE_RETURN(state, data) {
		state.showReturn = data;
	},
	UPDATE_DISMISS(state, data) {
		state.showDismiss = data;
	},
	UPDATE_UPLOAD(state, data) {
		state.showUpload = data;
	},
	UPDATE_UPLOADBTN(state, data) {
		state.showUploadBtn = data;
	},
	UPDATE_USER(state, payload) {
		state.user.id = payload.id;
		state.user.username = payload.username;
		state.user.userSex = payload.userSex;
	},
	UPDATE_SHOWUSER(state, data){
		state.showUserIndex = data;
	},
	UPDATE_CURRENTUSER(state, data){
		state.currentUser = data;
	},
	UPDATE_TIPS(state, data){
		state.tipsShow = data;
	},
	UPDATE_TIPSMESSAGE(state, data){
		state.tipsMessage = data;
	}
}

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters
})