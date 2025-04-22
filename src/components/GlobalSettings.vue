<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from "vue";

import { type Settings } from "../scripts/settings";

// const props = defineProps<{
//     settings: Settings,
// }>();

// const emits = defineEmits<{
//     "update": [Settings];
// }>();

const model = defineModel<Settings>({
    required: true,
});

function swapDecorationDisplay() {
    if (model.value.decorationDisplay === "name") {
        model.value.decorationDisplay = "skills";
    } else {
        model.value.decorationDisplay = "name";
    }
    localStorage.setItem("decoration-display", model.value.decorationDisplay);
}

const decoDisplayBtn = useTemplateRef("decoDisplayBtn");

watchEffect(() => {
    decoDisplayBtn.value?.setAttribute("data-mode", model.value.decorationDisplay);
    localStorage.setItem("decoration-display", model.value.decorationDisplay);
    // emits("update:decodisplay", );
});
</script>

<template>
    <aside class="flex flex-row items-center text-sm">
        <button class="p-2 w-40 rounded-full" ref="decoDisplayBtn" @click="swapDecorationDisplay">
            {{ model.decorationDisplay === "name" ? "Decoration names" : "Decoration skills" }}
        </button>
    </aside>
</template>

<style>
button {
    box-sizing: border-box;
}
button[data-mode="name"] {
    background-color: var(--color-zinc-800);
    color: var(--color-neutral-50);
}
button[data-mode="skills"] {
    background-color: var(--color-zinc-400);
    color: var(--color-neutral-900);
}
</style>
