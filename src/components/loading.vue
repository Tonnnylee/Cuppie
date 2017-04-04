<template>
	<div v-show="show" class="loading">
        <div class="loading-spinner"></div>
     </div>
</template>

<script>
	export default {
		name: 'v-loading',
		props: {
			show: {
				type: Boolean
			}
		}
	};
</script>

<style type="less" rel="stylesheet/less">
	@import "../less/loading.less";
</style>