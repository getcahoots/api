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
            var valid = true;

            //
            // Check if all persons have the type 'person'
            //
            persons.forEach(function onIteration (person) {
                if (!valid) {
                    return;
                }

                if (person.type !== 'person') {
                    valid = false;
                }
            });

            expect(valid).to.be(true);

            done();
        }

        dao.insert(person, onInsert);
    });
});
