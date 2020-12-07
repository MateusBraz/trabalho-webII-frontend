<template>
  <v-row>
    <Alert
      :alert="alert"
      @fecharAlert="alert = $event"
      :text="textAlert"
      :color="color"
    />

    <v-card
      dark
      style="background-color: #144552"
      ref="form"
      @keydown.enter="submeter"
      width="100%"
      color="#144552"
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
              () => !!precoCompra || 'Campo Obrigatório, e apenas números!',
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
                !!precoVendaFisica || 'Campo Obrigatório, e apenas números!',
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
                !!precoVendaJuridica || 'Campo Obrigatório, e apenas números!',
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
            :rules="[() => !!quantidadeEstoque || 'Campo Obrigatório!']"
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
        <v-btn color="#16db93" text @click="submeter">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
import Alert from "@/components/Alert.vue";
export default {
  components: {
    Alert,
  },
  data: () => {
    return {
      formularioPossuiErros: false,
      alert: false,
      textAlert: "",
      color: "",

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
  },
  methods: {
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
        this.cadastrarProduto();
      }
    },
    cadastrarProduto() {
      this.$http
        .post(
          `/produto`,
          {
            descricao: this.descricao,
            idadePermitida: parseInt(this.idadePermitida),
            precoCompra: this.getRemoveMascaraReal(this.precoCompra),
            precoVendaFisica: this.getRemoveMascaraReal(this.precoVendaFisica),
            precoVendaJuridica: this.getRemoveMascaraReal(
              this.precoVendaJuridica
            ),
            quantidadeEstoque: parseInt(this.quantidadeEstoque),
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
          this.textAlert = "Cadastrado com sucesso";
          this.alert = true;
        })
        .catch((error) => {
          this.color = "#FF9100";
          this.textAlert = error.response.data.message;
          this.alert = true;
        });
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