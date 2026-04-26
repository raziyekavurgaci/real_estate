// Korumalı sayfalar için route guard
// Sadece client-side'da çalışır (localStorage erişimi için)
export default defineNuxtRouteMiddleware((to) => {
  // Auth sayfaları bu middleware'den muaf
  const publicRoutes = ['/login']
  if (publicRoutes.includes(to.path)) return

  // Sadece client tarafında kontrol et
  if (import.meta.client) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return navigateTo('/login')
    }
  }
})
