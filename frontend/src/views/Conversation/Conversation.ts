import { Component, Vue, Prop } from 'vue-property-decorator';
import Talkbubble from '@/components/Talkbubble/Talkbubble.vue';
import Message from '@/classes/message';
import axios, { AxiosResponse } from 'axios';
import { SocketInstance } from '@/plugins/socketio.ts';
import Toolbar from '@/components/Toolbar/Toolbar.vue';
import User from '@/classes/user';
import ApiConfig from '@/ApiConfig.ts';
import { userService } from '@/services/UserService.ts';
import router from '@/router';
import MessageApi from '@/services/api/MessageApi';
import { globalVariableService } from '@/services/GlobalVariableService';
import UserApi from '@/services/api/UserApi';

@Component({
    components: {
        Talkbubble,
        Toolbar,
    },
})
export default class Conversation extends Vue {

    @Prop() private interlocutorId: string;

    // Message typed in the bottom text field
    private message: string = '';

    private title: string = '';

    // The two participant in the conversation
    private interlocutor: User = User.newEmpty();
    private user: User = User.newEmpty();

    // Message list
    private messages: Message[] = [];
    private messagesLoading: boolean = true;

    private activeTimeout: any;

    private scrollToBottomOnce: boolean = false;

    private mounted() {
        // We bind the message receiving to a function
        SocketInstance.on('message', (message: any) => this.receiveMessage(message));

        // We bind the activity change to a function
        SocketInstance.on('activity', (data: any) => this.updateContactActivity(data));
    }

    private updated() {
        if (this.scrollToBottomOnce && (this.$refs.messages as Element)) {
            this.scrollToBottom();
            (this.$refs.messages as Element).removeEventListener('scroll', () => userService.checkActive());
            (this.$refs.messages as Element).addEventListener('scroll', () => userService.checkActive());

            this.scrollToBottomOnce = false;
        }
    }

    // On view focus
    private activated() {
        this.user = userService.currentUser;

        this.scrollToBottom();
        this.messagesLoading = true;

        // First we load the interlocutor based on his ID
        UserApi.getUser(this.interlocutorId).then((interlocutor: User) => {

            // We store the interlocutor
            this.interlocutor = interlocutor;

            // We change the name of the view
            this.title = interlocutor.username;

            return interlocutor;

        }).then((interlocutor: User) => {

            // We fetch the messages from the cache, display them, then update them with messages from the server
            MessageApi.getDiscussion(this.user.id, interlocutor.id).then((response: { cache: Message[], server: Promise<Message[]> }) => {

                this.messages = response.cache;
                this.messagesLoading = false;

                this.scrollToBottomOnce = true;
                return response.server;

            }).then((messages: Message[]) => {

                // We update the messages with messages from the server (fresh data)
                this.messages = messages;
            });
        });
    }

    private scrollToBottom() {
        const container: Element = (this.$refs.messages as Element);
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // We the websocket gives us a message, we add it to the message list
    private receiveMessage(message: Message) {

        // For now, we just ignore if the message doesn't concern us
        // TODO: Use rooms to send messages to concerned people only
        if (!(message.from === this.interlocutor.id && message.to === userService.currentUser.id)) {
            return;
        }

        this.messages.push(message);

        // We need the UI to refresh before accessing $refs, 10ms is enough
        // TODO: Find something better, it's really ugly
        setTimeout(() => {
            this.scrollToBottom();
        }, 10);
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

            // If we sent the message, we need to update the last message in the contact list
            // because we won't get it by socket io
            if (messageToSend.from === userService.currentUser.id) {
                globalVariableService.eventHub.$emit('sentMessage', messageToSend);
            }
        });

        // We clear the text field
        this.clearMessage();

        // We need the UI to refresh before accessing $refs, 10ms is enough
        // TODO: Find something better, it's really ugly
        setTimeout(() => {
            this.scrollToBottom();
        }, 10);
    }

    private clearMessage() {
        this.message = '';
    }

    private updateContactActivity(data: any) {
        if (this.interlocutor.id !== data.userId) {
            return;
        }

        Vue.set(this.interlocutor, 'active', data.active);
    }

}
