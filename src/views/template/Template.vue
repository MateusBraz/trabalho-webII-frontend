<template>
  <v-app id="inspire">
    <v-navigation-drawer dark color="#144552" v-model="gaveta" app clipped>
      <v-list dense>
        <v-list-item class="ml-13" to="/" link>
          <v-list-item-title>
            <v-icon class="mr-3 mb-1">mdi-home</v-icon>Inicio
          </v-list-item-title>
        </v-list-item>

        <v-list-group
          v-for="item in itens"
          :key="item.texto"
          color="#16db93"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="mr-3 mb-1">{{ item.icone }}</v-icon>
                {{ item.texto }}
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(opcao, i) in item.opcoes"
            :key="i"
            style="text-decoration: none; color: white"
            :to="opcao.link"
            link
          >
            <v-list-item-title v-text="opcao.texto"></v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item @click="logOut" class="ml-13" link>
          <v-list-item-title>
            <v-icon class="mr-3 mb-1">mdi-logout</v-icon>Sair
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="#144552" dark dense>
      <v-app-bar-nav-icon @click.stop="gaveta = !gaveta"></v-app-bar-nav-icon>
      <v-toolbar-title
        class="mr-12 align-center animate__animated animate__backInRight"
      >
        <router-link style="text-decoration: none; color: white" to="/"
          >System</router-link
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn class="d-none d-md-flex" icon>
        <a
          href="https://www.facebook.com/mateus.braz.104/"
          target="_blank"
          style="text-decoration: none"
          ><v-icon color="white">mdi-facebook</v-icon></a
        >
      </v-btn>
      <v-btn class="d-none d-md-flex" icon>
        <a
          href="https://www.instagram.com/_mateusbraz/?hl=pt-br"
          target="_blank"
          style="text-decoration: none"
          ><v-icon color="white">mdi-instagram</v-icon></a
        >
      </v-btn>
      <v-btn class="d-none d-md-flex mr-7" icon>
        <a
          href="https://www.linkedin.com/in/mateus-braz-348b1116a/"
          target="_blank"
          style="text-decoration: none"
          ><v-icon color="white">mdi-linkedin</v-icon></a
        >
      </v-btn>

      <div style="color: #16db93" color="#144552" class="d-none d-sm-flex mr-2">
        <v-icon color="#16db93">mdi-account-circle-outline</v-icon>
        {{ this.$store.user.login }}
      </div>
      <v-btn @click="logOut" class="d-none d-md-flex" icon>
        <v-icon color="#16db93">mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="background-color: #263238" justify="center" align="center">
      <v-container>
        <transition name="slide" mode="out-in">
          <router-view class="ma-1"></router-view>
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import store from "@/store";
export default {
  data: () => {
    return {
      gaveta: null,
      itens: [
        // {
        //   icone: "mdi-home",
        //   texto: "Início",
        //   opcoes: [{ texto: "item1" }, { texto: "item2" }],
        // },
        {
          icone: "mdi-account-circle",
          texto: "Usuário",
          opcoes: [
            { texto: "Cadastrar", link: "/usuario/cadastrar" },
            { texto: "Listar", link: "/usuario/listar" },
          ],
        },
        {
          icone: "mdi-account-outline",
          texto: "Pessoa",
          opcoes: [
            { texto: "Cadastrar", link: "/pessoa/cadastrar" },
            { texto: "Listar", link: "/pessoa/listar" },
          ],
        },
        {
          icone: "mdi-clipboard-text-outline",
          texto: "Produto",
          opcoes: [
            { texto: "Cadastrar", link: "/produto/cadastrar" },
            { texto: "Listar", link: "/produto/listar" },
          ],
        },
        {
          icone: "mdi-cart",
          texto: "Pedido",
          opcoes: [
            { texto: "Cadastrar", link: "/pedido/cadastrar" },
            { texto: "Listar", link: "/pedido/listar" },
          ],
        },
      ],
    };
  },
  methods: {
    logOut() {
      store.user = null;
      localStorage.removeItem("user");
      this.$router.push({ name: "login" });
      // location.reload()
      // this.$router.go(0);
    },
  },
};
</script>

<style>
* {
  user-select: none;
}

@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}

.slide-enter-active {
  animation: slide-in 0.3s ease;
}

.slide-leave-active {
  animation: slide-out 0.3s ease;
}
</style>