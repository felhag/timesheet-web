<script lang="ts">

export type VForm = { validate: () => boolean }

export default {
  data() {
    return {
      open: false,
      location: {
        name: ''
      }
    }
  },
  methods: {
    saveLocation() {
      this.form.validate();
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.$data.location)
      };
      fetch("api/location", requestOptions)
          .then(response => response.json())
          .then(json => {
            this.open = false;
            this.$emit('location', json)
          });
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
          <v-text-field v-model="location.name" label="Naam"></v-text-field>
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
