import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { hash } from 'bcrypt'

interface CreateUserRequest {
  name: string
  email: string
  password: string
}

export async function userRoutes(app: FastifyInstance) {
  app.get('/users', async (request, reply) => {
    await request.jwtVerify()
    const users = await prisma.user.findMany({
      include: {
        task: true,
      },
    })
    return reply.code(200).send(users)
  })

  app.get('/user/:id', async (request, reply) => {
    const { id } = request.params as CreateUserRequest
    // const idNumber = Number(id)
    await request.jwtVerify()
    console.log(id)
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    reply.code(200).send(user)
    return user
  })

  app.post('/signup', async (request, reply) => {
    const { name, email, password } = request.body as CreateUserRequest

    const passwordHash = await hash(password, 8)

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    })
    if (userAlreadyExists) {
      return reply.code(409).send({ message: 'Usuário já cadastrado' })
    }

    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
        },
      })

      reply.code(201).send(newUser)
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao cadastrar usuário' })
    }
  })
  app.put('/edit-user', async (request, reply) => {
    await request.jwtVerify()
    const { name, email, password } = request.body as CreateUserRequest

    const passwordHash = await hash(password, 8)

    try {
      const id = request.user.sub
      const editUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          password: passwordHash,
        },
      })

      reply.code(200).send(editUser)
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao editar dados' })
    }
  })

  app.delete('/delete', async (request, reply) => {
    await request.jwtVerify()
    try {
      const id = request.user.sub
      await prisma.user.delete({
        where: {
          id,
        },
      })

      reply.code(200).send()
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao apagar cadastro' })
    }
  })
}
