import Vue from 'vue';
import App from './App';
import router from './router';
import moment from 'moment';
import store from './store';

/* global $ */

moment.locale('ru');
$.datepicker.setDefaults($.datepicker.regional['ru']);

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

store.dispatch('initUsers').then(() => {
  store.dispatch('initFloors').then(() => {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    });
  });
});
