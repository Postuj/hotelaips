<template>
  <v-container fluid class="pa-0">
    <section id="home">
      <v-parallax
        :height="$vuetify.breakpoint.smAndDown ? 850 : 700"
        src="@/assets/backMain.jpg"
      >
        <v-theme-provider dark>
          <v-container fill-height>
            <v-row
              align="center"
              class="mt-n16 white--text mx-auto"
              justify="center"
            >
              <v-col class="white--text text-center" cols="12" tag="h1">
                <div
                  :class="[
                    $vuetify.breakpoint.smAndDown
                      ? 'display-2 ml-n6'
                      : 'display-4',
                  ]"
                  class="font-weight-bold white--text text-uppercase"
                >
                  Holiday
                </div>
                <div class="text-h3 text-uppercase font-weight-light">time</div>
              </v-col>

              <v-btn
                class="align-self-end"
                fab
                outlined
                @click="$vuetify.goTo('#hotelsForm')"
              >
                <v-icon>mdi-chevron-double-down</v-icon>
              </v-btn>
            </v-row>
          </v-container>
        </v-theme-provider>
      </v-parallax>
    </section>
    <section id="hotelsForm">
      <v-container fluid style="background: #eeeeee; padding-bottom: 140px">
        <v-form class="mx-auto" style="max-width: 900px" v-model="valid">
          <div
            class="
              text-h2 text--grey
              darken--text-2
              my-5
              text-uppercase
              font-weight-light
            "
          >
            Find hotel
          </div>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                label="Select city"
                v-model="selectedCity"
                outlined
                color="black"
                append-icon="mdi-magnify"
                :items="getCities"
                item-text="name"
                item-value="name"
                no-data-text="No cities avaiable"
                :rules="cityRules"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="startMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="startDate"
                    label="Start date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="black"
                    :rules="startDateRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  v-model="startDate"
                  @input="startMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="endMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="endDate"
                    label="End date"
                    prepend-icon="mdi-calendar"
                    color="black"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="endDateRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  v-model="endDate"
                  @input="endMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-btn
                :disabled="!valid"
                color="black"
                class="white--text"
                width="100%"
                @click.prevent="sendReservationQuery"
                >search</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </section>
    <section id="searchResults">
      <v-container fluid v-if="hotels.length > 0">
        <div class="my-6">
          <div class="mx-auto" style="max-width: 900px">
            <div
              class="
                text-h2 text--grey
                darken--text-2
                mb-4
                mt-3
                text-uppercase
                font-weight-light
              "
            >
              hotels
            </div>
            <div v-for="(hotel, i) in hotels" :key="i" class="py-2">
              <v-divider class="black"></v-divider>
              <div class="my-2 d-flex align-end">
                <div class="text-h5 black--text mr-2">
                  <!-- <span class="green--text text--darken-3"
                    >{{ hotel.minPrice }} - {{ hotel.maxPrice }} zł</span
                  >, {{ hotel.h_name }}, -->
                  <div>
                    {{ hotel.h_name }},
                    <span class="text-h6 grey--text text--darken-2">{{
                      hotel.h_city
                    }}</span>
                  </div>
                  <div class="d-flex">
                    <div
                      class="green--text text--darken-3"
                      style="padding-top: 1px"
                    >
                      {{ hotel.minPrice }} - {{ hotel.maxPrice }} zł
                    </div>
                    <v-rating
                      class="ml-3"
                      v-model="hotel.h_rating"
                      background-color="orange lighten-3"
                      color="orange"
                      dense
                      readonly
                    ></v-rating>
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-btn
                  color="black"
                  class="white--text mb-1"
                  large
                  @click.prevent="() => reserveClick(hotel)"
                  >select</v-btn
                >
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </section>
    <section id="#chooseRoom" ref="chooseRoom">
      <v-container
        v-if="selectedHotel"
        fluid
        style="background: #eeeeee"
        class="pb-7"
      >
        <div class="mx-auto" style="max-width: 900px">
          <div
            class="
              text-h2 text--grey
              darken--text-2
              mb-4
              mt-3
              text-uppercase
              font-weight-light
            "
          >
            room
          </div>
          <v-select
            outlined
            label="Room"
            color="black"
            no-data-text="Rooms currently unavaiable"
            v-model="selectedRoomId"
            :items="rooms"
            item-text="name"
            item-value="id"
          ></v-select>
          <v-btn
            color="black"
            class="white--text mt-1"
            width="100%"
            large
            :disabled="!selectedRoomId"
            @click.prevent="selectRoomClick"
            >select</v-btn
          >
        </div>
      </v-container>
    </section>
    <section id="#makeReservation" ref="makeReservation">
      <v-container v-if="selectedRoom" fluid class="pb-7">
        <div class="mx-auto" style="max-width: 900px">
          <div
            class="
              text-h2 text--grey
              darken--text-2
              mb-4
              mt-3
              text-uppercase
              font-weight-light
            "
          >
            reserve
          </div>
          <v-row>
            <v-col cols="8">
              <v-form v-model="validClient">
                <v-text-field
                  outlined
                  label="Name"
                  color="black"
                  v-model="client.name"
                  :rules="nameRules"
                ></v-text-field>
                <v-text-field
                  outlined
                  label="Surname"
                  color="black"
                  v-model="client.surname"
                  :rules="surnameRules"
                ></v-text-field>
                <v-text-field
                  outlined
                  label="Email"
                  color="black"
                  v-model="client.email"
                  :rules="emailRules"
                ></v-text-field>
                <v-select
                  outlined
                  label="Payment method"
                  v-model="client.paymentMethodId"
                  :items="paymentMethods"
                  item-text="type"
                  item-value="paymentId"
                  color="black"
                  :rules="paymentRules"
                ></v-select>
                <submit-reservation
                  :validClient="validClient"
                  :client="client"
                  :hotel="selectedHotel"
                  :room="selectedRoom"
                  :price="finalPrice"
                  :start="startDate"
                  :end="endDate"
                ></submit-reservation>
              </v-form>
            </v-col>
            <v-col cols="4">
              <div class="text-h6 text-justify ml-2">
                To make reservation in
                <span class="font-weight-bold">{{ selectedHotel.h_name }}</span>
                fill in the form and submit payment to reserve Your room. You're
                reservation will be automaticlly sent to hotel. In case of any
                problems please contact us. Reservation price is
                <span class="font-weight-bold">{{ finalPrice }} zł</span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import SubmitReservation from "@/components/reservations/SubmitReservation";

export default {
  components: {
    SubmitReservation,
  },
  data: () => ({
    valid: true,
    loader: false,
    validClient: true,
    clientLoader: false,
    selectedHotel: null,
    hotels: [],
    rooms: [],
    selectedCity: null,
    selectedRoom: null,
    selectedRoomId: null,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .substr(0, 10),
    startMenu: false,
    endMenu: false,
    client: {
      name: "",
      surname: "",
      email: "",
      paymentMethodId: null,
    },
    paymentMethods: null,
    startDateRules: [(v) => !!v || "Start date required"],
    endDateRules: [(v) => !!v || "End date required"],
    cityRules: [(v) => !!v || "City is required"],
    nameRules: [(v) => !!v || "Name is required"],
    surnameRules: [(v) => !!v || "Surname is required"],
    paymentRules: [(v) => !!v || "Payment is required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be valid",
    ],
  }),
  computed: {
    ...mapGetters(["getCities"]),
    finalPrice() {
      if (this.selectedHotel)
        return (
          this.daysBetween(new Date(this.startDate), new Date(this.endDate)) *
          this.selectedRoom.price
        );
      else return 0;
    },
  },
  methods: {
    async sendReservationQuery() {
      try {
        this.loader = true;
        const res = await axios.get(
          `http://localhost:3000/hotels/${this.selectedCity}`
        );
        this.hotels = res.data;
        this.loader = false;
        this.$nextTick(() => this.$vuetify.goTo("#searchResults"));
      } catch (error) {
        console.error(error);
      }
    },
    async reserveClick(hotel) {
      this.selectedHotel = hotel;
      const res = await axios.get(
        `http://localhost:3000/rooms/hotel/${hotel.h_hotelId}`
      );
      this.rooms = res.data.map((room, i) => {
        return {
          name: `Room ${i + 1} - ${room.r_price} zł`,
          price: room.r_price,
          id: room.r_roomId,
        };
      });
      this.$nextTick(() => this.$vuetify.goTo(this.$refs.chooseRoom));
      if (!this.paymentMethods) {
        const res = await axios.get("http://localhost:3000/payments");
        this.paymentMethods = res.data;
      }
    },
    selectRoomClick() {
      this.selectedRoom = this.rooms.find((v) => v.id === this.selectedRoomId);
      this.$nextTick(() => this.$vuetify.goTo(this.$refs.makeReservation));
    },
    daysBetween(start, end) {
      return Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
    },
  },
  watch: {
    startDate(val) {
      if (new Date(val) > new Date(this.endDate)) {
        let tmpDate = new Date(val);
        tmpDate.setDate(tmpDate.getDate() + 1);
        this.endDate = tmpDate.toISOString().substring(0, 10);
      }
    },
    endDate(val) {
      if (new Date(val) < new Date(this.startDate)) {
        let tmpDate = new Date(this.startDate);
        tmpDate.setDate(tmpDate.getDate() + 1);
        this.endDate = tmpDate.toISOString().substring(0, 10);
      }
    },
  },
};
</script>
