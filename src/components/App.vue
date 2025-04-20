<script setup lang="ts">
import ArmorSelect from "./ArmorSelect.vue";

import { getSkills, mergeSkillRanks, mergeSkillsRanksInto, type MergedSkills } from "../scripts/skill";
import { getArmors } from "../scripts/api";
import { getDecorations } from "../scripts/decorations";
import { computed, ref, watchEffect } from "vue";
import type { ArmorEmits } from "./ArmorSelect.vue";
import { efr } from "../scripts/efr";
import WeaponSelect from "./WeaponSelect.vue";
import type { Weapon } from "../scripts/weapon";

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

const mergedSkills = computed(() => {
    const res: MergedSkills = new Map();
    if (armorEmits.value?.armor) {
        for (const [, piece] of Object.entries(armorEmits.value.armor)) {
            if (piece) {
                mergeSkillsRanksInto(res, ...piece.skills);
            }
        }
    }
    if (armorEmits.value?.decorations) {
        for (const [, decos] of Object.entries(armorEmits.value.decorations)) {
            for (const [, deco] of Object.entries(decos)) {
                if (deco) {
                    mergeSkillsRanksInto(res, ...deco.skills);
                }
            }
        }
    }
    return res;
});

const weapon = ref<Weapon>();

const myEfr = computed(() => {
    if (weapon.value) {
        return efr({
            attack: weapon.value.damage,
            affinity: weapon.value.affinity,
            skills: mergedSkills.value,
        });
    } else {
        return undefined;
    }
});
</script>

<template>
    <button class="p-2 bg-amber-600 text-black" @click="swapDecorationDisplay">
        Decoration display: {{ decorationDisplay }}
    </button>

    <WeaponSelect
        v-model:weapon="weapon"
    />

    <ArmorSelect
        :all-armors="allArmors"
        :all-skills="allSkills"
        :all-decorations="allDecorations"
        :decoration-display="decorationDisplay"
        @update:armor="e => (armorEmits = e)"
    />

    <div class="grid grid-cols-1 gap-2">
        <span class="p-2 bg-teal-950 text-white" v-for="[skill, level] of mergedSkills" v-bind:key="skill">
            {{ skill }} @ {{ level }}
        </span>
    </div>

    <div>EFR: {{ myEfr }}</div>
</template>
