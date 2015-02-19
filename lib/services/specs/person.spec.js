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

var utils = require('./utils');

describe('The PersonService', function suite () {

    beforeEach(utils.clearDatabase);

    it('should be able to save a new person', function test (done) {
        var service = services('person');
        var person = {};

        person.name = 'André König';
        person.info = 'http://andrekoenig.info';

        function onSave (err, person) {
            expect(err).to.be(null);

            expect(person.id).not.to.be(undefined);
            expect(person.id.length).to.be(40);
            expect(person.created).to.be(person.modified);

            done();
        }

        service.save(person, onSave);
    });

    it('should be able to update a person', function test (done) {
        var service = services('person');
        var person = {};
        var id = '';

        person.name = 'André König';
        person.info = 'http://andrekoenig.info';

        function onSave (err, pers) {
            expect(err).to.be(null);

            pers.info = 'http://caiifr.de';

            id = pers.id;

            setTimeout(function onTimeout () {
                service.save(pers, onUpdate);
            }, 1000);
        }

        function onUpdate (err, pers) {
            expect(err).to.be(null);
            expect(pers.info).to.be('http://caiifr.de');

            expect(pers.id).to.be(id);

            // Should have different timestamps
            expect(pers.created).not.to.be(pers.modified);

            service.findAll(onFindAll);
        }

        function onFindAll (err, persons) {
            expect(err).to.be(null);

            expect(persons.length).to.be(1);

            done();
        }

        service.save(person, onSave);
    });

    it('should be able to list all persons', function test (done) {
        var service = services('person');

        var person = {
            name: 'André',
            info: 'http://andrekoenig.info'
        };

        function onSave0 (err) {
            expect(err).to.be(null);

            // Delete the created id in order to create a second person.
            delete person.id;

            service.save(person, onSave1);
        }

        function onSave1 (err) {
            expect(err).to.be(null);

            service.findAll(onList);
        }

        function onList (err, persons) {
            expect(err).to.be(null);

            expect(persons.length).to.be(2);

            done();
        }

        service.save(person, onSave0);
    });

    it('should be able to find a person by id.', function test (done) {
        var service = services('person');
        var person = {};

        person.name = 'André König';
        person.info = 'http://andrekoenig.info';

        function onSave (err, person) {
            service.findById(person.id, onFind);
        }

        function onFind (err, andre) {
            expect(andre.id).to.be(person.id);
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

        service.findById('foo', onFind);
    });
});
