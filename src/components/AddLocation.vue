<script lang="ts">

import { PropType } from "vue";
import { HOME, Location } from "@/model/model";

export type VForm = {
  validate: () => Promise<{valid: boolean}> ,
  reset: () => void
}
export interface Address {
  addresstype: string;
  display_name: string;
  lat: string;
  lon: string;
  name: string;
}

export default {
  props: {
    locations: Object as PropType<Location[]>
  },
  data() {
    return {
      open: false,
      error: '',
      nameRules: [(v: string) => !!v || 'Naam is verplicht'],
      distanceRules: [(v: string) => !!v || 'Afstand is verplicht'],
      location: {
        name: '',
        address: '',
        distance: null as number | null,
        lat: 0,
        lon: 0
      },
      addressTimer: -1,
      addressSearch: '',
      addresses: [] as Address[],
      address: undefined as Address | undefined,
      addressLoading: false
    }
  },
  methods: {
    async saveLocation() {
      const valid = await this.form.validate();
      if (valid.valid) {
        const requestOptions = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(this.$data.location)
        };
        fetch("api/location", requestOptions)
            .then(async response => {
              if (response.ok) {
                this.open = false;
                this.$emit('location', await response.json())
              } else {
                this.error = response.statusText
              }
            });
      }
    },

    getAddresses() {
      if (!this.addressSearch) {
        this.addresses = [];
        return;
      }
      this.addressLoading = true;
      fetch('https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
        format: 'json',
        q: this.addressSearch,
      }).toString()).then(async places => {
        this.addresses = await places.json();
        this.addressLoading = false;
      });
    },
  },
  computed: {
    form(): VForm {
      return this.$refs.form as VForm
    },
    distanceReturn: {
      get() {
        return (this.location.distance ?? 0) * 2;
      },
      set(value: string) {},
    },
    home() {
      return this.locations?.find(loc => loc.name === HOME);
    }
  },
  watch: {
    open(open: boolean) {
      if (!open) {
        this.form.reset();
        this.error = '';
      }
    },
    address(val: Address) {
      if (val) {
        this.location.lat = parseFloat(val.lat);
        this.location.lon = parseFloat(val.lon);
        if (this.home) {
          fetch(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${this.home.lon},${this.home.lat};${val.lon},${val.lat}`).then(async places => {
            const response = await places.json();
            this.location.distance = Math.ceil(response.routes[0].distance / 1000);
          });
        }
      }
    },
    addressSearch() {
      clearTimeout(this.addressTimer);
      this.addressTimer = setTimeout(() => this.getAddresses(), 250);
    },
    distanceReturn() {}
  }
}
</script>

<template>
  <v-btn
      @click="open = true"
      color="surface-variant"
      text="Toevoegen"
      variant="plain"
  ></v-btn>
  <v-dialog max-width="500" :model-value="open">
    <v-card title="Locatie toevoegen">
      <v-form ref="form" @submit.prevent="saveLocation">
        <v-card-text>
          <v-alert
              v-if="error"
              :text="error"
              title="Failed to save location"
              type="error"
          ></v-alert>
          <v-text-field v-model="location.name"
                        :rules="nameRules"
                        label="Naam"></v-text-field>
          <v-autocomplete
            :loading="addressLoading"
            :items="addresses"
            @update:search="addressSearch = $event"
            v-model="address"
            no-filter
            label="Search location"
            menu-item=""
            menu-icon=""
            item-title="display_name"
            :return-object="true"
            append-inner-icon="mdi-magnify"
            @click:append-inner="getAddresses()"
            @keydown.enter="getAddresses()"
          ></v-autocomplete>

          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="location.lat"
                :disabled="true"
                label="Latitude"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="location.lon"
                :disabled="true"
                label="Longitude"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="home" dense>
            <v-text-field v-model="location.distance"
                          label="Afstand"
                          suffix="km"
                          :rules="distanceRules"
            ></v-text-field>
            <v-text-field v-model="distanceReturn"
                          label="Afstand retour"
                          suffix="km"
                          :disabled="true"
            ></v-text-field>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text="Annuleren" variant="plain" @click="open = false"></v-btn>
          <v-btn
              color="primary"
              text="Toevoegen"
              variant="tonal"
              type="submit"
          ></v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>
