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

var crypto = require('crypto');

var debug = require('debug')('cahoots:backend:storage');
var levelup = require('levelup');
var mandatory = require('mandatory');
var sublevel = require('level-sublevel');
var jsonquery = require('jsonquery');
var VError = require('verror');

var db = null;

module.exports = function instantiate (type) {
    var storage = null;

    mandatory(type).is('string', 'Please define a storage entity type.');

    if (!db) {
        db = levelup(process.env.CAHOOTS_DATABASE_PATH, {
            valueEncoding: 'json'
        });

        db = sublevel(db);
    }

    storage = new StorageService(type, db);

    return {
        insert: storage.insert.bind(storage),
        update: storage.update.bind(storage),
        remove: storage.remove.bind(storage),
        query: storage.query.bind(storage)
    };
};

function StorageService (type) {
    this.$type = type;
    this.$db = db.sublevel(type);
}

StorageService.prototype.$generateId = function $generateId () {
    var hrtime = process.hrtime();
    var shasum = crypto.createHash('sha1');
    var id = '';

    shasum.update([Date.now(), hrtime[0], hrtime[1]].join(''));
    id = shasum.digest('hex');

    debug('Created id: %s', id);

    return id;
};

StorageService.prototype.insert = function insert (record, callback) {
    var self = this;

    mandatory(record).is('object', 'Please provide a proper "' + this.$type + '" record.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    function onInsert (err) {
        if (err) {
            return callback(new VError(err, 'failed to insert %s: %s', self.$type, record));
        }

        callback(null, record);
    }

    record.id = this.$generateId();

    this.$db.put(record.id, record, onInsert);
};

StorageService.prototype.update = function update (record, callback) {
    var self = this;

    mandatory(record).is('object', 'Please provide a proper data record which should be updated.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    if (!record.id) {
        return process.nextTick(function onTick () {
            callback(new VError('failed to update the record. The record does not have an id.'));
        });
    }

    function onFind (err, found) {
        if (err) {
            return callback(new VError(err, 'failed to search for the record before updating it.'));
        }

        if (found.length === 0) {
            return callback(new VError('unable to update a non-existing record.'));
        }

        self.$db.put(record.id, record, onUpdate);
    }

    function onUpdate (err) {
        if (err) {
            return callback(new VError(err, 'failed to update the record.'));
        }

        callback(null, record);
    }

    this.query({id: record.id}, onFind);
};

StorageService.prototype.remove = function remove () {};

StorageService.prototype.query = function query (q, callback) {
    var results = [];

    mandatory(q).is('object', 'Please provide a proper query object.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    function onData (record) {
        results.push(record);
    }

    function onError (err) {
        callback(new VError(err, 'failed to query the storage layer.'));
    }

    function onEnd () {
        callback(null, results);
    }

    this.$db.createValueStream()
        .pipe(jsonquery(q))
        .on('data', onData)
        .once('error', onError)
        .once('end', onEnd);
};
