import request from '../../request';

const state = {
  users: {}
};

const getters = {
  getUsers: state => state.users
};

const mutations = {
  setUsers: (state, users) => {
    state.users = users;
  }
};

const actions = {
  initUsers ({ commit }) {
    return new Promise((resolve, reject) => {
      request.getUsers()
        .then((users) => {
          commit('setUsers', users);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
