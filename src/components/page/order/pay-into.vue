<template>
	<section class="pay-into" v-cloak>
		<div v-if="show">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<a class="tab-item font-ms">
					<span> > 订单管理</span>
				</a>
				<a class="tab-item font-ms">
					<span> > 支入订单管理</span>
				</a>
			</div>
			<el-row class="uinn-20">
				<el-col :span="24">
					<!--表单-->
					<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline text-l">
						<el-form-item label="交易订单号" prop="orderNo">
							<el-input class="input" v-model="formInline.orderNo"></el-input>
						</el-form-item>
						<el-form-item label="所属商户" prop="merchantId">
							<el-select class="input" v-model="formInline.merchantId" placeholder="请选择">
								<el-option label="全部选项" value=""></el-option>
								<el-option v-for="(value,key) in merchants" :label="key" :value="value">
								</el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="时间" prop="startOrderTime">
							<el-date-picker format="yyyy-MM-dd HH:mm:ss" @change="getStartTime" type="datetime" v-model="formInline.startOrderTime" align="right">
							</el-date-picker>
							-
							<el-date-picker format="yyyy-MM-dd HH:mm:ss" @change="getEndTime" type="datetime" v-model="formInline.endOrderTime" align="right">
							</el-date-picker>
						</el-form-item><br/> -->
						<el-form-item label="时间" prop="startOrderTime" style="margin-left:20px;">
							<el-date-picker format="yyyy-MM-dd HH:mm:ss" @change="getStartTime" type="datetime" v-model="formInline.startOrderTime" align="right">
							</el-date-picker>
							-
						</el-form-item>
						<el-form-item prop="endOrderTime" style="margin-left:-10px;">
							<el-date-picker format="yyyy-MM-dd HH:mm:ss" @change="getEndTime" type="datetime" v-model="formInline.endOrderTime" align="right">
							</el-date-picker>
						</el-form-item><br/>
						<el-form-item label="支付订单号" prop="recordNo">
							<el-input class="input" v-model="formInline.recordNo"></el-input>
						</el-form-item>
						<el-form-item label="所属系统" prop="systemCode">
							<el-select class="input" v-model="formInline.systemCode" placeholder="请选择">
								<el-option label="全部选项" value=""></el-option>
								<el-option v-for="(value,key) in systemCodes" :label="key" :value="value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="订单状态" prop="status">
							<el-select class="input" v-model="formInline.status" placeholder="请选择">
								<el-option label="全部选项" value=""></el-option>
								<el-option label="失败" value="0">
								</el-option>
								<el-option label="待处理" value="1">
								</el-option>
								<el-option label="成功" value="2">
								</el-option>
							</el-select>
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
							<template scope="scope">
								{{scope.row.orderNo || '--'}}
							</template>
						</el-table-column>
						<el-table-column prop="recordNo" label="支付订单号">
							<template scope="scope">
								{{scope.row.recordNo || '--'}}
							</template>
						</el-table-column>
						<el-table-column prop="merchant.merchantName" label="所属商户">
							<template scope="scope">
								{{scope.row.merchant.merchantName || '--'}}
							</template>
						</el-table-column>
						<el-table-column prop="accessSystem.name" label="所属系统">
							<template scope="scope">
								{{scope.row.accessSystem.name || '--'}}
							</template>
						</el-table-column>
						<el-table-column prop="channel.name" label="支付渠道">
							<template scope="scope">
								{{scope.row.channel.name || '--'}}
							</template>
						</el-table-column>
						<!--<el-table-column label="支付类型">
							<template scope="scope">
								{{ scope.row.channel.businessType ==1 ? '支付收款' : '代付/提现' }}
							</template>
						</el-table-column>-->
						<el-table-column label="支付金额">
							<template scope="scope">
								{{ '￥'+Number(scope.row.orderAmount/100).toFixed(2) || '0.00' }}
							</template>
						</el-table-column>
						<!--<el-table-column prop="channel.channelType" label="支付通道">
							<template scope="scope">
								<div v-if="scope.row.channel.channelType==1">
									微信
								</div>
								<div v-if="scope.row.channel.channelType==2">
									支付宝
								</div>
								<div v-if="scope.row.channel.channelType==3">
									快捷支付
								</div>
							</template>
						</el-table-column>-->
						<el-table-column prop="orderTime" :formatter="dateFormat" label="下单时间" :width="timeWidth">
						</el-table-column>
						<el-table-column label="订单状态">
							<template scope="scope">
								<div class="status_fail_bgcolor" v-if="scope.row.status==0">
									失败
								</div>
								<div class="status_wait_bgcolor" v-if="scope.row.status==1">
									待处理
								</div>
								<div class="status_suc_bgcolor" v-if="scope.row.status==2">
									成功
								</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" :width="operateWidth">
							<template scope="scope">
								<a href="javascript:;" class="umar-r" @click="selectDetail(scope.row.id)">查看</a>
								<span v-if="scope.row.ext2==0">
									<a href="javascript:;" :id="scope.row.orderNo" @click="handleError">提交异常</a>
								</span>
								<span style="color: #999;" v-else>
									已提交异常
								</span>
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
		</div>
		<div class="payDetail text-l" id="payDetail" v-if="showDetail">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<router-link class="tab-item font-ms" to="">
					<span> > 订单管理</span>
				</router-link>
				<router-link class="tab-item font-ms" to="">
					<span> > 支付订单管理</span>
				</router-link>
				<router-link class="tab-item font-ms" to="">
					<span> > 订单详情</span>
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
				<div class="detail-item"><label>支付金额：</label><span>{{ '￥'+Number(detailInfo.orderAmount/100).toFixed(2) || '0.00'}}</span></div>
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
		<!--新增-->
		<el-dialog title="提交异常" v-model="dialogErrorVisible" size="tiny">
			<el-form :model="errorForm" :rules="errorRules" ref="errorForm" label-width="120px">
				<el-form-item label="异常描述" prop="depict">
					<el-select v-model="errorForm.depict" placeholder="请选择">
						<el-option v-for="value in specification" :label="value" :value="value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="errorSys">保存</el-button>
					<el-button @click="dialogErrorVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
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
				columnWidth: '90',
				operateWidth: '160',
				timeWidth: '173',
				detailInfo: {
					merchant: {},
					accessSystem: {},
					channel: {}
				},
				show: false,
				showDetail: false,
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				isLoad: false,
				formInline: {
					recordNo: null,
					orderNo: null,
					startOrderTime: null,
					endOrderTime: null,
					systemCode: null,
					merchantId: null,
					status: null
				},
				tableData: [],
				systemCodes: {},
				merchants: {},
				specification: [],
				result: null,
				table_index: 999,
				dialogErrorVisible: false,
				errorForm: {
					depict: null
				},
				errorRules: {
					depict: [{
						required: true,
						message: '请选择异常原因',
						trigger: 'change'
					}]
				}
			};
		},
		created() {
			this.show = true;
			this.showDetail = false;
			this.getFormData();
			this.getErrorData();
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
			dateFormat: function(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return moment(date).format("YYYY-MM-DD HH:mm:ss");
			},
			getFormData() {
				$http({
					url: common.apihost + 'record/getPayCondition',
					method: 'post'
				}).then((response) => {
					this.systemCodes = response.data.systemCode;
					this.merchants = response.data.merchantMap;
				});
			},
			getErrorData() {
				$http({
					url: common.apihost + 'sysDictionary/list-children',
					data: {
						data: {
							parent: {
								code: 'exception_specification'
							}
						}
					},
					method: 'post'
				}).then((response) => {
					for(let i = 0; i < response.data.length; i++) {
						this.specification.push(response.data[i].value);
					}
				});
			},
			getLoadData(pageNum, pageSize) {
				this.isLoad = true;
				$http({
					url: common.apihost + 'record/paylist',
					data: {
						data: {
							page: pageNum,
							pagesize: pageSize,
							recordNo: this.formInline.recordNo,
							orderNo: this.formInline.orderNo,
							startOrderTime: this.formInline.startOrderTime,
							endOrderTime: this.formInline.endOrderTime,
							systemCode: this.formInline.systemCode,
							merchantId: this.formInline.merchantId,
							status: this.formInline.status
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
					window.location.href = common.apihost + '/recordExcle/poi?orderNo=' + this.formInline.orderNo + '&recordNo=' + this.formInline.recordNo + '&startOrderTime=' + this.formInline.startOrderTime + '&endOrderTime=' + this.formInline.endOrderTime + '&systemCode=' + this.formInline.systemCode + '&merchantId=' + this.formInline.merchantId + '&status=' + this.formInline.status;
				} else {
					if(timestamp < timestamp2) {
						window.location.href = common.apihost + '/recordExcle/poi?orderNo=' + this.formInline.orderNo + '&recordNo=' + this.formInline.recordNo + '&startOrderTime=' + this.formInline.startOrderTime + '&endOrderTime=' + this.formInline.endOrderTime + '&systemCode=' + this.formInline.systemCode + '&merchantId=' + this.formInline.merchantId + '&status=' + this.formInline.status;
					} else {
						this.$alert('只能导出三个月的日志', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			handleSizeChange(val) {
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
							id: id
						}
					},
					method: 'post'
				}).then((response) => {
					this.detailInfo = response.data;
					this.detailInfo.merchant = response.data.merchant;
					this.detailInfo.accessSystem = response.data.accessSystem;
					this.detailInfo.channel = response.data.channel;
				});
			},
			isBack: function() {
				this.show = true;
				this.showDetail = false;
				this.$router.go(1);
			},
			handleError(e) {
				this.dialogErrorVisible = true;
				this.errorForm.depict = '';
				this.result = e.currentTarget.getAttribute("id");
			},
			errorSys(e) {
				this.$refs.errorForm.validate((valid) => {
					if(valid) {
						$http({
							url: common.apihost + 'recordError/addRecordError',
							data: {
								data: {
									orderNo: this.result,
									type: 1,
									depict: this.errorForm.depict
								}
							},
							method: 'post'
						}).then((response) => {
							this.dialogErrorVisible = false;
							if(response.data.code == 1) {
								this.$message({
									message: "已提交为异常订单！",
									type: 'success'
								});
								this.getLoadData(this.currentPage, this.pagesize);
							}
						});
					}
				});
			}
		},
		components: {
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.pay-into {
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
		.el-dialog__header {
			text-align: left !important;
		}
		.el-form-item__content {
			text-align: left;
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