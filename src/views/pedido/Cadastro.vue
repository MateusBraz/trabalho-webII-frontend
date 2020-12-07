<template>
  <div>
    <Alert
      :alert="alert"
      @fecharAlert="alert = $event"
      :text="textAlert"
      :color="color"
    />
    <v-card
      dark
      ref="form"
      color="#144552"
      @keydown.enter="submeter"
      width="100%"
      class="white--text"
    >
      <v-row class="pa-4">
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dataEntrega"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <div class="input-data">
                <v-text-field
                  ref="dataEntrega"
                  v-model="dataEntrega"
                  label="Data entrega"
                  prepend-icon="mdi-calendar"
                  color="#16db93"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </div>
            </template>
            <v-date-picker
              dark
              style="background-color: #144552"
              color="#144552"
              :min="dataMinPermitida"
              v-model="dataEntrega"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="#FB8C00" @click="modal = false">
                Fechar
              </v-btn>
              <v-btn
                text
                color="#16db93"
                @click="$refs.dialog.save(dataEntrega)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            ref="percentualDesconto"
            v-model.lazy.trim="percentualDesconto"
            v-mask="'#######'"
            :rules="[() => !!percentualDesconto || 'Campo Obrigatório!']"
            outlined
            label="Percentual desconto"
            color="#16db93"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        dark
        style="background-color: #144552"
        :headers="headers"
        :items="pedido"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="#16db93" small @click="deletarItemPedido(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>

      <v-row class="pa-4">
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              class="my-0"
              v-bind="attrs"
              @click="resetarFormulario"
              v-on="on"
            >
              <div>
                <v-icon color="#16db93">mdi-refresh</v-icon>
              </div>
            </v-btn>
          </template>
          <span>Limpar Pedido</span>
        </v-tooltip>
        <v-btn
          color="#16db93"
          :disabled="pedido.length == 0"
          text
          @click="submeter"
          >Salvar</v-btn
        >
      </v-row>
    </v-card>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
export default {
  components: {
    Alert,
  },
  created() {
    this.atualizarPedido();
  },
  data() {
    return {
      formularioPossuiErros: false,
      modal: false,
      dataEntrega: new Date(
        new Date().valueOf() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),

      dataMinPermitida: new Date(
        new Date().valueOf() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),

      percentualDesconto: null,

      color: "#16db93",
      alert: false,
      textAlert: "produto removido do seu pedido",

      pedido: [],
      headers: [
        { text: "ID produto", value: "idProduto" },
        { text: "Descrição", value: "descricao" },
        { text: "quantidade", value: "quantidade" },
        { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
    };
  },
  computed: {
    form() {
      return {
        dataEntrega: this.dataEntrega,
        percentualDesconto: this.percentualDesconto,
      };
    },
  },
  methods: {
    resetarFormulario() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
      this.limparPedido();
    },
    submeter() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) {
          this.formularioPossuiErros = true;
          this.$refs[f].validate(true);
        }
      });
      if (this.formularioPossuiErros == false) {
        this.cadastrarPedido();
      }
    },
    deletarItemPedido(itemPedido) {
      this.$store.dispatch("deletarItemPedido", itemPedido);
      this.atualizarPedido();
      this.alert = true;
    },
    atualizarPedido() {
      if (JSON.parse(localStorage.getItem("pedido")) == null) {
        this.pedido = [];
        return;
      }
      this.pedido = JSON.parse(localStorage.getItem("pedido"));
    },
    limparPedido() {
      localStorage.removeItem("pedido");
      this.pedido = [];
    },
    cadastrarPedido() {
      console.log(JSON.parse(localStorage.getItem("pedido")));
      this.$http
        .post(
          `/pedido`,
          {
            dataEntrega: this.dataEntrega,
            itemPedidoList: JSON.parse(localStorage.getItem("pedido")),
            percentualDesconto: this.percentualDesconto,
            status: "REALIZADO",
          },
          {
            headers: {
              login: this.$store.user.login,
              senha: this.$store.user.senha,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.resetarFormulario();
          this.color = "#16db93";
          this.textAlert = "Cadastro de pedido realizado com sucesso";
          this.alert = true;
        })
        .catch((error) => {
          this.color = "#FF9100";
          this.textAlert = error.response.data.message;
          this.alert = true;
        });
    },
  },
};
</script>

<style>
.input-data {
  background-color: #144552;
  padding-top: 6px;
  border-style: solid;
  border-width: 1px;
  border-color: #9e9e9e;
  border-radius: 4px 4px 4px 4px;
  height: 56px;
}
</style>