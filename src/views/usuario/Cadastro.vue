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
      <v-row class="pa-4">
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            ref="usuario"
            v-model.lazy.trim="usuario"
            :rules="[() => !!usuario || 'Campo Obrigatório!']"
            outlined
            label="Login"
            color="#16db93"
            background-color="white"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            ref="senha"
            v-model.lazy.trim="senha"
            :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[() => !!senha || 'Campo Obrigatório!']"
            :type="mostrar ? 'text' : 'password'"
            outlined
            label="Senha"
            color="#16db93"
            background-color="white"
            @click:append="mostrar = !mostrar"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="6">
          <v-select
            ref="pessoaSelecionada"
            :rules="[() => !!pessoaSelecionada || 'Campo Obrigatório!']"
            color="#16db93"
            :items="opcoesPessoas"
            v-model="pessoaSelecionada"
            label="Selecione uma pessoa"
            outlined
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="6">
          <v-select
            ref="isAdministrador"
            color="#16db93"
            :items="items"
            :rules="[() => !!isAdministrador || 'Campo Obrigatório!']"
            v-model="isAdministrador"
            label="Administrador"
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
        this.opcoesPessoas = response.data.map(
          (pessoa) => `${pessoa.id}/${pessoa.nome}`
        );
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  },
  data() {
    return {
      color: "",
      alert: false,
      textAlert: "",

      mostrar: false,
      usuario: null,
      senha: null,
      pessoaSelecionada: null,
      isAdministrador: null,
      items: [false, true],
      opcoesPessoas: [],
    };
  },
  computed: {
    form() {
      return {
        usuario: this.usuario,
        senha: this.senha,
        pessoaSelecionada: this.pessoaSelecionada,
        isAdministrador: this.isAdministrador,
      };
    },
  },
  methods: {
    submeter() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) {
          this.formularioPossuiErros = true;
          this.$refs[f].validate(true);
        }
      });
      if (this.formularioPossuiErros == false) {
        this.salvar();
      }
    },
    salvar() {
      this.$http
        .post(
          `/usuario`,
          {
            idPessoa: parseInt(`${this.pessoaSelecionada}`.split("/")[0]),
            isAdministrador: this.isAdministrador,
            login: this.usuario,
            senha: this.senha,
          },
          {
            headers: {
              login: this.$store.user.login,
              senha: this.$store.user.senha,
            },
          }
        )
        .then((response) => {
          this.usuarioResposta = response.data;
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
    resetarFormulario() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
  },
};
</script>

<style>
</style>