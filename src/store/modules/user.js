import router from "../../router";

export const state = {
  user: null
};

export const mutations = {
  SET_USER(state, userData) {
    state.user = userData;
    console.log(router.currentRoute);
    if (userData === null) {
      if (router.currentRoute.name !== "login") router.push({ name: "login" });
    } else {
      if (router.currentRoute.name !== "home") router.push({ name: "home" });
    }
  }
};

export const actions = {};

export const getters = {
  getUserName(state) {
    if (state.user != null) return state.user.displayName;
    else return null;
  },
  getUserPhoto(state) {
    if (state.user != null) return state.user.photoURL;
    else return null;
  }
};
