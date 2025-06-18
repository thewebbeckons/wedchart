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
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
      ],
      script: [
        {
          async: true,
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': 'fcc50e51-e2f6-4d96-b46b-ff106207d2e0',
          'data-domains': 'wedchart.me,localhost,*.webcontainer-api.io,*.local-credentialless.webcontainer-api.io',
        }
      ]
    }
  }
})