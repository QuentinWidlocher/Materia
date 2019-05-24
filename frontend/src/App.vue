<template>
  <v-app>
    <v-content>
      <transition :name="transitionName">
        <router-view/>
      </transition>
    </v-content>
  </v-app>
</template>
<style lang="scss" scoped src="./App.scss"></style>
<script lang="ts" src="./App.ts"></script>