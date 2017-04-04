<template>
	<nav class="nav">
		<router-link :to="'/home'">
			<div @click="homeEvent" class="nav-icon">
				<i class="iconfont icon-Cup" :class="{active: isAcitveHome}"></i>
			</div>
		</router-link>
		<router-link :to="'/discovery'">
			<div  @click="discoveryEvent" class="nav-icon">
				<i class="iconfont icon-faxian3" :class="{active: isAcitveDis}"></i>
			</div>
		</router-link>
		<router-link :to="'/tips'">
			<div  @click="tipsEvent" class="nav-icon">
				<i class="iconfont icon-tishi1 tipsIcon" :class="{active: isActiveTips}"></i>
			</div>
		</router-link>
		<router-link :to="{name:'user', params:{userId:userId}}">
			<div  @click="userEvent" class="nav-icon">
				<i class="iconfont icon-yonghu1" :class="{active: isActiveUser}"></i>
			</div>
		</router-link>
	</nav>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	import AV from 'leancloud-storage';
	const NAV_CONVERT = { 'index':'首页','discovery':'发现','tips':'提示','user':'用户' }
	export default{
		name: 'v-nav',
		props: {
			show: {
				type: Boolean
			}
		},
		watch:{
			"$route":"initEvent"
		},
		created(){
			this.initEvent();
		},
		data(){
			return {
				NAV_CONVERT:NAV_CONVERT,
				userId:null,
				username:null,
				isAcitveHome:true,
				isAcitveDis:false,
				isActiveTips:false,
				isActiveUser:false
			}
		},
		computed: {
			...mapState([
				'navs'
			]),
			...mapGetters([
				'user'
			])
		},
		methods: {
			initEvent(){
				var vm = this;
				if(AV.User.current()){
					//能获取id
					vm.userId = AV.User.current().id;
					vm.username = AV.User.current().getUsername();
					console.log("works");
					vm.$store.commit("UPDATE_SHOWUSER", true);
					vm.$store.commit("UPDATE_USER", {
						id:vm.userId,
						username:vm.username,
						userSex:'Unknown'
					});
					console.log(vm.$store.state.user.username);
				}else{
					vm.$store.commit("UPDATE_SHOWUSER", false);
					  vm.$store.commit("UPDATE_USER", {
					  	 id:'no',
					  	 username:'Nobody',
					  	 userSex:'Unknown'
					  });
					console.log("no id");
					vm.userId = 'no';
				}
			},
			homeEvent(){
				var vm = this;
				vm.isAcitveHome = true
				vm.isAcitveDis = false
				vm.isActiveTips=false
				vm.isActiveUser=false
			},
			discoveryEvent(){
				var vm = this;
				vm.isAcitveHome = false
				vm.isAcitveDis = true
				vm.isActiveTips=false
				vm.isActiveUser=false
			},
			tipsEvent(){
				var vm = this;
				vm.isAcitveHome = false
				vm.isAcitveDis = false
				vm.isActiveTips=true
				vm.isActiveUser=false
			},
			userEvent(){
				var vm = this;
				vm.isAcitveHome = false
				vm.isAcitveDis = false
				vm.isActiveTips=false
				vm.isActiveUser=true
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/nav.less";
</style>

