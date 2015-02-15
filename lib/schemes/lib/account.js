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
    }

};
