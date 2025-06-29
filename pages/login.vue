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
            <div class="relative">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                :error="errors.email"
                required
                autocomplete="email"
                size="lg"
                :ui="{
                  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
                  rounded: 'rounded-md',
                  placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
                  size: {
                    lg: 'text-lg'
                  },
                  gap: {
                    lg: 'gap-x-3'
                  },
                  padding: {
                    lg: 'px-4 py-3 pr-12'
                  }
                }"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <UIcon
                  name="i-heroicons-at-symbol"
                  class="h-5 w-5 text-gray-400"
                />
              </div>
            </div>
          </UFormGroup>

          <UFormGroup label="Password" required>
            <div class="relative">
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                :error="errors.password"
                required
                autocomplete="current-password"
                size="lg"
                :ui="{
                  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
                  rounded: 'rounded-md',
                  placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
                  size: {
                    lg: 'text-lg'
                  },
                  gap: {
                    lg: 'gap-x-3'
                  },
                  padding: {
                    lg: 'px-4 py-3 pr-12'
                  }
                }"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                @keydown="handleToggleKeydown"
                class="absolute inset-y-0 right-0 flex items-center pr-3 z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-md transition-all duration-200 hover:bg-gray-50 active:scale-95"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                tabindex="0"
              >
                <UIcon
                  :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  class="h-5 w-5 transition-colors duration-200"
                  :class="{
                    'text-pink-500': showPassword,
                    'text-gray-400 hover:text-gray-600': !showPassword
                  }"
                />
              </button>
            </div>
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
  authStore.clearError()
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleToggleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    togglePasswordVisibility()
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

<style scoped>
/* Enhanced focus styles for better accessibility */
button:focus {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Ensure proper positioning and sizing for icons */
.relative .absolute {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover effects for better UX */
button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.375rem;
}

/* Active state styling */
.active\:scale-95:active {
  transform: scale(0.95);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  button {
    border: 1px solid currentColor;
  }
  
  .relative .absolute {
    border: 1px solid transparent;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  button {
    transition: none;
  }
}

/* Ensure icons don't interfere with input interaction */
.pointer-events-none {
  pointer-events: none;
}

/* Custom input styling to ensure consistent appearance */
.relative input {
  padding-right: 3rem !important;
}

/* Focus ring adjustments for inputs with icons */
.relative input:focus {
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
}
</style>