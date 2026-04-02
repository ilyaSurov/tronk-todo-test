export default defineNuxtRouteMiddleware((to) => {
  const publicPaths = new Set(['/login'])
  if (publicPaths.has(to.path)) return

  const auth = useAuthStore()
  auth.init()
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})

