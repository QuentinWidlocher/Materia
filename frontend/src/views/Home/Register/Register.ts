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
export default class Register extends Vue {

    private valid: boolean = false;
    private loading: boolean = false;

    private password: string = '';
    private passwordRules = [
        (v: string) => !!v || 'Password is required',
    ];

    private showPassword: boolean = false;

    private error: string = '';

}
