<template>
	<header class="header">
		<div v-if="showReturn" class="pull-left returnIcon" onclick="window.history.go(-1)" >
			<span class="iconfont icon-fanhuijiantou"></span>
		</div>
		<div v-if="showDismiss" @click="dismissEvent" class="pull-left dismissIcon">
			<span class="iconfont icon-cha"></span>
		</div>
		<div class="title pull-left">{{ headerTitle }}</div>
		<div v-if="showUploadBtn" @click="uploadEvent" class="pull-right uploadBtnIcon">
			<span class="iconfont icon-cha"></span>
		</div>
		<div v-if="showGear" class="pull-right Gear">
			<router-link :to="{name:'setting'}">
			  <span class="iconfont icon-gear"></span>
			</router-link>
		</div>
		<div v-if="likeObj.showLike" @click="likeEvent" class="pull-right likeBtn">
			<span v-if="unlike" class="iconfont icon-xin"></span>
			<span v-else class="iconfont icon-xin-1"></span>
		</div>
		<div v-if="follow" @click="followEvent" class="pull-right follow">
			<span>{{ followText }}</span>
		</div>
		<div v-if="envelope" class="pull-right otherUser">
			<span class="iconfont icon-envelope"></span>
		</div>
	</header>
</template>

<script>
	import {mapState} from 'vuex';
	import AV from 'leancloud-storage';
	export default {
		name: 'v-header',
		props: {
			data:{
				type: Object
			}
		},
		data () {
			return {
				show: false,
				pictureId:this.$route.params.pictureId,
				userId:this.$route.params.userId,
				unlike:true,
				followText: '',
				ifFollow:false,
				hasfound:null
			};
		},
		created(){
			if(AV.User.current()){
				this.ifLiked();
				if(this.follow){
					this.ifFollowed();
				}
			}
		},
		watch:{

		},
		methods:{
			dismissEvent(){
				if(this.showLogin){
					this.$store.commit("UPDATE_LOGIN", false);
				}else if(this.showSignup){
					this.$store.commit("UPDATE_SIGNUP", false);
				}else if(this.showUpload){
					this.$store.commit("UPDATE_UPLOAD", false);
				}else{
					console.log("Dismiss error");
				}
				this.$store.commit("UPDATE_SHOWUSER", true);
			},
			uploadEvent(){
				var vm = this;
				vm.$store.commit("UPDATE_UPLOAD", true);
				vm.$store.commit("UPDATE_SHOWUSER", false);
			},
			likeEvent(){
				var vm = this;
				var picture = AV.Object.createWithoutData('Picture',this.pictureId);
					//picture.set('like', 0);
					picture.save().then(function(picture){
						//如果还没点过喜欢
						if(vm.unlike){
							picture.increment('like', 1);
							vm.unlike = false;
							var likes = new AV.Object('likes');
							var Picture = AV.Object.createWithoutData('Picture',vm.pictureId);
							likes.set('Picture',Picture);
							likes.set('owner',AV.User.current());
							likes.save().then(function(){
								console.log("connect success");
							},function(error){
								console.log(error);
							})
						}else{
							//取消喜欢
							var query = new AV.Query('likes');
							query.include("Picture");
							query.include("owner"); 
							query.find().then(function(results){
								for(var result of results){
									var userId = result.get("owner").id;
									if(userId == AV.User.current().id){
										var resultId = result.id;
										var currentPic = AV.Object.createWithoutData('likes',resultId);
										currentPic.destroy().then(function(success){
											console.log(success);
											console.log("delete like");
										},function(error){
											console.log(error);
										})
										break;
									}
								}
							})
							picture.increment('like',-1);
							vm.unlike = true;
						}
						picture.fetchWhenSave(true);
						return picture.save();
					}).then(function(picture) {
						console.log("like update!");
					}, function(error) {
						console.error(error);
					})
			},
			ifLiked(){
				var vm = this;
				var query = new AV.Query('likes');
				var isfound = false;
				query.find().then(function(results){
					for(var result of results){
						var userId = result.get("owner").id;
						var picId = result.get("Picture").id;
						if(userId == AV.User.current().id && picId == vm.pictureId){
							isfound = true;
							vm.unlike = false;
							break;
						}
					}
					if(!isfound){
						vm.unlike = true;
					}
				},function(error){
					console.error(error);
				});
			},
			followEvent(){
				var vm = this;
				if(!vm.ifFollow){
					AV.User.current().follow(vm.userId).then(function(){
					vm.$store.commit("UPDATE_TIPS", true);
					vm.$store.commit("UPDATE_TIPSMESSAGE", "关注成功");
					vm.ifFollow = true;
					vm.followText = '已关注';
					setTimeout(function(){
						vm.$store.commit("UPDATE_TIPS", false);
					},3000)
					},function(err){
						vm.$store.commit("UPDATE_TIPS", true);
					    vm.$store.commit("UPDATE_TIPSMESSAGE", "不能关注自己");
					    setTimeout(function(){
							vm.$store.commit("UPDATE_TIPS", false);
						},3000)
					})
				}else{
					AV.User.current().unfollow(vm.userId).then(function(){
						vm.$store.commit("UPDATE_TIPS", true);
						vm.$store.commit("UPDATE_TIPSMESSAGE", "取消关注");
						vm.ifFollow = false;
						vm.followText = '关注';
						setTimeout(function(){
							vm.$store.commit("UPDATE_TIPS", false);
						},3000)
					},function(err){
						console.error(err);
					})
				}
			},
			ifFollowed(){
				var vm = this;
				var query = AV.User.current().followeeQuery();
				query.include('followee');
				query.find().then(function(followees){
					for(var followee of followees){
						var followeeId = followee.id;
						if(followeeId == vm.userId){
							vm.ifFollow = true;
							vm.followText = "已关注";
							vm.hasfound = true;
							break;
						}
					}
					if(!vm.hasfound){
						vm.ifFollow = false;
						vm.followText = "关注";
					}

				})
			}

		},
		computed: {
			...mapState([
				'showLogin','showSignup','showUpload'
			]),
			headerTitle(){
				return this.data.headerTitle
			},
			showDismiss(){
				return this.data.showDismiss
			},
			showReturn() {
				return this.data.showReturn
			},
			showUploadBtn() {
				return this.data.showUploadBtn
			},
			showGear() {
				return this.data.showGear
			},
			likeObj() {
				return this.data.likeObj
			},
			follow() {
				return this.data.follow
			},
			envelope() {
				return this.data.envelope
			}
		}

	}
</script>

<style lang="less" rel="stylesheet/less">
 @import "../less/header.less";
</style>