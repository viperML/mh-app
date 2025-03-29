<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
import { armorKinds, getArmors, type ArmorKind, type ArmorPiece } from "../scripts/api";
import { getSkills, mergeSkills } from "../scripts/skill";
import { parseInt2 } from "../scripts/util";
import { efr } from "../scripts/efr";

const skills = await getSkills();
const armors = await getArmors(skills);

const selectedArmorId = reactive(
    Object.fromEntries(armorKinds.map(kind => [kind, localStorage.getItem(kind) ?? undefined])) as Record<
        ArmorKind,
        number | undefined
    >,
);

const selectedArmor = computed(() => {
    return Object.fromEntries(
        armorKinds.map(kind => {
            const id = selectedArmorId[kind];
            return [kind, id ? armors[id] : undefined];
        }),
    ) as Record<ArmorKind, ArmorPiece | undefined>;
});

for (const kind of armorKinds) {
    watchEffect(() => {
        const selected = selectedArmorId[kind];
        if (selected !== undefined) {
            console.log(`${kind} => ${selected.toString()}`);
            localStorage.setItem(kind, selected.toString());
        }
    });
}

function setArmor(kind: ArmorKind, event: Event) {
    if (event.target === null) {
        return;
    }
    const value = (event.target as HTMLInputElement).value;
    selectedArmorId[kind] = parseInt2(value);
}

const allSkills = computed(() => {
    return mergeSkills(
        armorKinds
            .map(kind => selectedArmor.value[kind]?.skills)
            .filter(s => s !== undefined)
            .flat(),
    );
});

const attack = ref(200);

const myEfr = computed(() => {
    return efr({
        attack: attack.value,
        affinity: 0,
        skills: allSkills.value,
    });
});
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
                        :value="selectedArmorId[kind]"
                        @change="event => setArmor(kind, event)"
                    >
                        <template v-for="(armor, id) of armors" v-bind:key="id">
                            <option v-if="armor.kind === kind" :value="id">
                                {{ armor.name }}
                            </option>
                        </template>
                    </select>

                    <div>
                        Skills:
                        <template v-if="selectedArmorId[kind] !== undefined">
                            <div v-for="skill of armors[selectedArmorId[kind]]!.skills" :key="skill.id">
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
                <input class="border-zinc-800 border-1 p-1 rounded-sm text-center w-14" v-model="attack" />

                <h3 class="text-zinc-400">EFR:</h3>
                <span>{{ myEfr.efr }}</span>

                <h3 class="text-zinc-400 col-span-2">Skills:</h3>
                <template v-for="[name, value] of allSkills" v-bind:key="name">
                    <span>{{ name }}</span>
                    <span>{{ value }}</span>
                </template>
            </div>
        </div>
    </div>
</template>
