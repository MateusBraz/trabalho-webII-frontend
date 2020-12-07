<template>
  <v-row align="center" justify="center" style="background-color: #263238">
    <transition
      enter-active-class="animate__animated animate__backInDown"
      appear
    >
      <v-card
        dark
        ref="form"
        @keydown.enter="submeter"
        elevation="20"
        class="v-card-login white--text"
        color="#144552"
      >
        <div class="mt-3 d-flex align-center justify-center">
          <h1 class="logo">LOGIN</h1>
        </div>
        <v-card-text class="mt-3">
          <div class="d-flex">
            <div style="width: 85%" class="d-flex align-center justify-center">
              <v-text-field
                ref="usuario"
                v-model.lazy.trim="usuario"
                :rules="[() => !!usuario || 'Campo Obrigatório!']"
                outlined
                label="Usuário"
                color="#16db93"
              ></v-text-field>
            </div>
            <div
              style="height: 56px; width: 15%"
              class="d-flex align-center justify-center div-icon"
            >
              <v-icon color="#16db93">fas fa-user</v-icon>
            </div>
          </div>
          <div class="d-flex">
            <div style="width: 85%" class="d-flex align-center justify-center">
              <v-text-field
                ref="senha"
                v-model.lazy.trim="senha"
                :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[() => !!senha || 'Campo Obrigatório!']"
                :type="mostrar ? 'text' : 'password'"
                outlined
                label="Senha"
                color="#16db93"
                @click:append="mostrar = !mostrar"
              ></v-text-field>
            </div>
            <div
              style="height: 56px; width: 15%"
              class="d-flex align-center justify-center div-icon"
            >
              <v-icon color="#16db93">fas fa-lock</v-icon>
            </div>
          </div>
          <div>
            <v-btn width="100%" color="#16db93" @click="submeter">Entrar</v-btn>
          </div>
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
        </v-card-text>
      </v-card>
    </transition>
  </v-row>
</template>

<script>
import store from "@/store";
export default {
  data: () => {
    return {
      usuario: "",
      senha: "",
      mostrar: false,
      formularioPossuiErros: false,
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
    submeter() {
      this.formularioPossuiErros = false;
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) {
          this.formularioPossuiErros = true;
          this.$refs[f].validate(true);
        }
      });
      if (this.formularioPossuiErros == false) {
        this.login();
        // this.$router.push({ path: "/" });
      }
    },
    login() {
      this.$http
        .get("/usuario/autenticar", {
          headers: {
            login: this.usuario,
            senha: this.senha,
          },
        })
        .then((response) => {
          store.user = response.data;
          localStorage.setItem("user", JSON.stringify(response.data));
          this.$router.push("/");
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
  },
};
</script>

<style>
.v-card-login {
  min-width: 300px;
  max-width: 300px;
  height: 400px;
}
.div-icon {
  border-top-right-radius: 7px;
  border-bottom-right-radius: 7px;
  border-width: 2px;
  border-style: solid;
  border-color: #16db93;
}
.logo {
  font-family: "Teko", sans-serif;
  font-size: 3rem;
  color: #16db93;
}
</style>