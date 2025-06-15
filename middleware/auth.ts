export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // If trying to access auth pages while logged in, redirect to home
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/')
  }
  
  // If trying to access protected pages while not logged in, redirect to login
  if (!authStore.isAuthenticated && (to.path === '/account' || to.path === '/')) {
    return navigateTo('/login')
  }
})