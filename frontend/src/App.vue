<template>
  <v-app :dark="globalVariables.darkMode" class="elevation-2">
    <v-content>
      <transition :name="transitionName">
        <keep-alive exclude="Login">
          <router-view/>
        </keep-alive>
      </transition>
    </v-content>
  </v-app>
</template>
<style lang="scss" src="./App.scss"></style>
<script lang="ts" src="./App.ts"></script>