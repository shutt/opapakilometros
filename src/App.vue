<template>
  <v-app>
    <v-app-bar app v-if="getUserName">
      <v-row>
        <v-col>
          <v-btn @click="doLogout">Logout</v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import { auth } from "@/main";
export default {
  name: "App",

  data: () => ({
    //
  }),
  computed: {
    ...mapGetters(["getUserName"])
  },
  methods: {
    doLogout() {
      auth.signOut();
    }
  }
};
</script>
