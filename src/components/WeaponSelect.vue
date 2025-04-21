<script setup lang="ts">
import { computed, reactive, useTemplateRef, watchEffect } from "vue";
import type { Weapon } from "../scripts/weapon";
import { parseNumber } from "../scripts/util";
import DecorationBtn from "./DecorationBtn.vue";
import type { DecorationDisplay } from "./App.vue";

const props = defineProps<{
    decorationDisplay: DecorationDisplay;
}>();

const KEYS = {
    CUSTOM_DMG: "customWeaponDamage",
    CUSTOM_AFF: "customWeaponAffinity",
};

const weapon = reactive<Weapon>({
    id: NaN,
    damage: parseNumber(localStorage.getItem(KEYS.CUSTOM_DMG) ?? "") ?? 200,
    affinity: parseNumber(localStorage.getItem(KEYS.CUSTOM_AFF) ?? "") ?? 0,
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
</script>

<template>
    <section class="grid grid-cols-2 grid-rows-3 items-center bg-zinc-900 p-10 gap-5">
        <h2 class="">Custom Weapon</h2>

        <div class="row-span-full col-start-2 grid gap-4">
            <DecorationBtn :decorationDisplay v-for="slotId of [1, 2, 3]" v-bind:key="slotId" />
        </div>

        <div class="mh-number grid-cols-[auto_1fr]" @click="_ => dmgInput?.focus()">
            Damage:
            <input ref="dmgInput" v-model.number="weapon.damage" type="number" />
        </div>

        <div class="mh-number grid-cols-[auto_1fr_auto]" @click="_ => affInput?.focus()">
            Affinity:
            <input ref="affInput" v-model.number="displayedAffinity" type="number" />
            %
        </div>
    </section>
</template>

<style scoped>
@reference "../styles/main.css";
input {
    width: 100%;
    text-align: end;
}

.mh-number {
    /* width: 200px; */
    display: grid;
    border: 1px solid var(--color-zinc-500);
    padding: --spacing(0.5);
    @apply rounded-sm;
}

input:focus {
    outline: none;
}
</style>
