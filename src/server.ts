import fastify from 'fastify'

const app = fastify()

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
