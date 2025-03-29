<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
import { armorKinds, getArmors, type ArmorKind, type ArmorPiece } from "../scripts/api";
import { getSkills, mergeSkills } from "../scripts/skill";
import { parseInt2 } from "../scripts/util";
import { efr } from "../scripts/efr";
import { assert } from "tsafe/assert";

const skills = await getSkills();
const armors = await getArmors(skills);

const selectedArmor: Record<ArmorKind, ArmorPiece | undefined> = reactive(
    Object.fromEntries(
        armorKinds.map(kind => {
            const id = parseInt2(localStorage.getItem(kind) ?? "");
            return [kind, id ? armors.get(id) : undefined];
        }),
    ) as Record<ArmorKind, ArmorPiece | undefined>,
);

for (const kind of armorKinds) {
    watchEffect(() => {
        const id = selectedArmor[kind]?.id;
        if (id !== undefined) {
            localStorage.setItem(kind, id.toString());
        }
    });
}

function setArmor(kind: ArmorKind, event: Event) {
    if (event.target === null) {
        return;
    }
    const id = parseInt2((event.target as HTMLInputElement).value);
    assert(id);
    selectedArmor[kind] = armors.get(id);
}

const allSkills = computed(() => {
    return mergeSkills(
        armorKinds
            .map(kind => selectedArmor[kind]?.skills)
            .filter(s => s !== undefined)
            .flat(),
    );
});

watchEffect(() => {
    console.log(allSkills.value);
});

const attack = ref(parseInt2(localStorage.getItem("attack") ?? "") ?? 200);
watchEffect(() => {
    console.log(`attack => ${attack.value.toString()}`);
    localStorage.setItem("attack", attack.value.toString());
});

const affinity = ref(parseInt2(localStorage.getItem("affinity") ?? "") ?? 0);
watchEffect(() => {
    console.log(`affinity => ${affinity.value.toString()}`);
    localStorage.setItem("affinity", affinity.value.toString());
});

const myEfr = computed(() =>
    efr({
        attack: attack.value,
        affinity: affinity.value / 100,
        skills: allSkills.value,
    }),
);
</script>

<template>
    <div class="grid grid-cols-[600px_auto] gap-4 p-10">
        <div class="bg-zinc-900 p-4 rounded-md flex flex-col gap-2">
            <h2 class="font-black">Equipment</h2>

            <div class="grid grid-cols-[auto_auto_auto] items-center gap-4">
                <template v-for="kind of armorKinds" v-bind:key="kind">
                    <span class="capitalize text-zinc-400">{{ kind }}</span>
                    <select
                        class="border-zinc-800 border-1 p-1 rounded-sm"
                        :value="selectedArmor[kind]?.id"
                        @change="event => setArmor(kind, event)"
                    >
                        <template v-for="[id, armor] of armors" v-bind:key="id">
                            <option v-if="armor.kind === kind" :value="id">
                                {{ armor.name }}
                            </option>
                        </template>
                    </select>

                    <div>
                        Skills:
                        <template v-if="selectedArmor[kind] !== undefined">
                            <div v-for="skill of selectedArmor[kind].skills" :key="skill.id">
                                {{ skill.name }} {{ skill.level }}
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </div>

        <div class="bg-zinc-900 p-4 rounded-md flex flex-col gap-2">
            <h2 class="font-black">Stats</h2>
            <div class="grid grid-cols-2 items-center justify-items-center gap-y-3 gap-x-2">
                <h3 class="text-zinc-400">Attack:</h3>
                <input class="border-zinc-800 border-1 p-1 rounded-sm text-center w-14" v-model.number="attack" />
                <h3 class="text-zinc-400">Affinity:</h3>
                <input class="border-zinc-800 border-1 p-1 rounded-sm text-center w-14" v-model.number="affinity" />

                <h3 class="text-zinc-400">EFR:</h3>
                <span>{{ myEfr.efr }}</span>
                <h3 class="text-zinc-400">Affinity:</h3>
                <span>{{ myEfr.affinity * 100 }}%</span>

                <h3 class="text-zinc-400 col-span-2">Skills:</h3>
                <template v-for="[name, value] of allSkills" v-bind:key="name">
                    <span>{{ name }}</span>
                    <span>{{ value }}</span>
                </template>
            </div>
        </div>
    </div>
</template>
