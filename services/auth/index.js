const moment = require('moment')
const crypto = require('crypto')
module.exports = async function (fastify, opts, next) {
    fastify.route({
        url: '/login',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    'username': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 50 }
                        ]
                    },
                    'password': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 20 }
                        ]
                    }
                },
                required:['username','password']
            }
        },
        handler: async function (request, reply) {
            try {
                let doc = await fastify.sql.models.Users.findOne({ $or: [{ email: request.body.username }, { username: request.body.username }] })
                let loggedIn = false
                //console.log(doc,request.body)
                if (doc) { // check if the account exists

                    let compareRes = await fastify.comparePasswordHash(request.body.password, doc.password)
                    if (compareRes == true) { loggedIn = true }
                }

                if (loggedIn == true) {


                    let fakeip = (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0);
                    let ref = crypto.randomBytes(2).toString('hex')
                    let sessionId = await fastify.setSessionId({ userid: doc.email,  ipAddress: request.ip,  ref : ref})

                    reply.status(200).send({
                        statusCode: 200,
                        message: "New session created",
                        errorCode: 'NULL',
                        data: {
                            username: doc.username,
                            email: doc.email,
                            sessionId: sessionId,
                            ref : ref
                        }
                    })

                } else {

                    reply.status(403).send({
                        statusCode: 403,
                        message: "Incorrect account credentials",
                        errorCode: 'INVALID_CREDENTAILS',
                    })

                }

            } catch (e) {
                console.log(e)
                reply.status(500).send('Internal Server Error - Cannot process the request')
            }


        }
    }),
    fastify.route({
        url: '/register',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    'username': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 15 }
                        ]
                    },
                    'email': {
                        type: 'string',
                        format: 'email'
                    },
                    'password': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 20 }
                        ]
                    }
                },
                required: ['username', 'password', 'email']
            }
        },
        handler: async function (request, reply) {

            try {
                let doc = await fastify.sql.models.Users.findOne({ $or: [{ email: request.body.email }, { username: request.body.username }] });
                console.log(doc)
                if (doc) { // check uf the account exists
                    reply.status(400).send({
                        statusCode: 400,
                        message: "Account already exist",
                        errorCode: 'DUPLICATE_ACCOUNT'
                    })
                } else { //create new account
                    // hash the password
                    let passwordHash = await fastify.generatePasswordHash(request.body.password)
                    // persist user account to db
                    await fastify.sql.models.Users.create({
                        username: request.body.username,
                        email: request.body.email,
                        password: passwordHash
                    })
                    // send success response
                    reply.status(200).send({
                        statusCode: 200,
                        message: "New user account created",
                        errorCode: 'NULL',
                        data: {
                            username: request.body.username,
                            email: request.body.email
                        }
                    })
                }
            } catch (e) {
                reply.status(500).send('Internal Server Error - Cannot process the request')
            }


        }
    })

    fastify.route({
        url: '/logut',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                'properties': {
                    'ref': {
                        type: 'string'
                    },
                    'invalidateAll': {
                        type: 'boolean'
                    },
                    'self': {
                        type: 'boolean'
                    },
                },
                required: []
            }
        },
        preHandler: [fastify.verifySessionId],
        handler: async function (request, reply) {

            request.body['sessionId'] = request['session'].sessionId


            try {

                // logout from specific session
                if (request.body.ref != undefined) {
                    //console.log('Target Invalidation')
                    let sl = await fastify.sessionList(request['session'].userid)
                    let fres = find(sl, function (o) {
                        return o.sessiondata.ref == request.body.ref
                    })
                    if (!fres) {
                        throw ''
                    } else {
                        await fastify.removeSessionId(fres.sessionid)
                    }
                }


                // logout from all devices
                if (request.body.invalidateAll == true) {
                    let sl = await fastify.sessionList(request['session'].userid)
                    for (let i = 0; i < sl.length; i++) {
                        await fastify.removeSessionId(sl[i].sessionid)
                        //console.log('sessionId invalidate', sl[i].sessionid)
                    }
                }

                // logout from current session
                if (request.body.self == true) {
                    await fastify.removeSessionId(request.body.sessionId)
                }

                reply.status(200).send({
                    statusCode: 200,
                    message: "Session invalidated",
                    errorCode: 'NULL'
                })

            } catch (e) {
                reply.status(403).send({
                    statusCode: 403,
                    message: "Unable to logout",
                    errorCode: 'LOGOUT_FAILED'
                })
            }

        }
    })


    next()
}