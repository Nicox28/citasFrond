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
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.nomb_per"
                        :rules="nomRules"
                        label="NOMBRE"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.apellido_per"
                        :rules="apeRules"
                        label="APELLIDOS"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.cel_per"
                        :rules="celRules"
                        label="CELULAR"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.docu_per"
                        :rules="docuRules"
                        label="DOCUMENTO DE IDENTIDAD"
                        type="number"
                        
                      ></v-text-field>
                    </v-col>
                    <v-combobox
                      dense
                      filled
                      outlined
                      solo
                      v-model="editedItem.especialidad"
                      :rules="espeRules"
                      :items="itemsCombo"
                      label="especialidad"
                    ></v-combobox>
                    <v-combobox
                      dense
                      filled
                      outlined
                      solo
                      v-model="editedItem.cat_per"
                      :rules="catRules"
                      :items="items1"
                      label="categoria"
                    ></v-combobox>
                    <v-combobox
                      dense
                      filled
                      outlined
                      solo
                      v-model="editedItem.sexo_per"
                      :rules="sexRules"
                      :items="items3"
                      label="sexo"
                    ></v-combobox>
                    
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
              <v-card-title class="text-h5"
                >Estas seguro de borrar al Personal?</v-card-title
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
     nomb_per:"",
     nomRules: [
      (v) => !!v || "Campo Requerido",
      (v) => (v && v.length <=21) || "Excede el tamaño",
    ],
     apeRules: [
      (v) => !!v || "Apellidos Obligatorio",
      (v) => (v && v.length <=21) || "Excede el tamaño",
    ],
     celRules: [
      (v) => !!v || "Ingrese el Celular",
      (v) => (v && v.length ==9) || "el celular debe tener 9 digitos",
    ],
     docuRules: [
      (v) => !!v || "Ingrese el documento de identidad",
      (v) => (v && v.length ==8 || v.length ==13) || "8 Numeros para DNI y 13 para carnet de Extranjeria",
    ],
     espeRules: [
      (v) => !!v || "Ingrese la Especialidad",
    ],
    catRules: [
      (v) => !!v || "Ingrese la Categoria del Personal",
    ],
     sexRules: [
      (v) => !!v || "Seleccione Sexo",
    ],
    
    itemsCombo: [],
    model: ["editedItem.especialidad"],
    search: "",
    dialog: false,
    items3: ["Maculino","Femenino"],

    items1: [],
    model1: ["editedItem.cat_per"],
    search1: "",
    dialog1: false,
    dialogDelete: false,
    dialogProg: false,
    headers: [
      {
        text: "NOMBRE",
        align: "start",
        sortable: false,
        value: "nomb_per",
      },
      { text: "APELLIDO", value: "apellido_per" },
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
      apellido_per: "",
      cel_per: "",
      docu_per: "",
      especialidad: "",
      cat_per: "",
      sexo_per: "",
    },
    defaultItem: {
      nomb_per: "",
      apellido_per: "",
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
    this.dialogProg = true;

    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "personal/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("exito listar personal", res.data);
            this.desserts = res.data;
            this.dialogProg = false;
            for (let i = 0; i < res.data.length; i++) {
              this.itemsCombo.push(res.data[i].nomb_espe);
            }
            for (let i = 0; i < res.data.length; i++) {
              this.items1.push(res.data[i].nomb_cat_per);
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
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "cat_per/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("lista de categorias", res.data);
            for (let i = 0; i < res.data.length; i++) {
              this.items1.push(res.data[i].nomb_cat_per);
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
          apellido_per: "",
          cel_per: "",
          docu_per: "",
          especialidad: "",
          cat_per: "",
          sexo_per: "",
        },
      ];
    },

    listaPersonal(){
       this.dialogProg = true;
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "personal/", {
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
                "/personal/" +
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
                "/personal/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                nomb_per: this.editedItem.nomb_per,
                apellido_per: this.editedItem.apellido_per,
                cel_per: this.editedItem.cel_per,
                docu_per: this.editedItem.docu_per,
                especialidad: this.editedItem.especialidad,
                cat_per: this.editedItem.cat_per,
                sexo_per: this.editedItem.sexo_per,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("Es exitoso", res);
              this.listaPersonal()
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
      var doc_val= this.editedItem.docu_per.length
      var cel_val= this.editedItem.cel_per.length
      console.log(doc_val)
      
          if(doc_val==8 && cel_val==9  || doc_val==13 && cel_val==9){
            //if(this.editedItem.docu_per==8)
            

            axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "personal/",
              {
                nomb_per: this.editedItem.nomb_per,
                apellido_per: this.editedItem.apellido_per,
                cel_per: this.editedItem.cel_per,
                docu_per: this.editedItem.docu_per,
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
              this.listaPersonal();
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
          }
          else{
            
         }
    },
  },
};
</script>