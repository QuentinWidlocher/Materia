import Vue from 'vue';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io-extended';
import ApiConfig from '../ApiConfig';

export const SocketInstance = socketio(ApiConfig.urlBase);

Vue.use(VueSocketIO, SocketInstance);
