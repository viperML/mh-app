<script setup lang="ts">
import { computed } from "vue";
import type { Decoration } from "../scripts/decorations";
import type { DecorationDisplay } from "./App.vue";

const props = defineProps<{
    decoration?: Decoration | undefined;
    decorationDisplay: DecorationDisplay;
}>();

const displayName = computed(() => {
    if (props.decorationDisplay === "name") {
        return props.decoration?.name ?? "Not selected";
    } else {
        return props.decoration?.skills.map(skillRank => skillRank.skill.name).join("/") ?? "Not selected";
    }
});
</script>

<template>
    <div class="p-4 text-sm bg-cyan-400 text-black">
        {{ displayName }}
    </div>
</template>
