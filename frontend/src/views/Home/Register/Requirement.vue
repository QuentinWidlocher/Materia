<template>
    <div class="requirement" v-bind:class="{ok: (condition)}"><v-icon>{{condition ? 'check_box' : 'check_box_outline_blank'}}</v-icon><span>{{ label }}</span></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
    components: {
    },
})
export default class Register extends Vue {

    @Prop() private condition: boolean;
    @Prop() private label: boolean;

}
</script>
<style lang="scss" scoped>
.requirement, .requirement>.v-icon {
        color: black;
        opacity: 0.5;

        &.ok, &.ok>.v-icon {
            opacity: 1;
            color: var(--v-success-base) !important;
        }

        span {
            margin-left: 0.5rem; 
            vertical-align: text-bottom;
        }
}
</style>

