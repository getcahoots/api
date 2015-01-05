/*
 * cahoots-backend-daos
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

var daos = require('../');
var expect = require('expect.js');

describe('The DAO factory', function suite () {

    it('should throw an error when someone tries to create an unknown DAO.', function test (done) {
        try {
            daos('foo');
        } catch (e) {

            expect(e).not.to.be(undefined);

            done();
        }
    });

    it('should be able to create a valid DAO', function test (done) {
        var personDAO = daos('person');

        expect(personDAO).not.to.be(undefined);

        done();
    });
});
