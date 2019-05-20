<template>
  <v-app>
    <Toolbar title="Materia"></Toolbar>
    <router-view/>
  </v-app>
</template>

<script>
import Toolbar from "./components/Toolbar/Toolbar";

export default {
  name: 'App',
  components: {
    Toolbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
