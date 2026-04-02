import { defineStore } from 'pinia'
import type { Task, TasksResponse } from '~/types/tasks'

export type SortKey = 'created' | 'dueDate' | 'status'
export type SortDir = 'asc' | 'desc'

export type TasksFilters = {
  status: 'all' | 'active' | 'completed' | 'overdue'
  createdBy: string | 'all'
  dueFrom: string | ''
  dueTo: string | ''
}

type TasksState = {
  items: Task[]
  loading: boolean
  error: string | null
  query: string
  sortKey: SortKey
  sortDir: SortDir
  filters: TasksFilters
  page: number
  pageSize: number
}

function parseDate(d: string) {
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? null : dt
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    items: [],
    loading: false,
    error: null,
    query: '',
    sortKey: 'created',
    sortDir: 'desc',
    filters: { status: 'all', createdBy: 'all', dueFrom: '', dueTo: '' },
    page: 1,
    pageSize: 10,
  }),
  getters: {
    authors(state): string[] {
      const set = new Set<string>()
      for (const t of state.items) set.add(t.createdBy)
      return Array.from(set).sort()
    },
    filtered(state): Task[] {
      const q = state.query.trim().toLowerCase()
      const now = new Date()
      const dueFrom = state.filters.dueFrom ? parseDate(state.filters.dueFrom) : null
      const dueTo = state.filters.dueTo ? parseDate(state.filters.dueTo) : null

      return state.items.filter((t) => {
        if (q) {
          const hay = `${t.title} ${t.description || ''} ${t.createdBy}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        if (state.filters.createdBy !== 'all' && t.createdBy !== state.filters.createdBy) return false

        if (state.filters.status === 'active' && t.isCompleted) return false
        if (state.filters.status === 'completed' && !t.isCompleted) return false
        if (state.filters.status === 'overdue') {
          const d = parseDate(t.dueDate)
          if (!d) return false
          if (t.isCompleted) return false
          if (d >= now) return false
        }

        const due = parseDate(t.dueDate)
        if (dueFrom && (!due || due < dueFrom)) return false
        if (dueTo && (!due || due > dueTo)) return false
        return true
      })
    },
    sorted(): Task[] {
      const items = [...this.filtered]
      const dir = this.sortDir === 'asc' ? 1 : -1
      const key = this.sortKey

      items.sort((a, b) => {
        if (key === 'created') return dir * (a.id - b.id) // approximate by id
        if (key === 'status') return dir * (Number(a.isCompleted) - Number(b.isCompleted))
        // dueDate
        const da = parseDate(a.dueDate)?.getTime() ?? 0
        const db = parseDate(b.dueDate)?.getTime() ?? 0
        return dir * (da - db)
      })
      return items
    },
    totalPages(): number {
      return Math.max(1, Math.ceil(this.sorted.length / this.pageSize))
    },
    paged(): Task[] {
      const p = Math.min(Math.max(1, this.page), this.totalPages)
      const start = (p - 1) * this.pageSize
      return this.sorted.slice(start, start + this.pageSize)
    },
    emptyReason(): 'loading' | 'no-results' | 'empty' | 'error' | null {
      if (this.loading) return 'loading'
      if (this.error) return 'error'
      if (this.items.length === 0) return 'empty'
      if (this.sorted.length === 0) return 'no-results'
      return null
    },
  },
  actions: {
    setQuery(q: string) {
      this.query = q
      this.page = 1
    },
    setSort(key: SortKey) {
      if (this.sortKey === key) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      else {
        this.sortKey = key
        this.sortDir = key === 'created' ? 'desc' : 'asc'
      }
    },
    setFilter<K extends keyof TasksFilters>(key: K, value: TasksFilters[K]) {
      this.filters[key] = value
      this.page = 1
    },
    setPage(p: number) {
      this.page = Math.min(Math.max(1, p), this.totalPages)
    },
    async fetchAll() {
      const { $api } = useNuxtApp()
      this.loading = true
      this.error = null
      try {
        const resp = (await $api('/tasks', { method: 'GET' })) as TasksResponse
        this.items = Array.isArray(resp?.tasks) ? resp.tasks : []
      } catch (e: any) {
        this.error = e?.statusMessage || e?.message || 'Не удалось загрузить задачи'
      } finally {
        this.loading = false
      }
    },
    async createTask(payload: Omit<Task, 'id'>) {
      const { $api } = useNuxtApp()
      const created = (await $api('/tasks', { method: 'POST', body: payload })) as Task
      this.items.push(created)
    },
    async updateTask(id: number, payload: Omit<Task, 'id'>) {
      const { $api } = useNuxtApp()
      const updated = (await $api(`/tasks/${id}`, { method: 'PUT', body: payload })) as Task
      const idx = this.items.findIndex((t) => t.id === id)
      if (idx >= 0) this.items[idx] = updated
    },
    async deleteTask(id: number) {
      const { $api } = useNuxtApp()
      await $api(`/tasks/${id}`, { method: 'DELETE' })
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})

