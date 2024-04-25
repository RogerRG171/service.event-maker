import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../utils/prisma'

const getAttendeeById = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendee/:attendeeId',
    {
      schema: {
        params: z.object({
          attendeeId: z.string(),
        }),
        response: {
          200: z.object({
            attendee: z.object({
              id: z.number().int().positive(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              event: z.object({
                title: z.string(),
              }),
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
        const { attendeeId } = req.params
        const id = Number(attendeeId)

        const attendee = await prisma.attendee.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            event: {
              select: {
                title: true,
              },
            },
          },
        })

        if (!attendee) {
          return reply.status(404).send({
            error: 'Participante não encontrado',
          })
        }

        return reply.status(200).send({
          attendee,
        })
      } catch (error) {
        return reply.status(400).send({
          error: error.message,
        })
      }
    },
  )
}

export { getAttendeeById }
