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

      <form @submit.prevent="handleSubmit" class="space-y-6">
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

        <UFormGroup label="Dietary Restrictions" help="Any allergies or special dietary requirements">
          <UTextarea
            v-model="form.dietaryRestrictions"
            placeholder="Enter any dietary requirements or allergies"
            :rows="3"
            resize
          />
        </UFormGroup>

        <UFormGroup>
          <div class="flex items-center space-x-3">
            <UCheckbox
              v-model="form.hasPlusOne"
              label="This guest has a plus one"
            />
          </div>
        </UFormGroup>

        <Transition name="slide-down">
          <UFormGroup v-if="form.hasPlusOne" label="Plus One Name" required>
            <UInput
              v-model="form.plusOneName"
              placeholder="Enter plus one name"
              :error="errors.plusOneName"
              :required="form.hasPlusOne"
            />
          </UFormGroup>
        </Transition>

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
            :disabled="!isFormValid"
          >
            {{ form.hasPlusOne ? 'Add Guests' : 'Add Guest' }}
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
  status: 'pending',
  dietaryRestrictions: '',
  hasPlusOne: false,
  plusOneName: ''
})

const errors = ref({
  name: '',
  plusOneName: ''
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

const isFormValid = computed(() => {
  const hasValidName = form.value.name.trim().length > 0
  const hasValidPlusOne = !form.value.hasPlusOne || (form.value.plusOneName && form.value.plusOneName.trim().length > 0)
  return hasValidName && hasValidPlusOne && !errors.value.name && !errors.value.plusOneName
})

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    tableId: null,
    status: 'pending',
    dietaryRestrictions: '',
    hasPlusOne: false,
    plusOneName: ''
  }
  errors.value = { name: '', plusOneName: '' }
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const validateForm = (): boolean => {
  errors.value = { name: '', plusOneName: '' }
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Guest name is required'
    return false
  }

  if (form.value.name.trim().length < 2) {
    errors.value.name = 'Guest name must be at least 2 characters'
    return false
  }

  if (form.value.hasPlusOne) {
    if (!form.value.plusOneName?.trim()) {
      errors.value.plusOneName = 'Plus one name is required'
      return false
    }

    if (form.value.plusOneName.trim().length < 2) {
      errors.value.plusOneName = 'Plus one name must be at least 2 characters'
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  // Ensure tableId is properly set to null for "Unassigned"
  const guestData: GuestFormData = {
    name: form.value.name.trim(),
    tableId: form.value.tableId === null || form.value.tableId === '' ? null : form.value.tableId,
    status: form.value.status || 'pending',
    dietaryRestrictions: form.value.dietaryRestrictions?.trim() || undefined,
    hasPlusOne: form.value.hasPlusOne,
    plusOneName: form.value.plusOneName?.trim() || undefined
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

// Watch hasPlusOne to clear plus one name when unchecked
watch(() => form.value.hasPlusOne, (newValue) => {
  if (!newValue) {
    form.value.plusOneName = ''
    errors.value.plusOneName = ''
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}
</style>