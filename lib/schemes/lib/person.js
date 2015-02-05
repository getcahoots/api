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
                            required: ['id', 'src'],
                            properties: {
                                id: {
                                    type: 'string'
                                    // TODO: Add pattern
                                },
                                src: {
                                    type: 'string',
                                    format: 'uri'
                                }
                            }
                        }
                    ]
                }
            }
        }
    }

};
