//登录
<template>
	<div class="apply" id="applyFail" v-cloak>
		<div class="apply-inner">
			<div class="apply-bg">
				<div class="apply-applyo">提交失败</div>
			</div>
			<div class="apply-cont text-c">
				<div><img src="../../../assets/img/pic-commit-fail.png" /></div>
				<div class="apply-cont-item color-org">提交申请失败，请返回申请页面重新提交。</div>
				<div>
					<a href="javascript:;" class="btn-back" @click="isBack">返回</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'applyFail',
		data() {
			return {}
		},
		components: {},
		methods: {
			isBack: function() {
				this.$router.push('/register');
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