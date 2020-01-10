import { db } from "@/main";

export const state = {
  places: []
};

export const mutations = {
  ADD_PLACE(state, placeData) {
    state.places.push(placeData);
  }
};

export const actions = {
  loadAllPlaces({ commit, state }) {
    state.places = [];
    db.collection("places")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let tempPlace = {
            id: doc.id,
            ...doc.data()
          };
          // tempPlace.dist *= 2;
          console.log(tempPlace);
          commit("ADD_PLACE", tempPlace);
        });
      });
  }
};

export const getters = {
  getAllPlaces(state) {
    return state.places;
  }
};
