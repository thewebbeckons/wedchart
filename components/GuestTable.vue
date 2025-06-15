<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Guest Management</h3>
          <p class="text-sm text-gray-600 mt-1">
            Manage your wedding guests and table assignments
          </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center space-x-3">
          <UButton
            @click="showAddGuestModal = true"
            icon="i-heroicons-plus"
            size="sm"
            class="hidden sm:flex"
            :loading="weddingStore.loading"
          >
            Add Guest
          </UButton>
          
          <UButton
            @click="showAddTableModal = true"
            icon="i-heroicons-table-cells"
            size="sm"
            color="blue"
            variant="soft"
            class="hidden sm:flex"
            :loading="weddingStore.loading"
          >
            Add Table
          </UButton>
          
          <UButton
            @click="showImportModal = true"
            icon="i-heroicons-arrow-up-tray"
            size="sm"
            color="green"
            variant="soft"
            class="hidden sm:flex"
            data-umami-event="import_csv"
            :loading="weddingStore.loading"
          >
            Import CSV
          </UButton>

          <!-- Mobile menu button -->
          <UDropdown 
            :items="mobileMenuItems" 
            class="sm:hidden"
            :ui="{ item: { disabled: 'cursor-default opacity-50' } }"
          >
            <UButton 
              icon="i-heroicons-ellipsis-vertical" 
              size="sm" 
              color="gray" 
              variant="soft" 
            />
          </UDropdown>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Table Filter -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Table</label>
          <USelect
            v-model="selectedTableFilter"
            :options="tableFilterOptions"
            placeholder="Select a table"
            size="sm"
            class="w-full"
          />
        </div>

        <!-- Status Filter -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <USelect
            v-model="selectedStatusFilter"
            :options="statusFilterOptions"
            placeholder="Select a status"
            size="sm"
            class="w-full"
          />
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <UButton
            @click="clearFilters"
            variant="soft"
            color="gray"
            size="sm"
            icon="i-heroicons-x-mark"
            :disabled="!hasActiveFilters"
          >
            Clear
          </UButton>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap gap-2">
        <span class="text-sm text-gray-600">Active filters:</span>
        <UBadge
          v-if="selectedTableFilter"
          variant="soft"
          color="blue"
          size="sm"
        >
          Table: {{ getTableFilterLabel(selectedTableFilter) }}
        </UBadge>
        <UBadge
          v-if="selectedStatusFilter"
          variant="soft"
          color="green"
          size="sm"
        >
          Status: {{ getStatusFilterLabel(selectedStatusFilter) }}
        </UBadge>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="weddingStore.error" class="px-6 py-4 bg-red-50 border-b border-red-200">
      <UAlert
        :title="weddingStore.error"
        color="red"
        variant="soft"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'soft' }"
        @close="weddingStore.error = null"
      />
    </div>
    
    <div class="overflow-x-auto">
      <UTable
        :rows="paginatedGuests"
        :columns="columns"
        :loading="weddingStore.loading"
        :empty-state="{
          icon: 'i-heroicons-users',
          label: filteredGuests.length === 0 && hasActiveFilters ? 'No guests match your filters' : 'No guests found',
          description: filteredGuests.length === 0 && hasActiveFilters ? 'Try adjusting your filters to see more results.' : (weddingStore.initialized ? 'Get started by adding your first guest.' : 'Loading guests...')
        }"
        class="w-full"
      >
        <template #name-data="{ row }">
          <div class="flex items-center">
            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <UIcon name="i-heroicons-user" class="h-4 w-4 text-blue-600" />
            </div>
            <span class="font-medium text-gray-900">{{ row.name }}</span>
          </div>
        </template>

        <template #tableName-data="{ row }">
          <span 
            :class="{
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
              'bg-green-100 text-green-800': row.tableName !== 'Unassigned',
              'bg-gray-100 text-gray-800': row.tableName === 'Unassigned'
            }"
          >
            {{ row.tableName }}
          </span>
        </template>

        <template #status-data="{ row }">
          <span 
            :class="{
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize': true,
              'bg-green-100 text-green-800': row.status === 'confirmed',
              'bg-yellow-100 text-yellow-800': row.status === 'pending',
              'bg-red-100 text-red-800': row.status === 'declined'
            }"
          >
            {{ row.status || 'pending' }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center justify-end space-x-2">
            <UButton
              @click="editGuest(row)"
              size="sm"
              color="blue"
              variant="soft"
              icon="i-heroicons-pencil"
              :loading="weddingStore.loading"
            />
            <UButton
              @click="confirmDelete(row)"
              size="sm"
              color="red"
              variant="soft"
              icon="i-heroicons-trash"
              :loading="weddingStore.loading"
            />
          </div>
        </template>
      </UTable>
    </div>

    <!-- Pagination -->
    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ startIndex }} to {{ endIndex }} 
        of {{ totalFilteredGuests }} guests
        {{ hasActiveFilters ? `(filtered from ${totalGuests} total)` : '' }}
      </div>
      <UPagination
        v-model="currentPage"
        :page-count="pageSize"
        :total="totalFilteredGuests"
        show-last
        show-first
      />
    </div>

    <!-- Edit Guest Modal -->
    <UModal v-model="showEditModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Edit Guest</h3>
            <UButton
              color="gray"
              variant="soft"
              icon="i-heroicons-x-mark-20-solid"
              @click="showEditModal = false"
            />
          </div>
        </template>

        <form @submit.prevent="handleEditSubmit" class="space-y-4">
          <UFormGroup label="Guest Name" required>
            <UInput
              v-model="editForm.name"
              placeholder="Enter guest name"
              :error="editErrors.name"
              required
            />
          </UFormGroup>

          <UFormGroup label="Table Assignment">
            <USelect
              v-model="editForm.tableId"
              :options="weddingStore.tableOptions"
              placeholder="Select a table"
            />
          </UFormGroup>

          <UFormGroup label="Status">
            <USelect
              v-model="editForm.status"
              :options="statusOptions"
              placeholder="Select status"
            />
          </UFormGroup>

          <div class="flex justify-end space-x-2 pt-4">
            <UButton
              type="button"
              color="gray"
              variant="soft"
              @click="showEditModal = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              :loading="weddingStore.loading"
              :disabled="!editForm.name.trim()"
            >
              Update Guest
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-red-600">Delete Guest</h3>
            <UButton
              color="gray"
              variant="soft"
              icon="i-heroicons-x-mark-20-solid"
              @click="showDeleteModal = false"
            />
          </div>
        </template>

        <div class="py-4">
          <p class="text-gray-600">
            Are you sure you want to delete <strong>{{ guestToDelete?.name }}</strong>? 
            This action cannot be undone.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              color="gray"
              variant="soft"
              @click="showDeleteModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              @click="handleDelete"
              :loading="weddingStore.loading"
            >
              Delete Guest
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Add Guest Modal -->
    <AddGuestModal v-model="showAddGuestModal" />
    
    <!-- Add Table Modal -->
    <AddTableModal v-model="showAddTableModal" />
    
    <!-- Import CSV Modal -->
    <ImportCSVModal v-model="showImportModal" />
  </div>
</template>

<script setup lang="ts">
import type { Guest, GuestFormData } from '~/types'

const { $toast } = useNuxtApp()
const weddingStore = useWeddingStore()

// Reactive data
const currentPage = ref(1)
const pageSize = 10 // Fixed to 10 guests per page
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAddGuestModal = ref(false)
const showAddTableModal = ref(false)
const showImportModal = ref(false)
const guestToEdit = ref<Guest | null>(null)
const guestToDelete = ref<Guest | null>(null)

// Filter state
const selectedTableFilter = ref<string | null>(null)
const selectedStatusFilter = ref<string | null>(null)

const editForm = ref<GuestFormData>({
  name: '',
  tableId: null,
  status: 'pending'
})

const editErrors = ref({
  name: ''
})

// Computed
const { guestsWithTableNames } = storeToRefs(weddingStore)

const columns = [
  {
    key: 'name',
    label: 'Guest Name',
    sortable: true
  },
  {
    key: 'tableName',
    label: 'Table Assignment',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Actions',
    class: 'text-right'
  }
]

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Declined', value: 'declined' }
]

// Filter options - removed "All" options
const tableFilterOptions = computed(() => {
  const uniqueTables = new Set<string>()
  guestsWithTableNames.value.forEach(guest => {
    if (guest.tableId) {
      uniqueTables.add(guest.tableId)
    }
  })
  
  const options = [
    { label: 'Unassigned', value: 'unassigned' }
  ]
  
  // Add actual tables
  weddingStore.tables.forEach(table => {
    if (uniqueTables.has(table.id)) {
      options.push({
        label: table.name,
        value: table.id
      })
    }
  })
  
  return options
})

const statusFilterOptions = computed(() => [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Declined', value: 'declined' }
])

const hasActiveFilters = computed(() => {
  return selectedTableFilter.value !== null || selectedStatusFilter.value !== null
})

// Filter and sort guests
const filteredGuests = computed(() => {
  let guests = [...guestsWithTableNames.value]
  
  // Apply table filter
  if (selectedTableFilter.value !== null) {
    if (selectedTableFilter.value === 'unassigned') {
      guests = guests.filter(guest => !guest.tableId)
    } else {
      guests = guests.filter(guest => guest.tableId === selectedTableFilter.value)
    }
  }
  
  // Apply status filter
  if (selectedStatusFilter.value !== null) {
    guests = guests.filter(guest => (guest.status || 'pending') === selectedStatusFilter.value)
  }
  
  // Apply sorting
  return guests.sort((a, b) => {
    let aValue = a[sortBy.value as keyof typeof a]
    let bValue = b[sortBy.value as keyof typeof b]
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()
    
    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
})

const totalGuests = computed(() => guestsWithTableNames.value.length)
const totalFilteredGuests = computed(() => filteredGuests.value.length)

const startIndex = computed(() => {
  if (totalFilteredGuests.value === 0) return 0
  return ((currentPage.value - 1) * pageSize) + 1
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * pageSize, totalFilteredGuests.value)
})

const paginatedGuests = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredGuests.value.slice(start, end)
})

const mobileMenuItems = computed(() => [
  [{
    label: 'Add Guest',
    icon: 'i-heroicons-plus',
    click: () => showAddGuestModal.value = true
  }],
  [{
    label: 'Add Table',
    icon: 'i-heroicons-table-cells',
    click: () => showAddTableModal.value = true
  }],
  [{
    label: 'Import CSV',
    icon: 'i-heroicons-arrow-up-tray',
    click: () => showImportModal.value = true
  }]
])

// Filter helper methods
const getTableFilterLabel = (value: string): string => {
  if (value === 'unassigned') return 'Unassigned'
  const table = weddingStore.tables.find(t => t.id === value)
  return table?.name || 'Unknown'
}

const getStatusFilterLabel = (value: string): string => {
  const option = statusFilterOptions.value.find(opt => opt.value === value)
  return option?.label || value
}

const clearFilters = () => {
  selectedTableFilter.value = null
  selectedStatusFilter.value = null
  currentPage.value = 1
}

// Methods
const editGuest = (guest: Guest) => {
  guestToEdit.value = guest
  editForm.value = {
    name: guest.name,
    tableId: guest.tableId,
    status: guest.status || 'pending'
  }
  editErrors.value = { name: '' }
  showEditModal.value = true
}

const confirmDelete = (guest: Guest) => {
  guestToDelete.value = guest
  showDeleteModal.value = true
}

const handleEditSubmit = async () => {
  // Validate form
  editErrors.value = { name: '' }
  
  if (!editForm.value.name.trim()) {
    editErrors.value.name = 'Guest name is required'
    return
  }

  if (guestToEdit.value) {
    const success = await weddingStore.updateGuest(guestToEdit.value.id, editForm.value)
    
    if (success) {
      showEditModal.value = false
      guestToEdit.value = null
    } else {
      $toast.add({
        title: 'Error',
        description: weddingStore.error || 'Failed to update guest',
        color: 'red'
      })
    }
  }
}

const handleDelete = async () => {
  if (guestToDelete.value) {
    const success = await weddingStore.deleteGuest(guestToDelete.value.id)
    
    if (success) {
      showDeleteModal.value = false
      guestToDelete.value = null
    } else {
      $toast.add({
        title: 'Error',
        description: weddingStore.error || 'Failed to delete guest',
        color: 'red'
      })
    }
  }
}

// Watch for changes in guest list to reset pagination if needed
watch(filteredGuests, () => {
  const totalPages = Math.ceil(totalFilteredGuests.value / pageSize)
  if (currentPage.value > totalPages && totalPages > 0) {
    currentPage.value = totalPages
  }
})

// Reset pagination when filters change
watch([selectedTableFilter, selectedStatusFilter], () => {
  currentPage.value = 1
})

// Initialize data when component mounts
onMounted(() => {
  if (!weddingStore.initialized) {
    weddingStore.initializeData()
  }
})
</script>