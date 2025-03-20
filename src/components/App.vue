<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { armorKinds, getArmors, type ArmorKind } from '../scripts/api';

const armors = await getArmors();

const armorSelected = reactive(Object.fromEntries(
    armorKinds.map(kind => [kind, (localStorage.getItem(kind) ?? "")])
) as Record<ArmorKind, string>);

for (const kind of armorKinds) {
    watchEffect(() => {
        localStorage.setItem(kind, armorSelected[kind]);
    });
}
</script>

<template>
    <div class="m-10 grid grid-cols-2 gap-4">
        <template v-for="kind of armorKinds">
            <span>{{ kind }}</span>
            <select class="border-black border-2 p-4" v-model="armorSelected[kind]">
                <template v-for="armor of armors">
                    <option v-if="armor.kind === kind">
                        {{ armor.name }}
                    </option>
                </template>
            </select>
        </template>
    </div>
</template>
