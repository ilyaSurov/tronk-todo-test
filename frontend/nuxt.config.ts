export default defineNuxtConfig({
  ssr: false,
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],  // @tailwind base; @tailwind components; @tailwind utilities;
  runtimeConfig: { public: { apiBase: '/api' } }  // Proxy для backend
})