import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	user: {}
}

const mutations = {
	isLogin(state, user) {
		state.user = user
	}
}
//const actions = {
//	getUser({commit}) {
//		commit('isLogin');
//	}
//}

export default new Vuex.Store({
	state,
	mutations
//	actions
})