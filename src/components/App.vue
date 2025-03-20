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

function reset() {
    localStorage.clear();
    // Refresh window
    window.location.reload();
}
</script>

<template>
    <div class="m-10 grid grid-cols-2 items-center gap-4">
        <template v-for="kind of armorKinds">
            <span>{{ kind }}</span>
            <select class="border-black border-2 p-4" v-model="armorSelected[kind]">
                <option value="" disabled>Not selected</option>

                <template v-for="armor of armors">
                    <option v-if="armor.kind === kind">
                        {{ armor.name }}
                    </option>
                </template>
            </select>
        </template>
    </div>

    <div>
        <button @click="reset" class="border-black border-2 p-4 hover:bg-gray-100">Reset</button>
    </div>
</template>
