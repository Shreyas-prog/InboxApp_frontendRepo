// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
   css: [
    "~/assets/css/main.css",
  ],
  modules: [
    "@pinia/nuxt",
  ],
  buildModules: ["@pinia/nuxt"],

  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
})
