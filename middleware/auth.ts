export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Allow public access to the landing page
  if (to.path === '/') {
    return
  }
  
  // If trying to access auth pages while logged in, redirect to dashboard
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/dashboard')
  }
  
  // If trying to access protected pages while not logged in, redirect to login
  if (!authStore.isAuthenticated && (to.path === '/account' || to.path === '/dashboard')) {
    return navigateTo('/login')
  }
})