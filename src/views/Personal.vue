<template>
  <div>
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
                Nuevo Personal
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
                        v-model="editedItem.nomb_per"
                        label="NOMBRE"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.apellido_per"
                        label="APELLIDOS"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.cel_per"
                        label="CELULAR"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.docu_per"
                        label="DOCUMENTO DE IDENTIDAD"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-combobox
                      v-model="editedItem.especialidad"
                      :items="itemsCombo"
                      :search-input.sync="search"
                      hide-selected
                      hint="Maximum of 7 tags"
                      label="ESPECIALIDAD"
                      multiple
                      persistent-hint
                      small-chips
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{ search }}</strong
                              >". Press <kbd>enter</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                    <v-combobox
                      v-model="editedItem.cat_per"
                      :items="items1"
                      :search-input.sync="search1"
                      hide-selected
                      hint="Maximum of 5 tags"
                      label="CATEGORIA DE PERSONAL"
                      multiple
                      persistent-hint
                      small-chips
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{ search }}</strong
                              >". Press <kbd>enter</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.sexo_per"
                        label="SEXO"
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
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
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
    itemsCombo: [],
    model: ["editedItem.especialidad"],
    search: null,
    dialog: false,

    items1: ["Administrador", "Recpecionista", "Odontologo"],
    model1: ["editedItem.cat_per"],
    search1: null,
    dialog1: false,

    dialogProg: false,

    dialogDelete: false,
    headers: [
      {
        text: "NOMBRE",
        align: "start",
        sortable: false,
        value: "nomb_per",
      },
      { text: "APELLIDO", value: "apell_per" },
      { text: "CELULAR", value: "cel_per" },
      { text: "DOCUMENTO IDENTIDAD", value: "docu_per" },
      { text: "ESPECIALIDAD", value: "especialidad" },
      { text: "CATEGORIA DE PERSONAL", value: "cat_per" },
      { text: "SEXO", value: "sexo_per" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      nomb_per: "",
      apell_per: "",
      cel_per: "",
      docu_per: "",
      especialidad: "",
      cat_per: "",
      sexo_per: "",
    },
    defaultItem: {
      nomb_per: "",
      apell_per: "",
      cel_per: "",
      docu_per: "",
      especialidad: "",
      cat_per: "",
      sexo_per: "",
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
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "especialidad/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("lista de especialidades", res.data);
            for (let i = 0; i < res.data.length; i++) {
              this.itemsCombo.push(res.data[i].nomb_espe);
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
          nomb_per: "",
          apell_per: "",
          cel_per: "",
          docu_per: "",
          especialidad: "",
          cat_per: "",
          sexo_per: "",
        },
      ];
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
      this.closeDelete();
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      //this.close();
      //console.log("algo", this.desserts);
      console.log("algo2", this.editedItem);

      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "/personal/",
              {
                nomb_pac: this.editedItem.nomb_per,
                apellido_pac: this.editedItem.nomb_per,
                cel_pac: this.editedItem.cel_per,
                docu_pac: this.editedItem.docu_per,
                especialidad: this.editedItem.especialidad,
                cat_per: this.editedItem.cat_per,
                sexo_per: this.editedItem.sexo_per,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
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