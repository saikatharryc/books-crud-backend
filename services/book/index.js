module.exports = function (fastify, opts, next) {
  fastify.route({
    url: '/book/create',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            allOf: [
              { minLength: 1 },
              { maxLength: 50 }
            ]
          },
          summery: {
            type: 'string',
            allOf: [
              { minLength: 1 },
              { maxLength: 500 }
            ]
          },
          author_ids: {
            type: 'array'
          },
          genere_ids: {
            type: 'array'
          }
        },
        required: ['title']
      }
    },
    // preHandler : [fastify.verifySessionId],
    handler: async function (request, reply) {
      const bookData = {
        title: request.body.title,
        summery: request.body.summery
      }
      fastify.createBook(bookData, request.body.genere_ids, request.body.author_ids).then(d => {
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
