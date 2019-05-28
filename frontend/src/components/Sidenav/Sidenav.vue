<template>
    <v-navigation-drawer
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      v-show="show"
      absolute
      temporary
    >
    <v-img :aspect-ratio="16/9" src="./static/img/logo.webp"/>
    <v-toolbar flat>
      <span class="title">
        Materia
      </span>
    </v-toolbar>
      <v-list>
        <v-list-tile v-for="row in content" :key="row.name" @click="row.action">
            <v-list-tile-action>
              <v-icon>{{ row.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ row.name | capitalize }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
</template>
<style lang="scss" scoped src="./Sidenav.scss"></style>
<script lang="ts" src="./Sidenav.ts"></script>
