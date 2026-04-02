import { defineStore } from 'pinia'

type UiState = {
  pendingRequests: number
  lastError: string | null
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    pendingRequests: 0,
    lastError: null,
  }),
  getters: {
    isLoading: (s) => s.pendingRequests > 0,
  },
  actions: {
    startRequest() {
      this.pendingRequests++
    },
    endRequest() {
      this.pendingRequests = Math.max(0, this.pendingRequests - 1)
    },
    setError(message: string | null) {
      this.lastError = message
    },
  },
})

