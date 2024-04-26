import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../utils/prisma'

const registerForEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/event/:eventId/attendee',
    {
      schema: {
        description: 'Cria um participante',
        summary: 'Cria um participante em um evento',
        tags: ['attendee'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number().int().positive(),
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
        const { name, email } = req.body
        const { eventId } = req.params

        const event = await prisma.event.findUnique({
          where: {
            id: eventId,
          },
          select: {
            attendees: true,
            maximumAttendees: true,
          },
        })

        if (!event) {
          return reply.status(404).send({
            error: 'Evento não encontrado',
          })
        }

        if (
          event?.maximumAttendees &&
          event.attendees.length === event.maximumAttendees
        ) {
          return reply.status(400).send({
            error: 'O evento foi lotado',
          })
        }

        const data = await prisma.attendee.findUnique({
          where: {
            eventId_email: {
              eventId,
              email,
            },
          },
        })

        if (data) {
          return reply.status(400).send({
            error: 'Já existe participante com este email',
          })
        }

        const attendee = await prisma.attendee.create({
          data: {
            name,
            email,
            eventId,
          },
        })

        return reply.status(201).send({
          attendeeId: attendee.id,
        })
      } catch (error) {
        return reply.status(400).send({
          error: 'Falha ao registrar o ingresso',
        })
      }
    },
  )
}

export { registerForEvent }
