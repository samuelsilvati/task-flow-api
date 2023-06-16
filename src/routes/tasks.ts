import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

interface CreateTaskRequest {
  name: string
  description: string
  createdAt: string
  updatedAt: string
  isPending: boolean
  categoryId: number
}

export async function tasksRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/tasks', async (request, reply) => {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
    reply.code(200).send(tasks)
    return tasks
  })

  app.post('/new-task', async (request, reply) => {
    const { name, description, createdAt, updatedAt, isPending, categoryId } =
      request.body as CreateTaskRequest

    try {
      const newCategory = await prisma.task.create({
        data: {
          name,
          description,
          createdAt,
          updatedAt,
          isPending,
          categoryId,
          userId: request.user.sub,
        },
      })

      reply.code(201).send(newCategory)
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao criar tarefa' })
    }
  })
}
