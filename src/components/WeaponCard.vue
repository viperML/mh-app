<script setup lang="ts">
import SkillDisplay from "./SkillDisplay.vue";
import type { Weapon } from "../scripts/weapon";
import { GSIcon } from "../assets/weaponIcons";

const props = defineProps<{
    weapon?: Weapon | undefined;
}>();

const iconSize = 20;
</script>

<template>
    <!-- <div class="grid grid-cols-[auto_200px] gap-x-5"> -->
    <div
        class="h-full grid grid-cols-[auto_min-content] bg-zinc-800 hover:bg-zinc-900 p-2 rounded-lg justify-items-start"
    >
        <h3 class="col-span-full flex flex-row items-center gap-2">
            <img
                :src="GSIcon.src"
                :width="iconSize"
                :height="iconSize"
                :class="`colorize-rarity-${props.weapon?.rarity ?? '1'}`"
            />
            <span :class="props.weapon ? 'text-white' : 'text-neutral-500'">
                {{ props.weapon?.name ?? "Weapon" }}
            </span>
        </h3>

        <SkillDisplay :skill-rank v-for="skillRank of props.weapon?.skills" v-bind:key="String(skillRank.skill.id)" />
    </div>

    <!-- <div class="grid grid-cols-1">
            <template v-for="(slotLevel, slotId) of props.weapon.slots">
                <DecorationBtn
                    :decoration="selectedDecorations[slotId]"
                    decoration-display="name"
                    v-if="slotLevel > 1"
                />
            </template>
        </div> -->
    <!-- </div> -->
</template>

<style scoped>
@reference "../styles/main.css";
h3:not(:only-child) {
    margin-bottom: --spacing(1);
}
</style>
