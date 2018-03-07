<template>
	<div class="update-pwd" id="update-pwd" v-cloak>
		<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
			<span class="font-md">当前位置：</span>
			<router-link class="tab-item font-ms" to="/index">
				<span>首页</span>
			</router-link>
			<a class="tab-item font-ms">
				<span> > 设置</span>
			</a>
			<a class="tab-item font-ms">
				<span> > 修改密码</span>
			</a>
		</div>
		<div class="update-pwd-cont">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item prop="phone">
					<el-input type="hidden" v-model="ruleForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="原密码" prop="oldPassword">
					<el-input type="password" placeholder="请输入原密码" v-model="ruleForm.oldPassword" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input type="password" placeholder="请设置新密码" v-model="ruleForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="passwordAgain">
					<el-input type="password" placeholder="请再次输入密码" v-model="ruleForm.passwordAgain" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
			<Loading v-if="isLoad"></Loading>
		</div>
	</div>
</template>

<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import $http from '../../../assets/js/http.js'
	import Loading from '../login/loading.vue'
	export default {
		data() {
			var validateOldPass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入原密码'));
				} else {
					var reg = /^[\w]{6,20}$/g;
					if(!reg.test(value)) {
						callback(new Error('请输入6-20位字母、数字或下划线'));
					}
					callback();
				}
			};
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入新密码'));
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
				} else if(value !== this.ruleForm.password) {
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
				ruleForm: {
					phone: localStorage.getItem('user'),
					oldPassword: null,
					password: null,
					passwordAgain: null
				},
				rules: {
					oldPassword: [{
						validator: validateOldPass,
						trigger: 'blur'
					}],
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
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.isLoad=true;
						$http({
							url: common.apihost + 'password/updatePassword',
							data: {
								phone: this.ruleForm.phone,
								oldPassword: this.removeAllSpace(this.ruleForm.oldPassword),
								password: this.removeAllSpace(this.ruleForm.password),
								passwordAgain: this.removeAllSpace(this.ruleForm.passwordAgain)
							},
							method: 'post'
						}).then((response) => {
							if(response.data.code == 1) {
								this.isLoad=false;
								this.$alert('更新成功，重新登录', '提示信息', {
									confirmButtonText: '确定'
								}).then(() => {
									localStorage.removeItem('user');
									this.$router.push('/');
								});
							} else {
								this.isLoad=false;
							}

						}).then((error) => this.error = error)
					} else {
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		},
		components: {
			Loading
		}
	}
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.update-pwd {
		font-size: 14px;
		.update-pwd-cont {
			margin: 60px 100px !important;
		}
		.el-form-item__error {
			margin-left: 10px !important;
			padding-top: 5px !important;
		}
		.el-button--primary span {
			color: #fff !important;
		}
		.el-form-item__content {
			width: 420px !important;
		}
		.el-input {
			width: 400px !important;
		}
	}
</style>