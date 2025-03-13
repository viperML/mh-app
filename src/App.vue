<script setup lang="ts">
import { type ArmorSkill, armors, foldSkills, type ArmorTypes } from "./armors.ts"
import { computed, reactive, ref, watchEffect } from 'vue';

import data from "../data/armor.json";


const s: Record<string, string | undefined> = Object.fromEntries(["head", "arms"].map(name => [name, undefined]));
const selectedArmors = reactive(s);

watchEffect(() => {
  console.log(selectedArmors.head);
  console.log(selectedArmors.chest);
})
</script>

<template>
  <main class="flex flex-col items-center m-24">

    <div class="grid grid-cols-2 items-center justify-items-center">

      <template v-for="t of ['head', 'chest', 'arms']">

        <span>{{ t }}</span>
        <select v-model="selectedArmors[t]">
          <option v-for="piece of armors[t]">
            {{ piece.name }}
          </option>
        </select>

      </template>

      {{ data }}

    </div>

  </main>
</template>

<style scoped>
select {
  padding: 6px;
  border: 2px solid black;
  margin: 10px;
}
</style>
