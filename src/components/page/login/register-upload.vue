<template>
	<div class="register-upload" id="register-upload" v-cloak>
		<el-form :model="regForm" :rules="rules" ref="regForm" label-width="100px" class="demo-ruleregm">
			<div class="reg-inner">
				<div class="reg-bg">
					<div class="reg-title">资料认证</div>
				</div>
				<div class="reg-cont">
					<input type="hidden" v-model="regForm.mobile">
					<el-form-item class="reg-cont-item" prop="realName">
						<i class="icon-user"></i>
						<el-input placeholder="请输入姓名" v-model="regForm.realName"></el-input>
					</el-form-item>
					<el-form-item class="reg-cont-item" prop="idCard">
						<i class="icon-pwd"></i>
						<el-input placeholder="请输入身份证号码" v-model="regForm.idCard"></el-input>
					</el-form-item>

					<el-form-item class="reg-cont-item" prop="idCard">
						<i class="icon-pwd"></i>
						<el-input placeholder="请输入邮箱地址" v-model="regForm.idCard"></el-input>
					</el-form-item>
					<div class="reg-cont-send">
						<el-form-item class="left reg-message" prop="phoneCode"><i class="icon-pwd"></i>
							<el-input @keyup.enter.native="submitForm('regForm')" type="text" placeholder="请输入邮箱验证码" v-model="regForm.phoneCode"></el-input>
						</el-form-item>
						<div class="left">
							<a href="javascript:;" class="set-pwd" @click="regForm.flag && getvalite()">
								<span v-if="regForm.sendMsgDisabled">{{regForm.time+'秒后获取'}}</span>
								<span v-if="!regForm.sendMsgDisabled">获取验证码</span>
							</a>
						</div>
					</div>

					<el-form-item class="reg-cont-item reg-message" prop="companyName">
						<i class="icon-message"></i>
						<el-input placeholder="请输入机构名称" v-model="regForm.companyName"></el-input>
					</el-form-item>
					<div class="el-upload">
						<label class="color-org umar-r">营&nbsp;业&nbsp;执&nbsp;照</label><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png" name="file" id="file" @change='onUpload' ref="licenceUrlInput">
					</div>
					<div class="umar-t2 el-upload">
						<label class="color-org umar-r">身份证正面</label><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png" name="file" id="file" @change='onUploadIdFrontUrl' ref="idFrontUrlInput">
					</div>
					<div class="umar-t2 el-upload">
						<label class="color-org umar-r">身份证反面</label><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png" name="file" id="file" @change='onUploadIdBackUrl' ref="idBackUrlInput">
					</div><br/><br/>
					<div class="font-ms color-org reg-tip">
						（请上传营业执照、身份证正反面，只支持格式gif、jpeg、jpg、png）
					</div>
					<el-form-item>
						<el-button class="reg-btn" @click="submitForm('regForm')">提交</el-button>
					</el-form-item>

				</div>
			</div>
		</el-form>
		<Loading v-if="isLoad"></Loading>
	</div>
</template>

<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import Loading from './loading.vue'
	import axios from 'axios'
	import $http from '../../../assets/js/http.js'
	export default {
		name: 'register-upload',
		data() {
			var validateRealName = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入真实姓名'));
				} else {
					if(!(/^\s*[\s\S]{1,30}\s*$/.test(value))) {
						callback(new Error('真实姓名必须在30个字符内，请重新输入'));
					}
					callback();
				}
			};
			var validateIdCard = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入身份证号码'));
				} else {
					if(!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/gi.test(value))) {
						callback(new Error('身份证号码无效，请重新输入'));
					}
					callback();
				}
			};
			var validateCompanyName = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入机构名称'));
				} else {
					if(!(/^\s*[\s\S]{1,30}\s*$/.test(value))) {
						callback(new Error('机构名称必须在30个字符内，请重新输入'));
					}
					callback();
				}
			};
			return {
				isLoad: false,
				fileList: [],
				regForm: {
					mobile: localStorage.getItem('phone'),
					realName: null,
					idCard: null,
					companyName: null,
					error: null
				},
				rules: {
					realName: [{
						validator: validateRealName,
						trigger: 'blur'
					}],
					idCard: [{
						validator: validateIdCard,
						trigger: 'blur'
					}],
					companyName: [{
						validator: validateCompanyName,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			onUpload(e) {
				let file = e.target.files[0];
				let imagSize = file.size;
				if(file) {
					var data = new FormData();
					data.append('file', file);
					data.append('phone', this.regForm.mobile);
					data.append('licenceUrl', 'licenceUrl');
					const url = common.apihost + 'apply/doUploadImg';
					if(imagSize > 1024 * 50 && imagSize < 1024 * 1024 * 1) {
						axios.post(url, data, {
							headers: {
								"Content-Type": "multipart/form-data "
							},
						}).then((response) => {
							this.isLoad = false;
						}).then((error) => this.error = error)
					} else {
						this.$alert('图片必须大于100kb小于1M', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			onUploadIdFrontUrl(e) {
				let file = e.target.files[0];
				let imagSize = file.size;
				if(file) {
					var data = new FormData();
					data.append('file', file);
					data.append('phone', this.regForm.mobile);
					data.append('idFrontUrl', 'idFrontUrl');
					const url = common.apihost + 'apply/doUploadImg';
					if(imagSize > 1024 * 50 && imagSize < 1024 * 1024 * 1) {
						axios.post(url, data, {
							headers: {
								"Content-Type": "multipart/form-data "
							},
						}).then((response) => {
							this.isLoad = false;
						}).then((error) => this.error = error)
					} else {
						this.$alert('图片必须大于100kb小于1M', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			onUploadIdBackUrl(e) {
				let file = e.target.files[0];
				let imagSize = file.size;
				if(file) {
					var data = new FormData();
					data.append('file', file);
					data.append('phone', this.regForm.mobile);
					data.append('idBackUrl', 'idBackUrl');
					const url = common.apihost + 'apply/doUploadImg';
					if(imagSize > 1024 * 50 && imagSize < 1024 * 1024 * 1) {
						axios.post(url, data, {
							headers: {
								"Content-Type": "multipart/form-data "
							},
						}).then((response) => {
							this.isLoad = false;
						}).then((error) => this.error = error)
					} else {
						this.$alert('图片必须大于100kb小于1M', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.$refs.licenceUrlInput.files.length <= 0) {
							this.$alert('请上传营业执照', '提示信息', {
								confirmButtonText: '确定'
							});
							return false;
						} else {
							if(this.$refs.licenceUrlInput.files[0].size < 1024 * 50 || this.$refs.licenceUrlInput.files[0].size > 1024 * 1024 * 1) {
								this.$alert('营业执照必须大于100kb小于1M', '提示信息', {
									confirmButtonText: '确定'
								});
								return false;
							}
						}
						if(this.$refs.idFrontUrlInput.files.length <= 0) {
							this.$alert('请上传身份证正面', '提示信息', {
								confirmButtonText: '确定'
							});
							return false;
						} else {
							if(this.$refs.idFrontUrlInput.files[0].size < 1024 * 50 || this.$refs.idFrontUrlInput.files[0].size > 1024 * 1024 * 1) {
								this.$alert('身份证正面必须大于100kb小于1M', '提示信息', {
									confirmButtonText: '确定'
								});
								return false;
							}
						}
						if(this.$refs.idBackUrlInput.files.length <= 0) {
							this.$alert('请上传身份证反面', '提示信息', {
								confirmButtonText: '确定'
							});
							return false;
						} else {
							if(this.$refs.idBackUrlInput.files[0].size < 1024 * 50 || this.$refs.idBackUrlInput.files[0].size > 1024 * 1024 * 1) {
								this.$alert('身份证反面必须大于100kb小于1M', '提示信息', {
									confirmButtonText: '确定'
								});
								return false;
							}
						}
						this.isLoad=true;
						$http({
							url: common.apihost + 'apply/registerAccountStepTwo',
							data: {
								data: {
									mobile: this.regForm.mobile,
									realName: this.removeAllSpace(this.regForm.realName),
									idCard: this.removeAllSpace(this.regForm.idCard),
									companyName: this.removeAllSpace(this.regForm.companyName)
								}
							},
							method: 'post'
						}).then((response) => {
								if(response.data.code == 1) {
									localStorage.setItem('phone', this.regForm.phone);
									setTimeout(() => {
										this.$router.push('/apply-suc');
								     }, 2000);
								     setTimeout(() => {
								     	this.isLoad=false;
										this.$refs['regForm'].resetFields();
									}, 3000);
								} else {
									this.isLoad=false;
									this.$router.push('/apply-fail');
								}
						}).then((error) => this.error = error)
					} else {
						return false;
					}
				});
			}
		},
		components: {
			Loading
		}
	}
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	
	.register-upload {
		display: inline-block;
		width: 100%;
		height: 100%;
		vertical-align: middle;
		background: url(../../../assets/img/merchan-bg.jpg) no-repeat;
		background-size: 100% 100%;
		.el-form-item__content {
			margin-left: 0 !important;
		}
		.el-input__inner {
			min-width: 165px !important;
			height: 47px !important;
			margin-top: 1px;
			margin-left: -24px !important;
			border: none !important;
		}
		.el-form-item__error {
			padding-top: 10px !important;
		}
		.el-button--default span {
			color: #fff !important;
		}
		.reg-title {
			color: #fff;
			font-size: 48px;
		}
		.reg-inner {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -400px;
			margin-left: -320px;
		}
		.reg-cont {
			width: 640px;
			height: 590px;
			padding: 50px;
			margin-top: 30px;
			display: inline-block;
			border-radius: 12px;
			-webkit-border-radius: 12px;
			-moz-border-radius: 12px;
			background: #fff;
			.reg-tip {
				width: 510px;
			}
		}
		.reg-cont .reg-cont-item {
			width: 400px;
			height: 50px;
			display: inline-block;
			margin-top: 10px;
			line-height: 49px;
			border: 1px solid #655755;
			background-color: #fff;
		}
		.reg-cont .reg-cont-item .el-input {
			width: 285px;
			height: 48px;
			color: #655755;
			font-size: 18px;
		}
		.reg-cont .reg-cont-item .icon-user {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			margin-top: -5px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -0 -0 no-repeat;
		}
		.reg-cont .icon-pwd {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			margin-top: -5px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -51px -0 no-repeat;
		}
		.reg-btn {
			width: 400px;
			margin-top: 40px;
			display: inline-block;
			font-size: 24px;
			text-decoration: none;
			border-radius: 5px;
			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
			background-color: #655755;
			span {
				height: 40px;
				line-height: 39px;
				color: #fff;
			}
		}
		.reg-cont-send {
			display: inline-block;
			margin-top: 10px;
		}
		.reg-message {
			width: 250px;
			height: 50px;
			border: 1px solid #655755;
		}
		.reg-message .el-input {
			width: 140px;
			height: 48px;
			padding: 0 10px;
			line-height: 48px;
			color: #655755;
			font-size: 18px;
		}
		.reg-message .icon-message {
			display: inline-block;
			width: 40px;
			height: 42px;
			margin-right: 10px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -109px -0 no-repeat;
		}
		.reg-cont-reg {
			display: inline-block;
			width: 400px;
			margin-top: 20px;
		}
		.set-pwd {
			width: 138px;
			height: 45px;
			display: inline-block;
			margin-left: 20px;
			line-height: 44px;
			font-size: 18px;
			border-radius: 30px;
			-webkit-border-radius: 30px;
			-moz-border-radius: 30px;
			background-color: #655755;
			span {
				color: #fff;
			}
		}
		.el-upload {
			width: 400px;
			display: inline-block;
			text-align: left;
		}
	}
</style>