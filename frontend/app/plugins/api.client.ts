import type { FetchContext, FetchResponse } from 'ofetch'
import type { $Fetch } from 'ofetch'

type ApiError = {
  status?: number
  message: string
  data?: unknown
}

function toApiError(ctx: FetchContext & { response?: FetchResponse<unknown> }): ApiError {
  const status = ctx.response?.status
  const data = ctx.response?._data
  const message =
    (typeof (data as any)?.error === 'string' && (data as any).error) ||
    (typeof (data as any)?.message === 'string' && (data as any).message) ||
    ctx.error?.message ||
    'Request failed'
  return { status, message, data }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const ui = useUiStore()

  const api: $Fetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      ui.startRequest()
      const token = auth.token
      if (token) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        }
      }
    },
    onResponse() {
      ui.endRequest()
    },
    async onResponseError(ctx) {
      ui.endRequest()
      const err = toApiError(ctx)
      if (err.status === 401) {
        auth.logout()
        await navigateTo('/login')
        return
      }
      throw createError({ statusCode: err.status || 500, statusMessage: err.message })
    },
  })

  return {
    provide: {
      api,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $api: $Fetch
  }
}

