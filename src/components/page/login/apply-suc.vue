//登录
<template>
	<div class="apply" id="applySuc" v-cloak>
		<div class="apply-inner">
			<div class="apply-bg">
				<div class="apply-applyo">提交成功</div>
			</div>
			<div class="apply-cont">
				<div class="text-c"><img src="../../../assets/img/pic-commit-suc.png" /></div>
				<div class="apply-cont-item text-l color-org">提交申请成功，请静待审核。</div>
				<div class="apply-cont-item text-l color-org">如审核通过，登录账号及密码将会发到您提供的手机号上，请注意查收。</div>
				<div>{{time+'自动返回登录'}}</div>
				<div>
					<a href="javascript:;" class="btn-back" @click="isBack">返回</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'applySuc',
		data() {
			return {
				time: 5 // 倒计时
			}
		},
		created() {
			this.loadTime();
		},
		methods: {
			loadTime: function() {
				let self = this;
				let interval = window.setInterval(function() {
					if((self.time--) <= 0) {
						self.time = 0;
						window.clearInterval(interval);
						window.location.href = "/upay-client/#/";
					}
				}, 1000);
			},
			isBack: function() {
				this.$router.push('/');
			}
		}
	}
</script>
<style type="text/css" lang="scss" scoped>
	@import '../../../assets/css/common.scss';
	.apply {
		display: inline-block;
		width: 100%;
		height: 100%;
		vertical-align: middle;
		background: url(../../../assets/img/merchan-bg.jpg) no-repeat;
		background-size: 100% 100%;
		.apply-applyo {
			color: #fff;
			font-size: 48px;
		}
		.apply-inner {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -360px;
			margin-left: -500px;
		}
		.apply-cont {
			width: 1000px;
			height: 540px;
			padding: 80px 165px;
			margin-top: 30px;
			display: inline-block;
			border-radius: 12px;
			-webkit-border-radius: 12px;
			-moz-border-radius: 12px;
			background: #fff;
		}
		.apply-cont .apply-cont-item {
			margin-top: 20px;
			line-height: 62px;
			font-size: 20px;
		}
		.btn-back {
			width: 200px;
			height: 48px;
			line-height: 47px;
			margin-top: 60px;
			display: inline-block;
			font-size: 18px;
			color: #fff;
			text-decoration: none;
			border-radius: 5px;
			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
			background-color: #655755;
		}
	}
</style>