<template>
	<div class="register" id="register" v-cloak>
		<el-form :model="regForm" :rules="rules" ref="regForm" label-width="100px" class="demo-ruleregm">
			<div class="reg-inner">
				<div class="reg-bg">
					<div class="reg-title">注册</div>
				</div>
				<div class="reg-cont">
					<el-form-item class="reg-cont-item" prop="phone">
						<i class="icon-user"></i>
						<el-input placeholder="请输入手机号" v-model="regForm.phone"></el-input>
					</el-form-item>
					<div class="reg-cont-send">
						<el-form-item class="left reg-message" prop="imgCode"><i class="icon-message"></i>
							<el-input placeholder="请输入图片验证码" v-model="regForm.imgCode"></el-input>
						</el-form-item>
						<div class="left"><img :src='regForm.imgDataUrl' @click="isImgCode" width="136" height="57" /></div>
					</div>
					<div class="reg-cont-send">
						<el-form-item class="left reg-message" prop="phoneCode"><i class="icon-pwd"></i>
							<el-input @keyup.enter.native="submitForm('regForm')" type="text" placeholder="请输入短信验证码" v-model="regForm.phoneCode"></el-input>
						</el-form-item>
						<div class="left">
							<a href="javascript:;" class="set-pwd" @click="regForm.flag && getvalite()">
								<span v-if="regForm.sendMsgDisabled">{{regForm.time+'秒后获取'}}</span>
								<span v-if="!regForm.sendMsgDisabled">获取验证码</span>
							</a>
						</div>
					</div>
					<el-form-item>
						<el-button class="reg-btn" @click="submitForm('regForm')">下一步</el-button>
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
		name: 'register',
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
				regForm: {
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
			this.$refs['regForm'].resetFields();
			this.regForm.sendMsgDisabled = false;
			this.regForm.flag = true;
			if(window.interval) {
				clearInterval(interval);
			}
			this.isImgCode();
			next();
		},
		methods: {
			getvalite: function() {
				let me = this;
				if(this.regForm.phone === '') {
					this.$alert('请输入手机号!', '提示信息', {
						confirmButtonText: '确定'
					});
					return false;
				} else if(this.regForm.imgCode === '') {
					this.$alert('请输入图片验证码!', '提示信息', {
						confirmButtonText: '确定'
					});
					return false;
				} else {
					if(!(/(1[3-9]\d{9}$)/gi.test(this.regForm.phone))) {
						return false;
					} else if(!(/^[\w]{4}$/gi.test(this.regForm.imgCode))) {
						return false;
					} else {
						const urlPhone = common.apihost + 'message/sendMessage';
						const urlImg = common.apihost + 'imgCode/checkRegisterPhoneAndImg';

						$http({
							url: common.apihost + 'imgCode/checkRegisterPhoneAndImg',
							data: {
								phone: this.removeAllSpace(this.regForm.phone),
								imgCode: this.removeAllSpace(this.regForm.imgCode)
							},
							method: 'post'
						}).then((response) => {
							if(response.data.code == 1) {
								$http({
									url: common.apihost + 'message/sendMessage',
									data: {
										phoneNumber: this.regForm.phone
									},
									method: 'post'
								}).then((response) => {
									me.regForm.sendMsgDisabled = true;
									me.regForm.flag = true;
									me.regForm.time = 120;
									window.interval = window.setInterval(function() {
										me.regForm.time--;
										me.regForm.flag = false;
										if(me.regForm.time == 0) {
											me.regForm.sendMsgDisabled = false;
											window.clearInterval(interval);
										}
									}, 1000);
								}).then((error) => this.error = error)
							} else {
								me.regForm.sendMsgDisabled = false;
								this.isImgCode();
							}
						}).then((error) => this.error = error)

					}
				}
			},
			isImgCode: function() {
				this.regForm.imgDataUrl = this.regForm.imgDataUrl + '?t=' + new Date().getTime();
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.isLoad=true;
						$http({
							url: common.apihost + 'apply/registerAccountStepOne',
							data: {
								phone: this.removeAllSpace(this.regForm.phone),
								imgCode: this.removeAllSpace(this.regForm.imgCode),
								phoneCode: this.removeAllSpace(this.regForm.phoneCode)
							},
							method: 'post'
						}).then((response) => {
							if(response.data.code == 1) {
								localStorage.setItem('phone', this.regForm.phone);
								setTimeout(() => {
									this.$router.push('/register-upload');
									this.regForm.sendMsgDisabled = false;
									this.regForm.flag = true;
									window.clearInterval(interval);
								}, 2000);
								setTimeout(() => {
									this.isLoad=false;
									this.$refs['regForm'].resetFields();
									this.isImgCode();
								}, 3000);
							} else {
								this.isLoad=false;
								this.regForm.sendMsgDisabled = false;
								this.regForm.flag = true;
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
	.register {
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
			height: 54px !important;
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
			margin-top: -360px;
			margin-left: -320px;
		}
		.reg-cont {
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
		.reg-cont .reg-cont-item {
			width: 400px;
			height: 60px;
			display: inline-block;
			margin-top: 25px;
			line-height: 60px;
			border: 1px solid #655755;
			background-color: #fff;
		}
		.reg-cont .reg-cont-item .el-input {
			width: 285px;
			height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.reg-cont .reg-cont-item .icon-user {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			margin-top: 2px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -0 -0 no-repeat;
		}
		.reg-cont .icon-pwd {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
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
			margin-top: 20px;
		}
		.reg-message {
			width: 245px;
			height: 57px;
			margin-right: 20px;
			border: 1px solid #655755;
		}
		.reg-message .el-input {
			width: 140px;
			height: 50px;
			padding: 0 10px;
			line-height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.reg-message .icon-message {
			display: inline-block;
			width: 40px;
			height: 40px;
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