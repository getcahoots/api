/*
 * cahoots-api-storage
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

var storage = require('../');

var expect = require('expect.js');

describe('The storage layer should provide an insert method', function suite () {

    it('that is able to throw an error when wrong parameters has been passed', function test (done) {
        var dao = storage('person');

        try {
            dao.insert();
        } catch (e) {
            expect(e).not.to.be(undefined);

            done();
        }
    });

    it('that is able to handle storing a data object.', function test (done) {
        var dao = storage('person');

        var andre = {
            name: 'Andre König'
        };

        function onSave (err, person) {
            expect(err).to.be(null);

            expect(person.id).not.to.be(undefined);
            expect(person.name).to.be(andre.name);

            done();
        }

        dao.insert(andre, onSave);
    });
});
