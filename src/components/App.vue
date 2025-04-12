<script setup lang="ts">
import ArmorSelect from './ArmorSelect.vue';

import { getSkills } from '../scripts/skill';
import { getArmors } from '../scripts/api';
import { ref } from 'vue';

const allSkills = await getSkills();
const allArmors = await getArmors(allSkills);

const selected = ref("")
function handler(item: string) {
    selected.value = item;
}
</script>

<template>
    <ArmorSelect :all-armors="allArmors" :all-skills="allSkills" @update="handler"/>

    <div class="p-4">{{ selected }}</div>
</template>
