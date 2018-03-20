<template>
	<section class="system-configure" v-cloak>
		<div>
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<a class="tab-item font-ms">
					<span> > 接入系统管理</span>
				</a>
			</div>
			<div class="uinn-20">
				<!-- 列表显示 -->
				<div class="system clear">
					<div class="item" v-for="item in systemInfo">
						<div class="top" @click="handleEdit(item.id,item.image,item.name,item.url)"><i class="icon_edit"></i></div>
						<div style="cursor: pointer;" @click="select(item.id,item.name,item.systemCode)">
							<div class="pic_sys"><img :src="item.image" :onerror="defultImg" width="105" height="105"></div>
							<div class="name_sys v-ellipsis">{{item.name}}</div>
							<div class="desc_sys v-ellipsis">{{item.systemCode}}</div>
						</div>
					</div>
					<div class="item_add" @click="handleAdd">
						<div class="name_sys">新建接入系统</div>
						<div><i class="icon_add"></i></div>
					</div>
				</div>
				<div class="block">
					<el-pagination @size-change="handlepageChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
					</el-pagination>
				</div>
			</div>
			<Loading v-if="isLoad"></Loading>
		</div>
		<!--新增-->
		<el-dialog title="新增接入系统" v-model="dialogCreateVisible" size="tiny">
			<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px">
				<el-form-item label="系统名称" prop="name">
					<el-input v-model="createForm.name"></el-input>
				</el-form-item>
				<el-form-item label="回调地址" prop="url">
					<el-input v-model="createForm.url"></el-input>
				</el-form-item>
				<el-form-item class="upload" label="上传图像" prop="pic">
					<a href="javascript:;" class="uploader left">
						<input type="file" class="input-file" ref="input-files" @change="onUploadCreate"> 点击上传
					</a>
					<div class="left desc">{{createForm.secretFile}}</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="createSys">保存</el-button>
					<el-button @click="resetForm('createForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--修改-->
		<el-dialog title="修改接入系统" v-model="dialogUpdateVisible" size="tiny">
			<el-form :model="updateForm" :rules="updateRules" ref="updateForm" label-width="120px">
				<input type="hidden" v-model="updateForm.id" />
				<el-form-item label="系统名称" prop="name">
					<el-input v-model="updateForm.name"></el-input>
				</el-form-item>
				<el-form-item label="回调地址" prop="url">
					<el-input v-model="updateForm.url"></el-input>
				</el-form-item>
				<el-form-item class="upload" label="上传图像" prop="pic">
					<a href="javascript:;" class="uploader left">
						<input type="file" class="input-file" ref="input-files" @change="onUploadUpdate"> 点击上传
					</a>
					<div class="left desc">{{updateForm.secretFile}}</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="updateSys">保存</el-button>
					<el-button @click="resetForm('updateForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</section>
</template>
<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import $http from '../../../assets/js/http.js'
	import axios from 'axios'
	import Loading from '../login/loading.vue'
	export default {
		data() {
			return {
				isLoad: false,
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				dialogCreateVisible: false,
				dialogUpdateVisible: false,
				systemInfo: {},
				defultImg:'this.src="' + require('../../../assets/img/image_head.png') + '"',
				createForm: {
					name: null,
					url: null,
					secretUrl: null,
					secretFile: null
				},
				createRules: {
					name: [{
						required: true,
						message: '请输入接入系统名称',
						trigger: 'blur'
					}, {
						pattern: /^\s*[\s\S]{1,30}\s*$/,
						message: '接入系统名称必须在30个字符内'
					}],
					url: [{
							required: true,
							message: '请输入回调url',
							trigger: 'blur'
						},
						{
							pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
							message: '请输入正确的回调url'
						}
					]
				},
				updateForm: {
					id: null,
					name: null,
					url: null,
					secretUrl: null,
					secretFile: null
				},
				updateRules: {
					name: [{
						required: true,
						message: '请输入接入系统名称',
						trigger: 'blur'
					}, {
						pattern: /^\s*[\s\S]{1,30}\s*$/,
						message: '接入系统名称必须在30个字符内'
					}],
					url: [{
							required: true,
							message: '请输入回调url',
							trigger: 'blur'
						},
						{
							pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
							message: '请输入正确的回调url'
						}
					]
				}
			}
		},
		created() {
			this.getLoadData(this.currentPage, this.pagesize);
		},
		methods: {
			getLoadData(pageNum, pageSize) {
				this.isLoad = true;
				$http({
					url: common.apihost + 'accessSystem/list',
					data: {
						data: {
							pageWrapper: {
								page: pageNum,
								pagesize: pageSize,
							}
						}
					},
					method: 'post'
				}).then((response) => {
					this.isLoad = false;
					if(!response.data.code) {
						this.totalCount = response.data.iTotalRecords;
						if(response.data.iTotalRecords > 0) {
							this.systemInfo = response.data.aaData;
							for(let x in this.systemInfo) {
								this.systemInfo[x].image = common.osshost +this.systemInfo[x].image;
							}
							
						}else {
							this.systemInfo = null
						}
					}
				});
			},
			handlepageChange(val) {
				this.pagesize = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			handleAdd(e) {
				this.dialogCreateVisible = true;
				this.createForm.secretFile='未上传';
				if(this.$refs['createForm'] !== undefined) {
					this.$refs['createForm'].resetFields();
				}
			},
			resetForm(formName) {
				this.dialogCreateVisible = false;
				this.dialogUpdateVisible = false;
				if(this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			},
			createSys() {
				this.$refs.createForm.validate((valid) => {
					if(valid) {
						const url = common.apihost + 'accessSystem/add';
						$http({
							url: common.apihost + 'accessSystem/add',
							data: {
								data: {
									name: this.removeAllSpace(this.createForm.name),
									url: this.removeAllSpace(this.createForm.url),
									image: this.createForm.secretUrl
								}
							},
							method: 'post'
						}).then((response) => {
							this.dialogCreateVisible = false;
							if(response.data.code == 1) {
								this.createForm.secretFile = '';
								this.$message({
									message: "提交成功！",
									type: 'success'
								});
								this.$refs['createForm'].resetFields();
								this.getLoadData(this.currentPage, this.pagesize);
							}
						});
					}
				});
			},
			handleEdit(id, image, name, url) {
				this.dialogUpdateVisible = true;
				this.updateForm.id = id;
				this.updateForm.name = name;
				this.updateForm.url = url;
				if(!!image) {
					return false;
				}else {
					this.updateForm.secretUrl = image.match(/accessSystem(\S*)/)[0];
				}
			},
			updateSys() {
				this.$refs.updateForm.validate((valid) => {
					if(valid) {
						$http({
							url: common.apihost + 'accessSystem/update',
							data: {
								data: {
									id: this.updateForm.id,
									name: this.removeAllSpace(this.updateForm.name),
									url: this.removeAllSpace(this.updateForm.url),
									image: this.updateForm.secretUrl
								}
							},
							method: 'post'
						}).then((response) => {
							this.dialogUpdateVisible = false;
							if(response.data.code == 1) {
								this.updateForm.secretFile = '';
								this.$message({
									message: "修改成功！",
									type: 'success'
								});
								this.getLoadData(this.currentPage, this.pagesize);
							}
						});
					}
				});
			},
			onUploadCreate(e) {
				let file = e.target.files[0];
				let fileSize = file.size;
				let fileName = file.name;
				if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileName)) {
					this.$message({
						message: "图片类型必须是.gif,jpeg,jpg,png中的一种",
						type: 'error'
					});
					return;
				}
				if(file) {
					var data = new FormData();
					data.append('file', file);
					const url = common.apihost + 'accessSystem/doUploadImg';
					if(fileSize < 1024 * 1024 * 3) {
						axios.post(url, data, {
							headers: {
								"Content-Type": "multipart/form-data"
							},
						}).then((response) => {
							if(response.data.code==1){
								this.createForm.secretFile = '上传成功';
								this.createForm.secretUrl = response.data.data;
							}else {
								this.createForm.secretFile = '上传失败';
							}
						}).then((error) => this.error = error)
					} else {
						this.$alert('附件必须不能大于3M', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			onUploadUpdate(e) {
				let file = e.target.files[0];
				let fileSize = file.size;
				let fileName = file.name;
				if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileName)) {
					this.$message({
						message: "图片类型必须是.gif,jpeg,jpg,png中的一种",
						type: 'error'
					});
					return;
				}
				if(file) {
					var data = new FormData();
					data.append('file', file);
					const url = common.apihost + 'accessSystem/doUploadImg';
					if(fileSize < 1024 * 1024 * 3) {
						axios.post(url, data, {
							headers: {
								"Content-Type": "multipart/form-data "
							},
						}).then((response) => {
							if(response.data.code==1){
								this.updateForm.secretFile = '上传成功';
								this.updateForm.secretUrl = response.data.data;
							}else {
								this.updateForm.secretFile = '上传失败';
							}
						}).then((error) => this.error = error)
					} else {
						this.$alert('附件必须不能大于3M', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			select(id,name,systemCode) {
				this.$router.push({
					path: '/systemDeploy',
					query: {
						id: id,
						name: name,
						systemCode: systemCode
					}
				})
			},
			isBack: function() {
				this.$router.go(1);
			}
		},
		components: {
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.system-configure {
		.upload {
			width: 100%;
			text-align: left;
			height: 36px;
			margin-bottom: 20px;
			position:relative;
			.desc {
				/* margin-left: 10px;
				width: 210px;
				height: 36px;
				line-height: 36px; */
				max-width: 150px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				position: absolute;
			    left: 90px;
			   /*  top: 8px; */
			}
		}
		.uploader {
			width: 80px;
			height: 36px;
			line-height: 36px;
			display: inline-block;
			position: relative;
			color: #fff;
			background: #20a0ff;
			text-align: center;
			border-radius: 4px;
			overflow: hidden;
			*zoom: 1;
			.input-file {
				position: absolute;
				font-size: 100px;
				right: 0;
				top: 0;
				height:36px;
				width:80px;
				opacity: 0;
				filter: alpha(opacity=0);
				cursor: pointer
			}
		}
		.el-date-editor.el-input {
			width: 193px;
		}
		.el-button--primary span {
			color: #fff !important;
		}
		.el-message-box__btns .cancel {
			float: right !important;
			margin-left: 10px !important;
		}
		.el-dialog__header {
			text-align: left !important;
		}
		.el-table th>.cell {
			text-align: center;
		}
		.el-form-item__content {
			text-align: left;
		}
		.system {
			margin-bottom: 20px;
			.item_add {
				width: 226px;
				height: 302px;
				padding: 5px;
				margin: 20px 30px;
				float: left;
				border-radius: 3px;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
				box-shadow: 0px 0px 7px 0px rgba(153, 153, 153, 0.5);
				.icon_add {
					display: inline-block;
					width: 38px;
					height: 38px;
					vertical-align: middle;
					cursor: pointer;
					background: url(../../../assets/img/icon-sprite.png) -194px -0 no-repeat;
				}
				.name_sys {
					margin-top: 100px;
					margin-bottom: 30px;
					font-size: 16px;
					color: #666;
				}
			}
			.item:hover {
				.top {
					padding: 9px 15px;
					background-color: #f5f4f9;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					text-align: left;
					cursor: pointer;
					i.icon_edit {
						display: inline-block;
						width: 20px;
						height: 20px;
						vertical-align: middle;
						background: url(../../../assets/img/icon-sprite.png) -160px -0 no-repeat;
					}
				}
			}
			.item {
				.top {
					height: 40px;
				}
				width: 226px;
				height: 302px;
				padding: 5px;
				margin: 20px 30px;
				float: left;
				border-radius: 3px;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
				box-shadow: 0px 0px 7px 0px rgba(153, 153, 153, 0.5);
				
				.pic_sys {
					padding-top: 20px;
					padding-bottom: 30px;
					img {
						border-radius: 50%;
						-webkit-border-radius: 50%;
						-moz-border-radius: 50%;
					}
				}
				.name_sys {
					padding: 0 5px;
					font-size: 18px;
					color: #333;
				}
				.desc_sys {
					padding: 0 5px;
					font-size: 14px;
					color: #666;
					margin-top: 20px;
				}
			}
		}
	}
</style>