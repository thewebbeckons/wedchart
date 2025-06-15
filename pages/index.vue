<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
    <!-- Navigation -->
    <nav class="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <!-- Logo -->
          <div class="flex items-center">
            <UIcon name="i-heroicons-heart" class="h-8 w-8 text-pink-500 mr-3" />
            <h1 class="text-2xl font-bold text-gray-900">WedChart</h1>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/login"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </NuxtLink>
            <UButton
              @click="$router.push('/signup')"
              size="sm"
              data-umami-event="get_started_header"
            >
              Get Started
            </UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div class="text-center">
          <!-- Hero Content -->
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
              Plan Your Perfect
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Wedding Seating
              </span>
            </h1>
            
            <p class="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Effortlessly organize your wedding guests and create beautiful table arrangements. 
              Share your seating chart with guests so they can easily find their tables.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <UButton
                @click="$router.push('/signup')"
                size="xl"
                class="px-8 py-4 text-lg"
              >
                Start Planning Free
              </UButton>
              
              <UButton
                @click="scrollToFeatures"
                variant="soft"
                color="gray"
                size="xl"
                class="px-8 py-4 text-lg"
                icon="i-heroicons-play"
              >
                See How It Works
              </UButton>
            </div>

            <!-- Trust Indicators -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
              <div class="flex items-center">
                <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500 mr-2" />
                Free to use
              </div>
              <div class="flex items-center">
                <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div class="flex items-center">
                <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500 mr-2" />
                Setup in minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Animated Decorative Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <!-- Large floating circles -->
        <div class="floating-circle floating-circle-1"></div>
        <div class="floating-circle floating-circle-2"></div>
        <div class="floating-circle floating-circle-3"></div>
        <div class="floating-circle floating-circle-4"></div>
        <div class="floating-circle floating-circle-5"></div>
        <div class="floating-circle floating-circle-6"></div>
        
        <!-- Small accent circles -->
        <div class="accent-circle accent-circle-1"></div>
        <div class="accent-circle accent-circle-2"></div>
        <div class="accent-circle accent-circle-3"></div>
        <div class="accent-circle accent-circle-4"></div>
        <div class="accent-circle accent-circle-5"></div>
        <div class="accent-circle accent-circle-6"></div>
        <div class="accent-circle accent-circle-7"></div>
        <div class="accent-circle accent-circle-8"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Perfect Seating
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            From guest management to sharing your seating chart, WedChart makes wedding planning simple and stress-free.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
            <div class="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-users" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Guest Management</h3>
            <p class="text-gray-600">
              Easily add, edit, and organize your wedding guests. Track RSVPs and manage dietary restrictions all in one place.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div class="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-table-cells" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Table Arrangements</h3>
            <p class="text-gray-600">
              Create and customize tables with capacity limits. Drag and drop guests to arrange perfect seating combinations.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-share" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Share with Guests</h3>
            <p class="text-gray-600">
              Generate a beautiful public link where guests can search for their table assignments. No more confusion on your big day!
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-arrow-up-tray" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">CSV Import</h3>
            <p class="text-gray-600">
              Already have your guest list? Import it instantly with our CSV upload feature. Save time and avoid manual entry.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
            <div class="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-qr-code" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">QR Code Generation</h3>
            <p class="text-gray-600">
              Create QR codes for easy access to your seating chart. Perfect for wedding programs or table displays.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200">
            <div class="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-device-phone-mobile" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Mobile Friendly</h3>
            <p class="text-gray-600">
              Access your seating chart from anywhere. Our responsive design works perfectly on phones, tablets, and computers.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Create Your Perfect Seating Chart?
        </h2>
        <p class="text-xl text-pink-100 mb-8">
          Join thousands of couples who have simplified their wedding planning with WedChart.
        </p>
        <UButton
          @click="$router.push('/signup')"
          size="xl"
          color="white"
          class="px-8 py-4 text-lg text-pink-600 hover:text-pink-700"
        >
          Start Planning Your Wedding
        </UButton>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center mb-4">
              <UIcon name="i-heroicons-heart" class="h-8 w-8 text-pink-500 mr-3" />
              <h3 class="text-2xl font-bold">WedChart</h3>
            </div>
            <p class="text-gray-400 max-w-md">
              The easiest way to plan your wedding seating arrangements. Beautiful, simple, and free to use.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/login" class="text-gray-400 hover:text-white transition-colors">
                  Sign In
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/signup" class="text-gray-400 hover:text-white transition-colors">
                  Get Started
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Support</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400">
            © 2024 WedChart. Made with ❤️ for couples planning their perfect day.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'WedChart - Beautiful Wedding Seating Charts Made Simple',
  meta: [
    { name: 'description', content: 'Plan your perfect wedding seating arrangements with WedChart. Manage guests, create table assignments, and share your seating chart with ease. Free to use!' },
    { name: 'keywords', content: 'wedding seating chart, wedding planning, table arrangements, guest management, wedding organization' },
    { property: 'og:title', content: 'WedChart - Beautiful Wedding Seating Charts Made Simple' },
    { property: 'og:description', content: 'Plan your perfect wedding seating arrangements with WedChart. Manage guests, create table assignments, and share your seating chart with ease.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'WedChart - Beautiful Wedding Seating Charts Made Simple' },
    { name: 'twitter:description', content: 'Plan your perfect wedding seating arrangements with WedChart. Free and easy to use.' }
  ]
})

// Reactive data
const featuresSection = ref<HTMLElement>()

// Methods
const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  })
}
</script>

<style scoped>
/* Floating Circle Animations */
.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(147, 51, 234, 0.1));
  backdrop-filter: blur(1px);
  animation: float 20s ease-in-out infinite;
}

.floating-circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: -5%;
  animation-delay: 0s;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(147, 51, 234, 0.08));
}

.floating-circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: -3%;
  animation-delay: -5s;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
}

.floating-circle-3 {
  width: 120px;
  height: 120px;
  top: 30%;
  right: 15%;
  animation-delay: -10s;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(168, 85, 247, 0.12));
}

.floating-circle-4 {
  width: 180px;
  height: 180px;
  bottom: 20%;
  left: 10%;
  animation-delay: -15s;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.08));
}

.floating-circle-5 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 30%;
  animation-delay: -7s;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
}

.floating-circle-6 {
  width: 140px;
  height: 140px;
  bottom: 40%;
  right: 25%;
  animation-delay: -12s;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.09), rgba(59, 130, 246, 0.09));
}

/* Accent Circles */
.accent-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(147, 51, 234, 0.15));
  animation: pulse-float 15s ease-in-out infinite;
}

.accent-circle-1 {
  width: 40px;
  height: 40px;
  top: 15%;
  left: 20%;
  animation-delay: 0s;
}

.accent-circle-2 {
  width: 30px;
  height: 30px;
  top: 45%;
  left: 5%;
  animation-delay: -3s;
}

.accent-circle-3 {
  width: 35px;
  height: 35px;
  top: 25%;
  right: 8%;
  animation-delay: -6s;
}

.accent-circle-4 {
  width: 25px;
  height: 25px;
  bottom: 30%;
  left: 25%;
  animation-delay: -9s;
}

.accent-circle-5 {
  width: 45px;
  height: 45px;
  bottom: 15%;
  right: 15%;
  animation-delay: -12s;
}

.accent-circle-6 {
  width: 20px;
  height: 20px;
  top: 35%;
  left: 45%;
  animation-delay: -2s;
}

.accent-circle-7 {
  width: 38px;
  height: 38px;
  top: 55%;
  right: 35%;
  animation-delay: -8s;
}

.accent-circle-8 {
  width: 28px;
  height: 28px;
  bottom: 45%;
  left: 60%;
  animation-delay: -5s;
}

/* Animation Keyframes */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px) rotate(90deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) translateX(-15px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-30px) translateX(5px) rotate(270deg);
    opacity: 0.6;
  }
}

@keyframes pulse-float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translateY(-15px) scale(1.1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8px) scale(0.9);
    opacity: 0.3;
  }
  75% {
    transform: translateY(-20px) scale(1.05);
    opacity: 0.7;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-circle {
    animation-duration: 25s;
  }
  
  .floating-circle-1 {
    width: 120px;
    height: 120px;
  }
  
  .floating-circle-2 {
    width: 100px;
    height: 100px;
  }
  
  .floating-circle-3 {
    width: 80px;
    height: 80px;
  }
  
  .floating-circle-4 {
    width: 110px;
    height: 110px;
  }
  
  .floating-circle-5 {
    width: 70px;
    height: 70px;
  }
  
  .floating-circle-6 {
    width: 90px;
    height: 90px;
  }
}
</style>