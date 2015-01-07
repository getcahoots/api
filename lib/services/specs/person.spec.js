/*
 * cahoots-backend-services
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

describe('The PersonService', function suite () {

    it('should be able to save a new person', function test (done) {
        var service = services('person');
        var person = {};

        person.name = 'André König';
        person.info = 'http://andrekoenig.info';

        function onSave (err, person) {
            expect(err).to.be(null);

            expect(person._id).not.to.be(undefined);
            expect(person._id.length).to.be(36);

            done();
        }

        service.save(person, onSave);
    });

    it('should be able to list all persons', function test (done) {
        var service = services('person');

        function onList (err, persons) {
            expect(err).to.be(null);

            expect(persons.length).not.to.be(0);

            done();
        }

        service.list(onList);
    });

    it('should be able to find a person by id.', function test (done) {
        var service = services('person');
        var person = {};

        person.name = 'André König';
        person.info = 'http://andrekoenig.info';

        function onSave (err, person) {
            service.find({id: person._id}, onFind);
        }

        function onFind (err, andre) {
            expect(andre._id).to.be(person._id);
            expect(andre.name).to.be(person.name);
            expect(andre.info).to.be(person.info);

            done();
        }

        service.save(person, onSave);
    });

    it('should return an empty result when the person does not exist', function test (done) {
        var service = services('person');

        function onFind (err, person) {
            expect(person).to.be(undefined);

            done();
        }

        service.find({id: 'foo'}, onFind);
    });
});
