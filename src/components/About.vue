<template>
	<div class="about">
		<v-header :data="headerData"></v-header>
		<div class="about-wrap">
			<div class="logo">
				<img src="../assets/logo.jpg" alt="logo">
			</div>
			<div class="about-content">
				<p>Cuppie，陪你做美物的发现者。<br/>让你随时随地，发现，收藏你喜欢的一切，还能将图片转化成lowpoly风格</p>
			</div>
		</div>
	</div>
</template>

<script>
	import vHeader from './Header.vue';
	export default {
		namd: 'v-about',
		components:{
			vHeader
		},
		data(){
			return {
				headerData:{
					headerTitle: '关于Cuppie',
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
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/about.less";
</style>