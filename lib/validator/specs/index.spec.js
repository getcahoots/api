/*
 * cahoots-api-validator
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

        function onCheck (err) {
            expect(err).to.be(null);

            done();
        }

        schema.check(data, onCheck);
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

        function onCheck (err) {
            expect(err).not.to.be(null);

            done();
        }

        schema.check(data, onCheck);
    });
});
