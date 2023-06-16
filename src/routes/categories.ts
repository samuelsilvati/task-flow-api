import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

interface CreateCategoriesRequest {
  name: string
  id: number
}

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/categories', async (request, reply) => {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return reply.code(200).send(categories)
  })

  app.post('/new-category', async (request, reply) => {
    const { name } = request.body as CreateCategoriesRequest

    const categoryName = await prisma.category.findFirst({
      where: {
        name,
      },
    })
    if (categoryName) {
      reply.code(409).send({ message: 'Categoria já existe' })
      return
    }

    try {
      const newCategory = await prisma.category.create({
        data: {
          name,
        },
      })

      reply.code(201).send(newCategory)
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao criar categoria' })
    }
  })

  app.put('/category/:id', async (request, reply) => {
    const { name } = request.body as CreateCategoriesRequest
    const { id } = request.params as CreateCategoriesRequest
    const idNumber = Number(id)
    if (!id) return

    const categoryName = await prisma.category.findFirst({
      where: {
        name,
      },
    })
    if (categoryName) {
      reply.code(409).send({ message: 'Categoria já existe' })
      return
    }

    try {
      const editCategory = await prisma.category.update({
        where: {
          id: idNumber,
        },
        data: {
          name,
        },
      })
      reply.code(200).send(editCategory)
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao editar categoria' })
    }
  })

  app.delete('/category/:id', async (request, reply) => {
    const { id } = request.params as CreateCategoriesRequest
    const idNumber = Number(id)
    try {
      await prisma.category.delete({
        where: {
          id: idNumber,
        },
      })

      reply.code(200).send()
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao apagar categoria' })
    }
  })
}
