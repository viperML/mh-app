<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watchEffect, nextTick, watch } from "vue";
import { armorKinds, type ArmorKind, type ArmorPiece } from "../scripts/api";
import ArmorCard from "./ArmorCard.vue";
import { parseNumber } from "../scripts/util";
import type { Decoration, DecoSlot } from "../scripts/decorations";
import DecorationBtn from "./DecorationBtn.vue";
import type { DecorationDisplay } from "../scripts/settings";
import type { Skill } from "../scripts/skill";

const props = defineProps<{
    allSkills: Map<number, Skill>;
    allArmors: Map<number, ArmorPiece>;
    allDecorations: Map<number, Decoration>;
    decorationDisplay: DecorationDisplay;
}>();

const armorDialog = ref<HTMLDialogElement | null>(null);
const decoDialog = ref<HTMLDialogElement | null>(null);

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
const setArmor = (armor: ArmorPiece) => {};

const showDecorationsFor = ref(3);

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

const setDecoration = (decoration: Decoration) => {};

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

const decoSearchQuery = ref("");
const decoSearchInputRef = ref<HTMLInputElement | null>(null);

const filteredDecorations = computed(() => {
    const query = decoSearchQuery.value.trim().toLowerCase();
    return Array.from(props.allDecorations.values()).filter(
        deco =>
            deco.kind === "armor" &&
            deco.slot <= showDecorationsFor.value &&
            deco.name.toLowerCase().includes(query)
    );
});

watch(
    () => decoDialog.value?.open,
    (open) => {
        if (open) {
            decoSearchQuery.value = "";
            void nextTick(() => {
                decoSearchInputRef.value?.focus();
            });
        }
    }
);
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
                        setArmor(armor);
                        armorDialog?.close();
                    }
                "
            >
                <ArmorCard :armor="armor" :kind="armor.kind" />
            </button>
        </div>
    </dialog>

    <dialog ref="decoDialog" closedby="any">
        <div class="dialog-container">
            <input
                ref="decoSearchInputRef"
                v-model="decoSearchQuery"
                type="text"
                placeholder="Search decoration..."
                class="bg-zinc-800 text-white p-2 rounded w-full"
                @keydown.stop
            />
            <button
                class="bg-zinc-800 text-white p-2 rounded w-full hover:bg-zinc-900"
                @click="() => { setDecoration(undefined); decoDialog?.close(); }"
            >
                Remove
            </button>
            <button
                v-for="deco in filteredDecorations"
                :key="deco.id"
                @click="() => { setDecoration(deco); decoDialog?.close(); }"
            >
                <DecorationBtn :decoration="deco" :decoration-display="props.decorationDisplay" />
            </button>
        </div>
    </dialog>

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
                        setArmor = (armor: ArmorPiece) => {
                            selectedArmor[kind] = armor;
                            selectedDecorations[kind] = {
                                0: undefined,
                                1: undefined,
                                2: undefined,
                            };
                        };
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
                @click="
                    () => {
                        showDecorationsFor = slotLevel;
                        setDecoration = (deco: Decoration) => {
                            selectedDecorations[kind][slotId] = deco;
                        };
                        decoDialog?.showModal();
                    }
                "
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
