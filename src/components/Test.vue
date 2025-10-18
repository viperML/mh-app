<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
    <button v-on:click="count++">
        Count: {{ count }}
    </button>
</template>
