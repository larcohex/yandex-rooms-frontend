const state = {
  modal: false,
  type: 'WARNING',
  heading: '',
  text: ['']
};

const getters = {
  getModal: state => state.modal,
  getType: state => state.type,
  getHeading: state => state.heading,
  getText: state => state.text
};

const mutations = {
  setModal: (state, modal) => {
    state.modal = modal;
  },
  setType: (state, type) => {
    state.type = type;
  },
  setHeading: (state, heading) => {
    state.heading = heading;
  },
  setText: (state, text) => {
    state.text = text;
  }
};

const actions = {
  closeModal ({ commit }) {
    commit('setModal', false);
  },
  openModal ({ commit }, msg) {
    commit('setType', msg.type);
    commit('setHeading', msg.heading);
    commit('setText', msg.text);
    commit('setModal', true);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
