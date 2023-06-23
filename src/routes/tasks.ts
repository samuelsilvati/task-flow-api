import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

interface CreateTaskRequest {
  name: string
  description: string
  createdAt: string
  updatedAt: string
  isChecked: boolean
  categoryId: number
  id: string
}

export async function tasksRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/tasks', async (request, reply) => {
    const tasks = await prisma.task.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    reply.code(200).send(tasks)
    return tasks
  })

  app.get('/task/:id', async (request, reply) => {
    const { id } = request.params as CreateTaskRequest
    const idNumber = Number(id)
    console.log(id)
    const tasks = await prisma.task.findUniqueOrThrow({
      where: {
        id: idNumber,
      },
    })
    reply.code(200).send(tasks)
    return tasks
  })

  app.post('/new-task', async (request, reply) => {
    const { name, description, createdAt, updatedAt, isChecked, categoryId } =
      request.body as CreateTaskRequest

    try {
      const newCategory = await prisma.task.create({
        data: {
          name,
          description,
          createdAt,
          updatedAt,
          isChecked,
          categoryId,
          userId: request.user.sub,
        },
      })

      reply.code(201).send(newCategory)
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao criar tarefa' })
    }
  })

  app.put('/task/:id', async (request, reply) => {
    const { name, description, createdAt, updatedAt, isChecked, categoryId } =
      request.body as CreateTaskRequest
    const { id } = request.params as CreateTaskRequest
    console.log(id)
    const idNumber = Number(id)

    try {
      const newCategory = await prisma.task.update({
        where: {
          id: idNumber,
        },
        data: {
          name,
          description,
          createdAt,
          updatedAt,
          isChecked,
          categoryId,
          userId: request.user.sub,
        },
      })

      reply.code(200).send(newCategory)
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao editar tarefa' })
    }
  })

  app.delete('/task/:id', async (request, reply) => {
    const { id } = request.params as CreateTaskRequest
    const idNumber = Number(id)

    try {
      await prisma.task.delete({
        where: {
          id: idNumber,
        },
      })

      reply.code(200).send()
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao deletar tarefa' })
    }
  })
}
