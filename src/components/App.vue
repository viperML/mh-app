<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
import { armorKinds, getArmors, type ArmorKind } from "../scripts/api";
import { getSkills, mergeSkills } from "../scripts/skill";
import { parseInt2 } from "../scripts/util";
import { assert } from "tsafe/assert";
import { efr } from "../scripts/efr";

const skills = await getSkills();
const armors = await getArmors(skills);

const armorSelected = reactive(
    Object.fromEntries(armorKinds.map(kind => [kind, localStorage.getItem(kind) ?? undefined])) as Record<
        ArmorKind,
        number | undefined
    >,
);

for (const kind of armorKinds) {
    watchEffect(() => {
        const selected = armorSelected[kind];
        if (selected !== undefined) {
            console.log(`${kind} => ${selected.toString()}`);
            localStorage.setItem(kind, selected.toString());
        }
    });
}

function reset() {
    localStorage.clear();
    window.location.reload();
}

function setArmor(kind: ArmorKind, event: Event) {
    if (event.target === null) {
        return;
    }
    const value = (event.target as HTMLInputElement).value;
    armorSelected[kind] = parseInt2(value);
}

const allSkills = computed(() => {
    // Get the skill for every armorSelected if not undefined
    const res = armorKinds
        .map(kind => armorSelected[kind])
        .filter(id => id !== undefined)
        .map(id => {
            const armor = armors[id];
            assert(armor);
            return armor.skills;
        })
        .flat();

    return mergeSkills(res);
});

const attack = ref(200);

const myEfr = computed(() => {
    return efr({
        attack: attack.value,
        affinity: 0,
        skills: allSkills.value
    })
});
</script>

<template>
    <div>
        <h2>Attack:</h2>
        <input class="border-black border-2 p-2" v-model="attack" />
    </div>

    <div class="m-10 grid grid-cols-3 items-center gap-4">
        <template v-for="kind of armorKinds" v-bind:key="kind">
            <span>{{ kind }}</span>
            <select
                class="border-black border-2 p-4"
                :value="armorSelected[kind]"
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
                <template v-if="armorSelected[kind] !== undefined">
                    <div v-for="skill of armors[armorSelected[kind]]!.skills" :key="skill.id">
                        {{ skill.name }} {{ skill.level }}
                    </div>
                </template>
            </div>
        </template>
    </div>

    <div>
        <button @click="reset" class="border-black border-2 p-4 hover:bg-gray-100">Reset</button>
    </div>

    <div>
        <p>EFR: {{ myEfr.efr }}</p>
        <p>Affinity: {{ myEfr.affinity }}</p>
        <p>
            Skills:
            <span class="block" v-for="value, name of allSkills" v-bind:key="name">
                {{ name }}: {{ value }}
            </span>
        </p>
    </div>
</template>
