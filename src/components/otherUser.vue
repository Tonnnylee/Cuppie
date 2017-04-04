<template>
	<div class="otherUser">
		<v-header :data="headerData"></v-header>
		<user-index :data="userId"></user-index>
	</div>
</template>

<script>
	import vHeader from './Header.vue';
	import userIndex from './UserIndex.vue';
	import { swiper, swiperSlide } from 'vue-awesome-swiper';
	import AV from 'leancloud-storage';
	export default {
		name: 'v-other-user',
		components: {
			vHeader,
			swiper,
			swiperSlide,
			userIndex
		},
		data() {
			return{
				headerData:{
					headerTitle:"",
					showDismiss: false,
				    showReturn:true,
				    showUploadBtn:false,
				    showGear:false,
				    likeObj:{
				   	 showLike:false,
				   	 unlike:false
				    },
				   	follow:true,
				   	envelope:true
				},
				userId:''
			}
		},
		created(){
			this.userId = this.$route.params.otherUserId
		}
	}
</script>