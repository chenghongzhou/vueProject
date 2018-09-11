<template>
	<section class="system-channel" v-cloak>
		<div v-if="show">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/index">
					<span>首页</span>
				</router-link>
				<router-link class="tab-item font-ms" to="">
					<span> > 支付渠道管理</span>
				</router-link>
			</div>
			<el-col :span="24" class="uinn-20">
				<!--表单-->
				<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline text-l">
					<el-form-item label="商户名称" prop="name">
						<el-input class="input" v-model="formInline.name"></el-input>
					</el-form-item>
					<el-form-item label="接入支付渠道" prop="channelName">
						<!-- <el-select class="inputs" v-model="formInline.channelId" placeholder="请选择">
							<el-option label="全部选项" value=""></el-option>
							<el-option v-for="item in channel" :label="item.name" :value="item.code">
							</el-option>
						</el-select> -->
						<el-input class="input" v-model="formInline.channelName"></el-input>
					</el-form-item>
					<el-form-item class="times" label="时间" prop="startTime">
						<el-date-picker format="yyyy-MM-dd" @change="getStartTime" type="datetime" v-model="formInline.startTime" align="right">
						</el-date-picker>
						-
					</el-form-item>
					<el-form-item class="times" prop="endTime" style="margin-left:-10px;">
						<el-date-picker format="yyyy-MM-dd" @change="getEndTime" type="datetime" v-model="formInline.endTime" align="right">
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
					 <el-button type="primary" @click="resetForm('formInline')">重置</el-button> 
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form>
				<!--表格-->
				<el-collapse  v-model="activeName" @change="handleChange" accordion style="border:none;">
					<el-collapse-item v-for="(item,index) in tableData" :name="index">
						 <template slot="title">
					      <span class="clear" style="display:inline-block;width:100%;padding-right:80px;">
					      	<span class="left">
					      	    <span>{{index+1}}、</span><span>{{item.merchantName}}</span>
	                         </span>
	                         <span>
	                         	{{item.merchantId}}
	                         </span>
					      </span>
					    </template>
					   <!--  <div style="padding:0 30px;"> -->
						<el-table :data="item.channeList" border>
						    <el-table-column label="序号" :width="columnWidth">
								<template scope="scope">
									{{ scope.$index+1 }}-1
								</template>
							</el-table-column>
							<el-table-column prop="channel.name" label="接入支付渠道">
							</el-table-column>
							<el-table-column prop="merchantNo" label="商户号">
								<template scope="scope">
									{{scope.row.merchantNo || '--'}}
								</template>
							</el-table-column>
							<el-table-column prop="upperBound" label="交易限额">
								<template scope="scope">
									{{'￥'+Number(scope.row.upperBound).toFixed(2) || '--'}}
								</template>
							</el-table-column>
							<el-table-column prop="createTime" :formatter="dateFormat" label="添加时间">
								<template scope="scope">
									{{scope.row.createTime | dateFmt('YYYY-MM-DD HH:mm:ss') || '--' }}
								</template>
							</el-table-column>
							<el-table-column prop="status" label="状态" :width="statusWidth">
								<template scope="scope">
									<div class="status_suc_bgcolor" v-if="scope.row.status==2">
										启用
									</div>
									<div class="status_fail_bgcolor" v-else>
										禁用
									</div>
								</template>
							</el-table-column>
							<el-table-column label="操作" :width="operateWidth">
								<template scope="scope">
									<a href="javascript:;" class="umars-r" :id="scope.row.id" @click="handleSelect">查看</a>
									<a href="javascript:;" class="umars-r" :id="scope.row.id" @click="handleEdit">修改</a>
									<a href="javascript:;" v-if="scope.row.status==2" class="umars-r" :id="scope.row.id" :status="scope.row.status" @click="handleDisabled">锁定</a>
									<a href="javascript:;" v-else class="umars-r" :id="scope.row.id" :status="scope.row.status" @click="handleUsed">启用</a>
									<!-- <a href="javascript:;" class="umars-r" :id="scope.row.id">删除</a> -->
								</template>
							</el-table-column>
						</el-table>
						<!-- </div> -->
					</el-collapse-item>
                </el-collapse>
                <div class="nullTips" v-if="nullData">暂无数据</div>
				<!-- <div class="block">
					<el-pagination @size-change="handlepageChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
					</el-pagination>
				</div> -->
			</el-col>
			<Loading v-if="isLoad"></Loading>
		</div>

		<div class="channelDetail text-l" id="channelDetail" v-if="showDetail">
			<div class="brand-wrap text-l bd-cdced2 uinn-15 bg-color-eaedf2">
				<span class="font-md">当前位置：</span>
				<router-link class="tab-item font-ms" to="/home">
					<span>首页</span>
				</router-link>
				<router-link class="tab-item font-ms" to="">
					<span> > 支付渠道管理</span>
				</router-link>
			</div>
			<div class="channel-cont">
				<div class="detail-item"><label class="item-label">商户ID：</label><span>{{ detailInfo.merchantId || '--' }}</span></div>
				<div class="detail-item"><label class="item-label">商户名称：</label><span>{{ detailInfo.clientMerchant.merchantName||'--' }}</span></div>
				<!-- <div class="bd-line"></div> -->
				<div class="detail-item"><label class="item-label">第三方渠道：</label>
					<span>
				 		{{detailInfo.channel.name||'--'}}
					</span>
				</div>
				<div class="detail-item"><label class="item-label">商户号：</label>
					<span>
				 		{{detailInfo.merchantNo}}
					</span>
				</div>
				<div class="detail-item"><label class="item-label">授权秘钥：</label><span>{{ detailInfo.secretKey || '--' }}</span></div>
				<div class="detail-item"><label class="item-label">授权秘钥附件：</label><span>{{ detailInfo.secretKeyPath || '--' }}</span></div>
				<!-- 	<div class="detail-item"><label class="item-label">授权证书：</label><span>{{ detailInfo.certificatePath || '--' }}</span></div> -->
				<div class="detail-item"><label class="item-label">授权公钥：</label><span>{{ detailInfo.publicKey || '--' }}</span></div>
				<div class="detail-item"><label class="item-label">授权公钥附件：</label><span>{{ detailInfo.keyPath || '--' }}</span></div>
				<div class="detail-item"><label class="item-label">交易限额：</label><span>{{ '￥'+Number(detailInfo.upperBound).toFixed(2) || '0.00' }}</span></div>
				<div class="detail-item"><label class="item-label">合作商户：</label><span>{{ detailInfo.ext1 || '--' }}</span></div>
				<div>
					<a href="javascript:;" class="btn-back" @click="isBack">返回</a>
				</div>
			</div>
		</div>
		<!--新增-->
		<el-dialog title="新增支付渠道" v-model="dialogCreateVisible" size="tiny">
			<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="100px">
				<el-form-item label="商户名称" prop="merchantName" style="position:relative;">
					<el-select class="selects" v-model="createForm.merchantName" placeholder="请选择商户名称">
						<el-option v-for="value in merchantList" :label="value.merchantName" :value="value.merchantId">
						</el-option>
					</el-select>
					<span class="addImg" @click="handleAddName"><img src="../../../assets/img/add-icon.png" alt="添加"></span>
				</el-form-item>
				<el-form-item label="第三方渠道" prop="sysName">
					<el-select class="selects1" v-model="createForm.sysName" placeholder="请选择第三方渠道">
						<el-option v-for="value in systemList" :label="value.name" :value="String(value.id)">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商户号" prop="desc4">
					<el-input placeholder="请输入商户号" :maxlength="40" v-model="createForm.desc4"></el-input>
				</el-form-item>
				<el-form-item label="授权秘钥" prop="desc">
					<el-input placeholder="请输入支付渠道秘钥或上传授权密钥文件" v-model="createForm.desc" :maxlength="5000"></el-input>
				</el-form-item>
				<div class="upload clear">
					<div class="left label">附&nbsp;件</div>
					<a href="javascript:;" class="uploader left">
						<input type="file" class="input-file" ref="input-files" @change="uploadImg"> 点击上传
					</a>
					<div class="left desc">{{secretFile}}</div>
					<input type="hidden" v-model="secretUrl" />
				</div>
				<!-- <el-form-item label="授权证书" prop="desc2">
					<el-input placeholder="请输入授权证书" v-model="createForm.desc2"></el-input>
				</el-form-item> -->
				<el-form-item label="授权公钥" prop="desc3">
					<el-input placeholder="请输入授权公钥或上传公钥文件" :maxlength="5000" v-model="createForm.desc3"></el-input>
				</el-form-item>
				<div class="upload clear">
					<div class="left label">附&nbsp;件</div>
					<a href="javascript:;" class="uploader left">
						<input type="file" class="input-file" ref="input-files1" @change="uploadImg1"> 点击上传
					</a>
					<div class="left desc">{{publicFile}}</div>
					<input type="hidden" v-model="publicUrl" />
				</div>
				<el-form-item label="合作商户" prop="desc5">
					<el-input placeholder="请输入合作商户" :maxlength="40" v-model="createForm.desc5"></el-input>
				</el-form-item>
				<!-- <el-form-item label="支持终端" prop="resource">
					<el-checkbox-group v-model="createForm.resource">
						<el-checkbox label="支付宝" name="resource"></el-checkbox>
						<el-checkbox label="微信" name="resource"></el-checkbox>
						<el-checkbox label="杉德" name="resource"></el-checkbox>
						<el-checkbox label="浦发银行" name="resource"></el-checkbox>
					</el-checkbox-group>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="createSys">保存</el-button>
					<el-button @click="resetForm('createForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--修改-->
		<el-dialog title="修改支付渠道" v-model="dialogUpdateVisible" size="tiny">
			<el-form :model="updateForm" :rules="updateRules" ref="updateForm" label-width="100px">
				<input type="hidden" v-model="updateForm.id" />
				<el-form-item label="商户名称" prop="merchantId" style="position:relative;">
					<el-select class="selects" v-model="updateForm.merchantId" placeholder="请选择" :disabled="true">
						<el-option v-for="value in merchantList" :label="value.merchantName" :value="value.merchantId">
						</el-option>
					</el-select>
					<span class="addImg" @click="handleAddName"><img src="../../../assets/img/add-icon.png" alt="添加"></span>
				</el-form-item>
				<el-form-item label="第三方渠道" prop="channelId">
					<el-select class="selects1" v-model="updateForm.channelId" placeholder="请选择" :disabled="true">
						<el-option v-for="value in systemList" :label="value.name" :value="value.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商户号" prop="merchantNo">
					<el-input placeholder="请输入商户号" :maxlength="40" v-model="updateForm.merchantNo"></el-input>
				</el-form-item>
				<el-form-item label="授权秘钥" prop="secretKey">
					<el-input placeholder="请输入支付渠道秘钥" :maxlength="5000" v-model="updateForm.secretKey"></el-input>
				</el-form-item>
				<div class="upload clear">
					<div class="left label">附&nbsp;件</div>
					<a href="javascript:;" class="uploader left">
						<input type="file" class="input-file" ref="input-files" @change="uploadImg"> 点击上传
					</a>
					<div class="desc left">{{secretFile}}</div>
					<input type="hidden" v-model="secretUrl" />
				</div>
				<!-- <el-form-item label="授权证书" prop="certificatePath">
					<el-input placeholder="请输入授权证书" v-model="updateForm.certificatePath"></el-input>
				</el-form-item> -->
				<el-form-item label="授权公钥" prop="publicKey">
					<el-input placeholder="请输入授权公钥" :maxlength="5000" v-model="updateForm.publicKey"></el-input>
				</el-form-item>
				<div class="upload clear">
					<div class="left label">附&nbsp;件</div>
					<a href="javascript:;" class="uploader left">
						<input type="file" class="input-file" ref="input-files1" @change="uploadImg1"> 点击上传
					</a>
					<div class="left desc">{{publicFile}}</div>
					<input type="hidden" v-model="publicUrl" />
				</div>
				<el-form-item label="合作商户" prop="ext1">
					<el-input placeholder="请输入合作商户" :maxlength="40" v-model="updateForm.ext1"></el-input>
				</el-form-item>
				<!-- <el-form-item label="支持终端" prop="resource">
					<el-checkbox-group v-model="createForm.resource">
						<el-checkbox label="支付宝" name="resource"></el-checkbox>
						<el-checkbox label="微信" name="resource"></el-checkbox>
						<el-checkbox label="杉德" name="resource"></el-checkbox>
						<el-checkbox label="浦发银行" name="resource"></el-checkbox>
					</el-checkbox-group>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="updateSys">保存</el-button>
					<el-button @click="dialogUpdateVisible=false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--新增-->
		<el-dialog title="新增商户名称" v-model="dialogCreateName" size="tiny">
			<el-form :model="createNameForm" :rules="nameRules" ref="createNameForm" label-width="100px">
				<el-form-item label="商户名称" prop="name">
					<el-input placeholder="请填写商户名称" :maxlength="40" v-model="createNameForm.name"></el-input>
				</el-form-item>
				
				<el-form-item>
					<el-button type="primary" @click="createName">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</section>
</template>
<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import moment from 'moment';
	import axios from 'axios'
	import Loading from '../login/loading.vue'
	import $http from '../../../assets/js/http.js'
	export default {
		data() {
			var validateLen = (rule, value, callback) => {
				if(value.length >= 5000) {
					callback(new Error('输入字符长度不能超过5000'))
				} else {
					callback();
				}
			}
			return {
				columnWidth: '90',
				statusWidth: '90',
				operateWidth: '210',
				detailInfo: {
					clientMerchant: {},
					channel: {}

				},
				//默认展开第一条数据
				activeName: 0,
				nullData:false,
				show: false,
				showDetail: false,
				totalCount: 0,
				pagesize: 10,
				currentPage: 1,
				isLoad: false,
				secretFile: null,
				secretUrl: null,
				publicFile: null,
				publicUrl: null,
				upperBound: null,
				formInline: {
					name: null,
					channelName:null,
					startTime: null,
					endTime: null
				},
				channel:[],
				tableData: [],
				table_index: 999,
				dialogCreateName:false,
				dialogCreateVisible: false,
				dialogUpdateVisible: false,
				systemList: [],
				merchantList: [],
				createForm: {
					sysName: null,
					merchantName: null,
					resource: [],
					desc: null,
					desc2: null,
					desc3: null,
					desc4: null,
					desc5: null,
					files1: null

				},
				createRules: {
					sysName: [{
						required: true,
						message: '请选择第三方渠道',
						trigger: 'change'
					}],
					merchantName: [{
						required: true,
						message: '请选择商户名称',
						trigger: 'change'
					}],
					desc4: [{
							required: true,
							message: '请输入商户号',
							trigger: 'blur'
						},
						{
							pattern: /^[0-9a-zA-Z]*$/,
							message: '请输入字母或数字'
						}
					],
					//授权密钥
					desc: [{
							//required: true,
							pattern:  /^[0-9a-zA-Z]*$/,
							message: '请输入字母或数字'
						},
						/*{
							validator: validateLen,
							trigger: 'blur'
						}*/
					],
					//授权证书
					/*desc2:[
                       {pattern:/[^\u4e00-\u9fa5]/,message:'请输入字母或数字'},
                       {validator:validateLen,trigger: 'blur'}
					],*/
					//授权公钥
					desc3: [{
							//required: true,
							pattern:  /^[0-9a-zA-Z]*$/,
							message: '请输入字母或数字'
						}/*,
						{
							validator: validateLen,
							trigger: 'blur'
						}*/
					]

				},
				updateForm: {
					id: '',
					channelId: '',
					merchantID: '',
					merchantNo: '',
					secretKey: '',
					certificatePath: '',
					publicKey: '',
					ext1: ''
				},
				updateRules: {
					sysName: [{
						required: true,
						message: '请选择商户名称',
						trigger: 'change'
					}],
					merchantName: [{
						required: true,
						message: '请选择第三方渠道',
						trigger: 'change'
					}],
					merchantNo: [{
							required: true,
							message: '请输入商户号',
							trigger: 'blur'
						},
						{
							pattern: /^[0-9a-zA-Z]*$/,
							message: '请输入字母或数字'
						}
					],
					secretKey: [{
							//required: true,
							pattern:  /^[0-9a-zA-Z]*$/,
							message: '请输入字母或数字'
						},
						/*{
							validator: validateLen,
							trigger: 'blur'
						}*/
					],
					//授权证书
					/*certificatePath:[
                       {pattern:/[^\u4e00-\u9fa5]/,message:'请输入字母或数字'},
                       {validator:validateLen,trigger: 'blur'}
					],*/
					publicKey: [{
							//required: true,
							pattern:  /^[0-9a-zA-Z]*$/,
							message: '请输入字母或数字'
						},
						/*{
							validator: validateLen,
							trigger: 'blur'
						}*/
					]
				},
				createNameForm:{
                    name:''
				},
				nameRules:{
                   name: [{
						    required: true,
							pattern: /^\s*[\s\S]{1,30}\s*$/,
							message: '商户名称必须在30个字符内'
						}
					]
				}
			};
		},
		created() {
			this.show = true;
			this.showDetail = false;
			this.getChannelName();
			this.getMerchantName();

		},
		mounted() {
			this.getLoadData(this.currentPage,this.activeName,this.pagesize);
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
			handleChange(val){
				this.activeName = val;
				sessionStorage.setItem('active',val);
			},
			getLoadData(pageNum, active,pageSize) {
				let actives = Number(active);
				this.isLoad = true;
				$http({
					url: common.apihost + '/signingInfo/list',
					data: {
						data: {
							//page: pageNum,
							//pagesize: pageSize,
							merchantName: this.formInline.name,
							channelName:this.formInline.channelName,
							startTime: this.formInline.startTime,
							endTime: this.formInline.endTime
						}
					},
					method: 'post'
				}).then((response) => {
					this.isLoad = false;
					if(response.status == 200) {
						if(response.data.length > 0){
	                        this.tableData = response.data;
	                        this.nullData = false;
	                        this.activeName = actives;
						}else if(response.data.length == 0){
							this.tableData = null;
							this.nullData = true;
						}
					}
				});
			},
			//第三方支付渠道集合
			getChannelName() {
				$http({
					url: common.apihost + '/signingInfo/getChannelList',
					method: 'post'
				}).then((response) => {
					this.systemList = response.data;
				});
			},
			//商户名称集合
			getMerchantName() {
				$http({
					url: common.apihost + '/signingInfo/getMerchantList',
					method: 'post',
                    data:{
                    	data:{
                    		merchantName:''
                    	}
                    }
				}).then((response) => {
					this.merchantList = response.data;
				});
			},
			onSubmit() {
				this.getLoadData(this.currentPage, this.pagesize);
			},
			//二次添加时清空表单数据
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
			handleSelect(e) {
				this.show = false;
				this.showDetail = true;
				var id = e.currentTarget.getAttribute("id");
				$http({
					url: common.apihost + '/signingInfo/initDetail',
					data: {
						data: {
							id: id,
						}
					},
					method: 'post'
				}).then((response) => {
					this.detailInfo = response.data;
					this.detailInfo.clientMerchant = response.data.clientMerchant;
					this.detailInfo.channel = response.data.channel;
				});
			},
			handleAdd() {
				this.dialogCreateVisible = true;
				this.secretFile = "未上传";
				this.publicFile = "未上传";
				if(this.$refs['createForm'] !== undefined) {
					this.$refs['createForm'].resetFields();
				}
			},
			createSys() {
				this.$refs.createForm.validate((valid) => {
					if(valid) {
						$http({
							url: common.apihost + 'signingInfo/add',
							data: {
								data: {
									merchantId: this.createForm.merchantName,
									channelId: this.createForm.sysName,
									merchantNo: this.createForm.desc4,
									secretKey: this.createForm.desc,
									secretKeyPath: this.secretUrl,
									publicKey: this.createForm.desc3,
									keyPath: this.publicUrl,
									ext1: this.createForm.desc5
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
								let active = sessionStorage.getItem('active')
								this.getLoadData(this.currentPage, active,this.pagesize);
								this.$refs['createForm'].resetFields();
							}
						});
					}
				});
			},
			handleAddName(){
                this.dialogCreateName = true;
                if(this.$refs['createNameForm'] !== undefined) {
					this.$refs['createNameForm'].resetFields();
				}
			},
			//新增商户名称
			createName(){
                this.$refs.createNameForm.validate((valid) => {
					if(valid) {
						$http({
							url: common.apihost + '/signingInfo/getMerchantList',
							data: {
								data: {
									merchantName: this.removeAllSpace(this.createNameForm.name)
								}
							},
							method: 'post'
						}).then((response) => {
								this.$message({
									message: "添加成功！",
									type: 'success'
								});
								this.merchantList = response.data;
								let datas = response.data;
								this.createForm.merchantName = datas[datas.length-1].merchantId;
								this.dialogCreateName = false;
						});
					}
				});
			},
			handleEdit(e) {
				var id = e.currentTarget.getAttribute("id");
				$http({
					url: common.apihost + 'signingInfo/updateInfo',
					data: {
						data: {
							id: id,
						}
					},
					method: 'post'
				}).then((response) => {
					this.dialogUpdateVisible = true;
					this.updateForm = response.data;
					let secretPath = response.data.secretKeyPath;
					if(!!secretPath) {
						this.secretFile = '已上传'
					} else {
						this.secretFile = "未上传";
					}
					let publicPath = response.data.keyPath;
					if(!!publicPath) {
						this.publicFile = '已上传'
					} else {
						this.publicFile = "未上传";
					}

				});
			},
			handleUsed(e) {
				var self = this;
				var id = e.currentTarget.getAttribute("id");
				var status = e.currentTarget.getAttribute("status");
				$http({
					url: common.apihost + 'signingInfo/openSigningInfo',
					data: {
						data: {
							id: id,
						}
					},
					method: 'post'
				}).then((response) => {
					if(response.data.code == 1) {
						self.$message({
							message: "开启成功！",
							type: 'success'
						});
						let active = sessionStorage.getItem('active')
						self.getLoadData(this.currentPage, active,this.pagesize)
					}
				});
			},
			handleDisabled(e) {
				var id = e.currentTarget.getAttribute("id");
				var self = this;
				const url = common.apihost + 'signingInfo/closeSigningInfo';
				$http({
					url: common.apihost + 'signingInfo/closeSigningInfo',
					data: {
						data: {
							id: id,
						}
					},
					method: 'post'
				}).then((response) => {
					if(response.data.code == 1) {
						self.$message({
							message: "关闭成功！",
							type: 'success'
						});
						let active = sessionStorage.getItem('active')
						self.getLoadData(this.currentPage, active,this.pagesize)
					}
				});
			},
			updateSys() {
				this.$refs.updateForm.validate((valid) => {
					if(valid) {
						$http({
							url: common.apihost + 'signingInfo/update',
							data: {
								data: {
									id: this.updateForm.id,
									merchantId: this.updateForm.merchantId,
									channelId: this.updateForm.channelId,
									merchantNo: this.updateForm.merchantNo,
									secretKey: this.updateForm.secretKey,
									secretKeyPath: this.secretUrl,
									publicKey: this.updateForm.publicKey,
									keyPath: this.publicUrl,
									ext1: this.updateForm.ext1
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
								let active = sessionStorage.getItem('active');
								this.getLoadData(this.currentPage, active,this.pagesize);
							}
						});
					}
				});
			},
			isBack: function() {
				this.show = true;
				this.showDetail = false;
				this.$router.go(1);
			},
			uploadImg(e) {
				let file = e.target.files[0];
				let fileSize = file.size;
				let fileName = file.name;
				if(fileName.match(/.jpg|.jpeg|.png|.bmp/i)) {
					this.$message({
						message: "仅允许上传文档格式",
						type: 'error'
					});
					return;
				}
				if(file) {
					var data = new FormData();
					data.append('file', file);
					const url = common.apihost + 'signingInfo/uploadFile';
					if(fileSize < 1024 * 1024 * 3) {
						axios.post(url, data, {
							headers: {
								"Content-Type": "multipart/form-data "
							},
						}).then((response) => {
							if(response.data.code == 1) {
								this.secretUrl = response.data;
								this.secretFile = '上传成功';
							}else {
								this.secretFile = '上传失败';
							}
						}).then((error) => this.error = error)
					} else {
						this.$alert('附件必须不能大于3M', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			},
			uploadImg1(e) {
				let file = e.target.files[0];
				let fileSize = file.size;
				let fileName = file.name;
				if(fileName.match(/.jpg|.jpeg|.png|.bmp/i)) {
					this.$alert('附件必须不能是图片格式', '提示信息', {
						confirmButtonText: '确定'
					});
					return;
				}
				if(file) {
					var data = new FormData();
					data.append('file', file);
					const url = common.apihost + 'signingInfo/uploadFile';
					if(fileSize < 1024 * 1024 * 3) {
						axios.post(url, data, {
							headers: {
								"Content-Type": "multipart/form-data "
							},
						}).then((response) => {
							if(response.data.code == 1) {
								this.publicUrl = response.data;
								this.publicFile = '上传成功';
							}else{
								this.publicFile = '上传失败';
							}
						}).then((error) => this.error = error)
					} else {
						this.$alert('附件必须不能大于3M', '提示信息', {
							confirmButtonText: '确定'
						});
					}
				}
			}
		},
		components: {
			Loading
		}
	};
</script>
<style type="text/css" lang="scss">
	
	.system-channel {
		.upload {
			width: 100%;
			text-align: left;
			height: 36px;
			margin-bottom: 20px;
			position:relative;
			.label {
				padding-right: 20px;
				height: 36px;
				line-height: 36px;
				/* width: 120px; */
				width: 100px;
				color: #333;
				text-align: right;
			}
			.desc {
				max-width: 150px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				position: absolute;
			    left: 190px;
			    top: 8px;
			}
		}
		.uploader {
			width: 80px;
			height: 36px;
			line-height: 36px;
			display: inline-block;
			position: relative;
			color: #fff;
			background: #20a0ff;
			text-align: center;
			border-radius: 4px;
			overflow: hidden;
			*zoom: 1;
			.input-file {
				position: absolute;
				right: 0;
				top: 0;
				width: 80px;
                height: 36px;
				opacity: 0;
				filter: alpha(opacity=0);
				cursor: pointer
			}
		}
		.el-collapse-item__header{
			 position:relative; 
			text-align:right;
			font-size:15px;
			color:#666;
			.el-icon-arrow-right{
				 position:absolute;
				right:5px; 
				top:15px;
			}
		}
		.el-table td, .el-table th {
			height: 34px;
		}
		.el-collapse-item__content{
			padding:15px 30px;
			background: #f3f3f3;
		}
		.el-table th {
			background-color: #fff;
		}
		.nullTips{
			height:100px;
			line-height:100px;
		}
		.input {
			width: 200px !important;
		}
		.times {
			.el-input {
				display: inline-block;
				width: 200px;
			}
		}
		.addImg{
           position:absolute;
           right:0px;
           top:5px;
		}
		.el-table__header-wrapper thead div {
			background-color: #fff;
		}
		.system-channel .el-table th > .cell {
			color: #333;
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
		.el-form-item__content {
			text-align: left;
		}
		.el-textarea {
			display: inline-block;
			width: 300px;
		}
		 .selects{
		 	width:100%;
		}
		.selects1{
			width:100%;
		} 
		 .el-input {
			display: inline-block;
			 width:90%;
			 min-width:200px; 
		} 
		.channelDetail {
			font-size: 14px;
			.detail-item {
				padding: 5px 0;
				position: relative;
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
				position: absolute;
				top: 50%;
				margin-top: -10px;
			}
			.detail-item span {
				width: 600px;
				display: inline-block;
				overflow: hidden;
				word-break: break-all;
				margin-left: 170px;
			}
			.channel-cont {
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