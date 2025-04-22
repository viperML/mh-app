<script setup lang="ts">
import ArmorSelect from "./ArmorSelect.vue";

import { getSkills, mergeSkillsRanksInto2, type MergedSkills2 } from "../scripts/skill";
import { getArmors } from "../scripts/api";
import { getDecorations } from "../scripts/decorations";
import { computed, reactive, ref, watchEffect } from "vue";
import type { ArmorEmits } from "./ArmorSelect.vue";
import WeaponSelect from "./WeaponSelect.vue";
import type { Weapon } from "../scripts/weapon";
import SkillDisplay from "./SkillDisplay.vue";
import GlobalSettings, { type DecorationDisplay } from "./GlobalSettings.vue";
import { readSettings } from "../scripts/settings";

const allSkills = await getSkills();
const [allArmors, allDecorations] = await Promise.all([getArmors(allSkills), getDecorations(allSkills)]);

const armorEmits = ref<ArmorEmits>();

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

watchEffect(() => {
    for (const [skillId, skillRank] of mergedSkills.value) {
        console.log(allSkills.get(skillId)?.name, "=>", skillRank);
        console.log(allSkills.get(skillId)?.iconKind);
    }
});

const weapon = ref<Weapon>();

const settings = ref(readSettings());
</script>

<template>
    <main class="grid grid-cols-1 lg:grid-cols-[500px_300px] gap-y-10 gap-x-4">
        <div class="col-span-full w-max justify-self-center">
            <GlobalSettings v-model="settings" />
        </div>

        <div class="mh-card grid grid-cols-1 gap-3 mh-equipment">
            <WeaponSelect v-model:weapon="weapon" :decoration-display="settings.decorationDisplay" />

            <ArmorSelect
                :all-armors="allArmors"
                :all-skills="allSkills"
                :all-decorations="allDecorations"
                :decoration-display="settings.decorationDisplay"
                @update:armor="e => (armorEmits = e)"
            />
        </div>

        <div class="mh-card bg-zinc-800 p-4 rounded-2xl h-fit">
            <h2 class="mb-3">Stats</h2>

            <div class="grid grid-cols-2">
                <SkillDisplay
                    v-for="[skillId, level] of mergedSkills"
                    v-bind:key="String(skillId)"
                    :skill-rank="{
                        level,
                        skill: allSkills.get(skillId)!,
                    }"
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
