<script setup lang="ts">
import type { ArmorPiece } from "../scripts/api";

const props = defineProps<{
    armor?: ArmorPiece | undefined;
}>();
</script>

<template>
    <div class="bg-zinc-800 p-7 rounded-md shadow-md">
        <span class="m-2">
            {{ props.armor?.name ?? "Not set" }}
        </span>
        <div class="text-xs m-2 flex flex-row gap-4">
            <span v-for="skill of props.armor?.skills" v-bind:key="String(skill.id)">{{ skill.name }}</span>
        </div>
    </div>
</template>
