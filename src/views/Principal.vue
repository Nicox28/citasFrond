<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      absolute
      color="#fcb69f"
      dark
      shrink-on-scroll
      src="https://www.multident.pe/public/imagen/logo/logo-25.png"
      scroll-target="#scrolling-techniques-2"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>
      <v-app-bar-title>CLINICA ODONTOLOGICA MULTIDENT</v-app-bar-title>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-2"
      class="overflow-y-auto"
      max-height="500vh"
    >
      <v-container style="height: 140px"></v-container>
      <div class="row">
        <div class="col-sm-2">
          <v-card class="mx-auto" width="500" tile>
            <v-navigation-drawer permanent>
              <v-system-bar></v-system-bar>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img
                      src="https://cdn.vuetifyjs.com/images/john.png"
                    ></v-img>
                  </v-list-item-avatar>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      John Leider - {{ selectedItem }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      >john@vuetifyjs.com</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-icon>mdi-menu-down</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-list nav dense>
                <v-list-item-group v-model="selectedItem" color="primary">
                  <v-list-item v-for="(item, i) in items" :key="i">
                    <v-list-item-icon>
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-navigation-drawer>
          </v-card>
        </div>
        <div class="col-sm-10">
          <div v-if="selectedItem == 0"><Paciente /></div>
          <div v-if="selectedItem == 1"><Personal /></div>
          <div v-if="selectedItem == 2"><Especialidad /></div>
          <div v-if="selectedItem == 3"><Citas /></div>
          <div v-if="selectedItem == 4"><Usuarios /></div>
          <div v-if="selectedItem == 5"><Tratamiento /></div>
        </div>
      </div>
    </v-sheet>
  </v-card>
</template>

<script>
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
import Paciente from "./Paciente.vue";
import Personal from "./Personal.vue";
import Especialidad from "./Especialidad.vue";
import Citas from "./Cita.vue";
import Usuarios from "./Usuario.vue";
import Tratamiento from "./Tratamiento.vue";

export default {
  data: () => ({
    drawer: true,
    selectedItem: 0,
    items: [
      { text: "Pacientes", icon: "mdi-account-supervisor-circle" },
      { text: "Personal", icon: "mdi-card-account-details-outline" },
      { text: "Especialidad", icon: "mdi-inbox-full-outline" },
      { text: "Citas", icon: "mdi-calendar-month-outline" },
      { text: "Usuarios", icon: "mdi-account-supervisor-circle" },
      { text: "Tratamiento", icon: "mdi-air-filter" },
      { text: "Salir", icon: "mdi-exit-run" },
    ],
    mini: false,

    admins: [
      ["Management", "mdi-account-multiple-outline"],
      ["Settings", "mdi-cog-outline"],
    ],
    cruds: [
      ["Create", "mdi-plus-outline"],
      ["Read", "mdi-file-outline"],
      ["Update", "mdi-update"],
      ["Delete", "mdi-delete"],
    ],
  }),

  methods: {},

  components: {
    Paciente,
    Personal,
    Especialidad,
    Citas,
    Usuarios,
    Tratamiento,
  },
};
</script>