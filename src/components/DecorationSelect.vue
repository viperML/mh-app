<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import DecorationBtn from "./DecorationBtn.vue";
import type { Decoration, DecorationKind } from "../scripts/decorations";
import type { DecorationDisplay } from "../scripts/settings";

const props = defineProps<{
    allDecorations: Map<number, Decoration>;
    decorationDisplay: DecorationDisplay;
    slotLevel: number; // max slot level to show
    modelValue: Decoration | undefined;
    open: boolean;
    kind: DecorationKind;
}>();

const emits = defineEmits<{
    (e: "update:modelValue", value: Decoration | undefined): void;
    (e: "close"): void;
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);

const filteredDecorations = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return Array.from(props.allDecorations.values()).filter(
        deco => deco.kind === props.kind && deco.slot <= props.slotLevel && deco.name.toLowerCase().includes(query),
    );
});

watch(
    () => props.open,
    open => {
        if (open) {
            dialogRef.value?.showModal();
            searchQuery.value = "";
            void nextTick(() => {
                searchInputRef.value?.focus();
            });
        } else {
            dialogRef.value?.close();
        }
    },
);

function selectDecoration(deco: Decoration | undefined) {
    emits("update:modelValue", deco);
    emits("close");
}
</script>

<template>
    <dialog ref="dialogRef" closedby="any" @close="emits('close')">
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
