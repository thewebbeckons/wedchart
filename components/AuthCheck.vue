<template>
  <div v-if="authStore.isAuthenticated">
    <slot />
  </div>
  <div v-else-if="!authStore.loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-heroicons-lock-closed" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">Authentication Required</h3>
      <p class="mt-2 text-sm text-gray-600">Please sign in to access this page.</p>
      <div class="mt-6">
        <UButton @click="$router.push('/login')">
          Sign In
        </UButton>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-heroicons-arrow-path" class="mx-auto h-12 w-12 text-gray-400 animate-spin" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">Loading...</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>