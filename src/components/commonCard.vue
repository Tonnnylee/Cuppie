<template>
	<div class="commonCard">
		<img :src="imgUrl" lazy="loading" class="classCard-img">
		<p class="commonTitle">{{ commonTitle }}</p>
		<div class="sub-wrap">
			<div class="amount pull-left">
				{{ amount }}
			</div>
			<div class="classLook pull-right">
				{{ commonLook }}
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name:'v-commonCard',
		props: {
			commonObj: {
				type: Object
			}
		},
		data(){
			return{
				commonLook:'查看'
			}
		},
		computed: {
			imgUrl() {
				if(this.commonObj){
					return this.commonObj.coverUrl;
				}
			},
			commonTitle() {
				if(this.commonObj.commonTitle){
					return this.commonObj.commonTitle;
				}
			},
			amount() {
				if(this.commonObj.amount){
					return this.commonObj.amount;
				}
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/commonCard.less";
</style>