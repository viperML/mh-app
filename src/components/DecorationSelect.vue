<script setup lang="ts">
import { ref, computed, nextTick, watch, defineExpose } from "vue";
import DecorationBtn from "./DecorationBtn.vue";
import type { Decoration, DecorationKind } from "../scripts/decorations";
import type { DecorationDisplay } from "../scripts/settings";

const props = defineProps<{
    allDecorations: Map<number, Decoration>;
    decorationDisplay: DecorationDisplay;
    selectionMode?: "weapon" | "armor" | "both";
}>();

const emits = defineEmits<{
    (e: "update:modelValue", value: { deco: Decoration | undefined; kind: DecorationKind; slotId: number }): void;
    (e: "close"): void;
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);

const openState = ref(false);
const slotLevel = ref(1);
const kind = ref<DecorationKind>("armor");
const slotId = ref<number>(0);
const modelValue = ref<Decoration | undefined>(undefined);

function open(newKind: DecorationKind, newSlotLevel: number, newSlotId: number, current: Decoration | undefined) {
    kind.value = newKind;
    slotLevel.value = newSlotLevel;
    slotId.value = newSlotId;
    modelValue.value = current;
    openState.value = true;
}
defineExpose({ open });

const filteredDecorations = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    let allowedKind: DecorationKind[] = [kind.value];
    if (props.selectionMode === "both" || !props.selectionMode) {
        allowedKind = ["armor", "weapon"];
    } else if (props.selectionMode === "armor") {
        allowedKind = ["armor"];
    } else if (props.selectionMode === "weapon") {
        allowedKind = ["weapon"];
    }
    return Array.from(props.allDecorations.values()).filter(
        deco => allowedKind.includes(deco.kind) && deco.slot <= slotLevel.value && deco.name.toLowerCase().includes(query),
    );
});

watch(openState, open => {
    if (open) {
        dialogRef.value?.showModal();
        searchQuery.value = "";
        void nextTick(() => {
            searchInputRef.value?.focus();
        });
    } else {
        dialogRef.value?.close();
    }
});

function selectDecoration(deco: Decoration | undefined) {
    openState.value = false;
    emits("update:modelValue", { deco, kind: kind.value, slotId: slotId.value });
}
</script>

<template>
    <dialog ref="dialogRef" closedby="any" @close="openState = false">
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
    </dialog>
</template>

<style scoped>
dialog {
    background-color: rgb(47, 47, 47);
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    padding: 40px;
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
