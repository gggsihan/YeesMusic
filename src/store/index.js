import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchVal: '',
    singer: {}
  },
  getters: {},
  mutations: {
    setSearchdVal (state, val) {
      this.state.searchVal = val
    }
  },
  actions: {
  },
  modules: {
  }
})
