<script setup lang="ts">
import { ref } from 'vue';
import { fetchArmors, fetchSkills } from '../scripts/api';

const count = ref(0);

const skills = await fetchSkills();
console.log(skills);
</script>

<template>
    <button v-on:click="count++">
        Count: {{ count }}
    </button>
</template>
