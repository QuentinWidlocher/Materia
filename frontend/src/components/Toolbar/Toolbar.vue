<template>
<div id="Toolbar">
    <v-toolbar :color="'primary'">
        <v-toolbar-side-icon v-if="button" @click="doAction()">
            <v-icon v-if="button.action === 'back'">arrow_back</v-icon>
            <v-icon v-if="button.action === 'sidenav'">menu</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title>{{ title | capitalize }}</v-toolbar-title>
        <v-spacer></v-spacer>
    </v-toolbar>
    <Sidenav v-model="showSidenav"/>
</div>
</template>
<!-- <style lang="scss" scoped src="./Toolbar.scss"></style> -->
<script lang="ts" src="./Toolbar.ts"></script>
