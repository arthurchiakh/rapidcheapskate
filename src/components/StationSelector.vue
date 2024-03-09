<template>
  <div class="control">
    <input
      type="text"
      class="input"
      :value="stationName"
      readonly
      @click.self="isModalActive = !isModalActive"
    />
    <div class="modal" :class="{ 'is-active': isModalActive }">
      <div class="modal-background" @click.self="isModalActive = false"></div>
      <div class="modal-card" style="height: 100%">
        <header class="modal-card-head">
          <div class="rows" style="width: 100%">
            <div class="row" style="margin-bottom: 30px">
              <div class="control">
                <button class="delete is-pulled-right" @click="isModalActive = false"></button>
              </div>
            </div>
            <div class="row">
              <div class="field">
                <div class="control has-icons-right">
                  <input
                    type="text"
                    class="input"
                    @input="debounceSearch"
                    :value="stationSearchString"
                  />
                  <span class="icon is-small is-right">🔍</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section class="modal-card-body">
          <div class="menu">
            <template v-for="option in stationsGroupByLineOptionList">
              <template v-if="option.disabled">
                <p class="menu-label" :key="option.value">
                  <u
                    ><b>{{ option.name }}</b></u
                  >
                </p>
              </template>
              <template v-else>
                <ul class="menu-list" :key="option.value">
                  <li
                    @click="
                      () => {
                        model = option.value;
                      }
                    "
                  >
                    <a :class="{ 'is-active': option.value == model }">{{ option.name }}</a>
                  </li>
                </ul>
              </template>
            </template>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { type Station, stations } from '../assets/data/stations';

let model = defineModel();
let stationName = ref<string>();
let isModalActive = ref(false);
let stationSearchString = ref('');
let timeout: any = null;

watch(
  model,
  (newModel) => {
    isModalActive.value = false;
    stationSearchString.value = '';
    let station = stations.find((s) => s.code == newModel);
    stationName.value = station?.stationName ?? '';
  },
  { immediate: true }
);

const debounceSearch = (e: Event) => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    stationSearchString.value = (e.target as HTMLInputElement).value;
  }, 200);
};

// Build the list of stations grouped by station line
interface StationSelection {
  value: string;
  name: string;
  disabled: boolean;
}

const stationsGroupByLineOptionList = computed(() => {
  let currentLineName = ''; // Temp variable
  let formattedStationData: StationSelection[] = []; // Return object
  let filteredStations: Station[] = [];

  if (stationSearchString.value != '')
    // Search on station name
    filteredStations = stations.filter(
      (s) => s.stationName.toLowerCase().indexOf(stationSearchString.value.toLowerCase()) != -1
    );
  else filteredStations = stations;

  filteredStations.forEach((station) => {
    if (currentLineName !== station.lineName) {
      formattedStationData.push({
        value: station.lineName,
        name: station.lineName,
        disabled: true
      });

      currentLineName = station.lineName;
    }

    formattedStationData.push({
      value: station.code,
      name: station.stationName,
      disabled: false
    });
  });

  return formattedStationData;
});
</script>
