<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <!-- Left side - Copyright -->
        <div class="text-sm text-gray-500">
          © 2024 Made with ❤️ for couples
        </div>

        <!-- Right side - Buy me a coffee -->
        <div class="flex items-center">
          <a
            href="https://coff.ee/667z79qdqdp"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            data-umami-event="buy_me_coffee"
          >
            <!-- Coffee Cup SVG Icon -->
            <svg 
              class="w-4 h-4 mr-2" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3h.5c.83 0 1.5-.67 1.5-1.5S17.33 5 16.5 5H16zM6 5h8v8.58c0 2.84-2.16 5.42-5 5.42s-5-2.58-5-5.42V5z"/>
              <path d="M7 9h6v2H7z"/>
              <path d="M8 7h4v1H8z"/>
            </svg>
            <span class="hidden sm:inline">Buy me a coffee</span>
            <span class="sm:hidden">☕</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No props needed for this component
</script>