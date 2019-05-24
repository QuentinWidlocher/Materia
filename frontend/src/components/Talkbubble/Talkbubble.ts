import { Component, Vue, Prop } from 'vue-property-decorator';
import Message from '../../classes/message';

@Component
export default class Talkbubble extends Vue {
    @Prop() private align: string;
    @Prop() private message: Message;
}
