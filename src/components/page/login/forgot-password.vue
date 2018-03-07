<template>
	<div class="forgot" id="forgotPassword" v-cloak>
		<el-form :model="forForm" :rules="rules" ref="forForm" label-width="100px" class="demo-ruleForm">
			<div class="for-inner">
				<div class="for-bg">
					<div class="for-foro">找回密码</div>
				</div>
				<div class="for-cont">
					<el-form-item class="for-cont-item" prop="phone">
						<i class="icon-user"></i>
						<el-input placeholder="请输入手机号" v-model="forForm.phone"></el-input>
					</el-form-item>
					<div class="for-cont-send">
						<el-form-item class="left for-message" prop="imgCode"><i class="icon-message"></i>
							<el-input placeholder="请输入图片验证码" v-model="forForm.imgCode"></el-input>
						</el-form-item>
						<div class="left"><img :src='forForm.imgDataUrl' @click="isImgCode" width="136" height="57" /></div>
					</div>
					<div class="for-cont-send">
						<el-form-item class="left for-message" prop="phoneCode"><i class="icon-pwd"></i>
							<el-input type="text" @keyup.enter.native="submitForm('forForm')" placeholder="请输入短信验证码" v-model="forForm.phoneCode"></el-input>
						</el-form-item>
						<div class="left">
							<a href="javascript:;" class="set-pwd" @click="forForm.flag && getvalite()">
								<span v-if="forForm.sendMsgDisabled">{{forForm.time+'秒后获取'}}</span>
								<span v-if="!forForm.sendMsgDisabled">获取验证码</span>
							</a>
						</div>
					</div>
					<el-form-item>
						<el-button class="for-btn" @click="submitForm('forForm')">下一步</el-button>
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
	import $http from '../../../assets/js/http.js'
	import Loading from './loading.vue'
	export default {
		name: 'forgot',
		data() {
			var validatePhone = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入手机号'));
				} else {
					if(!(/(1[3-9]\d{9}$)/gi.test(value))) {
						callback(new Error('请输入正确手机号'));
					}
					callback();
				}
			};
			var validateImgCode = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入图片验证码'));
				} else {
					if(!(/^[\w]{4}$/gi.test(value))) {
						callback(new Error('图片验证码不正确，请重新输入'));
					}
					callback();
				}
			};
			var validatePhoneCode = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入短信验证码'));
				} else {
					if(!(/^\d{6}$/gi.test(value))) {
						callback(new Error('短信验证码不正确，请重新输入'));
					}
					callback();
				}
			};
			return {
				isLoad: false,
				forForm: {
					flag: true,
					phone: null,
					imgCode: null,
					phoneCode: null,
					imgDataUrl: common.apihost + 'imgCode/madeImg',
					time: 120, // 发送验证码倒计时
					sendMsgDisabled: false,
					error: null
				},
				rules: {
					phone: [{
						validator: validatePhone,
						trigger: 'blur'
					}],
					imgCode: [{
						validator: validateImgCode,
						trigger: 'blur'
					}],
					phoneCode: [{
						validator: validatePhoneCode,
						trigger: 'blur'
					}]
				}
			};
		},
		beforeRouteLeave(to, from, next) {
			this.$refs['forForm'].resetFields();
			this.forForm.sendMsgDisabled = false;
			this.forForm.flag = true;
			if(window.interval) {
				clearInterval(interval);
			}
			this.isImgCode();
			next();
		},
		methods: {
			getvalite: function() {
				let me = this;
				if(this.forForm.phone === '') {
					this.$alert('请输入手机号!', '提示信息', {
						confirmButtonText: '确定'
					});
					callback(new Error('请输入正确手机号'));
					return false;
				} else if(this.forForm.imgCode === '') {
					this.$alert('请输入图片验证码!', '提示信息', {
						confirmButtonText: '确定'
					});
					return false;
				} else {
					if(!(/(1[3-9]\d{9}$)/gi.test(this.forForm.phone))) {
						return false;
					} else if(!(/^[\w]{4}$/gi.test(this.forForm.imgCode))) {
						return false;
					} else {
						$http({
							url: common.apihost + 'imgCode/checkPhoneAndImg',
							data: {
								phone: this.removeAllSpace(this.forForm.phone),
								imgCode: this.removeAllSpace(this.forForm.imgCode)
							},
							method: 'post'
						}).then((response) => {
							if(response.data.code == 1) {
									$http({
										url: common.apihost + 'message/sendMessage',
										data: {
											phoneNumber: this.forForm.phone
										},
										method: 'post'
									}).then((response) => {
										me.forForm.sendMsgDisabled = true;
										me.forForm.flag = true;
										me.forForm.time=120;
										window.interval = window.setInterval(function() {
											me.forForm.time--;
											me.forForm.flag = false;
											if(me.forForm.time == 0) {
												me.forForm.sendMsgDisabled = false;
												window.clearInterval(interval);
											}
										}, 1000);
								}).then((error) => this.error = error)
							}else {
								me.forForm.sendMsgDisabled = false;
								this.isImgCode();
							}
						}).then((error) => this.error = error)
					}
				}
			},
			isImgCode: function() {
				this.forForm.imgDataUrl = this.forForm.imgDataUrl + '?t=' + new Date().getTime();
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.isLoad=true;
						$http({
							url: common.apihost + 'password/checkPhone',
							data: {
								phone: this.removeAllSpace(this.forForm.phone),
								imgCode: this.removeAllSpace(this.forForm.imgCode),
								phoneCode: this.removeAllSpace(this.forForm.phoneCode)
							},
							method: 'post'
						}).then((response) => {
								if(response.data.code == 1) {
									localStorage.setItem('phone', this.forForm.phone);
									setTimeout(() => {
										this.$router.push('/set-password');
										this.forForm.sendMsgDisabled = false;
										this.forForm.flag = true;
										window.clearInterval(interval);
									}, 2000);
									setTimeout(() => {
										this.isLoad=false;
										this.$refs['forForm'].resetFields();
										this.isImgCode();
									}, 3000);
								}else {
									this.isLoad=false;
									this.forForm.sendMsgDisabled = false;
									this.forForm.flag = true;
									window.clearInterval(interval);
									this.isImgCode();
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
	.forgot {
		display: inline-block;
		width: 100%;
		height: 100%;
		vertical-align: middle;
		background: url(../../../assets/img/merchan-bg.jpg) no-repeat;
		background-size: 100% 100%;
		.el-form-item__content {
			margin-left: 0 !important;
		}
		.el-form-item__error {
			padding-top: 10px !important;
		}
		.el-input__inner {
			min-width: 165px !important;
			height: 54px !important;
			margin-left: -24px !important;
			margin-top: 1px;
			border: 0 none !important;
		}
		.el-button--default span {
			color: #fff !important;
		}
		.for-foro {
			color: #fff;
			font-size: 48px;
		}
		.for-inner {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -360px;
			margin-left: -320px;
		}
		.for-cont {
			width: 640px;
			height: 540px;
			padding: 50px;
			margin-top: 30px;
			display: inline-block;
			border-radius: 12px;
			-webkit-border-radius: 12px;
			-moz-border-radius: 12px;
			background: #fff;
		}
		.for-cont .for-cont-item {
			width: 400px;
			height: 60px;
			display: inline-block;
			margin-top: 25px;
			line-height: 60px;
			border: 1px solid #655755;
			background-color: #fff;
		}
		.for-cont .for-cont-item .el-input {
			width: 285px;
			height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.for-cont .for-cont-item .icon-user {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			margin-top: 2px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -0 -0 no-repeat;
		}
		.for-cont .icon-pwd {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -51px -0 no-repeat;
		}
		.for-btn {
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
		.for-cont-send {
			display: inline-block;
			margin-top: 20px;
		}
		.for-message {
			width: 245px;
			height: 57px;
			margin-right: 20px;
			border: 1px solid #655755;
		}
		.for-message .el-input {
			width: 140px;
			height: 50px;
			padding: 0 10px;
			line-height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.for-message .icon-message {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 10px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -109px -0 no-repeat;
		}
		.for-cont-reg {
			display: inline-block;
			width: 400px;
			margin-top: 20px;
		}
		.set-pwd {
			width: 138px;
			height: 45px;
			display: inline-block;
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
	}
</style>