import Vue from 'vue';
import Router from 'vue-router';
import Conversation from '@/views/Conversation/Conversation.vue';
import Login from '@/views/Login/Login.vue';
import Contacts from './views/Contacts/Contacts';
import { userService } from '@/services/UserService';
import { tokenService } from './services/TokenService';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: { name: 'contacts' }},
    { path: '/contacts', name: 'contacts', component: Contacts },
    { path: '/conversation/:interlocutorId', name: 'conversation', component: Conversation, props: true },
    { path: '/login', name: 'login', component: Login },
  ],
});

router.beforeEach((to, from, next) => {
  const authenticatedUser = tokenService.authenticate();

  // If the user is not authenticated, move him to the login page
  // TODO: Use token authentication
  if (to.name !== 'login' && !userService.currentUser && !authenticatedUser) {
    next({name: 'login'});
  }

  if (authenticatedUser) {
    userService.currentUser = authenticatedUser;
  }
  next();
});

export default router;
