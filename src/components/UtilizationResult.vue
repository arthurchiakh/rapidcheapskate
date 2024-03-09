<template>
  <div class="rows">
    <div class="row has-text-centered has-bottom-buffer">
      <span class="is-size-3 is-size-1-desktop has-text-weight-bold">Utilization</span>
    </div>
    <div class="row has-bottom-buffer">
      <div class="columns is-mobile">
        <div class="column is-half has-text-right">
          <p class="is-size-6">Utilization</p>
          <p class="is-size-1 has-text-black has-text-weight-bold">
            {{ utilization?.utilizationDayCount }}/{{ utilization?.totalDayCount }}
          </p>
        </div>
        <div class="column is-half has-text-left">
          <ul>
            <li>
              <span class="tag is-medium is-primary has-text-weight-bold"
                >Working days: {{ utilization?.workingDayCount }}</span
              >
            </li>
            <li>
              <span class="tag is-medium is-warning has-text-weight-bold"
                >Public holidays: {{ utilization?.publicHolidayCount }}</span
              >
            </li>
            <li>
              <span class="tag is-medium is-danger has-text-weight-bold"
                >Off days: {{ utilization?.offDayCount }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <table class="table is-bordered is-narrow is-hoverable is-fullwidth is-unselectable">
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tues</th>
            <th>Wed</th>
            <th>Thur</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in utilization?.calendar" :key="index">
            <td v-for="(day, index) in week" :key="index">
              <span
                v-if="day"
                class="tag has-text-weight-bold is-size-7-mobile is-size-7-touch is-size-5-tablet is-size-5-desktop is-size-5-fullhd"
                :class="[
                  { 'is-primary': day.type === DayType.WorkingDay },
                  { 'is-warning': day.type === DayType.PublicHoliday },
                  { 'is-danger': day.type === DayType.OffDay }
                ]"
                style="margin: 0px"
              >
                <VTooltip v-if="day.publicHoliday">
                  <span>{{ day.displayDate }}</span>
                  <template #popper v-if="day.publicHoliday">{{
                    day.publicHoliday?.holiday
                  }}</template>
                </VTooltip>
                <span v-else>{{ day.displayDate }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="row has-text-centered has-bottom-buffer" v-if="routeFare">
        <span class="is-size-3 is-size-1-desktop has-text-weight-bold">Cost</span>
      </div>

      <div class="row has-bottom-buffer has-text-centered" v-if="routeFare">
        <div class="control">
          <label class="radio">
            <input type="radio" name="tripType" :value="TripType.RoundTrip" v-model="tripType" />
            Round Trip
          </label>
          <label class="radio">
            <input type="radio" name="Trip" :value="TripType.SingleTrip" v-model="tripType" />
            Single Trip
          </label>
        </div>
        <div class="table-container is-unselectable">
          <table class="table is-bordered is-narrow is-hoverable is-fullwidth">
            <thead class="has-background-primary">
              <tr>
                <th></th>
                <th class="has-text-white">Cash</th>
                <th class="has-text-white">Touch&Go</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Daily</td>
                <td>{{ ringgit(routeFare.fares.cash * tripType) }}</td>
                <td>{{ ringgit(routeFare.fares.cashless * tripType) }}</td>
              </tr>
              <tr>
                <td>Utilization ({{ utilization?.utilizationDayCount }} days)</td>
                <td>
                  {{
                    ringgit(
                      routeFare.fares.cash * (utilization?.utilizationDayCount ?? 0) * tripType
                    )
                  }}
                </td>
                <td>
                  {{
                    ringgit(
                      routeFare.fares.cashless * (utilization?.utilizationDayCount ?? 0) * tripType
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td>Full ({{ utilization?.totalDayCount }} days)</td>
                <td>
                  {{ ringgit(routeFare.fares.cash * (utilization?.totalDayCount ?? 0) * tripType) }}
                </td>
                <td>
                  {{
                    ringgit(routeFare.fares.cashless * (utilization?.totalDayCount ?? 0) * tripType)
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { DayType, TripType, type PassUtilization } from '../services/getPassUtilization';
import { type RouteFare } from '../services/getRouteFare';

let tripType = ref<TripType>(TripType.RoundTrip);

defineProps<{
  utilization?: PassUtilization;
  routeFare?: RouteFare;
}>();

const ringgit = (value: number) => `Rm ${value.toFixed(2)}`;
</script>
