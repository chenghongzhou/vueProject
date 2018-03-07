<template>
	<section class="flow-into" v-cloak>
		<div v-if="show">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<a class="tab-item font-ms">
				<span> > 资金管理</span>
				</a>
				<a class="tab-item font-ms">
					<span> > 支入流水记录</span>
				</a>
			</div>
			<el-col :span="24" class="uinn-20">
				<!--表单-->
				<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline text-l">
					<input type="hidden" v-model="formInline.status" />
					<el-form-item label="交易订单号" prop="orderNo">
						<el-input class="input" v-model="formInline.orderNo"></el-input>
					</el-form-item>
					<!-- <el-form-item label="时间" prop="startOrderTime">
						<el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" @change="getStartTime" v-model="formInline.startOrderTime" align="right">
						</el-date-picker>
						-
						<el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" @change="getEndTime" v-model="formInline.endOrderTime" align="right">
						</el-date-picker>
					</el-form-item> -->
					<el-form-item label="时间" prop="startOrderTime">
						<el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" @change="getStartTime" v-model="formInline.startOrderTime" align="right">
						</el-date-picker>
						-
					</el-form-item>
					<el-form-item prop="endOrderTime" style="margin-left:-10px;">
						<el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" @change="getEndTime" v-model="formInline.endOrderTime" align="right">
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
					<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
					<el-button type="primary" @click="download">导出</el-button>
				</el-form>
				<!--表格-->
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column label="序号" :width="columnWidth">
						<template scope="scope">
							{{ scope.$index+1 }}
						</template>
					</el-table-column>
					<el-table-column prop="orderNo" label="交易订单号">
					</el-table-column>
					<el-table-column label="支付金额">
						<template scope="scope">
							{{ '￥'+Number(scope.row.orderAmount/100).toFixed(2) || '0.00' }}
						</template>
					</el-table-column>
					<el-table-column prop="thirdCallbackTime" :formatter="dateFormat" label="订单完成时间">
						<template scope="scope">
							{{ scope.row.thirdCallbackTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template scope="scope">
							<a href="javascript:;" @click="selectDetail(scope.row.id)">查看</a>
						</template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination @size-change="handlepageChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
					</el-pagination>
				</div>
			</el-col>
			<Loading v-if="isLoad"></Loading>
		</div>

		<div class="flowDetail text-l" id="flowDetail" v-if="showDetail">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/home">
					<span>首页</span>
				</router-link>
				<router-link class="tab-item font-ms" to="">
					<span> > 资金管理</span>
				</router-link>
				<router-link class="tab-item font-ms" to="">
					<span> > 流水详情</span>
				</router-link>
			</div>
			<div class="pay-cont">
				<div class="detail-item"><label>支付订单号：</label><span>{{ detailInfo.recordNo || '--' }}</span></div>
				<div class="bd-line"></div>
				<div class="detail-item"><label>交易订单号：</label><span>{{ detailInfo.orderNo || '--' }}</span></div>
				<div class="detail-item"><label>所属商户：</label><span>{{ detailInfo.merchant.merchantName || '--' }}</span></div>
				<div class="detail-item"><label>所属系统：</label><span>{{ detailInfo.accessSystem.name || '--' }}</span></div>
				<div class="detail-item"><label>支付渠道：</label><span>{{ detailInfo.channel.name || '--' }}</span></div>
				<div class="bd-line"></div>
				<div class="detail-item"><label>支付金额：</label><span>{{ '￥'+Number(detailInfo.orderAmount/100).toFixed(2)||'0.00'}}</span></div>
				<div class="detail-item"><label>业务类型：</label><span>支入</span></div>
				<!--<div class="detail-item"><label>终端类型：</label><span></span></div>-->
				<!--<div class="detail-item"><label>支付通道：</label>
					<span v-if="detailInfo.channel.channelType==1">
				 	微信
				</span>
					<span v-if="detailInfo.channel.channelType==2">
				 	支付宝
				</span>
					<span v-if="detailInfo.channel.channelType==3">
				 	快捷支付
				</span>
				</div>-->
				<div class="detail-item"><label>订单状态：</label>
					<span style="margin-left: -3px;" v-if="detailInfo.status==0">
					失败
				</span>
					<span style="margin-left: -3px;" v-if="detailInfo.status==1">
					待处理
				</span>
					<span style="margin-left: -3px;" v-if="detailInfo.status==2">
					成功
				</span>
				</div>
				<div class="bd-line"></div>
				<div class="detail-item"><label>下单时间：</label><span>{{ detailInfo.orderTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--'  }}</span></div>
				<div class="detail-item"><label>平台回调时间：</label><span>{{ detailInfo.accessCallbackTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}</span></div>
				<div>
					<a href="javascript:;" class="btn-back" @click="isBack">返回</a>
				</div>
			</div>
		</div>
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
				detailInfo: {
					merchant:{},
					accessSystem:{},
					channel:{}
				},
				show: false,
				showDetail: false,
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				isLoad: false,
				formInline: {
					orderNo: null,
					startOrderTime: null,
					endOrderTime: null,
					status: 2
				},
				tableData: [],
				table_index: 999
			};
		},
		created() {
			this.show = true;
			this.showDetail = false;
			this.getLoadData(this.currentPage, this.pagesize);
		},
		methods: {
			getStartTime(date) {
				this.formInline.startOrderTime = date;
			},
			getEndTime(date) {
				this.formInline.endOrderTime = date;
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
					url: common.apihost + 'record/paylist',
					data: {
						data: {
							page: pageNum,
							pagesize: pageSize,
							orderNo: this.formInline.orderNo,
							startOrderTime: this.formInline.startOrderTime,
							endOrderTime: this.formInline.endOrderTime,
							status: 2
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

				if(!timestamp2) {
					window.location.href = common.apihost + '/capitalExcle/poi?orderNo=' + this.formInline.orderNo + '&startOrderTime=' + this.formInline.startOrderTime + '&endOrderTime=' + this.formInline.endOrderTime;
				} else {
					if(timestamp < timestamp2) {
						window.location.href = common.apihost + '/capitalExcle/poi?orderNo=' + this.formInline.orderNo + '&startOrderTime=' + this.formInline.startOrderTime + '&endOrderTime=' + this.formInline.endOrderTime;
					} else {
						this.$alert('只能导出三个月的日志', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			handlepageChange(val) {
				this.pagesize = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			selectDetail(id) {
				this.show = false;
				this.showDetail = true;
				$http({
					url: common.apihost + 'record/getOneRecord',
					data: {
						data: {
							id: id,
						}
					},
					method: 'post'
				}).then((response) => {
					this.detailInfo = response.data;
					this.detailInfo.merchant = response.data.merchant;
					this.detailInfo.accessSystem = response.data.accessSystem;
					this.detailInfo.channel= response.data.channel;
				});
			},
			isBack: function() {
				this.show = true;
				this.showDetail = false;
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
	.flow-into {
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
		.flowDetail {
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