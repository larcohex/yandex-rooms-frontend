import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home';
import Event from '../components/Event';
import store from '../store';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/new',
      name: 'NewEvent',
      component: Event
    },
    {
      path: '/:id',
      name: 'EditEvent',
      component: Event,
      beforeEnter: (to, from, next) => {
        let set = false;
        for (let i = 0; i < store.getters.getEvents.length; ++i) {
          if (store.getters.getEvents[i].id === to.params.id) {
            store.commit('setCurrentEvent', store.getters.getEvents[i]);
            set = true;
            break;
          }
        }
        if (set) next();
        else next('/');
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
});
