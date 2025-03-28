<script lang="ts">
import { ConfiguredTimesheet, Location, User } from '@/model/model';
import Timesheet from '@/components/Timesheet.vue';
import Result from '@/components/Result.vue';

export default {
  components: {Timesheet, Result},
  data() {
    return {
      page: 'configure' as 'configure' | 'result',
      user: {} as User,
      locations: [] as Location[],
      timesheet: {
        days: [],
        month: '',
        monthDisplay: ''
      } as ConfiguredTimesheet,
    }
  },
  methods: {
    getData: async function () {
      fetch("api/timesheet").then(response => response.json()).then(data => this.timesheet = data);
      fetch("api/location").then(response => response.json()).then(data => this.locations = data);
    },
    back() {
      if (this.page === 'result') {
        this.page = 'configure';
      } else {
        this.swapMonth(-1);
      }
    },
    next() {
      this.swapMonth(1);
    },
    swapMonth(dir: 1 | -1) {
      const [month, year] = this.timesheet!.month.split('-').map(i => parseInt(i));
      const nextMonth = month + dir;
      const next = nextMonth >= 1 && nextMonth <= 12 ? [nextMonth, year] : [nextMonth === 0 ? 12 : 1, year + dir];
      fetch(`api/timesheet/${next[0]}-${next[1]}`).then(response => response.json()).then(data => this.timesheet = data);
    },
    submit() {
      fetch(`api/timesheet`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.timesheet)
      }).then(() => this.page = 'result')
    },
    logout() {
      fetch('api/logout', {method: 'POST'}).then(() => this.user = {name:'',email:''});
    }
  },
  mounted() {
    fetch('api/auth')
      .then(user => user.json())
      .then(user => {
      this.user = user
      this.getData();
    }).catch(err => {
      window.location.href = 'api/auth'
    });
  },
  created () {
    document.title = "Codeclan Timesheet";
  }
}
</script>

<template>
  <h1>
    <v-btn
        v-on:click="back()"
        icon="mdi-chevron-left"
        variant="text"></v-btn>
    <span class="month-name"> {{ timesheet.monthDisplay }} </span>
    <v-btn
        v-if="page === 'configure'"
        v-on:click="next()"
        icon="mdi-chevron-right"
        variant="text"></v-btn>
  </h1>
  <span class="name">
    Ingelogd als {{ user.name }}

    <v-btn
      icon="mdi-logout"
      title="Uitloggen"
      variant="text"
      v-on:click="logout()"></v-btn>
  </span>

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
    display: inline-block;
  }
  .name {
    float: right;
  }
  .month-name {
    min-width: 250px;
    display: inline-block;
    text-align: center;
  }
</style>
