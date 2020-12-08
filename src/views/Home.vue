<template>
  <v-parallax dark src="@/assets/fundoHome.jpg">
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <transition
          enter-active-class="animate__animated animate__fadeInUp"
          appear
        >
          <h1>BEM VINDO!</h1>
        </transition>
      </v-col>
    </v-row>
  </v-parallax>
</template>

<script>
export default {
  name: "Home",
  data: () => {
    return {};
  },
};
</script>

<style>
.home {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
h1 {
  color: #16db93;
  font-size: 3rem;
  font-family: "Oswald", sans-serif;
}
</style>
