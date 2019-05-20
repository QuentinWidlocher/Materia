import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/vuetify';
import './plugins/socketio';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
