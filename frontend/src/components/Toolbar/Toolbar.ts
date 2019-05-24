import { Component, Vue, Prop } from 'vue-property-decorator';
import Sidenav from '@/components/Sidenav/Sidenav';
import router from '@/router';

@Component({
    components: {
        Sidenav,
    },
})
export default class Toolbar extends Vue {
    @Prop() private title: string;
    @Prop() private button: { action: string };

    private showSidenav: boolean = false;

    private doAction() {
        switch (this.button.action) {
            case 'back':
                router.go(-1);
                break;

            case 'sidenav':
                this.showSidenav = !this.showSidenav;
                break;
        }
    }
}
