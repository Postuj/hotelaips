<template>
  <v-app>
    <navbar></navbar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer>
      <div class="mx-auto">
        <span>&copy; AIPS {{ new Date().getFullYear() }} </span>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "@/components/nav/Navbar";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data: () => ({
    //
  }),
  methods: {
    ...mapActions(["fetchCities"]),
  },
  mounted() {
    this.fetchCities();
  },
};
</script>
