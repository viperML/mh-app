<script setup lang="ts">
const props = defineProps<{
    skillName: string;
    skillRank: number;
    skillMaxRank: number;
}>();

// Configuration for the skill rank rectangles
const rectWidth = 8;
const rectHeight = 16;
const rectGap = 2;
const rectSpacing = rectWidth + rectGap; // Total space each rectangle occupies
</script>

<template>
    <span class="text-neutral-500 justify-self-start">{{ skillName }}</span>

    <svg width="100" height="20" viewBox="0 0 100 20" class="justify-self-end">
        <rect
            v-for="n in skillMaxRank"
            :key="n"
            :x="100 - rectWidth - (n - 1) * rectSpacing"
            y="2"
            :width="rectWidth"
            :height="rectHeight"
            rx="2"
            :class="n <= skillRank ? 'fill-active' : 'fill-inactive'"
        />
    </svg>
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
