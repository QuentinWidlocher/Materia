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

        this.contacts = userService.currentUser.contacts;

        return;

        // We load all the contacts and display them
        // The view is kept alive, so the data are updated by the socket
        // TODO: Load only users contacts
        this.loadContacts().then((contacts: ContactRow[]) => {
            this.contacts = contacts;
            this.contactsLoading = false;
        });
    }

    private loadContacts(): Promise<ContactRow[]> {
        return Axios.get(ApiConfig.userBase).then((usersResponse) => {
            const users = usersResponse.data as User[];
            const contacts: ContactRow[] = [];

            users.forEach((user: User) => {

                if (user.id === userService.currentUser.id) {
                    return;
                }

                user.lastMessages = user.lastMessages ? user.lastMessages : [];
                const contact: ContactRow = new ContactRow();
                contact.user = user;
                contact.lastMessage = user.lastMessages[userService.currentUser.id as any] ? user.lastMessages[userService.currentUser.id as any] : null;

                contacts.push(contact);
            });

            // We sort the contacts by last message up
            return contacts.sort((a: ContactRow, b: ContactRow) => {
                if (!a.lastMessage || !b.lastMessage) {
                    return 0;
                }

                return a.lastMessage.dateSent - b.lastMessage.dateSent;
            }).reverse();
        });
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

        if (!contact) {
            return;
        }

        const index = this.contacts.indexOf(contact);

        this.contacts[index].lastMessage = message;

        // We put it at the top of the list
        this.contacts.splice(0, 0, this.contacts.splice(index, 1)[0]);
    }
}
