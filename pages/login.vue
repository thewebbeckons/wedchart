<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <UIcon name="i-heroicons-heart" class="h-12 w-12 text-pink-500" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <NuxtLink to="/signup" class="font-medium text-pink-600 hover:text-pink-500">
          create a new account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <UFormGroup label="Email address" required>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              :error="errors.email"
              required
              autocomplete="email"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Password" required>
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              :error="errors.password"
              required
              autocomplete="current-password"
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
          </UFormGroup>

          <div class="flex items-center justify-between">
            <UCheckbox
              v-model="form.rememberMe"
              label="Remember me"
            />

            <NuxtLink
              to="/forgot-password"
              class="text-sm font-medium text-pink-600 hover:text-pink-500"
            >
              Forgot your password?
            </NuxtLink>
          </div>

          <UButton
            type="submit"
            size="lg"
            block
            :loading="authStore.loading"
            :disabled="!isFormValid"
          >
            Sign in
          </UButton>
        </form>

        <!-- Error Display -->
        <UAlert
          v-if="authStore.error"
          :title="authStore.error"
          color="red"
          variant="soft"
          class="mt-4"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'soft' }"
          @close="clearError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Sign In - WedChart',
  meta: [
    { name: 'description', content: 'Sign in to manage your wedding seating arrangements' }
  ]
})

const authStore = useAuthStore()

// Reactive data
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.value.email && form.value.password && !errors.value.email && !errors.value.password
})

// Methods
const clearError = () => {
  // Clear the error by calling signIn with empty credentials to reset the error state
  // or we can access the internal error ref if available
  if (authStore.$state && authStore.$state.error !== undefined) {
    authStore.$state.error = null
  }  
}

const validateForm = (): boolean => {
  errors.value = { email: '', password: '' }
  let isValid = true

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  const result = await authStore.signIn(form.value.email, form.value.password)
  
  if (result.success) {
    await navigateTo('/dashboard')
  }
}

// Initialize auth store
onMounted(() => {
  authStore.initialize()
})
</script>