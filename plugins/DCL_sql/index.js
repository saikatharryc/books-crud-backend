const fp = require('fastify-plugin')
const {db,models} =  require('./connection')
module.exports = fp(function(fastify, opts, next) {
    fastify.decorate('sql', {
        ...{db, models},
    })
next();
});
