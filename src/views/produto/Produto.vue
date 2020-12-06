<template>
  <v-flex class="pr-3 pb-3" xs12 md6 lg4>
    <Alert
      :alert="alert"
      @fecharAlert="alert = $event"
      :text="textAlert"
      :color="color"
    />

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
    </v-card>
    <v-card height="150px">
      <v-container fill-height>
        <v-text-field
          v-if="produto.quantidadeEstoque > 0"
          label="Quantidade"
          type="number"
          v-model.number="quantidade"
          :error="!Number.isInteger(quantidade)"
        ></v-text-field>
        <h1 v-else>Esgotado!</h1>
        <v-btn
          class="ml-1"
          :disabled="
            produto.quantidadeEstoque == 0 ||
            quantidade > produto.quantidadeEstoque ||
            quantidade <= 0 ||
            !Number.isInteger(quantidade)
          "
          style="background-color: #144552; color: #16db93"
          @click="adicionarProdutoPedido(produto)"
          >Adicionar</v-btn
        >
      </v-container>
    </v-card>
  </v-flex>
</template>

<script>
import Alert from "@/components/Alert.vue";
export default {
  components: {
    Alert,
  },

  props: {
    produto: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      color: "",
      alert: false,
      textAlert: "",

      quantidade: 0,
    };
  },

  methods: {
    adicionarProdutoPedido(produto) {
      const itemPedido = {
        idPedido: 0,
        idProduto: produto.id,
        quantidade: this.quantidade,
      };
      this.quantidade = 0;
      const isAdicionado = this.$store.dispatch("adicionarProdutoPedido", {
        itemPedido: itemPedido,
        qtdProdutoMax: produto.quantidadeEstoque,
      });
      if (isAdicionado) {
        this.color = "#16db93";
        this.textAlert = "Produto adicionado no seu pedido";
        this.alert = true;
      } else {
        this.color = "#FF9100";
        this.textAlert =
          "quantidade de produtos adicionados atingiu o limite máximo do estoque!";
        this.alert = true;
      }
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