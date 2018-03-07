<template>
	<div class="login" id="login">
		<el-form :model="logForm" :rules="rules" ref="logForm" label-width="100px" class="demo-ruleForm">
			<div class="log-inner" v-cloak>
				<div class="log-bg">
					<div class="log-logo">聚合支付商户管理</div>
				</div>
				<div class="log-cont">
					<el-form-item class="log-cont-item" prop="loginName">
						<i class="icon-user"></i>
						<el-input placeholder="请输入账号" auto-complete="off" v-model="logForm.loginName"></el-input>
					</el-form-item>
					<el-form-item class="log-cont-item" prop="password">
						<i class="icon-pwd"></i>
						<el-input type="password" auto-complete="off" placeholder="请输入密码" v-model="logForm.password"></el-input>
					</el-form-item>
					<div class="log-cont-send">
						<el-form-item class="left log-message" prop="imgCode"><i class="icon-message"></i>
							<el-input @keyup.enter.native="submitForm('logForm')" placeholder="请输入图片验证码" v-model="logForm.imgCode"></el-input>
						</el-form-item>
						<div class="left"><img :src='logForm.imgDataUrl' @click="isImgCode" width="136" height="57" /></div>
					</div>
					<el-form-item>
						<el-button class="log-btn" @click="submitForm('logForm')">登录</el-button>
					</el-form-item>
					<div class="log-cont-reg">
						<a href="javascript:;" class="left color-org" @click="isResigter">申请注册</a>
						<a href="javascript:;" class="right color-org" @click="isFindPwd">找回密码</a>
					</div>
				</div>
			</div>
		</el-form>
		<Loading v-if="isLoad"></Loading>
	</div>
</template>

<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import { bus } from '../../../assets/js/bus.js'
	import $http from '../../../assets/js/http.js'
	import Loading from './loading.vue'
	export default {
		name: 'login',
		data() {
			var validateUser = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入账号'));
				} else {
					if(!(/(1[3-9]\d{9}$)/gi.test(value))) {
						callback(new Error('请输入正确手机号'));
					}
					callback();
				}
			};
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else {
					var reg = /^[\w]{6,20}$/g;
					if(!reg.test(value)) {
						callback(new Error('请输入6-20位字母、数字或下划线'));
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
			return {
				isLoad: false,
				logForm: {
					loginName: null,
					password: null,
					imgCode: null,
					imgDataUrl: common.apihost + 'imgCode/madeImg',
					error: null
				},
				rules: {
					loginName: [{
						validator: validateUser,
						trigger: 'blur'
					}],
					imgCode: [{
						validator: validateImgCode,
						trigger: 'blur'
					}],
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}]
				}
			};
		},
		beforeRouteLeave(to, from, next) {
			setTimeout(() => {
				this.$refs['logForm'].resetFields();
			}, 3000);
			next();
		},
		methods: {
			isImgCode: function() {
				this.logForm.imgDataUrl = this.logForm.imgDataUrl + '?t=' + new Date().getTime();
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.isLoad = true;
						$http({
							url: common.apihost + 'login/submitForXhr',
							data: {
								loginName: this.removeAllSpace(this.logForm.loginName),
								password: this.removeAllSpace(this.logForm.password),
								imgCode: this.removeAllSpace(this.logForm.imgCode)
							},
							method: 'post'
						}).then((response) => {
							if(response.data.code == 1) {
								localStorage.setItem('user', this.logForm.loginName);
								bus.$emit('loginSuc', localStorage.getItem('user'));
								setTimeout(() => {
									this.$router.push('/index');
								}, 2000);
								setTimeout(() => {
									this.isLoad = false;
									this.$refs['logForm'].resetFields();
									this.isImgCode();
								}, 3000);
							} else {
								this.isLoad = false;
								this.isImgCode();
							}

						}).then((error) => this.error = error)
					} else {
						return false;
					}
				});
			},
			isResigter: function() {
				this.$router.push('/register');
			},
			isFindPwd: function() {
				this.$router.push('/forgot-password');
			}
		},
		components: {
			Loading
		}
	}
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.login {
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
		.log-logo {
			color: #fff;
			font-size: 48px;
		}
		.log-inner {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -360px;
			margin-left: -320px;
		}
		.log-cont {
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
		.log-cont .log-cont-item {
			width: 400px;
			height: 60px;
			display: inline-block;
			margin: 20px 0;
			line-height: 60px;
			border: 1px solid #655755;
			background-color: #fff;
		}
		.log-cont .log-cont-item .el-input {
			width: 285px;
			height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.log-cont .log-cont-item .icon-user {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			margin-top: -5px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -0 -0 no-repeat;
		}
		.log-cont .log-cont-item .icon-pwd {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -51px -0 no-repeat;
		}
		.log-btn {
			width: 400px;
			height: 60px;
			margin-top: 32px;
			display: inline-block;
			font-size: 24px;
			color: #fff;
			text-decoration: none;
			border-radius: 5px;
			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
			background-color: #655755;
		}
		.log-cont-send {
			display: inline-block;
			margin-top: 20px;
			img {
				cursor: pointer;
			}
		}
		.log-message {
			width: 245px;
			height: 57px;
			margin-right: 24px;
			border: 1px solid #655755;
		}
		.log-message .el-input {
			width: 140px;
			height: 50px;
			padding: 0 10px;
			line-height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.log-message .icon-message {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 10px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -109px -0 no-repeat;
		}
		.log-cont-reg {
			display: inline-block;
			width: 400px;
		}
	}
</style>