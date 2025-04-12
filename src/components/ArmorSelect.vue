<script setup lang="ts">
import { reactive, ref, useTemplateRef, watchEffect } from "vue";
import { armorKinds, type ArmorKind, type ArmorPiece } from "../scripts/api";
import type { Skill } from "../scripts/skill";
import ArmorCard from "./ArmorCard.vue";
import { assert } from "tsafe/assert";
import { parseInt2 } from "../scripts/util";

const props = defineProps<{
    allSkills: Map<number, Skill>;
    allArmors: Map<number, ArmorPiece>;
}>();

const emit = defineEmits<{
    change: [];
    update: [value: string]; // named tuple syntax
}>();

const selected = ref("");
watchEffect(() => {
    emit("update", selected.value);
});

const armorDialog = useTemplateRef("armorDialog");

const someArmor = props.allArmors.entries().next().value?.[1];
assert(someArmor);

const selectedArmor = reactive(
    Object.fromEntries(
        armorKinds.map(kind => {
            const storedId = parseInt2(localStorage.getItem(kind) ?? "");
            const res = storedId ? props.allArmors.get(storedId) : undefined;
            console.log("Stored", kind, storedId, res);
            return [kind, res];
        }),
    ),
) as Record<ArmorKind, ArmorPiece | undefined>;

for (const kind of armorKinds) {
    watchEffect(() => {
        localStorage.setItem(kind, String(selectedArmor[kind]?.id ?? ""));
    });
}

const activeDialog = ref(armorKinds[0]);
const setArmor = ref((armor: ArmorPiece) => undefined);
</script>

<template>
    <article class="card">
        <template v-for="kind of armorKinds" v-bind:key="kind">
            <button
                @click="
                    () => {
                        activeDialog = kind;
                        setArmor = (armor: ArmorPiece) => {
                            selectedArmor[kind] = armor;
                        };
                        armorDialog?.showModal();
                    }
                "
            >
                <ArmorCard :armor="selectedArmor[kind]" />
            </button>
        </template>
    </article>

    <button class="bg-slate-600 p-2" @click="armorDialog?.showModal()">Show dialog</button>

    <dialog ref="armorDialog" closedby="any">
        <button class="bg-slate-600 p-2" @click="armorDialog?.close()">Close</button>
        <template v-for="[id, armor] of allArmors" v-bind:key="String(id)">
            <button
                v-show="activeDialog === armor.kind"
                @click="
                    () => {
                        setArmor(armor);
                        armorDialog?.close();
                    }
                "
            >
                <ArmorCard :armor="armor" />
            </button>
        </template>
    </dialog>
</template>

<style scoped>
.card {
    display: grid;
    grid-template-columns: auto;
    gap: 64px;
    margin: 64px;
}

dialog {
    /* display: grid; */
    /* width: 100dvw; */
    justify-content: center;
    background-color: rgb(47, 47, 47);
    grid-template-columns: 200px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    width: 300px;
}

dialog[open] {
    display: grid;
    justify-content: center;
    gap: 10px;
}
</style>

<style>
body:has(dialog[open]) {
    overflow: hidden;
}
</style>
