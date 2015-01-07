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

describe('The PersonDAO ', function suite () {

    it('should be able to find all persons', function test (done) {
        var dao = daos('person');

        var person = {
            name: 'André König',
            info: 'http://andrekoenig.info'
        };

        function onInsert () {
            dao.findAll(onFind);
        }

        function onFind (err, persons) {
            expect(persons.length).not.to.be(0);

            done();
        }

        dao.insert(person, onInsert);
    });

    it('should be able to find a person by id', function test (done) {
        var dao = daos('person');

        var person = {
            name: 'André König',
            info: 'http://andrekoenig.info'
        };

        function onInsert () {
            dao.findById(person._id, onFind);
        }

        function onFind (err, andre) {

            expect(person._id).to.be(andre._id);
            expect(person.name).to.be(andre.name);
            expect(person.info).to.be(andre.info);

            done();
        }

        dao.insert(person, onInsert);
    });

    it('should return an empty response when no person with the id has been found', function test (done) {
        var dao = daos('person');

        function onFind (err, person) {
            expect(err).to.be(null);
            expect(person).to.be(undefined);

            done();
        }

        dao.findById('foo', onFind);
    });
});
