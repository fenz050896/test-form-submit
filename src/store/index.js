import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
  },
  mutations: {
    addProducts(state, values) {
      state.products = [...values];
    },
  },
  actions: {},
  modules: {},
});
