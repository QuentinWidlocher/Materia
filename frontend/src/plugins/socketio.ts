import Vue from 'vue';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io-extended';

export const SocketInstance = socketio('http://127.0.0.1:5000');

Vue.use(VueSocketIO, SocketInstance);
