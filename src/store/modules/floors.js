import request from '../../request';

const state = {
  floors: {}
};

const getters = {
  getFloors: state => state.floors
};

const mutations = {
  setFloors: (state, floors) => {
    state.floors = floors;
  }
};

const actions = {
  initFloors ({ commit }) {
    return new Promise((resolve, reject) => {
      request.getRooms()
        .then((response) => {
          commit('setFloors', response[0]);
          commit('setEvents', response[1]);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  removeEventFromFloors ({ state }, id) {
    for (let floor in state.floors) {
      if (state.floors.hasOwnProperty(floor)) {
        for (let i = 0; i < state.floors[floor].length; ++i) {
          for (let j = 0; j < state.floors[floor][i].events.length; ++j) {
            if (state.floors[floor][i].events[j].id === id) {
              state.floors[floor][i].events.splice(j, 1);
              return;
            }
          }
        }
      }
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
