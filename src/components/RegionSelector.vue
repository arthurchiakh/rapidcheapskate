<template>
  <div class="is-text-centered">
    <p lass="is-size-6">Public holiday follows</p>
    <div class="is-size-4">
      <div class="button" @click="navigateTo(Direction.Left)">
        <span class="icon">◀</span>
      </div>
      <span class="mx-2">{{ displayOptionLabel() }}</span>
      <div class="button" @click="navigateTo(Direction.Right)">
        <span class="icon">▶</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Region } from '@/services/getPublicHoliday';

enum Direction {
  Left = -1,
  Right = 1
}

let model = defineModel<Region>();

let regionOptions: { label: string; value: Region }[] = [
  {
    label: 'Kuala Lumpur',
    value: Region.KualaLumpur
  },
  {
    label: 'Selangor',
    value: Region.Selangor
  }
];

let selectedIndex = ref<number>(0);

const navigateTo = (direction: Direction) => {
  selectedIndex.value =
    (regionOptions.length + selectedIndex.value + direction) % regionOptions.length;
};

watch(
  selectedIndex,
  (newSelectedIndex, oldSelectedIndex) => {
    if (newSelectedIndex === oldSelectedIndex) return;
    model.value = regionOptions[newSelectedIndex].value;
  },
  { immediate: true }
);

const displayOptionLabel = (): string => regionOptions[selectedIndex.value].label;
</script>
