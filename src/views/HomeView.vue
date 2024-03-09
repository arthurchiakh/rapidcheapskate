<style></style>

<template>
  <div class="container">
    <div class="card is-margin-4">
      <div class="card-content">
        <div class="row has-bottom-buffer has-text-centered">
          <div class="columns is-mobile is-centered is-vcentered">
            <div>
              <img
                src="/img/my50.png"
                alt="My50"
                style="height: 100px; width: auto; margin: 10px"
              />
            </div>
            <div>
              <label class="label is-large is-vcentered">My50 Utilization Calculator</label>
            </div>
          </div>
        </div>
        <div class="rows">
          <div class="columns is-mobile is-centered has-text-centered my-2">
            <div class="column is-half-desktop">
              <div class="field">
                <label class="label is-large">Activation Date</label>
                <div class="control has-text-centered">
                  <flat-pickr
                    v-model="activationDate"
                    class="input is-primary is-rounded has-text-centered is-size-4"
                    :config="{
                      position: 'auto center',
                      altFormat: 'F j, Y',
                      altInput: true,
                      dateFormat: 'Y-m-d',
                      minDate: '2023-01-01',
                      maxDate: '2026-12-31',
                      disableMobile: 'true'
                    }"
                    style="max-width: 500px"
                    placeholder="Select a date"
                  ></flat-pickr>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-mobile is-centered has-text-centered is-multiline my-2">
            <div class="column is-one-quarter-desktop is-full-mobile">
              <div class="field">
                <label class="label is-small-mobile">From Station</label>
                <StationSelector v-model="fromStation" />
              </div>
            </div>
            <div class="column is-one-quarter-desktop is-full-mobile">
              <div class="field">
                <label class="label is-small-mobile">To Station</label>
                <StationSelector v-model="toStation" />
              </div>
            </div>
          </div>

          <div class="columns has-bottom-buffer is-centered has-text-centered my-2">
            <WorkingDaySelector v-model="selectedWorkingDay" />
          </div>

          <div class="row has-bottom-buffer has-text-centered my-2">
            <RegionSelector v-model="selectedRegion" />
          </div>
        </div>

        <hr />

        <UtilizationResult :utilization="utilization" :routeFare="routeFare" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import RegionSelector from '@/components/RegionSelector.vue';
import StationSelector from '@/components/StationSelector.vue';
import WorkingDaySelector from '@/components/WorkingDaySelector.vue';
import UtilizationResult from '@/components/UtilizationResult.vue';
import { Region } from '@/services/getPublicHoliday';
import {
  getDayUtilization,
  WorkingDay,
  type PassUtilization
} from '../services/getPassUtilization';
import { getFare, type RouteFare } from '../services/getRouteFare';
// @ts-ignore: @types package not available
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

let activationDate = ref<string | Date>(new Date());
let fromStation = ref<string>('KJ26');
let toStation = ref<string>('KJ28');
let selectedWorkingDay = ref<WorkingDay[]>([
  WorkingDay.Monday,
  WorkingDay.Tuesday,
  WorkingDay.Wednesday,
  WorkingDay.Thursday,
  WorkingDay.Friday
]);
let selectedRegion = ref<Region>(Region.KualaLumpur);
let routeFare = ref<RouteFare>();
let utilization = ref<PassUtilization>();

watch([activationDate, fromStation, toStation, selectedWorkingDay, selectedRegion], () =>
  calculateUtilization()
);

let timeout: any = null;

const calculateUtilization = () => {
  // debounce
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(async () => {
    // Get route fare
    routeFare.value = await getFare(fromStation.value, toStation.value);

    // Get utilization
    utilization.value = await getDayUtilization(
      new Date(activationDate.value),
      selectedWorkingDay.value,
      selectedRegion.value
    );
  }, 200);
};

onMounted(() => {
  calculateUtilization();
});
</script>
