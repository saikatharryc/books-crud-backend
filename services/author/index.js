module.exports = function (fastify, opts, next) {
    
    fastify.route({
        url: '/author/create',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    'name': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 50 }
                        ]
                    },
                    'age': {
                        type: 'number'
                    },
                },
                required:['name','age']
            }
        },
        // preHandler : [fastify.verifySessionId],
        handler: async function (request, reply) {     
            fastify.createAuthor(request.body.name,request.body.age).then(d=>{
                return reply.send(d);
            }).catch(ex=>{
                fastify.log.error(ex);
                return reply.status(500).send({
                 message:"unknown error occured"   
                })
            })
        },
    }),
    fastify.route({
        url: '/author/list',
        method: 'GET',
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    
                },
                required:['name','age']
            }
        },
        // preHandler : [fastify.verifySessionId],
        handler: async function (request, reply) {     

        }
    })

next()
}