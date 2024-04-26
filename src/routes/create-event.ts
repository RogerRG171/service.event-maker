import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { generateSlug } from '../utils/slugFormat'
import { FastifyInstance } from 'fastify'
import { prisma } from '../utils/prisma'

const createEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/event',
    {
      schema: {
        description: 'Cria um evento',
        summary: 'Cria um evento',
        tags: ['event'],
        body: z.object({
          title: z.string().min(4),
          details: z.string().optional(),
          maximumAttendees: z.number().int().positive().optional(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      try {
        const { title, details, maximumAttendees } = req.body

        const slug = generateSlug(title)

        const eventWithSlug = await prisma.event.findUnique({
          where: {
            slug,
          },
        })

        if (eventWithSlug) {
          return reply
            .status(400)
            .send({ error: 'Outro evento com mesmo Slug já existe' })
        }

        const event = await prisma.event.create({
          data: {
            title,
            details,
            slug,
            maximumAttendees,
          },
        })
        return reply.status(201).send({ eventId: event.id })
      } catch (error) {
        return reply.status(400).send({ error: error.message })
      }
    },
  )
}

export { createEvent }
