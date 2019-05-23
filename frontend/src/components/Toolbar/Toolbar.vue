<template>
    <v-toolbar>
        <v-toolbar-side-icon v-if="button">
            <v-icon @click="goBack()" v-if="button.action === 'back'">arrow_back</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title>{{title | capitalize}}</v-toolbar-title>
        <v-spacer></v-spacer>
    </v-toolbar>
</template>
<style lang="scss" scoped src="./Toolbar.scss"></style>
<script lang="ts" src="./Toolbar.ts"></script>
