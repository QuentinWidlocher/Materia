import Vue from 'vue';
import Router from 'vue-router';
import Conversation from '@/views/Conversation/Conversation.vue';
import Login from '@/views/Login/Login.vue';
import Contacts from './views/Contacts/Contacts';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: { name: 'contacts' }},
    { path: '/contacts', name: 'contacts', component: Contacts },
    { path: '/conversation/:interlocutorId', name: 'conversation', component: Conversation, props: true },
    { path: '/login', name: 'login', component: Login },
  ],
});
