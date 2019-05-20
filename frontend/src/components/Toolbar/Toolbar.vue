<style lang="scss" scoped src="./Toolbar.scss"></style>
<template src="./Toolbar.html"></template>
<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
    @Prop() private title: string;
}

</script>
