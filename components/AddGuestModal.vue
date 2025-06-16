<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Add New Guest</h3>
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <UFormGroup label="Guest Name" required>
          <UInput
            v-model="form.name"
            placeholder="Enter guest name"
            :error="errors.name"
            required
            autofocus
          />
        </UFormGroup>

        <UFormGroup label="Table Assignment" help="Leave unassigned if you'll assign later">
          <USelect
            v-model="form.tableId"
            :options="weddingStore.tableOptions"
            placeholder="Select a table (optional)"
            value-attribute="value"
            option-attribute="label"
          />
        </UFormGroup>

        <UFormGroup label="Status">
          <USelect
            v-model="form.status"
            :options="statusOptions"
            placeholder="Select status"
            value-attribute="value"
            option-attribute="label"
          />
        </UFormGroup>

        <div class="flex justify-end space-x-2 pt-4">
          <UButton
            type="button"
            color="gray"
            variant="soft"
            @click="closeModal"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="weddingStore.loading"
            :disabled="!form.name.trim()"
          >
            Add Guest
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { GuestFormData } from '~/types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { $toast } = useNuxtApp()
const weddingStore = useWeddingStore()

// Reactive data
const form = ref<GuestFormData>({
  name: '',
  tableId: null,
  status: 'pending'
})

const errors = ref({
  name: ''
})

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Declined', value: 'declined' }
]

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    tableId: null,
    status: 'pending'
  }
  errors.value = { name: '' }
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const validateForm = (): boolean => {
  errors.value = { name: '' }
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Guest name is required'
    return false
  }

  if (form.value.name.trim().length < 2) {
    errors.value.name = 'Guest name must be at least 2 characters'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  // Ensure tableId is properly set to null for "Unassigned"
  const guestData: GuestFormData = {
    name: form.value.name.trim(),
    tableId: form.value.tableId === null || form.value.tableId === '' ? null : form.value.tableId,
    status: form.value.status || 'pending'
  }

  const success = await weddingStore.addGuest(guestData)
  
  if (success) {
    closeModal()
  } else {
    $toast.add({
      title: 'Error',
      description: weddingStore.error || 'Failed to add guest',
      color: 'red'
    })
  }
}

// Reset form when modal opens
watch(isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>