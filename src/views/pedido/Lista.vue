<template>
  <div>
    <Alert
      :alert="alert"
      @fecharAlert="alert = $event"
      :text="textAlert"
      :color="color"
    />

    <DialogDelete
      :dialogDelete="dialogDelete"
      opcaoDelete="PEDIDO"
      :idElemento="idPedido"
      @dialogDeleteAberto="dialogDelete = $event"
      @delete="operacaoDelete($event)"
    />

    <v-data-table
      dark
      style="background-color: #144552"
      :headers="headers"
      :items="pedidos"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          color="#16db93"
          small
          class="mr-2"
          @click="mostrarDetalhes(item)"
          >mdi-information</v-icon
        >
        <v-icon color="#16db93" small @click="cancelarPedido(item)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDetalhe" persistent max-width="600px">
      <v-card elevation="0" dark style="background-color: #144552">
        <v-card-title style="color: #16db93"> PRODUTOS DO PEDIDO</v-card-title>
        <v-card-text>
          <v-container>
            <v-data-table
              dark
              style="background-color: #144552"
              :headers="headersItemPedido"
              :items="pedidoSelecionado.itemPedidoList"
              :items-per-page="5"
              class="elevation-1"
            >
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#FB8C00" text @click="fecharDialog">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import DialogDelete from "@/components/DialogDelete.vue";
export default {
  components: {
    Alert,
    DialogDelete,
  },
  created() {
    this.buscarPedidos();
  },
  data() {
    return {
      color: "",
      alert: false,
      textAlert: "",

      dialogDelete: false,
      idPedido: 0,

      dialogDetalhe: false,
      pedidoSelecionado: {},
      pedidos: [],
      headers: [
        {
          text: "ID",
          align: "center",
          sortable: false,
          value: "id",
        },
        { text: "Pessoa", value: "pessoaNome" },
        { text: "Data compra", value: "dataCompra" },
        { text: "Data entrega", value: "dataEntrega" },
        { text: "Percentual desconto", value: "percentualDesconto" },
        { text: "Status", value: "status" },
        { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
      headersItemPedido: [
        { text: "Produto", value: "descricaoProduto" },
        { text: "Quantidade", value: "quantidade" },
      ],
    };
  },
  methods: {
    mostrarDetalhes(pedido) {
      this.pedidoSelecionado = pedido;
      this.dialogDetalhe = true;
    },
    fecharDialog() {
      this.pedidoSelecionado = {};
      this.dialogDetalhe = false;
    },
    buscarPedidos() {
      this.$http
        .get(`/pedido`, {
          headers: {
            login: this.$store.user.login,
            senha: this.$store.user.senha,
          },
        })
        .then((response) => {
          this.pedidos = response.data;
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    cancelarPedido(pedido) {
      this.idPedido = pedido.id;
      this.dialogDelete = true;
    },
    operacaoDelete(resposta) {
      if (resposta.sucesso) {
        this.color = "#16db93";
        this.textAlert = "Pedido cancelado com sucesso";
        this.alert = true;
        this.buscarPedidos();
      } else {
        this.color = "#FF9100";
        this.textAlert = resposta.mensagem;
        this.alert = true;
      }
    },
  },
};
</script>

<style>
</style>