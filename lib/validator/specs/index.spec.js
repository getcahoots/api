/*
 * cahoots-backend-validator
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

var expect = require('expect.js');

var validator = require('../');

describe('The Validator', function suite () {

    it('should be able to identify that a data structure is valid', function test (done) {
        var schema = validator({
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            }
        });

        var data = {
            name: 'André König'
        };

        var result = schema.check(data);

        expect(result.valid).to.be(true);

        done();
    });

    it('should be ablte to identify an invalid data structure', function test (done) {
        var schema = validator({
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            }
        });

        var data = {
            name: {
                foo: 2
            }
        };

        var result = schema.check(data);

        expect(result.valid).to.be(false);
        expect(result.errors.length).not.to.be(0);

        done();

    });
});
