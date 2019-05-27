import { Component, Vue, Prop } from 'vue-property-decorator';
import Message from '../../classes/message';
import { userService } from '@/services/UserService';
import { globalVariableService } from '@/services/GlobalVariableService';
import router from '@/router';
import { tokenService } from '@/services/TokenService';

@Component
export default class Talkbubble extends Vue {
    @Prop() private display: boolean;

    private content: Array<{
        icon: string;
        name: string;
        action: () => void;
    }>;

    private created() {
        this.content = [
            { icon: 'brightness_high', name: 'Toggle dark mode', action: () => this.toggleDarkMode(0) },
            { icon: 'exit_to_app', name: 'Log out', action: () => this.logout()},
        ];
    }

    private toggleDarkMode(index: number) {
        globalVariableService.darkMode = !globalVariableService.darkMode;
        this.content[index].icon = globalVariableService.darkMode ? 'brightness_high' : 'brightness_3';
        this.content[index].name = globalVariableService.darkMode ? 'Light mode' : 'Dark mode';

        this.$forceUpdate();
        globalVariableService.eventHub.$emit('update');
    }

    private logout() {
        tokenService.deauthenticate();
        router.push('login');
    }
}
