<style lang="scss" scoped src="./Home.scss"></style>
<template src="./Home.html"></template>
<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import Talkbubble from '@/components/Talkbubble/Talkbubble.vue';

@Component({
  components: {
    Talkbubble,
  }
})
export default class Home extends Vue {

  @Prop() message: string;

  messages = [
    { message: 'Salut !', align: 'left'},
    { message: 'Salut, ça va ?', align: 'right'},
    { message: 'Tranquille et toi ?', align: 'left'},
    { message: 'Tranquille.', align: 'right'},
  ]

  sendMessage() {
    console.log('send : ' + this.message);
    this.clearMessage();
  }

  clearMessage() {
    this.message = '';
  }

}

</script>
