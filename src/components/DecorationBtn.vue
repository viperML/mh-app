<script setup lang="ts">
import { computed } from "vue";
import type { Decoration } from "../scripts/decorations";
import type { DecorationDisplay } from "../scripts/settings";

const props = defineProps<{
    decoration?: Decoration | undefined;
    decorationDisplay: DecorationDisplay;
    slotSize?: number,
}>();

const displayName = computed(() => {
    if (props.decorationDisplay === "name") {
        return props.decoration?.name ?? "No decoration";
    } else {
        return props.decoration?.skills.map(skillRank => skillRank.skill.name).join("/") ?? "No decoration";
    }
});

const slotLevel = computed(() => props.decoration?.slot ?? 0);

// SVG dimensions configuration
const rectWidth = 4;
const rectSpacing = 5.5;
const rectX = (n: number) => (n-1) * rectSpacing + 2;
</script>

<template>
    <div class="py-0.5 px-1 text-sm rounded-sm bg-zinc-800 hover:bg-zinc-900 text-neutral-200 text-start flex items-center gap-1">
        <svg width="24" height="16" viewBox="0 0 24 16" class="flex-shrink-0">
            <!-- Slot level indicators -->
            <rect
                v-for="n in 3"
                :key="n"
                :x="rectX(n)"
                y="2"
                :width="rectWidth"
                height="12"
                rx="1"
                :class="[
                    n <= slotLevel ? 'fill-selected' :
                    (slotSize && n <= slotSize) ? 'fill-dim' : 'fill-inactive'
                ]"
            />
        </svg>
        <span>
            {{ displayName }}
        </span>
    </div>
</template>

<style scoped>
@reference "../styles/main.css";
.fill-selected {
    @apply fill-red-400;
}
.fill-dim {
    @apply fill-zinc-400;
}
.fill-inactive {
    @apply fill-zinc-800;
}
</style>
