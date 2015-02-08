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

describe('The storage layer should provide a remove method', function suite () {

    it('that is able to throw an error when wrong parameters has been passed', function test (done) {
        var dao = storage('person');

        try {
            dao.remove();
        } catch (e) {
            expect(e).not.to.be(undefined);

            done();
        }
    });

    it('that is able to handle removing a data object.', function test (done) {
        var dao = storage('person');

        var andre = {
            token: Date.now()
        };

        function onSave () {
            dao.remove(andre.id, onRemove);
        }

        function onRemove (err) {
            expect(err).to.be(null);

            dao.query({token: andre.token}, onQuery);
        }

        function onQuery (err, persons) {
            expect(err).to.be(null);
            expect(persons.length).to.be(0);

            done();
        }

        dao.insert(andre, onSave);
    });

    it('that is able to deny the update of a non-existing record.', function test (done) {
        var dao = storage('person');

        var andre = {
            id: 'foo',
            name: 'André König'
        };

        function onUpdate (err) {
            expect(err).not.to.be(null);

            done();
        }

        dao.update(andre, onUpdate);
    });
});
