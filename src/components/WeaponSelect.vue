<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watchEffect, nextTick } from "vue";
import type { Weapon } from "../scripts/weapon";
import { parseNumber } from "../scripts/util";
import DecorationBtn from "./DecorationBtn.vue";
import DecorationSelect from "./DecorationSelect.vue";
import type { DecorationDisplay } from "../scripts/settings";
import type { Decoration, DecoSlot } from "../scripts/decorations";
import { GSIcon } from "../assets/weaponIcons";
import WeaponCard from "./WeaponCard.vue";

const props = defineProps<{
    decorationDisplay: DecorationDisplay;
    allDecorations: Map<number, Decoration>;
    allWeapons: Map<number, Weapon>;
}>();

const KEYS = {
    CUSTOM_DMG: "customWeaponDamage",
    CUSTOM_AFF: "customWeaponAffinity",
};

const selectedDecorations = reactive<Record<DecoSlot, Decoration | undefined>>({
    0: undefined,
    1: undefined,
    2: undefined,
});

const selectedWeapon = ref<Weapon>();
selectedWeapon.value = props.allWeapons.get(10);

const savedId = parseNumber(localStorage.getItem("weapon") ?? "");
selectedWeapon.value = savedId ? props.allWeapons.get(savedId) : undefined;

watchEffect(() => {
    const w = selectedWeapon.value?.id;
    if (w !== undefined) {
        localStorage.setItem("weapon", String(w));
    }
});

const dialogRef = useTemplateRef("dialogRef");

// const mode = ref<'custom' | 'select'>('select');

// const weaponDialog = ref<HTMLDialogElement | null>(null);
// const searchQuery = ref("");
// const searchInputRef = ref<HTMLInputElement | null>(null);
// const selectedWeaponId = ref<number | null>(null);

// const sortedWeapons = computed(() => {
//     return Array.from(props.allWeapons.values()).sort((a, b) => a.name.localeCompare(b.name));
// });

// const filteredWeapons = computed(() => {
//     const query = searchQuery.value.trim().toLowerCase();
//     return sortedWeapons.value.filter(w => w.name.toLowerCase().includes(query));
// });

// function openWeaponDialog() {
//     weaponDialog.value?.showModal();
//     searchQuery.value = "";
//     void nextTick(() => searchInputRef.value?.focus());
// }
// function closeWeaponDialog() {
//     weaponDialog.value?.close();
// }
// function selectWeapon(weapon: Weapon | undefined) {
//     if (weapon) {
//         selectedWeaponId.value = weapon.id;
//         // Copy stats to local weapon
//         weaponState.id = weapon.id;
//         weaponState.damage = weapon.damage;
//         weaponState.affinity = weapon.affinity;
//         weaponState.skills = weapon.skills;
//         weaponSlotLevels.splice(0, 3, weapon.slots[0], weapon.slots[1], weapon.slots[2]);
//         // Reset decorations
//         weaponDecorations[0] = undefined;
//         weaponDecorations[1] = undefined;
//         weaponDecorations[2] = undefined;
//         mode.value = 'select';
//     } else {
//         // Switch to custom mode
//         selectedWeaponId.value = null;
//         mode.value = 'custom';
//         weaponState.id = NaN;
//         weaponState.damage = parseNumber(localStorage.getItem(KEYS.CUSTOM_DMG) ?? "none") ?? 200;
//         weaponState.affinity = parseNumber(localStorage.getItem(KEYS.CUSTOM_AFF) ?? "none") ?? 0;
//         weaponState.skills = [];
//         weaponSlotLevels.splice(0, 3, 3, 3, 3);
//         weaponDecorations[0] = undefined;
//         weaponDecorations[1] = undefined;
//         weaponDecorations[2] = undefined;
//     }
//     closeWeaponDialog();
// }

// const weaponState = reactive<Weapon>({
//     id: NaN,
//     damage: parseNumber(localStorage.getItem(KEYS.CUSTOM_DMG) ?? "none") ?? 200,
//     affinity: parseNumber(localStorage.getItem(KEYS.CUSTOM_AFF) ?? "none") ?? 0,
//     skills: [],
// });

// const emits = defineEmits<{
//     "update:weapon": [Weapon];
// }>();

// watchEffect(() => {
//     if (mode.value === 'custom') {
//         localStorage.setItem(KEYS.CUSTOM_DMG, String(weaponState.damage));
//         localStorage.setItem(KEYS.CUSTOM_AFF, String(weaponState.affinity));
//     }
// });

// watchEffect(() => {
//     emits("update:weapon", weaponState);
// });

// const displayedAffinity = computed<number>({
//     get: () => weaponState.affinity * 100,
//     set: val => {
//         weaponState.affinity = val / 100;
//     },
// });

// const dmgInput = useTemplateRef("dmgInput");
// const affInput = useTemplateRef("affInput");

// const iconSize = 20;
// import AttackIcon from "../assets/attac_icons_mhw_wiki_guide.png";
// import AffinityIcon from "../assets/affinity_icons_mhw_wiki_guide.png";

// // Weapon decoration slots (3 slots, can be undefined or Decoration)
// const weaponDecorations = reactive<Record<DecoSlot, Decoration | undefined>>({
//     0: undefined,
//     1: undefined,
//     2: undefined,
// });

// // Dialog state for selecting a decoration
// const decoDialogOpen = ref(false);
// const decoDialogSlotLevel = ref(1); // 1, 2, or 3
// const decoDialogSlotId = ref<DecoSlot | null>(null);

// function openDecoDialog(slotLevel: number, slotId: DecoSlot) {
//     decoDialogSlotLevel.value = slotLevel;
//     decoDialogSlotId.value = slotId;
//     decoDialogOpen.value = true;
// }
// function closeDecoDialog() {
//     decoDialogOpen.value = false;
// }
// function updateDecoration(deco: Decoration | undefined) {
//     if (decoDialogSlotId.value !== null) {
//         weaponDecorations[decoDialogSlotId.value] = deco;
//     }
// }

// const currentSelectedDecoration = computed(() => {
//     if (decoDialogSlotId.value !== null) {
//         return weaponDecorations[decoDialogSlotId.value];
//     }
//     return undefined;
// });

// // Example: weapon slot levels (could be dynamic in the future)
// const weaponSlotLevels = reactive([3, 3, 3]);
</script>

<template>
    <div class="grid grid-cols-[auto_200px] gap-x-5">
        <button class="h-full" @click="dialogRef?.showModal()">
            <WeaponCard :weapon="selectedWeapon" />
        </button>

        <div class="grid grid-cols-1 grid-rows-3 gap-1 w-full">
            <template v-for="(slotLevel, slotId) of selectedWeapon?.slots" v-bind:key="slotId">
                <button class="h-max" v-show="slotLevel >= 1">
                    <DecorationBtn
                        :decoration-display
                        :decoration="selectedDecorations[slotId]"
                        :slot-size="slotLevel"
                    />
                </button>
            </template>
        </div>
    </div>

    <!-- <dialog ref="dialogRef" closedby="any" @close="emits('close')">
        <div class="dialog-container">
            <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Search decoration..."
                class="bg-zinc-800 text-white p-2 rounded w-full"
                @keydown.stop
            />
            <button
                class="bg-zinc-800 text-white p-2 rounded w-full hover:bg-zinc-900"
                @click="() => selectDecoration(undefined)"
            >
                Remove
            </button>
            <button v-for="deco in filteredDecorations" :key="deco.id" @click="() => selectDecoration(deco)">
                <DecorationBtn :decoration="deco" :decoration-display="props.decorationDisplay" />
            </button>
        </div>
    </dialog> -->
    <dialog ref="dialogRef" closedby="any">
        <div class="dialog-container">
            <button class="p-2 text-white bg-zinc-800 hover:bg-zinc-900 rounded-sm">Remove</button>
            <button
                v-for="[id, weapon] of props.allWeapons"
                v-bind:key="id"
                @click="
                    selectedWeapon = weapon;
                    selectedDecorations = {
                        0: undefined,
                        1: undefined,
                        2: undefined,
                    };
                    dialogRef?.close();
                "
            >
                <WeaponCard :weapon />
            </button>
        </div>
    </dialog>
</template>

<style scoped>
dialog {
    background-color: rgb(47, 47, 47);
    position: fixed;
    top: 60px; /* Add vertical gap from the top */
    left: 50%;
    transform: translateX(-50%); /* Only center horizontally */
    margin: 0;
    padding: 40px;
    /* width: 800px; */
}

.dialog-container {
    display: grid;
    grid-template-columns: auto;
    width: 400px;
    gap: 10px;
}

dialog > button {
    width: 300px;
}

dialog[open] {
    display: grid;
    justify-content: center;
    gap: 10px;
}
</style>
