<template>
	<div class="home-wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"> 
		<v-header :data="headerData"></v-header>
		<div class="home-content">
			<figure v-for="data in leftData">
			   	<router-link :to="{name:'pictureDetail',params:{ pictureId:data.pictureId }}">
				<v-card :imgObj="data"></v-card>
				</router-link>
			</figure>
		</div>
		<div class="home-content">
			<figure v-for="data in rightData">
				<router-link :to="{name:'pictureDetail',params:{ pictureId:data.pictureId }}">
				<v-card :imgObj="data"></v-card>
				</router-link>
			</figure>
		</div>
	</div>
</template>
<script>
	import vCard from './Card.vue';
	import AV from 'leancloud-storage';
	import vHeader from './Header.vue';
	export default {
		name: 'v-home',
		data() {
			return {
				leftData: [],
				rightData: [],
				busy: false,
				page: 1,
				time: '',
				amount:5,
				headUrl:'',
				skips:0,
				headerData:{
					headerTitle:"首页",
					showDismiss: false,
					showReturn:false,
					showUploadBtn:false,
					showGear:false,
				    likeObj:{
				   	 showLike:false,
				   	 liked:false,
				   	 unlike:false
				   },
				   lowpoly:{
				   	 show:true
				   }
				}
			};
		},
		components: {
			vCard,
			vHeader
		},
		created() {
			this.loadMore();
		},
		methods: {
			loadMore() {
				var vm = this;
				vm.busy = true;
				vm.$store.commit('UPDATE_LOADING', true);
				if(!new AV.Query('Picture')){
					vm.$store.commit('UPDATE_LOADING', false);
					return false;
				}
				var query = new AV.Query('Picture');
				query.include('owner');
				query.include('image');
				//导出当前ID的图片
				if(AV.User.current()){
					var ownerFolder = AV.Object.createWithoutData('_User', AV.User.current().id);
				    query.equalTo('owner', ownerFolder);
				}
				//按时间，降序排列
				query.descending('createAt');
				//限定每次返回5个数据
				query.limit(6);
				//跳过数量
				query.skip(vm.skips);
				//请求图片
				query.find().then(function(products) {
					vm.amount = products.length;
					if(vm.amount == 0){
						vm.$store.commit('UPDATE_LOADING', false);
						return false;
					}
					products.forEach(function(product,index) {
						var imgTitle = product.get('title');
						var imgDescription = product.get('description');
						var releaseTime = (product.createdAt.getMonth() + 1) + '/' + product.createdAt.getDate() + '/' +  product.createdAt.getFullYear();
						//获取用户
						var userName = product.get('owner').get('username');
						var ownerId = product.get('owner').id;
						//获取头像
						var queryUser = new AV.Query('Profile');
						var headUrl = '';
						queryUser.include('owner');
						queryUser.find().then(function(results) {
							for(var i=0; i<results.length; i++){
								var resultId = results[i].get('owner').id;
								//获取到和图片相符的用户头像
								if(resultId == ownerId){
									headUrl = results[i].get('image').get('url');
									var picture = product.get('image');
									var pictureId = product.id;
									var pictureUrl;
									if(picture){
										pictureUrl = picture.get('url');
									} else {
										pictureUrl = './../storage.png'
									}
									var imgObj = {
										imgTitle,
										imgDescription,
										userName,
										pictureUrl,
										releaseTime,
										pictureId,
										headUrl,
										ownerId
									}
									if((index + 1) % 2 === 1){
										vm.leftData = vm.leftData.concat(imgObj);
									
									}else if((index +1) % 2 === 0){
										vm.rightData = vm.rightData.concat(imgObj);
									}
									vm.busy = false;
									vm.$nextTick(() => {
										vm.$store.commit('UPDATE_LOADING', false);
									})
									break;
								}		
							}
						})
					});
				vm.skips = vm.skips + 6;
				}).catch(function(error) {
					alert(JSON.stringify(error));
				})
			  }
			}
		}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/home.less";
</style>