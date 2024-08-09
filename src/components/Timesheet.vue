<script lang="ts">
  import { DayType } from '@/model/DayType';

  export default {
    data() {
      return {
        daytypes: new Map<DayType, string>([
            ['WORK', 'Klant'],
            ['LEAVE', 'Verlof'],
            ['CLANDAY', 'Clanday'],
            ['SICK', 'Ziek'],
        ]),
        locations: {
          HOME: { icon: '🏠', title: 'Thuis' },
          ARNHEM: { icon: '🏢', title: 'Arnhem' },
          DUIVEN: { icon: '🐦', title: 'Duiven' }
        },
        timesheet: {
          types: [] as DayType[],
          locations: [] as (string | undefined)[],
          monthDisplay: ''
        },
        mousedown: false
      }
    },
    methods: {
      async getData() {
        fetch("api/timesheet")
            .then(response => response.json())
            .then(data => {
              const locs = Object.keys(this.locations);
              this.timesheet = data;
              this.timesheet.locations = data.types.map(t => this.isOffice(t) ? locs[Math.floor(Math.random() * locs.length)] : undefined)
            });
      },
      isSelectable(type: DayType) {
        return !['HOLIDAY', 'WEEKEND'].includes(type);
      },
      isOffice(type: DayType) {
        return ['WORK', 'CLANDAY'].includes(type);
      },
      select(type: DayType, index: number) {
        if (this.isSelectable(this.timesheet.types[index])) {
          this.timesheet.types[index] = type;
          if (!this.isOffice(type)) {
            this.timesheet.locations[index] = undefined;
          }
        }
      },
      selectLocation(type: string, index: number) {
        this.timesheet.locations[index] = type;
      },
      count(type: DayType) {
        return this.timesheet.types.filter(t => t === type).length;
      },
      countLocations(location: string) {
        return this.timesheet.locations.filter(t => t === location).length;
      },
      submit() {

      }
    },
    mounted() {
      this.getData();
      document.addEventListener("mousedown", () => this.mousedown = true);
      document.addEventListener("mouseup", () => this.mousedown = false);
    }
  }
</script>

<template>
  <h1>{{timesheet.monthDisplay}}</h1>
  <div class="timesheet">
    <!-- Title column -->
    <div class="column">
      <div class="font-weight-bold">Dagen</div>
      <div v-for="[type, display] in daytypes" :key="type">{{ display }}</div>
      <div class="location font-weight-bold">Locatie</div>
      <div v-for="(location) in locations" :key="location.title">{{ location.title }}</div>
    </div>

    <!-- Timesheet -->
    <div class="days">
      <div v-for="(type, index) in timesheet.types" :key="type"
           class="column"
           :class="{'not-selectable': !isSelectable(type)}">
        <div>{{index + 1}}</div>

        <div v-for="[dayType] in daytypes" :key="dayType"
             class="daytype"
             :class="{ active: type === dayType }"
             v-on:mousedown="select(dayType, index)"
             v-on:mouseover="mousedown ? select(dayType, index) : {}">&nbsp;</div>

        <div class="location">&nbsp;</div>

        <template v-for="(location, key) in locations" :key="key">
          <div v-if="isOffice(type)"
               v-on:click="selectLocation(key, index)"
               :class="{ active: timesheet.locations[index] === key }"
               class="daytype">{{ location.icon }}</div>
          <div v-else class="not-selectable">&nbsp;</div>
        </template>
      </div>
    </div>

    <!-- Total column -->
    <div class="column font-weight-bold">
      <div>Totaal</div>
      <div v-for="[dayType] in daytypes" :key="dayType">{{ count(dayType) }}</div>
      <div class="location">&nbsp;</div>
      <div v-for="(_, key) in locations" :key="key">{{ countLocations(key) }}</div>
    </div>
  </div>

  <v-btn v-on:click="submit()" class="mt-6"  variant="outlined">
    Submit
  </v-btn>
</template>

<style scoped>
  h1 {
    margin: 12px;
  }
  .timesheet {
    display: grid;
    grid-row-gap: 16px;
    grid-template-columns: 100px auto 100px;
  }
  .days {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
  }
  .not-selectable {
    background-color: #413e3e;
  }
  .column {
    user-select: none;
    > div {
      text-align: center;
      padding: 4px 0;
      &:first-of-type {
        border-bottom: 1px solid gray;
      }
    }
    .location {
      border-top: 1px solid gray;
    }

    &:not(.not-selectable) .daytype {
      transition: background-color ease-in-out .15s;
      cursor: pointer;
      &:hover {
        background-color: beige;
      }
    }
  }

  .active {
    background-color: green;
  }
</style>
