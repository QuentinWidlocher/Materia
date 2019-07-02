import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Message from '../../classes/message';
import { userService } from '@/services/UserService';
import { globalVariableService } from '@/services/GlobalVariableService';
import router from '@/router';
import { tokenService } from '@/services/TokenService';

@Component
export default class Talkbubble extends Vue {
    @Prop() private value: boolean;
    private show: boolean = false;

    private content: Array<{
        icon: string;
        name: string;
        action: () => void;
    }>;

    // We show immediatly the navbar when called
    // but we wait before it's offscreen to hide it
    @Watch('value')
    private onDisplay() {
        if (this.show) {
            setTimeout(() => this.show = false, 200);
        } else {
            this.show = true;
        }
    }

    private created() {
        this.content = [
            { icon: 'brightness_3', name: 'Dark mode', action: () => this.toggleDarkMode(0) },
            { icon: 'exit_to_app', name: 'Log out', action: () => this.logout()},
        ];
    }

    private toggleDarkMode(index: number) {
        globalVariableService.darkMode = !globalVariableService.darkMode;
        this.content[index].icon = globalVariableService.darkMode ? 'brightness_high' : 'brightness_3';
        this.content[index].name = globalVariableService.darkMode ? 'Light mode' : 'Dark mode';

        // We need to update the app for the theme to take effect
        this.$forceUpdate();
        globalVariableService.eventHub.$emit('update');
    }

    private logout() {
        tokenService.deauthenticate();
        router.push('home');
    }

}
