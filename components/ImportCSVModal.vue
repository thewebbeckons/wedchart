<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-2xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Import Guests from CSV</h3>
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- File Upload Section -->
        <div v-if="step === 'upload'">
          <!-- CSV Format Instructions -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-start">
              <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
                <p class="text-sm text-blue-800 mb-3">
                  Your CSV file must have exactly two columns with these headers:
                </p>
                
                <!-- Visual Example -->
                <div class="bg-white border border-blue-200 rounded-md overflow-hidden mb-4">
                  <table class="min-w-full text-sm">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-3 py-2 text-left font-medium text-gray-900 border-r border-gray-200">Guest Name</th>
                        <th class="px-3 py-2 text-left font-medium text-gray-900">Table Name</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr>
                        <td class="px-3 py-2 text-gray-700 border-r border-gray-200">John Smith</td>
                        <td class="px-3 py-2 text-gray-700">Head Table</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 text-gray-700 border-r border-gray-200">Jane Doe</td>
                        <td class="px-3 py-2 text-gray-700">Family Table 1</td>
                      </tr>
                      <tr>
                        <td class="px-3 py-2 text-gray-700 border-r border-gray-200">Bob Johnson</td>
                        <td class="px-3 py-2 text-gray-700">Friends Table</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Download Template Button -->
                <div class="flex items-center justify-between">
                  <div class="text-sm text-blue-800">
                    <strong>Need a template?</strong> Download our sample CSV file to get started.
                  </div>
                  <UButton
                    @click="downloadTemplate"
                    size="sm"
                    color="blue"
                    variant="soft"
                    icon="i-heroicons-arrow-down-tray"
                  >
                    Download Template
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- File Upload Area -->
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div class="text-center">
              <UIcon name="i-heroicons-document-arrow-up" class="mx-auto h-12 w-12 text-gray-400" />
              <div class="mt-4">
                <label class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900">
                    Choose CSV file or drag and drop
                  </span>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".csv"
                    @change="handleFileSelect"
                    class="sr-only"
                  />
                </label>
                <p class="mt-1 text-xs text-gray-500">CSV files only, max 1MB</p>
              </div>
            </div>
          </div>

          <!-- Upload Error -->
          <div class="text-red-600 text-sm" v-if="uploadError">
            <div class="flex items-center">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4 mr-2" />
              {{ uploadError }}
            </div>
          </div>

          <!-- Format Tips -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="text-sm font-medium text-gray-900 mb-2">💡 Tips for best results:</h5>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Use exactly the column headers shown above: "Guest Name" and "Table Name"</li>
              <li>• Each guest should be on a separate row</li>
              <li>• Table names will be created automatically if they don't exist</li>
              <li>• Avoid special characters in names</li>
              <li>• Save your file as CSV format (not Excel)</li>
            </ul>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-else-if="step === 'preview'">
          <div class="mb-4">
            <h4 class="text-md font-medium text-gray-900">Preview Import Data</h4>
            <p class="text-sm text-gray-600">
              Review the data below before importing. Invalid rows are highlighted in red.
            </p>
          </div>

          <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Guest Name
                  </th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Table Name
                  </th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(row, index) in previewData"
                  :key="index"
                  :class="{
                    'bg-red-50': !row.isValid,
                    'bg-white': row.isValid
                  }"
                >
                  <td class="px-4 py-2 text-sm text-gray-900">
                    {{ row.guestName }}
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-900">
                    {{ row.tableName }}
                  </td>
                  <td class="px-4 py-2 text-sm">
                    <span
                      v-if="row.isValid"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <UIcon name="i-heroicons-check-circle" class="h-3 w-3 mr-1" />
                      Valid
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      <UIcon name="i-heroicons-exclamation-triangle" class="h-3 w-3 mr-1" />
                      {{ row.errors.join(', ') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 grid grid-cols-3 gap-4 text-center">
            <div class="bg-green-50 p-3 rounded-md border border-green-200">
              <div class="text-lg font-semibold text-green-800">{{ validRows }}</div>
              <div class="text-sm text-green-600">Valid Rows</div>
            </div>
            <div class="bg-red-50 p-3 rounded-md border border-red-200">
              <div class="text-lg font-semibold text-red-800">{{ invalidRows }}</div>
              <div class="text-sm text-red-600">Invalid Rows</div>
            </div>
            <div class="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div class="text-lg font-semibold text-blue-800">{{ totalRows }}</div>
              <div class="text-sm text-blue-600">Total Rows</div>
            </div>
          </div>
        </div>

        <!-- Import Progress -->
        <div v-else-if="step === 'importing'">
          <div class="text-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="mx-auto h-12 w-12 text-blue-600 animate-spin" />
            <h4 class="mt-4 text-lg font-medium text-gray-900">Importing Guests...</h4>
            <p class="mt-2 text-sm text-gray-600">Please wait while we process your data.</p>
            
            <!-- Progress indicator -->
            <div class="mt-4 max-w-xs mx-auto">
              <div class="bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 45%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Import Results -->
        <div v-else-if="step === 'results'">
          <div class="text-center py-4">
            <UIcon 
              :name="importResult?.success ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
              :class="{
                'mx-auto h-12 w-12': true,
                'text-green-600': importResult?.success,
                'text-yellow-600': !importResult?.success
              }"
            />
            <h4 class="mt-4 text-lg font-medium text-gray-900">Import Complete</h4>
          </div>

          <div v-if="importResult" class="grid grid-cols-2 gap-4 mt-6">
            <div class="bg-green-50 p-4 rounded-md border border-green-200">
              <div class="text-2xl font-bold text-green-800">{{ importResult.success }}</div>
              <div class="text-sm text-green-600">Successfully Imported</div>
            </div>
            <div class="bg-red-50 p-4 rounded-md border border-red-200">
              <div class="text-2xl font-bold text-red-800">{{ importResult.failed }}</div>
              <div class="text-sm text-red-600">Failed to Import</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <div class="text-2xl font-bold text-yellow-800">{{ importResult.duplicates }}</div>
              <div class="text-sm text-yellow-600">Duplicates Skipped</div>
            </div>
            <div class="bg-blue-50 p-4 rounded-md border border-blue-200">
              <div class="text-2xl font-bold text-blue-800">{{ totalRows }}</div>
              <div class="text-sm text-blue-600">Total Processed</div>
            </div>
          </div>

          <div v-if="importResult?.errors.length" class="mt-4">
            <h5 class="text-sm font-medium text-red-800 mb-2">Import Errors:</h5>
            <div class="bg-red-50 p-3 rounded-md max-h-32 overflow-y-auto border border-red-200">
              <ul class="text-sm text-red-700 space-y-1">
                <li v-for="error in importResult.errors" :key="error">
                  • {{ error }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton
            v-if="step === 'upload' || step === 'results'"
            color="gray"
            variant="soft"
            @click="closeModal"
          >
            {{ step === 'results' ? 'Close' : 'Cancel' }}
          </UButton>
          
          <UButton
            v-if="step === 'preview'"
            color="gray"
            variant="soft"
            @click="step = 'upload'"
          >
            Back
          </UButton>
          
          <UButton
            v-if="step === 'preview'"
            @click="handleImport"
            :disabled="validRows === 0"
            :loading="loading"
          >
            Import {{ validRows }} Guests
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { CSVImportRow, ImportResult } from '~/types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { $toast } = useNuxtApp()
const weddingStore = useWeddingStore()

// Reactive data
const step = ref<'upload' | 'preview' | 'importing' | 'results'>('upload')
const previewData = ref<CSVImportRow[]>([])
const importResult = ref<ImportResult | null>(null)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement>()

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { loading } = storeToRefs(weddingStore)

const validRows = computed(() => previewData.value.filter(row => row.isValid).length)
const invalidRows = computed(() => previewData.value.filter(row => !row.isValid).length)
const totalRows = computed(() => previewData.value.length)

// Methods
const resetModal = () => {
  step.value = 'upload'
  previewData.value = []
  importResult.value = null
  uploadError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeModal = () => {
  isOpen.value = false
  resetModal()
}

const downloadTemplate = () => {
  try {
    // Create sample CSV data
    const csvContent = [
      'Guest Name,Table Name',
      'John Smith,Head Table',
      'Jane Doe,Family Table 1',
      'Bob Johnson,Friends Table',
      'Alice Brown,Family Table 1',
      'Charlie Wilson,Friends Table',
      'Diana Davis,Head Table'
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'wedding_guest_list_template.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      $toast.add({
        title: 'Template Downloaded',
        description: 'CSV template has been downloaded to your device',
        color: 'green'
      })
    }
  } catch (error) {
    console.error('Error downloading template:', error)
    $toast.add({
      title: 'Download Failed',
      description: 'Failed to download CSV template',
      color: 'red'
    })
  }
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return

  // Validate file type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    uploadError.value = 'Please select a CSV file'
    return
  }

  // Validate file size (max 1MB)
  if (file.size > 1024 * 1024) {
    uploadError.value = 'File size must be less than 1MB'
    return
  }

  try {
    uploadError.value = ''
    const text = await file.text()
    
    if (!text.trim()) {
      uploadError.value = 'The CSV file is empty'
      return
    }

    const parsedData = weddingStore.parseCSV(text)
    
    if (parsedData.length === 0) {
      uploadError.value = 'No valid data found in the CSV file. Please check the format and try again.'
      return
    }

    previewData.value = parsedData
    step.value = 'preview'
    
  } catch (error) {
    console.error('Error parsing CSV:', error)
    uploadError.value = error instanceof Error ? error.message : 'Failed to parse CSV file. Please check the format and try again.'
  }
}

const handleImport = async () => {
  try {
    step.value = 'importing'
    
    const validData = previewData.value.filter(row => row.isValid)
    importResult.value = await weddingStore.importFromCSV(validData)
    
    step.value = 'results'
    
    if (importResult.value.success > 0) {
      $toast.add({
        title: 'Import Successful',
        description: `Successfully imported ${importResult.value.success} guests`,
        color: 'green'
      })
    }
    
  } catch (error) {
    console.error('Import error:', error)
    $toast.add({
      title: 'Import Failed',
      description: 'Failed to import CSV data',
      color: 'red'
    })
    step.value = 'preview'
  }
}

// Reset modal when it opens
watch(isOpen, (newValue) => {
  if (newValue) {
    resetModal()
  }
})
</script>