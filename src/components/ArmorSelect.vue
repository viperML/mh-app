<script setup lang="ts">
import { computed, reactive, ref, toRaw, useTemplateRef, watchEffect } from "vue";
import { armorKinds, type ArmorKind, type ArmorPiece } from "../scripts/api";
import ArmorCard from "./ArmorCard.vue";
import { parseNumber } from "../scripts/util";
import type { Decoration, DecoSlot } from "../scripts/decorations";
import DecorationBtn from "./DecorationBtn.vue";
import type { DecorationDisplay } from "./App.vue";
import type { Skill2 } from "../scripts/skill";

const props = defineProps<{
    allSkills: Map<number, Skill2>;
    allArmors: Map<number, ArmorPiece>;
    allDecorations: Map<number, Decoration>;
    decorationDisplay: DecorationDisplay;
}>();

const armorDialog = useTemplateRef("armorDialog");
const decoDialog = useTemplateRef("decoDialog");

const selectedArmor = reactive(
    Object.fromEntries(
        armorKinds.map(kind => {
            const storedId = parseNumber(localStorage.getItem(kind) ?? "");
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

export type ArmorEmits = {
    armor: Record<ArmorKind, ArmorPiece | undefined>;
    decorations: Record<ArmorKind, Record<DecoSlot, Decoration | undefined>>;
};
const emits = defineEmits<{
    "update:armor": [value: ArmorEmits];
}>();
watchEffect(() => {
    emits("update:armor", {
        armor: selectedArmor,
        decorations: selectedDecorations,
    });
});
</script>

<template>
    <dialog ref="armorDialog" closedby="any">
        <button class="bg-slate-600 p-2" @click="armorDialog?.close()">Close</button>
        <button
            class="bg-slate-600 p-2"
            @click="
                () => {
                    if (showArmorsFor !== undefined) {
                        selectedArmor[showArmorsFor] = undefined;
                    }
                    armorDialog?.close();
                }
            "
        >
            Remove
        </button>
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
            v-show="deco.kind === 'armor' && deco.slot <= showDecorationsFor"
            @click="
                () => {
                    setDecoration(deco);
                    decoDialog?.close();
                }
            "
        >
            <DecorationBtn :decoration="deco" :decoration-display="props.decorationDisplay" />
        </button>
    </dialog>

    <div class="grid grid-cols-2 items-center p-10" v-for="kind of armorKinds" v-bind:key="kind">
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

        <div class="grid grid-cols-1 gap-5 h-max">
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
                <DecorationBtn
                    :decoration="selectedDecorations[kind][slotId]"
                    :decoration-display="props.decorationDisplay"
                    :slot-size="slotLevel"
                />
            </button>
        </div>
    </div>
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
