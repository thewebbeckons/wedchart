<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <UIcon name="i-heroicons-heart" class="h-8 w-8 text-pink-500 mr-3" />
              <h1 class="text-2xl font-bold text-gray-900">WedChart</h1>
            </NuxtLink>
          </div>
          <UButton
            @click="handleLogout"
            variant="soft"
            color="red"
            icon="i-heroicons-arrow-right-on-rectangle"
          >
            Logout
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Account Settings</h2>
          <p class="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Navigation Sidebar -->
          <div class="lg:col-span-1">
            <nav class="space-y-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="{
                  'bg-pink-50 border-pink-500 text-pink-700': activeTab === tab.id,
                  'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900': activeTab !== tab.id
                }"
                class="group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left"
              >
                <UIcon :name="tab.icon" class="flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span class="truncate">{{ tab.name }}</span>
              </button>
            </nav>
          </div>

          <!-- Content Area -->
          <div class="lg:col-span-2">
            <!-- Profile Information -->
            <div v-if="activeTab === 'profile'" class="bg-white shadow-sm rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Profile Information</h3>
                <p class="text-sm text-gray-600 mt-1">Update your personal details and wedding information</p>
              </div>
              
              <form @submit.prevent="updateProfile" class="px-6 py-4 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <UFormGroup label="Full Name" required>
                    <UInput
                      v-model="profileForm.full_name"
                      placeholder="Enter your full name"
                      :error="profileErrors.full_name"
                      required
                    />
                  </UFormGroup>

                  <UFormGroup label="Email Address" required>
                    <UInput
                      v-model="profileForm.email"
                      type="email"
                      placeholder="Enter your email"
                      :error="profileErrors.email"
                      required
                      disabled
                    />
                    <template #help>
                      <span class="text-xs text-gray-500">Email cannot be changed after registration</span>
                    </template>
                  </UFormGroup>

                  <UFormGroup label="Wedding Name" help="e.g., 'Sarah & John's Wedding'">
                    <UInput
                      v-model="profileForm.wedding_name"
                      placeholder="Enter your wedding name"
                    />
                  </UFormGroup>

                  <UFormGroup label="Wedding Date">
                    <UInput
                      v-model="profileForm.wedding_date"
                      type="date"
                      placeholder="Select wedding date"
                    />
                  </UFormGroup>
                </div>

                <div class="flex justify-end">
                  <UButton
                    type="submit"
                    :loading="authStore.loading"
                  >
                    Save Changes
                  </UButton>
                </div>
              </form>
            </div>

            <!-- Security Settings -->
            <div v-else-if="activeTab === 'security'" class="bg-white shadow-sm rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
                <p class="text-sm text-gray-600 mt-1">Manage your password and security preferences</p>
              </div>
              
              <form @submit.prevent="changePassword" class="px-6 py-4 space-y-6">
                <UFormGroup label="Current Password" required>
                  <UInput
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    :error="passwordErrors.currentPassword"
                    required
                  />
                </UFormGroup>

                <UFormGroup label="New Password" required>
                  <UInput
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="Enter new password"
                    :error="passwordErrors.newPassword"
                    required
                  />
                </UFormGroup>

                <UFormGroup label="Confirm New Password" required>
                  <UInput
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    :error="passwordErrors.confirmPassword"
                    required
                  />
                </UFormGroup>

                <div class="flex justify-end">
                  <UButton
                    type="submit"
                    :loading="authStore.loading"
                  >
                    Update Password
                  </UButton>
                </div>
              </form>
            </div>

            <!-- Privacy Settings -->
            <div v-else-if="activeTab === 'privacy'" class="bg-white shadow-sm rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Privacy Settings</h3>
                <p class="text-sm text-gray-600 mt-1">Control your privacy and data sharing preferences</p>
              </div>
              
              <div class="px-6 py-4 space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p class="text-sm text-gray-600">Receive email updates about your account</p>
                  </div>
                  <UToggle v-model="privacySettings.emailNotifications" />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Marketing Communications</h4>
                    <p class="text-sm text-gray-600">Receive promotional emails and updates</p>
                  </div>
                  <UToggle v-model="privacySettings.marketingEmails" />
                </div>

                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-md font-medium text-gray-900 mb-4">Data Management</h4>
                  <div class="space-y-3">
                    <UButton variant="soft" color="blue" size="sm">
                      Download My Data
                    </UButton>
                    <UButton variant="soft" color="red" size="sm">
                      Delete Account
                    </UButton>
                  </div>
                </div>

                <div class="flex justify-end">
                  <UButton
                    @click="savePrivacySettings"
                    :loading="privacyLoading"
                  >
                    Save Preferences
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Notifications -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Account Settings - WedChart',
  meta: [
    { name: 'description', content: 'Manage your account settings and preferences' }
  ]
})

const authStore = useAuthStore()
const { $toast } = useNuxtApp()

// Reactive data
const activeTab = ref('profile')
const privacyLoading = ref(false)

const profileForm = ref({
  full_name: '',
  email: '',
  wedding_name: '',
  wedding_date: ''
})

const profileErrors = ref({
  full_name: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const privacySettings = ref({
  emailNotifications: true,
  marketingEmails: false
})

// Computed
const tabs = [
  { id: 'profile', name: 'Profile', icon: 'i-heroicons-user' },
  { id: 'security', name: 'Security', icon: 'i-heroicons-shield-check' },
  { id: 'privacy', name: 'Privacy', icon: 'i-heroicons-eye-slash' }
]

// Methods
const updateProfile = async () => {
  try {
    // Validate form
    profileErrors.value = { full_name: '', email: '' }
    
    if (!profileForm.value.full_name.trim()) {
      profileErrors.value.full_name = 'Full name is required'
      return
    }

    const updates = {
      full_name: profileForm.value.full_name.trim(),
      wedding_name: profileForm.value.wedding_name || null,
      wedding_date: profileForm.value.wedding_date || null
    }

    const result = await authStore.updateProfile(updates)
    
    if (result.success) {
      $toast.add({
        title: 'Success',
        description: 'Profile updated successfully',
        color: 'green'
      })
    } else {
      $toast.add({
        title: 'Error',
        description: authStore.error || 'Failed to update profile',
        color: 'red'
      })
    }
  } catch (error) {
    $toast.add({
      title: 'Error',
      description: 'Failed to update profile',
      color: 'red'
    })
  }
}

const changePassword = async () => {
  try {
    // Validate form
    passwordErrors.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    if (!passwordForm.value.currentPassword) {
      passwordErrors.value.currentPassword = 'Current password is required'
      return
    }
    
    if (!passwordForm.value.newPassword) {
      passwordErrors.value.newPassword = 'New password is required'
      return
    }
    
    if (passwordForm.value.newPassword.length < 8) {
      passwordErrors.value.newPassword = 'Password must be at least 8 characters'
      return
    }
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordErrors.value.confirmPassword = 'Passwords do not match'
      return
    }

    const result = await authStore.updatePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    
    if (result.success) {
      // Reset form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      
      $toast.add({
        title: 'Success',
        description: 'Password updated successfully',
        color: 'green'
      })
    } else {
      $toast.add({
        title: 'Error',
        description: authStore.error || 'Failed to update password',
        color: 'red'
      })
    }
  } catch (error) {
    $toast.add({
      title: 'Error',
      description: 'Failed to update password',
      color: 'red'
    })
  }
}

const savePrivacySettings = async () => {
  try {
    privacyLoading.value = true
    
    // Simulate API call for privacy settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    $toast.add({
      title: 'Success',
      description: 'Privacy settings saved',
      color: 'green'
    })
  } catch (error) {
    $toast.add({
      title: 'Error',
      description: 'Failed to save privacy settings',
      color: 'red'
    })
  } finally {
    privacyLoading.value = false
  }
}

const handleLogout = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    await navigateTo('/login')
  }
}

// Initialize data
onMounted(async () => {
  await authStore.initialize()
  
  // Populate form with current profile data
  if (authStore.profile) {
    profileForm.value = {
      full_name: authStore.profile.full_name || '',
      email: authStore.user?.email || '',
      wedding_name: authStore.profile.wedding_name || '',
      wedding_date: authStore.profile.wedding_date || ''
    }
  }
})

// Watch for profile changes
watch(() => authStore.profile, (newProfile) => {
  if (newProfile) {
    profileForm.value = {
      full_name: newProfile.full_name || '',
      email: authStore.user?.email || '',
      wedding_name: newProfile.wedding_name || '',
      wedding_date: newProfile.wedding_date || ''
    }
  }
}, { immediate: true })
</script>