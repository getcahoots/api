/*
 * cahoots-backend-storage
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

describe('The storage layer should provide a query method', function suite () {

    it('that is able to throw an error when wrong parameters has been passed', function test (done) {
        var dao = storage('person');

        try {
            dao.query();
        } catch (e) {
            expect(e).not.to.be(undefined);

            done();
        }
    });

    it('that is able to handle a query request.', function test (done) {
        var dao = storage('person');

        var andre = {
            name: 'König'
        };

        function onSave () {
            var query = {
                name: 'König'
            };

            dao.query(query, onQuery);
        }

        function onQuery (err, results) {
            expect(err).to.be(null);

            expect(results.length).not.to.be(0);

            done();
        }

        dao.insert(andre, onSave);
    });
});
