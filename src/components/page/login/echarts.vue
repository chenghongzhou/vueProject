<template>
	<div class="chart-container">
		<el-row class="count" style="text-align: left;">
			<div id="baseData">
				<div class="data-list" style="margin-left:0;background-color:#6aafe3;">
					<span class="lefts">累计交易总金额</span>
					<span class="rights">￥{{baseInfo.totalAmount}}</span>
				</div>
				<div href="javascript:;" class="data-list" style="background-color:#58ce89;">
					<span class="lefts">成功交易总金额</span>
					<span class="rights">￥{{baseInfo.totalSuccessAmount}}</span>
				</div>
				<div class="data-list" style="background-color:#62d1e5;">
					<span class="lefts">累计交易总订单数量</span>
					<span class="rights">{{baseInfo.totalOrderNum}}</span>
				</div>
				<div class="data-list" style="background-color:#fe7d7b;">
					<span class="lefts">累计成功交易订单数量</span>
					<span class="rights">{{baseInfo.successOrderNum}}</span>
				</div>
				<div style="clear:both;"></div>
			</div>
		</el-row>
		<el-row>
			<el-col :span="24" class="chart chart_left">
				<div style="position: absolute;left: 5px;top: 30px;font-size: 14px;">交易总金额：<span>{{datas.totalAmount}}</span>（元）&nbsp;&nbsp;&nbsp;&nbsp;成功交易金额：<span>{{datas.totalSuccessAmount}}</span>（元）</div>
				<div id="payChart" style="height: 500px;"></div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="chart chart_left">
				<div style="position: absolute;left: 5px;top: 52px;font-size: 14px;">交易累计订单数量：<span>{{datas.totalOrderNum}}</span>（笔）&nbsp;&nbsp;&nbsp;&nbsp;成功交易订单数量：<span>{{datas.successOrderNum}}</span>（笔）</div>
				<div id="countChart" style="height: 500px;"></div>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	//导入common.js
	import common from '../../../assets/js/common.js'
	import echarts from 'echarts'
	import $http from '../../../assets/js/http.js'
	export default {
		data() {
			return {
				amountTotal: '0.00',
				successAmountTotal: '0.00',
				orderTotalNum: '0',
				successOrderNum: '0',
				baseInfo: {
					totalAmount: 0.00,
					totalSuccessAmount: 0.00,
					totalOrderNum: 0,
					successOrderNum: 0
				},
				datas: {
					totalAmount: '0.00',
					totalSuccessAmount: '0.00',
					totalOrderNum: '0',
					successOrderNum: '0'
				},
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getPayChartInit();
			});
		},
		watch: {
			'$route': 'getPayChartInit'
		},
		methods: {
			// 加载数据统计
			getPayChartInit() {
				//统计支付金额
				let payChartId = document.getElementById('payChart');
				if(!payChartId) {
					return false;
				}
				let payChart = echarts.init(payChartId);
				if(!payChart) {
					return false;
				}

				let countChartId = document.getElementById('countChart');
				if(!countChartId) {
					return false;
				}
				let countChart = echarts.init(countChartId);
				if(!countChart) {
					return false;
				}

				payChart.showLoading({
					text: "图表数据正在努力加载..."
				});
				countChart.showLoading({
					text: "图表数据正在努力加载..."
				});
				var option_pay = {
					title: {
						text: '当日支付金额',
						textStyle: {
							color: '#323232',
							fontSize: 16
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#ccc'
							}
						},
						//formatter: '时间:{b}时<br/>{a}:{c}元'
						formatter: '{a0}:{c0}元<br/>{a1}:{c1}元'
					},
					toolbox: {
						show: false,
						right: '100',
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							dataView: {
								readOnly: false,
								optionToContent: function(opt) {
									var axisData = opt.xAxis[0].data;
									var series = opt.series;
									var table = '<table style="width:500px;text-align:center"><tbody><tr>' +
										'<td>时间</td>' +
										'<td>' + series[0].name + '</td>'
										// + '<td>' + series[1].name + '</td>'
										+
										'</tr>';
									for(var i = 0, l = axisData.length; i < l; i++) {
										table += '<tr>' +
											'<td>' + axisData[i] + '</td>' +
											'<td>' + series[0].data[i] + '</td>'
											// + '<td>' + series[1].data[i] + '</td>'
											+
											'</tr>';
									}
									table += '</tbody></table>';
									return table;
								}
							},
							magicType: {
								type: ['line', 'bar']
							},
							restore: {},
							saveAsImage: {},
						}
					},
					legend: {
						selectedMode: false,
						right: '100',
						data: ['交易总金额', '成功交易金额']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						name: "单位/时",
						nameTextStyle: {
							color: '#333'
						},
						axisLabel: {
							textStyle: {
								color: '#333'
							},
							interval: 0, //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
							formatter: function(value, index) {
								var texts = "";
								if(index % 2 == 0) {
									texts = value;
								} else {
									texts = "";
								}
								return texts;
							}
						},
						axisLine: {
							lineStyle: {
								color: '#999',
								width: 1, //这里是为了突出显示加上的
							}
						},
						data: []
					},
					yAxis: {
						type: 'log',
						//type: 'value',
						name: '单位/元',
						//precision: 2,
						//boundaryGap: [0, 0.001],
						min: 0.001,
						splitNumber: 5,
						//splitNumber: 10,
						nameTextStyle: {
							color: '#333'
						},
						axisLabel: {
							textStyle: {
								color: '#333'
							},
							formatter: '{value}'
						},
						axisLine: {
							lineStyle: {
								color: '#ccc',
								width: 1, //这里是为了突出显示加上的
							}
						}
					},
					grid: {
						x: 1,
						top: 100,
						left: 20,
						containLabel: true
					},
					series: [{
							name: '交易总金额',
							type: 'line',
							symbolSize: [10, 10],
							itemStyle: {
								normal: {
									color: "#5793f3",
									borderColor: "#5793f3"
								}
							},
							lineStyle: {
								normal: {
									color: "#5793f3"
								}
							},
							data: []
						},
						{
							name: '成功交易金额',
							type: 'line',
							symbolSize: [10, 10],
							itemStyle: {
								normal: {
									color: "#d14a61",
									borderColor: "#d14a61"
								}
							},
							lineStyle: {
								normal: {
									color: "#d14a61"
								}
							},
							data: []
						}
					]
				};

				//统计订单量
				var option_count = {
					title: {
						text: '当日订单量',
						textStyle: {
							color: '#323232',
							fontSize: 16
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#ccc'
							}
						},
						//formatter: '时间:{b}时<br/>{a0}:{c0}笔<br/>{a1}:{c1}笔'
						formatter: '{a0}:{c0}笔<br/>{a1}:{c1}笔'
					},
					legend: {
						selectedMode: false,
						right: '100',
						data: ['交易总订单量', '交易成功订单量']
					},
					toolbox: {
						show: false,
						right: '100',
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							dataView: {
								readOnly: false,
								optionToContent: function(opt) {
									var axisData = opt.xAxis[0].data;
									var series = opt.series;
									var table = '<table style="width:500px;text-align:center"><tbody><tr>' +
										'<td>时间</td>' +
										'<td>' + series[0].name + '</td>'
										// + '<td>' + series[1].name + '</td>'
										+
										'</tr>';
									for(var i = 0, l = axisData.length; i < l; i++) {
										table += '<tr>' +
											'<td>' + axisData[i] + '</td>' +
											'<td>' + series[0].data[i] + '</td>'
											// + '<td>' + series[1].data[i] + '</td>'
											+
											'</tr>';
									}
									table += '</tbody></table>';
									return table;
								}

							},
							magicType: {
								type: ['line', 'bar']
							},
							restore: {},
							saveAsImage: {},
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						name: "单位/时",
						nameTextStyle: {
							color: '#333'
						},
						axisLabel: {
							textStyle: {
								color: '#333'
							},
							interval: 0, //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
							formatter: function(value, index) {
								var texts = "";
								if(index % 2 == 0) {
									texts = value;
								} else {
									texts = "";
								}
								return texts;
							}
						},
						axisLine: {
							lineStyle: {
								color: '#999',
								width: 1, //这里是为了突出显示加上的
							}
						},
						data: []
					},
					yAxis: {
						type: 'log',
						//type: 'value',
						splitNumber: 5,
						//splitNumber: 10,
						min: 0.1,
						name: '单位/笔',
						nameTextStyle: {
							color: '#333'
						},
						axisLabel: {
							textStyle: {
								color: '#333'
							},
							formatter: '{value}'
						},
						axisLine: {
							lineStyle: {
								color: '#ccc',
								width: 1, //这里是为了突出显示加上的
							}
						}
					},
					grid: {
						x: 1,
						top: 120,
						left: 20,
						containLabel: true
					},
					series: [{
						name: '交易总订单量',
						type: 'line',
						symbolSize: [10, 10],
						itemStyle: {
							normal: {
								color: "#5793f3",
								borderColor: "#5793f3"
							}
						},
						lineStyle: {
							normal: {
								color: "#5793f3"
							}
						},
						data: []
					}, {
						name: '交易成功订单量',
						type: 'line',
						symbolSize: [10, 10],
						itemStyle: {
							normal: {
								color: "#d14a61",
								borderColor: "#d14a61"
							}
						},
						lineStyle: {
							normal: {
								color: "#d14a61"
							}
						},
						data: []
					}]
				};
				$http({
					url: common.apihost + '/clientHomePage/getClientHomePageStatistics',
					method: 'post'
				}).then((response) => {
					if(!!response.data) {
						const data = response.data;
						this.baseInfo = data.ClientHomePage;
						this.baseInfo.totalAmount = Number(data.ClientHomePage.totalAmount).toFixed(2);
						this.baseInfo.totalSuccessAmount = Number(data.ClientHomePage.totalSuccessAmount).toFixed(2);
						this.datas = data.AmountAndOrderNum;
						this.datas.totalAmount = Number(data.AmountAndOrderNum.totalAmount).toFixed(2);
						this.datas.totalSuccessAmount = Number(data.AmountAndOrderNum.totalSuccessAmount).toFixed(2);
						let amountTotalArr = [0],
							amountSucTotalArr = [0],
							orderListTotalArr = [0],
							orderListSuccessArr = [0],
							tiemArr = [];
						for(var i = 0; i < 48; i++) {
							if(i == 47) {
								tiemArr.push(i / 2);
								tiemArr.push(24);
							} else {
								tiemArr.push(i / 2);
							}
						}

						//交易总额数据
						data.NowTotalAmount.forEach(function(item) {
							amountTotalArr.push(Number(item.amount).toFixed(2));
							amountTotalArr.push(0);
						});
						//交易成功数据
						data.NowTotalSuccessAmount.forEach(function(item) {
							amountSucTotalArr.push(Number(item.amount).toFixed(2));
							amountSucTotalArr.push(0);
						});
						//订单总量数据
						data.NowTotalOrderNum.forEach(function(item) {
							orderListTotalArr.push(Number(item.orderNum));
							orderListTotalArr.push(0);
						});
						//订单成功量数据
						data.NowsuccessOrderNum.forEach(function(item) {
							orderListSuccessArr.push(Number(item.orderNum));
							orderListSuccessArr.push(0);
						});
						option_pay.series[0].data = amountTotalArr;
						option_pay.xAxis.data = tiemArr;
						option_pay.series[1].data = amountSucTotalArr;
						payChart.setOption(option_pay);
						payChart.hideLoading();

						this.vvolumnTotal = Number(data.volumnTotal);
						this.vvolumnTotalSuccess = Number(data.volumnTotalSuccess);
						this.vvolumnSuccessClientTotal = Number(data.volumnSuccessClientTotal);
						this.vvolumnClientTotal = Number(data.volumnClientTotal);
						option_count.xAxis.data = tiemArr;
						option_count.series[0].data = orderListTotalArr;
						option_count.series[1].data = orderListSuccessArr;
						countChart.setOption(option_count);
						countChart.hideLoading();
					}
				});
			}
		}
	};
</script>
<style type="text/css" lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}
	
	.count {
		#baseData {
			width: 100%;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			.data-list {
				display: block;
				margin-left: 2%;
				margin-bottom: 25px;
				width: 23.5%;
				padding: 0 25px;
				overflow: hidden;
				color: #fff;
				font-size: 14px;
				text-decoration: none;
				-moz-box-sizing: border-box;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				float: left;
				.rights {
					display: block;
					margin-bottom: 15px;
					padding-top: 12px;
					font-size: 18px;
					text-align: center;
					color: #fff;
					border-top: 1px solid #fff;
				}
				.lefts {
					display: block;
					margin: 20px 0px 10px 0px;
					text-align: center;
					height: 14px;
					color: #fff;
					line-height: 14px;
				}
			}
		}
	}
	
	.title {
		color: #666;
		font-size: 18px;
	}
	
	.chart {
		background-color: white;
		border-radius: 4px;
	}
</style>