<template>
  <v-dialog v-model="dialog" persistent max-width="420">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="!validClient"
        v-bind="attrs"
        v-on="on"
        color="black"
        class="white--text"
        width="100%"
        >next</v-btn
      >
    </template>
    <v-card>
      <v-card-title class="text-h5"> Confirm reservation </v-card-title>
      <v-card-text>
        <div class="caption mb-n1">Hotel name</div>
        <div class="black--text subtitle-1">{{ hotel.h_name }}</div>
        <div class="caption mb-n1">Hotel address</div>
        <div class="black--text subtitle-1">
          {{ hotel.h_city }}, {{ hotel.h_address }}
        </div>
        <div class="caption mb-n1">Reservation time</div>
        <div class="black--text subtitle-1">{{ start }} - {{ end }}</div>
        <div class="caption mb-n1">Price</div>
        <div class="black--text subtitle-1">{{ price }} zł</div>

        <v-divider class="mt-4 mb-n4"></v-divider>
        <v-checkbox
          v-model="confirmed"
          label="I confirm reservations with the obligation to pay."
          color="black"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="dialog = false">
          cancel
        </v-btn>
        <v-btn
          color="black"
          class="white--text"
          @click="dialog = false"
          :disabled="!confirmed"
          :loading="loader"
          @click.prevent="confirmClick"
        >
          confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: ["validClient", "client", "hotel", "price", "start", "end", "room"],
  data() {
    return {
      dialog: false,
      loader: false,
      confirmed: false,
    };
  },
  methods: {
    async confirmClick() {
      try {
        this.loader = true;
        const res = await axios.post(`http://localhost:3000/reservations`, {
          email: this.client.email,
          name: this.client.name,
          surname: this.client.surname,
          roomId: this.room.id,
          paymentId: this.client.paymentMethodId,
          startDate: new Date(this.start),
          endDate: new Date(this.end),
        });
        console.log(res);
        this.loader = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style></style>
