<template>
	<section class="merchant-info" v-cloak>
		<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
			<span class="font-md">当前位置：</span>
			<router-link class="tab-item font-ms" to="/index">
				<span>首页</span>
			</router-link>
			<a class="tab-item font-ms">
				<span> > 商户管理</span>
			</a>
			<a class="tab-item font-ms">
				<span> > 商户信息管理</span>
			</a>
		</div>
		<el-col :span="24" class="uinn-20">
			<!--表单-->
			<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline text-l">
				<el-form-item label="商户名称" prop="merchantName">
					<el-input class="input" v-model="formInline.merchantName"></el-input>
				</el-form-item>
				<!-- <el-form-item label="时间" prop="startTime">
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
				<el-table-column prop="merchantId" label="商户ID">
					<template scope="scope">
						{{scope.row.merchantId || '--'}}
					</template>
				</el-table-column>
				<el-table-column prop="merchantName" label="商户名称">
					<template scope="scope">
						{{scope.row.merchantName || '--'}}
					</template>
				</el-table-column>
				<el-table-column prop="createTime" :formatter="dateFormat" label="添加时间">
				</el-table-column>
				<el-table-column label="修改时间">
					<template scope="scope">
						{{ scope.row.updateTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<a href="javascript:;" class="umar-r" :id="scope.row.id" @click="handleEdit(scope.$index, scope.row)">修改</a>
						<!--<a href="javascript:;" :id="scope.row.id" @click="handleDelete">删除</a>-->
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination @size-change="handlepageChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
				</el-pagination>
			</div>
		</el-col>
		<Loading v-if="isLoad"></Loading>
		<!--新增-->
		<el-dialog title="新增商户" v-model="dialogCreateVisible" size="tiny">
			<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px">
				<el-form-item label="商户名称" prop="merchantName">
					<el-input v-model="createForm.merchantName"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="createSys">保存</el-button>
					<el-button @click="resetForm('createForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--修改-->
		<el-dialog title="修改商户" v-model="dialogUpdateVisible" size="tiny">
			<el-form :model="updateForm" :rules="updateRules" ref="updateForm" label-width="120px">
				<input type="hidden" v-model="updateForm.id" />
				<el-form-item label="商户名称" prop="merchantName">
					<el-input v-model="updateForm.merchantName"></el-input>
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
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				isLoad: false,
				formInline: {
					merchantName: null,
					startTime: null,
					endTime: null
				},
				tableData: [],
				table_index: 999,
				dialogCreateVisible: false,
				dialogUpdateVisible: false,
				createForm: {
					merchantName: null
				},
				createRules: {
					merchantName: [{
							required: true,
							message: '请输入商户名称',
							trigger: 'blur'
						},
						{
							pattern: /^\s*[\s\S]{1,30}\s*$/,
							message: '商户名称必须在30个字符内'
						}
					]
				},
				updateForm: {
					id: null,
					merchantName: null
				},
				updateRules: {
					merchantName: [{
							required: true,
							message: '请输入商户名称',
							trigger: 'blur'
						},
						{
							pattern: /^\s*[\s\S]{1,30}\s*$/,
							message: '商户名称必须在30个字符内'
						}
					]
				}
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
					url: common.apihost + 'merchant/list',
					data: {
						data: {
							pageWrapper: {
								page: pageNum,
								pagesize: pageSize,
							},
							merchantName: this.formInline.merchantName,
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
							this.tableData=null;
						}
					}
				});
			},
			onSubmit() {
				this.getLoadData(this.currentPage, this.pagesize);
			},
			resetForm(formName) {
				this.dialogCreateVisible = false;
				this.$refs[formName].resetFields();
			},
			handlepageChange(val) {
				this.pagesize = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getLoadData(this.currentPage, this.pagesize);
			},
			handleDelete(e) {
				var id = e.currentTarget.getAttribute("id");
				this.$confirm('确认要删除该记录？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					cancelButtonClass: 'cancel'
				}).then(() => {
					$http({
						url: common.apihost + 'merchant/delete',
						data: {
							data: {
								ids: id
							}
						},
						method: 'post'
					}).then((response) => {
						this.getLoadData(this.currentPage, this.pagesize);
					});
				}).catch(() => {
					return false;
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
						const url = common.apihost + 'merchant/add';
						$http({
							url: common.apihost + 'merchant/add',
							data: {
								data: {
									merchantName: this.removeAllSpace(this.createForm.merchantName)
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
							url: common.apihost + 'merchant/update',
							data: {
								data: {
									merchantName: this.removeAllSpace(this.updateForm.merchantName),
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
							} else if(response.data.code == 502 || response.data.code == 503) {
								this.$alert('请重新登录', '提示信息', {
									confirmButtonText: '确定'
								}).then(() => {
									localStorage.removeItem('user');
									this.$router.push('/');
								});
							} 
						});
					}
				});
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
	.merchant-info {
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
	}
</style>