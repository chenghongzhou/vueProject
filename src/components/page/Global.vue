<template>
</template>

<script>
//import common from '../assets/js/common/common.js'  //引入组件类型
import index from './login/index.vue'  //首页
import systemList from './accessSystem/system-list.vue'  //商户信息管理
import merchantList from './merchant/merchant-list.vue'  //接入系统管理
import payInto from './order/pay-into.vue'  //支入订单管理
import payOut from './order/pay-out.vue'  //支出订单管理
import errorOrder from './order/error-order.vue'  //异常订单管理
import flowInto from './capital/flow-into.vue'  //支入流水记录
import flowOut from './capital/flow-out.vue'  //支出流水记录
import updatePassword from './setting/update-password.vue'  //修改密码

//根据类型选择对应的组件 
/**
 * index:表示类型  0:布局设置 1:基础组件类型 2:图片组件类型  3:辅助类组件
 * type:组件类型
 * number:表示每个组件的编号 和 type组合成每个组件不同的id
 * children:表示组件布局
 */
const controlsType = [
    {
   	 "index":"0",
   	 "type":"0-1",
   	 "title":'首页',
   	 "children":index
   },{
   	 "index":"1",
   	 "type":"1-1",
   	 "title":'商户信息管理',
   	 "children":merchantList
   },{
   	 "index":"2",
   	 "type":"2-1",
   	 "title":'接入信息管理',
   	 "children":systemList
   },{
   	 "index":"3",
   	 "type":"3-1",
   	 "title":'支入订单管理',
   	 "children":payInto
   },{
   	 "index":"3",
   	 "type":"3-2",
   	 "title":'支出订单管理',
   	 "children":payOut
   },{
   	 "index":"3",
   	 "type":"3-3",
   	 "title":'异常订单管理',
   	 "children":errorOrder
   },
    {
   	 "index":"4",
   	 "type":'4-1',
   	 "title":'支入流水记录',
   	 "children":flowInto
   },
    {
   	 "index":"4",
   	 "type":'4-2',
   	 "title":'支出流水记录',
   	 "children":flowOut
   },
   {
   	 "index":"5",
   	 "type":'5-1',
   	 "title":'修改密码',
   	 "children":updatePassword
   }
]


export default{
	controlsType
}
</script>

<style>
</style>