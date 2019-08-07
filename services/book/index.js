module.exports = function(fastify, opts, next) {
  fastify.route({
    url: "/book/create",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          title: {
            type: "string",
            allOf: [{ minLength: 1 }, { maxLength: 50 }]
          },
          summery: {
            type: "string",
            allOf: [{ minLength: 1 }, { maxLength: 500 }]
          },
          author_ids: {
            type: "array"
          },
          genere_ids: {
            type: "array"
          }
        },
        required: ["title"]
      }
    },
    preHandler: [fastify.verifySessionId],
    handler: async function(request, reply) {
      const bookData = {
        title: request.body.title,
        summery: request.body.summery
      };
      fastify
        .createBook(bookData, request.body.genere_ids, request.body.author_ids)
        .then(d => {
          return reply.send(d);
        })
        .catch(ex => {
          fastify.log.error(ex);
          return reply.status(500).send({
            message: "unknown error occured"
          });
        });
    }
  });

  fastify.route({
    url: "/book/list",
    method: "GET",
    schema: {
      querystring: {
        type: "object",
        properties: {
          id: {
            type: "number"
          }
        }
      }
    },
    preHandler: [fastify.verifySessionId],
    handler: async (request, reply) => {
      fastify
        .listBooks(request.query.id)
        .then(d => {
          return reply.send(d);
        })
        .catch(ex => {
          fastify.log.error(ex);
          return reply.status(500).send({
            message: "unknown error occured"
          });
        });
    }
  });
  fastify.route({
    url: "/book/edit",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          book_id: {
            type: "number"
          },
          title: {
            type: "string"
          },
          summary: {
            type: "string"
          }
        },
        required: ["book_id", "title"]
      }
    },
    preHandler: [fastify.verifySessionId],
    handler: async (request, reply) => {
      const updatedData = {
        title: request.query.title
      };
      if (request.query.summary) {
        updatedData["summary"] = request.query.summary;
      }
      fastify
        .editBook(updatedData, request.query.book_id)
        .then(d => {
          return reply.send(d);
        })
        .catch(ex => {
          fastify.log.error(ex);
          return reply.status(500).send({
            message: "unknown error occured"
          });
        });
    }
  });

  fastify.route({
    url: "/book/add/author",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          author_ids: {
            type: "array"
          },
          book_id: {
            type: "number"
          }
        },
        required: ["author_ids", "book_id"]
      }
    },
    preHandler: [fastify.verifySessionId],
    handler: async (request, reply) => {
      fastify
        .addAuthorToBook(request.query.author_ids, request.query.book_id)
        .then(d => {
          return reply.send(d);
        })
        .catch(ex => {
          fastify.log.error(ex);
          return reply.status(500).send({
            message: "unknown error occured"
          });
        });
    }
  });

  fastify.route({
    url: "/book/add/genere",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          genere_ids: {
            type: "array"
          },
          book_id: {
            type: "number"
          }
        },
        required: ["genere_ids", "book_id"]
      }
    },
    preHandler: [fastify.verifySessionId],
    handler: async (request, reply) => {
      fastify
        .addGenereToBook(request.query.genere_ids, request.query.book_id)
        .then(d => {
          return reply.send(d);
        })
        .catch(ex => {
          fastify.log.error(ex);
          return reply.status(500).send({
            message: "unknown error occured"
          });
        });
    }
  });

  fastify.route({
    url: "/book/remove/genere",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          genere_id: {
            type: "number"
          },
          book_id: {
            type: "number"
          }
        },
        required: ["genere_id", "book_id"]
      }
    },
    preHandler: [fastify.verifySessionId],
    handler: async (request, reply) => {
      fastify
        .removeGenereFromBook(request.query.genere_id, request.query.book_id)
        .then(rowDeleted => {
          if (rowDeleted === 1) {
            return reply.send({
              message: "Genere removed from the book!"
            });
          } else {
            return reply.status(400).send({
              message: "Unable to remove."
            });
          }
        })
        .catch(ex => {
          fastify.log.error(ex);
          return reply.status(500).send({
            message: "unknown error occured"
          });
        });
    }
  });
  fastify.route({
    url: "/book/remove/author",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          author_id: {
            type: "number"
          },
          book_id: {
            type: "number"
          }
        },
        required: ["author_id", "book_id"]
      }
    },
    preHandler: [fastify.verifySessionId],
    handler: async (request, reply) => {
      fastify
        .removeAuthorFromBook(request.query.author_id, request.query.book_id)
        .then(rowDeleted => {
          if (rowDeleted === 1) {
            return reply.send({
              message: "Author removed from the book!"
            });
          } else {
            return reply.status(400).send({
              message: "Unable to remove."
            });
          }
        })
        .catch(ex => {
          fastify.log.error(ex);
          return reply.status(500).send({
            message: "unknown error occured"
          });
        });
    }
  });
  next();
};
