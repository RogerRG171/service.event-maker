import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createEvent } from './routes/create-event'
import { getEventBySlug } from './routes/get-event-by-slug'
import { registerForEvent } from './routes/register-for-event'
import { getAttendeeById } from './routes/get-attendee-by-id'
import { getAllAttendeesByEventId } from './routes/get-all-attendees-by-eventid'
import { getEventById } from './routes/get-event-by-id'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(getEventBySlug)
app.register(registerForEvent)
app.register(getAttendeeById)
app.register(getAllAttendeesByEventId)
app.register(getEventById)

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
