<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <UContainer>
      <div class="flex justify-between items-center py-6">
        <!-- Logo and Title -->
        <div>
          <NuxtLink :to="logoLink" class="flex items-center">
            <UIcon name="i-heroicons-heart" class="h-8 w-8 text-pink-500 mr-3" />
            <h1 class="text-3xl font-bold text-gray-900">WedChart</h1>
          </NuxtLink>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- Welcome Message (only on dashboard) -->
          <span 
            v-if="showWelcome && authStore.profile" 
            class="text-sm text-gray-600 hidden sm:block"
          >
            Welcome, {{ authStore.profile.full_name }}
          </span>
          
          <!-- Table Planner Button (only on dashboard) -->
          <UButton
            v-if="showTablePlannerButton"
            @click="$router.push('/table-planner')"
            variant="soft"
            color="blue"
            icon="i-heroicons-table-cells"
            class="hidden sm:flex"
          >
            Table Planner
          </UButton>
          
          <!-- Share List Button (only on dashboard) -->
          <UButton
            v-if="showShareButton"
            @click="$emit('share-list')"
            variant="soft"
            color="pink"
            icon="i-heroicons-share"
            data-umami-event="share_list"
            class="hidden sm:flex"
          >
            Share List
          </UButton>
          
          <!-- Mobile Menu (only on dashboard) -->
          <UDropdown 
            v-if="showMobileMenu"
            :items="mobileMenuItems" 
            class="sm:hidden"
          >
            <UButton 
              icon="i-heroicons-ellipsis-vertical" 
              size="sm" 
              color="gray" 
              variant="soft" 
            />
          </UDropdown>
          
          <!-- Dashboard Button (only on account page) -->
          <UButton
            v-if="showDashboardButton"
            @click="$router.push('/dashboard')"
            variant="soft"
            color="gray"
            icon="i-heroicons-squares-2x2"
          >
            <span class="hidden sm:inline">Dashboard</span>
          </UButton>
          
          <!-- Account Button (only on dashboard) -->
          <UButton
            v-if="showAccountButton"
            @click="$router.push('/account')"
            variant="soft"
            color="gray"
            icon="i-heroicons-user"
          >
            <span class="hidden sm:inline">Account</span>
          </UButton>

          <!-- Logout Button (only on account page) -->
          <UButton
            v-if="showLogoutButton"
            @click="handleLogout"
            variant="soft"
            color="red"
            icon="i-heroicons-arrow-right-on-rectangle"
          >
            Logout
          </UButton>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
interface Props {
  page: 'dashboard' | 'account'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'share-list': []
}>()

const authStore = useAuthStore()
const route = useRoute()

// Computed properties for conditional rendering
const showWelcome = computed(() => props.page === 'dashboard')
const showTablePlannerButton = computed(() => props.page === 'dashboard' && route.path !== '/table-planner')
const showShareButton = computed(() => props.page === 'dashboard')
const showMobileMenu = computed(() => props.page === 'dashboard')
const showAccountButton = computed(() => props.page === 'dashboard')
const showDashboardButton = computed(() => props.page === 'account')
const showLogoutButton = computed(() => props.page === 'account')

// Logo link - dashboard for authenticated users, home for account page
const logoLink = computed(() => {
  if (props.page === 'account') {
    return '/dashboard'
  }
  return '/dashboard'
})

// Mobile menu items
const mobileMenuItems = computed(() => [
  [{
    label: 'Table Planner',
    icon: 'i-heroicons-table-cells',
    click: () => navigateTo('/table-planner')
  }],
  [{
    label: 'Share List',
    icon: 'i-heroicons-share',
    click: () => emit('share-list')
  }]
])

// Methods
const handleLogout = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    await navigateTo('/')
  }
}
</script>