import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../utils/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

const getEventById = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/event/:eventId',
    {
      schema: {
        summary: 'Retorna um evento pelo seu id',
        description:
          'Retorna um evento pelo seu id recebido por parâmetro na url',
        tags: ['event'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().positive().nullable(),
              slug: z.string(),
              attendeesAmount: z.number().int().positive(),
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
        const { eventId } = req.params

        const event = await prisma.event.findUnique({
          select: {
            id: true,
            title: true,
            details: true,
            slug: true,
            maximumAttendees: true,
            _count: {
              select: {
                attendees: true,
              },
            },
          },
          where: {
            id: eventId,
          },
        })

        if (!event) {
          return reply.status(404).send({ error: 'Evento não encontrado' })
        }

        return reply.status(200).send({
          event: {
            id: event.id,
            title: event.title,
            details: event.details,
            maximumAttendees: event.maximumAttendees,
            slug: event.slug,
            attendeesAmount: event._count.attendees,
          },
        })
      } catch (error) {
        return reply.status(400).send({ error: error.message })
      }
    },
  )
}

export { getEventById }
