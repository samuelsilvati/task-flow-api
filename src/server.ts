import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { categoriesRoutes } from './routes/categories'
import { tasksRoutes } from './routes/tasks'

const app = fastify()
app.register(cors, {
  origin: true,
})

app.register(userRoutes)
app.register(authRoutes)
app.register(categoriesRoutes)
app.register(tasksRoutes)

app.register(jwt, {
  secret: `${process.env.JWT_SECRET}`,
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
