<template>
  <AuthCheck>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <AppHeader page="dashboard" @share-list="showShareModal = true" />

      <!-- Main Content -->
      <main class="flex-1 py-8">
        <UContainer>
          <div class="space-y-6">
            <!-- Page Header -->
            <div class="text-center">
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Table Planner</h2>
              <p class="text-lg text-gray-600 mb-4">
                Drag and drop guests to assign them to tables
              </p>
              <!-- Link back to guest management -->
              <UButton
                @click="$router.push('/dashboard')"
                variant="soft"
                color="gray"
                icon="i-heroicons-arrow-left"
                size="sm"
              >
                Back to Guest Management
              </UButton>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div class="text-center">
                  <p class="text-2xl font-bold text-blue-600">{{ totalGuests }}</p>
                  <p class="text-sm text-gray-600">Total Guests</p>
                </div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div class="text-center">
                  <p class="text-2xl font-bold text-amber-600">{{ unassignedGuests }}</p>
                  <p class="text-sm text-gray-600">Unassigned</p>
                </div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div class="text-center">
                  <p class="text-2xl font-bold text-green-600">{{ assignedGuests }}</p>
                  <p class="text-sm text-gray-600">Assigned</p>
                </div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div class="text-center">
                  <p class="text-2xl font-bold text-purple-600">{{ totalTables }}</p>
                  <p class="text-sm text-gray-600">Tables</p>
                </div>
              </div>
            </div>

            <!-- Main Planning Interface -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <!-- Left Section - Unassigned Guests -->
              <div class="lg:col-span-1">
                <!-- Title and Add Button (outside the card) -->
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Unassigned Guests
                    <span class="ml-2 text-sm font-normal text-gray-500">
                      ({{ unassignedGuestsList.length }})
                    </span>
                  </h3>
                  <UButton
                    @click="showAddGuestModal = true"
                    size="sm"
                    icon="i-heroicons-plus"
                    variant="soft"
                  >
                    Add
                  </UButton>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div class="p-4 border-b border-gray-200">
                    <!-- Search Filter -->
                    <UInput
                      v-model="guestSearchQuery"
                      placeholder="Search guests..."
                      icon="i-heroicons-magnifying-glass"
                      size="sm"
                      class="mb-4"
                    />

                    <!-- Status Filter with Clear Button -->
                    <div class="flex items-center space-x-2">
                      <USelect
                        v-model="statusFilter"
                        :options="statusFilterOptions"
                        placeholder="Filter by status"
                        size="sm"
                        value-attribute="value"
                        option-attribute="label"
                        class="flex-1"
                      />
                      <UButton
                        v-if="statusFilter !== null"
                        @click="clearStatusFilter"
                        icon="i-heroicons-x-mark"
                        size="sm"
                        color="gray"
                        variant="soft"
                        :ui="{ rounded: 'rounded-full' }"
                      />
                    </div>
                  </div>

                  <!-- Unassigned Guest List -->
                  <div class="p-4 max-h-[600px] overflow-y-auto">
                    <div class="space-y-2">
                      <div
                        v-for="guest in filteredUnassignedGuests"
                        :key="guest.id"
                        :draggable="true"
                        @dragstart="handleDragStart(guest, $event)"
                        @dragend="handleDragEnd"
                        class="guest-card bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-move hover:bg-gray-100 transition-colors duration-200"
                        :class="{ 'opacity-50': draggingGuest?.id === guest.id }"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              {{ guest.name }}
                            </p>
                            <div class="flex items-center mt-1">
                              <span
                                :class="{
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium': true,
                                  'bg-green-100 text-green-800': guest.status === 'confirmed',
                                  'bg-yellow-100 text-yellow-800': guest.status === 'pending',
                                  'bg-red-100 text-red-800': guest.status === 'declined'
                                }"
                              >
                                {{ guest.status || 'pending' }}
                              </span>
                            </div>
                          </div>
                          <UIcon name="i-heroicons-bars-3" class="h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <!-- Empty State -->
                      <div v-if="filteredUnassignedGuests.length === 0" class="text-center py-8">
                        <UIcon name="i-heroicons-users" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p class="text-gray-500">
                          {{ guestSearchQuery || statusFilter ? 'No guests match your filters' : 'All guests are assigned!' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Section - Table Grid -->
              <div class="lg:col-span-3">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">
                      Tables
                      <span class="ml-2 text-sm font-normal text-gray-500">
                        ({{ tables.length }})
                      </span>
                    </h3>
                    <UButton
                      @click="showAddTableModal = true"
                      size="sm"
                      icon="i-heroicons-table-cells"
                      color="blue"
                      variant="soft"
                    >
                      Add Table
                    </UButton>
                  </div>

                  <!-- Tables Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div
                      v-for="table in tables"
                      :key="table.id"
                      @dragover="handleDragOver"
                      @drop="handleDrop(table, $event)"
                      @dragenter="handleDragEnter(table)"
                      @dragleave="handleDragLeave"
                      class="table-card bg-white border-2 border-gray-200 rounded-lg p-4 transition-all duration-200"
                      :class="{
                        'border-blue-400 bg-blue-50': dragOverTable?.id === table.id && canDropOnTable(table),
                        'border-red-400 bg-red-50': dragOverTable?.id === table.id && !canDropOnTable(table),
                        'border-green-400 bg-green-50': getTableGuests(table.id).length === table.capacity && table.capacity > 0
                      }"
                    >
                      <!-- Table Header -->
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex-1 min-w-0">
                          <h4 class="text-lg font-semibold text-gray-900 truncate">
                            {{ table.name }}
                          </h4>
                          <div class="flex items-center space-x-2 mt-1">
                            <span class="text-sm text-gray-600">
                              {{ getTableGuests(table.id).length }}{{ table.capacity ? `/${table.capacity}` : '' }} guests
                            </span>
                            <div
                              v-if="table.capacity"
                              class="flex-1 bg-gray-200 rounded-full h-2 max-w-20"
                            >
                              <div
                                :class="{
                                  'h-2 rounded-full transition-all duration-300': true,
                                  'bg-green-500': getTableGuests(table.id).length / table.capacity <= 0.7,
                                  'bg-yellow-500': getTableGuests(table.id).length / table.capacity > 0.7 && getTableGuests(table.id).length < table.capacity,
                                  'bg-red-500': getTableGuests(table.id).length >= table.capacity
                                }"
                                :style="{ width: `${Math.min((getTableGuests(table.id).length / table.capacity) * 100, 100)}%` }"
                              />
                            </div>
                          </div>
                        </div>
                        <UDropdown :items="getTableMenuItems(table)">
                          <UButton
                            icon="i-heroicons-ellipsis-vertical"
                            size="sm"
                            color="gray"
                            variant="soft"
                          />
                        </UDropdown>
                      </div>

                      <!-- Table Location -->
                      <div v-if="table.location" class="mb-3">
                        <div class="flex items-center text-sm text-gray-600">
                          <UIcon name="i-heroicons-map-pin" class="h-4 w-4 mr-1" />
                          {{ table.location }}
                        </div>
                      </div>

                      <!-- Assigned Guests -->
                      <div class="space-y-2 min-h-24 max-h-60 overflow-y-auto">
                        <div
                          v-for="guest in getTableGuests(table.id)"
                          :key="guest.id"
                          :draggable="true"
                          @dragstart="handleDragStart(guest, $event)"
                          @dragend="handleDragEnd"
                          class="guest-card-small bg-gray-50 border border-gray-200 rounded-md p-2 cursor-move hover:bg-gray-100 transition-colors duration-200 group"
                          :class="{ 'opacity-50': draggingGuest?.id === guest.id }"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-900 truncate">
                                {{ guest.name }}
                              </p>
                              <span
                                :class="{
                                  'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium': true,
                                  'bg-green-100 text-green-700': guest.status === 'confirmed',
                                  'bg-yellow-100 text-yellow-700': guest.status === 'pending',
                                  'bg-red-100 text-red-700': guest.status === 'declined'
                                }"
                              >
                                {{ guest.status || 'pending' }}
                              </span>
                            </div>
                            <div class="flex items-center space-x-1">
                              <UButton
                                @click="removeGuestFromTable(guest.id)"
                                icon="i-heroicons-x-mark"
                                size="2xs"
                                color="red"
                                variant="soft"
                                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              />
                              <UIcon name="i-heroicons-bars-3" class="h-3 w-3 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <!-- Drop Zone Indicator -->
                        <div
                          v-if="dragOverTable?.id === table.id && draggingGuest"
                          class="border-2 border-dashed border-blue-400 rounded-md p-4 text-center"
                          :class="{
                            'border-blue-400 text-blue-600': canDropOnTable(table),
                            'border-red-400 text-red-600': !canDropOnTable(table)
                          }"
                        >
                          <UIcon 
                            :name="canDropOnTable(table) ? 'i-heroicons-plus' : 'i-heroicons-x-mark'" 
                            class="h-6 w-6 mx-auto mb-2" 
                          />
                          <p class="text-sm font-medium">
                            {{ canDropOnTable(table) ? 'Drop guest here' : 'Table is full' }}
                          </p>
                        </div>

                        <!-- Empty Table State -->
                        <div v-if="getTableGuests(table.id).length === 0 && !dragOverTable" class="text-center py-6">
                          <UIcon name="i-heroicons-user-plus" class="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p class="text-sm text-gray-500">No guests assigned</p>
                          <p class="text-xs text-gray-400">Drag guests here</p>
                        </div>
                      </div>
                    </div>

                    <!-- Add Table Card -->
                    <div
                      @click="showAddTableModal = true"
                      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <UIcon name="i-heroicons-plus" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p class="text-lg font-medium text-gray-600">Add New Table</p>
                      <p class="text-sm text-gray-500">Create a table for your guests</p>
                    </div>
                  </div>

                  <!-- Empty Tables State -->
                  <div v-if="tables.length === 0" class="text-center py-12">
                    <UIcon name="i-heroicons-table-cells" class="mx-auto h-16 w-16 text-gray-400 mb-6" />
                    <h3 class="text-xl font-medium text-gray-900 mb-2">No Tables Created</h3>
                    <p class="text-gray-600 mb-6">Create your first table to start organizing your guests</p>
                    <UButton
                      @click="showAddTableModal = true"
                      icon="i-heroicons-plus"
                      size="lg"
                    >
                      Create First Table
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UContainer>
      </main>

      <!-- Footer -->
      <AppFooter />

      <!-- Modals -->
      <AddGuestModal v-model="showAddGuestModal" />
      <AddTableModal v-model="showAddTableModal" />
      <ShareListModal v-model="showShareModal" />

      <!-- Notifications -->
      <UNotifications />
    </div>
  </AuthCheck>
</template>

<script setup lang="ts">
import type { Guest, Table } from '~/types'

// Meta
useHead({
  title: 'Table Planner - WedChart',
  meta: [
    { name: 'description', content: 'Plan your wedding seating arrangements with drag and drop' }
  ]
})

const authStore = useAuthStore()
const weddingStore = useWeddingStore()
const { $toast } = useNuxtApp()

// Reactive data
const showAddGuestModal = ref(false)
const showAddTableModal = ref(false)
const showShareModal = ref(false)
const guestSearchQuery = ref('')
const statusFilter = ref<string | null>(null)
const draggingGuest = ref<Guest | null>(null)
const dragOverTable = ref<Table | null>(null)

// Computed
const { guests, tables } = storeToRefs(weddingStore)

const totalGuests = computed(() => guests.value?.length || 0)
const totalTables = computed(() => tables.value?.length || 0)
const assignedGuests = computed(() => guests.value?.filter(g => g.tableId)?.length || 0)
const unassignedGuests = computed(() => guests.value?.filter(g => !g.tableId)?.length || 0)

const unassignedGuestsList = computed(() => {
  return guests.value?.filter(guest => !guest.tableId) || []
})

const statusFilterOptions = computed(() => [
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Declined', value: 'declined' }
])

const filteredUnassignedGuests = computed(() => {
  let filtered = unassignedGuestsList.value

  // Apply search filter
  if (guestSearchQuery.value.trim()) {
    const query = guestSearchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(guest =>
      guest.name.toLowerCase().includes(query)
    )
  }

  // Apply status filter - only filter if statusFilter has a value (not null)
  if (statusFilter.value !== null) {
    filtered = filtered.filter(guest =>
      (guest.status || 'pending') === statusFilter.value
    )
  }

  return filtered
})

// Methods
const clearStatusFilter = () => {
  statusFilter.value = null
}

const getTableGuests = (tableId: string): Guest[] => {
  return guests.value?.filter(guest => guest.tableId === tableId) || []
}

const canDropOnTable = (table: Table): boolean => {
  if (!draggingGuest.value) return false
  if (!table.capacity) return true // No capacity limit
  
  const currentGuests = getTableGuests(table.id)
  const isGuestAlreadyInTable = currentGuests.some(g => g.id === draggingGuest.value?.id)
  
  return isGuestAlreadyInTable || currentGuests.length < table.capacity
}

const getTableMenuItems = (table: Table) => {
  const tableGuests = getTableGuests(table.id)
  
  return [
    [{
      label: 'Edit Table',
      icon: 'i-heroicons-pencil',
      click: () => editTable(table)
    }],
    [{
      label: 'Remove Guests',
      icon: 'i-heroicons-user-minus',
      click: () => removeAllGuestsFromTable(table),
      disabled: tableGuests.length === 0
    }],
    [{
      label: 'Delete Table',
      icon: 'i-heroicons-trash',
      click: () => deleteTable(table)
    }]
  ]
}

const editTable = (table: Table) => {
  // TODO: Implement edit table functionality
  $toast.add({
    title: 'Coming Soon',
    description: 'Table editing will be available soon',
    color: 'blue'
  })
}

const removeAllGuestsFromTable = async (table: Table) => {
  const tableGuests = getTableGuests(table.id)
  
  if (tableGuests.length === 0) {
    $toast.add({
      title: 'No Guests to Remove',
      description: 'This table has no assigned guests',
      color: 'orange'
    })
    return
  }

  try {
    // Update all guests to remove their table assignment
    const updatePromises = tableGuests.map(guest =>
      weddingStore.updateGuest(guest.id, {
        name: guest.name,
        tableId: null,
        status: guest.status || 'pending'
      })
    )

    const results = await Promise.all(updatePromises)
    const successCount = results.filter(result => result).length

    if (successCount === tableGuests.length) {
      $toast.add({
        title: 'Guests Removed',
        description: `All ${tableGuests.length} guests removed from ${table.name}`,
        color: 'green'
      })
    } else if (successCount > 0) {
      $toast.add({
        title: 'Partially Completed',
        description: `${successCount} of ${tableGuests.length} guests removed from ${table.name}`,
        color: 'yellow'
      })
    } else {
      $toast.add({
        title: 'Failed to Remove Guests',
        description: 'Could not remove guests from the table',
        color: 'red'
      })
    }
  } catch (error) {
    console.error('Error removing guests from table:', error)
    $toast.add({
      title: 'Error',
      description: 'An error occurred while removing guests',
      color: 'red'
    })
  }
}

const deleteTable = async (table: Table) => {
  const tableGuests = getTableGuests(table.id)
  if (tableGuests.length > 0) {
    $toast.add({
      title: 'Cannot Delete Table',
      description: 'Please remove all guests from this table first',
      color: 'red'
    })
    return
  }

  const success = await weddingStore.deleteTable(table.id)
  if (success) {
    $toast.add({
      title: 'Table Deleted',
      description: `${table.name} has been deleted`,
      color: 'green'
    })
  }
}

// Drag and Drop Handlers
const handleDragStart = (guest: Guest, event: DragEvent) => {
  draggingGuest.value = guest
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', guest.id)
  }

  // Add visual feedback
  const target = event.target as HTMLElement
  target.style.opacity = '0.5'
}

const handleDragEnd = (event: DragEvent) => {
  draggingGuest.value = null
  dragOverTable.value = null
  
  // Reset visual feedback
  const target = event.target as HTMLElement
  target.style.opacity = '1'
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragEnter = (table: Table) => {
  dragOverTable.value = table
}

const handleDragLeave = (event: DragEvent) => {
  // Only clear if we're leaving the table card entirely
  const target = event.target as HTMLElement
  const relatedTarget = event.relatedTarget as HTMLElement
  
  if (!target.contains(relatedTarget)) {
    dragOverTable.value = null
  }
}

const handleDrop = async (table: Table, event: DragEvent) => {
  event.preventDefault()
  dragOverTable.value = null

  // Add null check for table
  if (!table) {
    console.warn('handleDrop called with null table')
    return
  }

  if (!draggingGuest.value) return

  // Check if we can drop on this table
  if (!canDropOnTable(table)) {
    $toast.add({
      title: 'Table Full',
      description: `${table.name} has reached its maximum capacity`,
      color: 'red'
    })
    return
  }

  // Check if guest is already in this table
  if (draggingGuest.value.tableId === table.id) {
    return
  }

  // Update guest's table assignment
  const success = await weddingStore.updateGuest(draggingGuest.value.id, {
    name: draggingGuest.value.name,
    tableId: table.id,
    status: draggingGuest.value.status || 'pending'
  })

  if (success) {
    $toast.add({
      title: 'Guest Assigned',
      description: `${draggingGuest.value.name} assigned to ${table.name}`,
      color: 'green'
    })
  }

  draggingGuest.value = null
}

const removeGuestFromTable = async (guestId: string) => {
  const guest = guests.value?.find(g => g.id === guestId)
  if (!guest) return

  const success = await weddingStore.updateGuest(guestId, {
    name: guest.name,
    tableId: null,
    status: guest.status || 'pending'
  })

  if (success) {
    $toast.add({
      title: 'Guest Unassigned',
      description: `${guest.name} moved to unassigned list`,
      color: 'green'
    })
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
.guest-card {
  transition: all 0.2s ease;
}

.guest-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.guest-card-small {
  transition: all 0.2s ease;
}

.guest-card-small:hover {
  transform: translateY(-1px);
}

.table-card {
  min-height: 300px;
  transition: all 0.2s ease;
}

.table-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Drag and drop visual feedback */
.guest-card[draggable="true"]:active {
  cursor: grabbing;
}

.table-card.drag-over {
  transform: scale(1.02);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>