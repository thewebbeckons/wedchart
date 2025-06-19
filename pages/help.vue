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

          <!-- Navigation -->
          <div class="flex items-center space-x-4">
            <UButton
              @click="$router.back()"
              variant="soft"
              color="gray"
              icon="i-heroicons-arrow-left"
            >
              Back
            </UButton>
            <UButton
              @click="$router.push('/dashboard')"
              variant="soft"
              color="pink"
              icon="i-heroicons-squares-2x2"
            >
              Dashboard
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
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <UIcon name="i-heroicons-question-mark-circle" class="h-8 w-8 text-blue-600" />
            </div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p class="text-lg text-gray-600">
              Everything you need to know about using WedChart for your wedding seating arrangements
            </p>
          </div>

          <!-- Quick Start Guide -->
          <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 mb-12 border border-pink-200">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <UIcon name="i-heroicons-rocket-launch" class="h-8 w-8 text-pink-600 mt-1" />
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-semibold text-gray-900 mb-3">Quick Start Guide</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-white rounded-lg p-4 border border-pink-100">
                    <div class="text-pink-600 font-semibold text-sm mb-2">STEP 1</div>
                    <h3 class="font-medium text-gray-900 mb-1">Add Your Guests</h3>
                    <p class="text-sm text-gray-600">Start by adding your wedding guests with their names and RSVP status.</p>
                  </div>
                  <div class="bg-white rounded-lg p-4 border border-pink-100">
                    <div class="text-pink-600 font-semibold text-sm mb-2">STEP 2</div>
                    <h3 class="font-medium text-gray-900 mb-1">Create Tables</h3>
                    <p class="text-sm text-gray-600">Set up your reception tables with names and capacity limits.</p>
                  </div>
                  <div class="bg-white rounded-lg p-4 border border-pink-100">
                    <div class="text-pink-600 font-semibold text-sm mb-2">STEP 3</div>
                    <h3 class="font-medium text-gray-900 mb-1">Assign & Share</h3>
                    <p class="text-sm text-gray-600">Drag guests to tables and share your seating chart with everyone.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Sections -->
          <div class="space-y-8">
            <!-- Getting Started -->
            <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <UIcon name="i-heroicons-play" class="h-6 w-6 text-green-600 mr-3" />
                Getting Started
              </h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">How do I create my first guest list?</h3>
                  <p class="text-gray-700 mb-3">
                    After signing up, go to your dashboard and click "Add Guest". Enter the guest's name, select their RSVP status, 
                    and add any dietary restrictions. You can also import multiple guests at once using our CSV import feature.
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Can I import my existing guest list?</h3>
                  <p class="text-gray-700 mb-3">
                    Yes! Click "Import CSV" on your dashboard. Download our template to see the required format: 
                    just two columns with "Guest Name" and "Table Name". We'll automatically create tables that don't exist yet.
                  </p>
                </div>

                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">How do I add plus-ones?</h3>
                  <p class="text-gray-700 mb-3">
                    When adding a guest, check the "This guest has a plus one" option and enter the plus-one's name. 
                    Plus-ones will automatically be assigned to the same table as their primary guest.
                  </p>
                </div>
              </div>
            </section>

            <!-- Managing Tables -->
            <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <UIcon name="i-heroicons-table-cells" class="h-6 w-6 text-blue-600 mr-3" />
                Managing Tables
              </h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">How do I create and organize tables?</h3>
                  <p class="text-gray-700 mb-3">
                    Click "Add Table" to create a new table. Give it a descriptive name (like "Head Table" or "Family Table 1") 
                    and set the capacity. You can also add a location description to help with venue setup.
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">How do I assign guests to tables?</h3>
                  <p class="text-gray-700 mb-3">
                    Use the Table Planner page for easy drag-and-drop assignment. Simply drag guests from the "Unassigned" 
                    list to any table. You can also assign tables when adding or editing individual guests.
                  </p>
                </div>

                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">What happens if I exceed a table's capacity?</h3>
                  <p class="text-gray-700 mb-3">
                    WedChart will warn you when a table reaches capacity and prevent you from adding more guests. 
                    The table will show a red indicator when full. You can adjust the capacity or move guests to other tables.
                  </p>
                </div>
              </div>
            </section>

            <!-- Sharing Your Seating Chart -->
            <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <UIcon name="i-heroicons-share" class="h-6 w-6 text-purple-600 mr-3" />
                Sharing Your Seating Chart
              </h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">How do I share my seating chart with guests?</h3>
                  <p class="text-gray-700 mb-3">
                    Click "Share List" on your dashboard to generate a public link. Only confirmed guests with table assignments 
                    will be included. Share this link via email, wedding website, or social media so guests can find their tables.
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Can I create a QR code for my seating chart?</h3>
                  <p class="text-gray-700 mb-3">
                    Yes! After generating your public guest list, click "Generate QR Code" to create a downloadable QR code. 
                    This is perfect for wedding programs, table displays, or signage at your venue.
                  </p>
                </div>

                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">How do guests find their table assignment?</h3>
                  <p class="text-gray-700 mb-3">
                    Guests visit your shared link and simply type their name in the search box. The system will instantly 
                    show their table assignment. The search works with first names, last names, or full names.
                  </p>
                </div>
              </div>
            </section>

            <!-- Account & Data Management -->
            <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <UIcon name="i-heroicons-cog-6-tooth" class="h-6 w-6 text-orange-600 mr-3" />
                Account & Data Management
              </h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">How do I export my guest list data?</h3>
                  <p class="text-gray-700 mb-3">
                    Go to Account Settings → Privacy tab and click "Download Guest List CSV". This exports all your guest 
                    information including names, table assignments, RSVP status, and dietary restrictions.
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Can I update my wedding information after signing up?</h3>
                  <p class="text-gray-700 mb-3">
                    Absolutely! Visit Account Settings → Profile tab to update your wedding name, date, and personal information. 
                    Changes will automatically update your shared guest list.
                  </p>
                </div>
              </div>
            </section>

            <!-- Troubleshooting -->
            <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <UIcon name="i-heroicons-wrench-screwdriver" class="h-6 w-6 text-red-600 mr-3" />
                Troubleshooting
              </h2>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">My CSV import isn't working. What's wrong?</h3>
                  <p class="text-gray-700 mb-3">
                    Make sure your CSV has exactly two columns: "Guest Name" and "Table Name". Download our template for the 
                    correct format. Also check that guest names don't contain special characters and aren't duplicates.
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Guests can't find their names in the shared list. Why?</h3>
                  <p class="text-gray-700 mb-3">
                    Only guests marked as "Confirmed" with table assignments appear in the shared list. Check that the guest's 
                    status is set to "Confirmed" and they're assigned to a table. You may need to regenerate the shared list.
                  </p>
                </div>

                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">I accidentally deleted a guest/table. Can I recover it?</h3>
                  <p class="text-gray-700 mb-3">
                    Unfortunately, deletions are permanent and cannot be undone. We recommend regularly exporting your guest 
                    list as a backup. If you have a recent export, you can re-import the data using our CSV import feature.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <!-- Contact Support -->
          <div class="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div class="text-center">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Still Need Help?</h2>
              <p class="text-gray-700 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? We're here to help make your wedding planning as smooth as possible.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@wedchart.me?subject=Help Request"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <UIcon name="i-heroicons-envelope" class="h-5 w-5 mr-2" />
                  Email Support
                </a>
                <a
                  href="https://coff.ee/667z79qdqdp"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <UIcon name="i-simple-icons-buymeacoffee" class="h-5 w-5 mr-2 text-yellow-500" />
                  Buy Us a Coffee
                </a>
              </div>
            </div>
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
  title: 'Help Center - WedChart',
  meta: [
    { name: 'description', content: 'Get help with WedChart - Learn how to create wedding seating charts, manage guests, and share your arrangements' },
    { name: 'keywords', content: 'wedding seating chart help, guest list management, table planning guide, WedChart tutorial' }
  ]
})
</script>