<script lang="ts">

export type VForm = { validate: () => Promise<{valid: boolean}> }

export default {
  data() {
    return {
      open: false,
      error: '',
      nameRules: [(v: string) => !!v || 'Naam is verplicht'],
      distanceRules: [(v: string) => !!v || 'Afstand is verplicht'],
      location: {
        name: '',
        distance: null
      }
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
  },
  computed: {
    form(): VForm {
      return this.$refs.form as VForm
    }
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
          <v-number-input v-model="location.distance"
                          label="Afstand"
                          :rules="distanceRules"
          ></v-number-input>
          <v-text-field v-model="location.distance"
                        :rules="distanceRules"
                        label="Afstand"></v-text-field>
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
