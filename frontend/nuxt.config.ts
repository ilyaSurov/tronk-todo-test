export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-04-02',
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],  // @tailwind base; @tailwind components; @tailwind utilities;
  devServer: { port: 8080 },
  vite: {
    server: {
      // If 8080 is busy, fail instead of switching to 3000 (backend port)
      strictPort: true,
    },
  },
  runtimeConfig: {
    public: {
      // Can be overridden via NUXT_PUBLIC_API_BASE, e.g. http://localhost:3000/api
      apiBase: 'http://localhost:3000/api',
    },
  },
})