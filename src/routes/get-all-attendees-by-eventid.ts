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
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.coerce.number().default(0),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number().int().positive(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable(),
              }),
            ),
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
        const { pageIndex, query } = req.query

        const attendees = await prisma.attendee.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              },
            },
          },
          where: query
            ? {
                eventId,
                name: {
                  contains: query,
                },
              }
            : {
                eventId,
              },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: 'desc',
          },
        })

        if (!attendees) {
          return reply.status(404).send({
            error: 'O evento não foi encontrado',
          })
        }

        return reply.status(200).send({
          attendees: attendees.map((attendee) => ({
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkInAt: attendee.checkIn?.createdAt || null,
          })),
        })
      } catch (error) {
        return reply.status(400).send({
          error: 'Ocorreu um erro ao buscar os participantes',
        })
      }
    },
  )
}

export { getAllAttendeesByEventId }
