<script setup lang="ts">
import { computed, reactive, ref, watchEffect, nextTick, watch } from "vue";
import { armorKinds, type ArmorKind, type ArmorPiece } from "../scripts/api";
import ArmorCard from "./ArmorCard.vue";
import { parseNumber } from "../scripts/util";
import type { Decoration, DecoSlot } from "../scripts/decorations";
import DecorationBtn from "./DecorationBtn.vue";
import type { DecorationDisplay } from "../scripts/settings";
import type { Skill } from "../scripts/skill";
import DecorationSelect from "./DecorationSelect.vue";

const props = defineProps<{
    allSkills: Map<number, Skill>;
    allArmors: Map<number, ArmorPiece>;
    allDecorations: Map<number, Decoration>;
    decorationDisplay: DecorationDisplay;
}>();

const armorDialog = ref<HTMLDialogElement | null>(null);

const selectedArmor = reactive(
    Object.fromEntries(
        armorKinds.map(kind => {
            const storedId = parseNumber(localStorage.getItem(kind) ?? "");
            const res = storedId ? props.allArmors.get(storedId) : undefined;
            console.log("Stored", kind, storedId, res);
            return [kind, res];
        }),
    ),
) as Record<ArmorKind, ArmorPiece | undefined>;

for (const kind of armorKinds) {
    watchEffect(() => {
        localStorage.setItem(kind, String(selectedArmor[kind]?.id ?? ""));
    });
}

const showArmorsFor = ref(armorKinds[0]);

const selectedDecorations = reactive(
    Object.fromEntries(
        armorKinds.map(kind => {
            return [
                kind,
                {
                    0: undefined,
                    1: undefined,
                    2: undefined,
                },
            ];
        }),
    ),
) as Record<ArmorKind, Record<DecoSlot, Decoration | undefined>>;

export type ArmorEmits = {
    armor: Record<ArmorKind, ArmorPiece | undefined>;
    decorations: Record<ArmorKind, Record<DecoSlot, Decoration | undefined>>;
};
const emits = defineEmits<{
    "update:armor": [value: ArmorEmits];
}>();
watchEffect(() => {
    emits("update:armor", {
        armor: selectedArmor,
        decorations: selectedDecorations,
    });
});

function shouldShowDecorations(armor: ArmorPiece) {
    return Object.values(armor.slots).some((slot: number) => slot > 0);
}

const sortedArmorPieces = computed(() => {
    return Array.from(props.allArmors.values()).sort((a, b) => a.name.localeCompare(b.name));
});

const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);

const filteredArmorPieces = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return sortedArmorPieces.value.filter(
        armor => armor.name.toLowerCase().includes(query)
    );
});

watch(
    () => armorDialog.value?.open,
    (open) => {
        if (open) {
            searchQuery.value = "";
            void nextTick(() => {
                searchInputRef.value?.focus();
            });
        }
    }
);

const decoDialogOpen = ref(false);
const decoDialogSlotLevel = ref(1);
const decoDialogKind = ref<ArmorKind | null>(null);
const decoDialogSlotId = ref<number | null>(null);

function openDecoDialog(kind: ArmorKind, slotLevel: number, slotId: number) {
    decoDialogKind.value = kind;
    decoDialogSlotLevel.value = slotLevel;
    decoDialogSlotId.value = slotId;
    decoDialogOpen.value = true;
}
function closeDecoDialog() {
    decoDialogOpen.value = false;
}
function updateDecoration(deco: Decoration | undefined) {
    if (
        decoDialogKind.value !== null &&
        decoDialogSlotId.value !== null
    ) {
        // Cast slotId to DecoSlot to satisfy type
        selectedDecorations[decoDialogKind.value][decoDialogSlotId.value as DecoSlot] = deco;
    }
}

const currentSelectedDecoration = computed(() => {
    if (
        decoDialogKind.value !== null &&
        decoDialogSlotId.value !== null
    ) {
        return selectedDecorations[decoDialogKind.value][decoDialogSlotId.value as DecoSlot];
    }
    return undefined;
});
</script>

<template>
    <dialog ref="armorDialog" closedby="any">
        <div class="dialog-container">
            <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Search armor..."
                class="bg-zinc-800 text-white p-2 rounded w-full"
                @keydown.stop
            />
            <button
                class="bg-zinc-800 text-white p-2 rounded w-full hover:bg-zinc-900"
                @click="
                    () => {
                        if (showArmorsFor !== undefined) {
                            selectedArmor[showArmorsFor] = undefined;
                        }
                        armorDialog?.close();
                    }
                "
            >
                Remove
            </button>
            <button
                v-for="armor in filteredArmorPieces"
                :key="armor.id"
                v-show="showArmorsFor === armor.kind"
                @click="
                    () => {
                        if (showArmorsFor) {
                            selectedArmor[showArmorsFor] = armor;
                            selectedDecorations[showArmorsFor] = {
                                0: undefined,
                                1: undefined,
                                2: undefined,
                            };
                        }
                        armorDialog?.close();
                    }
                "
            >
                <ArmorCard :armor="armor" :kind="armor.kind" />
            </button>
        </div>
    </dialog>

    <DecorationSelect
        :all-decorations="props.allDecorations"
        kind="armor"
        :decoration-display="props.decorationDisplay"
        :slot-level="decoDialogSlotLevel"
        :model-value="currentSelectedDecoration"
        :open="decoDialogOpen"
        @update:modelValue="updateDecoration"
        @close="closeDecoDialog"
    />

    <div
        class="grid grid-cols-1 lg:grid-cols-[auto_200px] gap-y-3 gap-x-5 rounded-xl"
        v-for="kind of armorKinds"
        v-bind:key="kind"
    >
        <button class="row-span-full h-full">
            <ArmorCard
                :kind="kind"
                :armor="selectedArmor[kind]"
                @click="
                    () => {
                        showArmorsFor = kind;
                        armorDialog?.showModal();
                    }
                "
            />
        </button>

        <div
            class="grid grid-cols-1 lg:grid-rows-3 gap-1 h-max"
            v-show="selectedArmor[kind] && shouldShowDecorations(selectedArmor[kind])"
        >
            <button
                v-for="(slotLevel, slotId) of selectedArmor[kind]?.slots"
                v-show="slotLevel"
                v-bind:key="slotId"
                @click="() => openDecoDialog(kind, slotLevel, slotId)"
            >
                <DecorationBtn
                    :decoration="selectedDecorations[kind][slotId]"
                    :decoration-display="props.decorationDisplay"
                    :slot-size="slotLevel"
                />
            </button>
        </div>
    </div>
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

<style>
body:has(dialog[open]) {
    overflow: hidden;
}
</style>
