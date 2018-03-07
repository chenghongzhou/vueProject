<template>
	<div class="index-info">
		<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2" v-cloak>
			<span class="font-md">当前位置：</span>
			<router-link class="tab-item font-ms" to="/index">
				<span>首页</span>
			</router-link>
		</div>
		<Loading v-if="isLoad"></Loading>
	    <section class="chart-container">
				<!-- <el-row class="count" style="text-align: left;">
				    <el-row class="title" :span="24">基础统计</el-row>
				    <el-row :span="24">
				            <el-col :span="6">
				                <div>累计交易总金额</div>
				               <div>¥{{tableData.totalAmount}}</div>
				            </el-col>
				            <el-col :span="6">
				                <div>成功交易总金额</div>
				                <div>¥{{tableData.totalSuccessAmount}}</div>
				            </el-col>
				            <el-col :span="6">
				                <div>累计交易总订单数量</div>
				                <div>{{tableData.totalOrderNum}}</div>
				            </el-col>
				            <el-col :span="6">
				                <div>累计成功交易订单数量</div>
				                <div>{{tableData.successOrderNum}}</div>
				            </el-col>
				    </el-row>
				</el-row> -->
				<!-- <el-row>  -->
				<div class="show-section">
					<v-charts></v-charts>
				</div>
			<!-- </el-row> -->
		</section>
	</div>
</template>
<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import charts from './echarts.vue';
	import Loading from '../login/loading.vue'
	import axios from 'axios'
	import moment from 'moment';
	export default {
		name:'index',
		data() {
			return {
//				pagesize: 10,
//				page: 1,
				isLoad: false,
//				channel: '',
				//tableData:null

			};
		},
		created(){
		},
		methods: {
			//时间格式化  
			dateFormat: function(page, column) {
				var date = page[column.property];
				if(date == undefined) {
					return "";
				}
				return moment(date).format("YYYY-MM-DD HH:mm:ss");
			}
		},
		components: {
			'v-charts':charts,
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.index-info {
		.tb-title {
			margin: 20px;
			font-size: 17px;
			color: #333;
		}
		.el-button--primary span {
			color: #fff !important;
		}
		.el-table th>.cell {
			text-align: center;
		}
		.chart-container {
			margin: 20px 15px;
		}
		
	}
</style>