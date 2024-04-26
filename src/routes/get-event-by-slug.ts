import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../utils/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

const getEventBySlug = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/event/:slug/slug',
    {
      schema: {
        summary: 'Retorna um evento pelo seu slug',
        description:
          'Retorna um evento pelo seu slug recebido por parâmetro na url',
        tags: ['event'],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          201: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().positive().nullable(),
              slug: z.string(),
            }),
          }),
          404: z.object({
            error: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      try {
        const { slug } = req.params

        const event = await prisma.event.findUnique({
          where: {
            slug,
          },
        })

        if (!event) {
          return reply.status(404).send({ error: 'Evento não encontrado' })
        }

        return reply.status(200).send({
          event,
        })
      } catch (error) {
        return reply.status(400).send({ error: error.message })
      }
    },
  )
}

export { getEventBySlug }
