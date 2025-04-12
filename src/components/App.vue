<script setup lang="ts">
import ArmorSelect from "./ArmorSelect.vue";

import { getSkills } from "../scripts/skill";
import { getArmors } from "../scripts/api";
import { getDecorations } from "../scripts/decorations";
import { ref } from "vue";

const allSkills = await getSkills();
const [allArmors, allDecorations] = await Promise.all([getArmors(allSkills), getDecorations(allSkills)]);

const selected = ref("");
function handler(item: string) {
    selected.value = item;
}
</script>

<template>
    <ArmorSelect :all-armors="allArmors" :all-skills="allSkills" :all-decorations="allDecorations" @update="handler" />

    <div class="p-4">{{ selected }}</div>
</template>
