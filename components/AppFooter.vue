<template>
  <footer class="bg-gray-50 mt-auto">
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
            <UIcon name="i-simple-icons-buymeacoffee" class="w-4 h-4" />
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