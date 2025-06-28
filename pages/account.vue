<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader page="account" />

    <!-- Main Content -->
    <main class="flex-1 py-8">
      <UContainer>
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
                    <UToggle 
                      v-model="privacySettings.emailNotifications" 
                      @change="updatePrivacySetting('email_notifications', $event)"
                      :loading="privacyLoading"
                    />
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Marketing Communications</h4>
                      <p class="text-sm text-gray-600">Receive promotional emails and updates</p>
                    </div>
                    <UToggle 
                      v-model="privacySettings.marketingEmails" 
                      @change="updatePrivacySetting('marketing_emails', $event)"
                      :loading="privacyLoading"
                    />
                  </div>

                  <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Data Management</h4>
                    <div class="space-y-4">
                      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-start">
                          <UIcon name="i-heroicons-arrow-down-tray" class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div class="flex-1">
                            <h5 class="text-sm font-medium text-blue-900 mb-1">Export Your Data</h5>
                            <p class="text-sm text-blue-800 mb-3">
                              Download a complete CSV file containing all your wedding guests and their information including names, table assignments, status, and dietary restrictions.
                            </p>
                            <UButton
                              @click="downloadGuestData"
                              variant="soft"
                              color="blue"
                              size="sm"
                              icon="i-heroicons-arrow-down-tray"
                              :loading="exportLoading"
                              :disabled="!hasGuestData"
                            >
                              {{ hasGuestData ? 'Download Guest List CSV' : 'No Guest Data Available' }}
                            </UButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </main>

    <!-- Footer -->
    <AppFooter />

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
const weddingStore = useWeddingStore()
const { $toast } = useNuxtApp()

// Reactive data
const activeTab = ref('profile')
const privacyLoading = ref(false)
const exportLoading = ref(false)

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

const hasGuestData = computed(() => {
  return weddingStore.guests && weddingStore.guests.length > 0
})

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

const updatePrivacySetting = async (setting: 'email_notifications' | 'marketing_emails', value: boolean) => {
  try {
    privacyLoading.value = true
    
    const updates = {
      [setting]: value
    }

    const result = await authStore.updateProfile(updates)
    
    if (result.success) {
      $toast.add({
        title: 'Preference Updated',
        description: `${setting === 'email_notifications' ? 'Email notifications' : 'Marketing communications'} ${value ? 'enabled' : 'disabled'}`,
        color: 'green'
      })
    } else {
      // Revert the toggle if update failed
      if (setting === 'email_notifications') {
        privacySettings.value.emailNotifications = !value
      } else {
        privacySettings.value.marketingEmails = !value
      }
      
      $toast.add({
        title: 'Error',
        description: authStore.error || 'Failed to update preference',
        color: 'red'
      })
    }
  } catch (error) {
    // Revert the toggle if update failed
    if (setting === 'email_notifications') {
      privacySettings.value.emailNotifications = !value
    } else {
      privacySettings.value.marketingEmails = !value
    }
    
    $toast.add({
      title: 'Error',
      description: 'Failed to update preference',
      color: 'red'
    })
  } finally {
    privacyLoading.value = false
  }
}

const downloadGuestData = async () => {
  try {
    exportLoading.value = true

    // Ensure we have guest data
    if (!weddingStore.guests || weddingStore.guests.length === 0) {
      $toast.add({
        title: 'No Data Available',
        description: 'You have no guests to export',
        color: 'orange'
      })
      return
    }

    // Prepare CSV headers
    const headers = [
      'Guest Name',
      'Table Assignment',
      'Status',
      'Dietary Restrictions',
      'Is Plus One',
      'Primary Guest',
      'Created Date',
      'Updated Date'
    ]

    // Prepare CSV data
    const csvData = weddingStore.guests.map(guest => {
      // Find table name
      const table = weddingStore.tables?.find(t => t.id === guest.tableId)
      const tableName = table?.name || 'Unassigned'
      
      // Find primary guest name if this is a plus one
      const primaryGuest = guest.primaryGuestId 
        ? weddingStore.guests.find(g => g.id === guest.primaryGuestId)
        : null
      const primaryGuestName = primaryGuest?.name || ''

      return [
        `"${guest.name}"`,
        `"${tableName}"`,
        `"${guest.status || 'pending'}"`,
        `"${guest.dietaryRestrictions || ''}"`,
        guest.isPlusOne ? 'Yes' : 'No',
        `"${primaryGuestName}"`,
        guest.createdAt.toLocaleDateString(),
        guest.updatedAt.toLocaleDateString()
      ]
    })

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      
      // Generate filename with wedding name and date
      const weddingName = authStore.profile?.wedding_name || 'Wedding'
      const sanitizedName = weddingName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const timestamp = new Date().toISOString().split('T')[0]
      link.setAttribute('download', `${sanitizedName}_guest_list_${timestamp}.csv`)
      
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      $toast.add({
        title: 'Export Successful',
        description: `Guest list exported with ${weddingStore.guests.length} guests`,
        color: 'green'
      })
    }
  } catch (error) {
    $toast.add({
      title: 'Export Failed',
      description: 'Failed to export guest data',
      color: 'red'
    })
  } finally {
    exportLoading.value = false
  }
}

// Initialize data
onMounted(async () => {
  await authStore.initialize()
  
  // Initialize wedding data to ensure we have guest information
  if (authStore.isAuthenticated) {
    await weddingStore.initializeData()
  }
  
  // Populate form with current profile data
  if (authStore.profile) {
    profileForm.value = {
      full_name: authStore.profile.full_name || '',
      email: authStore.user?.email || '',
      wedding_name: authStore.profile.wedding_name || '',
      wedding_date: authStore.profile.wedding_date || ''
    }

    // Set privacy settings from profile
    privacySettings.value = {
      emailNotifications: authStore.profile.email_notifications ?? true,
      marketingEmails: authStore.profile.marketing_emails ?? false
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

    // Update privacy settings from profile
    privacySettings.value = {
      emailNotifications: newProfile.email_notifications ?? true,
      marketingEmails: newProfile.marketing_emails ?? false
    }
  }
}, { immediate: true })
</script>