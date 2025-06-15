// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  ui: {
    colorMode: false,
    notifications: {
      position: 'top-right'
    }
  },  
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
    }
  },
  app: {
    head: {
      script: [
        {
          async: true,
          src: 'https://analytics.umami.is/script.js',
          'data-website-id': 'your-website-id-here'
        }
      ]
    }
  }
})