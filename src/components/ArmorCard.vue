<script setup lang="ts">
import { computed } from "vue";
import type { ArmorKind, ArmorPiece } from "../scripts/api";
import armorIcons from "../assets/armorIcons";
import SkillDisplay from "./SkillDisplay.vue";

const props = defineProps<{
    armor?: ArmorPiece | undefined;
    kind: ArmorKind,
    showDecoSlots?: boolean | undefined;
}>();


const noSkills = computed(() => {
    return (props.armor?.skills ?? []).length === 0;
});

const iconSize = 20;
</script>

<template>
    <div class="text-white grid grid-cols-[auto_min-content] items-center min-w-6">
        <div class="col-span-full justify-self-start flex flex-row items-center gap-2">
            <img :width="iconSize" :height="iconSize" :src="armorIcons[props.kind].src" />
            <h2 :class="props.armor ? '' : 'text-neutral-500'">
                {{ props.armor?.name ?? "Not set" }}
            </h2>
        </div>

        <div class="w-full h-1 col-span-full" v-show="!noSkills"></div>

        <template v-for="skillRank of props.armor?.skills" v-bind:key="String(skillRank.skill.id)">
            <SkillDisplay
                :skillRank="skillRank"
            />
        </template>
    </div>
</template>

