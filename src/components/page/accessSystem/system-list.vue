<template>
	<section class="flow-into" v-cloak>
		<div v-if="show">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<a class="tab-item font-ms">
					<span> > 接入信息管理</span>
				</a>
			</div>
			<el-col :span="24" class="uinn-20">
				<!--表单-->
				<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline text-l">
					<el-form-item label="系统名称" prop="name">
						<el-input class="input" v-model="formInline.name"></el-input>
					</el-form-item>
					<!-- <el-form-item label="时间">
						<el-date-picker format="yyyy-MM-dd" @change="getStartTime" type="datetime" v-model="formInline.startTime" align="right">
						</el-date-picker>
						-
						<el-date-picker format="yyyy-MM-dd" @change="getEndTime" type="datetime" v-model="formInline.endTime" align="right">
						</el-date-picker>
					</el-form-item> -->
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
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form>
				<!--表格-->
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column label="序号" :width="columnWidth">
						<template scope="scope">
							{{ scope.$index+1 }}
						</template>
					</el-table-column>
					<el-table-column prop="systemCode" label="系统ID">
						<template scope="scope">
							{{scope.row.systemCode || '--'}}
						</template>
					</el-table-column>
					<el-table-column prop="name" label="系统名称">
						<template scope="scope">
							{{scope.row.name || '--'}}
						</template>
					</el-table-column>
					<el-table-column prop="status" label="接入状态">
						<template scope="scope">
							<div class="status_suc_bgcolor" v-if="scope.row.status==1">
								启用
							</div>
							<div class="status_fail_bgcolor" v-else>
								禁用
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" :formatter="dateFormat" label="创建时间">
						<template scope="scope">
							{{scope.row.createTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template scope="scope">
							<a href="javascript:;" class="umar-r" :id="scope.row.id" @click="handleSelect">查看</a>
							<a href="javascript:;" :id="scope.row.id" @click="handleEdit(scope.$index, scope.row)">修改</a>
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
					<span> > 接入信息管理</span>
				</router-link>
			</div>
			<div class="pay-cont">
				<div class="detail-item"><label>接入系统名称：</label><span>{{ detailInfo.name || '--' }}</span></div>
				<div class="bd-line"></div>
				<div class="detail-item"><label>系统ID：</label><span>{{ detailInfo.systemCode || '--' }}</span></div>
				<div class="detail-item"><label>系统密钥：</label><span>{{ detailInfo.accessKey || '--' }}</span></div>
				<div class="bd-line"></div>
				<div class="detail-item"><label>创建时间：</label><span>{{ detailInfo.createTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--'  }}</span></div>
				<div class="detail-item"><label>回调url：</label><span>{{ detailInfo.url || '--'  }}</span></div>
				<div>
					<a href="javascript:;" class="btn-back" @click="isBack">返回</a>
				</div>
			</div>
		</div>
		<!--新增-->
		<el-dialog title="新增接入系统" v-model="dialogCreateVisible" size="tiny">
			<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px">
				<el-form-item label="接入系统名称" prop="name">
					<el-input v-model="createForm.name"></el-input>
				</el-form-item>
				<el-form-item label="回调url" prop="url">
					<el-input v-model="createForm.url"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="createSys">保存</el-button>
					<el-button @click="resetForm('updateForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--修改-->
		<el-dialog title="修改接入系统" v-model="dialogUpdateVisible" size="tiny">
			<el-form :model="updateForm" :rules="updateRules" ref="updateForm" label-width="120px">
				<input type="hidden" v-model="updateForm.id" />
				<el-form-item label="接入系统名称" prop="name">
					<el-input v-model="updateForm.name"></el-input>
				</el-form-item>
				<el-form-item label="回调url" prop="url">
					<el-input v-model="updateForm.url"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="updateSys">保存</el-button>
					<el-button @click="dialogUpdateVisible=false">取消</el-button>
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
				detailInfo: {},
				show: false,
				showDetail: false,
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				isLoad: false,
				formInline: {
					name: null,
					startTime: null,
					endTime: null
				},
				tableData: [],
				table_index: 999,
				dialogCreateVisible: false,
				dialogUpdateVisible: false,
				createForm: {
					name: null,
					url: null
				},
				createRules: {
					name: [{
						required: true,
						message: '请输入接入系统名称',
						trigger: 'blur'
					}, {
						pattern: /^\s*[\s\S]{1,30}\s*$/,
						message: '接入系统名称必须在30个字符内'
					}],
					url: [{
							required: true,
							message: '请输入回调url',
							trigger: 'blur'
						},
						{
							pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
							message: '请输入正确的回调url'
						}
					]
				},
				updateForm: {
					id: null,
					name: null,
					url: null
				},
				updateRules: {
					name: [{
						required: true,
						message: '请输入接入系统名称',
						trigger: 'blur'
					}, {
						pattern: /^\s*[\s\S]{1,30}\s*$/,
						message: '接入系统名称必须在30个字符内'
					}],
					url: [{
							required: true,
							message: '请输入回调url',
							trigger: 'blur'
						},
						{
							pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
							message: '请输入正确的回调url'
						}
					]
				}
			};
		},
		created() {
			this.show = true;
			this.showDetail = false;
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
					url: common.apihost + 'accessSystem/list',
					data: {
						data: {
							pageWrapper: {
								page: pageNum,
								pagesize: pageSize,
							},
							name: this.formInline.name,
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
							this.tableData = null
						}
					}
				});
			},
			onSubmit() {
				this.getLoadData(this.currentPage, this.pagesize);
			},
			resetForm(formName) {
				this.dialogCreateVisible = false;
				if(this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
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
			handleSelect(e) {
				this.show = false;
				this.showDetail = true;
				var id = e.currentTarget.getAttribute("id");
				$http({
					url: common.apihost + 'accessSystem/init',
					data: {
						data: {
							id: id
						}
					},
					method: 'post'
				}).then((response) => {
					this.detailInfo = response.data;
				});
			},
			handleAdd(e) {
				this.dialogCreateVisible = true;
				if(this.$refs['createForm'] !== undefined) {
					this.$refs['createForm'].resetFields();
				}
			},
			createSys() {
				this.$refs.createForm.validate((valid) => {
					if(valid) {
						const url = common.apihost + 'accessSystem/add';
						$http({
							url: common.apihost + 'accessSystem/add',
							data: {
								data: {
									name: this.removeAllSpace(this.createForm.name),
									url: this.removeAllSpace(this.createForm.url)
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
								this.getLoadData(this.currentPage, this.pagesize);
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
			updateSys() {
				this.$refs.updateForm.validate((valid) => {
					if(valid) {
						$http({
							url: common.apihost + 'accessSystem/update',
							data: {
								data: {
									name: this.removeAllSpace(this.updateForm.name),
									url: this.removeAllSpace(this.updateForm.url),
									id: this.updateForm.id
								}
							},
							method: 'post'
						}).then((response) => {
							this.dialogUpdateVisible = false;
							if(response.data.code == 1) {
								this.$message({
									message: "修改成功！",
									type: 'success'
								});
								this.getLoadData(this.currentPage, this.pagesize);
							}
						});
					}
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
		.el-dialog__header {
			text-align: left !important;
		}
		.el-table th>.cell {
			text-align: center;
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