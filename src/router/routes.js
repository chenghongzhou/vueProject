const Login = r => require.ensure([], () => r(require('../components/page/login/login')), 'Login')
const Home = r => require.ensure([], () => r(require('../components/page/login/home')), 'Home')
const Index = r => require.ensure([], () => r(require('../components/page/login/index')), 'Index')
const forgotPwd = r => require.ensure([], () => r(require('../components/page/login/forgot-password')), 'forgotPwd')
const setPwd = r => require.ensure([], () => r(require('../components/page/login/set-password')), 'setPwd')
const register = r => require.ensure([], () => r(require('../components/page/login/register')), 'register')
const registerUpload = r => require.ensure([], () => r(require('../components/page/login/register-upload')), 'registerUpload')
const applysuc = r => require.ensure([], () => r(require('../components/page/login/apply-suc')), 'applysuc')
const applyFail = r => require.ensure([], () => r(require('../components/page/login/apply-fail')), 'applyFail')
const updatePwd = r => require.ensure([], () => r(require('../components/page/setting/update-password')), 'updatePwd')
const account = r => require.ensure([], () => r(require('../components/page/setting/account')), 'account')
const payInto = r => require.ensure([], () => r(require('../components/page/order/pay-into')), 'payInto')
const payOut = r => require.ensure([], () => r(require('../components/page/order/pay-out')), 'payOut')
//const refundOrder = r => require.ensure([], () => r(require('../components/page/order/refund-order')), 'refundOrder')
const errorOrder = r => require.ensure([], () => r(require('../components/page/order/error-order')), 'errorOrder')
const flowInto = r => require.ensure([], () => r(require('../components/page/capital/flow-into')), 'flowInto')
const flowOut = r => require.ensure([], () => r(require('../components/page/capital/flow-out')), 'flowOut')
const flowCount = r => require.ensure([], () => r(require('../components/page/capital/flow-count')), 'flowCount')
const accountList = r => require.ensure([], () => r(require('../components/page/capital/account-list')), 'accountList')
const systemList = r => require.ensure([], () => r(require('../components/page/accessSystem/system-list')), 'systemList')
const systemDeploy = r => require.ensure([], () => r(require('../components/page/accessSystem/systemDeploy')), 'systemDeploy')
const systemConfigure = r => require.ensure([], () => r(require('../components/page/accessSystem/systemConfigure')), 'systemConfigure')
const merchantList = r => require.ensure([], () => r(require('../components/page/merchant/merchant-list')), 'merchantList')
const payIntoDetail = r => require.ensure([], () => r(require('../components/page/order/pay-into-detail')), 'payIntoDetail')
const payOutDetail = r => require.ensure([], () => r(require('../components/page/order/pay-out-detail')), 'payOutDetail')
const flowIntoDetail = r => require.ensure([], () => r(require('../components/page/capital/flow-into-detail')), 'flowIntoDetail')
const flowOutDetail = r => require.ensure([], () => r(require('../components/page/capital/flow-out-detail')), 'flowOutDetail')
const channelList = r => require.ensure([], () => r(require('../components/page/channel/channel-list.vue')), 'channelList')
let routes = [
	{
		path: '/',
		component: Login,
		name: 'Login',
		hidden: true
	},
	{
		path: '/home',
		component: Home,
		iconCls: 'icon-home',
		name: '首页',
		children: [{
				path: '/index',
				component: Index,
				hidden: true
		}]
	},
//	{
//		path: '/home',
//		component: Home,
//		iconCls: 'icon-merchant',
//		name: '商户信息管理',
//		children: [{
//				path: '/merchant-list',
//				component: merchantList,
//				name: '商户信息管理'
//		}]
//	},
	{
		path: '/home',
		component: Home,
		iconCls: 'icon-channel',
		name: '支付渠道管理',
		children: [{
				path: '/channel-list',
				component: channelList,
				name: '支付渠道管理'
		}]
	},
	{
		path: '/home',
		component: Home,
		name: '接入系统管理',
		iconCls: 'icon-sys',
		children: [
//		{
//			path: '/system-list',
//			component: systemList,
//			name: '接入信息管理'
//		},
		{
			path: '/systemDeploy',
			component: systemDeploy,
			hidden: true
		},{
			path: '/systemConfigure',
			component: systemConfigure,
			name: '接入系统配置'
		}]
	},
	{
		path: '/home',
		component: Home,
		iconCls: 'icon-order',
		name: '订单管理',
		children: [{
				path: '/pay-into',
				component: payInto,
				name: '支入订单管理'
			},
			{
				path: '/pay-out',
				component: payOut,
				name: '支出订单管理'
			},
			{
				path: '/error-order',
				component: errorOrder,
				name: '异常订单管理'
			},
//			{
//				path: '/refund-order',
//				component: refundOrder,
//				name: '退款订单管理'
//			}
		]
	},
	{
		path: '/home',
		component: Home,
		iconCls: 'icon-zijin',
		name: '资金管理',
		children: [{
				path: '/flow-into',
				component: flowInto,
				name: '支入流水记录'
			},
			{
				path: '/flow-out',
				component: flowOut,
				name: '支出流水记录'
			},
			{
				path: '/flow-count',
				component: flowCount,
				name: '基础统计表'
			},{
				path: '/account-list',
				component: accountList,
				name: '对账报表'
			}
		]
	},
	{
		path: '/home',
		component: Home,
		iconCls: 'icon-set',
		name: '设置',
		children: [{
			path: '/account',
			component: account,
			name: '账户基本信息'
		},{
			path: '/update-password',
			component: updatePwd,
			name: '修改密码'
		},]
	},
	{
		path: '/forgot-password',
		component: forgotPwd,
		hidden: true
	}, {
		path: '/set-password',
		component: setPwd,
		hidden: true
	}, {
		path: '/register',
		component: register,
		hidden: true
	}, {
		path: '/register-upload',
		component: registerUpload,
		hidden: true
	}, {
		path: '/apply-suc',
		component: applysuc,
		hidden: true
	}, {
		path: '/apply-fail',
		component: applyFail,
		hidden: true
	}
];
export default routes;