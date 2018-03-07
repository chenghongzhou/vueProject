<template>
	<div class="setting" id="setting" v-cloak>
		<el-form :model="setForm" :rules="rules" ref="setForm" label-width="100px" class="demo-ruleForm">
			<div class="set-inner">
				<div class="set-bg">
					<div class="set-seto">设置密码</div>
				</div>
				<div class="set-cont">
					<el-form-item prop="phone">
						<el-input type="hidden" v-model="setForm.phone"></el-input>
					</el-form-item>
					<el-form-item class="set-cont-item" prop="password"><i class="icon-user"></i>
						<el-input type="password" placeholder="请设置密码" v-model="setForm.password"></el-input>
					</el-form-item>
					<el-form-item class="set-cont-item" prop="passwordAgain"><i class="icon-pwd"></i>
						<el-input @keyup.enter.native="submitForm('setForm')" type="password" placeholder="再次输入密码" v-model="setForm.passwordAgain"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button class="set-btn" @click="submitForm('setForm')">下一步</el-button>
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
		name: 'setting',
		data() {
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
			var validatePassAgain = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.setForm.passwordAgain) {
					callback(new Error('两次输入密码不一致'));
				} else {
					var reg = /^[\w]{6,20}$/g;
					if(!reg.test(value)) {
						callback(new Error('请输入6-20位字母、数字或下划线'));
					}
					callback();
				}
			};
			return {
				isLoad: false,
				setForm: {
					phone: localStorage.getItem('phone'),
					password: null,
					passwordAgain: null,
					error: null
				},
				rules: {
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					passwordAgain: [{
						validator: validatePassAgain,
						trigger: 'blur'
					}]
				}
			};
		},
		beforeRouteLeave(to, from, next) {
			setTimeout(() => {
				this.$refs['setForm'].resetFields();
			}, 3000);
			next();
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.isLoad=true;
						$http({
							url: common.apihost + 'password/surePassword',
							data: {
								phone: this.setForm.phone,
								password: this.removeAllSpace(this.setForm.password),
								passwordAgain: this.removeAllSpace(this.setForm.passwordAgain)
							},
							method: 'post'
						}).then((response) => {
							if(response.data.code == 1) {
								this.$alert('设置成功，去登录', '提示信息', {
									confirmButtonText: '确定'
								}).then(() => {
									localStorage.removeItem('user');
									this.$router.push('/');
								});
								setTimeout(() => {
									this.isLoad=false;
									this.$refs['setForm'].resetFields();
								}, 2000);
							} else {
								this.isLoad=false;
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
	.setting {
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
			height: 54px !important;
			margin-top: 1px;
			margin-left: -24px !important;
			border: none !important;
		}
		.el-button--default span {
			color: #fff !important;
		}
		.set-seto {
			color: #fff;
			font-size: 48px;
		}
		.set-inner {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -360px;
			margin-left: -320px;
		}
		.set-cont {
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
		.set-cont .set-cont-item {
			width: 400px;
			height: 60px;
			display: inline-block;
			margin: 20px 0;
			line-height: 60px;
			border: 1px solid #655755;
			background-color: #fff;
		}
		.set-cont .set-cont-item .el-input {
			width: 285px;
			height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.set-cont .set-cont-item .icon-user {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			margin-top: -5px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -0 -0 no-repeat;
		}
		.set-cont .set-cont-item .icon-pwd {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 20px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -51px -0 no-repeat;
		}
		.set-btn {
			width: 400px;
			height: 60px;
			margin-top: 130px;
			display: inline-block;
			font-size: 24px;
			text-decoration: none;
			border-radius: 5px;
			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
			background-color: #655755;
			span {
				color: #fff;
			}
		}
		.set-cont-send {
			display: inline-block;
			margin-top: 20px;
		}
		.set-message {
			width: 245px;
			height: 57px;
			margin-right: 24px;
			border: 1px solid #655755;
		}
		.set-message input {
			width: 140px;
			height: 50px;
			padding: 0 10px;
			line-height: 50px;
			color: #655755;
			font-size: 18px;
		}
		.set-message .icon-message {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin-right: 10px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -109px -0 no-repeat;
		}
		.set-cont-reg {
			display: inline-block;
			width: 400px;
			margin-top: 20px;
		}
	}
</style>