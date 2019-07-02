import Vue from 'vue';
import Router from 'vue-router';
import Conversation from '@/views/Conversation/Conversation.vue';
import Home from '@/views/Home/Home.vue';
import Contacts from './views/Contacts/Contacts';
import { userService } from '@/services/UserService';
import { tokenService } from './services/TokenService';
import User from './classes/user';
import Axios from 'axios';
import ApiConfig from './ApiConfig';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: { name: 'home' }},
    { path: '/contacts', name: 'contacts', component: Contacts },
    { path: '/conversation/:interlocutorId', name: 'conversation', component: Conversation, props: true },
    { path: '/home', name: 'home', component: Home },
  ],
});

router.beforeEach((to, from, next) => {
  const authenticatedUser: User | null = tokenService.authenticate();

  // If the user is not authenticated or if the token is expired, move him to the login page
  if (to.name !== 'home' && !userService.currentUser && !authenticatedUser) {
    console.log('user is not authenticated and userService is empty');
    next({name: 'home'});
  }

  if (authenticatedUser && !userService.currentUser) {
    console.log('user is authenticated but userService is empty');
    Axios.get(ApiConfig.userUnique.replace(':id', authenticatedUser.id)).then((response) => {
      userService.currentUser = response.data;
      next();
    });
  } else {
    next();
  }

});

export default router;
