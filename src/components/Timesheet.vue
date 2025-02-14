<script lang="ts">
  import { PropType } from 'vue';
  import { DayType, ConfiguredTimesheet, Day, Location } from '@/model/model';
  import AddLocation from "@/components/AddLocation.vue";

  export default {
    components: {AddLocation},
    props: {
      timesheet: Object as PropType<ConfiguredTimesheet>,
      locations: Object as PropType<Location[]>
    },
    data() {
      return {
        daytypes: new Map<DayType, string>([
          ['WORK', 'Klant'],
          ['CLANDAY', 'Clanday'],
          ['LEAVE', 'Verlof'],
          ['SICK', 'Ziek'],
        ]),
        mousedown: false
      }
    },
    methods: {
      isSelectable(day: Day) {
        return !['HOLIDAY', 'WEEKEND'].includes(day.type);
      },
      isOffice(type: DayType) {
        return ['WORK', 'CLANDAY'].includes(type);
      },
      select(type: DayType, index: number) {
        if (this.isSelectable(this.timesheet!.days[index])) {
          const day = this.timesheet!.days[index];
          day.type = type;
          if (!this.isOffice(type)) {
            day.location = undefined;
          }
        }
      },
      selectLocation(type: number, index: number) {
        this.timesheet!.days[index].location = type;
      },
      count(type: DayType) {
        return this.timesheet!.days.filter(day => day.type === type).length;
      },
      countLocations(location: number) {
        return this.timesheet!.days.filter(day => day.location === location).length;
      }
    },
    mounted() {
      document.addEventListener("mousedown", () => this.mousedown = true);
      document.addEventListener("mouseup", () => this.mousedown = false);
    }
  }
</script>

<template>
  <div class="timesheet">
    <!-- Title column -->
    <div class="column">
      <div class="font-weight-bold">Dagen</div>
      <div v-for="[type, display] in daytypes" :key="type">{{ display }}</div>
      <div class="location font-weight-bold">Locatie</div>
      <div v-for="location in locations" :key="location.name">{{ location.name }}</div>
      <em v-if="!locations?.length">Geen locaties</em>
      <div>
        <AddLocation :locations="locations" @location="locations!.push($event)"></AddLocation>
      </div>
    </div>

    <!-- Timesheet -->
    <div class="days">
      <div v-for="(day, index) in timesheet!.days" :key="index"
           class="column"
           :class="{'not-selectable': !isSelectable(day)}">
        <div>{{index + 1}}</div>

        <div v-for="[dayType] in daytypes" :key="dayType"
             class="daytype"
             :class="{ active: day.type === dayType }"
             v-on:mousedown="select(dayType, index)"
             v-on:mouseover="mousedown ? select(dayType, index) : {}">&nbsp;</div>

        <div class="location">&nbsp;</div>

        <template v-for="location in locations" :key="location.id">
          <div v-if="isOffice(day.type)"
               :class="{ active: timesheet!.days[index].location == location.id }"
               class="daytype"
               v-on:mousedown="selectLocation(location.id, index)"
               v-on:mouseover="mousedown ? selectLocation(location.id, index) : {}">&nbsp;</div>
          <div v-else class="not-selectable">&nbsp;</div>
        </template>
      </div>
    </div>

    <!-- Total column -->
    <div class="column font-weight-bold">
      <div>Totaal</div>
      <div v-for="[dayType] in daytypes" :key="dayType">{{ count(dayType) }}</div>
      <div class="location">&nbsp;</div>
      <div v-for="location in locations" :key="location.id">{{ countLocations(location.id) }}</div>
    </div>
  </div>
</template>

<style scoped>
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
