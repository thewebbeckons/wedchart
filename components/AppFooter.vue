<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <!-- Left side - Brand and copyright -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <UIcon name="i-heroicons-heart" class="h-6 w-6 text-pink-500 mr-2" />
            <span class="text-lg font-semibold text-gray-900">WedChart</span>
          </div>
          <span class="text-sm text-gray-500">
            © 2024 Made with ❤️ for couples
          </span>
        </div>

        <!-- Right side - Links and Buy me a coffee -->
        <div class="flex items-center space-x-6">
          <!-- Quick Links -->
          <div class="hidden sm:flex items-center space-x-4 text-sm">
            <NuxtLink 
              to="/dashboard" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              :class="{ 'text-pink-600 font-medium': $route.path === '/dashboard' }"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/account" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              :class="{ 'text-pink-600 font-medium': $route.path === '/account' }"
            >
              Account
            </NuxtLink>
          </div>

          <!-- Buy me a coffee button -->
          <a
            href="https://coff.ee/667z79qdqdp"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            data-umami-event="buy_me_coffee"
          >
            <svg 
              class="w-4 h-4 mr-2" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M2 21h20v-2H2v2zm1.15-4.05L4 15.47l.85 1.48c.2.34.57.55.98.55s.78-.21.98-.55L8 15.47l1.19 1.48c.2.34.57.55.98.55s.78-.21.98-.55L12 15.47l1.19 1.48c.2.34.57.55.98.55s.78-.21.98-.55L16 15.47l1.19 1.48c.2.34.57.55.98.55s.78-.21.98-.55L20 15.47l.85 1.48c.2.34.57.55.98.55s.78-.21.98-.55L23 15.47V9c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v6.47l1.15 1.48zM6 5h12v2H6V5zm-1 4h14v4.47l-.85-1.48c-.2-.34-.57-.55-.98-.55s-.78.21-.98.55L15 13.47l-1.19-1.48c-.2-.34-.57-.55-.98-.55s-.78.21-.98.55L11 13.47l-1.19-1.48c-.2-.34-.57-.55-.98-.55s-.78.21-.98.55L7 13.47l-1.19-1.48c-.2-.34-.57-.55-.98-.55s-.78.21-.98.55L5 13.47V9z"/>
            </svg>
            <span class="hidden sm:inline">Buy me a coffee</span>
            <span class="sm:hidden">☕</span>
          </a>
        </div>
      </div>

      <!-- Mobile navigation links -->
      <div class="sm:hidden mt-4 pt-4 border-t border-gray-200">
        <div class="flex justify-center space-x-6 text-sm">
          <NuxtLink 
            to="/dashboard" 
            class="text-gray-600 hover:text-gray-900 transition-colors"
            :class="{ 'text-pink-600 font-medium': $route.path === '/dashboard' }"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/account" 
            class="text-gray-600 hover:text-gray-900 transition-colors"
            :class="{ 'text-pink-600 font-medium': $route.path === '/account' }"
          >
            Account
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No props needed for this component
</script>