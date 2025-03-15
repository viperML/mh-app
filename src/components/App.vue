<script setup lang="ts">
import { computed, reactive, ref, type ComputedRef } from 'vue';

import { type Armor, type ArmorInfo, type ArmorType, armorTypes, reduceSkills } from "../scripts/armor";

const props = defineProps<{
    data: ArmorInfo,
}>();


const armorSets = reactive(Object.fromEntries(
    armorTypes.map(key => [key, ""])
) as Record<ArmorType, string>);

const armorRefs: ComputedRef<Record<ArmorType, Armor | undefined>> = computed(() => {
    return Object.fromEntries(
        Object.entries(armorSets).map(([type, id]) => {
            return [
                type,
                props.data[id]
            ];
        })
    ) as Record<ArmorType, Armor | undefined>;
});

const skills = computed(() => {
    const skills = Object.values(armorRefs.value)
        .filter(elem => elem !== undefined)
        .map(armor => armor.skills)
        .flat();

    return reduceSkills(...skills);
});

const baseDamageS = ref("")
const baseDamage = computed(() => {
    const res = parseFloat(baseDamageS.value);
    return isNaN(res) ? undefined : res;
})
</script>

<template>
    <div class="inline-block">
        Base damage:
        <form>
            <input v-model="baseDamageS" class="border-2 border-solid" type="text">
        </form>
    </div>

    <div class="grid grid-cols-3 p-4 gap-2">
        <template v-for="t of armorTypes">
            <span>{{ t }}</span>

            <select class="border-2 border-solid p-2" v-model="armorSets[t]">
                <template v-for="armor, id of props.data">
                    <option v-if="armor.type === t" :value="id">
                        {{ armor.name }}
                    </option>
                </template>
            </select>

            <div class="flex flex-col">
                <span v-for="skill of (armorRefs[t]?.skills ?? [])">
                    {{ skill.name }} {{ skill.level }}
                </span>
            </div>
        </template>
    </div>

    <div>
         <span>Skills:</span>
         <div v-for="level, skill of skills">
            {{ skill }} {{ level }}
         </div>

        <div>Base damage: {{ baseDamage }}</div>
    </div>
</template>
