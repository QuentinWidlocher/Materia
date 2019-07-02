import { Component, Vue, Prop } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import ApiConfig from '@/ApiConfig.ts';
import router from '@/router';
import { userService } from '@/services/UserService.ts';
import { tokenService } from '@/services/TokenService.ts';
import User from '@/classes/user';
import { sha256 } from 'js-sha256';
import { RawLocation } from 'vue-router';

@Component({
    components: {
    },
})
export default class Login extends Vue {

    @Prop() private username: string;
    @Prop() private id: string;

    private valid: boolean = false;
    private loading: boolean = false;

    private password: string = '';
    private passwordRules = [
        (v: string) => !!v || 'Password is required',
    ];

    private showPassword: boolean = false;

    private error: string = '';

    private login() {

        this.error = '';
        this.loading = true;

        if (!(this.$refs.form as any).validate()) {
            return;
        }

        axios.post(ApiConfig.userLogin, {
            id: this.id,
            password: sha256(this.password),
        }).then((response: AxiosResponse) => {

            if (!response.data.valid) {
                this.error = response.data.error;
                this.loading = false;
                return;
            }

            const authenticatedUser: User | null = tokenService.authenticate(response.data.jwt);

            if (!authenticatedUser) {
                return;
            }

            router.replace({name: 'contacts'});
        });
    }

}
