<template>
	<div class="setting">
		<v-header :data="headerData"></v-header>
		<div class="setting-wrap">
			<div class="setting-list">
				<router-link :to="{name:'userSetting'}">
					{{ settings[0] }}
				</router-link>
			</div>
			<div class="setting-list">
				<router-link :to="{name: 'about'}">
					{{ settings[1] }}
				</router-link>
			</div>
			
			<div class="setting-list">
				<router-link :to="{name:'feedback'}">
				{{ settings[2] }}
				</router-link>
			</div>
			
			<div @click="logoutEvent" class="setting-list logout">
				{{ settings[3] }}
			</div>
		</div>
		<transition name="fade" mode="out-in">
		  <router-view></router-view>
		</transition>
	</div>
</template>

<script>
	import vHeader from './Header.vue';
	import AV from 'leancloud-storage';
	import {mapState} from 'vuex';
	export default {
		name: 'v-setting',
		components: {
			vHeader,
		},
		data(){
			return{
				headerData:{
					headerTitle: '设置',
					showDismiss: false,
					showReturn:true,
					showUploadBtn:false,
					showGear:false,
					likeObj:{
				   	 showLike:false,
				   	 liked:false,
				   	 unlike:false
				   }
				}
			}
		},
		created() {

		},
		computed:{
			...mapState([
				'settings'
			])
		},
		methods:{
			logoutEvent(){
				AV.User.logOut();
				this.$router.push({ name:'home'});
				this.$store.commit("UPDATE_LOGIN", true);
				this.$store.commit("UPDATE_SHOWUSER", false);
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import '../less/setting.less';
</style>