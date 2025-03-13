<script setup lang="ts">
import { ref } from 'vue';
const counter = ref(0);
</script>

<template>
    <button class="p-5 border-2 border-solid" @click="counter++">
        {{ counter }}
    </button>
</template>
