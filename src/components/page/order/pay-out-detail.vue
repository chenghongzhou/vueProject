<template>
	<div class="payDetail text-l" id="payDetail">
		<div class="brand-wrap text-l">
			<router-link class="tab-item" to="/home">
				<span class="color-007aff">首页</span>
			</router-link>
			<router-link class="tab-item" to="">
				<span> / 订单管理</span>
			</router-link>
			<router-link class="tab-item" to="">
				<span> / 支付订单管理</span>
			</router-link>
			<router-link class="tab-item" to="">
				<span> / 订单详情</span>
			</router-link>
		</div>
		<div class="pay-cont">
			<div class="detail-item"><label>订单号：</label><span>{{ detailInfo.withdrawNo || '--' }}</span></div>
			<div class="bd-line"></div>
			<div class="detail-item"><label>支付订单号：</label><span>{{ detailInfo.orderNo || '--' }}</span></div>
			<div class="detail-item"><label>所属商户：</label><span>{{ detailInfo.merchant.merchantName || '--' }}</span></div>
			<div class="detail-item"><label>所属系统：</label><span>{{ detailInfo.accessSystem.name || '--' }}</span></div>
			<div class="detail-item"><label>支付渠道：</label><span>{{ detailInfo.channel.name || '--' }}</span></div>
			<div class="bd-line"></div>
			<div class="detail-item"><label>支付金额：</label><span>{{ detailInfo.orderAmount || '0.00' }}</span></div>
			<div class="detail-item"><label>业务类型：</label><span>支出</span></div>
			<!--<div class="detail-item"><label>终端类型：</label><span></span></div>-->
			<div class="detail-item"><label>支付通道：</label>
				<span v-if="detailInfo.channel.channelType==1">
				 	微信
				</span>
				<span v-if="detailInfo.channel.channelType==2">
				 	支付宝
				</span>
				<span v-if="detailInfo.channel.channelType==3">
				 	快捷支付
				</span>
			</div>
			<div class="detail-item"><label>订单状态：</label>
				<span v-if="detailInfo.status==0">
					失败
				</span>
				<span v-if="detailInfo.status==1">
					待处理
				</span>
				<span v-if="detailInfo.status==2">
					成功
				</span>
			</div>
			<div class="bd-line"></div>
			<div class="detail-item"><label>下单时间：</label><span>{{ detailInfo.orderTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--'  }}</span></div>
			<div class="detail-item"><label>平台回调时间：</label><span>{{ detailInfo.thirdCallbackTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}</span></div>
			<div>
				<a href="javascript:;" class="btn-back" @click="isBack">返回</a>
			</div>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	import axios from 'axios'
	export default {
		name: 'payDetail',
		data() {
			return {
				detailInfo: {}
			};
		},
		mounted: function() {
			let orderId = this.$router.history.current.query.id;
			this.getOrderDetail(orderId);
		},
		methods: {
			getOrderDetail(orderId) {
				axios.post('http://192.168.0.254:8093/withdraw/getOnewithdraw', {
					data: {
						id: orderId,
					}
				}).then((response) => {
					this.detailInfo = response.data;
				});
			},
			isBack: function() {
				this.$router.back();
			}
		}
	};
</script>
<style lang="scss">
	@import '../../../assets/css/common.scss';
	.payDetail {
		font-size: 14px;
		.detail-item {
			padding: 5px 0;
		}
		.bd-line {
			height: 10px;
			border-bottom: 1px solid #e2e2e2;
		}
		.detail-item label {
			width: 105px;
			display: inline-block;
			margin-right: 20px;
			text-align: right;
		}
		.pay-cont {
			margin: 40px 10px !important;
		}
		.btn-back {
			width: 140px;
			height: 40px;
			line-height: 40px;
			margin-top: 60px;
			margin-left: 130px;
			text-align: center;
			display: inline-block;
			font-size: 14px;
			color: #fff;
			text-decoration: none;
			border-radius: 5px;
			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
			background-color: #20a0ff;
		}
	}
</style>