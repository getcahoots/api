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

            expect(person.id).not.to.be(undefined);

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
});
