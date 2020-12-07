<template>
  <v-layout row wrap>
    <Alert
      :alert="alert"
      @fecharAlert="alert = $event"
      :text="textAlert"
      :color="color"
    />

    <v-card
      dark
      style="background-color: #144552"
      ref="formFiltro"
      width="100%"
      elevation="0"
      color="#144552"
      class="white--text mb-2 mr-1 pa-2"
    >
      <v-row class="pa-0">
        <v-col cols="6" sm="4" md="4" lg="4">
          <v-text-field
            ref="precoMinimo"
            v-model.lazy.trim="precoMinimo"
            :rules="[
              () => !!precoMinimo || 'Campo Obrigatório, e apenas números!',
            ]"
            outlined
            label="Preço mínimo"
            color="#16db93"
          ></v-text-field>
        </v-col>

        <v-col cols="6" sm="4" md="4" lg="4">
          <v-text-field
            ref="precoMaximo"
            v-model.lazy.trim="precoMaximo"
            :rules="[
              () => !!precoMaximo || 'Campo Obrigatório, e apenas números!',
            ]"
            outlined
            label="Preço máximo"
            color="#16db93"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4" md="4" lg="4" class="d-flex align-center">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                class="my-0"
                v-bind="attrs"
                @click="resetarFormularioFiltro"
                v-on="on"
              >
                <div>
                  <v-icon color="#16db93">mdi-refresh</v-icon>
                </div>
              </v-btn>
            </template>
            <span>Resetar campos de filtro</span>
          </v-tooltip>
          <v-btn color="#16db93" text @click="submeterFiltro">filtrar</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <Produto
      v-for="produto in produtos"
      :key="produto.id"
      :produto="produto"
      @produtoSelecionado="editarProduto($event)"
      @deletarProduto="deletarProduto($event)"
      @produtoAdicionado="produtoAdicionadoNoPedido"
    />

    <DialogDelete
      :dialogDelete="dialogDelete"
      opcaoDelete="PRODUTO"
      :idElemento="idProduto"
      @dialogDeleteAberto="dialogDelete = $event"
      @delete="operacaoDelete($event)"
    />

    <v-dialog v-model="dialogFormAtualizacoes" persistent max-width="600px">
      <v-card dark style="background-color: #144552">
        <v-card-text>
          <v-container>
            <v-row>
              <v-card
                style="background-color: #144552"
                ref="form"
                @keydown.enter="submeter"
                width="100%"
                elevation="0"
                class="white--text"
              >
                <v-row class="pa-4">
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      ref="descricao"
                      v-model.lazy.trim="descricao"
                      :rules="[() => !!descricao || 'Campo Obrigatório!']"
                      outlined
                      label="Descrição"
                      color="#16db93"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      ref="idadePermitida"
                      v-model.lazy.trim="idadePermitida"
                      v-mask="'###'"
                      :rules="[() => !!idadePermitida || 'Campo Obrigatório!']"
                      outlined
                      label="Idade permitida"
                      color="#16db93"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      ref="precoCompra"
                      v-model.lazy.trim="precoCompra"
                      :rules="[
                        () =>
                          !!precoCompra ||
                          'Campo Obrigatório, e apenas números!',
                      ]"
                      outlined
                      label="Preço compra"
                      color="#16db93"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      ref="precoVendaFisica"
                      v-model.lazy.trim="precoVendaFisica"
                      :rules="[
                        () =>
                          !!precoVendaFisica ||
                          'Campo Obrigatório, e apenas números!',
                      ]"
                      outlined
                      label="Preço venda pessoa física"
                      color="#16db93"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      ref="precoVendaJuridica"
                      v-model.lazy.trim="precoVendaJuridica"
                      :rules="[
                        () =>
                          !!precoVendaJuridica ||
                          'Campo Obrigatório, e apenas números!',
                      ]"
                      outlined
                      label="Preço venda pessoa jurídica"
                      color="#16db93"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="6">
                    <v-text-field
                      ref="quantidadeEstoque"
                      v-model.lazy.trim="quantidadeEstoque"
                      v-mask="'##################'"
                      :rules="[
                        () => !!quantidadeEstoque || 'Campo Obrigatório!',
                      ]"
                      outlined
                      label="Quantidade estoque"
                      color="#16db93"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions>
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
                    <span>Resetar Formulário</span>
                  </v-tooltip>
                  <v-btn color="#FB8C00" text @click="fecharDialog"
                    >Fechar</v-btn
                  >
                  <v-btn color="#16db93" text @click="submeter">Salvar</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Produto from "./Produto.vue";
import Alert from "@/components/Alert.vue";
import DialogDelete from "@/components/DialogDelete.vue";
export default {
  components: {
    Produto,
    Alert,
    DialogDelete,
  },
  created() {
    this.buscarTodos();
  },
  data() {
    return {
      color: "",
      alert: false,
      textAlert: "",

      formularioFiltroPossuiErros: false,
      dialogFormAtualizacoes: false,

      precoMinimo: null,
      precoMaximo: null,

      dialogDelete: false,

      produtos: [],
      produtoResposta: {},
      idProduto: 0,
      descricao: null,
      idadePermitida: null,
      precoCompra: null,
      precoVendaFisica: null,
      precoVendaJuridica: null,
      quantidadeEstoque: null,
    };
  },
  watch: {
    precoCompra() {
      this.precoCompra = this.mascaraReal(`${this.precoCompra}`);
    },
    precoVendaFisica() {
      this.precoVendaFisica = this.mascaraReal(`${this.precoVendaFisica}`);
    },
    precoVendaJuridica() {
      this.precoVendaJuridica = this.mascaraReal(`${this.precoVendaJuridica}`);
    },
    precoMinimo() {
      this.precoMinimo = this.mascaraReal(`${this.precoMinimo}`);
    },
    precoMaximo() {
      this.precoMaximo = this.mascaraReal(`${this.precoMaximo}`);
    },
  },
  computed: {
    form() {
      return {
        descricao: this.descricao,
        idadePermitida: this.idadePermitida,
        precoCompra: this.precoCompra,
        precoVendaFisica: this.precoVendaFisica,
        precoVendaJuridica: this.precoVendaJuridica,
        quantidadeEstoque: this.quantidadeEstoque,
      };
    },
    formFiltro() {
      return {
        precoMinimo: this.precoMinimo,
        precoMaximo: this.precoMaximo,
      };
    },
  },
  methods: {
    buscarTodos() {
      this.$http
        .get(`/produto/buscarTodos`, {
          headers: {
            login: this.$store.user.login,
            senha: this.$store.user.senha,
          },
        })
        .then((response) => {
          this.produtos = response.data;
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    buscarProdutos() {
      this.$http
        .get(
          `/produto?precoMinimo=${this.getRemoveMascaraReal(
            this.precoMinimo
          )}&precoMaximo=${this.getRemoveMascaraReal(this.precoMaximo)}`,
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
    editarProduto(produto) {
      this.idProduto = produto.id;
      this.descricao = produto.descricao;
      this.idadePermitida = produto.idadePermitida;
      this.precoCompra = produto.precoCompra;
      this.precoVendaFisica = produto.precoVendaFisica;
      this.precoVendaJuridica = produto.precoVendaJuridica;
      this.quantidadeEstoque = produto.quantidadeEstoque;
      this.dialogFormAtualizacoes = true;
    },
    deletarProduto(produto) {
      this.idProduto = produto.id;
      this.dialogDelete = true;
    },
    operacaoDelete(resposta) {
      if (resposta.sucesso) {
        this.color = "#16db93";
        this.textAlert = "Excluído com sucesso";
        this.alert = true;
        this.buscarTodos();
      } else {
        this.color = "#FF9100";
        this.textAlert = resposta.messagem;
        this.alert = true;
      }
    },
    resetarFormulario() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
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
        this.atualizarProduto();
      }
    },
    resetarFormularioFiltro() {
      this.formularioFiltroPossuiErros = false;
      Object.keys(this.formFiltro).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    submeterFiltro() {
      this.formularioFiltroPossuiErros = false;
      Object.keys(this.formFiltro).forEach((f) => {
        if (!this.formFiltro[f]) {
          this.formularioFiltroPossuiErros = true;
          this.$refs[f].validate(true);
        }
      });
      if (this.formularioFiltroPossuiErros == false) {
        this.buscarProdutos();
      }
    },
    atualizarProduto() {
      this.$http
        .put(
          `/produto/${this.idProduto}`,
          {
            descricao: this.descricao,
            idadePermitida: this.idadePermitida,
            precoCompra: this.getRemoveMascaraReal(this.precoCompra),
            precoVendaFisica: this.getRemoveMascaraReal(this.precoVendaFisica),
            precoVendaJuridica: this.getRemoveMascaraReal(
              this.precoVendaJuridica
            ),
            quantidadeEstoque: this.quantidadeEstoque,
          },
          {
            headers: {
              login: this.$store.user.login,
              senha: this.$store.user.senha,
            },
          }
        )
        .then((response) => {
          this.produtoResposta = response.data;
          this.dialogFormAtualizacoes = false;
          this.color = "#16db93";
          this.textAlert = "Atualizado com sucesso";
          this.alert = true;
          this.buscarTodos();
        })
        .catch((error) => {
          this.color = "#FF9100";
          this.textAlert = error.response.data.message;
          this.alert = true;
        });
    },
    produtoAdicionadoNoPedido(produtoAdicionadoResposta) {
      this.textAlert = produtoAdicionadoResposta.textAlert;
      this.color = produtoAdicionadoResposta.color;
      this.alert = true;
    },
    fecharDialog() {
      // this.resetarFormulario();
      this.dialogFormAtualizacoes = false;
    },
    mascaraReal(valor) {
      let x = valor;
      x = x.replace(/\D/g, "");
      x = x.replace(/(\d+)(\d{2})/, "$1,$2");
      x = x.replace(/(\d+)(\d{3})(,\d{2})/, "$1.$2$3");
      x = x.replace(/(\d+)(\d{3})(\.\d{3},\d{2})/, "$1.$2$3");
      x = x.replace(/(\d+)(\d{3})(\.\d{3}\.\d{3},\d{2})/, "$1.$2$3");
      return x;
    },
    getRemoveMascaraReal(valor) {
      if (valor === "") {
        return 0;
      }
      const valorSemMascara = parseFloat(
        valor.replace(/\./, "").replace(/,/, ".")
      );
      return valorSemMascara;
    },
  },
};
</script>

<style>
</style>