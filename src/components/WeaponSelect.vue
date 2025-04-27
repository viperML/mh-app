<script setup lang="ts">
import { computed, reactive, useTemplateRef, watchEffect } from "vue";
import type { Weapon } from "../scripts/weapon";
import { parseNumber } from "../scripts/util";
import DecorationBtn from "./DecorationBtn.vue";
import type { DecorationDisplay } from "./App.vue";
import { GSIcon } from "../assets/weaponIcons";

const props = defineProps<{
    decorationDisplay: DecorationDisplay;
}>();

const KEYS = {
    CUSTOM_DMG: "customWeaponDamage",
    CUSTOM_AFF: "customWeaponAffinity",
};

const weapon = reactive<Weapon>({
    id: NaN,
    damage: parseNumber(localStorage.getItem(KEYS.CUSTOM_DMG) ?? "none") ?? 200,
    affinity: parseNumber(localStorage.getItem(KEYS.CUSTOM_AFF) ?? "none") ?? 0,
    skills: [],
});

const emits = defineEmits<{
    "update:weapon": [Weapon];
}>();

watchEffect(() => {
    localStorage.setItem(KEYS.CUSTOM_DMG, String(weapon.damage));
    localStorage.setItem(KEYS.CUSTOM_AFF, String(weapon.affinity));
});

watchEffect(() => {
    emits("update:weapon", weapon);
});

const displayedAffinity = computed<number>({
    get: () => weapon.affinity * 100,
    set: val => {
        weapon.affinity = val / 100;
    },
});

const dmgInput = useTemplateRef("dmgInput");
const affInput = useTemplateRef("affInput");

const iconSize = 20;
import AttackIcon from "../assets/attac_icons_mhw_wiki_guide.png";
import AffinityIcon from "../assets/affinity_icons_mhw_wiki_guide.png";
</script>

<template>
    <div class="mh-weapon rounded-xl grid grid-cols-1 gap-y-2 lg:grid-cols-[auto_200px] gap-2">
        <div class="flex gap-2 flex-col">
            <div class="flex flex-row items-center gap-2 p-2 bg-zinc-800 rounded-lg">
                <img :src="GSIcon.src" :width="20" :height="20" />
                <h2>Custom Weapon</h2>
            </div>

            <div class="flex flex-row gap-2 justify-items-center">
                <div class="mh-number grid-cols-[auto_1fr] bg-red-950 text-red-200" @click="_ => dmgInput?.focus()">
                    <img :src="AttackIcon.src" :width="iconSize" :height="iconSize" />
                    <input ref="dmgInput" v-model.number="weapon.damage" type="number" />
                </div>

                <div
                    class="mh-number mh-affinity grid-cols-[auto_1fr_auto] bg-purple-950 text-purple-200"
                    @click="_ => affInput?.focus()"
                >
                    <img :src="AffinityIcon.src" :width="iconSize" :height="iconSize" />
                    <input ref="affInput" v-model.number="displayedAffinity" type="number" />
                </div>
            </div>
        </div>

        <div class="grid gap-1">
            <DecorationBtn :decorationDisplay v-for="slotId of [1, 2, 3]" v-bind:key="slotId" />
        </div>
    </div>
</template>

<style scoped>
@reference "../styles/main.css";
input {
    width: 100%;
    text-align: center;
}

.mh-number {
    /* width: 200px; */
    display: grid;
    align-items: center;
    width: 100px;
    padding: --spacing(0.5);
    font-weight: 700;
    @apply rounded-full px-3;
}

.mh-affinity::after {
    content: "%";
}

input:focus {
    outline: none;
}
</style>
