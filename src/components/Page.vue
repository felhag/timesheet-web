<script lang="ts">
import { ConfiguredTimesheet, Locations } from '@/model/model';
import Timesheet from '@/components/Timesheet.vue';
import Result from '@/components/Result.vue';

export default {
  components: {Timesheet, Result},
  data() {
    return {
      page: 'configure' as 'configure' | 'result',
      locations: {} as Locations,
      timesheet: {
        days: [],
        monthDisplay: ''
      } as ConfiguredTimesheet,
    }
  },
  methods: {
    getData: async function () {
      fetch("api/timesheet")
          .then(response => response.json())
          .then(data => this.timesheet = data);
      fetch("api/locations")
          .then(response => response.json())
          .then(data => this.locations = data)
    },
    submit() {
      this.page = 'result';
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<template>
  <h1>
    <v-btn
        v-if="page === 'result'"
        v-on:click="page = 'configure'"
        icon="mdi-chevron-left"
        variant="text"
    ></v-btn>
    {{ timesheet.monthDisplay }}
  </h1>

  <div v-if="page === 'configure'">
    <Timesheet :timesheet="timesheet"
               :locations="locations"></Timesheet>

    <v-btn v-on:click="submit()" class="mt-6"  variant="outlined">
      Submit
    </v-btn>
  </div>

  <div v-if="page === 'result'">
    <Result :timesheet="timesheet" :locations="locations"></Result>
  </div>
</template>

<style scoped>
  h1 {
    margin: 12px 0;
  }
</style>
