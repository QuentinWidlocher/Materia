import { Component, Vue, Prop } from 'vue-property-decorator';
import router from '@/router';

@Component
export default class Toolbar extends Vue {
    @Prop() private title: string;
    @Prop() private button: { action: string };

    private goBack() {
        router.go(-1);
    }
}
