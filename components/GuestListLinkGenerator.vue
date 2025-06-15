<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Collapsible Header -->
    <div 
      @click="isCollapsed = !isCollapsed"
      class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
    >
      <div class="flex items-center space-x-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Share Guest List</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ hasExistingList ? 'Manage your public guest list' : 'Generate a public link for guests to find their table assignments' }}
          </p>
        </div>
      </div>
      
      <!-- Collapse Toggle Button -->
      <UIcon 
        :name="isCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-down'" 
        class="h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0"
      />
    </div>

    <!-- Collapsible Content -->
    <Transition
      name="collapse"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div v-show="!isCollapsed" class="overflow-hidden">
        <div class="px-6 pb-6 border-t border-gray-100">
          <!-- No Guest List Exists -->
          <div v-if="!hasExistingList" class="text-center py-6">
            <UIcon name="i-heroicons-link" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              Create a shareable URL that allows your guests to search for their table assignments. 
              Only confirmed guests with table assignments will be included.
            </p>
            
            <UButton
              @click="generateComprehensiveList"
              icon="i-heroicons-plus"
              :loading="weddingStore.loading"
              size="lg"
              class="px-8"
            >
              Generate Public Guest List
            </UButton>
            
            <p class="text-xs text-gray-500 mt-3">
              {{ confirmedGuestCount }} confirmed guests ready to include
            </p>
          </div>

          <!-- Guest List Exists -->
          <div v-else class="space-y-4 pt-4">
            <!-- URL Display with Copy Button -->
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
                      outline: 'shadow-sm bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400'
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
                  class="px-4"
                />
              </UTooltip>
            </div>

            <!-- Copy URL Button (for mobile/smaller screens) -->
            <div class="flex justify-center sm:hidden">
              <UButton
                @click="copyToClipboard"
                :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                :color="copied ? 'green' : 'blue'"
                variant="soft"
              >
                {{ copied ? 'Copied!' : 'Copy URL' }}
              </UButton>
            </div>

            <!-- Action Buttons Row -->
            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center justify-between">                
                <div class="flex items-center space-x-2">
                  <UButton
                    @click="showQRModal = true"
                    icon="i-heroicons-qr-code"
                    color="purple"
                    variant="soft"
                    size="sm"
                  >
                    Generate QR Code
                  </UButton>        
                  
                  <UButton
                    @click="openPreview"
                    icon="i-heroicons-eye"
                    color="green"
                    variant="soft"
                    size="sm"
                  >
                    Preview
                  </UButton>
                </div>
                <UButton
                    @click="regenerateList"
                    icon="i-heroicons-arrow-path"
                    color="orange"
                    variant="soft"
                    :loading="regenerating"
                    size="sm"
                  >
                    Regenerate List
                  </UButton>
              </div>
            </div>

            <!-- Guest List Stats -->
            <div v-if="lastGenerationResult" class="bg-green-50 rounded-lg p-4 border border-green-200">
              <div class="flex items-center">
                <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-600 mr-2" />
                <span class="text-sm text-green-800">
                  {{ lastGenerationResult.guestCount }} confirmed guests in current list
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

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
              class="bg-white p-4 rounded-lg border-2 border-gray-200"
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
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import type { GuestListGenerationResult } from '~/types'

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
const isCollapsed = ref(false)

// Computed
const weddingDisplayName = computed(() => {
  return authStore.profile?.wedding_name || 'Wedding Guest List'
})

const hasExistingList = computed(() => {
  return !!authStore.profile?.guest_list_id && !!guestListUrl.value
})

const confirmedGuestCount = computed(() => {
  return weddingStore.confirmedGuestsWithTables.length
})

// Collapse animation methods
const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
}

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.offsetHeight // force reflow
  element.style.height = '0'
}

const onAfterLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
}

// Methods
const generateComprehensiveList = async () => {
  if (confirmedGuestCount.value === 0) {
    $toast.add({
      title: 'No Confirmed Guests',
      description: 'You need at least one confirmed guest with a table assignment to generate a guest list',
      color: 'orange'
    })
    return
  }

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
  
  regenerating.value = false
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

// Initialize with existing guest list ID if available
onMounted(() => {
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
})

// Watch for profile changes to update URL
watch(() => authStore.profile, (newProfile) => {
  if (newProfile?.guest_list_id && newProfile.wedding_name) {
    const urlFriendlyName = newProfile.wedding_name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    guestListUrl.value = `${window.location.origin}/guest-list/${newProfile.guest_list_id}/${urlFriendlyName}`
  }
}, { deep: true })
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
}
</style>