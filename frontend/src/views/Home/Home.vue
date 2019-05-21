<style lang="scss" scoped src="./Home.scss"></style>
<template src="./Home.html"></template>
<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import Talkbubble from '@/components/Talkbubble/Talkbubble.vue';
import Message from '@/classes/message';
import axios from 'axios';
import { SocketInstance } from '@/plugins/socketio';

@Component({
  components: {
    Talkbubble,
  },
})
export default class Home extends Vue {

  // Message typed in the bottom text field
  private message: string = '';

  // User ID and InterlocutorID
  private direction: { [key: string]: string } = {};

  // Message list
  private messages: Message[] = [];
  private messagesLoading: boolean = true;

  private created() {
    // We bind the message receiving to a function
    SocketInstance.on('message', (message: any) => this.receiveMessage(message));

    // TODO: Replace this with a authentification system
    let idUser: string | null = null;
    while (idUser === null) {
      idUser = window.prompt('Entrez un ID d\'utilisateur','1');
    }
    this.direction['user'] = idUser;
    this.direction['interlocutor'] = (idUser === '1' ? '2' : '1');
    //

    // We fetch the messages from the server and display them
    this.loadMessage(this.direction).then((messages) => {
      this.messages = messages;
      this.messagesLoading = false;
    });
  }

  private loadMessage(direction: { [key: string]: string }): Promise<Message[]> {
    let messagesLeft: Message[];
    let messagesRight: Message[];
    let messages: Message[];

    return new Promise((rslv) => {

      // We fetch the messages in the interlocutor -> user direction
      axios.get(`http://127.0.0.1:5000/api/messages/${direction['interlocutor']}/${direction['user']}`).then((messages) => {

        // Firebase returns an object with messages as properties of this object
        // Here we transform the objet in an array of messages
        messagesLeft = Object.keys(messages.data).map((i) => messages.data[i]) as Message[];

        // We fetch the messages in the user -> interlocutor direction
        return axios.get(`http://127.0.0.1:5000/api/messages/${''+direction['user']}/${''+direction['interlocutor']}`)

      }).then((messages) => {

        messagesRight = Object.keys(messages.data).map((i) => messages.data[i]) as Message[];

      }).then(() => {        

        // We merge the two arrays, then sort the final array by the timestamps
        messages = messagesLeft.concat(messagesRight);
        messages = messages.sort((a: Message, b: Message) => (a.dateSent > b.dateSent) ? 1 : ((b.dateSent > a.dateSent) ? -1 : 0));

        rslv(messages);

      });

    });
  }

  // We the websocket gives us a message, we add it to the message list
  private receiveMessage(message: any) {
    this.messages.push(new Message(
      message.from,
      message.to,
      message.body,
      message.dateSent
    ));
  }

  private sendMessage() {
    // We create a message based on the discussion and the text field
    let messageToSend: Message = new Message(
      ''+this.direction['user'],
      ''+this.direction['interlocutor'],
      this.message,
    );

    // We emit the message but don't wait for the response
    SocketInstance.emit('message', messageToSend.toJSON(), () => {});

    // Even if the message is still not online, we add it to the message list
    this.messages.push(messageToSend);

    // We clear the text field
    this.clearMessage();
  }

  private clearMessage() {
    this.message = '';
  }

}

</script>
