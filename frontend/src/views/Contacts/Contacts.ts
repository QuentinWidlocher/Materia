import { Component, Vue, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/Toolbar/Toolbar';
import User from '@/classes/user';
import Message from '@/classes/message';
import Axios from 'axios';
import ApiConfig from '@/ApiConfig';
import { userService, UserService } from '@/services/UserService';
import router from '@/router';

class ContactRow {
    public user: User;
    public lastMessage: Message;
}

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

    private created() {

        // We load all the contacts and display them
        // TODO: Load only users contacts
        this.loadContacts().then((contacts: ContactRow[]) => {
            this.contacts = contacts;
            this.contactsLoading = false;
        });
    }

    private loadContacts(): Promise<ContactRow[]> {
        const contacts: ContactRow[] = [];

        return Axios.get(ApiConfig.userBase).then((usersResponse) => {
            const users = usersResponse.data as User[];

            const promises: Array<Promise<void>> = [];

            // We get the last message sent in the conversation between the user and all others
            users.forEach((user: User) => {

                if (user.id === this.userService.currentUser.id) {
                    return;
                }

                promises.push(new Promise((rslv) => {
                    const newContact: ContactRow = new ContactRow();
                    newContact.user = user;

                    Axios.get(ApiConfig.messageLast.replace(':idFrom', user.id).replace(':idTo', this.userService.currentUser.id)).then((messageResponse) => {
                        newContact.lastMessage = messageResponse.data;
                    }).finally(() => {
                        contacts.push(newContact);
                        rslv();
                    });
                }));
            });

            return Promise.all(promises);
        }).then(() => {
            return contacts;
        });
    }

    private gotoConversation(userId: string) {
        router.push(`/conversation/${userId}`);
    }
}
