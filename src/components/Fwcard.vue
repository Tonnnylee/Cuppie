<template>
	<div class="fwcard">
		<img :src="headUrl" alt="" class="pull-left">
		<div class="fwcard-username pull-right">
			{{ username }}
		</div>
	</div>
</template>

<script>
	export default {
		name: 'v-fwcard',
		props: {
			cardObj: {
				type: Object
			}
		},
		computed: {
			headUrl() {
				return this.cardObj.headUrl;
			},
			username(){
				return this.cardObj.username;
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/fwcard.less";
</style>