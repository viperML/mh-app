<script setup lang="ts">
import { computed, reactive, ref, toRaw, watchEffect, type Reactive } from "vue";
import { armorKinds, getArmors, type ArmorKind, type ArmorPiece } from "../scripts/api";
import { getSkills, mergeSkills } from "../scripts/skill";
import { parseInt2 } from "../scripts/util";
import { efr } from "../scripts/efr";
import { assert, type Equals } from "tsafe/assert";
import { getDecorations, type Decoration } from "../scripts/decorations";

const skills = await getSkills();
// const armors = await getArmors(skills);
const [armors, decorations] = await Promise.all([getArmors(skills), getDecorations(skills)]);

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
    // pruneDecorations(kind);

    // for (const elem of document.querySelectorAll(`.select-decoration-${kind}`)) {
    //     const _elem = elem as HTMLSelectElement;
    //     console.log(_elem);
    //     _elem.dispatchEvent(new Event("change"));
    // }
}

const allSkills = computed(() => {
    return mergeSkills(
        armorKinds
            .map(kind => selectedArmor[kind]?.skills)
            .filter(s => s !== undefined)
            .flat(),
    );
});

// watchEffect(() => {
//     console.log("allSkills", allSkills.value);
// });

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

const worker = new Worker(new URL("../scripts/worker.ts", import.meta.url), { type: "module" });
worker.addEventListener("message", event => {
    console.log("Worker said:", event.data);
});
function optimize() {
    console.log("pinging worker");
    worker.postMessage("ping");
}

type DecorationIndex = 0 | 1 | 2;
const decorationIndeces: DecorationIndex[] = [0, 1, 2];

const selectedDecoration = reactive(
    Object.fromEntries(
        armorKinds.map(kind => {
            const decos = {
                0: undefined,
                1: undefined,
                2: undefined,
            };
            return [kind, decos];
        }),
    ),
) as Reactive<Record<ArmorKind, Record<DecorationIndex, Decoration | undefined>>>;

function pruneDecorations(kind: ArmorKind) {
    const armor = selectedArmor[kind];
    if (armor === undefined) {
        return;
    }

    const slots = armor.slots;
    for (const index of decorationIndeces) {
        const deco = selectedDecoration[kind][index];
        if (deco === undefined) {
            continue;
        }
        if (!showDecoration(kind, index, deco)) {
            selectedDecoration[kind][index] = undefined;
        }
    }

    console.log(toRaw(selectedDecoration[kind]));
}

function setDecoration(kind: ArmorKind, index: DecorationIndex, event: Event) {
    console.log("Changing decorations");
    if (event.target === null) {
        return;
    }
    const id = parseInt2((event.target as HTMLSelectElement).value);
    assert(id);
    selectedDecoration[kind][index] = decorations.get(id);
    // pruneDecorations(kind);
}

function showDecoration(kind: ArmorKind, slotIndex: DecorationIndex, decoration: Decoration) {
    const armor = selectedArmor[kind];
    if (armor === undefined) {
        return false;
    }

    const slot = armor.slots[slotIndex];
    if (slot === undefined) {
        return false;
    }

    return decoration.slot <= slot;
}

function dumpState() {
    console.log(toRaw(selectedArmor));
    console.log(toRaw(selectedDecoration));
}
</script>

<template>
    <div class="grid grid-cols-1 gap-4 p-10">
        <section class="bg-zinc-900 p-3 rounded-xl flex flex-col gap-2">
            <header>
                <h2 class="font-black pl-1">Armor</h2>
            </header>

            <div class="grid grid-cols-1 items-center gap-2">
                <div
                    v-for="kind of armorKinds"
                    v-bind:key="kind"
                    class="border-1 border-zinc-700 bg-zinc-800 p-1 rounded-lg grid gap-2 grid-cols-2"
                >
                    <select
                        class="border-zinc-700 border-1 p-1 rounded-sm font-medium"
                        :value="selectedArmor[kind]?.id"
                        @change="event => setArmor(kind, event)"
                    >
                        <template v-for="[id, armor] of armors" v-bind:key="id">
                            <option v-if="armor.kind === kind" :value="id">
                                {{ armor.name }}
                            </option>
                        </template>
                    </select>

                    <article class="grid col-2 row-span-2 gap-0.5">
                        <select
                            :class="`select-decoration-${kind}`"
                            v-for="slotIndex of decorationIndeces"
                            v-bind:key="slotIndex"
                            @change="e => setDecoration(kind, slotIndex, e)"
                            v-show="selectedArmor[kind]?.slots[slotIndex]"
                        >
                            <option class="text-zinc-600" :value="undefined">Select a decoration</option>
                            <template v-for="[id, deco] of decorations" v-bind:key="id">
                                <option
                                    v-if="deco.kind === 'armor' && showDecoration(kind, slotIndex, deco)"
                                    :value="id"
                                >
                                    {{ deco.name }}
                                </option>
                            </template>
                        </select>
                    </article>

                    <div class="flex flex-row text-xs gap-2 text-zinc-500 px-1">
                        <template v-if="selectedArmor[kind] !== undefined">
                            <span v-for="skill of selectedArmor[kind].skills" :key="skill.id">
                                {{ skill.name }} {{ skill.level }}
                            </span>
                        </template>
                    </div>
                </div>
            </div>
        </section>

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

    <button @click="dumpState" class="p-2 bg-zinc-700 hover:bg-zinc-500 rounded-md">
        Dump State
    </button>
</template>
