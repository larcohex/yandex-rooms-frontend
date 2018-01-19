const state = {
  events: [],
  currentEvent: {
    title: '',
    dateStart: '',
    dateEnd: '',
    users: [],
    room: null
  }
};

const getters = {
  getEvents: state => state.events,
  getCurrentEvent: state => state.currentEvent
};

const mutations = {
  setEvents: (state, events) => {
    state.events = events;
  },
  setCurrentEvent: (state, event) => {
    state.currentEvent = event;
  }
};

const actions = {
  removeEventFromEvents ({ state }, id) {
    for (let i = 0; i < state.events.length; ++i) {
      if (state.events[i].id === id) {
        state.events.splice(i, 1);
        break;
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
