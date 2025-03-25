<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import { armorKinds, getArmors, type ArmorKind } from "../scripts/api";
import { getSkills } from "../scripts/skill";
import { parseInt2 } from "../scripts/util";

const skills = await getSkills();
const armors = await getArmors(skills);

const armorSelected = reactive(
    Object.fromEntries(armorKinds.map((kind) => [kind, localStorage.getItem(kind) ?? undefined])) as Record<
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
</script>

<template>
    <div class="m-10 grid grid-cols-3 items-center gap-4">
        <template v-for="kind of armorKinds" v-bind:key="kind">
            <span>{{ kind }}</span>
            <select
                class="border-black border-2 p-4"
                :value="armorSelected[kind]"
                @change="(event) => setArmor(kind, event)"
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
</template>
