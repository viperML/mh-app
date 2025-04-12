<script setup lang="ts">
import { reactive, ref, useTemplateRef, watchEffect } from "vue";
import { armorKinds, type ArmorKind, type ArmorPiece } from "../scripts/api";
import type { Skill } from "../scripts/skill";
import ArmorCard from "./ArmorCard.vue";
import { assert } from "tsafe/assert";
import { parseInt2 } from "../scripts/util";
import type { Decoration, DecoSlot } from "../scripts/decorations";
import DecorationBtn from "./DecorationBtn.vue";

const props = defineProps<{
    allSkills: Map<number, Skill>;
    allArmors: Map<number, ArmorPiece>;
    allDecorations: Map<number, Decoration>;
}>();

// const emit = defineEmits<{
//     change: [];
//     update: [value: string]; // named tuple syntax
// }>();
// const selected = ref("");
// watchEffect(() => {
//     emit("update", selected.value);
// });

const armorDialog = useTemplateRef("armorDialog");
const decoDialog = useTemplateRef("decoDialog");

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

const showArmorsFor = ref(armorKinds[0]);
const setArmor = ref((armor: ArmorPiece) => undefined);

const showDecorationsFor = ref(3);

const selectedDecorations = reactive(
    Object.fromEntries(
        armorKinds.map(kind => {
            return [
                kind,
                {
                    0: undefined,
                    1: undefined,
                    2: undefined,
                },
            ];
        }),
    ),
) as Record<ArmorKind, Record<DecoSlot, Decoration | undefined>>;

const setDecoration = ref((decoration: Decoration) => undefined);
</script>

<template>
    <article class="grid grid-cols-1 gap-10 m-10">
        <div class="grid grid-cols-2 grid-rows-3 gap-4" v-for="kind of armorKinds" v-bind:key="kind">
            <button
                class="row-span-full"
                @click="
                    () => {
                        showArmorsFor = kind;
                        setArmor = (armor: ArmorPiece) => {
                            selectedArmor[kind] = armor;
                            selectedDecorations[kind] = {
                                0: undefined,
                                1: undefined,
                                2: undefined,
                            };
                        };
                        armorDialog?.showModal();
                    }
                "
            >
                <ArmorCard :armor="selectedArmor[kind]" />
            </button>

            <button
                v-for="(slotLevel, slotId) of selectedArmor[kind]?.slots"
                v-show="slotLevel"
                v-bind:key="slotId"
                @click="
                    () => {
                        showDecorationsFor = slotLevel;
                        setDecoration = (deco: Decoration) => {
                            selectedDecorations[kind][slotId] = deco;
                        };
                        decoDialog?.showModal();
                    }
                "
            >
                lvl: {{ slotLevel }} / slot: {{ slotId }}
                <DecorationBtn :decoration="selectedDecorations[kind][slotId]" />
            </button>
        </div>
    </article>

    <button class="bg-slate-600 p-2" @click="decoDialog?.showModal()">Show dialog</button>

    <dialog ref="armorDialog" closedby="any">
        <button class="bg-slate-600 p-2" @click="armorDialog?.close()">Close</button>
        <button
            v-for="[id, armor] of allArmors"
            v-bind:key="String(id)"
            v-show="showArmorsFor === armor.kind"
            @click="
                () => {
                    setArmor(armor);
                    armorDialog?.close();
                }
            "
        >
            <ArmorCard :armor="armor" />
        </button>
    </dialog>

    <dialog ref="decoDialog" closedby="any">
        <button
            v-for="[id, deco] of allDecorations"
            v-bind:key="id"
            v-show="deco.slot <= showDecorationsFor"
            @click="
                () => {
                    setDecoration(deco);
                    decoDialog?.close();
                }
            "
        >
            <DecorationBtn :decoration="deco" />
        </button>
    </dialog>
</template>

<style scoped>
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
