<template>
  <v-app>
    <Toolbar title="Materia"></Toolbar>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<style lang="scss" scoped>
  .v-content {
    height: calc(100vh - 4rem);
    overflow-y: hidden;
  }
</style>

<script>
  import Toolbar from "./components/Toolbar/Toolbar";

  export default {
    name: 'App',
    components: {
      Toolbar,
    },
    data() {
      return {
        //
      }
    }
  }
</script>