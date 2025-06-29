<template>
  <footer class="bg-gray-50 py-6">
    <UContainer>
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <!-- Left side - Copyright and tagline -->
        <div class="text-center sm:text-left">
          <p class="text-sm text-gray-500">
            © 2024 WedChart. Made with ❤️ for couples planning their perfect day.
          </p>          
        </div>

        <!-- Right side - Built with Bolt.new badge -->
        <div class="flex items-center space-x-4">
          <a 
            href="https://bolt.new" 
            class="bolt-badge" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Built with Bolt.new"
          >
            <img 
              src="/bolt-badge/white_circle_360x360.svg" 
              alt="Built with Bolt.new"
              width="80" 
              height="80"
              class="bolt-badge__image"
            >
          </a>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
// Footer component for consistent layout
</script>

<style scoped>
.bolt-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem;
  margin: 0.5rem;
  transition: opacity 0.2s ease;
  text-decoration: none;
}

.bolt-badge:hover {
  opacity: 0.8;
}

.bolt-badge__image {
  max-width: 120px;
  height: auto;
  object-fit: contain;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .bolt-badge__image {
    max-width: 100px;
  }
}

@media (max-width: 480px) {
  .bolt-badge__image {
    max-width: 80px;
  }
}
</style>