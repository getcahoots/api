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

var fs = require('fs');
var path = require('path');

var storage = require('../');

var expect = require('expect.js');

describe('The storage layer should provide a factory that is capable', function suite () {

    var db = path.join(process.cwd(), 'database');

    it('to create a LevelDB instance', function test (done) {
        storage('foo');

        function onStat (err) {
            expect(err).to.be(null);

            done();
        }

        fs.stat(db, onStat);
    });

    it('to destroy a LevelDB instance and recreate it afterwards', function test (done) {
        storage('foo');

        function onDestroy (err) {
            expect(err).to.be(null);

            fs.stat(db, onStat);
        }

        function onStat (err) {
            expect(err).not.to.be(null);

            storage('foo');

            fs.stat(db, onCreated);
        }

        function onCreated (err) {
            expect(err).to.be(null);

            done();
        }

        storage.destroy(onDestroy);
    });
});
