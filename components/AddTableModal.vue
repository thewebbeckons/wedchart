<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Add New Table</h3>
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <UFormGroup label="Table Name" required>
          <UInput
            v-model="form.name"
            placeholder="e.g., Head Table, Family Table 1"
            :error="errors.name"
            required
            autofocus
          />
        </UFormGroup>

        <UFormGroup label="Capacity" help="Maximum number of guests (optional)">
          <UInput
            v-model="form.capacity"
            type="number"
            placeholder="e.g., 8"
            min="1"
            max="20"
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
            :loading="loading"
            :disabled="!form.name.trim()"
          >
            Add Table
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { TableFormData } from '~/types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { $toast } = useNuxtApp()
const weddingStore = useWeddingStore()

// Reactive data
const form = ref<TableFormData>({
  name: '',
  capacity: undefined
})

const errors = ref({
  name: ''
})

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { loading } = storeToRefs(weddingStore)

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    capacity: undefined
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
    errors.value.name = 'Table name is required'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const success = await weddingStore.addTable(form.value)
  
  if (success) {
    $toast.add({
      title: 'Success',
      description: 'Table added successfully',
      color: 'green'
    })
    closeModal()
  } else {
    $toast.add({
      title: 'Error',
      description: weddingStore.error || 'Failed to add table',
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