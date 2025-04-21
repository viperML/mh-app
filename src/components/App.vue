<script setup lang="ts">
import ArmorSelect from "./ArmorSelect.vue";

import {
    getSkills,
    mergeSkillRanks,
    mergeSkillsRanksInto,
    mergeSkillsRanksInto2,
    type MergedSkills,
    type MergedSkills2,
} from "../scripts/skill";
import { getArmors } from "../scripts/api";
import { getDecorations } from "../scripts/decorations";
import { computed, ref, watchEffect } from "vue";
import type { ArmorEmits } from "./ArmorSelect.vue";
import { efr } from "../scripts/efr";
import WeaponSelect from "./WeaponSelect.vue";
import type { Weapon } from "../scripts/weapon";
import SkillDisplay from "./SkillDisplay.vue";

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
    const res: MergedSkills2 = new Map();
    if (armorEmits.value?.armor) {
        for (const [, piece] of Object.entries(armorEmits.value.armor)) {
            if (piece) {
                mergeSkillsRanksInto2(res, ...piece.skills);
            }
        }
    }
    if (armorEmits.value?.decorations) {
        for (const [, decos] of Object.entries(armorEmits.value.decorations)) {
            for (const [, deco] of Object.entries(decos)) {
                if (deco) {
                    mergeSkillsRanksInto2(res, ...deco.skills);
                }
            }
        }
    }
    return res;
});

const weapon = ref<Weapon>();

// const myEfr = computed(() => {
//     if (weapon.value) {
//         return efr({
//             attack: weapon.value.damage,
//             affinity: weapon.value.affinity,
//             skills: mergedSkills.value,
//         });
//     } else {
//         return undefined;
//     }
// });
</script>

<template>
    <main class="grid grid-cols-1 lg:grid-cols-[500px_300px] gap-y-10 gap-x-4">
        <div class="mh-card grid grid-cols-1 gap-3 mh-equipment">
            <WeaponSelect v-model:weapon="weapon" :decoration-display />

            <ArmorSelect
                :all-armors="allArmors"
                :all-skills="allSkills"
                :all-decorations="allDecorations"
                :decoration-display="decorationDisplay"
                @update:armor="e => (armorEmits = e)"
            />
        </div>

        <div class="mh-card bg-zinc-800 p-4 rounded-2xl h-fit">
            <h2 class="mb-3">Stats</h2>

            <div class="grid grid-cols-2">
                <SkillDisplay
                    v-for="[skillId, level] of mergedSkills"
                    v-bind:key="String(skillId)"
                    :skill-max-rank="allSkills.get(skillId)!.maxRank"
                    :skill-rank="level"
                    :skill-name="allSkills.get(skillId)!.name"
                />
            </div>

            <!-- <div>EFR: {{ myEfr }}</div> -->
        </div>

        <!-- <button class="p-2 bg-amber-600 text-black" @click="swapDecorationDisplay">
            Decoration display: {{ decorationDisplay }}
        </button> -->
    </main>
</template>

<style scoped>
@reference "../styles/main.css";
</style>
