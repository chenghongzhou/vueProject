<template>
	<section class="account-info">
		<div class="accountDetail text-l">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<a class="tab-item font-ms">
					<span> > 设置</span>
				</a>
				<a class="tab-item font-ms">
					<span> > 账号基础信息</span>
				</a>
			</div>
			<div class="account-cont">
				<div class="detail-item"><label>注册ID：</label>
					<span>{{ detailInfo.merchantAccountId || '--' }}</span>
				</div>
				<div class="detail-item"><label>注册手机号：</label>
					<span>{{ detailInfo.mobile || '--' }}</span>
				</div>
				<!-- <div class="bd-line"></div> -->
				<div class="detail-item"><label>机构名称：</label>
					<span>{{ detailInfo.companyName || '--' }}</span>
				</div>
				<!-- <div class="bd-line"></div> -->
				<div class="detail-item"><label>法人姓名：</label>
					<span>{{ detailInfo.realName || '--' }}</span>
				</div>
				<div class="detail-item"><label>身份证号：</label>
					<span>{{ detailInfo.idCard || '--' }}</span>
				</div>
				<div class="bd-line"></div>
				<div class="addForm clear" v-if="show" style="margin-top:25px;">
					<el-form :model="addForm" label-width="120px" :rules="addRules" ref="addForm" style="width:500px;">
						<el-form-item label="结算类型" prop="balanceType">
							<el-select v-model="addForm.balanceType" placeholder="请选择结算类型" :disabled="status == 1?true:false">
								<el-option v-for="value in addForm.types" :label="value.name" :value="value.code" :readonly="status == 1?true:false">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="结算费率" class="clear" prop="rate" style="width:495px;">
							<el-input class="left" placeholder="请输入结算费率" v-model="addForm.rate" :disabled="status == 1?true:false" @keyup.native="showUp($event)" ref="rate"></el-input>
							<span class="left" style="position:absolute;">%</span>
						</el-form-item>
						<el-form-item label="结算账户类型" prop="balanceAccountType">
							<el-radio-group v-model="addForm.balanceAccountType" :disabled="status == 1?true:false">
								<el-radio v-for="value in addForm.accountType" :label="value.code" :readonly="status == 1?true:false">{{value.name}}</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="结算银行" prop="balanceBank">
							<el-select v-model="addForm.balanceBank" placeholder="请选择结算类型" :disabled="status == 1?true:false">
								<el-option v-for="value in addForm.bankList" :label="value.name" :value="value.code">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="支行" prop="branch" v-if="addForm.balanceAccountType == 'public_account'">
							<el-input placeholder="请输入支行" v-model="addForm.branch" :disabled="status == 1?true:false"></el-input>
						</el-form-item>
						<el-form-item label="持卡人" prop="cardUserName">
							<el-input placeholder="请输入持卡人" v-model="addForm.cardUserName" :disabled="status == 1?true:false"></el-input>
						</el-form-item>
						<el-form-item label="卡号" prop="cardNo">
							<el-input placeholder="请输入卡号" v-model="addForm.cardNo" :disabled="status == 1?true:false"></el-input>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" :disabled="forbidden" @click="creatSys">保存</el-button>
							<el-button type="primary" @click="handleEdit">修改</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		</div>
		<Loading v-if="isLoad"></Loading>
	</section>
</template>
<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import $http from '../../../assets/js/http.js'
	import Loading from '../login/loading.vue'
	import moment from 'moment'
	export default {
		name: 'accounts',
		data() {
			var validateNumber = (rule, value, callback) => {
				if(!Number.isInteger(value)) {
					callback(new Error('输入值必须为数字'))
				} else {
					callback();
				}
			}
			return {
				forbidden: false,
				detailInfo: {},
				isLoad: false,
				show: true,
				dialogUpdateVisible: false,
				merchantList: [],
				merchantId: null,
				status: 1,
				addForm: {
					id: null,
					balanceType: null,
					types: [],
					rate: null,
					balanceAccountType: null,
					accountType: [],
					balanceBank: null,
					bankList: [],
					branch: null,
					cardUserName: null,
					cardNo: null
				},
				addRules: {
					balanceType: [{
						required: true,
						message: '请选择结算类型',
						trigger: 'change'
					}],
					rate: [{
							required: true,
							message: '请输入数字，且最多保留两位小数',
							trigger: 'change'
						},
						{
							pattern: /^[0-9][0-9]{0,2}(?:,?[0-9]{3})*(?:\.[0-9]{0,2})?$/,
							message: '请输入数字，且最多保留两位小数'
						}
					],
					balanceAccountType: [{
						required: true,
						message: '输入结算账户类型',
						trigger: 'change'
					}],
					balanceBank: [{
						required: true,
						message: '请输入结算银行',
						trigger: 'change'
					}],
					branch: [{
						required: true,
						message: '请输入支行',
						trigger: 'blur'
					}],
					cardUserName: [{
						required: true,
						message: '请输入持卡人',
						trigger: 'blur'
					}],
					cardNo: [{
							required: true,
							message: '请输入卡号',
							trigger: 'blur'
						},
						{
							pattern: /^\d+$/,
							message: '请输入数字'
						}
					]
				},
			}
		},
		created() {
			this.getLoadData();
		},
		methods: {
			//监听键盘事件
			showUp(e) {
				let value = this.$refs.rate.value;
				let t = value.charAt(0);
				this.addForm.rate = value.replace(/^\./g, "")
				this.addForm.rate = value.replace(/\.{2,}/g, ".");
				this.addForm.rate = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				if(t == "-") {
					this.addForm.rate = "";
				}
				if(!/^[0-9][0-9]{0,2}(?:,?[0-9]{3})*(?:\.[0-9]{0,2})?$/.test(value)) {
					this.addForm.rate = "";
				}
			},
			//时间格式化  
			dateFormat: function(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return moment(date).format("YYYY-MM-DD HH:mm:ss");
			},
			getLoadData() {
				this.isLoad = true;
				$http({
					url: common.apihost + 'balanceInfo/initclearing',
					method: 'post'
				}).then((response) => {
					this.isLoad = false;
					this.detailInfo = response.data.newMeChantAccount;
					this.addForm = response.data.balanceInfo;
					let rates = response.data.balanceInfo.rate / 0.01;
					this.addForm.rate = rates.toString() || '';
					this.addForm.types = response.data.clearingTypes;
					this.addForm.balanceType = this.addForm.balanceType || '';
					this.addForm.accountType = response.data.clearingAccounts;
					this.addForm.balanceAccountType = this.addForm.balanceAccountType || '';
					this.addForm.bankList = response.data.clearingBanks;
					this.addForm.balanceBank = this.addForm.balanceBank || '';
					this.addForm.id = response.data.balanceInfo.id;
					if(response.data.balanceInfo.id == null) {
						this.status = 0
					} else {
						this.status = 1
						this.forbidden = true;
					}

				});
			},
			creatSys() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						var rate = this.addForm.rate / 100;
						$http({
							url: common.apihost + 'balanceInfo/addorupdate',
							data: {
								data: {
									id: this.addForm.id,
									balanceType: this.addForm.balanceType,
									rate: rate,
									balanceAccountType: this.addForm.balanceAccountType,
									accountType: this.addForm.balanceAccountType,
									balanceBank: this.addForm.balanceBank,
									branch: this.addForm.branch,
									cardUserName: this.removeAllSpace(this.addForm.cardUserName),
									cardNo: this.removeAllSpace(this.addForm.cardNo)
								}
							},
							method: 'post'
						}).then((response) => {
							if(response.data.code == 1) {
								this.$message({
									message: "保存成功！",
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.getLoadData();
							}

						});
					}
				});
			},
			handleEdit() {
				this.status = 0;
				this.forbidden = false;
			},
			isBack: function() {
				this.$router.go(-1);
			}
		},
		components: {
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.account-info {
		.el-button--primary span {
			color: #fff !important;
		}
		.el-message-box__btns .cancel {
			float: right !important;
			margin-left: 10px !important;
		}
		.accountDetail {
			font-size: 14px;
			.detail-item {
				padding: 5px 0;
			}
			.bd-line {
				height: 10px;
				border-bottom: 1px solid #e2e2e2;
			}
			.detail-item label {
				width: 120px;
				display: inline-block;
				margin-right: 20px;
				text-align: right;
				color: #48576a;
			}
			.account-cont {
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