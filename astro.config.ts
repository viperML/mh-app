import {defineConfig} from "astro/config"
import tailwindcss from '@tailwindcss/vite'
import vue from '@astrojs/vue';

export default defineConfig({
    base: "/mh-base/",
    integrations: [
        vue(),
    ],
    devToolbar: {
        enabled: false,
    },
    vite: {
        plugins: [
            tailwindcss()
        ]
    }
})
