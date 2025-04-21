<script setup lang="ts">
import type { ArmorPiece } from "../scripts/api";

const props = defineProps<{
    armor?: ArmorPiece | undefined;
}>();
</script>

<template>
    <div class="p-7 bg-zinc-800 text-white">
        <h2 class="m-2">
            {{ props.armor?.name ?? "Not set" }}
        </h2>
        <ul class="text-xs m-2 flex flex-row gap-4">
            <li v-for="skillRank of props.armor?.skills" v-bind:key="String(skillRank.skill.id)">{{ skillRank.skill.name }}</li>
        </ul>
    </div>
</template>
