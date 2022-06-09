<template>
  <div class="d-flex flex-column justify-space-between align-center mt-5">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="user"
        :rules="nameRules"
        label="Usuario"
        required
      ></v-text-field>

      <v-text-field
        v-model="contra"
        :rules="nameRules"
        type="password"
        label="Contraseña"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="ingresar">
        Ingresar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

export default {
  data: () => ({
    valid: true,
    user: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    contra: "",
    select: null,
  }),

  methods: {
    ingresar() {
      this.$refs.form.validate();
      console.log("estamos aqui");
      axios
        .post(RUTA_SERVIDOR + "api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "usuario/?search=" + this.user, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("data", res.data);
              if (res.data[0].clave == this.contra) {
                console.log("esto es un exito ya ingresaste");
                this.$router.push("/principal");
              } else {
                console.log("eres un impostor");
              }
            })
            .catch((res) => {
              console.log("este es el error", res);
            });
        })
        .catch((response) => {
          console.log("este es el error", response);
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>