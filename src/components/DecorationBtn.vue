<script setup lang="ts">
import type { Decoration } from "../scripts/decorations";

const props = defineProps<{
    decoration?: Decoration | undefined;
}>();
</script>

<template>
    <div class="p-4 text-sm bg-cyan-400 text-black">
        {{ props.decoration?.name ?? "Not selected" }}
    </div>
</template>
