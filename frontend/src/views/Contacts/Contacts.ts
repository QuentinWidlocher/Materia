import { Component, Vue, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/Toolbar/Toolbar';
import User from '@/classes/user';
import Message from '@/classes/message';
import Axios from 'axios';
import ApiConfig from '@/ApiConfig';
import { userService } from '@/services/UserService';
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

    private contacts: ContactRow[] = [];

    private created() {
        if (!userService.currentUser) {
            router.push('/login');
        }

        this.loadContacts().then((contacts: ContactRow[]) => this.contacts = contacts);
    }

    private loadContacts(): Promise<ContactRow[]> {
        const contacts: ContactRow[] = [];

        return Axios.get(ApiConfig.userBase).then((usersResponse) => {
            const users = usersResponse.data as User[];

            const promises: Array<Promise<void>> = [];

            users.forEach((user: User) => {

                if (user.id === userService.currentUser.id) {
                    return;
                }

                promises.push(new Promise((rslv) => {
                    Axios.get(ApiConfig.messageLast.replace(':idFrom', user.id).replace(':idTo', userService.currentUser.id)).then((messageResponse) => {
                        contacts.push({ user, lastMessage: messageResponse.data });
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
