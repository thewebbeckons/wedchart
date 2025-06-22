<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleResetRequest">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Icon name="heroicons:arrow-path-20-solid" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 animate-spin" />
            </span>
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>
        </div>

        <div v-if="message" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Unable to send reset email
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
                <p class="mt-2">
                  If this problem persists, please contact support or try again later.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to sign in
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
})

const { $supabase } = useNuxtApp()
const { $toast } = useNuxtApp()

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleResetRequest = async () => {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

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
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    error.value = 'An unexpected error occurred. Please check your internet connection and try again.'
  } finally {
    loading.value = false
  }
}
</script>