import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    base: import.meta.env.PROD ? "/mh-app/" : "/",
    integrations: [vue()],
    devToolbar: {
        enabled: false,
    },
    vite: {
        plugins: [
            tailwindcss(),
            visualizer({
                emitFile: true,
                filename: "stats.html",
            }),
        ],
    },
    experimental: {
        svg: true,
    },
});
