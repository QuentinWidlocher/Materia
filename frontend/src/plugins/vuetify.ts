import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  iconfont: 'mdi',
  options: {
    customProperties: true,
  },
});