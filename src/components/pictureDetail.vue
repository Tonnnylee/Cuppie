<template>
	<div class="pictureDetail">
		<v-header :data="headerData"></v-header>
		<div class="picture-wrap">
			<img :src="imgUrl" lazy="loading" class="picture">
		</div>
		<div v-show="hideCanvas" class="canvas-wrap">
			<canvas ref="cas" id="cas" width="800" height="533"></canvas>
		</div>
		<div v-if="lowpolyed" @click="lowpolyEvent" class="lowpolyBtn">
			<span class="iconfont icon-cup"></span>
			<span class="iconword">Lowpoly it!</span>
		</div>
		<div v-else class="lowpolyBtn" @click="uploadEvent">
			<span>上传给自己!</span>
		</div>
		<div class="picture-info">
			<p class="picture-title">{{ pictureTitle }}</p>
			<p class="picture-des">{{ pictureDes }}</p>
			<p class="createTime">{{ createTime }}</p>
		</div>

		<div class="comment">
			<p class="comment-title">评论</p>
			<input type="text" v-model="comment" name="comment-text" placeholder="添加评论">
			<a href="#" @click.prevent="commentEvent" class="btn pull-right">评论</a>
			<div class="displayCom">
				<p v-for="comment in comments">
					{{ comment.content }}
					<span class="comment-time pull-right">{{ comment.time }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import AV from 'leancloud-storage';
	import vHeader from './Header.vue';
	import Lowpoly from '../common/js/sobel.js';
	export default {
		name: 'v-picture',
		data() {
			return {
				headerData:{
					headerTitle:'图片详情',
					showDismiss:false,
					showReturn:true,
					showUploadBtn:false,
					showGear:false,
				    likeObj:{
				   	 showLike:true,
				   	 liked:false,
				   	 unlike:true
				   },
				    lowpoly:{
				   	 show:false
				   }
				},
				hasFound:null,
				time:null,
				classObject:null,
				comments:[],
				canvas:null,
				lowpolyed:true,
				comment:'',
				pictureId:this.$route.params.pictureId,
				imgUrl:null,
				pictureTitle:'',
				pictureDes:'',
				createTime:null,
				hideCanvas:false,
				hideInputFile:false
			}
		},
		components:{
			vHeader
		},
		watch:{
			time(){
				this.uploadImg();
			}
		},
		created() {
			this.fetchData();
			this.fetchComment();
			//init lowpoly
			Lowpoly.sobel(this);
		},
		methods: {
			fetchData(){
				var vm = this;
				vm.$store.commit("UPDATE_LOADING", true);
				var query = new AV.Query('Picture');
				query.include('image');
				query.include('owner');
				//获取当前图片
				query.get(vm.pictureId).then(function(picture){
					vm.imgUrl = picture.get('image').get('url');
					vm.pictureTitle = picture.get('title');
					vm.pictureDes = picture.get('description');
					vm.createTime = picture.createdAt.getFullYear() + '年' + (picture.createdAt.getMonth() + 1) + '月' + picture.createdAt.getDate() + '日';
					vm.$store.commit("UPDATE_LOADING", false);
				}).catch(function(error){
					console.error(error);
				})
			},
			commentEvent(){
				if(!AV.User.current()){
					vm.$store.commit("UPDATE_TIPS", true);
					vm.$store.commit("UPDATE_TIPSMESSAGE", "请先登录再评论");
					setTimeout(function(){
						vm.$store.commit("UPDATE_TIPS", false);
					},3000)
					return false;
				}
				var vm = this;
				var Comment = AV.Object.extend('Comment');
				var comment = new Comment();
				comment.set('content',vm.comment);
				//关联当前图片
				var currentPic = AV.Object.createWithoutData('currentPic',vm.pictureId);
				comment.set("currentPic",currentPic);
				comment.set('owner',AV.User.current());
				var content = vm.comment;
				var time = '刚刚';
				var commentObj = {
					content,
					time
				}
				comment.save().then(function(){
					vm.$store.commit("UPDATE_TIPS", true);
					vm.$store.commit("UPDATE_TIPSMESSAGE", "评论成功");
					setTimeout(function(){
						vm.$store.commit("UPDATE_TIPS", false);
					},3000)
					vm.comments.push(commentObj);
				},function(error){
					console.error(error);
				})
			},
			fetchComment(){
				var vm = this;
				var query = new AV.Query('Comment');
				query.include('currentPic');
				query.include('owner');
				var pictureObj =AV.Object.createWithoutData('Picture', vm.pictureId);
				//找到这张图片的评论
				query.equalTo('currentPic', pictureObj);
				query.find().then(function(comments){
					for(var comment of comments){
						var content = comment.get('content');
						console.log(comment.get('owner').id);
						var time = comment.createdAt.getFullYear() + '-' + (comment.createdAt.getMonth() + 1) + '-' + comment.createdAt.getDate();
						var commentObj = {
							content,
							time
						}
						vm.comments.push(commentObj);
						
					}
				},function(error){
					console.error(error)
				})
			},
			lowpolyEvent(){
				var vm = this;
				vm.$store.commit("UPDATE_TIPS", true);
				vm.$store.commit("UPDATE_TIPSMESSAGE", '正在生成lowpoly');
				var img = new Image();
				img.onload = function () {
					vm.parse(this).then((value) => {
						vm.$store.commit("UPDATE_TIPS", false);
						vm.imgUrl = value;
						vm.lowpolyed = false;
					});
				};
				//设置为匿名跨域
				img.crossOrigin="anonymous";
				img.src = vm.imgUrl;
			},
			parse(img){
				var vm = this;
				return new Promise((resolve, reject) => {
					vm.canvas = vm.$refs.cas;
					var ctx = vm.canvas.getContext("2d");
					var jxdvalue = 50;
			 		var particles = [];
			        vm.canvas.width = (img.width > 800) ? 800 : img.width;
			        vm.canvas.height = img.height * vm.canvas.width/img.width;
			        ctx.drawImage(img, 0, 0, vm.canvas.width, vm.canvas.height);
		            var imgData = ctx.getImageData(0, 0, vm.canvas.width, vm.canvas.height);
		            //收集色值大于40的边缘像素点
		            var collectors = [];
		            vm.Sobel(imgData , function(value , x , y){
		                if(value > 40){collectors.push([x , y]);}
		            });
		             //添加一些随机点
		            for(var i=0;i<300;i++){particles.push([Math.random()*vm.canvas.width , Math.random()*vm.canvas.height]);}
		            //添加随机边缘点，数量为边缘点数量除于50
		            var length = ~~(collectors.length/jxdvalue), random;
		            for(var l=0;l<length;l++){
		                random = (Math.random()*collectors.length)<<0;
		                particles.push(collectors[random]);
		                collectors.splice(random , 1);
		            }
		            //添加四顶点坐标
		            particles.push([0,0] , [0,vm.canvas.height] , [vm.canvas.width,0] , [vm.canvas.width,vm.canvas.height]);
		            //使用delaunay三角化获取三角坐标
		            var triangles = Lowpoly.Delaunay.triangulate(particles);
		            var x1,x2,x3,y1,y2,y3,cx,cy;
		            for(var i=0;i < triangles.length; i+=3) {
		                x1 = particles[triangles[i]][0];
		                x2 = particles[triangles[i+1]][0];
		                x3 = particles[triangles[i+2]][0];
		                y1 = particles[triangles[i]][1];
		                y2 = particles[triangles[i+1]][1];
		                y3 = particles[triangles[i+2]][1];
		                //获取三角形中心点坐标
		                cx = ~~((x1 + x2 + x3) / 3);
		                cy = ~~((y1 + y2 + y3) / 3);
		                //获取中心点坐标的颜色值
		                var index = (cy*imgData.width + cx)*4;
		                var color_r = imgData.data[index];
		                var color_g = imgData.data[index+1];
		                var color_b = imgData.data[index+2];
		                //绘制三角形
		                ctx.save();
		                ctx.beginPath();
		                ctx.moveTo(x1, y1);
		                ctx.lineTo(x2, y2);
		                ctx.lineTo(x3, y3);
		                ctx.closePath();
		                ctx.fillStyle = "rgba("+color_r+","+color_g+","+color_b+",1)";
		                ctx.fill();
		                ctx.restore();
		            }
		            //转成png
		            var canvasUrl = vm.canvas.toDataURL("image/png");
		            resolve(canvasUrl);
			 	});
			},
			uploadEvent(){
				var vm = this;
				vm.$store.commit("UPDATE_LOADING", true);
				var className = 'Lowpoly';
				vm.classify(className);
			},
			uploadImg(){
				var vm = this;
				var Lowpoly = AV.Object.extend('Lowpoly');
				var currentUser = AV.User.current();
				var lowpoly = new Lowpoly();
				lowpoly.set("title",vm.pictureTitle);
				lowpoly.set("description",vm.pictureDes);
				lowpoly.set("owner", AV.User.current());
				lowpoly.set("imgUrl", vm.imgUrl);
				var classObject = AV.Object.createWithoutData('Classification', vm.classObject);
				lowpoly.set('dependency',classObject);
				console.log("all set!");
				lowpoly.save().then(function(lowpoly){
					vm.$store.commit("UPDATE_LOADING", false);
				}, function(error) {
					console.error(JSON.stringify(error));
				})
			},
			classify(className){
				var vm = this;
				var query = new AV.Query("Classification");
				query.include('owner');
				query.find().then(function(classes){
					
					if(classes.length == 0){
						console.log("no class");
						vm.createClass(className);
					}else{
						for(var classIndex of classes){
							var classTitle = classIndex.get('classTitle');
							var classOwner = classIndex.get('owner').id;
							if(classTitle == className && classOwner == AV.User.current().id){
								console.log("found it");
								vm.hasFound = 'found it';
								vm.classObject = classIndex.id;
								vm.time = new Date().getTime();
								break;
							}
						}
						if(!vm.hasFound){

							console.log("not found");
							vm.createClass(className);
						}
					}
				})
			},
			createClass(className){
				var vm = this;
				console.log("create");
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
			}
		}

	}
</script>

<style lang="less" rel="stylesheet/less">
	@import '../less/pictureDetail.less';
</style>