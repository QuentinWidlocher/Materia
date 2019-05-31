import { Component, Vue, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/Toolbar/Toolbar';
import User from '@/classes/user';
import Message from '@/classes/message';
import Axios from 'axios';
import ApiConfig from '@/ApiConfig';
import { userService, UserService } from '@/services/UserService';
import router from '@/router';
import { SocketInstance } from '@/plugins/socketio';
import { globalVariableService } from '@/services/GlobalVariableService';
import { ContactRow } from '@/classes/contactRow';


@Component({
    components: {
        Toolbar,
    },
})
export default class Contacts extends Vue {
    private title: string = 'Materia';

    private userService: UserService = userService;

    private contacts: ContactRow[] = [];
    private contactsLoading: boolean = true;

    private mounted() {
        // We bind the message receiving to a function
        SocketInstance.on('message', (message: any) => this.receiveMessage(message));

        // We also listen to the event that trigger when WE send a message
        // because socket io won't fire
        globalVariableService.eventHub.$on('sentMessage', (message: Message) => this.receiveMessage(message));

        // We get the current user contacts and sort them by last message date
        this.contacts = userService.currentUser.contacts.sort((a: ContactRow, b: ContactRow) => {
            if (!a.lastMessage || !b.lastMessage) {
                return 0;
            }

            return a.lastMessage.dateSent - b.lastMessage.dateSent;
        }).reverse();

        this.contactsLoading = false;
    }

    private gotoConversation(userId: string) {
        router.push(`/conversation/${userId}`);
    }

    // We the websocket gives us a message, we add it to the message list
    private receiveMessage(message: Message) {

        let interlocutorId: string;

        // For now, we just ignore if the message doesn't concern us
        // TODO: Use rooms to send messages to concerned people only
        if (message.from === userService.currentUser.id) {
            // If we SENT the message, the interlocutor is the receiver
            interlocutorId = message.to;
        } else if (message.to === userService.currentUser.id) {
            // If we RECEIVED the message, the interlocutor is the sender
            interlocutorId = message.from;
        } else {
            // If we're not concerned by the message, we return
            return;
        }

        const contact = this.contacts.find((c) => c.user.id === interlocutorId);

        // If the contact is not in our list, we refresh the user completely because we lack
        // data to add it otherwise
        if (!contact) {
            this.contactsLoading = false;
            Axios.get(ApiConfig.userUnique.replace(':id', userService.currentUser.id)).then((response) => {
                console.log(response.data);
                this.userService.currentUser = response.data;
                this.contacts = this.userService.currentUser.contacts;
                this.contactsLoading = false;
            });
            return;
        }

        const index = this.contacts.indexOf(contact);

        this.contacts[index].lastMessage = message;

        // We put it at the top of the list
        this.contacts.splice(0, 0, this.contacts.splice(index, 1)[0]);
    }
}
