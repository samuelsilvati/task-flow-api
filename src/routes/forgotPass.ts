import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { hash } from 'bcrypt'
import client from '@sendgrid/mail'

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

    client.setApiKey(`${process.env.SENDGRID_API_KEY}`)
    const message = {
      to: `${userAlreadyExists.email}`,
      from: `${process.env.SENDGRID_FROM_EMAIL}`,
      subject: 'Redefinição de senha do Task Flow naoresponder@taskflow.com',
      text: 'Olá, este é um exemplo de email usando o SendGrid.',
      html: `<html>
              <head>
                <title>Recuperação de Senha</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .button {
                    display: inline-block;
                    background-color: #007bff;
                    color: "#FFFFFF";
                    padding: 10px 20px;
                    text-decoration: none;
                    font-weight: bold;
                    border-radius: 4px;
                  }
                  .button:visited {
                    color: '#FFFFFF'
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>Recuperação de Senha</h2>
                  <p>Olá &nbsp;${userAlreadyExists.name}!</p>
                  <p>Recebemos uma solicitação para redefinição de senha associada à sua conta. Para continuar o processo de recuperação de senha, clique no botão abaixo para redefinir sua senha:</p>
                  <a href="${process.env.CLIENT_BASE_URL}/login/reset-password?token=${token}&id=${id}" class="button">Redefinir Senha</a>
                  <p>Caso você não tenha solicitado a recuperação de senha, ignore este e-mail.</p>
                  <p>Atenciosamente,</p>
                  <p>Equipe de Suporte</p>
                </div>
              </body>
              </html>`,
    }
    client
      .send(message)
      .then(() => console.log('Mail sent successfully'))
      .catch((error) => {
        if (
          error.response &&
          error.response.body &&
          error.response.body.errors
        ) {
          const errors = error.response.body.errors
          console.log(errors)
        } else {
          console.log(error)
        }
      })
    reply.code(200).send({ message: 'Mail sent successfully' })
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
