/*
 * cahoots-api-services
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

var services = require('../');
var expect = require('expect.js');

describe('The service factory', function suite () {

    it('should throw an error when someone tries to create an unknown service.', function test (done) {
        try {
            services('foo');
        } catch (e) {

            expect(e).not.to.be(undefined);

            done();
        }
    });

    it('should be able to create a valid service', function test (done) {
        var personService = services('person');

        expect(personService).not.to.be(undefined);

        done();
    });
});
