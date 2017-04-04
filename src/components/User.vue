<template>
	<div class="user">
		<v-header :data="headerData"></v-header>
		<v-login></v-login>
		<v-signup></v-signup>
		<v-upload></v-upload>
		<user-index :data="userId"></user-index>
	</div>
</template>

<script>
	import vLogin from './login.vue';
	import vSignup from './signup.vue';
	import vUpload from './Upload.vue';
	import userIndex from './UserIndex.vue';
	import vHeader from './Header.vue';
	import { swiper, swiperSlide } from 'vue-awesome-swiper';
	import AV from 'leancloud-storage';
	export default {
		name: 'v-user',
		components: {
			vLogin,
			vSignup,
			vUpload,
			swiper,
			swiperSlide,
			userIndex,
			vHeader
		},
		data(){
			return{
				headerData:{
				   headerTitle:'用户',
				   showDismiss: false,
				   showReturn:false,
				   showUploadBtn:true,
				   showGear:true,
				   likeObj:{
				   	 showLike:false,
				   	 liked:false,
				   	 unlike:false
				   },
				    lowpoly:{
				   	 show:false
				   }
			   },
			   userId:''
			}
		},
		created() {
			var eThis = this;
			//如果没有登录
			if(!AV.User.current()){
				eThis.$store.commit("UPDATE_LOGIN", true);
				eThis.$store.commit("UPDATE_SIGNUP", false);
			}else{
				eThis.$store.commit("UPDATE_SHOWUSER", true);
				eThis.userId = AV.User.current().id;
			}
		},
		methods:{
		
		}
	}
</script>