export type Task = {
  id: number
  title: string
  description?: string | null
  dueDate: string // YYYY-MM-DD
  isCompleted: boolean
  createdBy: string
}

export type TasksResponse = { tasks: Task[] }

