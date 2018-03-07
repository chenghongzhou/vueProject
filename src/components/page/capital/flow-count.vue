<template>
	<section class="flow-count" v-cloak>
		<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
			<span class="font-md">当前位置：</span>
			<router-link class="tab-item font-ms" to="/index">
				<span>首页</span>
			</router-link>
			<a class="tab-item font-ms">
				<span> > 订单管理</span>
			</a>
			<a class="tab-item font-ms">
				<span> > 基础统计表</span>
			</a>
		</div>
		<el-row>
			<el-col :span="24" class="uinn-20">
				<!--表单-->
				<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline text-l">
					<el-form-item label="渠道名称" prop="channelId">
						<el-select class="input" v-model="formInline.channelId" placeholder="请选择">
							<el-option label="全部选项" value=""></el-option>
							<el-option v-for="item in channel" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="时间" prop="startTime">
						<el-date-picker format="yyyy-MM-dd" @change="getStartTime" type="datetime" v-model="formInline.startTime" align="right">
						</el-date-picker>
						-
					</el-form-item>
					<el-form-item prop="endTime" style="margin-left:-10px;">
						<el-date-picker format="yyyy-MM-dd" @change="getEndTime" type="datetime" v-model="formInline.endTime" align="right">
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
					<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
					<el-button type="primary" @click="download">导出</el-button>
				</el-form>
				<!--表格-->
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="day" :formatter="dateFormat" label="日期">
						<template scope="scope">
							{{ scope.row.day | dateFmt('YYYY-MM-DD') || '--' }}
						</template>
					</el-table-column>
					<el-table-column label="商户名称">
						<template scope="scope">
							{{ scope.row.merchantName || '--'}}
						</template>
					</el-table-column>
					<el-table-column label="支付渠道">
						<template scope="scope">
							{{ scope.row.channelName || '--'}}
						</template>
					</el-table-column>
					<!--<el-table-column label="商户号">
						<template scope="scope">
							{{ scope.row.merchantId || '--'}}
						</template>
					</el-table-column>-->
					<!-- <el-table-column label="累计支入金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.totalAmount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<el-table-column label="累计支出金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.totalAmount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column> -->
					<el-table-column label="实际交易金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.totalSuccessAmount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<el-table-column label="异常总额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.totalErrAmount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<el-table-column label="应交易金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.totalAmount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<!-- <el-table-column prop="" label="支入订单数">
					 					</el-table-column>
					 					<el-table-column prop="" label="支出订单数">
					 					</el-table-column> -->
					<el-table-column prop="successOrderNum" label="实际交易订单数">
						<template scope="scope">
							{{ scope.row.successOrderNum || '0' }}
						</template>
					</el-table-column>
					<el-table-column prop="totalOrderNum" label="应交易订单数">
						<template scope="scope">
							{{ scope.row.totalOrderNum || '0' }}
						</template>
					</el-table-column>
					<el-table-column prop="errOrderNum" label="异常订单数">
						<template scope="scope">
							{{ scope.row.errOrderNum || '0' }}
						</template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
					</el-pagination>
				</div>
			</el-col>
		</el-row>
		<Loading v-if="isLoad"></Loading>
	</section>
</template>
<script type="text/ecmascript-6">
	//导入common.js
	import common from '../../../assets/js/common.js'
	import $http from '../../../assets/js/http.js'
	import Loading from '../login/loading.vue'
	import moment from 'moment';
	export default {
		data() {
			return {
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				isLoad: false,
				formInline: {
					channelId: null,
					startTime: null,
					endTime: null,
					code: null
				},
				channel: null,
				tableData: [],
				table_index: 999
			};
		},
		created() {
			this.getFormData();
			this.getLoadData(this.currentPage, this.pagesize);
		},
		methods: {
			getStartTime(date) {
				this.formInline.startTime = date;
			},
			getEndTime(date) {
				this.formInline.endTime = date;
			},
			//时间格式化  
			dateFormat: function(page, column) {
				var date = page[column.property];
				if(date == undefined) {
					return "";
				}
				//return moment(date).format("YYYY-MM-DD HH:mm:ss");
				return moment(date).format("YYYY-MM-DD");
			},
			getFormData() {
				$http({
					url: common.apihost + 'channel/getChannelList',
					method: 'post'
				}).then((response) => {
					this.channel = response.data;
				});
			},
			getLoadData(pageNum, pageSize) {
				this.isLoad = true;
				$http({
					url: common.apihost + 'statisticsDto/search1',
					data: {
						data: {
							page: pageNum,
							pagesize: pageSize,
							code: this.formInline.channelId,
							startTime: this.formInline.startTime,
							endTime: this.formInline.endTime
						}
					},
					method: 'post'
				}).then((response) => {
					this.isLoad = false;
					if(!response.data.code) {
						this.totalCount = response.data.iTotalRecords;
						if(response.data.iTotalRecords > 0) {
							this.tableData = response.data.aaData;
						}else {
							this.tableData = null;
						}
					}
				});
			},
			onSubmit() {
				this.getLoadData(this.currentPage, this.pagesize);
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			download() {
				var date = new Date();
				date.setMonth(date.getMonth() - 3);
				var timestamp = Date.parse(date);
				timestamp = timestamp / 1000;

				var stringTime = this.formInline.startOrderTime;
				var timestamp2 = Date.parse(new Date(stringTime));
				timestamp2 = timestamp2 / 1000;
				window.location.href = common.apihost + 'statisticsDto/poi?code=' + this.formInline.channelId +
					'&startTime=' + this.formInline.startTime + '&endTime=' + this.formInline.endTime;
				//if(!timestamp2) {
				//	window.location.href = common.apihost + 'statisticsDto/poi?code=' + this.formInline.orderNo + '&startOrderTime=' + this.formInline.startOrderTime + '&endOrderTime=' + this.formInline.//endOrderTime;
				//} else {
				//	if(timestamp < timestamp2) {
				//		window.location.href = common.apihost + 'statisticsDto/poi?code=' + this.formInline.orderNo +'&startOrderTime=' + this.formInline.startOrderTime + '&endOrderTime=' + this.formInline.endOrderTime;
				//	} else {
				//	this.$alert('只能导出三个月的日志', '提示信息', {
				//		confirmButtonText: '确定'
				//	});
				//}
				//} 
			},
			handleSizeChange(val) {
				this.pagesize = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getLoadData(this.currentPage, this.pagesize);
			}
		},
		components: {
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.flow-count {
		.input {
			width: 130px !important;
		}
		.el-button--primary span {
			color: #fff !important;
		}
		.el-pagination {
			text-align: center !important;
			margin-top: 30px !important;
		}
		.el-message-box__btns .cancel {
			float: right !important;
			margin-left: 10px !important;
		}
		.el-table th>.cell {
			text-align: center;
		}
	}
</style>