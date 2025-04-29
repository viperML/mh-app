<script setup lang="ts">
import ArmorSelect from "./ArmorSelect.vue";

import { getSkills, mergeSkillRanks, type SkillRank } from "../scripts/skill";
import { getArmors } from "../scripts/api";
import { getDecorations } from "../scripts/decorations";
import { computed, ref, watchEffect } from "vue";
import type { ArmorEmits } from "./ArmorSelect.vue";
import WeaponSelect, { type WeaponEmits } from "./WeaponSelect.vue";
import type { Weapon } from "../scripts/weapon";
import SkillDisplay from "./SkillDisplay.vue";
import GlobalSettings from "./GlobalSettings.vue";
import { readSettings } from "../scripts/settings";
import { efr, type EfrInfo, type EfrInput } from "../scripts/efr";
import Efr from "./EfrDisplay.vue";
import { getWeapons } from "../scripts/weapon";

const allSkills = await getSkills();
const [allArmors, allDecorations, allWeapons] = await Promise.all([
    getArmors(allSkills),
    getDecorations(allSkills),
    getWeapons(allSkills),
]);

console.log("allDecorations", allDecorations);

const armorEmits = ref<ArmorEmits>();
const weaponEmits = ref<WeaponEmits>();

const mergedSkills = computed(() => {
    let res: SkillRank[] = [];
    if (armorEmits.value?.armor) {
        for (const [, piece] of Object.entries(armorEmits.value.armor)) {
            if (piece) {
                res = mergeSkillRanks(...res, ...piece.skills);
            }
        }
    }
    if (armorEmits.value?.decorations) {
        for (const [, decos] of Object.entries(armorEmits.value.decorations)) {
            for (const [, deco] of Object.entries(decos)) {
                if (deco) {
                    res = mergeSkillRanks(...res, ...deco.skills);
                }
            }
        }
    }
    if (weaponEmits.value?.weapon) {
        res = mergeSkillRanks(...res, ...weaponEmits.value.weapon.skills);

        for (const [, deco] of Object.entries(weaponEmits.value.decorations)) {
            if (deco) {
                res = mergeSkillRanks(...res, ...deco.skills);
            }
        }
    }
    return res;
});

const weapon = ref<Weapon>();

const settings = ref(readSettings());

const efrInput = computed<EfrInput | undefined>(() => {
    if (weapon.value === undefined) return undefined;
    return {
        attack: weapon.value.damage,
        affinity: weapon.value.affinity,
        skills: mergedSkills.value,
    };
});

watchEffect(() => {
    console.log("efrInput", efrInput.value);
});

const myEfr = computed<EfrInfo | undefined>(() => {
    if (efrInput.value === undefined) return undefined;
    return efr(efrInput.value);
});
</script>

<template>
    <main class="grid grid-cols-1 lg:grid-cols-[500px_300px] gap-y-10 gap-x-4">
        <div class="col-span-full w-max justify-self-center">
            <GlobalSettings v-model="settings" />
        </div>

        <div class="mh-card grid grid-cols-1 gap-3 mh-equipment">
            <WeaponSelect
                v-model:weapon="weapon"
                :decoration-display="settings.decorationDisplay"
                :all-decorations="allDecorations"
                :all-weapons="allWeapons"
                @update:weapon-emits="e => (weaponEmits = e)"
            />
            <ArmorSelect
                :all-armors="allArmors"
                :all-skills="allSkills"
                :all-decorations="allDecorations"
                :decoration-display="settings.decorationDisplay"
                @update:armor="e => (armorEmits = e)"
            />
        </div>

        <div class="mh-card bg-zinc-800 p-4 rounded-2xl h-fit grid grid-cols-1 gap-2">
            <template v-if="myEfr !== undefined">
                <Efr :efr-info="myEfr" />
            </template>

            <div class="grid grid-cols-2">
                <SkillDisplay v-for="skillRank of mergedSkills" v-bind:key="String(skillRank.skill.id)" :skill-rank />
            </div>

            <span class="text-sm text-neutral-500">https://viperml.github.io/mh-app</span>
        </div>

        <!-- <button class="p-2 bg-amber-600 text-black" @click="swapDecorationDisplay">
            Decoration display: {{ decorationDisplay }}
        </button> -->
    </main>
</template>

<style scoped>
@reference "../styles/main.css";
</style>
