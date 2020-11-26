<template>
  <div>
    <v-data-table
      style="color: #144552"
      :headers="headers"
      :items="usuarios"
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
                  <v-text-field
                    ref="usuario"
                    v-model.lazy.trim="usuario"
                    :rules="[() => !!usuario || 'Campo Obrigatório!']"
                    outlined
                    label="Novo Login"
                    color="#16db93"
                    background-color="white"
                  ></v-text-field>

                  <v-text-field
                    ref="senha"
                    v-model.lazy.trim="senha"
                    :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[() => !!senha || 'Campo Obrigatório!']"
                    :type="mostrar ? 'text' : 'password'"
                    outlined
                    label="Nova senha"
                    color="#16db93"
                    background-color="white"
                    @click:append="mostrar = !mostrar"
                  ></v-text-field>

                  <v-select
                    color="#16db93"
                    :items="items"
                    ref="administrador"
                    v-model="isAdministrador"
                    label="Administrador"
                    outlined
                  ></v-select>

                  <v-col align="center">
                    <div>
                      <v-slide-x-reverse-transition>
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
                      </v-slide-x-reverse-transition>
                    </div>
                  </v-col>
                </v-card>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
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
      .get("/usuario", {
        headers: {
          login: this.$store.user.login,
          senha: this.$store.user.senha,
        },
      })
      .then((response) => {
        this.usuarios = response.data;
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  },
  data() {
    return {
      usuarioResposta: {},
      idUsuario: null,
      isAdministrador: null,
      idPessoa: null,
      mostrar: false,
      usuario: "",
      senha: "",
      formularioPossuiErros: false,
      dialog: false,
      items: [false, true],
      headers: [
        {
          text: "Login",
          align: "start",
          sortable: false,
          value: "login",
        },
        // { text: "Id Pessoa", value: "pessoaId" },
        { text: "Pessoa", value: "pessoaNome" },
        { text: "Administrador", value: "isAdministrador" },
        { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
      usuarios: [],
    };
  },
  computed: {
    form() {
      return {
        usuario: this.usuario,
        senha: this.senha,
      };
    },
  },
  methods: {
    editarUsuario(usuario) {
      console.log(usuario.id);
      this.idUsuario = usuario.id;
      this.usuario = usuario.login;
      this.idPessoa = usuario.pessoaId;
      this.isAdministrador = usuario.isAdministrador;
      this.dialog = true;
    },
    deletarUsuario(usuario) {
      this.dialog = true;
      console.log(usuario);
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
          `/usuario/${this.idUsuario}`,
          {
            id: this.idUsuario,
            login: this.usuario,
            senha: this.senha,
            isAdministrador: this.isAdministrador,
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