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

      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>CENTRO ODONTOLOGICO MULTIDENT</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-2"
      class="overflow-y-auto"
      max-height="100vh"
    >
      <v-container style="height: 130px">
       
      </v-container>
       <v-card style="height: 100vh">
          <v-navigation-drawer
            v-model="drawer"
            :mini-variant.sync="mini"
            permanent
          >
            <v-list-item class="px-2">
              <v-list-item-avatar>
                <v-img
                  src="https://randomuser.me/api/portraits/men/85.jpg"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-title>Nombre</v-list-item-title>

              <v-btn icon @click.stop="mini = !mini">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense>
              <v-list-item v-for="item in items" :key="item.title" link>
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
    </v-sheet>
  </v-card>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

export default {
  data: () => ({
    drawer: true,
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" },
    ],
    mini: false,
  }),

  methods: {},
};
</script>