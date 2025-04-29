<script setup lang="ts">
import { computed } from "vue";
import type { ArmorKind, ArmorPiece } from "../scripts/api";
import armorIcons from "../assets/armorIcons";
import SkillDisplay from "./SkillDisplay.vue";

const props = defineProps<{
    armor?: ArmorPiece | undefined;
    kind: ArmorKind;
    showDecoSlots?: boolean | undefined;
}>();

const noSkills = computed(() => {
    return (props.armor?.skills ?? []).length === 0;
});

const iconSize = 20;
</script>

<template>
    <div
        class="text-white grid grid-cols-[auto_min-content] items-center min-w-6 bg-zinc-800 p-2 rounded-lg h-full hover:bg-zinc-900"
    >
        <div class="col-span-full justify-self-start flex flex-row items-center gap-2">
            <img
                :width="iconSize"
                :height="iconSize"
                :src="armorIcons[props.kind].src"
                :class="props.armor?.rarity ? `colorize-rarity-${props.armor?.rarity}` : ''"
            />
            <h2 :class="props.armor ? '' : 'text-neutral-500 capitalize'">
                {{ props.armor?.name ?? props.kind }}
            </h2>
        </div>

        <div class="w-full h-1 col-span-full" v-show="!noSkills"></div>

        <template v-for="skillRank of props.armor?.skills" v-bind:key="String(skillRank.skill.id)">
            <SkillDisplay :skillRank="skillRank" />
        </template>
    </div>
</template>

<style>
.colorize-rarity-8 {
    filter: sepia(100%) hue-rotate(-20deg) saturate(600%) brightness(110%);
}
.colorize-rarity-7 {
    filter: sepia(100%) hue-rotate(250deg) saturate(400%) brightness(80%);
}
.colorize-rarity-6 {
    filter: sepia(100%) hue-rotate(170deg) saturate(400%) brightness(80%);
}
.colorize-rarity-5 {
    filter: sepia(100%) hue-rotate(100deg) saturate(400%) brightness(80%);
}
</style>
