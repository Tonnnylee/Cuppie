<template>
	<div class="classDetail" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
		<v-header :data="headerData"></v-header>
		<div class="detail-container">
			<div class="detail-header">{{ detailHeader }}</div>
			<div class="detail-author">
				{{ author }}
			</div>
			<div class="picture-lists">
				<div class="card-wrap" v-for="data in cards">
					<router-link :to="{name:'pictureDetail', params:{ pictureId:data.pictureId }}">
					  <v-card :imgObj="data"></v-card>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import vCard from './Card.vue';
	import AV from 'leancloud-storage';
	import vHeader from './Header.vue';
	export default {
		name: 'v-classDetail',
		data(){
			return {
				headerData:{
					headerTitle:'',
					showDismiss:false,
					showReturn:true,
					showUploadBtn:false,
					likeObj:{
				   	 showLike:false,
				   	 liked:false,
				   	 unlike:false
				   },
				    lowpoly:{
				   	 show:false
				   }
				},
				classId:this.$route.params.classId,
				skips:0,
				amount:0,
				cards:[],
				busy:false,
				detailHeader:'',
				author:'',
				pictureId:null
			};
		},
		components:{
			vCard,
			vHeader
		},
		created() {
			this.loadMore();
		},
		methods: {
			loadMore () {
				var vm = this;
				vm.busy = true;
				this.$store.commit("UPDATE_LOADING", true);
				var classObj = AV.Object.createWithoutData('Classification', vm.classId);
				var query = new AV.Query('Picture');
				query.include('owner');
				query.include('image');
				query.descending('createAt');
				query.limit(4);
				query.skip(vm.skips);
				//获取该类的图片
				query.equalTo('dependency', classObj);
				query.find().then(function(products) {
					vm.detailHeader = products[0].get('classTitle');
					vm.author = products[0].get('owner').get('username');
					vm.amount = products.length;
					if(vm.amount == 0){
						vm.$store.commit('UPDATE_LOADING', false);
						return false;
					}
					products.forEach(function(product, index) {
						var imgTitle = product.get('title');
						var releaseTime = (product.createdAt.getMonth() + 1) + '/' + product.createdAt.getDate() + '/' +  product.createdAt.getFullYear();
						var userName = product.get('owner').get('username');
						var ownerId = product.get('owner').id;
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
							userName,
							pictureUrl,
							releaseTime,
							pictureId,
							ownerId
						}
						vm.cards.push(imgObj);
						vm.busy = false;
						vm.$nextTick(() => {
							vm.$store.commit('UPDATE_LOADING',false);
						})
					});
					vm.skips = vm.skips + 4;
				}).catch(function(error) {
					console.error(JSON.stringify(error));
				})
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less" scope>
	@import "../less/classDetail.less";
</style>