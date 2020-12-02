<template>
  <v-row justify="center">
    <v-dialog v-model="alert" max-width="600">
      <v-card color="#144552">
        <v-card-title :style="{ color: color }" class="headline">
          {{ text }}
          <!-- <h1 @click="fechar" class="botao-fechar">X</h1> -->
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark text @click="fechar">X</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    alert: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    fechar() {
      this.$emit("fecharAlert", false);
    },
  },
};
</script>

<style>
.botao-fechar {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 0;
}

/* .botao-fechar:hover {
  color: #fff;
} */
</style>