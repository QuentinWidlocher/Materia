import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

import { userService } from './services/UserService';
import { globalVariableService, GlobalVariableService } from './services/GlobalVariableService';

@Component
export default class App extends Vue {
    private transitionName: string = '';
    private globalVariables: GlobalVariableService;

    private created() {
        this.globalVariables = globalVariableService;
        globalVariableService.eventHub.$on('update', () => this.$forceUpdate());
    }

    @Watch('$route')
    private onRouteChange(to: Route, from: Route) {
        if (from.name === 'login' || to.name === 'login') {
            this.transitionName = 'fade-transition';
            return;
        }

        const toDepth = to.path.split('/').length;
        const fromDepth = from.path.split('/').length;
        this.transitionName = toDepth > fromDepth ? 'slide-right' : 'slide-left';
    }
}

