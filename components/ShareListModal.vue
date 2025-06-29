<template>
  <UModal 
    v-model="isOpen" 
    :ui="{ 
      width: 'sm:max-w-2xl',
      height: 'h-auto max-h-[90vh]',
      overlay: { background: 'bg-gray-200/75 dark:bg-gray-800/75' },
      transition: {
        enter: 'duration-300 ease-out',
        enterFrom: 'opacity-0 scale-95',
        enterTo: 'opacity-100 scale-100',
        leave: 'duration-200 ease-in',
        leaveFrom: 'opacity-100 scale-100',
        leaveTo: 'opacity-0 scale-95'
      }
    }"
    :prevent-close="weddingStore.loading"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Share Guest List</h3>
            <p class="text-sm text-gray-600 mt-1">
              Generate and manage your public guest list
            </p>
          </div>
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
            :disabled="weddingStore.loading || regenerating"
            class="flex-shrink-0"
            :ui="{ rounded: 'rounded-full' }"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- No Guest List Exists -->
        <div v-if="!hasExistingList" class="text-center py-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-pink-100 mb-6">
            <UIcon name="i-heroicons-link" class="h-8 w-8 text-pink-600" />
          </div>
          
          <h4 class="text-lg font-medium text-gray-900 mb-3">Create Public Guest List</h4>
          <p class="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            Generate a shareable URL that allows your guests to search for their table assignments. 
            Only confirmed guests with table assignments will be included.
          </p>
          
          <div class="space-y-4">
            <UButton
              @click="generateComprehensiveList"
              icon="i-heroicons-plus"
              :loading="weddingStore.loading"
              size="lg"
              class="px-8"
              :disabled="confirmedGuestCount === 0"
            >
              Generate Public Guest List
            </UButton>
            
            <div class="flex items-center justify-center space-x-2 text-sm">
              <UIcon 
                :name="confirmedGuestCount > 0 ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'" 
                :class="{
                  'h-4 w-4': true,
                  'text-green-500': confirmedGuestCount > 0,
                  'text-amber-500': confirmedGuestCount === 0
                }"
              />
              <span :class="{
                'text-green-600': confirmedGuestCount > 0,
                'text-amber-600': confirmedGuestCount === 0
              }">
                {{ confirmedGuestCount }} confirmed guests ready to include
              </span>
            </div>
          </div>
        </div>

        <!-- Guest List Exists -->
        <div v-else class="space-y-6">
          <!-- Success Header -->
          <div class="text-center pb-4 border-b border-gray-200">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-green-600" />
            </div>
            <h4 class="text-lg font-medium text-gray-900">Guest List Active</h4>
            <p class="text-sm text-gray-600 mt-1">Your public guest list is ready to share</p>
          </div>

          <!-- URL Display Section -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Public Guest List URL
              </label>
              <div class="flex items-center space-x-2">
                <UInput
                  v-model="guestListUrl"
                  readonly
                  class="flex-1"
                  size="lg"
                  :ui="{
                    base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-100 focus:outline-none border-0',
                    rounded: 'rounded-lg',
                    color: {
                      white: {
                        outline: 'shadow-sm bg-gray-50 border border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500'
                      }
                    },
                    font: 'font-mono text-sm'
                  }"
                />
                <UTooltip :text="copied ? 'Copied!' : 'Copy URL'">
                  <UButton
                    @click="copyToClipboard"
                    :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                    :color="copied ? 'green' : 'gray'"
                    variant="soft"
                    size="lg"
                    class="px-4 flex-shrink-0"
                  />
                </UTooltip>
              </div>
            </div>

            <!-- Mobile Copy Button -->
            <div class="flex justify-center sm:hidden">
              <UButton
                @click="copyToClipboard"
                :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                :color="copied ? 'green' : 'blue'"
                variant="soft"
                block
              >
                {{ copied ? 'Copied!' : 'Copy URL' }}
              </UButton>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <UButton
              @click="showQRModal = true"
              icon="i-heroicons-qr-code"
              color="purple"
              variant="soft"
              block
              :disabled="regenerating"
            >
              QR Code
            </UButton>
            
            <UButton
              @click="openPreview"
              icon="i-heroicons-eye"
              color="green"
              variant="soft"
              block
              :disabled="regenerating"
            >
              Preview
            </UButton>
            
            <UButton
              @click="regenerateList"
              icon="i-heroicons-arrow-path"
              color="orange"
              variant="soft"
              :loading="regenerating"
              block
              :disabled="confirmedGuestCount === 0"
            >
              Update List
            </UButton>
          </div>

          <!-- Guest List Stats -->
          <div v-if="lastGenerationResult" class="bg-green-50 rounded-lg p-4 border border-green-200">
            <div class="flex items-center justify-center">
              <UIcon name="i-heroicons-users" class="h-5 w-5 text-green-600 mr-2" />
              <span class="text-sm font-medium text-green-800">
                {{ lastGenerationResult.guestCount }} confirmed guests in current list
              </span>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- QR Code Modal -->
    <UModal v-model="showQRModal" :ui="{ width: 'sm:max-w-md' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">QR Code for Guest List</h3>
            <UButton
              color="gray"
              variant="soft"
              icon="i-heroicons-x-mark-20-solid"
              @click="showQRModal = false"
              :ui="{ rounded: 'rounded-full' }"
            />
          </div>
        </template>

        <div class="text-center py-6">
          <h4 class="text-xl font-medium text-gray-900 mb-6">
            {{ weddingDisplayName }}
          </h4>
          
          <div class="flex justify-center mb-6">
            <div
              ref="qrCodeContainer"
              class="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm"
            ></div>
          </div>

          <p class="text-sm text-gray-600 mb-6">
            Guests can scan this QR code to access the guest list
          </p>

          <UButton
            @click="downloadQRCode"
            icon="i-heroicons-arrow-down-tray"
            color="blue"
            block
          >
            Download QR Code
          </UButton>
        </div>
      </UCard>
    </UModal>
  </UModal>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import type { GuestListGenerationResult } from '~/types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { $toast } = useNuxtApp()
const weddingStore = useWeddingStore()
const authStore = useAuthStore()

// Reactive data
const guestListUrl = ref('')
const copied = ref(false)
const showQRModal = ref(false)
const qrCodeContainer = ref<HTMLElement>()
const lastGenerationResult = ref<GuestListGenerationResult | null>(null)
const regenerating = ref(false)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const weddingDisplayName = computed(() => {
  return authStore.profile?.wedding_name || 'Wedding Guest List'
})

const hasExistingList = computed(() => {
  return !!authStore.profile?.guest_list_id && !!guestListUrl.value
})

const confirmedGuestCount = computed(() => {
  return weddingStore.confirmedGuestsWithTables.length
})

// Methods
const closeModal = () => {
  if (!weddingStore.loading && !regenerating.value) {
    isOpen.value = false
  }
}

const generateComprehensiveList = async () => {
  if (confirmedGuestCount.value === 0) {
    $toast.add({
      title: 'No Confirmed Guests',
      description: 'You need at least one confirmed guest with a table assignment to generate a guest list',
      color: 'orange'
    })
    return
  }

  try {
    const result = await weddingStore.generateComprehensiveGuestList()
    
    if (result.success && result.url) {
      guestListUrl.value = result.url
      lastGenerationResult.value = result
      
      $toast.add({
        title: 'Success',
        description: `Guest list generated with ${result.guestCount} confirmed guests`,
        color: 'green'
      })
    } else {
      $toast.add({
        title: 'Error',
        description: result.error || 'Failed to generate guest list',
        color: 'red'
      })
    }
  } catch (error) {
    console.error('Error generating guest list:', error)
    $toast.add({
      title: 'Error',
      description: 'An unexpected error occurred while generating the guest list',
      color: 'red'
    })
  }
}

const regenerateList = async () => {
  if (confirmedGuestCount.value === 0) {
    $toast.add({
      title: 'No Confirmed Guests',
      description: 'You need at least one confirmed guest with a table assignment to regenerate the list',
      color: 'orange'
    })
    return
  }

  try {
    regenerating.value = true
    
    const result = await weddingStore.generateComprehensiveGuestList()
    
    if (result.success) {
      lastGenerationResult.value = result
      
      $toast.add({
        title: 'List Updated',
        description: `Guest list updated with ${result.guestCount} confirmed guests`,
        color: 'green'
      })
    } else {
      $toast.add({
        title: 'Error',
        description: result.error || 'Failed to regenerate guest list',
        color: 'red'
      })
    }
  } catch (error) {
    console.error('Error regenerating guest list:', error)
    $toast.add({
      title: 'Error',
      description: 'An unexpected error occurred while updating the guest list',
      color: 'red'
    })
  } finally {
    regenerating.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(guestListUrl.value)
    copied.value = true
    
    $toast.add({
      title: 'Copied!',
      description: 'Guest list link copied to clipboard',
      color: 'green'
    })
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    $toast.add({
      title: 'Error',
      description: 'Failed to copy link to clipboard',
      color: 'red'
    })
  }
}

const openPreview = () => {
  window.open(guestListUrl.value, '_blank')
}

const generateQRCode = async () => {
  if (!qrCodeContainer.value || !guestListUrl.value) return

  try {
    // Clear previous QR code
    qrCodeContainer.value.innerHTML = ''
    
    // Generate QR code
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, guestListUrl.value, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    qrCodeContainer.value.appendChild(canvas)
  } catch (error) {
    console.error('Error generating QR code:', error)
    $toast.add({
      title: 'Error',
      description: 'Failed to generate QR code',
      color: 'red'
    })
  }
}

const downloadQRCode = async () => {
  try {
    const canvas = qrCodeContainer.value?.querySelector('canvas')
    if (!canvas) return

    // Create download link
    const link = document.createElement('a')
    link.download = `${weddingDisplayName.value.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_guest_list_qr.png`
    link.href = canvas.toDataURL()
    link.click()

    $toast.add({
      title: 'Downloaded',
      description: 'QR code downloaded successfully',
      color: 'green'
    })
  } catch (error) {
    $toast.add({
      title: 'Error',
      description: 'Failed to download QR code',
      color: 'red'
    })
  }
}

// Watch for QR modal opening
watch(showQRModal, (isOpen) => {
  if (isOpen && guestListUrl.value) {
    nextTick(() => {
      generateQRCode()
    })
  }
})

// Watch for modal opening to initialize data
watch(isOpen, (newValue) => {
  if (newValue) {
    // Clear any existing loading states when modal opens
    weddingStore.clearLoading()
    regenerating.value = false
    
    // Initialize with existing guest list ID if available
    if (authStore.profile?.guest_list_id) {
      const weddingName = authStore.profile.wedding_name || 'wedding'
      const urlFriendlyName = weddingName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      guestListUrl.value = `${window.location.origin}/guest-list/${authStore.profile.guest_list_id}/${urlFriendlyName}`
      
      // Get current guest count for existing list
      if (confirmedGuestCount.value > 0) {
        lastGenerationResult.value = {
          success: true,
          guestCount: confirmedGuestCount.value
        }
      }
    }
  } else {
    // Clear loading states when modal closes
    weddingStore.clearLoading()
    regenerating.value = false
  }
})

// Watch for profile changes to update URL
watch(() => authStore.profile, (newProfile) => {
  if (newProfile?.guest_list_id && newProfile.wedding_name && isOpen.value) {
    const urlFriendlyName = newProfile.wedding_name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    guestListUrl.value = `${window.location.origin}/guest-list/${newProfile.guest_list_id}/${urlFriendlyName}`
  }
}, { deep: true })

// Handle ESC key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value && !weddingStore.loading && !regenerating.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  // Clear loading states on unmount
  weddingStore.clearLoading()
  regenerating.value = false
})
</script>