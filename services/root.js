"use strict";

module.exports = function(fastify, opts, next) {
  fastify.get("/", function(request, reply) {
    fastify.sql.models.bookAuthor
      .findAll()
      .then(d => {
        reply.send(d);
      })
      .catch(err => reply.send({ success: false, errors: { globals: err } }));
  });

  next();
};
