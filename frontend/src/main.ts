import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/plugins/vuetify';
import '@/plugins/socketio';
import '@/plugins/vue2-filters';
import Vue2Filters from 'vue2-filters';
import Axios from 'axios';
import { tokenService } from './services/TokenService';

Vue.use(require('vue-moment'));

// Add the token in the header of each call
Axios.defaults.headers.common.Authorization = `Bearer ${tokenService.token}`;

Vue.config.productionTip = false;

new Vue({
  router,
  mixins: [Vue2Filters.mixin],
  render: (h) => h(App),
}).$mount('#app');
