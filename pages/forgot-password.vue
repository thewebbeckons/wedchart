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
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <!-- Reset Form -->
        <form @submit.prevent="handleResetRequest" class="space-y-6">
          <UFormGroup label="Email address" required>
            <UInput
              v-model="email"
              type="email"
              placeholder="Enter your email address"
              :error="errors.email"
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
            :disabled="!email.trim()"
          >
            Send reset link
          </UButton>
        </form>

        <!-- Success Message -->
        <UAlert
          v-if="message"
          :title="message"
          color="green"
          variant="soft"
          class="mt-4"
          icon="i-heroicons-check-circle"
        />

        <!-- Error Display -->
        <UAlert
          v-if="error"
          :title="error"
          color="red"
          variant="soft"
          class="mt-4"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'soft' }"
          @close="error = ''"
        />

        <!-- Back to Sign In -->
        <div class="mt-6 text-center">
          <NuxtLink
            to="/login"
            class="font-medium text-pink-600 hover:text-pink-500 transition-colors duration-200"
          >
            Back to sign in
          </NuxtLink>
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
    { name: 'description', content: 'Reset your password to access your wedding seating arrangements' }
  ]
})

const { $supabase } = useNuxtApp()
const { $toast } = useNuxtApp()

// Reactive data
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const errors = ref({
  email: ''
})

// Methods
const validateForm = (): boolean => {
  errors.value = { email: '' }
  let isValid = true

  if (!email.value.trim()) {
    errors.value.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  return isValid
}

const handleResetRequest = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { error: resetError } = await $supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (resetError) {
      console.error('Password reset error:', resetError)
      
      // Handle specific error types
      if (resetError.message?.includes('Email not confirmed')) {
        error.value = 'Please verify your email address before requesting a password reset.'
      } else if (resetError.message?.includes('sending recovery email') || resetError.message?.includes('unexpected_failure')) {
        error.value = 'Our email service is temporarily unavailable. Please try again in a few minutes, or contact support if the issue persists.'
      } else if (resetError.message?.includes('rate limit')) {
        error.value = 'Too many reset attempts. Please wait a few minutes before trying again.'
      } else {
        error.value = resetError.message || 'An unexpected error occurred. Please try again.'
      }
    } else {
      message.value = 'If an account with that email exists, we\'ve sent you a password reset link.'
      email.value = ''
      
      $toast.add({
        title: 'Reset Link Sent',
        description: 'Check your email for password reset instructions',
        color: 'green'
      })
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    error.value = 'An unexpected error occurred. Please check your internet connection and try again.'
  } finally {
    loading.value = false
  }
}
</script>