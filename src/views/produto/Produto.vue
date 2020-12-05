<template>
  <v-flex class="pr-3 pb-3" xs12 md6 lg4>
    <v-card
      style="background-color: #144552; color: #16db93"
      class="white--text"
    >
      <v-card-title class="headline">
        <v-row class="pa-2">
          <strong>
            {{ produto.descricao }}
            <small style="color: #16db93"
              >(Preço: {{ produto.precoVenda | currency }})</small
            >
          </strong>
          <v-spacer></v-spacer>
          <v-icon color="#16db93" small class="mr-2" @click="editarPessoa(item)"
            >mdi-pencil</v-icon
          >
          <v-icon color="#16db93" small @click="deletarPessoa(item)"
            >mdi-delete</v-icon
          >
        </v-row>
        <v-row class="pa-2" style="font-size: 1rem">
          <p class="mr-2">Quatidade estoque:</p>
          <strong style="color: #16db93">
            {{ produto.quantidadeEstoque }}
          </strong>
        </v-row>
      </v-card-title>
    </v-card>
    <v-card>
      <v-container fill-height>
        <v-text-field
          v-if="produto.quantidadeEstoque > 0"
          label="Quantidade"
          type="number"
          v-model.number="quantity"
          :error="!Number.isInteger(quantity)"
        ></v-text-field>
        <h1 v-else>Esgotado!</h1>
        <v-btn
          class="ml-1"
          :disabled="
            produto.quantidadeEstoque == 0 ||
            quantity > produto.quantidadeEstoque ||
            quantity <= 0 ||
            !Number.isInteger(quantity)
          "
          style="background-color: #144552; color: #16db93"
          @click="addQuantity"
          >Adicionar</v-btn
        >
      </v-container>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: ["produto"],
  data() {
    return {
      quantity: 0,
    };
  },
  methods: {
    addQuantity() {
      this.quantity++;
    },
  },
};
</script>

<style>
</style>