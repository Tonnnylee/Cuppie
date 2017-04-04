<template>
	<div v-show="showUserIndex" class="user-index">
		<div class="user-header">
			<img :src="userUrl" class="userHead pull-left" alt="">
			<p class="user-name">{{ username }}</p>
			<p class="user-sex">{{ userDes }}</p>
		</div>
		<div class="slider-container">
			<swiper :options="swiperOption">
				<swiper-slide>
					<div class="slide-wrap">
						<div class="slide-card" v-for="classIndex in classArr">
							<router-link :to="{name:'classDetail', params:{classId:classIndex.classId}}">
							   <v-commonCard :commonObj="classIndex" ></v-commonCard>
							</router-link>
						</div>
					</div>
				</swiper-slide>
				<swiper-slide>
					<div class="slide-wrap"></div>
				</swiper-slide>
				<swiper-slide>
					<div class="slide-wrap">
						<div class="slide-card" v-for="likeIndex in likeArr">
							<router-link :to="{name:'pictureDetail',params:{ pictureId:likeIndex.pictureId }}">
								<v-card :imgObj="likeIndex"></v-card>
							</router-link>
						</div>
					</div>
				</swiper-slide>
				<swiper-slide>
					<div class="slide-wrap">
						<div class="slide-card followee-card" v-for="followee in followArr">
							<router-link :to="{name: 'otherUser',params:{userId:followee.userId}}">
								<v-fwcard :cardObj="followee"></v-fwcard>
							</router-link>
						</div>
					</div>
				</swiper-slide>
				<div class="swiper-pagination" slot="pagination"></div>
			</swiper>
		</div>
		<transition name="fade" mode="out-in">
		   <router-view></router-view>
		 </transition>
	   </div>
</template>

<script>
	import { swiper, swiperSlide } from 'vue-awesome-swiper';
	import AV from 'leancloud-storage';
	import {mapState} from 'vuex';
	import vCommonCard from './commonCard.vue';
	import vFwcard from './Fwcard.vue';
	import vCard from './Card.vue';
	const TAB_NAME = ['分类','采集','喜欢','关注'];
	export default {
		components: {
			swiper,
			swiperSlide,
			vCommonCard,
			vCard,
			vFwcard
		},
		props:{
			data:{
				type: String
			}
		},
		created () {
			var vm = this;
			if(AV.User.current()){
				vm.createClass();
				vm.createUser();
				vm.createLikes();
				if(AV.User.current().id == vm.userId){
					vm.createFans();
				}
			}
		},
		watch:{
			currentUser(){
				if(AV.User.current()){
					this.createClass();
					this.createUser();
				    this.createLikes();
				    if(AV.User.current().id == this.userId){
					  this.createFans();
				   }
				}
			},
			'$route':"createUser"
		},
		data(){
			return {
				swiperSlides: ['分类','采集','喜欢','关注'],
				transition: 'slide-left',
				classAmount:0,
				likeAmount:0,
				TAB_NAME: [],
				className: '',
				classArr:[],
				likeArr:[],
				followArr:[],
				username:'',
				userId:this.$route.params.userId,
				userDes:'',
				userUrl:'',
				found:false,
				classId:'',
				cards:null,
				playPageShow: false,
				blurBgShow: false,
				rankshow:true,
				routerViewAnimation: 'page-slide',
				swiperOption:{
					pagination: '.swiper-pagination',
					paginationClickable: true,
					paginationBulletRender(swiper, index, className) {
						return `<div class="${className} swiper-pagination-bullet-custom">${TAB_NAME[index]}</div>`;
					}
				}
			}
		},
		computed: {
			...mapState([
				'showUserIndex','user','currentUser'
			])
		},
		methods:{
			createClass(){
				var vm = this;
				var query = new AV.Query('Classification');
				vm.$store.commit("UPDATE_LOADING", true);
				query.include('owner');
				query.descending('createAt');
				//特定用户
				var currentUser = AV.Object.createWithoutData('_User',vm.userId);
				query.equalTo('owner', currentUser);
				query.include("owner");
				//查找每个类
				query.find().then(function(products){
					if(products.length ==0){
						vm.$store.commit("UPDATE_LOADING", false);
						return false;
					}
					//遍历每个类
					for(var product of products){
						vm.classAmount++;
						var amount = 0;
						var coverUrl = null;
						var commonTitle = '';
						var classId = '';
						var classifi = AV.Object.createWithoutData('Classification', product.id);
						var classImg = new AV.Query('Picture');
						classImg.include("dependency");
						classImg.equalTo('dependency', classifi);
						classImg.find().then(function(classImgs){
							 commonTitle = classImgs[0].get("classTitle");
							 amount = classImgs.length;
							 coverUrl = classImgs[0].get("image").get("url");
							 classId = classImgs[0].get('dependency').id;
							 vm.classArr.push({
							 	classId,
								commonTitle,
								amount,
								coverUrl
							});
							 vm.$store.commit("UPDATE_LOADING", false);
						})
					}
				}).catch(function(error){
					vm.$store.commit("UPDATE_LOADING", false);
					console.error(JSON.stringify(error));
				})
			},
			createLikes(){
				var vm = this;
				var query = new AV.Query('likes');
				query.descending('createAt');
				query.include('owner');
				query.include('Picture');
				query.find().then(function(pictures){
					if(pictures.length == 0){
						return false;
						console.log("no likes");
					}
					//遍历每个likes
					var outerI = 0;
					function travel (pictures){
						var ownerId = pictures[outerI].get("owner").id;
						var total = pictures.length;
						if(ownerId == vm.userId){
							var pictureId = pictures[outerI].get("Picture").id;	
							vm.likeAmount++;
							var imgTitle = pictures[outerI].get("Picture").get("title");
							var releaseTime = (pictures[outerI].get('Picture').createdAt.getMonth() + 1) + '/' + pictures[outerI].get('Picture').createdAt.getDate() + '/' +  pictures[outerI].get('Picture').createdAt.getFullYear();
							var imgDescription = pictures[outerI].get('Picture').get('description');
							var pictureUrl = pictures[outerI].get("Picture").get("image").get("url");
							var userName = pictures[outerI].get('owner').get('username');
							//获取头像
							var queryUser = new AV.Query('Profile');
							var headUrl = '';
							queryUser.include('owner');
							queryUser.find().then(function(results) {
								for(var i=0; i<results.length; i++){
									var resultId = results[i].get('owner').id;
									//
									if(resultId == ownerId){
										headUrl = results[i].get('image').get('url');
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
										vm.likeArr.push(imgObj);
										
									}
								}
							}).catch(function(error){
								console.log(error);
							})
						}
						outerI++; 
						if(outerI<total){
							travel(pictures);
						}else{
							return false;
						}
					}
					//init travel
					travel(pictures);
				},function(error){
					console.error(error);
				})
			},
			createUser(){
				var vm = this;
				var query = new AV.Query('Profile');
				// var currentUser = AV.Object.createWithoutData('_User',vm.userId);
				// query.equalTo('owner', currentUser);
				query.include('owner');
				query.find().then(function(results){
					if(results.length == 0){
						return false;
					}else{
						for(var i=0; i<results.length; i++){
							var ownerId = results[i].get('owner').id;
							var resultId = results[i].id;
							if(ownerId == vm.userId){
								vm.found = true;
								vm.userUrl = results[i].get('image').get('url');
								vm.username = results[i].get('nickname');
								vm.userDes = results[i].get('aboutme');
								break;
							}
							if(!vm.found){
								vm.found = false;
								vm.userUrl = '';
								vm.username = vm.user.username;
								vm.userDes = '';
						    }
						}
					}
				}, function(error){
					console.error(error);
				})
			},
			createFans(){
				var vm = this;
				var query = AV.User.current().followeeQuery();
				query.include('followee');
				query.find().then(function(followees){
					for(var followee of followees){
						var userId = followee.id;
						var profile = new AV.Query('Profile');
						var connect = AV.Object.createWithoutData('connect',userId);
						profile.equalTo('owner',connect);
						profile.include('owner');
						profile.find().then(function(result){
							var headUrl = result[0].get("image").get("url");
							var username = result[0].get("nickname");
							var cardObj = {
								headUrl,
								username,
								userId
							}
							vm.followArr.push(cardObj);
						},function(error){
							console.error(error);
						})
					}
				})
			}
		}

	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/userIndex.less";
</style>