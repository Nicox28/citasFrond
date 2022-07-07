<template>
  <div>
    <v-dialog v-model="dialogProg" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Espere Unos Minutos
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Usuario</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            class="text-xs-center"
            v-model="search"
            append-icon="mdi-magnify"
            label="Busqueda"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Usuario
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.login"
                        label="LOGIN"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.clave"
                        label="CLAVE"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nomb"
                        label="NOMBRE"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.apellido"
                        label="APELLIDOS"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.perfil"
                        label="PERFIL"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn
                  v-if="editedIndex === -1"
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Guardar
                </v-btn>
                <v-btn v-else color="blue darken-1" text @click="editar">
                  Editar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h7"
                >Estas seguro de borrar al Usuario?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Confirmar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
  
  <script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export default {
  data: () => ({
    search: "",
    search1: "",
    dialog: false,
    dialogDelete: false,
    dialogProg: false,
    headers: [
      {
        text: "LOGIN",
        align: "start",
        sortable: false,
        value: "login",
      },
      { text: "CLAVE", value: "clave" },
      { text: "NOMBRE", value: "nomb" },
      { text: "APELLIDO", value: "apellido" },
      { text: "PERFIL", value: "perfil" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      login: "",
      clave: "",
      nomb: "",
      apellido: "",
      perfil: "",
    },
    defaultItem: {
      login: "",
      clave: "",
      nomb: "",
      apellido: "",
      perfil: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NUEVO USUARIO" : "Edit Item";
    },
  },

  watch: {
    model(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.model.pop());
      }
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
    this.dialogProg = true;
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "usuario/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("exito listar usuario", res.data);
            this.desserts = res.data;
            this.dialogProg = false;
          })
          .catch((res) => {
            console.log("Error:", res);
          });
      })
      .catch((response) => {
        response === 404
          ? console.warn("lo sientimos no tenemos servicios")
          : console.warn("Error:", response);
      });
  },

  methods: {
    initialize() {
      this.desserts = [
        {
          login: "",
          clave: "",
          nomb: "",
          apellido: "",
          perfil: "",
        },
      ];
    },

    listarUsuario(){
       this.dialogProg = true;
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "usuario/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("exito listar usuario", res.data);
            this.desserts = res.data;
            this.dialogProg = false;
            this.close();
          })
          .catch((res) => {
            console.log("Error:", res);
          });
      })
      .catch((response) => {
        response === 404
          ? console.warn("lo sientimos no tenemos servicios")
          : console.warn("Error:", response);
      });
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .delete(
              RUTA_SERVIDOR +
                "/usuario/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("eliminado exitoso", res);
              this.closeDelete();
            })
            .catch((res) => {
              console.warn("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    editar() {
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_SERVIDOR +
                "/usuario/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                login: this.editedItem.login,
                clave: this.editedItem.clave,
                nomb: this.editedItem.nomb,
                apellido: this.editedItem.apellido,
                perfil: this.editedItem.perfil,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("yata exitoso", res);
              this.listarUsuario()
              this.close();
            })
            .catch((res) => {
              console.warn("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },

    save() {
      /*if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
        //this.desserts.unshift(this.editedItem);
      }
      //this.close();
      //console.log("algo", this.desserts);*/
      /*console.log("algo2", this.editedItem);*/
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "/usuario/",
              {
                login: this.editedItem.login,
                clave: this.editedItem.clave,
                nomb: this.editedItem.nomb,
                apellido: this.editedItem.apellido,
                perfil: this.editedItem.perfil,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.listarUsuario();
              this.close();
            })
            .catch((res) => {
              console.log("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
  },
};
</script>