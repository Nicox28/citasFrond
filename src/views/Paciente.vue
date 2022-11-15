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
          <v-toolbar-title>Paciente</v-toolbar-title>
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
                Nuevo Paciente
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
                        v-model="editedItem.nomb_pac"
                        :rules="nomRules"
                        label="NOMBRE"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.apellido_pac"
                        :rules="apeRules"
                        label="APELLIDOS"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.direcc_pac"
                        :rules="direRules"
                        label="DIRECCION"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.cel_pac"
                        :rules="celRules"
                        label="CELULAR"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.docu_pac"
                        :rules="docRules"
                        label="DOCUMENTO DE IDENTIDAD"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.fecha_nac_pac"
                            :rules="feRules"
                            label="Calendar"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.fecha_nac_pac"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-combobox
                      dense
                      filled
                      outlined
                      solo
                      v-model="editedItem.sexo_pac"
                      :rules="sexRules"
                      :items="items1"
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
                >Estas seguro de borrar al Paciente?</v-card-title
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
     nomRules: [
      (v) => !!v || "Ingrese Nombre",
      (v) => (v && v.length <=21) || "Excede el tamaño",
    ],
     apeRules: [
      (v) => !!v || "Ingrese Apellidos",
      (v) => (v && v.length <=21) || "Excede el tamaño",
    ],
     direRules: [
      (v) => !!v || "Ingrese Direccion",
      (v) => (v && v.length <=21) || "Excede el tamaño",
    ],
     celRules: [
      (v) => !!v || "Ingrese el Celular",
      (v) => (v && v.length ==9) || "el celular debe tener 9 digitos",
    ],

     docRules: [
      (v) => !!v || "Ingrese el documento de identidad",
      (v) => (v && v.length ==8 || v.length ==13) || "8 Numeros para DNI y 13 para carnet de Extranjeria",
    ],
     feRules: [
      (v) => !!v || "Ingrese la Fecha de Nacimiento",
    ],
     sexRules: [
      (v) => !!v || "Seleccione Sexo",
    ],
    select: null,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    dialog: false,
    search: "",
    items1: ["Masculino","Femenino"],

    dialogDelete: false,
    dialogProg: false,
    headers: [
      {
        text: "NOMBRE",
        align: "start",
        sortable: false,
        value: "nomb_pac",
      },
      { text: "APELLIDO", value: "apellido_pac" },
      { text: "DIRECCION", value: "direcc_pac" },
      { text: "CELULAR", value: "cel_pac" },
      { text: "DOCUMENTO IDENTIDAD", value: "docu_pac" },
      { text: "FECHA DE NACIMIENTO", value: "fecha_nac_pac" },
      { text: "SEXO", value: "sexo_pac" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      nomb_pac: "",
      apellido_pac: "",
      direcc_pac: "",
      cel_pac: "",
      docu_pac: "",
      fecha_nac_pac: "",
      sexo_pac: "",
    },
    defaultItem: {
      nomb_pac: "",
      apellido_pac: "",
      direcc_pac: "",
      cel_pac: "",
      docu_pac: "",
      fecha_nac_pac: "",
      sexo_pac: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NUEVO PACIENTE" : "Edit Item";
    },
  },

  watch: {
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
            console.log("exito listar paciente", res.data);
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
          nomb_pac: "",
          apellido_pac: "",
          direcc_pac: "",
          cel_pac: "",
          docu_pac: "",
          fecha_nac_pac: "",
          sexo_pac: "",
        },
      ];
    },

    listaPacinte(){
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
            console.log("exito listar paciente", res.data);
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

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      console.log("valorItem", this.editedItem.url.split("/")[4]);
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
                "/paciente/" +
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
                "/paciente/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                nomb_pac: this.editedItem.nomb_pac,
                apellido_pac: this.editedItem.apellido_pac,
                direcc_pac: this.editedItem.direcc_pac,
                cel_pac: this.editedItem.cel_pac,
                docu_pac: this.editedItem.docu_pac,
                fecha_nac_pac: this.editedItem.fecha_nac_pac,
                sexo_pac: this.editedItem.sexo_pac,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("yata exitoso", res);
              this.listaPacinte();
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
      //console.log("algo", this.desserts);
      console.log("algo2", this.editedItem);*/
      var doc_val= this.editedItem.docu_pac.length
      var cel_val= this.editedItem.cel_pac.length
      console.log(doc_val)
       

          if(doc_val==8 && cel_val==9  || doc_val==13 && cel_val==9){
            //nacionalidad= " "
            //if(this.editedItem.docu_pac.length==8){
              //nacionalidad="peruana"
          
            //}
            //else{
              //nacionalidad="extranjera"
            //}
            axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {

         
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "/paciente/",
              {
                nomb_pac: this.editedItem.nomb_pac,
                apellido_pac: this.editedItem.apellido_pac,
                direcc_pac: this.editedItem.direcc_pac,
                cel_pac: this.editedItem.cel_pac,
                docu_pac: this.editedItem.docu_pac,
                fecha_nac_pac: this.editedItem.fecha_nac_pac,
                sexo_pac: this.editedItem.sexo_pac,
                //nacionalidad_pac: nacionalidad,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.listaPacinte();
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
      
    },
  },
};
</script>