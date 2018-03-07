<template lang="html">
  <div id="app">
  	<transition name="fade">
   	  <keep-alive>
     	  <router-view></router-view>
    	</keep-alive>
  	</transition>
  </div>
</template>
<script>
	export default {
  name: 'app',
  data(){
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
	@import './assets/css/common.scss';
	#app {
	  font-family: 'Avenir', Helvetica, Arial, sans-serif;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	  width: 100%;
	  height: 100%;
	  text-align: center;
	  color: #2c3e50;
	}
	
</style>
