<template>
  <AuthCheck>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 flex items-center">
                <UIcon name="i-heroicons-heart" class="h-8 w-8 text-red-500 mr-3" />
                WedChart
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <span v-if="authStore.profile" class="text-sm text-gray-600 hidden sm:block">
                Welcome, {{ authStore.profile.full_name }}
              </span>
              
              <!-- Share List Button -->
              <UButton
                @click="showShareModal = true"
                variant="soft"
                color="pink"
                icon="i-heroicons-share"
                class="hidden sm:flex"
              >
                Share List
              </UButton>
              
              <!-- Mobile Share Button -->
              <UButton
                @click="showShareModal = true"
                variant="soft"
                color="pink"
                icon="i-heroicons-share"
                class="sm:hidden"
                :ui="{ rounded: 'rounded-full' }"
              />
              
              <UButton
                @click="$router.push('/account')"
                variant="soft"
                color="gray"
                icon="i-heroicons-user"
              >
                <span class="hidden sm:inline">Account</span>
              </UButton>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

            <div 
              class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              @click="handleUnassignedClick"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-exclamation-circle" class="h-8 w-8 text-amber-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Unassigned</p>
                  <p class="text-2xl font-bold text-gray-900">{{ unassignedGuests }}</p>
                </div>
              </div>
              <div class="mt-2">
                <p class="text-xs text-gray-500">Click to filter unassigned guests</p>
              </div>
            </div>
          </div>

          <!-- Guest Management Table -->
          <Transition name="slide-up" appear>
            <GuestTable ref="guestTableRef" />
          </Transition>
        </div>
      </main>

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
  title: 'WedChart - Wedding Seating Chart Manager',
  meta: [
    { name: 'description', content: 'Manage your wedding guests and table assignments with ease' }
  ]
})

const authStore = useAuthStore()
const weddingStore = useWeddingStore()

// Reactive data
const showShareModal = ref(false)
const guestTableRef = ref()

// Computed
const { guests, tables } = storeToRefs(weddingStore)

const totalGuests = computed(() => guests.value.length)
const totalTables = computed(() => tables.value.length)
const assignedGuests = computed(() => guests.value.filter(g => g.tableId).length)
const unassignedGuests = computed(() => guests.value.filter(g => !g.tableId).length)

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

// Methods
const handleUnassignedClick = () => {
  if (guestTableRef.value && unassignedGuests.value > 0) {
    guestTableRef.value.filterByUnassigned()
  }
}

// Initialize data on mount
onMounted(async () => {
  await authStore.initialize()
  if (authStore.isAuthenticated) {
    weddingStore.initializeData()
  }
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