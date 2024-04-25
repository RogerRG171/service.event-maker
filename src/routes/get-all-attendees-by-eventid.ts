import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../utils/prisma'

const getAllAttendeesByEventId = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/event/:eventId/attendees',
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number().int().positive(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                eventId: z.string().uuid(),
              }),
            ),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      try {
        const { eventId } = req.params

        const event = await prisma.event.findUnique({
          where: {
            id: eventId,
          },
          select: {
            details: false,
            maximumAttendees: false,
            title: false,
            slug: false,
            id: false,
            attendees: true,
          },
        })

        if (!event) {
          return reply.status(404).send({
            error: 'O evento não foi encontrado',
          })
        }

        return reply.status(200).send({ attendees: event.attendees })
      } catch (error) {
        return reply.status(400).send({
          error: 'Ocorreu um erro ao buscar os participantes',
        })
      }
    },
  )
}

export { getAllAttendeesByEventId }
