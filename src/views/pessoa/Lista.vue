<template>
  <div>
    <Alert
      :alert="alert"
      @fecharAlert="alert = $event"
      :text="textAlert"
      :color="color"
    />
    <v-data-table
      style="color: #144552"
      :headers="headers"
      :items="pessoas"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon color="#16db93" small class="mr-2" @click="editarPessoa(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="#16db93" small @click="deletarPessoa(item)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>

    <v-row justify="center">
      <DialogDelete
        :dialogDelete="dialogDelete"
        opcaoDelete="PESSOA"
        :idElemento="idPessoa"
        @dialogDeleteAberto="dialogDelete = $event"
        @delete="operacaoDelete($event)"
      />

      <v-dialog v-model="dialogFormAtualizacoes" persistent max-width="600px">
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
                  width="100%"
                  class="white--text"
                >
                  <!-- color="#144552" -->
                  <v-row class="pa-4">
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
                        :return-value.sync="pessoaDataNascimento"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div class="input-data mb-2">
                            <v-text-field
                              ref="pessoaDataNascimento"
                              v-model="pessoaDataNascimento"
                              label="Data nascimento"
                              prepend-icon="mdi-calendar"
                              color="#16db93"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </div>
                        </template>
                        <v-date-picker
                          color="#144552"
                          :max="dataMaxPermitida"
                          v-model="pessoaDataNascimento"
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="#FB8C00" @click="modal = false">
                            Fechar
                          </v-btn>
                          <v-btn
                            text
                            color="#16db93"
                            @click="$refs.dialog.save(pessoaDataNascimento)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>

                    <!-- ref="pessoaSituacao" -->
                    <v-col
                      v-if="pessoaTipo === 'FISICA' && menorIdade"
                      cols="12"
                      sm="6"
                      md="6"
                      lg="6"
                    >
                      <v-select
                        ref="responsavelSelecionado"
                        :rules="[
                          () =>
                            !!responsavelSelecionado || 'Campo Obrigatório!',
                        ]"
                        color="#16db93"
                        :items="opcoesResponsaveis"
                        v-model="responsavelSelecionado"
                        label="Selecione um responsável"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col
                      v-if="pessoaTipo === 'FISICA'"
                      cols="12"
                      sm="6"
                      md="6"
                      lg="6"
                    >
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
                    <v-col
                      v-if="pessoaTipo === 'FISICA'"
                      cols="12"
                      sm="6"
                      md="6"
                      lg="6"
                    >
                      <v-text-field
                        ref="pessoaCpf"
                        v-model.lazy.trim="pessoaCpf"
                        v-mask="'###.###.###-##'"
                        :rules="[
                          () =>
                            (!!pessoaCpf && pessoaCpf.length >= 14) ||
                            'Campo Obrigatório!',
                        ]"
                        outlined
                        label="CPF"
                        color="#16db93"
                        background-color="white"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      v-if="pessoaTipo === 'JURIDICA'"
                      cols="12"
                      sm="6"
                      md="6"
                      lg="6"
                    >
                      <v-text-field
                        ref="pessoaCnpj"
                        v-model.lazy.trim="pessoaCnpj"
                        v-mask="'##.###.###/####-##'"
                        :rules="[
                          () =>
                            (!!pessoaCnpj && pessoaCnpj.length >= 18) ||
                            'Campo Obrigatório!',
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
                        :rules="[
                          () => !!pessoaSituacao || 'Campo Obrigatório!',
                        ]"
                        color="#16db93"
                        :items="itemsSituacao"
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
import DialogDelete from "@/components/DialogDelete.vue";
import Alert from "@/components/Alert.vue";
export default {
  components: {
    DialogDelete,
    Alert,
  },
  created() {
    this.buscarTodos();
  },
  data() {
    return {
      modal: false,
      dataMaxPermitida: new Date(
        new Date().valueOf() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),

      dialogDelete: false,

      color: "",
      alert: false,
      textAlert: "",

      params: {
        idResponsavel: 1,
        nomeResponsavel: "",
        tipo: "",
        situacao: "",
      },
      responsavelSelecionado: null,
      menorIdade: false,
      pessoaTipo: null,
      pessoaResposta: {},
      idPessoa: 0,
      mostrar: false,
      pessoaNome: null,
      pessoaApelido: null,
      pessoaRg: null,
      pessoaCpf: null,
      pessoaCnpj: null,
      pessoaSituacao: null,
      pessoaDataNascimento: null,

      formularioPossuiErros: false,
      dialogFormAtualizacoes: false,
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
      opcoesResponsaveis: [],
    };
  },
  watch: {
    pessoaDataNascimento() {
      this.menorIdade = this.verificarMenorIdade(this.pessoaDataNascimento);
    },
  },
  computed: {
    form() {
      if (this.pessoaTipo === "FISICA" && this.menorIdade) {
        return {
          pessoaNome: this.pessoaNome,
          pessoaApelido: this.pessoaApelido,
          pessoaRg: this.pessoaRg,
          pessoaCpf: this.pessoaCpf,
          pessoaDataNascimento: this.pessoaDataNascimento,
          responsavelSelecionado: this.responsavelSelecionado,
          pessoaSituacao: this.pessoaSituacao,
        };
      } else if (this.pessoaTipo === "FISICA") {
        return {
          pessoaNome: this.pessoaNome,
          pessoaApelido: this.pessoaApelido,
          pessoaRg: this.pessoaRg,
          pessoaCpf: this.pessoaCpf,
          pessoaDataNascimento: this.pessoaDataNascimento,
          pessoaSituacao: this.pessoaSituacao,
        };
      }
      return {
        pessoaNome: this.pessoaNome,
        pessoaApelido: this.pessoaApelido,
        pessoaCnpj: this.pessoaCnpj,
        pessoaDataNascimento: this.pessoaDataNascimento,
        pessoaSituacao: this.pessoaSituacao,
      };
    },
  },
  methods: {
    editarPessoa(pessoa) {
      this.menorIdade = this.verificarMenorIdade(pessoa.dataNascimento);
      if (this.menorIdade) {
        this.setarResponsavel(pessoa.idResponsavel.id);
      }
      this.pessoaTipo = pessoa.tipo;
      this.idPessoa = pessoa.id;
      this.pessoaNome = pessoa.nome;
      this.pessoaApelido = pessoa.apelido;
      this.pessoaDataNascimento = pessoa.dataNascimento;
      this.pessoaRg = pessoa.rg;
      this.pessoaCpf = pessoa.cpf;
      this.pessoaCnpj = pessoa.cnpj;
      this.pessoaSituacao = pessoa.situacao;
      this.dialogFormAtualizacoes = true;
    },
    deletarPessoa(pessoa) {
      this.idPessoa = pessoa.id;
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
            idResponsavel: parseInt(
              `${this.responsavelSelecionado}`.split("/")[0]
            ),
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
    resetarFormulario() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    fecharDialog() {
      this.dialogFormAtualizacoes = false;
      this.resetarFormulario();
    },
    buscarTodos() {
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
          this.opcoesResponsaveis = this.pessoas.map(
            (pessoa) => `${pessoa.id}/${pessoa.nome}`
          );
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    convertDateMMDDYYY(datearray) {
      return datearray[2] + "-" + datearray[1] + "-" + datearray[0];
    },
    getIdade(data) {
      var hoje = new Date(
        new Date().valueOf() - new Date().getTimezoneOffset() * 60000
      );

      var nascimento = new Date(this.convertDateMMDDYYY(data.split("/")));
      //Retorna a diferença entre hoje e a data de nascimento em anos.
      var ano = hoje.getFullYear() - nascimento.getFullYear();

      //Retorna a diferença de mês do mês de nascimento para o atual.
      var m = hoje.getMonth() - nascimento.getMonth();

      //Caso ainda não tenha ultrapassado o dia e o mês
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        ano--;
      }
      return ano;
    },
    verificarMenorIdade(dataNascimento) {
      const idade = this.getIdade(dataNascimento);
      if (idade < 18) {
        return true;
      }
      return false;
    },
    setarResponsavel(idResponsavel) {
      const filtro = this.pessoas.filter((pessoa) => {
        return pessoa.id === idResponsavel;
      });
      this.responsavelSelecionado = `${filtro[0].id}/${filtro[0].nome}`;
    },
  },
};
</script>

<style>
.input-data {
  border-style: solid;
  border-width: 1px;
  border-color: #9e9e9e;
  border-radius: 4px 4px 4px 4px;
  height: 56px;
}
</style>