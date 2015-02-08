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

describe('The storage layer should provide an update method', function suite () {

    it('that is able to throw an error when wrong parameters has been passed', function test (done) {
        var dao = storage('person');

        try {
            dao.update();
        } catch (e) {
            expect(e).not.to.be(undefined);

            done();
        }
    });

    it('that is able to handle updating a data object.', function test (done) {
        var dao = storage('person');

        var andre = {
            name: 'André König'
        };

        function onSave (err, person) {
            person.name = 'André R. König';

            dao.update(person, onUpdate);
        }

        function onUpdate (err, person) {
            expect(err).to.be(null);

            expect(person.id).to.be(andre.id);
            expect(person.name).to.be('André R. König');

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
            expect(err.type).to.be('NotFoundError');

            done();
        }

        dao.update(andre, onUpdate);
    });
});
