import Vue from 'vue';
import Component from 'vue-class-component';

import { userService } from './services/UserService';
import { Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class App extends Vue {
    private transitionName: string = '';

    @Watch('$route')
    private onRouteChange(to: Route, from: Route) {
        if (from.name === 'login') {
            this.transitionName = 'fade';
            return;
        }

        const toDepth = to.path.split('/').length;
        const fromDepth = from.path.split('/').length;
        this.transitionName = toDepth > fromDepth ? 'slide-right' : 'slide-left';
    }
}

