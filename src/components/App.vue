<script setup lang="ts">
import ArmorSelect from "./ArmorSelect.vue";

import { getSkills } from "../scripts/skill";
import { getArmors } from "../scripts/api";
import { getDecorations } from "../scripts/decorations";
import { ref } from "vue";
import type { ArmorEmits } from "./ArmorSelect.vue";

const allSkills = await getSkills();
const [allArmors, allDecorations] = await Promise.all([getArmors(allSkills), getDecorations(allSkills)]);

const em = ref<ArmorEmits>();
</script>

<template>
    <ArmorSelect :all-armors="allArmors" :all-skills="allSkills" :all-decorations="allDecorations" v-model:armor="em" />

    <div v-for="(armor, kind) of em?.armor" v-bind:key="kind">{{ kind }} -> {{ armor?.name }}</div>
</template>
