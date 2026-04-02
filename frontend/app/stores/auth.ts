import { defineStore } from 'pinia'

export type UserRole = 'admin' | 'user'

export type AuthUser = {
  email: string
  role: UserRole
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  rememberMe: boolean
  initialized: boolean
}

const STORAGE_KEY = 'todo_auth_v1'

function loadFromStorage(): Pick<AuthState, 'token' | 'user' | 'rememberMe'> | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      token: typeof parsed.token === 'string' ? parsed.token : null,
      user:
        parsed.user &&
        typeof parsed.user.email === 'string' &&
        (parsed.user.role === 'admin' || parsed.user.role === 'user')
          ? { email: parsed.user.email, role: parsed.user.role }
          : null,
      rememberMe: Boolean(parsed.rememberMe),
    }
  } catch {
    return null
  }
}

function saveToStorage(state: AuthState) {
  if (!import.meta.client) return
  try {
    if (!state.rememberMe) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: state.token, user: state.user, rememberMe: state.rememberMe }),
    )
  } catch {
    // ignore
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    rememberMe: true,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.token && s.user),
    isAdmin: (s) => s.user?.role === 'admin',
  },
  actions: {
    init() {
      if (this.initialized) return
      const saved = loadFromStorage()
      if (saved) {
        this.token = saved.token
        this.user = saved.user
        this.rememberMe = saved.rememberMe
      }
      this.initialized = true
    },
    setRememberMe(value: boolean) {
      this.rememberMe = value
      saveToStorage(this.$state)
    },
    async login(email: string, password: string) {
      const { $api } = useNuxtApp()
      const resp = await $api('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      const token = (resp as any)?.token
      const user = (resp as any)?.user
      if (typeof token !== 'string' || !user || typeof user.email !== 'string') {
        throw new Error('Invalid login response')
      }
      this.token = token
      this.user = { email: user.email, role: user.role === 'admin' ? 'admin' : 'user' }
      saveToStorage(this.$state)
    },
    logout() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
  },
})

