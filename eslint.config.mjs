// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";

import globals from "globals";

export default defineConfigWithVueTs(
    {
        ignores: [".astro/", "dist/"],
    },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,
    {
        rules: {
            // "@typescript-eslint/explicit-function-return-type": "error"
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/non-nullable-type-assertion-style": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "no-unused-vars": "off",
        },
        languageOptions: {
            parserOptions: {
                // ecmaVersion: 2020,
                // parser: tseslint.parser,
                // sourceType: "module",
                // projectService: true,
                // tsconfigRootDir: import.meta.dirname,
                // extraFileExtensions: ['.vue'],
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
);
