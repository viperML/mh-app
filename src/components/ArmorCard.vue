<script setup lang="ts">
import { computed } from "vue";
import type { ArmorKind, ArmorPiece } from "../scripts/api";
import armorIcons from "../assets/armorIcons";

const props = defineProps<{
    armor?: ArmorPiece | undefined;
    kind: ArmorKind,
    showDecoSlots?: boolean | undefined;
}>();

// Configuration for the skill rank rectangles
const rectWidth = 8;
const rectHeight = 16;
const rectGap = 2;
const rectSpacing = rectWidth + rectGap; // Total space each rectangle occupies

const noSkills = computed(() => {
    return (props.armor?.skills ?? []).length === 0;
});

const iconSize = 20;
</script>

<template>
    <div class="text-white grid grid-cols-2 items-center min-w-6">
        <div class="col-span-full justify-self-start flex flex-row items-center gap-3">
            <img :width="iconSize" :height="iconSize" :src="armorIcons[props.kind].src" />
            <h2 :class="props.armor ? '' : 'text-neutral-500'">
                {{ props.armor?.name ?? "Not set" }}
            </h2>
        </div>

        <div class="w-full h-2 col-span-full" v-show="!noSkills"></div>

        <template v-for="skillRank of props.armor?.skills" v-bind:key="String(skillRank.skill.id)">
            <span class="text-neutral-500 justify-self-start">{{ skillRank.skill.name }}</span>

            <svg width="100" height="20" viewBox="0 0 100 20" class="justify-self-end">
                <rect
                    v-for="n in skillRank.skill.maxRank"
                    :key="n"
                    :x="100 - rectWidth - (n - 1) * rectSpacing"
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
