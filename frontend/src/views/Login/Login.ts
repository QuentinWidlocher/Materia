import { Component, Vue, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/Toolbar/Toolbar';
import axios from 'axios';
import ApiConfig from '@/ApiConfig.ts';
import router from '@/router';
import { userService } from '@/services/UserService.ts';
import User from '@/classes/user';

@Component({
    components: {
        Toolbar,
    },
})
export default class Conversation extends Vue {

    private title: string = 'Login';

    private valid: boolean = false;

    private username: string = '';
    private usernameRules = [
        (v: string) => !!v || 'Name is required',
    ];

    private password: string = '';
    private passwordRules = [
        (v: string) => !!v || 'Password is required',
    ];

    private showPassword: boolean = false;

    private error: string = '';

    private login() {
        this.error = '';

        if (!(this.$refs.form as any).validate()) {
            return;
        }

        axios.post(ApiConfig.userLogin, {
            username: this.username,
            password: this.password,
        }).then((response) => {
            if (!response.data.valid) {
                this.error = response.data.error;
                return;
            }

            userService.currentUser = response.data.user;
            router.push('/');
        });
    }

}
