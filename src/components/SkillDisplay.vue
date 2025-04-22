<script setup lang="ts">
import type { SkillRank2 } from "../scripts/skill";

const props = defineProps<{
    skillRank: SkillRank2;
}>();

// Configuration for the skill rank rectangles
const rectWidth = 10;
const rectHeight = 12;
const rectGap = 2;
const rectRadius = 4;
const rectSpacing = rectWidth + rectGap; // Total space each rectangle occupies

const maxDisplayedRanks = Math.max(props.skillRank.level, props.skillRank.skill.maxRank);
const svgWidth = maxDisplayedRanks * rectSpacing;

// Function to determine rectangle class based on rank
const getRectClass = (index: number) => {
    if (index > props.skillRank.skill.maxRank) {
        return `fill-overflow fill-skill-${props.skillRank.skill.iconKind}`;
    } else if (index <= props.skillRank.level) {
        return `fill-skill-${props.skillRank.skill.iconKind}`;
    } else {
        return "fill-inactive"; // Inactive
    }
};
</script>

<template>
    <span class="text-neutral-500 text-sm justify-self-start">{{ skillRank.skill.name }}</span>

    <svg :width="svgWidth" :height="rectHeight + 2" :viewBox="`0 0 ${svgWidth} ${rectHeight}`" class="justify-self-end">
        <rect
            v-for="n in maxDisplayedRanks"
            :key="n"
            :x="svgWidth - rectWidth - (n - 1) * rectSpacing"
            :width="rectWidth"
            :height="rectHeight"
            :rx="rectRadius"
            :class="getRectClass(n)"
        />
        <!-- y="2" -->
    </svg>
</template>

<style scoped>
@reference "../styles/main.css";
.fill-inactive {
    fill: var(--color-zinc-700);
}
.fill-overflow {
    stroke: var(--color-red-800);
    stroke-width: 2px;
    /* fill: none !important; */
}

.fill-skill-affinity {
    fill: var(--color-purple-500);
}
.fill-skill-attack {
    fill: var(--color-red-500);
}
.fill-skill-defense {
    fill: var(--color-blue-500);
}
.fill-skill-element {
    fill: var(--color-teal-500);
}
.fill-skill-gathering {
    fill: var(--color-green-500);
}
.fill-skill-group {
    fill: var(--color-pink-500);
}
.fill-skill-handicraft {
    fill: var(--color-yellow-500);
}
.fill-skill-health {
    fill: var(--color-red-500);
}
.fill-skill-item {
    fill: var(--color-amber-500);
}
.fill-skill-offense {
    fill: var(--color-pink-800);
}
.fill-skill-ranged {
    fill: var(--color-lime-500);
}
.fill-skill-set {
    fill: var(--color-violet-500);
}
.fill-skill-stamina {
    fill: var(--color-cyan-500);
}
.fill-skill-utility {
    fill: var(--color-stone-500);
}
</style>
