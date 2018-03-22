<template>
	<section class="error-order">
		<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
			<span class="font-md">当前位置：</span>
			<router-link class="tab-item font-ms" to="/index">
				<span>首页</span>
			</router-link>
			<a class="tab-item font-ms">
				<span> > 订单管理</span>
			</a>
			<a class="tab-item font-ms">
				<span> > 异常订单管理</span>
			</a>
		</div>
		<el-row class="uinn-20">
			<el-col :span="24">
				<!--表单-->
				<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline text-l form_error">
					<el-form-item label="交易订单号" prop="orderNo">
						<el-input class="input" v-model="formInline.orderNo"></el-input>
					</el-form-item>
					<el-form-item label="支付渠道" prop="channel_name">
						<el-select class="input" v-model="formInline.channel_name" placeholder="请选择">
							<el-option label="全部选项" value=""></el-option>
							<el-option v-for="item in channel" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="支付类型" prop="type">
						<el-select class="input" v-model="formInline.type" placeholder="请选择">
							<!--<el-option label="全部选项" value="0"></el-option>-->
							<el-option label="支入" value="1">
							</el-option>
							<el-option label="支出" value="3">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="处理状态" prop="isHandler">
						<el-select class="input" v-model="formInline.isHandler" placeholder="请选择">
							<el-option label="全部选项" value=""></el-option>
							<el-option label="未处理" value="0">
							</el-option>
							<el-option label="已处理" value="1">
							</el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
					<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
				</el-form>
				<!--表格-->
				<el-table :data="tableData" border style="width: 100%" id="tables">
					<el-table-column label="序号" :width="columnWidth">
						<template scope="scope">
							{{ scope.$index+1 }}
						</template>
					</el-table-column>
					<el-table-column prop="orderNo" label="交易订单号">
					</el-table-column>
					<el-table-column prop="recordNo" label="支付订单号">
					</el-table-column>
					<el-table-column prop="channel_name" label="支付渠道">
					</el-table-column>
					<el-table-column prop="payType" label="支付类型">
						<template scope="scope">
							支入
						</template>
					</el-table-column>
					<el-table-column label="支付金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.record_order_amount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<el-table-column prop="orderTime" :formatter="dateFormat" label="申单时间" :width="timeWidth">
					     <template scope="scope">
					     	{{ scope.row.orderTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}
					     </template>
					</el-table-column>
					<el-table-column prop="depict" label="异常描述">
					     <template scope="scope">
					     	{{ scope.row.depict || '--' }}
					     </template>
					</el-table-column>
					<el-table-column label="处理状态">
						<template scope="scope">
							<div class="status_fail_bgcolor" v-if="scope.row.isHandler==0">
								未处理
							</div>
							<div class="status_suc_bgcolor" v-else>
								已处理
							</div>
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" :visible-arrow="false">
						<!-- <template scope="scope">
                           <div class="msg">
                                                 	    <div class="show_remark" v-show="showTen" @click="shows(scope.$index,scope.row)">
                                                 									{{scope.row.remark}}
                                                 		</div>
                                                 		<div v-show="show" @click="hides(scope.$index,scope.row)">
                                                 									{{scope.row.remark}}
                                                 		</div>
                                                 	</div>
                                                 </template> -->
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
				columnWidth:'90',
				timeWidth:'173',
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				isLoad: false,
				formInline: {
					orderNo: null,
					channel_name: null,
					type: '1',
					isHandler: null
				},
				channel: null,
				tableData: [],
				table_index: 999,
				showTen: true,
				show: false
			};
		},
		created() {
			this.getFormData();
			this.getLoadData(this.currentPage, this.pagesize);
		},
		methods: {
			shows(index, row) {
				this.showTen = false;
				this.show = true;
			},
			hides(index, row) {
				this.show = false;
				this.showTen = true;
			},
			//时间格式化  
			dateFormat: function(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return moment(date).format("YYYY-MM-DD HH:mm:ss");
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
					url: common.apihost + 'recordError/getRecordErrorList',
					data: {
						data: {
							page: pageNum,
							pagesize: pageSize,
							orderNo: this.formInline.orderNo,
							channel_name: this.formInline.channel_name,
							type: this.formInline.type || '0',
							isHandler: this.formInline.isHandler
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
			},
			handleMouseEnter: function(row, column, cell, event) {

				column.children[2].children[1].style.color = "black";
			},
			handleMouseOut: function(row, column, cell, event) {

				column.children[2].children[1].style.color = "red";
			}
		},
		components: {
			Loading
		}
	};
</script>
<style lang="scss">
	@import '../../../assets/css/common.scss';
	.error-order {
		.show_remark {
			white-space: nowrap;
			max-width: 110px;
			min-width: 50px;
			height: 45px!important;
			line-height: 45px;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.el-tooltip {}
		.form_error {
			margin-bottom: 20px!important;
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
	}
</style>