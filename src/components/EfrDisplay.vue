<script setup lang="ts">
import type { EfrInfo } from "../scripts/efr";
import AttackIcon from "../assets/attac_icons_mhw_wiki_guide.png";
import AffinityIcon from "../assets/affinity_icons_mhw_wiki_guide.png";

const iconSize = 20;

const props = defineProps<{
    efrInfo: EfrInfo;
}>();
</script>

<template>
    <span>Stats</span>

    <div class="flex flex-row items-center">
        <img :src="AttackIcon.src" :width="iconSize" :height="iconSize" />
        {{ Math.floor(props.efrInfo.attack) }}
    </div>

    <div class="flex flex-row items-center">
        <img :src="AffinityIcon.src" :width="iconSize" :height="iconSize" />
        {{  Math.floor(props.efrInfo.affinity * 100) }}%
    </div>
</template>
