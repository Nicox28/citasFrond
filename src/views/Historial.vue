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
          <v-toolbar-title>HISTORIA CLINICA</v-toolbar-title>
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
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nueva Historia Clinica
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-spacer></v-spacer>
              <v-col cols="10" sm="3" md="3">
                <v-text-field
                  type="date"
                  label="Agregar Fecha"
                  v-model="editedItem.fecha_histo"
                >
                </v-text-field>
              </v-col>
              <v-col cols="10" sm="4" md="4">
                <v-text-field
                  v-model="editedItem.datosPaciente.docu_pac"
                  label="DOCUMENTO DE IDENTIDAD"
                  required
                ></v-text-field>
                <v-btn @click="buscarPaciente" color="primary">
                  <span>Buscar</span>
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>

              <v-col cols="10" sm="6" md="6">
                <h3 color="primary">PACIENTE</h3>
              </v-col>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="10" sm="4" md="4">
                      <v-text-field
                        v-model="editedItem.datosPaciente.nomb_pac"
                        label="NOMBRE"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="10" sm="4" md="4">
                      <v-text-field
                        v-model="editedItem.datosPaciente.apellido_pac"
                        label="APELLIDO"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="10" sm="4" md="4">
                      <v-text-field
                        v-model="editedItem.datosPaciente.direcc_pac"
                        label="DIRECCION"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                      <v-text-field
                        v-model="editedItem.datosPaciente.cel_pac"
                        label="CELULAR"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="10" sm="4" md="4">
                      <v-text-field
                        v-model="editedItem.datosPaciente.docu_pac"
                        label="DOCUMENTO DE IDENTIDAD"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                      <v-text-field
                        v-model="editedItem.datosPaciente.fecha_nac_pac"
                        label="FECHA NACIMIENTO"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                      <v-text-field
                        v-model="editedItem.datosPaciente.sexo_pac"
                        label="SEXO"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field
                        v-model="editedItem.contactar"
                        label="NOMBRE DE CONTACTO"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                      <v-text-field
                        v-model="editedItem.cel_contac"
                        label="CELULAR DE CONTACTO"
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-spacer></v-spacer>
              <v-col cols="100" sm="6" md="6">
                <h3 color="red">ANTECEDENTES FISICOS</h3>
              </v-col>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.alergia"
                      label="ALERGICO A:"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.toma_medica"
                      label="ESTA TOMANDO  MEDICAMENTO? ESPECIFICAR"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field
                      v-model="editedItem.talla"
                      label="TALLA"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field
                      v-model="editedItem.peso"
                      label="PESO"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field
                      v-model="editedItem.presion_art"
                      label="PRESION ARTERIAL"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="5" md="5">
                    <v-combobox
                      v-model="editedItem.nomb_enfer"
                      :items="items12"
                      label="SELECCIONAR ENFERMEDADES"
                      multiple
                    ></v-combobox>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-col cols="100" sm="6" md="6">
                <h3 color="red">ANTECEDENTES ODONTOLOGICOS</h3>
              </v-col>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.frecuencia_visi"
                      label="FRECUENCIA CON LA QUE VISITA AL ODONTOLOGO"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.experiencia_trauma"
                      label="HA TENIDO EXPERIENCIA TRAUMATICA? ESPECIFICA:"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.extraccion_mue"
                      label="HA TENIDO EXTRACCION DE MUELAS? ESPECIFICAR:"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.sangre_enci"
                      label="LE SANGRA LAS ENCIAS? ESPECIFICAR:"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.estetica_dental"
                      label="ESTA SATISFECHO CON SU ESTETICA DENTAL? ESPECIFIQUE:"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.motivo_consul"
                      label="MOTIVO DE CONSULTA"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.impre"
                      label="IMPRESION GENERAL"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.cabe"
                      label="CABEZA"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.cue"
                      label="CUELLO"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.meji"
                      label="MEJILLA"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.leng"
                      label="LENGUA"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.piso"
                      label="PISO BOCA"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.pilares"
                      label="PILARES DEL PALADAR"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.enci"
                      label="ENCIAS"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  CANCELAR
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
                >Desea Eliminar esta Historia Clinica?</v-card-title
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
    docuPaciente: "",
    dialog: false,
    search: "",
    dialogDelete: false,
    items12: [],
    model: ["editedItem.enfermedad"],
  

    checkbox: false,
    headers: [
      {
        text: "NOMBRE",
        align: "start",
        sortable: false,
        value: "datosPaciente.nomb_pac",
      },
      { text: "APELLIDO", value: "datosPaciente.apellido_pac" },
      { text: "DOCUMENTO DE IDENTIDAD", value: "datosPaciente.docu_pac" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      datosPaciente: {},
      urlPaciente: "",
      fecha_histo: "",
      nomb_pac: "",
      apellido_pac: "",
      direcc_pac: "",
      cel_pac: "",
      docu_pac: "",
      fecha_nac_pac: "",
      sexo_pac: "",
      contactar: "",
      cel_contac: "",
      alergia: "",
      toma_medica: "",
      talla: "",
      peso: "",
      presion_art: "",
      nomb_enfer: [],
      frecuencia_visi: "",
      experiencia_trauma: "",
      extraccion_mue: "",
      sangre_enci: "",
      estetica_dental: "",
      motivo_consul: "",
      impre: "",
      cabe: "",
      cue: "",
      meji: "",
      leng: "",
      piso: "",
      pilares: "",
      enci: "",
    },
    defaultItem: {
      datosPaciente: {},
      urlPaciente: "",
      fecha_histo: "",
      nomb_pac: "",
      apellido_pac: "",
      direcc_pac: "",
      cel_pac: "",
      docu_pac: "",
      fecha_nac_pac: "",
      sexo_pac: "",
      contactar: "",
      cel_contac: "",
      alergia: "",
      toma_medica: "",
      talla: "",
      peso: "",
      presion_art: "",
      nomb_enfer: [],
      frecuencia_visi: "",
      experiencia_trauma: "",
      extraccion_mue: "",
      sangre_enci: "",
      estetica_dental: "",
      motivo_consul: "",
      impre: "",
      cabe: "",
      cue: "",
      meji: "",
      leng: "",
      piso: "",
      pilares: "",
      enci: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "NUEVA HISTORIA CLINICA"
        : "EDITAR HISTORIA CLINICA";
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
    this.listaHistorial();
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
          .get(RUTA_SERVIDOR + "enfermedad/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("lista de enfermedades", res.data);
            for (let i = 0; i < res.data.length; i++) {
              this.items12.push(res.data[i].nomb_enfer);
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
    buscarPaciente() {
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(
              RUTA_SERVIDOR +
                "paciente/?search=" +
                this.editedItem.datosPaciente.docu_pac,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("paciente encontrado", res.data);
              this.editedItem.datosPaciente = res.data[0]; /*
              this.editedItem.datosPaciente.nomb_pac = res.data[0].nomb_pac;
              this.editedItem.apellido_pac = res.data[0].apellido_pac;
              //this.editedItem.direcc_pac=res.data[0].url.split("/")[4]
              this.editedItem.direcc_pac = res.data[0].direcc_pac;
              this.editedItem.cel_pac = res.data[0].cel_pac;
              this.editedItem.docu_pac = res.data[0].docu_pac;
              this.editedItem.fecha_nac_pac = res.data[0].fecha_nac_pac;
              this.editedItem.sexo_pac = res.data[0].sexo_pac;*/
              this.editedItem.urlPaciente = res.data[0].url;
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
    initialize() {
      this.desserts = [
        {
          nomb_pac: "",
          apellido_pac: "",
          direcc_pac: "",
        },
      ];
    },

    listaHistorial() {
      this.dialogProg = true;
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "historial/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito listar Historial", res.data);
              this.desserts = res.data;
              this.dialogProg = false;
              //for (let i = 0; i < res.data.length; i++) {
              //this.editedItem.docu_pac = res.data[0].datosPaciente.docu_pac;
              // }
              //console.log("prueba", res.data[0].datosPaciente.docu_pac);
              /*for (let i = 0; i < res.data.length; i++) {
                this.editedItem.nomb_pac.push(res.data[i].nomb_pac);
              }
              for (let i = 0; i < res.data.length; i++) {
                this.editedItem.apellido_pac.push(res.data[i].apellido_pac);
              }
              for (let i = 0; i < res.data.length; i++) {
                this.editedItem.direcc_pac.push(res.data[i].direcc_pac);
              }*/
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
      console.log("esto se va editar", item);
      this.editedItem.nomb_enfer=item.enfermedad.split(",")
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
                "/historial/" +
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
                "/historial/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                paciente: this.editedItem.urlPaciente,
                enfermedad: this.editedItem.nomb_enfer.toString(),
                fecha_histo: this.editedItem.fecha_histo,
                contactar: this.editedItem.contactar,
                cel_contac: this.editedItem.cel_contac,
                alergia: this.editedItem.alergia,
                toma_medica: this.editedItem.toma_medica,
                talla: this.editedItem.talla,
                peso: this.editedItem.peso,
                presion_art: this.editedItem.presion_art,
                frecuencia_visi: this.editedItem.frecuencia_visi,
                experiencia_trauma: this.editedItem.experiencia_trauma,
                extraccion_mue: this.editedItem.extraccion_mue,
                sangre_enci: this.editedItem.sangre_enci,
                estetica_dental: this.editedItem.estetica_dental,
                motivo_consul: this.editedItem.motivo_consul,
                impre: this.editedItem.impre,
                cabe: this.editedItem.cabe,
                cue: this.editedItem.cue,
                meji: this.editedItem.meji,
                leng: this.editedItem.leng,
                piso: this.editedItem.piso,
                pilares: this.editedItem.pilares,
                enci: this.editedItem.enci,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("Es exitoso", res);
              this.listaHistorial();
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
              RUTA_SERVIDOR + "historial/",
              {
                paciente: this.editedItem.urlPaciente,
                enfermedad: this.editedItem.nomb_enfer.toString(),
                fecha_histo: this.editedItem.fecha_histo,
                contactar: this.editedItem.contactar,
                cel_contac: this.editedItem.cel_contac,
                alergia: this.editedItem.alergia,
                toma_medica: this.editedItem.toma_medica,
                talla: this.editedItem.talla,
                peso: this.editedItem.peso,
                presion_art: this.editedItem.presion_art,
                frecuencia_visi: this.editedItem.frecuencia_visi,
                experiencia_trauma: this.editedItem.experiencia_trauma,
                extraccion_mue: this.editedItem.extraccion_mue,
                sangre_enci: this.editedItem.sangre_enci,
                estetica_dental: this.editedItem.estetica_dental,
                motivo_consul: this.editedItem.motivo_consul,
                impre: this.editedItem.impre,
                cabe: this.editedItem.cabe,
                cue: this.editedItem.cue,
                meji: this.editedItem.meji,
                leng: this.editedItem.leng,
                piso: this.editedItem.piso,
                pilares: this.editedItem.pilares,
                enci: this.editedItem.enci,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.listaHistorial();
              console.log("enfermedad", this.editedItem.nomb_enfer);
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