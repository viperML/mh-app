<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import type { Weapon } from "../scripts/weapon";
import { parseInt2 } from "../scripts/util";

const weapon = reactive<Weapon>({
    id: NaN,
    damage: parseInt2(localStorage.getItem("customWeaponDamage") ?? "") ?? 200,
    affinity: parseInt2(localStorage.getItem("customWeaponAffinity") ?? "") ?? 0,
    skills: [],
});

const emits = defineEmits<{
    "update:weapon": [Weapon];
}>();

watchEffect(() => {
    localStorage.setItem("customWeaponDamage", String(weapon.damage));
    localStorage.setItem("customWeaponAffinity", String(weapon.affinity));
});

watchEffect(() => {
    emits("update:weapon", weapon);
});
</script>

<template>
    <article class="bg-zinc-800 text-white p-10 m-10">
        <div>
            Damage:
            <input v-model.number="weapon.damage" type="number" class="border p-1" />
        </div>

        <div>
            Affinity:
            <input v-model.number="weapon.affinity" type="number" />
        </div>
    </article>
</template>
