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
          <v-toolbar-title>Personal</v-toolbar-title>
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
                Nueva Cita
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
                        type="time"
                        label="Agregar Hora"
                        v-model="editedItem.hora"
                      >
                      </v-text-field>
                    </v-col>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem.fecha"
                        label="Calendar"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-col cols="12" sm="6" md="4">
                      <v-combobox
                        dense
                        filled
                        outlined
                        solo
                        v-model="editedItem.nomb_pac"
                        :items="items1"
                        label="NOMBRE"
                      ></v-combobox>
                      <v-combobox
                        dense
                        filled
                        outlined
                        solo
                        v-model="editedItem.apellido_pac"
                        :items="itemsCombo"
                        label="APELLIDO"
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.correo"
                        label="CORREO"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  v-if="editedIndex === -1"
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
                <v-btn v-else color="blue darken-1" text @click="editar">
                  Editar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
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
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    itemsCombo: [],
    model: ["editedItem.paciente"],
    search: "",
    dialog: false,

    items1: [],
    model1: ["editedItem.paciente"],
    search1: "",
    dialog1: false,
    dialogDelete: false,
    dialogProg: false,
    headers: [
      {
        text: "HORA",
        align: "start",
        sortable: false,
        value: "hora",
      },
      { text: "FECHA", value: "fecha" },
      { text: "NOMBRE", value: "nomb_pac" },
      { text: "APELLIDO", value: "apellido_pac" },
      { text: "CORREO", value: "correo" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      hora: "",
      fecha: "",
      nomb_pac: "",
      docu_per: "",
      apellido_pac: "",
      correo: "",
    },
    defaultItem: {
      hora: "",
      fecha: "",
      nomb_pac: "",
      docu_per: "",
      apellido_pac: "",
      correo: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NUEVO PERSONAL" : "Edit Item";
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
          .get(RUTA_SERVIDOR + "paciente/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("exito listar cita", res.data);
            this.desserts = res.data;
            this.dialogProg = false;
            for (let i = 0; i < res.data.length; i++) {
              this.itemsCombo.push(res.data[i].apellido_pac);
            }
            for (let i = 0; i < res.data.length; i++) {
              this.items1.push(res.data[i].nomb_pac);
            }
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

    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "paciente/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("lista de pacientes", res.data);
            for (let i = 0; i < res.data.length; i++) {
              this.itemsCombo.push(res.data[i].apellido_pac);
            }
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
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "paciente/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("lista de categorias", res.data);
            for (let i = 0; i < res.data.length; i++) {
              this.items1.push(res.data[i].nomb_pac);
            }
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
          hora: "",
          fecha: "",
          nomb_pac: "",
          docu_per: "",
          apellido_pac: "",
          correo: "",
        },
      ];
    },

    listaCita() {
      this.dialogProg = true;
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "cita/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito listar personal", res.data);
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
                "/cita/" +
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
                "/cita/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                hora: this.editedItem.hora,
                fecha: this.editedItem.fecha,
                nomb_pac: this.editedItem.nomb_pac,
                apellido_pac: this.editedItem.apellido_pac,
                correo: this.editedItem.correo,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("Es exitoso", res);
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
      }
      //this.close();
      //console.log("algo", this.desserts);
      console.log("algo2", this.editedItem);*/

      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "cita/",
              {
                hora: this.editedItem.hora,
                fecha: this.editedItem.fecha,
                nomb_pac: this.editedItem.nomb_pac,
                apellido_pac: this.editedItem.apellido_pac,
                correo: this.editedItem.correo,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.listaCita();
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