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
                At WedChart, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our wedding seating chart service.
              </p>
            </section>

            <!-- Information We Collect -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>Name and email address when you create an account</li>
                    <li>Wedding information (wedding name, date) that you choose to provide</li>
                    <li>Guest information (names, table assignments, dietary restrictions) that you add to your seating chart</li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>How you interact with our service</li>
                    <li>Features you use and pages you visit</li>
                    <li>Technical information about your device and browser</li>
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
                <li>To send you important account and service updates (if you've opted in)</li>
                )
                <li>To improve our service and develop new features</li>
                <li>To provide customer support when needed</li>
              </ul>
            </section>

            <!-- Data Sharing -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li>When you explicitly choose to share your guest list publicly through our sharing feature</li>
                <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
                <li>When required by law or to protect our rights and safety</li>
                <li>In the event of a business transfer (with prior notice to users)</li>
              </ul>
            </section>

            <!-- Data Security -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p class="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data storage, 
                and regular security assessments. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <!-- Your Rights -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
              <ul class="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> You can view and edit your personal information in your account settings</li>
                <li><strong>Export:</strong> You can download your guest list data in CSV format</li>
                <li><strong>Delete:</strong> You can delete your account and all associated data at any time</li>
                <li><strong>Communication Preferences:</strong> You can opt out of marketing emails and notifications</li>
                <li><strong>Data Portability:</strong> You can export your data to use with other services</li>
              </ul>
            </section>

            <!-- Data Retention -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p class="text-gray-700 leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide our services. 
                If you delete your account, we will delete your personal information within 30 days, except where we are 
                required to retain certain information for legal or regulatory purposes.
              </p>
            </section>

            <!-- Cookies -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p class="text-gray-700 leading-relaxed">
                We use essential cookies to provide our service functionality, such as keeping you logged in and remembering 
                your preferences. We also use analytics tools to understand how our service is used and to improve the user experience. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <!-- Children's Privacy -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p class="text-gray-700 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us so we can delete such information.
              </p>
            </section>

            <!-- Changes to Policy -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p class="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you 
                to review this Privacy Policy periodically.
              </p>
            </section>

            <!-- Contact Information -->
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p class="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700">
                  <strong>Email:</strong> privacy@wedchart.me<br>
                  <strong>Subject:</strong> Privacy Policy Inquiry
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