<template>
  <v-row>
    <Alert
      :alert="alert"
      @fecharAlert="alert = $event"
      :text="textAlert"
      :color="color"
    />
    <v-card
      ref="form"
      @keydown.enter="submeter"
      width="100%"
      class="white--text"
    >
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
            :return-value.sync="pessoaDataNascimento"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="pessoaDataNascimento"
                label="Data nascimento"
                prepend-icon="mdi-calendar"
                color="#16db93"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
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
            :rules="[() => !!responsavelSelecionado || 'Campo Obrigatório!']"
            color="#16db93"
            :items="pessoas"
            v-model="responsavelSelecionado"
            label="Selecione um responsável"
            outlined
          ></v-select>
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
  </v-row>
</template>

<script>
import Alert from "@/components/Alert.vue";
export default {
  components: {
    Alert,
  },
  created() {
    this.$http
      .get(`/pessoa/buscarTodos`, {
        headers: {
          login: this.$store.user.login,
          senha: this.$store.user.senha,
        },
      })
      .then((response) => {
        this.pessoas = response.data.map(
          (pessoa) => `${pessoa.id}/${pessoa.nome}`
        );
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  },
  data: () => ({
    color: "",
    alert: false,
    textAlert: "",
    modal: false,
    responsavelSelecionado: null,
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
    itemsTipo: ["FISICA", "JURIDICA"],
    itemsSituacao: ["ATIVO", "INATIVO"],
    pessoas: [],
    dataMaxPermitida: new Date(
      new Date().valueOf() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10),
    pessoaDataNascimento: new Date(
      new Date().valueOf() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10),
  }),
  computed: {
    form() {
      if (this.pessoaTipo == null) {
        return {
          pessoaTipo: this.pessoaTipo,
          pessoaNome: this.pessoaNome,
          pessoaApelido: this.pessoaApelido,
          pessoaSituacao: this.pessoaSituacao,
        };
      }
      if (this.pessoaTipo === "FISICA" && this.menorIdade) {
        return {
          pessoaTipo: this.pessoaTipo,
          pessoaNome: this.pessoaNome,
          pessoaApelido: this.pessoaApelido,
          pessoaRg: this.pessoaRg,
          pessoaCpf: this.pessoaCpf,
          pessoaSituacao: this.pessoaSituacao,
          responsavelSelecionado: this.responsavelSelecionado,
        };
      }
      if (this.pessoaTipo === "FISICA") {
        return {
          pessoaTipo: this.pessoaTipo,
          pessoaNome: this.pessoaNome,
          pessoaApelido: this.pessoaApelido,
          pessoaRg: this.pessoaRg,
          pessoaCpf: this.pessoaCpf,
          pessoaSituacao: this.pessoaSituacao,
        };
      }
      return {
        pessoaTipo: this.pessoaTipo,
        pessoaNome: this.pessoaNome,
        pessoaApelido: this.pessoaApelido,
        pessoaCnpj: this.pessoaCnpj,
        pessoaSituacao: this.pessoaSituacao,
      };
    },
    menorIdade() {
      const idade = this.getIdade(this.pessoaDataNascimento);
      if (idade < 18) {
        return true;
      }
      return false;
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
        this.cadastrarPessoa();
      }
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
    cadastrarPessoa() {
      this.$http
        .post(
          `/pessoa`,
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
            tipo: this.pessoaTipo,
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
  },
};
</script>