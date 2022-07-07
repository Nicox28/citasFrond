<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn color="primary" dark class="mr-4" @click="dialog = true">
            Agregar
          </v-btn>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>

        <v-dialog v-model="dialog">
          <v-card>
            <v-container>
              <v-form>
                <v-text-field
                  type="time"
                  label="Agregar Hora"
                  v-model="editedItem.time"
                >
                </v-text-field>
                <v-text-field
                  type="date"
                  label="Agregar Fecha"
                  v-model="editedItem.star"
                >
                </v-text-field>
                <v-text-field
                  type="text"
                  label="Agregar Nombre"
                  v-model="editedItem.name"
                >
                </v-text-field>
                <v-text-field
                  type="text"
                  label="Agregar Apellidos"
                  v-model="editedItem.details"
                >
                </v-text-field>
                <v-text-field
                  type="text"
                  label="Agregar Correo"
                  :rules="emailRules"
                  v-model="editedItem.details2"
                >
                </v-text-field>
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  @click="guardarCita"
                  @change="updateRange"
                  >Agregar</v-btn
                >
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon
              @click="eliminarCita">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export default {
  data: () => ({
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    name: null,
    details: null,
    color: "#1976D2",
    dialog: false,
    currentlyEdinting: null,
    star: null,
    end: null,
    time: null,
    headers: [
      {
        text: "HORA",
        align: "start",
        sortable: false,
        value: "hora",
      },
      { text: "FECHA", value: "fecha" },
      { text: "NOMBRE", value: "nombre_c" },
      { text: "APELLIDO", value: "apellido_c" },
      { text: "CORREO", value: "correo" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      hora: "",
      fecha: "",
      nombre_c: "",
      apellido_c: "",
      correo: "",
    },
    defaultItem: {
      hora: "",
      fecha: "",
      nombre_c: "",
      apellido_c: "",
      correo: "",
    },
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.getEvents();
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    eliminarCita(){
      console.log("eliminar citas",this.selectedEvent.link.split("/")[4])
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
                this.selectedEvent.link.split("/")[4] +
                "/",
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("eliminado exitoso", res);
              this.selectedOpen= false
              this.setToday()
              //this.closeDelete();
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

    getEvents() {
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
              console.log("exito listar cita", res.data);
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

    guardarCita() {
      console.log("data cita", this.editedItem.time);
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "/cita/",
              {
                hora: this.editedItem.time,
                fecha: this.editedItem.star,
                nombre_c: this.editedItem.name,
                apellido_c: this.editedItem.details,
                correo: this.editedItem.details2,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.dialog = false;
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

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      //const eventCount = this.rnd(days, days + 20)
      console.log("dessertttttt",this.desserts)
      for (let i = 0; i < this.desserts.length; i++) {
        /*const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)
          */
        let datoFecha = this.desserts[i].fecha;
        //2022-06-28
        let cambio = datoFecha.split("-");
        console.log(
          "fecha cambiada",
          cambio[1] + "-" + cambio[2] + "-" + cambio[0]
        );
        console.log("dataFecha", datoFecha);
        events.push({
          link: this.desserts[i].url,
          name:
            this.desserts[i].hora +
            " " +
            this.desserts[i].nombre_c +
            " " +
            this.desserts[i].apellido_c,
          start: new Date(cambio[1] + "-" + cambio[2] + "-" + cambio[0]),

          end: new Date(cambio[1] + "-" + cambio[2] + "-" + cambio[0]),
          color: "blue",
          timed: false,
        });
        //let datoFecha = this.desserts;
        //console.log("dataFecha",this.desserts)
        console.log("prueba", events);
      }
      this.events = events;
      this.getEvents();
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>