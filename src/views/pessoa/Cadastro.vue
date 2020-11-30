<template>
  <v-card ref="form" @keydown.enter="submeter" width="100%" class="white--text">
    <!-- color="#144552" -->
    <v-row class="pa-4">
      <v-col cols="12" sm="6" md="6" lg="6">
        <v-select
          ref="pessoaTipo"
          :rules="[() => !!pessoaTipo || 'Campo Obrigatório!']"
          color="#16db93"
          :items="itemsTipo"
          v-model="pessoaTipo"
          background-color="white"
          label="Tipo"
          outlined
        ></v-select>
      </v-col>

      <v-col cols="12" sm="6" md="6" lg="6">
        <v-text-field
          ref="pessoaNome"
          v-model.lazy.trim="pessoaNome"
          :rules="[() => !!pessoaNome || 'Campo Obrigatório!']"
          outlined
          label="Nome"
          color="#16db93"
          background-color="white"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6" lg="6">
        <v-text-field
          ref="pessoaApelido"
          v-model.lazy.trim="pessoaApelido"
          :rules="[() => !!pessoaApelido || 'Campo Obrigatório!']"
          outlined
          label="Apelido"
          color="#16db93"
          background-color="white"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6" lg="6">
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Data nascimento"
              prepend-icon="mdi-calendar"
              color="#16db93"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker color="#144552" v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="#FB8C00" @click="modal = false"> Fechar </v-btn>
            <v-btn text color="#16db93" @click="$refs.dialog.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <!-- <v-text-field
          ref="pessoaDataNascimento"
          v-model.lazy.trim="pessoaDataNascimento"
          v-mask="'##/##/####'"
          :rules="[
            () =>
              (!!pessoaDataNascimento && pessoaDataNascimento.length >= 10) ||
              'Campo Obrigatório!',
          ]"
          outlined
          label="Data Nascimento"
          color="#16db93"
          background-color="white"
        ></v-text-field> -->
      </v-col>
      <v-col v-if="pessoaTipo === 'FISICA'" cols="12" sm="6" md="6" lg="6">
        <v-text-field
          ref="pessoaRg"
          v-model.lazy.trim="pessoaRg"
          v-mask="'#########################'"
          :rules="[() => !!pessoaRg || 'Campo Obrigatório!']"
          outlined
          label="RG"
          color="#16db93"
          background-color="white"
        ></v-text-field>
      </v-col>
      <v-col v-if="pessoaTipo === 'FISICA'" cols="12" sm="6" md="6" lg="6">
        <v-text-field
          ref="pessoaCpf"
          v-model.lazy.trim="pessoaCpf"
          v-mask="'###.###.###-##'"
          :rules="[
            () =>
              (!!pessoaCpf && pessoaCpf.length >= 14) || 'Campo Obrigatório!',
          ]"
          outlined
          label="CPF"
          color="#16db93"
          background-color="white"
        ></v-text-field>
      </v-col>
      <v-col v-if="pessoaTipo === 'JURIDICA'" cols="12" sm="6" md="6" lg="6">
        <v-text-field
          ref="pessoaCnpj"
          v-model.lazy.trim="pessoaCnpj"
          v-mask="'##.###.###/####-##'"
          :rules="[
            () =>
              (!!pessoaCnpj && pessoaCnpj.length >= 18) || 'Campo Obrigatório!',
          ]"
          outlined
          label="CNPJ"
          color="#16db93"
          background-color="white"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6" lg="6">
        <v-select
          ref="pessoaSituacao"
          :rules="[() => !!pessoaSituacao || 'Campo Obrigatório!']"
          color="#16db93"
          :items="itemsSituacao"
          v-model="pessoaSituacao"
          label="Situacao"
          outlined
        ></v-select>
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
</template>

<script>
export default {
  created() {
    // console.log(new Date(2020, 11, 29));
    // console.log(new Date());
    const data1 = new Date();
    const data2 = new Date(1996, 3, 9);
    const diferenca = Math.abs(data1.getTime() - data2.getTime());
    console.log("aaaaaaaaa" + diferenca);
  },
  data: () => ({
    modal: false,
    date: new Date().toISOString().substr(0, 10),
    // date: new Date().toISOString().substr(0, 10),
    // dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    pessoaResposta: {},
    menu1: false,
    mostrar: false,
    pessoaTipo: null,
    pessoaNome: null,
    pessoaApelido: null,
    pessoaRg: null,
    pessoaCpf: null,
    pessoaCnpj: null,
    pessoaSituacao: null,
    pessoaDataNascimento: null,
    itemsTipo: ["FISICA", "JURIDICA"],
    itemsSituacao: ["ATIVO", "INATIVO"],
  }),
  computed: {
    form() {
      if (this.pessoaTipo == null) {
        return {
          pessoaTipo: this.pessoaTipo,
          pessoaNome: this.pessoaNome,
          pessoaApelido: this.pessoaApelido,
          pessoaDataNascimento: this.pessoaDataNascimento,
          pessoaSituacao: this.pessoaSituacao,
        };
      }
      return this.pessoaTipo === "FISICA"
        ? {
            pessoaTipo: this.pessoaTipo,
            pessoaNome: this.pessoaNome,
            pessoaApelido: this.pessoaApelido,
            pessoaRg: this.pessoaRg,
            pessoaCpf: this.pessoaCpf,
            pessoaDataNascimento: this.pessoaDataNascimento,
            pessoaSituacao: this.pessoaSituacao,
          }
        : {
            pessoaTipo: this.pessoaTipo,
            pessoaNome: this.pessoaNome,
            pessoaApelido: this.pessoaApelido,
            pessoaCnpj: this.pessoaCnpj,
            pessoaDataNascimento: this.pessoaDataNascimento,
            pessoaSituacao: this.pessoaSituacao,
          };
    },
    // menorIdade() {
    //   if (this.pessoaDataNascimento.length == 10) {
    //     const date = new Date();
    //   }
    // },
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
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
        // this.atualizar();
        // this.resetarFormulario();
      }
    },
    formatDateYYYYmmDD(date) {
      const d = new Date(date);
      let month = `${d.getMonth() + 1}`;
      let day = `${d.getDate()}`;
      const year = d.getFullYear();

      if (month.length < 2) month = `0${month}`;
      if (day.length < 2) day = `0${day}`;

      return [year, month, day].join("-");
    },
    // formatDate(date) {
    //   if (!date) return null;

    //   const [year, month, day] = date.split("-");
    //   return `${day}/${month}/${year}`;
    // },
  },
};
</script>

<style>
</style>