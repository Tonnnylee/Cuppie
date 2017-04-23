<template>
	<div class="userSetting">
		<v-header :data="headerData"></v-header>
		<div class="userSetting-wrap">
			<div class="userSetting-header">
				<img :src="picture1Url" v-show="showHead" class="head-profile pull-left" alt="">
				<input v-show="hideInputFile" type="file" @change="onFileChange($event)" id="inputFile2" class="inputFile" placeholder="选择文件">
				<a href="#" @click.prevent="trigger" class="btn fileBtn">更换头像</a>
			</div>
			<div class="userSetting-content">
				<p>昵称</p>
				<input type="text" v-model="nickname" class="nickname" name="nickname" placeholder="您的昵称">
				<p>性别</p>
				<div class="gender-wrap">
					<div @click="changeMan($event)" class="male gender-label pull-left" :class="{ active:isActiveMan }" >男性</div>
					<div @click="changeWoman($event)" class="female gender-label pull-left" :class="{ active:isActiveWoman }">女性</div>
					<div @click="changeUnknow($event)" class="unknown gender-label pull-left" :class="{ active:isActiveUnknow }">保密</div>
				</div>
				<p>生日</p>
				<input type="date" v-model="date" id="myDate" value="">
				<p>城市</p>
				<input type="text" v-model="city" placeholder="如：广州" name="city">
				<p>职业</p>
				<input type="text" placeholder="职业" v-model="profession" name="profession">
				<p>个人主页</p>
				<input type="text" v-model="website" name="website" placeholder="http://cuppie.com">
				<p>关于自己</p>
				<textarea placeholder="用一句话介绍你自己" v-model="aboutme" class="aboutme"></textarea>
				<input type="submit" name="save" class="btn saveBtn" @click="saveEvent" value="保存">
			</div>
			
		</div>
	</div>
</template>

<script>
	import AV from 'leancloud-storage';
	import {mapState} from 'vuex';
	import vHeader from './Header.vue';
	export default {
		name: 'v-user-setting',
		components:{
			vHeader
		},
		data(){
			return {
				hideInputFile:false,
				showHead:true,
				picture1Url:null,
				nickname:'',
				isActiveMan:false,
				isActiveWoman:false,
				isActiveUnknow:false,
				date:'',
				city:'',
				hasFound:'',
				profession:'',
				website:'',
				aboutme:'',
				sex:'',
				file:null,
				headerData:{
					headerTitle: '编辑个人资料',
					showDismiss:false,
					showReturn:true,
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
			}
		},
		watch:{
		},
		created(){
			this.initial();
		},
		methods: {
			trigger(e){
				document.getElementById("inputFile2").click();
			},
			onFileChange(e){
				//读取上传的图片
				var files = e.target.files || e.dataTransfer.files;
				if(!files.length)
					return;
				this.createImage(files[0]);
				this.file = files[0];
			},
			createImage(file) {
				var reader = new FileReader();
				var vm = this;
				reader.onload = (e) => {
					//图片url
					vm.picture1Url = e.target.result;
				};
				reader.readAsDataURL(file);
			},
			changeMan(e){
				var vm = this;
				var ethis = e.currentTarget;
				vm.isActiveMan = true;
				vm.isActiveWoman= false;
				vm.isActiveUnknow = false;
				vm.sex = '男性'
			},
			changeWoman(e){
				var vm = this;
				var ethis = e.currentTarget;
				this.sex='女性'
				vm.isActiveMan = false;
				vm.isActiveWoman= true;
				vm.isActiveUnknow = false;
			},
			changeUnknow(e){
				var vm = this;
				this.sex = 'Unknown';
				var ethis = e.currentTarget;
				vm.isActiveMan = false;
				vm.isActiveWoman= false;
				vm.isActiveUnknow = true;
			},
			saveEvent(){
				var vm = this;
				vm.$store.commit('UPDATE_LOADING', true);
				vm.saving();
			},
			initial(){
				var vm = this;
				var query = new AV.Query('Profile');
				query.include('owner');
				query.find().then(function(results) {
					if(results.length == 0){
						return false;
					}else{
						for(var i=0; i<results.length; i++){
							var ownerId = results[i].get('owner').id;
							var resultId = results[i].id;
							if(ownerId == AV.User.current().id){
								console.log("found it");
								vm.nickname = results[i].get('nickname');
								vm.city = results[i].get('city');
								vm.aboutme = results[i].get('aboutme');
								vm.website = results[i].get('website');
								vm.profession = results[i].get('profession');
								vm.date = results[i].get('date');
								vm.sex = results[i].get('sex');
								vm.picture1Url = results[i].get('image').get('url');
								break;
							}	
						 }	
						} 
				},function (error) {
					console.log(error);
				})
			},
			saving(){
				var vm = this;
				var query = new AV.Query('Profile');
				query.include('owner');
				query.find().then(function(results) {
					console.log(results);
					if(results.length == 0){
						vm.createProfile();
					}else{
						for(var i=0; i<results.length; i++){
							var ownerId = results[i].get('owner').id;
							var resultId = results[i].id;
							if(ownerId == AV.User.current().id){
								console.log("found it");
								vm.hasFound = 'found it';
								var existProfile = AV.Object.createWithoutData('Profile', resultId);
								if(vm.file){
									var file = vm.file;
				                    var avFile = new AV.File('profileHead',file);
				                    existProfile.set('image', avFile);
								}
								existProfile.set('sex',vm.sex);
								existProfile.set('nickname', vm.nickname);
								existProfile.set('date',vm.date);
								existProfile.set('city', vm.city);
								existProfile.set('aboutme', vm.aboutme);
								existProfile.set('website',vm.website);
								existProfile.set('profession',vm.profession);
								existProfile.save().then(function(){
									vm.$store.commit('UPDATE_LOADING', false);
									vm.$store.commit("UPDATE_TIPS", true);
									vm.$store.commit("UPDATE_TIPSMESSAGE", "修改成功");
									setTimeout(function(){
										vm.$store.commit("UPDATE_TIPS", false);
									},3000)
								},function(error){
									console.log(error);
									console.log("not change!");
								});
								break;
							} 
							if(!vm.hasFound){
								vm.createProfile();
								break;
							}	
						 }	
						} 
				},function (error) {
					console.log(error);
					console.log("no exist!")
					vm.createProfile();
				})
			},
			createProfile(){
				var vm = this;
				var Profile = AV.Object.extend('Profile');
				var file = vm.file;
				var avFile = new AV.File('profileHead',file);
				var profile = new Profile();
				profile.set('image', avFile);
				profile.set('owner', AV.User.current());
				profile.set('sex',vm.sex);
				profile.set('nickname', vm.nickname);
				profile.set('date',vm.date);
				profile.set('city', vm.city);
				profile.set('aboutme', vm.aboutme);
				profile.set('website',vm.website);
				profile.set('profession',vm.profession);
				profile.save().then(function(profile){
					console.log("save success!");
					vm.$store.commit("UPDATE_LOADING", false);
				}, function(error) {
					console.error(JSON.stringify(error));
				})
			}	
		}
	}
</script>

<style lang="less" rel="stylesheet/less" scope>
	@import "../less/userSetting.less";
</style>