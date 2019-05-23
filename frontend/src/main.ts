import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/plugins/vuetify';
import '@/plugins/socketio';
import '@/plugins/vue2-filters';
import Vue2Filters from 'vue2-filters';

Vue.use(require('vue-moment'));

Vue.config.productionTip = false;

new Vue({
  router,
  mixins: [Vue2Filters.mixin],
  render: (h) => h(App),
}).$mount('#app');
