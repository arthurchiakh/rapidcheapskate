<template>
  <div class="is-text-centered">
    <p class="is-size-6">I am working from</p>
    <div class="is-size-6">
      <div class="buttons are-small is-centered my-0">
        <button
          v-for="workingDaySet in workingDaySets"
          class="button is-light is-rounded"
          @click="model = workingDaySet.value"
          :key="workingDaySet.value.join(',')"
        >
          {{ workingDaySet.label }}
        </button>
      </div>
      <div class="buttons is-centered">
        <button
          v-for="(n, i) in 7"
          class="button is-responsive"
          :class="{ 'is-primary': model?.includes(i) }"
          :key="i"
          @click="
            model = model?.includes(i) ? model?.filter((x) => x !== i) : [...(model ?? []), i]
          "
        >
          {{ WorkingDay[i] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WorkingDay } from '@/services/getPassUtilization';
import { defineModel } from 'vue';

const workingDaySets: { label: string; value: WorkingDay[] }[] = [
  {
    label: 'Monday - Friday',
    value: [
      WorkingDay.Monday,
      WorkingDay.Tuesday,
      WorkingDay.Wednesday,
      WorkingDay.Thursday,
      WorkingDay.Friday
    ]
  },
  {
    label: 'Monday - Saturday',
    value: [
      WorkingDay.Monday,
      WorkingDay.Tuesday,
      WorkingDay.Wednesday,
      WorkingDay.Thursday,
      WorkingDay.Friday,
      WorkingDay.Saturday
    ]
  },
  {
    label: 'Everyday 😭',
    value: [
      WorkingDay.Sunday,
      WorkingDay.Monday,
      WorkingDay.Tuesday,
      WorkingDay.Wednesday,
      WorkingDay.Thursday,
      WorkingDay.Friday,
      WorkingDay.Saturday
    ]
  }
];

let model = defineModel<WorkingDay[]>({
  default: [
    WorkingDay.Monday,
    WorkingDay.Tuesday,
    WorkingDay.Wednesday,
    WorkingDay.Thursday,
    WorkingDay.Friday
  ]
});
</script>

<style></style>
@/services/getPassUtilization
