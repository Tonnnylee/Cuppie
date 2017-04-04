<template>
	<div v-show="showSignup" class="signup">
		<v-header :data="headerData"></v-header>
		<div class="signup-container">
			<div class="signup-header">{{ signupHeader }}</div>
			<div class="input-wrap">
				<input type="text" v-model="username" name="username" placeholder="填写你的昵称/用户名" />
				<input type="password" v-model="password1" name="password1" placeholder="请输入密码" />
				<input type="password" v-model="password2" name="password2" placeholder="确认密码" />

				<input type="text" name="Email" v-model="email" placeholder="填写你的邮箱">

				<input type="submit" name="signup" class="btn" @click="signupEvent" value="注册">

				<button @click="gotoLogin" class="gotoLogin pull-right">登录</button>
			</div>
		</div>
	</div>
</template>

<script>
	import AV from 'leancloud-storage';
	import vHeader from './Header.vue';
	import {mapState} from 'vuex';
	export default {
		name: 'v-signup',
		components: {
			vHeader
		},
		data () {
			return {
				signupHeader: 'Cuppie账号注册',
				username: '',
				password1: '',
				password2: '',
				email: '',
				headerData:{
					headerTitle:'注册',
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
		watch: {
		},
		created(){
			this.$store.commit("UPDATE_DISMISS", false);
		},
		computed: {
			...mapState([
				'showSignup'
			])
		},
		methods: {
			signupEvent(){
				var vm = this;
				var username = vm.username;
				var password1 = vm.password1;
				var password2 = vm.password2;
				var email = vm.email;
				//两个密码正确
				if( password1 === password2){
					var user = new AV.User();
					user.setUsername(username);
					user.setPassword(password2);
					user.setEmail(email);
					vm.$store.commit("UPDATE_LOADING", true);
					user.signUp().then(function (loginedUser) {
						console.log("signup success!");
						vm.$store.commit("UPDATE_LOADING", false);
						vm.$store.commit("UPDATE_SIGNUP",false);
						vm.$store.commit("UPDATE_SHOWUSER",true);
						vm.$store.commit("UPDATE_USER",{
							id:loginedUser.id,
							username:username,
							userSex:'Unknown'
						});
						var pathRoad = '/user/'+loginedUser.id;
						vm.$router.push({ path:pathRoad });
						vm.$store.commit("UPDATE_TIPS", true);
						vm.$store.commit("UPDATE_TIPSMESSAGE", "注册成功");
						setTimeout(function(){
							vm.$store.commit("UPDATE_TIPS", false);
						},2000)
						//vm.$store.commit("UPDATE_CURRENTUSER", loginedUser);
					}, (function (error) {
						alert(JSON.stringify(error));
					}));

					//添加到用户表
					var Users = AV.Object.extend('Users');
					var users = new Users();
					users.set('username', username);
					users.set('password', password2);
					users.set('email', email);
					users.set('owner',AV.User.current());
					users.save().then(function(users){
						console.log("save users");
					}).catch(function(error){
						console.error(error);
					})
				}else{
					alert("You have two different passwords");
				}
			},
			gotoLogin(){
				this.$store.commit("UPDATE_LOGIN", true);
				this.$store.commit("UPDATE_SIGNUP", false);
			}
		},
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/signup.less";
</style>