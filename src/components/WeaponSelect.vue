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

export type WeaponEmits = {
    weapon: Weapon | undefined;
    decorations: Record<DecoSlot, Decoration | undefined>;
};

const emits = defineEmits<{
    "update:weaponEmits": [value: WeaponEmits];
}>();

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

const decorationSelectRef = useTemplateRef("decorationSelectRef");

function openDecorationSelect(slotLevel: number, slotId: DecoSlot) {
    decorationSelectRef.value?.open("weapon", slotLevel, slotId, selectedDecorations[slotId]);
}

function handleDecorationUpdate({
    deco,
    kind,
    slotId,
}: {
    deco: Decoration | undefined;
    kind: string;
    slotId: number;
}) {
    console.log(deco, slotId);
    selectedDecorations[slotId as DecoSlot] = deco;
}

watchEffect(() => {
    emits("update:weaponEmits", {
        weapon: selectedWeapon.value,
        decorations: selectedDecorations,
    });
});
</script>

<template>
    <div class="grid grid-cols-[auto_200px] gap-x-5">
        <button class="h-full" @click="dialogRef?.showModal()">
            <WeaponCard :weapon="selectedWeapon" />
        </button>

        <div class="grid grid-cols-1 grid-rows-3 gap-1 w-full">
            <template v-for="(slotLevel, slotId) of selectedWeapon?.slots" v-bind:key="slotId">
                <button class="h-max" v-show="slotLevel >= 1" @click="() => openDecorationSelect(slotLevel, slotId)">
                    <DecorationBtn
                        :decoration-display
                        :decoration="selectedDecorations[slotId]"
                        :slot-size="slotLevel"
                    />
                </button>
            </template>
        </div>
    </div>

    <dialog ref="dialogRef" closedby="any">
        <div class="dialog-container">
            <button class="p-2 text-white bg-zinc-800 hover:bg-zinc-900 rounded-sm">Remove</button>
            <button
                v-for="[id, weapon] of props.allWeapons"
                v-bind:key="id"
                @click="
                    selectedWeapon = weapon;
                    selectedDecorations[0] = undefined;
                    selectedDecorations[1] = undefined;
                    selectedDecorations[2] = undefined;
                    dialogRef?.close();
                "
            >
                <WeaponCard :weapon />
            </button>
        </div>
    </dialog>
    <DecorationSelect
        ref="decorationSelectRef"
        :all-decorations="props.allDecorations"
        :decoration-display="props.decorationDisplay"
        selection-mode="weapon"
        @update:modelValue="handleDecorationUpdate"
    />
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
