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
    public lastMessage: Message | null;
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

    // We load all the contacts and display them
    // The view is kept alive, using activated() allow to refresh data when the view is navigated
    // TODO: Load only users contacts
    private activated() {
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

            return contacts;
        });
    }

    private gotoConversation(userId: string) {
        router.push(`/conversation/${userId}`);
    }
}
