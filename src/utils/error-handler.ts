import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

type fastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: fastifyErrorHandler = (error, req, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.format(),
    })
  }

  return reply.status(500).send({ error: 'Internal server error' })
}
