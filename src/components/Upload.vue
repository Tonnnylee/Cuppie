<template>
	<div v-show="showUpload" class="upload">
	    <v-header :data="headerData"></v-header>
		<div class="upload-container">
			<div class="upload-header">{{ uploadHeader }}</div>
			<div class="input-wrap">
				<input type="text" v-model="imageName" name="imageName" placeholder="图片名称" required>
				<input type="text" v-model="className" name="className" placeholder="分类" required>
				<textarea placeholder="描述这张图片吧..." v-model="imageDes" class="imageDes" required></textarea>

				<input v-show="hideInputFile" type="file" @change="onFileChange($event)" id="inputFile" class="inputFile" placeholder="选择文件">

				<a href="#" @click.prevent="trigger" class="btn fileBtn">选择图片</a>

				<img v-show="showImage" class="displayPicture" :src="picture" />

				<input type="submit" name="upload" class="btn uploadBtn" @click="uploadEvent" value="上传">
			</div>
		</div>
	</div>
</template>

<script>
	import AV from 'leancloud-storage';
	import {mapState} from 'vuex';
	import vHeader from './Header.vue';
	export default {
		name: 'v-upload',
		components:{
			vHeader
		},
		data(){
			return {
				uploadHeader: '上传图片',
				imageName:'',
				className: '',
				imageDes: '',
				picture: '',
				hideInputFile: false,
				showImage: false,
				classObject:null,
				file:null,
				time:null,
				hasFound:'',
				headerData:{
					headerTitle:"上传",
					showDismiss: true,
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
			}
		},
		created(){
			
		},
		computed: {
			...mapState([
				'showUpload'
			])
		},
		watch:{
			time(){
				this.uploading();
			}
		},
		methods: {
			trigger(e){
				document.getElementById("inputFile").click();
			},
			onFileChange(e){
				//读取上传的图片
				var files = e.target.files || e.dataTransfer.files;
				if(!files.length)
					return;
				this.createImage(files[0]);
				this.file = files[0];
				return files[0];

			},
			createImage(file) {
				var image = new Image();
				var reader = new FileReader();
				var vm = this;
				reader.onload = (e) => {
					//图片url
					vm.picture = e.target.result;
					vm.showImage = true;
					
				};
				reader.readAsDataURL(file);
			},
			uploadEvent(){
				var vm = this;
				var className = vm.className;
				vm.$store.commit("UPDATE_LOADING", true);
				//分类
				vm.classify(className);
			},
			uploading(){
				var Picture = AV.Object.extend('Picture');
				var eThis = this;
				var title = eThis.imageName;
				var className = eThis.className;
				var description = eThis.imageDes;
				var currentUser = AV.User.current();
				var file = eThis.file;
				var avFile = new AV.File(title, file);
				if(eThis.picture){
					var pictureUrl = this.picture;
				}
				var picture = new Picture();
				picture.set('title', title);
				picture.set('classTitle', className);
				picture.set('description', description);
				picture.set('image', avFile);
				//指向当前用户
				picture.set('owner', AV.User.current());
				var classObject = AV.Object.createWithoutData('Classification', eThis.classObject);
				picture.set('dependency', classObject);
				console.log("all set!");
				//保存之后的操作
				picture.save().then(function(picture){
					//get objectId
					var pictureId = picture.id;
					eThis.$store.commit("UPDATE_TIPS", true);
					eThis.$store.commit("UPDATE_TIPSMESSAGE", "上传成功");
					setTimeout(function(){
						eThis.$store.commit("UPDATE_TIPS", false);
					},2000)
					eThis.$store.commit("UPDATE_LOADING", false);
					eThis.saveSuccess();
				}, function(error) {
					console.error(JSON.stringify(error));
				})
			},
			classify(className){
				var vm = this;
				var query = new AV.Query('Classification');
				query.include('owner');
				query.find().then(function(classes){
					if(classes.length == 0){
						console.log("no class"+className);
					    vm.createClass(className);
					}else{
						for(var classIndex of classes){
							var classTitle = classIndex.get('classTitle');
							var classOwner = classIndex.get('owner').id;
						    //如果该用户的分类已创建
							if(classTitle == className && classOwner == AV.User.current().id){
								//返回类Object
								vm.hasFound = 'found it';
								vm.classObject = classIndex.id;
								vm.time = new Date().getTime();
								break;
							}
						}
						if(!vm.hasFound){
							console.log("not create");
						    vm.createClass(className);
						}
					}
				}).catch(function(error){
					alert(JSON.stringify(error));
				});	
			},
			createClass(className){
				var vm = this;
				var Class = AV.Object.extend('Classification');
				var classParent = new Class();
				classParent.set('classTitle', className);
				classParent.set('owner', AV.User.current());
				classParent.save().then(function(classParent) {
					console.log("create class! ");
					vm.classObject = classParent.id;
					//触发时间戳
					vm.time = new Date().getTime();
				}, function(error) {
					alert(JSON.stringify(error));
				});	
				
			},
			saveSuccess(){
				//关闭upload组件
				var vm = this;
				vm.$store.commit("UPDATE_UPLOAD", false);
				vm.$store.commit("UPDATE_SHOWUSER", true);
				vm.$store.commit("UPDATE_UPLOADBTN", true);
				vm.imageName = '',
				vm.className = '',
				vm.imageDes = '',
				vm.picture = '',
				vm.showImage = false,
				vm.file=null,
				vm.hasFound=''
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../less/upload.less";
</style>