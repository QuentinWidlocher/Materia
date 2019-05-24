import Vue from 'vue';
import Vuetify, { colors } from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  iconfont: 'mdi',
  options: {
    customProperties: true,
  },
  theme: {
    primary: colors.cyan.darken2,
    secondary: colors.blueGrey.darken3,
    accent: colors.pink.base,
    error: colors.red.base,
    warning: colors.orange.base,
    info: colors.blue.base,
    success: colors.lightGreen.base,
  }
});
