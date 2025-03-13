import {defineConfig} from "astro/config"
import tailwindcss from '@tailwindcss/vite'
import vue from '@astrojs/vue';

export default defineConfig({
    base: "/mh-app/",
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
