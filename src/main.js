import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import moment from "moment";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWIHmKJYF0CZx-15cPQy-Yc3EdnwdBCDQ",
  authDomain: "papa-kilometros.firebaseapp.com",
  databaseURL: "https://papa-kilometros.firebaseio.com",
  projectId: "papa-kilometros",
  storageBucket: "papa-kilometros.appspot.com",
  messagingSenderId: "708176786879",
  appId: "1:708176786879:web:47fc760a3cc335e3bc9d0a"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("SET_USER", user);
    // router.push({ path: "/" });
    console.log("Logged in ", user);
  } else {
    store.commit("SET_USER", null);
    // router.push({ path: "/login" });
    console.log("Logged out");
  }
});

db.collection("places").onSnapshot(querySnapshot => {
  querySnapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      let tempPlace = {
        id: change.doc.id,
        ...change.doc.data()
      };
      tempPlace.dist *= 2;
      store.commit("ADD_PLACE", tempPlace);
    }
    /*
    TODO: 
      - caso o documento seja alterado
      - caso o documento seja apagado
    */
  });
});

moment.locale("pt");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
