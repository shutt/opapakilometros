import Vue from "vue";
import Vuex from "vuex";
import * as places from "@/store/modules/places";
import * as user from "@/store/modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    places,
    user
  }
});
