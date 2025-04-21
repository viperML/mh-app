<script setup lang="ts">
import type { ArmorPiece } from "../scripts/api";

const props = defineProps<{
    armor?: ArmorPiece | undefined;
    showDecoSlots?: boolean | undefined;
}>();

// Configuration for the skill rank rectangles
const rectWidth = 8;
const rectHeight = 16;
const rectGap = 2;
const rectSpacing = rectWidth + rectGap; // Total space each rectangle occupies
</script>

<template>
    <div class="bg-zinc-800 text-white grid grid-cols-2 p-4 items-center min-w-6">
        <h2 class="col-span-full justify-self-start mb-2">
            {{ props.armor?.name ?? "Not set" }}
        </h2>

        <template v-for="skillRank of props.armor?.skills" v-bind:key="String(skillRank.skill.id)" >
            <span class="text-neutral-500 justify-self-start">{{ skillRank.skill.name }}</span>

            <svg width="100" height="20" viewBox="0 0 100 20" class="justify-self-end">
                <rect
                    v-for="n in skillRank.skill.maxRank"
                    :key="n"
                    :x="100 - rectWidth - (n-1) * rectSpacing"
                    y="2"
                    :width="rectWidth"
                    :height="rectHeight"
                    rx="2"
                    :class="n <= skillRank.level ? 'fill-active' : 'fill-inactive'"
                />
            </svg>
        </template>
    </div>
</template>

<style scoped>
@reference "../styles/main.css";
.fill-active {
    fill: var(--color-amber-500);
}
.fill-inactive {
    fill: var(--color-zinc-700);
}
</style>
