'use strict'

module.exports = function (fastify, opts, next) {
  fastify.get('/', function (request, reply) {
    fastify.sql.models.Book.findOne({ where: { id: 2 }, include: [{ model: fastify.sql.models.bookAuthor, include: [fastify.sql.models.Author] }, { model: fastify.sql.models.bookGenere, include: [fastify.sql.models.Genere] }] })
      .then((d) => {
        reply.send(d)
      })
      .catch((err) => reply.send({ success: false, errors: { globals: err } }))
  })

  next()
}
