import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [],
    loading: false,
  },
  mutations: {
    setData(state, payload) {
      state.items = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
  },
  getters: {
    items(state) { return state.items },
    loading(state) { return state.loading },
  },
})
