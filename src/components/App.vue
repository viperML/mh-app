<script setup lang="ts">
import ArmorSelect from "./ArmorSelect.vue";

import { getSkills } from "../scripts/skill";
import { getArmors } from "../scripts/api";
import { getDecorations } from "../scripts/decorations";
import { ref } from "vue";
import type { ArmorEmits } from "./ArmorSelect.vue";

const allSkills = await getSkills();
const [allArmors, allDecorations] = await Promise.all([getArmors(allSkills), getDecorations(allSkills)]);

const armorEmits = ref<ArmorEmits>();

export type DecorationDisplay = "name" | "skills";

const decorationDisplay = ref((localStorage.getItem("decoration-display") ?? "name") as DecorationDisplay);
function swapDecorationDisplay() {
    if (decorationDisplay.value === "name") {
        decorationDisplay.value = "skills";
    } else {
        decorationDisplay.value = "name";
    }
    localStorage.setItem("decoration-display", decorationDisplay.value);
}
</script>

<template>
    <button class="p-2 bg-amber-600 text-black" @click="swapDecorationDisplay">
        Decoration display: {{ decorationDisplay }}
    </button>

    <ArmorSelect
        :all-armors="allArmors"
        :all-skills="allSkills"
        :all-decorations="allDecorations"
        :decoration-display="decorationDisplay"
    />

    <div v-for="(armor, kind) of armorEmits?.armor" v-bind:key="kind">{{ kind }} -> {{ armor?.name }}</div>
</template>
