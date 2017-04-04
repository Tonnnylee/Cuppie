<template>
	<div class="disClassCard">
		<img :src="imgUrl" lazy="loading" class="classCard-img">
		<p class="classTitle">{{ classTitle }}</p>
	</div>
</template>

<script>
	export default {
		name:'v-disClassCard',
		props:{
			classCardObj: {
				type:Object
			}
		},
		data(){
			return{
				amount:0
			}
		},
		computed: {
			imgUrl() {
				if(this.classCardObj){
					return this.classCardObj.coverUrl;
				}
			},
			classTitle() {
				if(this.classCardObj.classTitle){
					return this.classCardObj.classTitle;
				}
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/disClassCard.less";
</style>