<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Welcome</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="doLogin">Login com o google</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { auth, provider } from "@/main";
export default {
  name: "login",
  data: () => ({}),
  methods: {
    doLogin() {
      auth.signInWithRedirect(provider);
    }
  }
};
</script>
