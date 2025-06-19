<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <UContainer>
        <div class="flex justify-between items-center py-6">
          <!-- Logo and Title -->
          <div>
            <NuxtLink to="/" class="flex items-center">
              <UIcon name="i-heroicons-heart" class="h-8 w-8 text-pink-500 mr-3" />
              <h1 class="text-3xl font-bold text-gray-900">WedChart</h1>
            </NuxtLink>
          </div>

          <!-- Back Button -->
          <div class="flex items-center space-x-4">
            <UButton
              @click="$router.back()"
              variant="soft"
              color="gray"
              icon="i-heroicons-arrow-left"
            >
              Back
            </UButton>
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-1 py-12">
      <UContainer>
        <div class="max-w-4xl mx-auto">
          <!-- Page Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p class="text-lg text-gray-600">
              Last updated: {{ lastUpdated }}
            </p>
          </div>

          <!-- Privacy Policy Content -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
            <!-- Introduction -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p class="text-gray-700 leading-relaxed">
                At WedChart, we respect your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our wedding seating chart service.
              </p>
            </section>

            <!-- Information We Collect -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">What Information We Collect</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>Your name and email address when you create an account</li>
                    <li>Wedding details (name, date) that you choose to provide</li>
                    <li>Guest information (names, table assignments, dietary restrictions) that you add</li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>How you use our service and which features you access</li>
                    <li>Basic technical information about your device and browser</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- How We Use Your Information -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>To provide and maintain our wedding seating chart service</li>
                <li>To create and manage your guest lists and table arrangements</li>
                <li>To generate shareable guest list links for your wedding</li>
                <li>To send you important account updates (if you've opted in)</li>
                )
                <li>To improve our service and develop new features</li>
                <li>To provide customer support when needed</li>
              </ul>
            </section>

            <!-- Data Sharing -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">When We Share Information</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                We do not sell or rent your personal information. We only share your information in these limited situations:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>When you choose to share your guest list publicly through our sharing feature</li>
                <li>With trusted service providers who help us operate our platform (under strict agreements)</li>
                <li>When required by law or to protect our rights and safety</li>
              </ul>
            </section>

            <!-- Your Rights -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Control</h2>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> View and edit your information in your account settings</li>
                <li><strong>Export:</strong> Download your guest list data in CSV format</li>
                <li><strong>Delete:</strong> Delete your account and all data at any time</li>
                <li><strong>Communication:</strong> Control email notifications and marketing preferences</li>
              </ul>
            </section>

            <!-- Data Retention -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">How Long We Keep Your Data</h2>
              <p class="text-gray-700 leading-relaxed">
                We keep your information for as long as your account is active. If you delete your account, 
                we will delete your personal information within 30 days, except where required by law.
              </p>
            </section>

            <!-- Cookies -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cookies and Analytics</h2>
              <p class="text-gray-700 leading-relaxed">
                We use essential cookies to keep you logged in and remember your preferences. We also use 
                analytics to understand how our service is used and improve the user experience. You can 
                control cookie settings through your browser.
              </p>
            </section>

            <!-- Changes to Policy -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
              <p class="text-gray-700 leading-relaxed">
                We may update this Privacy Policy occasionally. We'll notify you of any significant changes 
                by updating the date above and, for material changes, by email or through our service.
              </p>
            </section>

            <!-- Contact Information -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p class="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700">
                  <strong>Email:</strong> privacy@wedchart.me<br>
                  <strong>Subject:</strong> Privacy Policy Question
                </p>
              </div>
            </section>
          </div>
        </div>
      </UContainer>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Privacy Policy - WedChart',
  meta: [
    { name: 'description', content: 'WedChart Privacy Policy - Learn how we protect and handle your personal information' },
    { name: 'robots', content: 'index, follow' }
  ]
})

// Reactive data
const lastUpdated = ref('December 19, 2024')
</script>