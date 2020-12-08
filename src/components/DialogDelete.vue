<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" persistent max-width="400">
      <v-card color="#144552">
        <v-card-title style="color: #fff; word-break: normal" class="headline">
          {{ text }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#FB8C00" text @click="fechar"> Não </v-btn>
          <v-btn color="#16db93" text @click="excluir"> Sim </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    dialogDelete: {
      type: Boolean,
      required: true,
    },
    opcaoDelete: {
      type: String,
      required: true,
    },
    idElemento: {
      type: Number,
      required: true,
    },
  },
  computed: {
    text() {
      return `${this.opcaoDelete}` == "PEDIDO"
        ? "Tem certeza que deseja cancelar este pedido?"
        : "Tem certeza que deseja excluir?";
    },
  },
  methods: {
    fechar() {
      this.$emit("dialogDeleteAberto", false);
    },
    excluir() {
      if (this.opcaoDelete === "USUARIO") {
        alert("usuário excluído");
        this.$emit("dialogDeleteAberto", false);
      } else if (this.opcaoDelete === "PESSOA") {
        this.$http
          .delete(`/pessoa/${this.idElemento}`, {
            headers: {
              login: this.$store.user.login,
              senha: this.$store.user.senha,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.$emit("delete", {
              sucesso: true,
              mensagem: "",
            });
          })
          .catch((error) => {
            this.$emit("delete", {
              sucesso: false,
              mensagem: error.response.data.message,
            });
          });

        this.$emit("dialogDeleteAberto", false);
      } else if (this.opcaoDelete === "PRODUTO") {
        this.$http
          .delete(`/produto/${this.idElemento}`, {
            headers: {
              login: this.$store.user.login,
              senha: this.$store.user.senha,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.$emit("delete", {
              sucesso: true,
              mensagem: "",
            });
          })
          .catch((error) => {
            this.$emit("delete", {
              sucesso: false,
              mensagem: error.response.data.message,
            });
          });

        this.$emit("dialogDeleteAberto", false);
      } else {
        this.$http
          .put(`/pedido/${this.idElemento}`, null, {
            headers: {
              login: this.$store.user.login,
              senha: this.$store.user.senha,
            },
          })
          .then((response) => {
            console.log(response);
            this.$emit("delete", {
              sucesso: true,
              mensagem: "",
            });
          })
          .catch((error) => {
            this.$emit("delete", {
              sucesso: false,
              mensagem: `${error.response.data.message}`,
            });
          });

        this.$emit("dialogDeleteAberto", false);
      }
    },
  },
};
</script>