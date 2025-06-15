<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <UIcon name="i-heroicons-heart" class="h-12 w-12 text-pink-500" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Set new password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your new password below
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="mx-auto h-8 w-8 text-pink-500 animate-spin mb-4" />
          <p class="text-gray-600">Verifying reset link...</p>
        </div>

        <!-- Invalid/Expired Link -->
        <div v-else-if="!isValidSession" class="text-center py-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Invalid or Expired Link</h3>
          <p class="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <UButton
            @click="$router.push('/forgot-password')"
            color="pink"
            block
          >
            Request New Reset Link
          </UButton>
        </div>

        <!-- Password Reset Form -->
        <div v-else-if="!resetComplete">
          <form @submit.prevent="handlePasswordReset" class="space-y-6">
            <UFormGroup label="New Password" required>
              <UInput
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your new password"
                :error="errors.newPassword"
                required
                autocomplete="new-password"
                size="lg"
              >
                <template #trailing>
                  <UButton
                    @click="showPassword = !showPassword"
                    variant="soft"
                    color="gray"
                    size="sm"
                    :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  />
                </template>
              </UInput>
              
              <!-- Password Strength Indicator -->
              <div v-if="newPassword" class="mt-2">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      :class="{
                        'bg-red-500': passwordStrength.score <= 1,
                        'bg-yellow-500': passwordStrength.score === 2,
                        'bg-green-500': passwordStrength.score >= 3
                      }"
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${(passwordStrength.score / 4) * 100}%` }"
                    />
                  </div>
                  <span
                    :class="{
                      'text-red-600': passwordStrength.score <= 1,
                      'text-yellow-600': passwordStrength.score === 2,
                      'text-green-600': passwordStrength.score >= 3
                    }"
                    class="text-xs font-medium"
                  >
                    {{ passwordStrength.label }}
                  </span>
                </div>
              </div>
            </UFormGroup>

            <UFormGroup label="Confirm New Password" required>
              <UInput
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your new password"
                :error="errors.confirmPassword"
                required
                autocomplete="new-password"
                size="lg"
              >
                <template #trailing>
                  <UButton
                    @click="showConfirmPassword = !showConfirmPassword"
                    variant="soft"
                    color="gray"
                    size="sm"
                    :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <UButton
              type="submit"
              size="lg"
              block
              :loading="updating"
              :disabled="!isFormValid"
            >
              Update Password
            </UButton>
          </form>

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
        </div>

        <!-- Success State -->
        <div v-else class="text-center py-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Password Updated!</h3>
          <p class="text-gray-600 mb-6">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <UButton
            @click="$router.push('/login')"
            color="pink"
            block
          >
            Sign In
          </UButton>
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
    { name: 'description', content: 'Set your new password' }
  ]
})

// Reactive data
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(true)
const updating = ref(false)
const error = ref('')
const isValidSession = ref(false)
const resetComplete = ref(false)

const errors = ref({
  newPassword: '',
  confirmPassword: ''
})

// Get Supabase client
const { $supabase } = useNuxtApp()

// Computed
const passwordStrength = computed(() => {
  const password = newPassword.value
  let score = 0
  
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)]
  }
})

const isFormValid = computed(() => {
  return (
    newPassword.value &&
    confirmPassword.value &&
    !errors.value.newPassword &&
    !errors.value.confirmPassword &&
    passwordStrength.value.score >= 2
  )
})

// Methods
const validateForm = (): boolean => {
  errors.value = {
    newPassword: '',
    confirmPassword: ''
  }
  let isValid = true

  // Password validation
  if (!newPassword.value) {
    errors.value.newPassword = 'Password is required'
    isValid = false
  } else if (newPassword.value.length < 8) {
    errors.value.newPassword = 'Password must be at least 8 characters'
    isValid = false
  } else if (passwordStrength.value.score < 2) {
    errors.value.newPassword = 'Password is too weak'
    isValid = false
  }

  // Confirm password validation
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handlePasswordReset = async () => {
  if (!validateForm()) return

  try {
    updating.value = true
    error.value = ''

    const { error: updateError } = await $supabase.auth.updateUser({
      password: newPassword.value
    })

    if (updateError) {
      throw updateError
    }

    resetComplete.value = true
  } catch (err: any) {
    console.error('Password update error:', err)
    error.value = err.message || 'Failed to update password. Please try again.'
  } finally {
    updating.value = false
  }
}

// Check if we have a valid session on mount
onMounted(async () => {
  try {
    // Get the current session
    const { data: { session } } = await $supabase.auth.getSession()
    
    if (session) {
      isValidSession.value = true
    } else {
      // Check if we have auth tokens in the URL (from email link)
      const { data, error } = await $supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        isValidSession.value = false
      } else if (data.session) {
        isValidSession.value = true
      } else {
        isValidSession.value = false
      }
    }
  } catch (err) {
    console.error('Error checking session:', err)
    isValidSession.value = false
  } finally {
    loading.value = false
  }
})
</script>