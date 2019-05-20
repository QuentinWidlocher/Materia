<style lang="scss" scoped src="./Talkbubble.scss"></style>
<template src="./Talkbubble.html"></template>
<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Talkbubble extends Vue {
    @Prop() private align: string;
    @Prop() private message: string;
    @Prop() private sender: string;
}

</script>
