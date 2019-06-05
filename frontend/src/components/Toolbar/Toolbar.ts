import { Component, Vue, Prop } from 'vue-property-decorator';
import Sidenav from '@/components/Sidenav/Sidenav';
import router from '@/router';
import User from '@/classes/user';

@Component({
    components: {
        Sidenav,
    },
})
export default class Toolbar extends Vue {
    @Prop() private title: string;
    @Prop() private user: User;
    @Prop() private button: { action: string };
    @Prop() private searchTerms: string;
    @Prop() private searchButton: boolean;
    @Prop() private lockSearch: boolean;

    private showSearchBox: boolean = false;

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
