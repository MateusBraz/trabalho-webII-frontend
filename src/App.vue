<template>
  <v-app>
    <Template v-if="this.$store.user != null" />
    <router-view v-show="this.$store.user == null"></router-view>
  </v-app>
</template>

<script>
import Template from "./views/template/Template.vue";
export default {
  name: "App",

  components: {
    Template,
  },

  data: () => ({
    //
  }),
};
</script>