<template>
	<div class="conent" id="userInfo" v-cloak>
		<el-row class="header-top">
			<el-col :span="24">
				<div class="nav_top">
					<el-col :span="4" class="uinn-tb">
						<div class="text-l" style="margin-left: 40px;"><img title="logo" src="../../../assets/img/aipay-logo.png" /></div>
					</el-col>
					<el-col :span="20" class="uinn-15">
						<el-col :span="2" class="color-blue right font-xs">
							<a href="javascript:;" class="logout" @click="logout">退出</a>
						</el-col>
						<el-col :span="4" class="color-blue right font-xs"><i class="icon-user"></i><span class="nick">{{name}}</span></el-col>
					</el-col>
				</div>
			</el-col>
		</el-row>
		<el-row class="main">
			<el-col :span="4" class="side_left">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect" unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<div v-if="index===1" class="el-submenu">
							<div slot="title" class="el-submenu__title" @click="toIndex"><i :class="item.iconCls"></i>{{item.name}}</div>
						</div>
						<div v-if="index>1">
							<el-submenu :index="index+''" v-if="!item.leaf">
								<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
								<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
							</el-submenu>
							<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
						</div>
					</template>
				</el-menu>
			</el-col>
			<el-col :span="20" class="side_right">
				<section class="content-container clear">
					<div class="grid-content bg-purple-light">
						<el-col :span="24" class="content-wrapper">
							<transition name="fade" mode="out-in">
								<router-view :key="key"></router-view>
							</transition>
						</el-col>
					</div>
				</section>
				<div style="height: 100px;"></div>
			</el-col>
		</el-row>
		<!-- <Loading v-if="isLoad"></Loading> -->
	</div>
</template>
<script>
	import {bus} from '../../../assets/js/bus.js'
	import Loading from './loading.vue'
	export default {
		name: 'userInfo',
		data() {
			return {
				isLoad: false,
				//name:localStorage.getItem('username')
				name:localStorage.getItem('user')
			}
		},
		computed: {
		    key() {
		        return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
		    }
		},
		mounted() {
			bus.$on('loginSuc', (text) => {
				this.name=text;
				//localStorage.setItem('username',text);
				localStorage.setItem('user',text);
			});
		},
		methods: {
			toIndex() {
				this.$router.push('/index');
			},
			handleopen() {
			},
			handleclose() {
			},
			handleselect: function(a, b) {},
			//注销
			logout() {
				//删除session并跳到登录页
				this.isLoad = true;
				localStorage.removeItem('user');
				setTimeout(() => {
					this.$router.push('/');
				}, 500);
			}
		},
		components: {
			Loading
		}
	}
</script>
<style type="text/css" lang="scss">
	@import '../../../assets/css/common.scss';
	
	.conent {
		.header-top {
			position: absolute;
			z-index: 9;
			width: 100%;
		}
		.nav_top {
			height: 90px;
			.icon-user {
				display: inline-block;
				width: 32px;
				height: 32px;
				margin-right: 10px;
				vertical-align: middle;
				background: url(../../../assets/img/icon-sprite.png) -22px -128px no-repeat;
			}
			.logout {
				width: 65px;
				height: 32px;
				display: inline-block;
				line-height: 30px;
				text-align: center;
				font-size: 14px;
				border: 1px solid #cbccce;
				border-radius: 3px;
				-webkit-border-radius: 3px;
				-moz-border-radius: 3px;
			}
		}
		.main {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			overflow: hidden;
			.side_left {
				position: absolute;
				left: 0;
				top: 90px;
				z-index: 9;
				width: 220px;
				height: 100%;
				border: 1px solid #cbccce;
				.el-submenu__title {
					height: 52px !important;
					text-align: left;
					line-height: 52px !important;
					border-bottom: 1px solid #ddd;
				}
				.el-menu {
					height: 100%;
					background-color: #eaedf2 !important;
					;
				}
				.el-menu li {
					border-bottom: 1px solid #ddd !important;
				}
				.el-menu li:last-child {
					border-bottom: none !important;
				}
				.icon-home {
					display: inline-block;
					width: 20px;
					height: 20px;
					margin-right: 10px;
					vertical-align: middle;
					background: url(../../../assets/img/icon-sprite.png) -30px -81px no-repeat;
				}
				.icon-merchant {
					display: inline-block;
					width: 20px;
					height: 20px;
					margin-right: 10px;
					vertical-align: middle;
					background: url(../../../assets/img/icon-sprite.png) -28px -174px no-repeat;
				}
				.icon-channel {
					display: inline-block;
					width: 20px;
					height: 20px;
					margin-right: 10px;
					vertical-align: middle;
					background: url(../../../assets/img/icon-sprite.png) -159px -173px no-repeat;
				}
				.icon-sys {
					display: inline-block;
					width: 20px;
					height: 20px;
					margin-right: 10px;
					vertical-align: middle;
					background: url(../../../assets/img/icon-sprite.png) -64px -175px no-repeat;
				}
				.icon-order {
					display: inline-block;
					width: 20px;
					height: 22px;
					margin-right: 10px;
					vertical-align: middle;
					background: url(../../../assets/img/icon-sprite.png) -61px -79px no-repeat;
				}
				.icon-zijin {
					display: inline-block;
					width: 21px;
					height: 23px;
					margin-right: 10px;
					vertical-align: middle;
					background: url(../../../assets/img/icon-sprite.png) -94px -80px no-repeat;
				}
				.icon-set {
					display: inline-block;
					width: 20px;
					height: 20px;
					margin-right: 10px;
					vertical-align: middle;
					background: url(../../../assets/img/icon-sprite.png) -129px -82px no-repeat;
				}
			}
			.side_right {
				width: 100%;
				height: 100%;
				position: absolute;
				right: 0px;
				top: 90px;
				padding-left: 220px;
				overflow-x: hidden;
				overflow-y: auto;
				border: 1px solid #cbccce;
				border-left: none;
			}
		}
	}
</style>