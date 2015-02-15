/*
 * cahoots-api-schemes
 *
 * Copyright Cahoots.pw
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

module.exports = {

    credentials: {
        type: 'object',
        additionalProperties: false,
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email'
            },
            password: {
                type: 'string'
            }
        }
    },

    insert: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'email', 'password'],
        properties: {
            name: {
                type: 'object',
                additionalProperties: false,
                required: ['first', 'last'],
                properties: {
                    first: {
                        type: 'string'
                    },
                    last: {
                        type: 'string'
                    }
                }
            },
            email: {
                type: 'string',
                format: 'email'
            },
            password: {
                type: 'string'
            }
        }
    }

};
