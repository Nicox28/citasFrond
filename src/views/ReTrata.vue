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
          <v-toolbar-title>RECORD TRATAMIENTO</v-toolbar-title>
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
          <v-dialog v-model="dialog" max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                NUEVO RECORD
              </v-btn>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-btn @click="crearPdf" color="primary"> PDF </v-btn>
            </template>
            <template> </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="docuPaciente"
                        label="DOCUMENTO DE IDENTIDAD"
                        required
                      ></v-text-field>
                      <v-btn @click="buscarPaciente" color="primary">
                        <span>Buscar</span>
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.estado"
                        label="ESTADO"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        type="date"
                        label="AGREGAR FECHA"
                        v-model="editedItem.fecha_tratami"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.nomb_pac"
                        label="NOMBRE"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.apellido_pac"
                        label="APELLIDOS"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-combobox
                        v-model="editedItem.nomb_trata"
                        :items="items13"
                        label="SELECCIONAR TRATAMIENTOS"
                        multiple
                      ></v-combobox>
                    </v-col>
                  </v-row>
                </v-container>
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
                >Desea Eliminar este Record de Tratamiento?</v-card-title
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
import jspdf from "jspdf";
import autoTable from "jspdf-autotable";

export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export default {
  data: () => ({
    dataPdfExportFilter: [],
    dataPdfExport: [],
    docuPaciente: "",
    urlPaciente: "",
    urlPersonal: "",
    items13: [],
    model: ["editedItem.tratamiento"],
    dialog: false,
    search: "",
    dialogDelete: false,
    dialogProg: false,
    headers: [
      {
        text: "FECHA",
        align: "start",
        sortable: false,
        value: "fecha_tratami",
      },
      { text: "NOMBRE", value: "datosPaciente.nomb_pac" },
      { text: "APELLIDOS", value: "datosPaciente.apellido_pac" },
      { text: "TRATAMIENTOS", value: "tratamiento" },
      { text: "NOMBRE PERSONAL", value: "datosPersonal.nomb_per" },
      { text: "APELLIDO PERSONAL", value: "datosPersonal.apellido_per" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],

    editedIndex: -1,
    editedItem: {
      datosPaciente: {},
      datosPersonal: {},
      urlPersonal: "",
      urlPaciente: "",
      estado: "",
      fecha_tratami: "",
      nomb_pac: "",
      apellido_pac: "",
      nomb_trata: [],
    },
    defaultItem: {
      datosPaciente: {},
      datosPersonal: {},
      urlPaciente: "",
      urlPersonal: "",
      estado: "",
      fecha_tratami: "",
      nomb_pac: "",
      apellido_pac: "",
      nomb_trata: [],
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Record" : "EDITAR RECORD";
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
    this.listarRecord();
    this.initialize();
    this.dialogProg = true;
    this.urlPersonal = sessionStorage.getItem("urlPersonal");

    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "admin",
        password: "admin",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "Tratamiento/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("exito listar tratamiento", res.data);
            //this.desserts = res.data;
            for (let i = 0; i < res.data.length; i++) {
              this.items13.push(res.data[i].nomb_trata);
            }
          })
          .catch((res) => {
            console.log("Error:", res);
            this.dialogProg = false;
          });
      })
      .catch((response) => {
        response === 404
          ? console.warn("lo sientimos no tenemos servicios")
          : console.warn("Error:", response);
      });
  },

  methods: {
    crearPdf() {
      //this.dataPdfExport.push(Object.assign({}))
      console.log("trat", this.desserts);
      //const doc = new jspdf();
      for (let i = 0; i < this.desserts.length; i++) {
        this.dataPdfExport.push(
          Object.assign(
            {
              pacienteFull:
                this.desserts[i].datosPaciente.nomb_pac +
                " " +
                this.desserts[i].datosPaciente.apellido_pac,
            },
            {
              personalFull:
                this.desserts[i].datosPersonal.nomb_per +
                " " +
                this.desserts[i].datosPersonal.apellido_per,
            },
            this.desserts[i]
          )
        );
      }
      const columns = [
        { title: "Fecha Tratamiento", dataKey: "fecha_tratami" },
        { title: "Paciente", dataKey: "pacienteFull" },
        { title: "Personal", dataKey: "personalFull" },
        { title: "Tratamiento", dataKey: "tratamiento" },
      ];
      console.log("dataPdfExport", this.dataPdfExport);
      let dataPdfExportFilter = this.dataPdfExport.filter(listarRecord => listarRecord.search== this.search)
      console.log("dataPdfExportFilter", this.dataPdfExportFilter);
      const doc = new jspdf({
        orientation: "landscape",
        unit: "in",
        format: "letter",
      });
      doc.setFontSize(16).text("REPORTE DE TRATAMIENTO",0.5, 1.0)
      doc.autoTable({
        columns,
        body: this.dataPdfExportFilter,
        margin: { left: 0.5, top: 1.25 },
        styles: { fontSize: 12 },
      });
      //autoTable(doc, { html: "#my-table" });

      // Or use javascript directly:
      /* autoTable(doc, {
        head: columns,
        body: this.dataPdfExport,
      });*/
      //console.log("dataPdfExport", this.dataPdfExport);
      //const doc = new jspdf();
      //doc.text(this.dataPdfExport, 15, 15);
      doc.save("pdf.pdf");
    },
    buscarPaciente() {
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "paciente/?search=" + this.docuPaciente, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("paciente encontrado", res.data);
              this.editedItem.nomb_pac = res.data[0].nomb_pac;
              this.editedItem.apellido_pac = res.data[0].apellido_pac;
              this.editedItem.urlPaciente = res.data[0].url;
            })
            .catch((res) => {
              console.log("Error:", res);
              this.dialogProg = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    initialize() {
      this.desserts = [{}];
    },
    listarRecord() {
      this.dialogProg = true;
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "rec_tratamiento/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito listar Record de tratamiento", res.data);
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
                "/rec_tratamiento/" +
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
                "/rec_tratamiento/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                fecha_tratami: this.editedItem.fecha_tratami,
                paciente: this.editedItem.urlPaciente,
                tratamiento: this.editedItem.nomb_trata.toString(),
                personal: this.editedItem.urlPersonal,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("Es exitoso", res);
              this.listarRecord();
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
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "rec_tratamiento/",
              {
                estado: "1",
                fecha_tratami: this.editedItem.fecha_tratami,
                paciente: this.editedItem.urlPaciente,
                tratamiento: this.editedItem.nomb_trata.toString(),
                personal: this.urlPersonal,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.listarRecord();
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