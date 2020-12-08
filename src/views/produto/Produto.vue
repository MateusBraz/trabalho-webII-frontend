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
          <v-icon
            color="#16db93"
            small
            class="mr-2"
            @click="editarProduto(produto)"
            >mdi-pencil</v-icon
          >
          <v-icon color="#16db93" small @click="deletarProduto(produto)"
            >mdi-delete</v-icon
          >
        </v-row>
        <v-row class="pa-2" style="font-size: 1rem">
          <v-spacer></v-spacer>
          <p class="mr-2">Quatidade estoque:</p>
          <strong style="color: #16db93">
            {{ produto.quantidadeEstoque }}
          </strong>
        </v-row>
      </v-card-title>
      <div style="height: 150px">
        <v-container fill-height>
          <v-text-field
            dark
            v-if="produto.quantidadeEstoque > 0"
            label="Quantidade"
            type="number"
            color="#16db93"
            v-model.number="quantidade"
            :error="!Number.isInteger(quantidade)"
          ></v-text-field>
          <h1 v-else class="mr-8">Esgotado!</h1>
          <v-btn
            dark
            class="ml-1"
            :disabled="
              produto.quantidadeEstoque == 0 ||
              quantidade > produto.quantidadeEstoque ||
              quantidade <= 0 ||
              !Number.isInteger(quantidade)
            "
            style="background-color: #263238; color: #16db93"
            @click="adicionarProdutoPedido(produto)"
            >Adicionar</v-btn
          >
        </v-container>
      </div>
      <!-- </v-card>
    <v-card dark color="#144552" height="150px"> -->
    </v-card>
  </v-flex>
</template>

<script>
import barramento from "@/barramento";
export default {
  props: {
    produto: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      quantidade: 0,
    };
  },

  updated() {
    barramento.onIsProdutoAdicionado((isAdicionado) => {
      if (isAdicionado) {
        this.$emit("produtoAdicionado", {
          color: "#16db93",
          textAlert: "Produto adicionado no seu pedido",
        });
      } else {
        this.$emit("produtoAdicionado", {
          color: "#FF9100",
          textAlert:
            "Quantidade desse produto já adicionada, mais essa quantidade a ser adicionada, ultrapassa a quantidade contida no estoque!",
        });
      }
    });
  },

  methods: {
    adicionarProdutoPedido(produto) {
      const itemPedido = {
        idPedido: 0,
        idProduto: produto.id,
        descricao: produto.descricao,
        quantidade: this.quantidade,
      };
      this.quantidade = 0;
      this.$store.dispatch("adicionarProdutoPedido", {
        itemPedido: itemPedido,
        qtdProdutoMax: produto.quantidadeEstoque,
      });
    },
    editarProduto(produto) {
      this.$emit("produtoSelecionado", produto);
    },
    deletarProduto(produto) {
      this.$emit("deletarProduto", produto);
    },
  },
};
</script>

<style>
</style>