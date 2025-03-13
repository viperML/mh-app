<script setup lang="ts">
import { reactive } from 'vue';

import { type ArmorInfo, type ArmorType, armorTypes } from '../../loader';

const props = defineProps<{
    data: ArmorInfo,
}>();


const armorSet = reactive(Object.fromEntries(
    armorTypes.map(key => [key, ""])
) as Record<ArmorType, string>);
</script>

<template>
    <div class="grid grid-cols-2 p-4 gap-2">
        <template v-for="t of armorTypes">
            {{ t }}

            <select class="border-2 border-solid p-2" v-model="armorSet[t]">
                <template v-for="armor, id of props.data">
                    <option v-if="armor.type === t" :value="id">
                        {{ armor.name }}
                    </option>
                </template>
            </select>
        </template>
    </div>

    <pre>
        <template v-for="t of armorTypes">
            {{ armorSet[t] }} ({{ props.data[armorSet[t]]?.name }})
        </template>
    </pre>
</template>
