// @ts-check
/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";

export default defineConfig({
  devToolbar: { enabled: false },
  base: import.meta.env.PROD ? "/mh-app/" : "/",
  integrations: [
    vue(),
  ]
});
