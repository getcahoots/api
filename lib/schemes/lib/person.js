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

    insert: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'info', 'cahoots'],
        properties: {
            name: {
                type: 'string'
            },
            info: {
                type: 'string',
                format: 'uri'
            },
            cahoots: {
                type: 'array',
                items: {
                    oneOf: [
                        {
                            type: 'object',
                            additionalProperties: false,
                            required: ['organization', 'source'],
                            properties: {
                                organization: {
                                    type: 'string'
                                    // TODO: Add pattern
                                },
                                source: {
                                    type: 'string',
                                    format: 'uri'
                                },
                                role: {
                                    type: 'string'
                                }
                            }
                        }
                    ]
                }
            }
        }
    }

};
