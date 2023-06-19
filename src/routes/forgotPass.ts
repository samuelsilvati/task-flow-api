import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { hash } from 'bcrypt'

interface AuthUserRequest {
  email: string
  id: string
  token: string
  password: string
}

interface FastifyJWT {
  exp: number
}

export async function forgotPassRoutes(app: FastifyInstance) {
  app.post('/forgot-password', async (request, reply) => {
    const { email } = request.body as AuthUserRequest

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!userAlreadyExists) {
      reply.code(409).send({ message: 'O Usuário não existe' })
      return
    }

    const id = userAlreadyExists.id
    const token = app.jwt.sign(
      {
        name: 'Reset Token',
      },
      {
        expiresIn: '600000',
      },
    )
    reply
      .code(200)
      .send(
        `${process.env.CLIENT_BASE_URL}/reset-password?token=${token}&id=${id}`,
      )
  })

  app.post('/reset-password', async (request, reply) => {
    const { id, token } = request.body as AuthUserRequest
    const expires = app.jwt.decode(token) as FastifyJWT
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime > expires.exp) {
      reply
        .code(401)
        .send({ message: 'O token para redefinir a senha expirou' })
      return
    }

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        id,
      },
    })
    if (userAlreadyExists) {
      const { password } = request.body as AuthUserRequest
      const passwordHash = await hash(password, 8)
      const editUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: passwordHash,
        },
      })
      reply.code(200).send(editUser)
    }
  })
}
