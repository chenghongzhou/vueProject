<template>
	<section class="refund-info" v-cloak>
		<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
			<span class="font-md">当前位置：</span>
			<router-link class="tab-item font-ms" to="/index">
				<span>首页</span>
			</router-link>
			<a class="tab-item font-ms">
				<span> > 订单管理</span>
			</a>
			<a class="tab-item font-ms">
				<span> > 退款订单管理</span>
			</a>
		</div>
		<el-row class="uinn-20">
			<el-col :span="24">
				<!--表单-->
				<el-form :inline="true" :model="formInline" class="demo-form-inline text-l">
					<el-form-item label="交易订单号">
						<el-input class="input" v-model="formInline.orderNo"></el-input>
					</el-form-item>
					<el-form-item label="支付类型">
						<el-select class="input" v-model="formInline.type" placeholder="请选择">
							<!--<el-option label="全部选项" value="0"></el-option>-->
							<el-option label="支入" value="1">
							</el-option>
							<el-option label="支出" value="3">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="时间">
						<el-date-picker format="yyyy-MM-dd" @change="getStartTime" type="datetime" v-model="formInline.startTime" align="right">
						</el-date-picker>
						-
						<el-date-picker format="yyyy-MM-dd" @change="getEndTime" type="datetime" v-model="formInline.endTime" align="right">
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
					<!-- <el-button type="primary" @click="resetForm('formInline')">重置</el-button> -->
				</el-form>
				<!--表格-->
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column label="序号">
						<template scope="scope">
							{{ scope.$index+1 }}
						</template>
					</el-table-column>
					<el-table-column prop="orderNo" label="交易订单号">
					</el-table-column>
					<el-table-column prop="recordNo" label="支付订单号">
					</el-table-column>
					<el-table-column prop="channelName" label="支付渠道">
					</el-table-column>
					<el-table-column prop="payType" label="支付类型">
					</el-table-column>
					<el-table-column label="支付金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.amount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<el-table-column label="原单状态">
						<template scope="scope">
							<div class="status_fail_bgcolor" v-if="scope.row.isHandler==0">
								已成功
							</div>
							<div class="status_suc_bgcolor" v-else>
								进行中
							</div>
						</template>
					</el-table-column>
					<el-table-column label="退款类型">
						<template scope="scope">
							<div class="status_fail_bgcolor" v-if="scope.row.isHandler==0">
								已成功
							</div>
							<div class="status_suc_bgcolor" v-else>
								进行中
							</div>
						</template>
					</el-table-column>
					<el-table-column label="退款金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.amount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<el-table-column prop="orderTime" :formatter="dateFormat" label="申单时间">
					</el-table-column>
					<el-table-column label="退款单状态">
						<template scope="scope">
							<div class="status_fail_bgcolor" v-if="scope.row.isHandler==0">
								已成功
							</div>
							<div class="status_suc_bgcolor" v-else>
								进行中
							</div>
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
					orderNo: null,
					type: '1',
					startTime: null,
					endTime: null
				},
				channel: null,
				tableData: [],
				table_index: 999
			};
		},
		created() {
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
				return moment(date).format("YYYY-MM-DD HH:mm:ss");
			},
			getLoadData(pageNum, pageSize) {
				this.isLoad = true;
				$http({
					url: common.apihost + 'recordError/getRecordErrorList',
					data: {
						data: {
							page: pageNum,
							pagesize: pageSize,
							orderNo: this.formInline.orderNo,
							type: this.formInline.type || '1',
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
			handleSizeChange(val) {
				this.pagesize = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			isBack: function() {
				this.$router.go(1);
			}
		},
		components: {
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.refund-info {
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