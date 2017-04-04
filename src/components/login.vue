<template>
	<div v-show="showLogin" class="login">
		<v-header :data="headerData"></v-header>
		<div class="login-container">
			<div class="login-header">{{ loginHeader }}</div>
			<div class="input-wrap">
				<input type="text" v-model="username" name="username" placeholder="填写你的用户名" />
				<input type="password" v-model="password" name="password" placeholder="填写你的密码" />
				<input type="submit" name="login" class="btn" @click="loginEvent" value="登录">
				<button @click="gotoSignup" class="gotoSignup pull-right">注册</button>
			</div>
		</div>
	</div>
</template>

<script>
	import AV from 'leancloud-storage';
	import vHeader from './Header.vue';
	import router from 'vue-router';
	import {mapState} from 'vuex';
	export default {
		name: 'v-login',
		components: {
		  vHeader
		},
		watch: {
		},
		data(){
			return {
				loginHeader: 'Cuppie账号登录',
				username: '',
				password: '',
				headerData:{
					headerTitle:'登录',
					showDismiss: true,
					showReturn:false,
					showUploadBtn:false,
					showGear:false,
				    likeObj:{
				   	 showLike:false,
				   	 liked:false,
				   	 unlike:false
				   },
				   lowpoly:{
				   	 show:false
				   }
				}
			}
		},
		computed: {
			...mapState([
				'showLogin'
			])
		},
		methods: {
			loginEvent(){
				var username = this.username;
				var password = this.password;
				var vm = this;
				vm.$store.commit("UPDATE_LOADING", true);
				AV.User.logIn(username, password).then(function (loginedUser) {	
					vm.$store.commit("UPDATE_CURRENTUSER", loginedUser);
					vm.$store.commit("UPDATE_SHOWUSER", true);
					vm.$router.push({ name:'home'});
					vm.$store.commit("UPDATE_TIPS", true);
						vm.$store.commit("UPDATE_TIPSMESSAGE", "登录成功");
						setTimeout(function(){
							vm.$store.commit("UPDATE_TIPS", false);
						},3000)
					vm.$store.commit("UPDATE_LOGIN", false);
					
				}, function(error){
					alert(JSON.stringify(error));
					alert("用户名或者密码错误！");
					vm.$store.commit("UPDATE_LOADING", false);
				})
			},
			gotoSignup(){
				this.$store.commit("UPDATE_SIGNUP", true);
				this.$store.commit("UPDATE_LOGIN", false);
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/login.less";
</style>