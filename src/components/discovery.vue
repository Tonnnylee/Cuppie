<template>
	<div class="discovery">
	   <v-header :data="headerData"></v-header>
	   <div class="discovery-content">
	   	   <div class="classHeader">
	   	   	  <div class="class-card" v-for="classindex in classArr">
	   	   	  	 <router-link :to="{ name: 'disClassDetail', params:{ classId:classindex.classId } }">
	   	   	  	 	<v-disClassCard :classCardObj="classindex">
	   	   	  	 	</v-disClassCard>
	   	   	  	 </router-link>
	   	   	  </div>
	   	   </div>
		   <p class="faxiancaiji">{{ gapTitle }}</p>	 
	   	   <div class="picture-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
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
	   </div>
	</div>
</template>

<script>
	import vCard from './Card.vue';
	import AV from 'leancloud-storage';
	import vHeader from './Header.vue';
	import {mapState} from 'vuex';
	import vDisClassCard from './disClassCard.vue';
	export default {
		name: 'v-home',
		data() {
			return {
				leftData:[],
				rightData:[],
				busy:false,
				time: '',
				gapTitle:'发现采集',
				amount:5,
				classArr:[],
				skips:0,
				headerData:{
					headerTitle:"发现",
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
				   	 show:false
				   }
				}
			};
		},
		components:{
			vCard,
			vHeader,
			vDisClassCard
		},
		created() {
			this.createClasses();
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
				//按时间，降序排列
				query.descending('createAt');
				//限定每次返回6个数据
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
									}else if((index + 1) % 2 !== 1){
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
			  },
			  createClasses(){
			  	var vm = this;
				var query = new AV.Query('Classification');
				query.include('owner');
				query.descending('createAt');
				//查找每个类
				query.find().then(function(products){
					//遍历每个类
					for(var product of products){
						vm.classAmount++;
						var coverUrl = null;
						var classTitle = '';
						var classId = null;
						var classifi = AV.Object.createWithoutData('Classification', product.id);
						var classImg = new AV.Query('Picture');
						classImg.include("dependency");
						classImg.equalTo('dependency', classifi);
						classImg.find().then(function(classImgs){
							 classTitle = classImgs[0].get("classTitle");
							 coverUrl = classImgs[0].get("image").get("url");
							 classId = classImgs[0].get('dependency').id;
							 vm.classArr.push({
							 	classId,
								classTitle,
								coverUrl
							});
						})
					}
				}).catch(function(error){
					console.error(JSON.stringify(error));
				})
			  }
		}
	}
</script>

<style lang="less" rel="stylesheet/less" scope>
	@import '../less/discovery.less';
</style>