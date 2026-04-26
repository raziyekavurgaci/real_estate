import { defineStore } from 'pinia'

interface User {
  _id: string
  email: string
  fullName: string
  role: 'AGENCY' | 'AGENT'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    isAgency: (state) => state.user?.role === 'AGENCY',
    isAgent: (state) => state.user?.role === 'AGENT',
  },

  actions: {
    // Uygulama başladığında localStorage'dan geri yükle
    hydrate() {
      if (import.meta.client) {
        const token = localStorage.getItem('access_token')
        const user = localStorage.getItem('auth_user')
        if (token) this.accessToken = token
        if (user) this.user = JSON.parse(user)
      }
    },

    async login(email: string, password: string) {
      const config = useRuntimeConfig()
      const data = await $fetch<{ access_token: string; refresh_token: string; user: User }>(
        '/auth/signin',
        {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: { email, password },
        },
      )
      this._setSession(data)
      return data
    },



    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      if (import.meta.client) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth_user')
      }
      navigateTo('/login')
    },

    _setSession(data: { access_token: string; refresh_token: string; user: User }) {
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      this.user = data.user
      if (import.meta.client) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
      }
    },
  },
})
