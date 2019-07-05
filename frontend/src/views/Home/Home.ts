import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Login from './Login/Login';
import Register from './Register/Register';
import Axios, { AxiosResponse, AxiosPromise } from 'axios';
import ApiConfig from '@/ApiConfig';
import User from '@/classes/user';

@Component({
    components: {
        Login,
        Register,
    },
})
export default class Home extends Vue {

    private code: string = '';
    private codeRules = [
        (v: string) => !!v || 'Code is required',
        (v: string) => v.length === 2 || 'Code must be 2 characters long',
    ];

    private phone: string = '';
    private phoneRules = [
        (v: string) => !!v || 'Phone number is required',
        (v: string) => v.length === 9 || 'Phone number must be 9 digits long',
    ];

    private loading: boolean = false;
    private error: string = '';

    private activePage: string = 'home';

    private username: string;
    private id: string;

    @Watch('code')
    private onCodeChange(val: string) {
        // We focus the phone field when the use typed typed 2 char
        if (val.length >= 2) {
            (this.$refs.phone as any).focus();
        }
    }

    private next() {
        this.error = '';
        this.loading = true;

        if (!(this.$refs.form as any).validate()) {
            this.loading = false;
            return;
        }

        Axios.get(ApiConfig.userUniquePhone.replace(':phone', this.code + this.phone)).then((response: any) => {

            if (response.data.id === null) {
                this.activePage = 'register';
            } else {
                this.username = response.data.username;
                this.id = response.data.id;
                this.activePage = 'login';
            }

            this.loading = false;
        });
    }

}
