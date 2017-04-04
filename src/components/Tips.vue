<template>
	<transition name="tipsFade">
		<div v-show="show" class="tips">
			{{ tipsMessage }}
		</div>
	</transition>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		name: 'tips',
		props: {
			show: {
				type: Boolean
			}
		},
		created(){

		},
		computed: {
		    ...mapState([
		      'tipsShow','tipsMessage'
		    ])
		},
	}
</script>

<style lang="less" rel="stylesheet">
	@import '../less/tips.less';
</style>