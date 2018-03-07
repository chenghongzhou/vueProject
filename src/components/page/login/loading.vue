//loading效果组件

<template>
	<div class="loadEffect" id="Loading">
		<img src="../../../assets/img/Loading4.gif" />
	</div>
</template>

<script>
	export default {
		name: 'Loading'

	}
</script>
<style lang="scss">
	.loadEffect {
		    z-index: 999;
		    position: absolute;
		    top: 40%;
		    left: 52%;
	}
</style>