import { Component, Vue, Prop } from 'vue-property-decorator';
import Talkbubble from '@/components/Talkbubble/Talkbubble.vue';
import Message from '@/classes/message';
import axios from 'axios';
import { SocketInstance } from '@/plugins/socketio.ts';
import Toolbar from '@/components/Toolbar/Toolbar.vue';
import User from '@/classes/user';
import ApiConfig from '@/ApiConfig.ts';

@Component({
    components: {
        Talkbubble,
        Toolbar,
    },
})
export default class Conversation extends Vue {

    // Message typed in the bottom text field
    private message: string = '';

    private title: string = '';

    // The two participant in the conversation
    private interlocutor: User = User.newEmpty();
    private user: User = User.newEmpty();

    // Message list
    private messages: Message[] = [];
    private messagesLoading: boolean = true;


    private created() {
        
    }

    private mounted() {
        // We bind the message receiving to a function
        SocketInstance.on('message', (message: any) => this.receiveMessage(message));

        // TODO: Replace this with a authentification system
        let value: string | null = '';
        while (value === '') {
            value = window.prompt('Entrez un ID d\'utilisateur', '1');
            value = value === null ? '' : value;
        }
        this.user.id = value;
        //

        const idInterlocutor = (this.user.id === '1' ? '2' : '1');

        // First we load the interlocutor based on his ID
        this.loadInterlocutor(idInterlocutor).then((interlocutor) => {

            // We store the interlocutor
            this.interlocutor = interlocutor;

            // We change the name of the view
            this.title = interlocutor.username;

            return interlocutor;

        }).then((interlocutor) => {

            // We fetch the messages from the server and display them
            this.loadMessages(interlocutor, this.user).then((messages) => {
                this.messages = messages;
                this.messagesLoading = false;

            }).then(() => {
                this.scrollToBottom();
            });
        });
    }

    private loadInterlocutor(id: string): Promise<User> {
        return new Promise((rslv) => {
            axios.get(ApiConfig.userUnique.replace(':id', id)).then((interlocutor) => {
                rslv(interlocutor.data as User);
            });
        });
    }

    private loadMessages(interlocutor: User, user: User): Promise<Message[]> {
        let messagesLeft: Message[];
        let messagesRight: Message[];
        let messagesFinal: Message[];

        return new Promise((rslv) => {

            // We fetch the messages in the interlocutor -> user direction
            axios.get(ApiConfig.messageDirection.replace(':idFrom', interlocutor.id).replace(':idTo', user.id)).then((messages) => {

                // Firebase returns an object with messages as properties of this object
                // Here we transform the objet in an array of messages
                messagesLeft = Object.keys(messages.data).map((i) => messages.data[i]) as Message[];

                // We fetch the messages in the user -> interlocutor direction
                return axios.get(ApiConfig.messageDirection.replace(':idFrom', user.id).replace(':idTo', interlocutor.id));

            }).then((messages) => {

                messagesRight = Object.keys(messages.data).map((i) => messages.data[i]) as Message[];

            }).then(() => {

                // We merge the two arrays, then sort the final array by the timestamps
                messagesFinal = messagesLeft.concat(messagesRight);
                messagesFinal = messagesFinal.sort((a: Message, b: Message) => (a.dateSent > b.dateSent) ? 1 : ((b.dateSent > a.dateSent) ? -1 : 0));

                rslv(messagesFinal);

            });

        });
    }

    private scrollToBottom() {
        const container: Element = (this.$refs.messages as Element);
        container.scrollTop = container.scrollHeight;
    }

    // We the websocket gives us a message, we add it to the message list
    private receiveMessage(message: any) {
        this.messages.push(new Message(
            message.from,
            message.to,
            message.body,
            message.dateSent,
        ));

        this.scrollToBottom();
    }

    private sendMessage() {

        // We don't do anything if the message is empty
        if (this.message === '') {
            return;
        }

        // We create a message based on the discussion and the text field
        const messageToSend: Message = new Message(
            this.user.id,
            this.interlocutor.id,
            this.message,
            undefined,
            false,
        );

        // Even if the message is still not online, we add it to the message list
        const messagePushedIndex = this.messages.push(messageToSend) - 1;

        // We emit the message and when we get the response from the server, we update the message state
        SocketInstance.emit('message', messageToSend.toJSON(), () => {
            this.messages[messagePushedIndex].sent = true;
        });

        // We clear the text field
        this.clearMessage();

        setTimeout(() => {
            this.scrollToBottom();
        }, 10);
    }

    private clearMessage() {
        this.message = '';
    }

}
