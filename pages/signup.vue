<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <UIcon name="i-heroicons-heart" class="h-12 w-12 text-pink-500" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <NuxtLink to="/login" class="font-medium text-pink-600 hover:text-pink-500">
          sign in to your existing account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <!-- Registration Form -->
        <form @submit.prevent="handleSignup" class="space-y-6">
          <UFormGroup label="Full name" required>
            <UInput
              v-model="form.fullName"
              type="text"
              placeholder="Enter your full name"
              :error="errors.fullName"
              required
              autocomplete="name"
              size="lg"
            />
          </UFormGroup>

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

          <UFormGroup label="Wedding name" help="e.g., 'Sarah & John's Wedding'">
            <UInput
              v-model="form.weddingName"
              type="text"
              placeholder="Enter your wedding name"
              :error="errors.weddingName"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Wedding date" help="When is your special day?">
            <UInput
              v-model="form.weddingDate"
              type="date"
              placeholder="Select your wedding date"
              :error="errors.weddingDate"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Password" required>
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              :error="errors.password"
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
            <div v-if="form.password" class="mt-2">
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

          <UFormGroup label="Confirm password" required>
            <UInput
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
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

          <div class="flex items-start">
            <UCheckbox
              v-model="form.acceptTerms"
              :error="errors.acceptTerms"
              required
            />
            <div class="ml-3 text-sm">
              <label class="text-gray-700">
                I agree to the
                <a href="#" class="font-medium text-pink-600 hover:text-pink-500">Terms and Conditions</a>
                and
                <a href="#" class="font-medium text-pink-600 hover:text-pink-500">Privacy Policy</a>
              </label>
            </div>
          </div>

          <UButton
            type="submit"
            size="lg"
            block
            :loading="authStore.loading"
            :disabled="!isFormValid"
          >
            Create account
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
          @close="authStore.error = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Sign Up - WedChart',
  meta: [
    { name: 'description', content: 'Create an account to manage your wedding seating arrangements' }
  ]
})

const authStore = useAuthStore()

// Reactive data
const form = ref({
  fullName: '',
  email: '',
  weddingName: '',
  weddingDate: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref({
  fullName: '',
  email: '',
  weddingName: '',
  weddingDate: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Computed
const passwordStrength = computed(() => {
  const password = form.value.password
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
    form.value.fullName &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.acceptTerms &&
    !Object.values(errors.value).some(error => error)
  )
})

// Methods
const validateForm = (): boolean => {
  errors.value = {
    fullName: '',
    email: '',
    weddingName: '',
    weddingDate: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  }
  let isValid = true

  // Full name validation
  if (!form.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required'
    isValid = false
  } else if (form.value.fullName.trim().length < 2) {
    errors.value.fullName = 'Full name must be at least 2 characters'
    isValid = false
  }

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  // Wedding name validation (optional but if provided, should be valid)
  if (form.value.weddingName && form.value.weddingName.trim().length < 3) {
    errors.value.weddingName = 'Wedding name must be at least 3 characters'
    isValid = false
  }

  // Wedding date validation (optional but if provided, should be valid)
  if (form.value.weddingDate) {
    const selectedDate = new Date(form.value.weddingDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to compare dates only
    
    if (selectedDate < today) {
      errors.value.weddingDate = 'Wedding date cannot be in the past'
      isValid = false
    }
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  } else if (passwordStrength.value.score < 2) {
    errors.value.password = 'Password is too weak'
    isValid = false
  }

  // Confirm password validation
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Terms acceptance validation
  if (!form.value.acceptTerms) {
    errors.value.acceptTerms = 'You must accept the terms and conditions'
    isValid = false
  }

  return isValid
}

const handleSignup = async () => {
  if (!validateForm()) return

  const result = await authStore.signUp(
    form.value.email, 
    form.value.password, 
    form.value.fullName,
    form.value.weddingName || null,
    form.value.weddingDate || null
  )
  
  if (result.success) {
    await navigateTo('/')
  }
}

// Initialize auth store
onMounted(() => {
  authStore.initialize()
})
</script>