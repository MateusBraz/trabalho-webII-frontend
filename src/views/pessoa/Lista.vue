<template>
  <div>
    <v-data-table
      style="color: #144552"
      :headers="headers"
      :items="pessoas"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon color="#16db93" small class="mr-2" @click="editarUsuario(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="#16db93" small @click="deletarUsuario(item)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <!-- <span class="headline">Usuário</span> -->
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-card
                  ref="form"
                  @keydown.enter="submeter"
                  elevation="0"
                  width="100%"
                  class="white--text"
                >
                  <v-row>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-text-field
                        ref="pessoaNome"
                        v-model.lazy.trim="pessoaNome"
                        :rules="[() => !!pessoaNome || 'Campo Obrigatório!']"
                        outlined
                        label="Novo nome"
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
                        label="Novo apelido"
                        color="#16db93"
                        background-color="white"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-text-field
                        ref="pessoaDataNascimento"
                        v-model.lazy.trim="pessoaDataNascimento"
                        :rules="[
                          () => !!pessoaDataNascimento || 'Campo Obrigatório!',
                        ]"
                        outlined
                        label="Nova data Nascimento"
                        color="#16db93"
                        background-color="white"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-text-field
                        ref="pessoaRg"
                        v-model.lazy.trim="pessoaRg"
                        :rules="[() => !!pessoaRg || 'Campo Obrigatório!']"
                        outlined
                        label="Novo RG"
                        color="#16db93"
                        background-color="white"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-text-field
                        ref="pessoaCpf"
                        v-model.lazy.trim="pessoaCpf"
                        :rules="[() => !!pessoaCpf || 'Campo Obrigatório!']"
                        outlined
                        label="Novo CPF"
                        color="#16db93"
                        background-color="white"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-text-field
                        ref="pessoaCnpj"
                        v-model.lazy.trim="pessoaCnpj"
                        :rules="[() => !!pessoaCnpj || 'Campo Obrigatório!']"
                        outlined
                        label="Novo CNPJ"
                        color="#16db93"
                        background-color="white"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        color="#16db93"
                        :items="itemsSituacao"
                        ref="situacao"
                        v-model="pessoaSituacao"
                        label="Situacao"
                        outlined
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card>
              </v-row>
            </v-container>
          </v-card-text>
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
                    <v-icon color="#144552">mdi-refresh</v-icon>
                  </div>
                </v-btn>
              </template>
              <span>Resetar Formulário</span>
            </v-tooltip>
            <v-btn color="#FB8C00" text @click="fecharDialog">Fechar</v-btn>
            <v-btn color="#16db93" text @click="submeter">Atualizar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  created() {
    this.$http
      .get(
        `/pessoa?idResponsavel=${this.params.idResponsavel}&nomeResponsavel=${this.params.nomeResponsavel}&tipo=${this.params.tipo}&situacao=${this.params.situacao}`,
        {
          headers: {
            login: this.$store.user.login,
            senha: this.$store.user.senha,
          },
        }
      )
      .then((response) => {
        this.pessoas = response.data;
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  },
  data() {
    return {
      params: {
        idResponsavel: 1,
        nomeResponsavel: "",
        tipo: "",
        situacao: "",
      },
      pessoaResposta: {},
      idPessoa: null,
      mostrar: false,
      pessoaNome: null,
      pessoaApelido: null,
      pessoaRg: null,
      pessoaCpf: null,
      pessoaCnpj: null,
      pessoaSituacao: null,
      pessoaDataNascimento: null,

      formularioPossuiErros: false,
      dialog: false,
      itemsSituacao: ["ATIVO", "INATIVO"],
      headers: [
        // {
        //   text: "ID",
        //   align: "center",
        //   sortable: false,
        //   value: "id",
        // },
        { text: "Nome", value: "nome" },
        { text: "Tipo", value: "tipo" },
        { text: "Apelido", value: "apelido" },
        { text: "Data Nascimento", value: "dataNascimento" },
        { text: "RG", value: "rg" },
        { text: "CPF", value: "cpf" },
        { text: "CNPJ", value: "cnpj" },
        { text: "Responsável", value: "idResponsavel.nome" },
        { text: "Situacao", value: "situacao" },
        { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
      pessoas: [],
    };
  },
  computed: {
    form() {
      return {
        pessoaNome: this.pessoaNome,
        pessoaApelido: this.pessoaApelido,
        pessoaRg: this.pessoaRg,
        pessoaCpf: this.pessoaCpf,
        pessoaCnpj: this.pessoaCnpj,
        pessoaDataNascimento: this.pessoaDataNascimento,
      };
    },
  },
  methods: {
    editarUsuario(pessoa) {
      console.log(pessoa.id);
      this.idPessoa = pessoa.id;
      this.pessoaNome = pessoa.nome;
      this.pessoaApelido = pessoa.apelido;
      this.pessoaDataNascimento = pessoa.dataNascimento;
      this.pessoaRg = pessoa.rg;
      this.pessoaCpf = pessoa.cpf;
      this.pessoaCnpj = pessoa.cnpj;
      this.pessoaSituacao = pessoa.situacao;
      this.dialog = true;
    },
    deletarUsuario(pessoa) {
      this.dialog = true;
      console.log(pessoa);
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
        this.atualizar();
        this.resetarFormulario();
      }
    },
    atualizar() {
      this.$http
        .put(
          `/pessoa/${this.idPessoa}`,
          {
            apelido: this.pessoaApelido,
            cnpj: this.pessoaCnpj,
            cpf: this.pessoaCpf,
            dataNascimento: this.pessoaDataNascimento,
            idResponsavel: 0,
            nome: this.pessoaNome,
            rg: this.pessoaRg,
            situacao: this.pessoaSituacao,
          },
          {
            headers: {
              login: this.$store.user.login,
              senha: this.$store.user.senha,
            },
          }
        )
        .then((response) => {
          this.pessoaResposta = response.data;
          this.dialog = false;
          alert("Alterado com sucesso");
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    resetarFormulario() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    fecharDialog() {
      this.dialog = false;
      this.resetarFormulario();
    },
  },
};
</script>

<style>
</style>