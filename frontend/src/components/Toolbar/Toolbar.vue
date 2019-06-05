<template>
<div id="Toolbar">
    <v-toolbar class="main-toolbar" :color="'primary'" :flat="showSearchBox">
        <v-toolbar-side-icon v-if="button" @click="doAction()">
            <v-icon v-if="button.action === 'back'">arrow_back</v-icon>
            <v-icon v-if="button.action === 'sidenav'">menu</v-icon>
        </v-toolbar-side-icon>

        <!-- Display a title -->
        <template v-if="title && !user">
            <v-toolbar-title>{{ title | capitalize }}</v-toolbar-title>
        </template>

        <!-- Display username and avatar -->
        <template v-if="!title && user">
            <v-avatar color="grey lighten-1" size="40" class="ml-2">
                <v-icon dark>person</v-icon>
                <transition name="scale-transition">
                    <div class="badge" v-if="user.active"></div>
                </transition>
            </v-avatar>
            <v-toolbar-title class="ml-3">{{ user.username | capitalize }}</v-toolbar-title>
        </template>

        <v-spacer></v-spacer>
        <v-btn
            :ripple="showSearchBox"
            :flat="showSearchBox"
            :icon="!showSearchBox"
            v-if="searchButton"
            dark
            @click="showSearchBox = !showSearchBox; $emit('open-search', showSearchBox)"
        >
            <v-icon v-if="!showSearchBox">search</v-icon>
            <template v-if="showSearchBox">Close search</template>
        </v-btn>
    </v-toolbar>
    <v-expand-transition>
        <v-toolbar class="search-toolbar" :color="'primary'" v-show="showSearchBox">
            <v-text-field
                :value="searchTerms"
                :readonly="lockSearch"
                v-on:input="$emit('input', $event); $emit('search')"
                label="Search for a person"
                clear-icon="close"
                single-line
                dark
                box
                clearable
                full-width
                background-color="primary"
                color="white"
            >
                <template v-slot:prepend>
                    <div v-if="lockSearch">
                        <v-progress-circular
                            size="24"
                            width="2"
                            color="white"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                    <div v-if="!lockSearch">
                        <v-icon>search</v-icon>
                    </div>
                </template>
            </v-text-field>
        </v-toolbar>
    </v-expand-transition>
    <Sidenav v-model="showSidenav"/>
</div>
</template>
<style lang="scss" scoped src="./Toolbar.scss"></style>
<script lang="ts" src="./Toolbar.ts"></script>
