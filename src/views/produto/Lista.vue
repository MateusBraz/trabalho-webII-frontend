<template>
  <v-layout row wrap>
    <Produto v-for="produto in produtos" :key="produto.id" :produto="produto" />
  </v-layout>
</template>

<script>
import Produto from "./Produto.vue";
export default {
  components: {
    Produto,
  },
  created() {
    this.$http
      .get(
        `/produto?descricao=${this.params.descricao}&precoMinimo=${this.params.precoMinimo}&precoMaximo=${this.params.precoMaximo}`,
        {
          headers: {
            login: this.$store.user.login,
            senha: this.$store.user.senha,
          },
        }
      )
      .then((response) => {
        this.produtos = response.data;
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  },
  data() {
    return {
      params: {
        descricao: "",
        precoMinimo: 2,
        precoMaximo: 2,
      },
      produtos: [],
    };
  },
};
</script>

<style>
</style>