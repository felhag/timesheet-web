<script lang="ts">
import { ConfiguredTimesheet, Locations } from '@/model/model';
import { PropType } from 'vue';

export default {
    props: {
      timesheet: Object as PropType<ConfiguredTimesheet>,
      locations: Object as PropType<Locations>
    },
    data() {
      return {
      }
    },
    methods: {
      downloadTimesheet() {

      },
      downloadReiskosten() {

      },
      thuiswerkdagen() {
        return this.timesheet!.days.filter(day => day.location === 'HOME').length;
      },
      kilometers() {
        return this.timesheet!.days
            .map(day => day.location)
            .filter(loc => loc && loc !== 'HOME')
            .map(loc => this.locations![loc!].km)
            .reduce((sum, a) => sum + a, 0);
      },
      currency (num: any) {
        return parseFloat(num).toFixed(2)
      },
    },
  }
</script>

<template>
  <div>
    Thuiswerkvergoeding ({{thuiswerkdagen()}} dagen * €2,35): €{{ currency(thuiswerkdagen() * 2.35) }}
  </div>
  <div>
    Reiskostenvergoeding ({{ kilometers() }} km * €0,23): €{{ currency(thuiswerkdagen() * 0.23) }}
  </div>
  <v-btn v-on:click="downloadTimesheet()" class="mt-6"  variant="outlined">
    Download timesheet
  </v-btn>
  <v-btn v-on:click="downloadReiskosten()" class="mt-6"  variant="outlined">
    Download reiskosten
  </v-btn>
</template>

<style scoped>
</style>
