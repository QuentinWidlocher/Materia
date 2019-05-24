<template>
    <div class="talkbubble elevation-1"
        v-bind:class="{ 
            right: (align === 'right'), 
            left: (align !== 'right'),
        }"
    >
        <span class="body">{{ message.body }}</span>
        <span class="time">
            {{ new Date(message.dateSent * 1000) | moment("kk:mm") }}
            <template v-if="align === 'right'">
                <v-icon v-if="message.sent === false" small color="white">access_time</v-icon>
                <v-icon v-if="message.sent === undefined || message.sent" small color="white">done</v-icon>
            </template>
        </span>
    </div>
</template>
<style lang="scss" scoped src="./Talkbubble.scss"></style>
<script lang="ts" src="./Talkbubble.ts"></script>
