<script setup lang="ts">
import { ref } from 'vue';
import { fetchArmors, fetchSkills, fetchWeapons } from '../scripts/api';

const count = ref(0);

const r = await fetchWeapons();
console.log(r);
</script>

<template>
    <button v-on:click="count++">
        Count: {{ count }}
    </button>
</template>
