import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
    @Prop() private title: string;
}
