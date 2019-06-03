import { Component, Vue, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/Toolbar/Toolbar';
import User from '@/classes/user';
import Message from '@/classes/message';
import Axios, { AxiosResponse } from 'axios';
import ApiConfig from '@/ApiConfig';
import { userService, UserService } from '@/services/UserService';
import router from '@/router';
import { SocketInstance } from '@/plugins/socketio';
import { globalVariableService } from '@/services/GlobalVariableService';
import { ContactRow } from '@/classes/contactRow';
import { stat } from 'fs';


@Component({
    components: {
        Toolbar,
    },
})
export default class Contacts extends Vue {
    private title: string = 'Materia';

    private userService: UserService = userService;

    private contacts: ContactRow[] = [];
    private contactsOriginal: ContactRow[] = this.contacts;
    private contactsAll: ContactRow[] = [];
    private contactsLoading: boolean = true;

    private searchTerms: string = '';
    private searchReady: boolean = false;

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

        this.contactsOriginal = this.contacts;

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
                this.userService.currentUser = response.data;
                this.contacts = this.userService.currentUser.contacts.sort((a: ContactRow, b: ContactRow) => {
                    if (!a.lastMessage || !b.lastMessage) {
                        return 0;
                    }

                    return a.lastMessage.dateSent - b.lastMessage.dateSent;
                }).reverse();

                this.contactsOriginal = this.contacts;

                this.contactsLoading = false;
            });
            return;
        }

        const index = this.contacts.indexOf(contact);

        this.contacts[index].lastMessage = message;

        // We put it at the top of the list
        this.contacts.splice(0, 0, this.contacts.splice(index, 1)[0]);
    }

    private openSearch(state: boolean) {
        if (state) {
            this.searchReady = false;
            this.contactsLoading = true;
            return Axios.get(ApiConfig.userBase).then((response: AxiosResponse) => {
                this.contactsAll = [];
                response.data.forEach((user: User) => {
                    this.contactsAll.push({
                        user,
                        lastMessage: null,
                    });
                });
            }).then(() => {
                this.search();

                // I don't understand, if we don't wait for at least 0ms, the list blink when done loading...
                // TODO : Understand why and fix (making this.search() a Promise doesn't work)
                setTimeout(() => {
                    this.searchReady = true;
                    this.contactsLoading = false;
                }, 0);
            });
        } else {
            this.contacts = this.contactsOriginal;
        }
    }

    private search() {
        if (this.searchTerms) {
            this.contacts = this.contactsAll.filter((contact) => {
                return contact.user.username.toLowerCase().includes(this.searchTerms.toLowerCase());
            });
        } else {
            this.contacts = [];
        }
    }
}
