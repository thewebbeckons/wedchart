<template>
  <AuthCheck>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <AppHeader page="dashboard" @share-list="showShareModal = true" />

      <!-- Main Content -->
      <main class="flex-1 py-8">
        <UContainer>
          <div class="space-y-8">
            <!-- Wedding Header Section -->
            <div class="text-center">
              <h2 class="text-4xl font-bold text-gray-900 mb-2">
                {{ weddingDisplayName }}
              </h2>
              <p class="text-lg text-gray-600">
                {{ weddingCountdownMessage }}
              </p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-users" class="h-8 w-8 text-blue-600" />
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Guests</p>
                    <p class="text-2xl font-bold text-gray-900">{{ totalGuests }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-table-cells" class="h-8 w-8 text-green-600" />
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Tables</p>
                    <p class="text-2xl font-bold text-gray-900">{{ totalTables }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-check-circle" class="h-8 w-8 text-emerald-600" />
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Assigned</p>
                    <p class="text-2xl font-bold text-gray-900">{{ assignedGuests }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-exclamation-circle" class="h-8 w-8 text-amber-600" />
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Unassigned</p>
                    <p class="text-2xl font-bold text-gray-900">{{ unassignedGuests }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Guest Management Table -->
            <Transition name="slide-up" appear>
              <GuestTable />
            </Transition>
          </div>        
        </UContainer>
      </main>

      <!-- Footer -->
      <AppFooter />

      <!-- Share List Modal -->
      <ShareListModal v-model="showShareModal" />

      <!-- Notifications -->
      <UNotifications />
    </div>    
  </AuthCheck>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Dashboard - WedChart',
  meta: [
    { name: 'description', content: 'Manage your wedding guests and table assignments with ease' }
  ]
})

const authStore = useAuthStore()
const weddingStore = useWeddingStore()

// Reactive data
const showShareModal = ref(false)

// Computed - with safe fallbacks
const totalGuests = computed(() => {
  return weddingStore.guests?.length || 0
})

const totalTables = computed(() => {
  return weddingStore.tables?.length || 0
})

const assignedGuests = computed(() => {
  return weddingStore.guests?.filter(g => g.tableId)?.length || 0
})

const unassignedGuests = computed(() => {
  return weddingStore.guests?.filter(g => !g.tableId)?.length || 0
})

const weddingDisplayName = computed(() => {
  if (authStore.profile?.wedding_name) {
    return authStore.profile.wedding_name
  }
  
  if (authStore.profile?.full_name) {
    return `${authStore.profile.full_name}'s Wedding`
  }
  
  return 'Your Wedding'
})

const weddingCountdownMessage = computed(() => {
  if (!authStore.profile?.wedding_date) {
    return 'Plan your perfect wedding seating arrangement'
  }

  const weddingDate = new Date(authStore.profile.wedding_date)
  const today = new Date()
  const timeDiff = weddingDate.getTime() - today.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (daysDiff < 0) {
    return 'Congratulations on your special day! 💕'
  } else if (daysDiff === 0) {
    return 'Today is your wedding day! 🎉'
  } else if (daysDiff === 1) {
    return 'Your wedding is tomorrow! 💒'
  } else if (daysDiff <= 7) {
    return `Your wedding is in ${daysDiff} days! 💍`
  } else if (daysDiff <= 30) {
    return `${daysDiff} days until your wedding! 💕`
  } else if (daysDiff <= 365) {
    const months = Math.floor(daysDiff / 30)
    const remainingDays = daysDiff % 30
    if (months === 1) {
      return remainingDays > 0 ? `1 month and ${remainingDays} days until your wedding! 💒` : '1 month until your wedding! 💒'
    } else {
      return remainingDays > 0 ? `${months} months and ${remainingDays} days until your wedding! 💒` : `${months} months until your wedding! 💒`
    }
  } else {
    const years = Math.floor(daysDiff / 365)
    const remainingDays = daysDiff % 365
    const months = Math.floor(remainingDays / 30)
    if (years === 1) {
      return months > 0 ? `1 year and ${months} months until your wedding! 💒` : '1 year until your wedding! 💒'
    } else {
      return months > 0 ? `${years} years and ${months} months until your wedding! 💒` : `${years} years until your wedding! 💒`
    }
  }
})

// Initialize data on mount
onMounted(async () => {
  await authStore.initialize()
  if (authStore.isAuthenticated) {
    weddingStore.initializeData()
  }
})

// Clear loading states when navigating away
onBeforeUnmount(() => {
  authStore.clearLoading()
  weddingStore.clearLoading()
})
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>