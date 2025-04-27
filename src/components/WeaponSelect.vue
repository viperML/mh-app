<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watchEffect } from "vue";
import type { Weapon } from "../scripts/weapon";
import { parseNumber } from "../scripts/util";
import DecorationBtn from "./DecorationBtn.vue";
import DecorationSelect from "./DecorationSelect.vue";
import type { DecorationDisplay } from "../scripts/settings";
import type { Decoration, DecoSlot } from "../scripts/decorations";
import { GSIcon } from "../assets/weaponIcons";

const props = defineProps<{
    decorationDisplay: DecorationDisplay;
    allDecorations: Map<number, Decoration>;
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

// Weapon decoration slots (3 slots, can be undefined or Decoration)
const weaponDecorations = reactive<Record<DecoSlot, Decoration | undefined>>({
    0: undefined,
    1: undefined,
    2: undefined,
});

// Dialog state for selecting a decoration
const decoDialogOpen = ref(false);
const decoDialogSlotLevel = ref(1); // 1, 2, or 3
const decoDialogSlotId = ref<DecoSlot | null>(null);

function openDecoDialog(slotLevel: number, slotId: DecoSlot) {
    decoDialogSlotLevel.value = slotLevel;
    decoDialogSlotId.value = slotId;
    decoDialogOpen.value = true;
}
function closeDecoDialog() {
    decoDialogOpen.value = false;
}
function updateDecoration(deco: Decoration | undefined) {
    if (decoDialogSlotId.value !== null) {
        weaponDecorations[decoDialogSlotId.value] = deco;
    }
}

const currentSelectedDecoration = computed(() => {
    if (decoDialogSlotId.value !== null) {
        return weaponDecorations[decoDialogSlotId.value];
    }
    return undefined;
});

// Example: weapon slot levels (could be dynamic in the future)
const weaponSlotLevels = [3, 3, 3];
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
            <button
                v-for="slotId in [0, 1, 2]"
                :key="slotId"
                @click="() => openDecoDialog(weaponSlotLevels[slotId] ?? 1, slotId as DecoSlot)"
            >
                <DecorationBtn
                    :decoration="weaponDecorations[slotId as DecoSlot]"
                    :decoration-display="props.decorationDisplay"
                    :slot-size="weaponSlotLevels[slotId] ?? 1"
                />
            </button>
        </div>

        <DecorationSelect
            :all-decorations="allDecorations"
            kind="weapon"
            :decoration-display="props.decorationDisplay"
            :slot-level="decoDialogSlotLevel"
            :model-value="currentSelectedDecoration"
            :open="decoDialogOpen"
            @update:modelValue="updateDecoration"
            @close="closeDecoDialog"
        />
    </div>
</template>

<style scoped>
input {
    width: 100%;
    text-align: center;
}

.mh-number {
    display: grid;
    align-items: center;
    width: 100px;
    padding: 0.5rem;
    font-weight: 700;
    border-radius: 9999px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}

.mh-affinity::after {
    content: "%";
}

input:focus {
    outline: none;
}
</style>
