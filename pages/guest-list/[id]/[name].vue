<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {{ guestListData?.weddingName || 'Wedding Guest List' }}
          </h1>
          <p v-if="guestListData?.weddingDate" class="text-lg text-gray-600">
            {{ formatWeddingDate(guestListData.weddingDate) }}
          </p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="mx-auto h-12 w-12 text-pink-500 animate-spin mb-4" />
        <h3 class="text-lg font-medium text-gray-900">Loading guest list...</h3>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Guest List Not Found</h3>
        <p class="text-gray-600">{{ error }}</p>
      </div>

      <!-- Guest List Content -->
      <div v-else-if="guestListData" class="space-y-8">
        <!-- Search Section -->
        <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div class="text-center mb-6">
            <UIcon name="i-heroicons-magnifying-glass" class="mx-auto h-8 w-8 text-pink-500 mb-3" />
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Find Your Table</h2>
            <p class="text-gray-600">Enter your name to see your table assignment</p>
          </div>

          <div class="max-w-md mx-auto">
            <UInput
              v-model="searchQuery"
              placeholder="Enter your name to find your table"
              size="lg"
              icon="i-heroicons-magnifying-glass"
              class="w-full"
              :ui="{ 
                icon: { trailing: { pointer: '' } },
                base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
                rounded: 'rounded-xl',
                placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
                size: {
                  lg: 'text-lg'
                },
                gap: {
                  lg: 'gap-x-3'
                },
                padding: {
                  lg: 'px-4 py-4'
                }
              }"
            />
          </div>
        </div>

        <!-- Search Results -->
        <Transition name="fade" mode="out-in">
          <div v-if="searchQuery.trim()" class="space-y-4">
            <!-- Results Found -->
            <div v-if="searchResults.length > 0" class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 text-center">
                {{ searchResults.length === 1 ? 'Found your table!' : `Found ${searchResults.length} matches` }}
              </h3>
              
              <TransitionGroup name="slide-up" tag="div" class="space-y-3">
                <div
                  v-for="guest in searchResults"
                  :key="guest.name"
                  class="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500 transform transition-all duration-200 hover:shadow-lg"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ guest.name }}</h4>
                      <div class="flex items-center mt-2">
                        <UIcon name="i-heroicons-table-cells" class="h-5 w-5 text-pink-500 mr-2" />
                        <span class="text-pink-600 font-medium">{{ guest.tableName }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <UIcon name="i-heroicons-check-circle" class="h-4 w-4 mr-1" />
                        Confirmed
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>

            <!-- No Results -->
            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-user-minus" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Guest Not Found</h3>
              <p class="text-gray-600 max-w-md mx-auto">
                We couldn't find "{{ searchQuery }}" in our guest list. Please check the spelling or try a different name.
              </p>
            </div>
          </div>
        </Transition>

        <!-- Welcome Message (when no search) -->
        <div v-if="!searchQuery.trim()" class="text-center py-12">
          <div class="max-w-2xl mx-auto">
            <UIcon name="i-heroicons-heart" class="mx-auto h-16 w-16 text-pink-500 mb-6" />
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to Our Wedding!</h2>
            <p class="text-lg text-gray-600 mb-8">
              We're so excited to celebrate with you. Use the search box above to find your table assignment.
            </p>
            <div class="bg-pink-50 rounded-xl p-6 border border-pink-200">
              <p class="text-pink-800 font-medium">
                💡 Tip: Try searching with your first name, last name, or full name
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center py-8 border-t border-gray-200">
          <p class="text-gray-500 text-sm">
            Can't find your name? Please contact the wedding party for assistance.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { PublicGuestListData } from '~/types'

// Meta
useHead({
  title: 'Wedding Guest List',
  meta: [
    { name: 'description', content: 'Find your table assignment for the wedding' }
  ]
})

const route = useRoute()
const weddingStore = useWeddingStore()

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const guestListData = ref<PublicGuestListData | null>(null)
const searchQuery = ref('')

// Computed
const searchResults = computed(() => {
  if (!searchQuery.value.trim() || !guestListData.value) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  return guestListData.value.guests.filter(guest =>
    guest.name.toLowerCase().includes(query)
  )
})

// Methods
const formatWeddingDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const fetchGuestList = async () => {
  try {
    loading.value = true
    error.value = null

    const uniqueId = route.params.id as string
    
    if (!uniqueId) {
      throw new Error('Invalid guest list ID')
    }

    const result = await weddingStore.getPublicGuestList(uniqueId)
    
    if (result.success && result.data) {
      guestListData.value = result.data
    } else {
      throw new Error(result.error || 'Guest list not found')
    }

  } catch (err: any) {
    console.error('Error fetching guest list:', err)
    error.value = err.message || 'Failed to load guest list'
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchGuestList()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-move {
  transition: transform 0.3s ease;
}
</style>