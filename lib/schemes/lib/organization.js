/*
 * cahoots-backend-schemes
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

    insert: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'info'],
        properties: {
            name: {
                type: 'string'
            },
            info: {
                type: 'string',
                format: 'uri'
            }
        }
    }

};
