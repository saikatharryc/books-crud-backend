module.exports = function (fastify, opts, next) {
  fastify.route({
    url: '/genere/create',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string'

          },
          description: {
            type: 'string'
          }
        },
        required: ['name', 'description']
      }
    },
    // preHandler : [fastify.verifySessionId],
    handler: async function (request, reply) {
      fastify.createGenere(request.body.name, request.body.description).then(d => {
        return reply.send(d)
      }).catch(ex => {
        fastify.log.error(ex)
        return reply.status(500).send({
          message: 'unknown error occured'
        })
      })
    }
  })

  next()
}
