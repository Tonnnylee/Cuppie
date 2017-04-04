<template>
	<div class="card">
		<img :src="imgUrl" lazy="loading" class="card-img">
		<p class="imgTitle">{{ imgTitle }}</p>
		<div class="user-concise">
			<router-link :to="{ name: 'otherUser', params:{userId:userId
			} }">
			<div v-show="ifhead" class="user-head pull-left">
				<img :src="headUrl" alt="">
			</div>
			<div class="concise-name ">
				{{ userName }}
			</div>
			</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'v-card',
		props: {
			imgObj: {
				type: Object
			}
		},
		data(){
			return{
				ifhead:false
			}
		},
		created(){
		},
		computed: {
			imgUrl() {
				if(this.imgObj){
					 return this.imgObj.pictureUrl;
				}
			},
			headUrl() {
				if(this.imgObj.headUrl){
					this.ifhead = true;
					return this.imgObj.headUrl;
				}else{
					this.ifhead = false;
					return false;
				}
				
			},
			imgTitle() {
				if(this.imgObj.imgTitle){
					return this.imgObj.imgTitle;
				}
			},
			userName() {
				if(this.imgObj.userName){
					return this.imgObj.userName;
				}
			},
			conciseClass() {
				if(this.imgObj.classTitle){
					return this.imgObj.classTitle;
				}
			},
			userId(){
				if(this.imgObj.ownerId){
					return this.imgObj.ownerId;
				}
			}
		}
	};
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/card.less";
</style>