<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <UIcon name="i-heroicons-heart" class="h-12 w-12 text-pink-500" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Reset your password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <NuxtLink to="/login" class="font-medium text-pink-600 hover:text-pink-500">
          return to sign in
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <div v-if="!emailSent">
          <p class="text-sm text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form @submit.prevent="handleResetRequest" class="space-y-6">
            <UFormGroup label="Email address" required>
              <UInput
                v-model="email"
                type="email"
                placeholder="Enter your email"
                :error="error"
                required
                autocomplete="email"
                size="lg"
              />
            </UFormGroup>

            <UButton
              type="submit"
              size="lg"
              block
              :loading="loading"
              :disabled="!email"
            >
              Send reset link
            </UButton>
          </form>
        </div>

        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Check your email</h3>
          <p class="mt-2 text-sm text-gray-600">
            We've sent a password reset link to <strong>{{ email }}</strong>
          </p>
          <div class="mt-6">
            <UButton
              @click="emailSent = false"
              variant="soft"
              color="gray"
              size="sm"
            >
              Try another email
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Reset Password - WedChart',
  meta: [
    { name: 'description', content: 'Reset your password to access your wedding seating chart' }
  ]
})

// Reactive data
const email = ref('')
const loading = ref(false)
const emailSent = ref(false)
const error = ref('')

// Methods
const handleResetRequest = async () => {
  if (!email.value) return

  try {
    loading.value = true
    error.value = ''

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      error.value = 'Please enter a valid email address'
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    emailSent.value = true
  } catch (err) {
    error.value = 'Failed to send reset email. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>