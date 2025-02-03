<script lang="ts">
import { ConfiguredTimesheet, Location } from '@/model/model';
import { PropType } from 'vue';

export default {
    props: {
      timesheet: Object as PropType<ConfiguredTimesheet>,
      locations: Object as PropType<Location[]>
    },
    data() {
      return {
      }
    },
    methods: {
      downloadTimesheet() {
        this.download('timesheet');
      },
      downloadReiskosten: async function () {
        this.download('reiskosten');
      },
      download(endpoint: string) {
        fetch(`api/excel/${endpoint}`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.timesheet)
        })
            .then(res => res.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              document.body.appendChild(a);
              a.style.display = "none";
              a.href = url;
              a.download = `${endpoint}-${this.timesheet!.monthDisplay.replaceAll(' ', '-')}.xlsx`;
              a.click();
              window.URL.revokeObjectURL(url);
            })
      },
      thuiswerkdagen() {
        const home = this.locations!.find(loc => loc.name === 'Thuis')!.id;
        return this.timesheet!.days.filter(day => day.location === home).length;
      },
      kilometers() {
        return this.timesheet!.days
            .map(day => this.locations!.find(loc => loc.id === day.location!)!)
            .filter(loc => loc && loc.name !== 'Thuis')
            .map(loc => loc.distance)
            .reduce((sum, a) => sum + a, 0);
      },
      currency (num: any) {
        return '€ ' + parseFloat(num).toFixed(2);
      },
      copy(ev: PointerEvent) {
        navigator.clipboard.writeText((ev.target as HTMLElement).closest('div')!.innerText)
      }
    },
  }
</script>

<template>
  <div>
    <h3>Timesheet</h3>
    <v-btn v-on:click="downloadTimesheet()" class="mt-6"  variant="outlined">
      Download timesheet
    </v-btn>
  </div>

  <div>
    <h3>Reiskosten</h3>
    <div>
      Reiskosten {{timesheet!.monthDisplay}} ({{ kilometers() }} km * €0,23): {{ currency(kilometers() * 0.23) }}

      <v-btn v-on:click="copy($event)" icon="mdi-content-copy"></v-btn>
    </div>
    <v-btn v-on:click="downloadReiskosten()" class="mt-6"  variant="outlined">
      Download reiskosten
    </v-btn>
  </div>

  <div>
    <h3>Thuiswerkvergoeding</h3>
    <div>
      Thuiswerkvergoeding {{timesheet!.monthDisplay}} ({{thuiswerkdagen()}} dagen * €2,40): {{ currency(thuiswerkdagen() * 2.4) }}
      <v-btn v-on:click="copy($event)" icon="mdi-content-copy"></v-btn>
    </div>
  </div>
</template>

<style scoped>
  h3 {
    margin-top: 24px;
  }
</style>
