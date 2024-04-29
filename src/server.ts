import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import { createEvent } from './routes/create-event'
import { getEventBySlug } from './routes/get-event-by-slug'
import { registerForEvent } from './routes/register-for-event'
import { getAttendeeById } from './routes/get-attendee-by-id'
import { getAllAttendeesByEventId } from './routes/get-all-attendees-by-eventid'
import { getEventById } from './routes/get-event-by-id'
import { checkIn } from './routes/check-in'
import { errorHandler } from './utils/error-handler'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description: 'API para gerenciamento de eventos',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(getEventBySlug)
app.register(registerForEvent)
app.register(getAttendeeById)
app.register(getAllAttendeesByEventId)
app.register(getEventById)
app.register(checkIn)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
