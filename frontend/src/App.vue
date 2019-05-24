<template>
  <v-app :dark="globalVariables.darkMode">
    <v-content>
      <transition :name="transitionName">
        <router-view/>
      </transition>
    </v-content>
  </v-app>
</template>
<style lang="scss" src="./App.scss"></style>
<script lang="ts" src="./App.ts"></script>