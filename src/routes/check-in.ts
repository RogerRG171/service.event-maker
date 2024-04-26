import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../utils/prisma'

const checkIn = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendee/:attendeeId/check-in',
    {
      schema: {
        summary: 'Realiza o check-in',
        description: 'Realiza o check-in de um participante em um evento.',
        tags: ['check-in'],
        params: z.object({
          attendeeId: z.coerce.number().int().positive(),
        }),
        response: {},
      },
    },
    async (req, reply) => {
      try {
        const { attendeeId } = req.params

        const attendee = await prisma.attendee.findUnique({
          where: {
            id: attendeeId,
          },
        })

        if (!attendee) {
          return reply.status(404).send({ error: 'Particpante não existe' })
        }

        const checkIn = await prisma.checkIn.findUnique({
          where: {
            attendeeId,
          },
        })

        if (checkIn) {
          return reply.status(400).send({
            error: 'Participante já realizou check-in ás: ' + checkIn.createdAt,
          })
        }

        const newCheckIn = await prisma.checkIn.create({
          data: {
            attendeeId,
          },
        })

        return reply.status(201).send({
          checkInId: newCheckIn.id,
        })
      } catch (error) {
        return reply.status(400).send({ error: error.message })
      }
    },
  )
}

export { checkIn }
