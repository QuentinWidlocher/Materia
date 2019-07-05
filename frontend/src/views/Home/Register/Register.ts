import { Component, Vue, Prop } from 'vue-property-decorator';
import Requirement from './Requirement.vue';
import Axios, { AxiosResponse } from 'axios';
import ApiConfig from '@/ApiConfig';
import { sha256 } from 'js-sha256';
import { userService } from '@/services/UserService';
import User from '@/classes/user';
import { tokenService } from '@/services/TokenService';
import router from '@/router';

class RequirementClass {
    public condition: (password: string) => boolean;
    public label: string;
}

@Component({
    components: {
        Requirement,
    },
})
export default class Register extends Vue {

    @Prop() private phone: string;

    private username: string = '';
    private usernameRules = [
        (v: string) => !!v || 'Username is required',
    ];

    private valid: boolean = false;
    private loading: boolean = false;

    private password: string = '';
    private passwordRequirements: RequirementClass[] = [
        { label: 'Contains at least 6 characters', condition: ((s: string) => s.length >= 6) },
        { label: 'Contains at least 10 characters', condition: ((s: string) => s.length >= 10) },
        { label: 'Contains lowercase and uppercase', condition: ((s: string) => s.match(/(?=.*[a-z])(?=.*[A-Z])/g) !== null) },
        { label: 'Contains at least one number', condition: ((s: string) => s.match(/(?=.*[0-9])/g) !== null) },
        { label: 'Contains at least one special character', condition: ((s: string) => s.match(/(?=.[^A-Za-z0-9])/g) !== null) },
    ];
    private passwordRules = [
        (v: string) => !!v || 'Password is required',
    ];
    private passwordStrength: number = 0;
    private passwordStrengthColor: string = '';

    private showPassword: boolean = false;

    private error: string = '';

    private checkPasswordStrength() {
        let strength: number = 0;

        this.passwordRequirements.forEach((requirement: RequirementClass) => {
            if (requirement.condition(this.password)) {
                strength++;
            }
        });

        this.passwordStrength = (strength / this.passwordRequirements.length) * 100;

        if (this.passwordStrength < 50) {
            this.passwordStrengthColor = 'error';
        } else if (this.passwordStrength >= 50 && this.passwordStrength < 75) {
            this.passwordStrengthColor = 'warning';
        } else {
            this.passwordStrengthColor = 'success';
        }
    }

    private register() {

        if (!(this.$refs.form as any).validate() || this.passwordStrength < 50) {
            return;
        }

        this.loading = true;

        Axios.post(ApiConfig.userBase, {
            username: this.username,
            password: sha256(this.password),
            phone: this.phone,
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

            router.replace({ name: 'contacts' });
        });
    }

}
