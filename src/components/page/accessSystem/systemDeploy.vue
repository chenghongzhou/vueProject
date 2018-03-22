<template>
	<section class="systemDeploy" v-cloak>
		<div v-if="show">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<router-link class="tab-item font-ms" to="/systemConfigure">
					<span> > 接入系统管理</span>
				</router-link>
				<a class="tab-item font-ms">
					<span> > {{systemName}}</span>
				</a>
			</div>
			<el-col :span="24" class="uinn-20">
				<!--表格-->
				<div class="system_deploy">
					<div class="top_sys clear">
						<div class="left">{{systemName}}</div>
						<div class="right">{{systemCode}}</div>
					</div>
					<div style="padding: 10px;">
						<!-- 列表 start -->
						<div class="table_sys" v-for="(item, key, index) in tableData" v-if="item!=''">
							<div class="text-l pay_sys clear">
								<div class="left type" @click="toggle(index)" v-if="key==1">
									<i class="icon_platform"></i>&nbsp;&nbsp;平台支付
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==2">
									<i class="icon_shortcut"></i>&nbsp;&nbsp;快捷支付
									<span style="font-size: 12px;color: #999;">&nbsp;&nbsp;&nbsp;&nbsp;注意：您添加的开启时间段不能出现间隔，否则会导致交易失败</span>
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==3">
									<i class="icon_bank"></i>&nbsp;&nbsp;银行支付
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==4">
									<i class="icon_sao"></i>&nbsp;&nbsp;条形码支付
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==5">
									<i class="icon_payment"></i>&nbsp;&nbsp;代付
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==6">
									<i class="icon_wap"></i>&nbsp;&nbsp;网关支付
									<span style="font-size: 12px;color: #999;">&nbsp;&nbsp;&nbsp;&nbsp;注意：您添加的开启时间段不能出现间隔，否则会导致交易失败</span>
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==7">
									<i class="icon_wang"></i>&nbsp;&nbsp;wap支付
								</div>
								<span class="right">
									<a href="javascript:;"  @click="handleAdd(key)">+添加渠道</a>
									<i :class="[ indexes== index &&isShow?turnDown:turnOn]" @click="toggle(index)"></i>
								</span>
							</div>
							<div class="table_list" v-if="isShow && indexes==index">
								<table cellpadding="0" cellspacing="0">
									<tr>
										<th>
											<div class="cell">所属商户名称</div>
										</th>
										<th>
											<div class="cell">接入支付渠道</div>
										</th>
										<th>
											<div class="cell">创建时间</div>
										</th>
										<th v-if="key==2 || key==6">
											<div class="cell">开启时间</div>
										</th>
										<th>
											<div class="cell">系统授权编码</div>
										</th>
										<th>
											<div class="cell">单日限额(元)</div>
										</th>
										<th>
											<div class="cell">单笔限额(元)</div>
										</th>
										<th>
											<div class="cell">限额状态</div>
										</th>
										<th>
											<div class="cell">接入状态</div>
										</th>
										<th>
											<div class="cell">操作</div>
										</th>
									</tr>
									<tr v-for="items in item">
										<td>
											<div class="cell">{{items.merchantName || '--'}}</div>
										</td>
										<td>
											<div class="cell">{{items.channelName || '--'}}</div>
										</td>
										<td>
											<div class="cell">{{items.createTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}</div>
										</td>
										<td v-if="key==2 || key==6">
											<div class="cell">{{items.timeQuantum || '--' }}</div>
										</td>
										<td>
											<div class="cell">{{items.accessKey}}</div>
										</td>
										<td>
											<div class="cell">{{Number(items.upperBound/100).toFixed(2) || '--'}}</div>
										</td>
										<td>
											<div class="cell">{{items.single_limit||'--'}}</div>
										</td>
										<td>
											<div class="cell">
												<div class="status_suc_bgcolor" v-if="items.isThreshold==2">
													可用
												</div>
												<div class="status_fail_bgcolor" v-else>
													已超额
												</div>
											</div>
										</td>
										<td>
											<div class="cell">
												<div class="status_suc_bgcolor" v-if="items.status==1">
													启用
												</div>
												<div class="status_fail_bgcolor" v-else>
													禁用
												</div>
											</div>
										</td>
										<td>
											<div class="cell">
												<a href="javascript:;" style="margin-right: 10px;" :id="items.id" @click="handleSelect">查看</a>
												<a href="javascript:;" style="margin-right: 10px;" :id="items.id" @click="handleUsed" v-if="items.status==0">启用</a>
												<a href="javascript:;" style="margin-right: 10px;" :id="items.id" @click="handleDisabled" v-if="items.status==1">锁定</a>
												<a href="javascript:;" :id="items.id" @click="handleConfig">配置规则</a>
											</div>
										</td>
									</tr>
								</table>
							</div>
						</div>
						<div class="table_sys text-c" v-else>
							<div class="text-l pay_sys clear">
								<div class="left type" @click="toggle(index)" v-if="key==1">
									<i class="icon_platform"></i>&nbsp;&nbsp;平台支付
								</div>
								<div class="left type" @click="toggle(index)" v-if="key==2">
									<i class="icon_shortcut"></i>&nbsp;&nbsp;快捷支付
									<span style="font-size: 12px;color: #999;">&nbsp;&nbsp;&nbsp;&nbsp;注意：您添加的开启时间段不能出现间隔，否则会导致交易失败</span>
								</div>
								<div class="left type" @click="toggle(index)" v-if="key==3">
									<i class="icon_bank"></i>&nbsp;&nbsp;银行支付
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==4">
									<i class="icon_sao"></i>&nbsp;&nbsp;条形码支付
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==5">
									<i class="icon_payment"></i>&nbsp;&nbsp;代付
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==6">
									<i class="icon_wap"></i>&nbsp;&nbsp;网关支付
									<span style="font-size: 12px;color: #999;">&nbsp;&nbsp;&nbsp;&nbsp;注意：您添加的开启时间段不能出现间隔，否则会导致交易失败</span>
								</div>
								<div class="left type" @click="toggle(index)"  v-if="key==7">
									<i class="icon_wang"></i>&nbsp;&nbsp;wap支付
								</div>
								<span class="right">
									<a href="javascript:;"  @click="handleAdd(key)">+添加渠道</a>
									<i :class="[ indexes== index &&isShow?turnDown:turnOn]" @click="toggle(index)"></i>
								</span>
							</div>

							<div class="table_list" v-if="isShow && indexes==index">
								<table cellpadding="0" cellspacing="0">
									<tr style="height: 100px;">
										<td colspan="8">
											<div class="cell">
												<span>暂无数据</span>
											</div>
										</td>
									</tr>
								</table>
							</div>
						</div>
						<!--<span v-if="key==1">暂无平台支付数据</span>
							<span v-if="key==2">暂无快捷支付数据</span>
							<span v-if="key==3">暂无银行支付数据</span>
							<span v-if="key==4">暂无条形码支付数据</span>
							<span v-if="key==5">暂无代付数据</span>
							<span v-if="key==6">暂无网关支付数据</span>
							<span v-if="key==7">暂无wap支付数据</span>-->

						<!-- 列表 end -->
					</div>
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
				<router-link class="tab-item font-ms" to="/systemConfigure">
					<span> > 接入系统管理</span>
				</router-link>
				<a class="tab-item font-ms">
					<span> > {{systemName}}</span>
				</a>
			</div>
			<div class="pay-cont">
				<!--<div class="detail-item"><label class="item-label">系统ID：</label><span>{{ detailInfo.systemCode || '--' }}</span></div>
				<div class="detail-item"><label class="item-label">接入系统名称：</label><span>{{ detailInfo.accessSystem.name || '--' }}</span></div>
				<div class="bd-line"></div>-->
				<div class="detail-item"><label class="item-label">所属商户名称：</label><span>{{ detailInfo.merchant.merchantName || '--' }}</span></div>
				<div class="bd-line"></div>
				<div class="detail-item"><label class="item-label">接入支付渠道：</label><span>{{ detailInfo.channel.name || '--' }}</span></div>
				<div class="detail-item"><label class="item-label">系统授权编码：</label><span>{{ detailInfo.accessSystem.accessKey || '--' }}</span></div>
				<div class="bd-line"></div>
				<div class="detail-item"><label class="item-label">接入状态：</label>
					<span v-if="detailInfo.status == 1">启用</span>
					<span v-else>停用</span>
				</div>
				<div>
					<a href="javascript:;" class="btn-back" @click="isBack">返回</a>
				</div>
			</div>
		</div>
		<!--新增-->
		<el-dialog title="新增接入系统配置" v-model="dialogCreateVisible" size="tiny">
			<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px">
				<el-form-item label="所属商户" prop="merchantName">
					<el-select v-model="createForm.merchantName" placeholder="请选择" @change="getPay(createForm.merchantName)">
						<el-option v-for="value in merchantList" :label="value.merchantName" :value="value.merchantId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="接入第三方渠道" prop="typePay">
					<el-checkbox-group v-model="createForm.typePay">
						<el-checkbox v-for="types in payList" :label="types.channel.id" :checked="true" name="type">{{types.channel.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="接入状态" prop="resource">
					<el-radio-group v-model="createForm.resource">
						<el-radio label="1">启用</el-radio>
						<el-radio label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="createSys">保存</el-button>
					<el-button @click="resetForm('createForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog title="添加系统配置参数" v-model="dialogConfigVisible">
			<el-form :model="createSysForm" :rules="sysRule" ref="createSysForm" label-width="120px" size="tiny">
				<el-form-item class="left" label="渠道开启时间段" v-if="isLimitHour" prop="openHour">
					<el-select class="input" style="width:150px;" v-model="createSysForm.openHour" placeholder="请选择">
						<el-option v-for="value in initStartHour" :key="value.ruleValue" :label="value.ruleName" :value="value.id"></el-option>
					</el-select>
				</el-form-item>
				<div class="left" style="position:relative;top:8px;width:40px;text-align:center;">&nbsp;&nbsp;-&nbsp;&nbsp;</div>
				<el-form-item class="left lfselect" v-if="isLimitHour" prop="closeHour">
					<el-select class="input" v-model="createSysForm.closeHour" placeholder="请选择" style="width:150px;">
						<el-option v-for="value in initEndHour" :key="value.ruleValue" :label="value.ruleName" :value="value.id"></el-option>
					</el-select>
				</el-form-item>
				<el-table :data="signingInfos" border style="width: 100%">
					<el-table-column prop="channel.name" label="渠道名称">
					</el-table-column>
					<el-table-column prop="merchantNo" label="商户号">
					</el-table-column>
					<el-table-column prop="upperBound" label="单日限额（元）">
						<template scope="scope">
							<input type="text" disabled="disabled" v-model="scope.row.upperBound" @change="_upper(scope.row.upperBound)" onkeypress="return event.keyCode>=48&&event.keyCode<=57" ref="uper">
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template scope="scope">
							<div class="status_suc_bgcolor" v-if="scope.row.status==2">
								可用
							</div>
							<div class="status_fail_bgcolor" v-else>
								已超额
							</div>
						</template>
					</el-table-column>
				</el-table><br/>
				<div style="text-align: left;">&nbsp;单笔限额：{{'￥'+Number(singleLimit).toFixed(2)||'0.00'}}</div>
				<el-form-item style="margin-top:30px;">
					<el-button type="primary" @click="createConfig">保存</el-button>
					<el-button @click="dialogConfigVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</section>
</template>
<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import $http from '../../../assets/js/http.js'
	import Loading from '../login/loading.vue'
	import moment from 'moment';
	export default {
		data() {
			var validateTime = (rule, value, callback) => {
				var closeNum = parseInt(value);
				var openStr = this.createSysForm.openHour;
				var openNum = parseInt(openStr);
				if(closeNum <= openNum) {
					callback(new Error('结束时间不能小于开始时间'))
				} else {
					callback();
				}
			}
			return {
				operateWidth: '180',
				timeWidth: '173',
				indexes: 0,
				turnOn: 'icon_turn_jt',
				turnDown: 'icon_turn_jb',
				isShow: false,
				detailInfo: {
					accessSystem: {},
					channel: {},
					createTime: null,
					id: null,
					merchant: {},
					merchantAccount: {
						mobile: ''
					},
					status: null,
					systemCode: ''
				},
				systemName: this.$router.history.current.query.name,
				systemCode: this.$router.history.current.query.systemCode,
				channelId: '',
				signingInfos: [],
				limitHourRules: [],
				show: false,
				showDetail: false,
				isLoad: false,
				dialogCreateVisible: false,
				dialogUpdateVisible: false,
				dialogConfigVisible: false,
				tableData: [],
				table_index: 999,
				systemList: [],
				merchantList: [],
				payList: [],
				initStartHour: [],
				initEndHour: [],
				limitAmountVosArr: [],
				isLimitHour: false,
				signingInfolist: [],
				upperId: null,
				singleLimit: 0,
				createForm: {
					merchantName: null,
					typePay: [],
					resource: '1'
				},
				createSysForm: {
					openHour: null,
					closeHour: null,
					systemChannelRuleStartHourId: null,
					systemChannelRuleEndHourId: null,
					ruleStartValue: null,
					ruleEndValue: null
				},
				limitType: "limit_hour",
				createRules: {
					merchantName: [{
						required: true,
						message: '请选择所属商户',
						trigger: 'change'
					}],
					resource: [{
						required: true,
						message: '请选择接入状态',
						trigger: 'change'
					}]
				},
				sysRule: {
					closeHour: [{
						validator: validateTime,
						trigger: 'change'
					}]
				}
			}
		},
		created() {
			this.show = true;
			this.showDetail = false;
			this.getLoadData();
			if(this.indexes==0) {
				this.isShow=true;
			}
		},
		methods: {
			//时间格式化  
			dateFormat: function(page, column) {
				var date = page[column.property];
				if(date == undefined) {
					return "";
				}
				return moment(date).format("YYYY-MM-DD HH:mm:ss");
			},
			getLoadData() {
				this.isLoad = true;
				$http({
					url: common.apihost + 'systemChannel/queryListByMerchantAccountIdAndSystemCode',
					data: {
						data: {
							systemCode: this.systemCode
						}
					},
					method: 'post'
				}).then((response) => {
					this.isLoad = false;
					if(!response.data.code) {
						this.tableData = response.data;
					}
				});
			},
			resetForm(formName) {
				this.dialogCreateVisible = false;
				if(this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			},
			handleSelect(e) {
				this.show = false;
				this.showDetail = true;
				var id = e.currentTarget.getAttribute("id");
				$http({
					url: common.apihost + 'systemChannel/init',
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
			handleAdd(id) {
				this.dialogCreateVisible = true;
				this.pullMerchant(this.$router.history.current.query.id);
				if(this.$refs['createForm'] !== undefined) {
					this.$refs['createForm'].resetFields();
				}
				sessionStorage.setItem('typeId', id);
			},
			pullMerchant(id) {
				let ids = id;
				//获取系统对应的商户列表
				$http({
					url: common.apihost + 'merchant/queryIdMerchantList',
					data: {
						data: {
							id: id
						}
					},
					method: 'post'
				}).then((response) => {
					this.merchantList = response.data;

				});
			},
			getPay(id) {
				//获取系统对应的商户列表
				$http({
					url: common.apihost + 'signingInfo/list-children',
					data: {
						data: {
							merchantId: id,
							systemCode: this.$router.history.current.query.systemCode,
							payType: sessionStorage.getItem('typeId')
						}
					},
					method: 'post'
				}).then((response) => {
					this.payList = response.data;
				});
			},
			createSys() {
				this.$refs.createForm.validate((valid) => {
					if(valid) {
						if(!this.createForm.typePay) {
							if(this.createForm.typePay.length <= 0) {
								this.$alert('选择第三方渠道', '提示信息', {
									confirmButtonText: '确定'
								});
								return;
							}
						}
						$http({
							url: common.apihost + 'systemChannel/add',
							data: {
								data: {
									systemCode: this.$router.history.current.query.systemCode,
									merchant_account_id: this.$router.history.current.query.id,
									clientTypes: this.createForm.typePay,
									merchantId: this.createForm.merchantName,
									status: this.createForm.resource
								}
							},
							method: 'post'
						}).then((response) => {
							this.dialogCreateVisible = false;
							if(response.data.code == 1) {
								this.$message({
									message: "提交成功！",
									type: 'success'
								});
								this.$refs['createForm'].resetFields();
								this.getLoadData();
							}
						});
					}
				});
			},
			handleEdit(index, row) {
				this.dialogUpdateVisible = true;
				this.updateForm = Object.assign({}, row);
				this.table_index = index;
			},
			handleUsed(e) {
				var id = e.currentTarget.getAttribute("id");
				$http({
					url: common.apihost + 'systemChannel/openSystemChannel',
					data: {
						data: {
							id: id,
						}
					},
					method: 'post'
				}).then((response) => {
					if(response.data.code == 1) {
						this.getLoadData();
					}
				});
			},
			handleDisabled(e) {
				var id = e.currentTarget.getAttribute("id");
				$http({
					url: common.apihost + 'systemChannel/closeSystemChannel',
					data: {
						data: {
							id: id,
						}
					},
					method: 'post'
				}).then((response) => {
					if(response.data.code == 1) {
						this.getLoadData();
					}
				});
			},
			_upper(id) {
				this.upperId = id;
			},
			handleConfig(e) {
				//开启渠道事件默认数据待确定
				this.channelId = e.currentTarget.getAttribute("id");
				$http({
					url: common.apihost + 'systemChannelRule/querySystemChannelRules',
					data: {
						data: {
							id: this.channelId
						}
					},
					method: 'post'
				}).then((response) => {
					if(response.data.code == 1) {
						this.dialogConfigVisible = true;
						//显示时间段
						this.isLimitHour = response.data.data.isLimitHour;
						//渲染表格
						this.signingInfos = response.data.data.signingInfos;
						//判断时间是否保存过
						let limitHour = response.data.data.limitHourRules;
						this.singleLimit = response.data.data.singleLimit;
						if(limitHour.length > 0) {
							for(let i = 0; i < limitHour.length; i++) {
								if(limitHour[i].sort == 1) {
									this.createSysForm.openHour = limitHour[i].channelRuleId;
									this.createSysForm.systemChannelRuleStartHourId = limitHour[i].id;
								} else {
									this.createSysForm.closeHour = limitHour[i].channelRuleId;
									this.createSysForm.systemChannelRuleEndHourId = limitHour[i].id;
								}
							}
						} else {
							this.createSysForm.openHour = 10043;
							this.createSysForm.closeHour = 10067;
							this.createSysForm.systemChannelRuleStartHourId = '';
							this.createSysForm.systemChannelRuleEndHourId = '';
						}
					}
				});
				this.openTimes()

			},
			openTimes() {
				$http({
					url: common.apihost + 'channelRule/list-children',
					data: {
						data: {
							ruleType: this.limitType
						}
					},
					method: 'post'
				}).then((response) => {
					let data = response.data.data;
					this.initStartHour = data;
					this.initEndHour = data;
				});
			},
			createConfig() {
				let limitAmountVosObj = {};
				this.limitAmountVosArr = [];
//				let reg = /^\+?[1-9][0-9]*$/;

				for(let i = 0; i < this.signingInfos.length; i++) {
					limitAmountVosObj = {
						signingInfoId: this.signingInfos[i].id,
						amount: this.signingInfos[i].upperBound || this.upperId
					}
//					if(!reg.test(this.signingInfos[i].upperBound)) {
//						this.$alert('请输入正整数', '提示信息', {
//							confirmButtonText: '确定'
//						});
//						return false;
//					}
					this.limitAmountVosArr.push(limitAmountVosObj);
				}
				let limitHourVo = {};
				if(!this.isLimitHour) {
					limitHourVo = null;
				} else {
					limitHourVo = {
						startHour: this.createSysForm.openHour,
						endHour: this.createSysForm.closeHour,
						systemChannelId: this.channelId,
						systemChannelRuleStartHourId: this.createSysForm.systemChannelRuleStartHourId,
						systemChannelRuleEndHourId: this.createSysForm.systemChannelRuleEndHourId
					}
				}
				$http({
					url: common.apihost + 'systemChannelRule/saveRules',
					data: {
						data: {
							limitHourVo,
							limitAmountVos: this.limitAmountVosArr
						}
					},
					method: 'post'
				}).then((response) => {
					if(response.data.code == 1) {
						this.dialogConfigVisible = false;
						this.$message({
							message: "提交成功！",
							type: 'success'
						});
						this.getLoadData();
					}
				});
			},
			isBack: function() {
				this.show = true;
				this.showDetail = false;
				this.$router.go(1);
			},
			toggle(j) {
				this.indexes = j;
				this.isShow = !this.isShow;
				if(this.isShow) {
					this.indexes != j;
				} else {
					this.indexes = j;
				}
			}
		},
		components: {
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	.systemDeploy {
		.type {
			width: 86%;
			height: 40px;
			cursor: pointer;
		}
		.icon_turn_jt {
			display: inline-block;
			cursor: pointer;
			width: 20px;
			height: 14px;
			margin-left: 10px;
			margin-top: 4px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -255px -112px no-repeat;
		}
		.icon_turn_jb {
			display: inline-block;
			width: 20px;
			height: 14px;
			cursor: pointer;
			margin-left: 10px;
			margin-top: 4px;
			vertical-align: middle;
			background: url(../../../assets/img/icon-sprite.png) -255px -133px no-repeat;
		}
		.system_deploy {
			.top_sys {
				height: 40px;
				line-height: 40px;
				margin-bottom: 10px;
				border-bottom: 1px solid #ddd;
				.right {
					font-size: 14px;
					color: #666;
				}
			}
			.table_sys {
				margin-bottom: 10px;
				border: 1px solid #ddd;
				background-color: #f3f3f3;
				.pay_sys {
					font-size: 14px;
					color: #666;
					line-height: 40px;
					padding: 0px 15px;
					.icon_shortcut {
						display: inline-block;
						width: 21px;
						height: 21px;
						vertical-align: middle;
						cursor: pointer;
						background: url(../../../assets/img/icon-sprite.png) -244px -29px no-repeat;
					}
					.icon_sao {
						display: inline-block;
						width: 21px;
						height: 20px;
						vertical-align: middle;
						cursor: pointer;
						background: url(../../../assets/img/icon-sprite.png) -211px -52px no-repeat;
					}
					.icon_wang {
						display: inline-block;
						width: 21px;
						height: 21px;
						vertical-align: middle;
						cursor: pointer;
						background: url(../../../assets/img/icon-sprite.png) -212px -130px no-repeat;
					}
					.icon_platform {
						display: inline-block;
						width: 21px;
						height: 21px;
						vertical-align: middle;
						cursor: pointer;
						background: url(../../../assets/img/icon-sprite.png) -244px -62px no-repeat;
					}
					.icon_bank {
						display: inline-block;
						width: 22px;
						height: 20px;
						vertical-align: middle;
						cursor: pointer;
						background: url(../../../assets/img/icon-sprite.png) -211px -94px no-repeat;
					}
					.icon_payment {
						display: inline-block;
						width: 21px;
						height: 21px;
						vertical-align: middle;
						cursor: pointer;
						background: url(../../../assets/img/icon-sprite.png) -244px 0 no-repeat;
					}
					.icon_wap {
						display: inline-block;
						width: 22px;
						height: 20px;
						vertical-align: middle;
						cursor: pointer;
						background: url(../../../assets/img/icon-sprite.png) -212px -161px no-repeat;
					}
				}
				.table_list {
					padding-top: 20px;
					padding-right: 20px;
					padding-left: 45px;
					padding-bottom: 20px;
					border-top: 1px solid #ddd;
					overflow: auto;
					table {
						width: 100%;
						font-size: 14px;
						background-color: #fff;
						border-right: 1px solid #eee;
					}
					table>tr>th {
						border-left: 1px solid #eee;
						border-top: 1px solid #eee;
						border-bottom: 1px solid #eee;
						div {
							color: #333;
						}
					}
					table>tr>td {
						border-left: 1px solid #eee;
						border-bottom: 1px solid #eee;
					}
					table>tr>th,
					table>tr>td {
						white-space: nowrap;
						overflow: hidden;
						text-align: left;
						height: 30px;
						min-width: 0;
						text-overflow: ellipsis;
						vertical-align: middle;
						box-sizing: border-box;
						position: relative;
						.cell {
							position: relative;
							display: inline-block;
							vertical-align: middle;
							overflow: hidden;
							padding-left: 18px;
							padding-right: 18px;
							text-align: center;
							word-wrap: normal;
							text-overflow: ellipsis;
							line-height: 34px;
							width: 100%;
							box-sizing: border-box;
						}
					}
				}
			}
		}
		.lfselect .el-form-item__content {
			margin-left: 0px!important;
		}
		.el-select .el-input {
			width: 150px!important;
		}
		.el-date-editor.el-input {
			width: 193px;
		}
		.el-select {
			width: 180px;
		}
		.el-checkbox+.el-checkbox {
			margin-left: 0;
			margin-right: 15px;
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
		.el-dialog__header {
			text-align: left !important;
		}
		.el-table th>.cell {
			text-align: center;
		}
		.el-form-item__label {
			/* width: 124px !important; */
		}
		.el-form-item__content {
			text-align: left;
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
			.detail-item label.item-label {
				width: 160px;
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
				margin-left: 180px;
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