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
        timesheet: {
          types: [] as DayType[],
          monthDisplay: ''
        },
        mousedown: false
      }
    },
    methods: {
      async getData() {
        fetch("api/timesheet")
            .then(response => response.json())
            .then(data => this.timesheet = data);
      },
      isSelectable(type: DayType) {
        return !['HOLIDAY', 'WEEKEND'].includes(type);
      },
      select(type: DayType, index: number) {
        if (this.isSelectable(this.timesheet.types[index])) {
          this.timesheet.types[index] = type;
        }
      },
      count(type: DayType) {
        return this.timesheet.types.filter(t => t === type).length;
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
    <div class="column">
      <div>Dagen</div>
      <div v-for="[type, display] in daytypes" :key="type">{{ display }}</div>
    </div>
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
      </div>
    </div>
    <div class="column font-weight-bold">
      <div>Totaal</div>
      <div v-for="[dayType] in daytypes" :key="dayType">{{ count(dayType) }}</div>
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
  .column {
    user-select: none;
    &.not-selectable {
      background-color: #413e3e;
    }
    div {
      text-align: center;
      padding: 4px 0;
      &:first-of-type {
        border-bottom: 1px solid gray;
      }
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
