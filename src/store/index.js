import Vue from 'vue';
import Vuex from 'vuex';
import floors from './modules/floors';
import users from './modules/users';
import events from './modules/events';
import modal from './modules/modal';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    modal,
    floors,
    users,
    events
  },
  strict: false
});
