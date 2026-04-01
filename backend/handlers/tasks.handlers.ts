import { rest } from 'msw'
import { tasks, Task } from '../data/tasks.data'
import { getUserFromAuthHeader } from '../utils/auth'

let lastId = tasks.length

export const taskHandlers = [
  rest.get('/api/tasks', (req, res, ctx) => {
    const user = getUserFromAuthHeader(req.headers.get('authorization'))
    if (!user) return res(ctx.status(401))

    return res(ctx.delay(300), ctx.json({ data: tasks }))
  }),

  rest.post('/api/tasks', async (req, res, ctx) => {
    const user = getUserFromAuthHeader(req.headers.get('authorization'))
    if (!user) return res(ctx.status(401))

    const body = await req.json()
    const task: Task = {
      Id: ++lastId,
      Title: body.Title,
      Description: body.Description || '',
      DueDate: body.DueDate,
      IsCompleted: false,
      OwnerId: user.id,
    }

    tasks.push(task)
    return res(ctx.status(201), ctx.json(task))
  }),
]
